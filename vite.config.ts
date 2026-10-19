/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pacote from './package.json' with { type: 'json' };

/**
 * /api/dados no dev e no preview, com o mesmo código da Firebase Function (functions/src/agregador.ts), importado
 * direto em TypeScript (o Node 22.18+ remove os tipos sozinho). Sem BLUMET_MOCK busca nas fontes reais;
 * com BLUMET_MOCK=normal|alerta usa o cenário gravado em tests/fixtures/.
 */
function apiDados(): Plugin {
  const importar = (arquivo: string) => import(pathToFileURL(resolve(import.meta.dirname, arquivo)).href);
  const atender = async (_req: IncomingMessage, res: ServerResponse) => {
    try {
      const { montarDados, obterDados } = await importar('functions/src/agregador.ts');
      const cenario = process.env.BLUMET_MOCK;
      let dados;
      if (cenario) {
        const { carregarCenario } = await importar('functions/scripts/cenario.ts');
        const { brutos, agora } = carregarCenario(cenario);
        dados = { ...montarDados(brutos, agora), geradoEm: new Date().toISOString() };
      } else {
        dados = await obterDados();
      }
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(dados));
    } catch (e) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ erro: (e as Error).message }));
    }
  };
  return {
    name: 'blumet-api-dados',
    configureServer: (server) => void server.middlewares.use('/api/dados', atender),
    configurePreviewServer: (server) => void server.middlewares.use('/api/dados', atender),
  };
}

export default defineConfig({
  define: { __VERSAO__: JSON.stringify(pacote.version) },
  plugins: [
    react(),
    tailwindcss(),
    apiDados(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png', 'robots.txt'],
      manifest: {
        name: 'BLUmet: chuva, rio e alertas de Blumenau',
        short_name: 'BLUmet',
        description: 'Situação de chuva, nível do rio Itajaí-Açu, alertas por região e abrigos de Blumenau, com os dados oficiais da Defesa Civil.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b1220',
        theme_color: '#0b1220',
        categories: ['weather', 'utilities'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/(robots\.txt|sitemap\.xml)$/],
        runtimeCaching: [
          {
            // Dados: tenta a rede (até 6 s); sem rede, o último que deu certo
            urlPattern: ({ url }) => url.pathname === '/api/dados',
            handler: 'NetworkFirst',
            options: { cacheName: 'blumet-dados', networkTimeoutSeconds: 6, expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 3600 } },
          },
          {
            urlPattern: ({ url }) => url.hostname.endsWith('blumenau.sc.gov.br'),
            handler: 'CacheFirst',
            options: { cacheName: 'blumet-imagens', expiration: { maxEntries: 30, maxAgeSeconds: 30 * 24 * 3600 } },
          },
        ],
      },
    }),
  ],
  server: { port: 5373 },
  preview: { port: 5374 },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
});
