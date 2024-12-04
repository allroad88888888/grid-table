import type { RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

const defaultConfig: RollupOptions = defineConfig({
  input: './src/index.ts',
  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
    }),
    commonjs(),
    postcss({
      inject: false,
      extract: true,
    }),
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
  external: [
    'react',
    'react-dom',
    'einfach-state',
    'einfach-utils',
    '@grid-table/core',
    '@grid-table/basic',
    'clsx',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
  ],
  output: [
    // {
    //   format: 'esm',
    //   sourcemap: true,

    //   file: './dist/index.js',
    // },
    {
      plugins: [terser()],
      format: 'esm',
      file: './dist/index.min.js',
    },
    {
      format: 'es',
      sourcemap: true,
      dir: './es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
})

export default defaultConfig
