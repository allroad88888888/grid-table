import './checkbox.css'
import type { PositionId } from '@grid-table/basic'
import clsx from 'clsx'
import { CheckedEnum, useRowChecked } from './useRowSelected'

export function CheckboxRender(text: string | undefined, rowInfo: any, rowPath: PositionId) {
  return <Checkbox {...rowPath} />
}

export function Checkbox({ rowId }: Partial<PositionId>) {
  const { isChecked, handChecked, disabled } = useRowChecked({ rowId })

  return (
    <>
      <input
        type="checkbox"
        name="grid-table-checkbox"
        checked={isChecked === CheckedEnum.checked}
        className={clsx('grid-table-row-selection-item', {
          'grid-table-row-selection-partially': isChecked === CheckedEnum.partiallyChecked,
        })}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onChange={() => {
          handChecked(rowId)
        }}
        disabled={disabled}
      />
    </>
  )
}
