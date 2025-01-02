import { rollup } from 'rollup'
import optionList from './rollup.config.mjs'
import archiver from 'archiver'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  for (let i = 0, j = optionList.length; i < j; i += 1) {
    const bundle = await rollup(optionList[i])
    await bundle.write(optionList[i].output)
  }

  const output = fs.createWriteStream(path.join(__dirname, 'output.zip'))
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
  })
  // 监听错误事件
  archive.on('error', (err) => {
    throw err
  })

  // 将 archiver 输出流管道到文件
  archive.pipe(output)

  // 你可以使用 addFile 或 addDirectory 方法来添加文件和文件夹
  // 打包单个文件
  archive.file(path.join(__dirname, 'package.json'), { name: 'package.json' })

  // 打包整个文件夹
  archive.directory(path.join(__dirname, 'dist'), 'dist')

  // 完成打包
  archive.finalize()
}

main()
