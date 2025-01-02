/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
type CSSModuleClasses = Readonly<Record<string, string>>

declare module '*.module.less' {
  const classes: CSSModuleClasses
  export default classes
}

declare module '*.svg'
