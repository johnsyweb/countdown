import { defineConfig } from 'vite';

export default defineConfig({
  root: 'website',
  base: '/countdown/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

