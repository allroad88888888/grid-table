import type { FC } from 'react'
import { useAtomValue } from '@einfach/react'
import { getInfoAtomById } from '../Tree/atoms'

interface ContentComponentProps {
  id: string
}

/**
 * 基础内容组件 - 展示简单的文本内容
 */
export const BasicContent: FC<ContentComponentProps> = ({ id }) => {
  const info = useAtomValue(getInfoAtomById(id))

  return <span style={{ padding: '4px 8px', flex: 1, minWidth: 0 }}>{info?.name || id}</span>
}

/**
 * 丰富内容组件 - 展示带图标和操作的内容
 */
export const RichContent: FC<ContentComponentProps> = ({ id }) => {
  const info = useAtomValue(getInfoAtomById(id))

  // 基于 ID 生成稳定的状态，而不是随机
  const getStatusByID = (id: string) => {
    const hash = id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return Math.abs(hash) % 3
  }

  const status = getStatusByID(id)
  const statusIcon = status === 0 ? '✓' : status === 1 ? '○' : '◐'
  const statusColor = status === 0 ? '#52c41a' : status === 1 ? '#faad14' : '#1890ff'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        gap: '8px',
        flex: 1,
      }}
    >
      {/* 模拟图标 */}
      <span
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: id === '_ROOT' ? '#1890ff' : '#52c41a',
          borderRadius: '50%',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />

      {/* 内容 */}
      <span style={{ flex: 1, minWidth: 0 }}>{info?.name || id}</span>

      {/* 状态指示器 */}
      {id !== '_ROOT' && (
        <span
          style={{
            fontSize: '12px',
            color: statusColor,
            backgroundColor: '#f5f5f5',
            padding: '2px 6px',
            borderRadius: '4px',
            flexShrink: 0,
          }}
        >
          {statusIcon}
        </span>
      )}
    </div>
  )
}
