import type { DataConfig } from '@grid-table/pivot'
import { Pivot } from '@grid-table/pivot'
import type { Theme } from '@grid-table/pivot/@types/theme/types'
import { useMemo } from 'react'
import { getOptionAtomById } from '@deepfos/ux-state'
import { useAtomValue } from 'jotai'
import '@grid-table/pivot/esm/index.css'

export default function UxPivot({ id, scope, ...props }: { scope: string; id: string }) {
  const option = useAtomValue(getOptionAtomById(id), scope)
  const { json, theme: themeJson } = option.config

  const dataConfig = useMemo(() => {
    if (!json) {
      return undefined
    }
    try {
      JSON.parse(json)
    } catch (error) {
      return undefined
    }
    return JSON.parse(json) as DataConfig
  }, [json])

  const theme = useMemo(() => {
    if (!themeJson) {
      return undefined
    }
    try {
      JSON.parse(themeJson)
    } catch (error) {
      return undefined
    }
    return JSON.parse(themeJson) as Theme
  }, [themeJson])

  if (!dataConfig) {
    return <>暂无数据</>
  }

  return (
    <Pivot
      dataConfig={dataConfig}
      style={{
        width: '100%',
        height: '100%',
      }}
      theme={theme}
    />
  )
}
