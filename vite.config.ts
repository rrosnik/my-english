/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
// const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Myglish',
        short_name: 'ME',
        description: 'An App for English Learning',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
  // test: {
  //   projects: [
  //     {
  //       extends: true,
  //       plugins: [
  //         // The plugin will run tests for the stories defined in your Storybook config
  //         // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
  //         storybookTest({
  //           configDir: path.join(dirname, '.storybook'),
  //         }),
  //       ],
  //       test: {
  //         name: 'storybook',
  //         browser: {
  //           enabled: true,
  //           headless: true,
  //           provider: 'playwright',
  //           instances: [
  //             {
  //               browser: 'chromium',
  //             },
  //           ],
  //         },
  //         setupFiles: ['.storybook/vitest.setup.ts'],
  //       },
  //     },
  //   ],
  // },
});
