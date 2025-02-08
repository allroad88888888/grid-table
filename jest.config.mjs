// jest（单测基础包）
import fs from 'node:fs'
//  typescript转js配置（采用swc包转）
const config = JSON.parse(fs.readFileSync(`${process.cwd()}/.swcrc`, 'utf-8'))

// 引入一份ts类型，对标typescript开发体验
/** @type {import('jest').Config} */
const jestConfig = {
  // 转译配置
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config }],
  },
  transformIgnorePatterns: ['node_modules/(?!@einfach/state)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    // 如果你只需要忽略 css 导入，可以映射到一个空对象（自定义一个 __mocks__/styleMock.js 文件）
    '\\.(css|less)$': '<rootDir>/rules/empty.ts',
    // 或者，如果你需要对 CSS Modules 进行模拟，可以使用 identity-obj-proxy
    // '\\.(css|less)$': 'identity-obj-proxy'
  },

  /**
   * 运行每个测试文件之前-执行这个路径里面的内容。
   * 这里用来配置@testing-library/jest-dom，
   * 并加载其api-typescript类型补充
   */
  setupFilesAfterEnv: ['<rootDir>/rules/setup-jest.ts'],
  /**
   * 单测里面，如需要使用到dom，这里需设置为jsdom
   */
  testEnvironment: 'jsdom',
}
export default jestConfig
