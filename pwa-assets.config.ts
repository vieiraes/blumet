import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Gera os ícones do PWA a partir de public/logo.svg: npm run icones
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#0b3a5c' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#0b3a5c' } },
  },
  images: ['public/logo.svg'],
});
