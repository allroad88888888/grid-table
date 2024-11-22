import { PivotSheet, type S2Options } from '@antv/s2'
import { mockS2DataConfig } from './mock'

// 添加配置
const s2Options: S2Options = {
  width: 600,
  height: 600,
}

// 渲染
export async function bootstrap() {
  const container = document.getElementById('container')!
  const s2 = new PivotSheet(container, mockS2DataConfig, s2Options)

  await s2.render()
}
