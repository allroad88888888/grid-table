export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1
  }
  const dpr = window.devicePixelRatio
  return dpr && Number.isFinite(dpr) && dpr > 0 ? dpr : 1
}

/**
 * 将 CSS 像素值对齐到物理像素栅格。
 *
 * 在非 100% 系统缩放（DPR 非整数，如 1.25）或浏览器非 100% 缩放（如 90%）下，
 * 整数 CSS 像素映射到设备像素时会产生小数（例如 1px × 0.9 = 0.9 设备像素），
 * 浏览器对每条边界独立做亚像素舍入，相邻列共用边界但分别舍入，会产生 ±1
 * 物理像素的视觉错位。将值对齐到物理像素栅格后，相邻列共享同一边界、舍入
 * 一致，可消除累计错位。
 */
export function snapToDevicePixel(value: number, dpr: number = getDevicePixelRatio()): number {
  if (!Number.isFinite(value)) {
    return value
  }
  if (dpr === 1) {
    return Math.round(value)
  }
  return Math.round(value * dpr) / dpr
}
