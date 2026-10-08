import { defineConfig } from 'vite';
export default defineConfig({ base: './', server: { host: '0.0.0.0', port: 5174, proxy: { '/api': 'http://127.0.0.1:3001', '/uploads': 'http://127.0.0.1:3001' } }, build: { target: 'es2022' } });
