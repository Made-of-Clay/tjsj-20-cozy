/// <reference types="vite/client" />
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    return undefined;
                },
            },
        }
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
});
