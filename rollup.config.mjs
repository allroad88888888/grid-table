import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import path, { dirname } from 'path'
import fs from 'fs-extra'
import { globSync } from 'glob'
import { fileURLToPath } from 'url'
import postcss from 'rollup-plugin-postcss'

const products = [
  'packages/core',
  'packages/tree',
  'packages/basic',
  'packages/table',
  'packages/pivot',
  'packages/excel',
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

function copy({ root, pattern, dest }) {
  const rootPath = path.resolve(root)
  const files = globSync(pattern, { cwd: rootPath, nodir: true })
  // 复制匹配到的文件
  files.forEach((file) => {
    const srcFile = path.join(rootPath, file)
    const destFile = path.join(rootPath, dest, file.replace(/^src/, ''))

    // 确保目标目录存在
    fs.ensureDirSync(path.dirname(destFile))
    // 复制文件
    fs.copySync(srcFile, destFile)
  })
}

/** @type {import('rollup').RollupOptions} */
const config = defineConfig({
  external: [
    'react',
    'react-dom',
    '@einfach/state',
    '@einfach/utils',
    '@grid-table/core',
    '@grid-table/view',
    '@grid-tree/core',
    '@grid-table/pivot',
    '@grid-table/excel',
    '@grid-table/basic',
    'clsx',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    /\.css$/,
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
  copy({
    root: dir,
    pattern: 'src/**/*.{svg,png,jpg,css,less}',
    dest: 'cjs',
  })
  copy({
    root: dir,
    pattern: 'src/**/*.{svg,png,jpg,css,less}',
    dest: 'esm',
  })

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
    ],
  }
})
