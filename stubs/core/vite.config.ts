import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React runtime isolado — muda raramente, max cache hit.
                    'vendor-react': ['react', 'react-dom'],
                    // Inertia + roteamento.
                    'vendor-inertia': ['@inertiajs/react'],
                    // i18n separado — locale muda sem invalidar o resto.
                    'vendor-i18n': ['i18next', 'react-i18next'],
                },
            },
        },
        chunkSizeWarningLimit: 800,
    },
});
