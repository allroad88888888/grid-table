import type { Rule } from 'einfach-form'
/**
 * 模拟 FormItem
 */
export interface FormItemProps {
  name: string | number | (string | number)[]
  error?: string
  errorMsgClassName?: string
  vertical?: boolean
  showLabelTooltip?: boolean // title tooltip提示
  showErrorMsg?: boolean // 是否显示错误文案
  showWrapperError?: boolean
  label?: React.ReactNode
  required?: boolean
  children?: React.ReactNode
  className?: string
  labelCol?: Record<string, number>
  wrapperCol?: Record<string, number>
  tooltip?: React.ReactNode
  style?: any
  end?: boolean
  rules?: Rule[]
  initialValue?: any
  onReset?(value: any): void
  dataTestId?: string
  noStyle?: boolean
}
