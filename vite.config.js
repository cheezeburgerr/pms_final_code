import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // This allows Vite to be accessed from other devices
        port: 8000, // Change this if you need a specific port
        hmr: {
          host: '192.168.100.20' // Replace with your machine's local IP
        }
    }
});
