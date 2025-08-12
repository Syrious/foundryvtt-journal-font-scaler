import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import { resolve } from 'path';

const s_PACKAGE_ID = 'modules/journal-font-scaler';

export default defineConfig({
  root: 'src',
  base: `/${s_PACKAGE_ID}/`,
  publicDir: false,
  server: {
    port: 30001,
    open: '/game',
    proxy: {
      // Serves static files from main Foundry server.
      [`^(/${s_PACKAGE_ID}/(assets|lang|packs|style.css))`]: 'http://localhost:30000',

      // All other paths besides package ID path are served from main Foundry server.
      [`^(?!/${s_PACKAGE_ID}/)`]: 'http://localhost:30000',

      // Enable socket.io from main Foundry server.
      '/socket.io': {target: 'ws://localhost:30000', ws: true}
    }
  },
  build: {
    outDir: __dirname + "/dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        'scripts/script': resolve(__dirname, 'src/scripts/script.js'),
        'scripts/settings': resolve(__dirname, 'src/scripts/settings.js'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
      plugins: [
        copy({
          targets: [
            { src: 'module.json', dest: 'dist/' },
            { src: 'README.md', dest: 'dist/' },
            { src: 'LICENSE', dest: 'dist/' },
            { src: 'Changelog.MD', dest: 'dist/' },
            { src: 'assets/**/*', dest: 'dist/assets/' },
          ],
          hook: 'writeBundle',
        }),
      ],
    },
  },
});