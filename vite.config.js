import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
  ],
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.exr'],
  server: {
    port: 8080,
    host: true,
  },
});
