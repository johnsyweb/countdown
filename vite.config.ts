import { defineConfig } from 'vite';

export default defineConfig({
  root: 'website',
  build: {
    outDir: '../dist-website',
    emptyOutDir: true,
  },
});

