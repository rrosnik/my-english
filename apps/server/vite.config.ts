import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/server',

  resolve: {
    alias: {
      '@': __dirname + '/src',
      '@assets': __dirname + '/src/assets',
    },
  },

  build: {
    outDir: '../../dist/apps/server',
    target: 'node18',
    sourcemap: true,
    emptyOutDir: true,
    reportCompressedSize: true,
    ssr: true,
    rollupOptions: {
      input: __dirname + '/src/main.ts',
      external: [
        // Node.js built-in modules
        'path',
        'fs',
        'os',
        'crypto',
        'http',
        'https',
        'url',
        'querystring',
        'events',
        'stream',
        'util',
        'buffer',

        // Runtime dependencies
        'express',
        'cors',

        // Any other npm packages to keep external
        // Add more as needed
      ],
      output: {
        format: 'cjs',
        entryFileNames: 'main.cjs',
        banner: '#!/usr/bin/env node',
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
