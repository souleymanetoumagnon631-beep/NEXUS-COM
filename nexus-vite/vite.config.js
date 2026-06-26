import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    root: '.',
    base: '/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                success: resolve(__dirname, 'success.html'),
            },
        },
    },
    server: {
        port: 5173,
        host: true,
    },
});