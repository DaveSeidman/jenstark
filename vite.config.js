import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/jen-stark',
  plugins: [
    react(),
  ],
  assetsInclude: ['**/*.glb', '**/*.hdr'],
  server: {
    port: 8080,
    host: true,
  },
});
