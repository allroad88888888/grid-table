import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

/** @type {import('rollup').RollupOptions} */
const config = defineConfig({
  input: './src/index.ts',
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
    }),
    commonjs(),
    postcss({
      plugins: [],
    }),
    swc({
      swc: {
        minify: true,
        jsc: {
          target: 'es2019',
          parser: {
            tsx: true,
            syntax: 'typescript',
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    }),
  ],
  external: [
    'react',
    'react-dom',
    'einfach-state',
    'einfach-utils',
    '@grid-table/core',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
  ],
  output: [
    {
      format: 'esm',
      sourcemap: true,
      file: './dist/index.js',
    },
    {
      plugins: [terser()],
      format: 'esm',
      file: './dist/index.mini.js',
    },
  ],
})

export default config
