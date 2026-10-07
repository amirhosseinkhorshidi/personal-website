import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ isPreview }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  // `preview` inherits nothing from `server`, so the host is repeated here.
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  // The dev server renders nothing ahead, so a hard reload on a deep link must
  // still serve index.html. The build prerenders every page to its own file
  // (projects.html for /projects), so preview serves those like production does
  // and answers an unknown path with a 404 instead of the home page.
  appType: isPreview ? 'mpa' : 'spa',
}));
