import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
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
  // Client-side routing: a hard reload on a deep link must still serve index.html.
  appType: 'spa',
});
