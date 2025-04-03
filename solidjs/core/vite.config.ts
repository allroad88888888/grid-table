import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { resolve } from 'path'

export default defineConfig({
    plugins: [solidPlugin()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
        },
    },
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
    optimizeDeps: {
        include: ['solid-js', 'solid-js/web']
    },
    esbuild: {
        jsx: 'preserve',
        jsxImportSource: 'solid-js',
    }
}) 