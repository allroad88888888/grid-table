import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

/** @type {import('rollup').RollupOptions} */
const config = defineConfig({
  input: ['./src/esm/main.ts', './src/esm/workerTransformFile.ts'],
  external: ['@swc/core'],
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
    }),
    commonjs(),
    swc({
      swc: {
        minify: false,
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

  output: [
    {
      format: 'es',
      sourcemap: true,
      dir: 'dist',
    },
  ],
})

export default config
