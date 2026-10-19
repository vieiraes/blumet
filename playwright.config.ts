import { defineConfig, devices } from '@playwright/test';

// Testes no tamanho de celular contra o build de produção (vite preview), com os cenários gravados:
// normal em :5374 e alerta em :5376. Rode `npm run build` antes (o CI faz isso).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { locale: 'pt-BR', timezoneId: 'America/Sao_Paulo', trace: 'retain-on-failure' },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: 'BLUMET_MOCK=normal npx vite preview --port 5374 --strictPort', url: 'http://localhost:5374', reuseExistingServer: !process.env.CI },
    { command: 'BLUMET_MOCK=alerta npx vite preview --port 5376 --strictPort', url: 'http://localhost:5376', reuseExistingServer: !process.env.CI },
  ],
});
