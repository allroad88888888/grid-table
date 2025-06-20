/**
 * Gulp构建文件
 * 用于转译TypeScript文件，并处理样式和图片资源
 */

import fs from 'fs'
import cached from 'gulp-cached'
import yaml from 'js-yaml'
import gulp from 'gulp'
import path from 'path' // 路径处理工具
import rename from 'gulp-rename' // 文件重命名插件
import { transform } from '@swc/core'
import through2 from 'through2'

const swcConfig = JSON.parse(fs.readFileSync(`${process.cwd()}/.swcrc`, 'utf-8'))

// 解构常用的gulp函数
const { src, dest, series, watch } = gulp

// 检查环境变量是否禁用了watch功能
const isWatchDisabled =
  process.env.DISABLE_WATCH === 'true' || process.env.NODE_ENV === 'production'

// 根据环境变量决定是否实际启用watch功能
function conditionalWatch(patterns, task) {
  if (!isWatchDisabled) {
    return watch(patterns, task)
  }
  // 如果禁用了watch，则返回一个空操作
  return { close: () => {} }
}

function TsxTransform() {
  return through2.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file)
    }
    if (file.isStream()) {
      return callback(new Error('Streaming not supported'))
    }
    const content = file.contents.toString()

    transform(content, swcConfig)
      .then((res) => {
        file.contents = Buffer.from(res.code)
        this.push(file)
        callback()
      })
      .catch((err) => {
        callback(new Error(`Error transform swc: ${err.message}`))
      })
  })
}

const createTsxGenerator = (dir) => {
  const patterns = [
    path.join(dir, `src/**/*.tsx`),
    path.join(dir, `src/**/*.ts`),
    `!${path.join(dir, `src/**/*.test.tsx`)}`,
    `!${path.join(dir, `src/**/*.test.ts`)}`,
  ]
  // 返回一个命名函数，便于在gulp任务列表中识别
  function reactTask() {
    // 创建一个错误处理函数
    const handleError = (error) => {
      console.error(`Babel处理TSX文件时出错:\n${error.message}`)
      console.error(`文件: ${error.fileName || '未知'}`)
      console.error(`行号: ${error.loc ? error.loc.line : '未知'}`)

      // 如果在监视模式下，防止任务中断
      if (this.emit) {
        this.emit('end')
      }
      return Promise.reject(error)
    }

    return src(patterns)
      .pipe(cached(`${path.basename(dir)}-tsx`))
      .pipe(TsxTransform().on('error', handleError)) // 添加Babel错误处理
      .pipe(
        rename(function (path) {
          path.extname = '.js'
        }),
      )
      .pipe(dest(path.join(dir, 'esm')).on('error', handleError)) // 添加输出错误处理
  }
  reactTask.displayName = `typescript:${path.basename(dir)}`

  // 使用conditionalWatch替代直接watch
  conditionalWatch(patterns, reactTask)

  return reactTask
}

/**
 * 创建不处理内容的文件复制任务生成器
 * @param {string} dir - 源代码目录路径
 * @param {string[]} extensions - 要处理的文件扩展名数组
 * @returns {Function} - 返回复制文件的gulp任务函数
 */
const createEmptyFormatTaskGenerator = (dir, extensions) => {
  const patterns = extensions.map((ext) => path.join(dir, `src/**/*.${ext}`))
  // 返回一个命名函数，便于在gulp任务列表中识别
  function fileMoveTask() {
    // 创建一个错误处理函数
    const handleError = (error) => {
      console.error(`复制文件时出错:\n${error.message}`)
      console.error(`文件: ${error.fileName || error.file || '未知'}`)

      // 如果在监视模式下，防止任务中断
      if (this.emit) {
        this.emit('end')
      }
      return Promise.reject(error)
    }

    return src(patterns)
      .pipe(cached(`${path.basename(dir)}-fileMove-${extensions.join('-')}`))
      .pipe(dest(path.join(dir, 'esm')).on('error', handleError)) // 添加输出错误处理
  }
  fileMoveTask.displayName = `fileMove:${path.basename(dir)}-${extensions.join('-')}`

  // 使用conditionalWatch替代直接watch
  conditionalWatch(patterns, fileMoveTask)

  return fileMoveTask
}

// 读取pnpm-workspace.yaml文件
const workspaceConfig = yaml.load(fs.readFileSync('./pnpm-workspace.yaml', 'utf8'))
// 解析工作区配置中的包路径模式
const packagePatterns = workspaceConfig.packages || []

// 获取packages目录下的子目录
const products = []
packagePatterns.forEach((pattern) => {
  // 从通配符模式中提取基本目录
  const baseDir = pattern.replace('/*', '')

  // 检查目录是否存在
  if (fs.existsSync(baseDir)) {
    try {
      const subDirs = fs
        .readdirSync(baseDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path.join(baseDir, dirent.name))
      products.push(...subDirs.filter((dir) => !dir.includes('build-tools')))
    } catch (err) {
      console.error(`读取目录 ${baseDir} 失败:`, err)
    }
  } else {
    console.log(`目录 ${baseDir} 不存在，跳过`)
  }
})

/**
 * 清理项目中的类型定义文件
 * 同步删除所有项目目录下的@types.ts文件
 */
const cleanTypeFiles = () => {
  products.forEach((productPath) => {
    // 需要删除的目录/文件列表
    const targets = [
      path.join(productPath, 'dist'),
      path.join(productPath, 'esm'),
      path.join(productPath, 'cjs'),
      path.join(productPath, '@types'),
      path.join(productPath, 'tsconfig.tsbuildinfo'),
    ]

    targets.forEach((targetPath) => {
      if (fs.existsSync(targetPath)) {
        try {
          // 判断是文件还是目录
          const stat = fs.statSync(targetPath)
          if (stat.isDirectory()) {
            fs.rmSync(targetPath, { recursive: true, force: true })
            console.log(`成功删除目录: ${targetPath}`)
          } else {
            fs.unlinkSync(targetPath)
            console.log(`成功删除文件: ${targetPath}`)
          }
        } catch (err) {
          console.error(`删除 ${targetPath} 失败:`, err)
        }
      }
    })
  })
}

// 执行清理类型文件任务
cleanTypeFiles()

const tasks = []
/**
 * 动态创建所有项目的任务
 * 使用reduce遍历products数组，为每个项目创建相应的任务
 * 并设置文件监视器监控源文件变化
 */
products.forEach((item) => {
  // 为当前项目创建四种类型的任务
  const transpileTsx = createTsxGenerator(item)
  const moveStyles = createEmptyFormatTaskGenerator(item, ['css', 'less', 'scss'])
  const moveImages = createEmptyFormatTaskGenerator(item, ['jpg', 'png', 'gif', 'svg', 'json'])

  // 将当前项目的任务添加到累加器中
  tasks.push(transpileTsx, moveStyles, moveImages)
})

/**
 * 默认任务
 * 串行执行所有项目的所有任务
 * 使用展开运算符...将tasks数组展开为参数列表
 */
export default tasks.length > 0 ? series(...tasks) : (done) => done()
