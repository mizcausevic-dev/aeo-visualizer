import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// GitHub Pages serves this app at /aeo-visualizer/ on a project page.
// Setting `base` lets Vite emit correct asset paths in the built bundle.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/aeo-visualizer/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
