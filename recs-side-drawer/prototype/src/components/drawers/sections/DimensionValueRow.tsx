import { IconButton } from '@floqastinc/flow-ui_core'
import DeleteOutlined from '@floqastinc/flow-ui_icons/material/DeleteOutlined'
import { FormDropdownField } from '../../FormDropdownField'
import { DIMENSION_OPTIONS, DIMENSION_VALUE_OPTIONS, type FilterRow } from '../addGroupTypes'

let rowIdCounter = 0
export function nextRowId() {
  rowIdCounter += 1
  return `row-${rowIdCounter}`
}

interface DimensionValueRowProps {
  row: FilterRow
  onUpdate: (patch: Partial<FilterRow>) => void
  onRemove: () => void
}

export function DimensionValueRow({ row, onUpdate, onRemove }: DimensionValueRowProps) {
  return (
    <div className="flex gap-[16px] items-start w-full">
      <div className="flex-1 min-w-0">
        <FormDropdownField
          label="Dimension"
          placeholder="Select"
          options={DIMENSION_OPTIONS}
          value={row.dimension}
          onChange={(v) => onUpdate({ dimension: v, value: null })}
        />
      </div>
      <div className="flex-1 min-w-0">
        <FormDropdownField
          label="Value(s)"
          placeholder="Select"
          options={row.dimension ? (DIMENSION_VALUE_OPTIONS[row.dimension] ?? []) : []}
          value={row.value}
          onChange={(v) => onUpdate({ value: v })}
        />
      </div>
      <div className="flex items-end justify-center py-[2px] self-stretch shrink-0">
        <IconButton size="sm" onClick={onRemove}>
          <DeleteOutlined className="size-[20px]" />
        </IconButton>
      </div>
    </div>
  )
}
