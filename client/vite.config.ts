import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 开发时前端 5173,通过代理把 /api 转到后端 3001(同源,session Cookie 生效)
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
