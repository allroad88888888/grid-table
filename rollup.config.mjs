import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'

const products = [
  'packages/core',
  'packages/tree',
  'packages/basic',
  'packages/table',
  'packages/pivot',
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputDirList = ['esm', 'cjs', 'dist']
products.forEach((pName) => {
  outputDirList.forEach((output) => {
    const outputDir = path.resolve(__dirname, pName, output)
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true })
    }
  })
})

/** @type {import('rollup').RollupOptions} */
const config = defineConfig({
  external: [
    'react',
    'react-dom',
    'einfach-state',
    'einfach-utils',
    '@grid-table/core',
    '@grid-table/view',
    '@grid-tree/core',
    '@grid-table/pivot',
    '@grid-table/basic',
    'clsx',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
  ],

  plugins: [
    resolve({
      extensions: ['.ts', '.tsx', '.css'],
    }),

    postcss({
      inject: false,
      extract: true,
    }),
    swc({
      swc: {
        minify: false,
        jsc: {
          target: 'esnext',
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
})

/** @type {import('rollup').RollupOptions} */
export default products.map((dir) => {
  /** @type {import('rollup').RollupOptions} */
  return {
    ...config,
    input: `${dir}/src/index.ts`,
    treeshake: false,
    output: [
      {
        format: 'commonjs',
        dir: `${dir}/cjs`,
        entryFileNames: '[name].js',
        preserveModules: true, // 保留模块结构
        preserveModulesRoot: 'src', // 去掉 src 的根路径
      },
      {
        format: 'es',
        dir: `${dir}/esm`,
        entryFileNames: '[name].mjs',
        preserveModules: true, // 保留模块结构
        preserveModulesRoot: 'src', // 去掉 src 的根路径
      },
      {
        format: 'commonjs',
        dir: `${dir}/dist`,
        plugins: [terser()],
        entryFileNames: '[name].js',
        preserveModulesRoot: 'src', // 去掉 src 的根路径
      },
    ],
  }
})
