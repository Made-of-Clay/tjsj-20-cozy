/// <reference types="vite/client" />
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext',
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
});
