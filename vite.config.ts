import { defineConfig } from 'vite';

export default defineConfig({
  root: 'website',
  base: '/countdown/',
  build: {
    outDir: '../dist-website',
    emptyOutDir: true,
  },
});

