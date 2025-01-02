import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'

const products = ['src/use.tsx', 'src/edit.tsx', 'src/option.tsx']

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputDirList = ['es', 'cjs', 'dist']
products.forEach((pName) => {
  outputDirList.forEach((output) => {
    const outputDir = path.resolve(__dirname, pName, output)
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true })
    }
  })
})

const mvFiles = ['data.json', 'icon.svg']
mvFiles.forEach((pName) => {
  fs.copyFileSync(path.resolve(__dirname, 'src', pName), path.resolve(__dirname, 'dist', pName))
})

/** @type {import('rollup').RollupOptions} */
const config = defineConfig({
  external: [
    'react',
    'react-dom',
    'clsx',
    '@deepfos/ux-state',
    '@deepfos/ux-utils',
    '@deepfos/ux-view',
    'jotai',
    'ux:jotai',
  ],

  plugins: [
    resolve({
      extensions: ['.ts', '.tsx'],
    }),

    commonjs(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }),
    postcss({}),
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
              //   runtime: 'classic',
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
    input: `${dir}`,
    treeshake: false,
    output: {
      format: 'systemjs',
      dir: `./dist`,
      sourcemap: true,
      // plugins: [terser()],
      entryFileNames: '[name].js',
      preserveModulesRoot: 'src', // 去掉 src 的根路径
      paths: {
        jotai: 'ux:jotai',
      },
    },
  }
})
