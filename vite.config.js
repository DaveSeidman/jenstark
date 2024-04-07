import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    cssCodeSplit: false
  },
  assetsInclude: ['**/*.glb', '**/*.hdr'],
  server: {
    port: 8080,
    host: true,
  },
});
