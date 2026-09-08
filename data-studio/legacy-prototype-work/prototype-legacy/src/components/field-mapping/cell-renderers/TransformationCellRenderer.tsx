import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { FieldMapping } from '../../../data/field-mappings'

interface TransformationCellRendererProps extends CustomCellRendererProps<FieldMapping> {
  onEditTransformation?: (mapping: FieldMapping) => void
}

export default function TransformationCellRenderer(props: TransformationCellRendererProps) {
  const data = props.data
  if (!data) return null

  const hasMultipleSourceFields = data.sourceFields.length > 1
  const hasTransformation = !!data.transformation

  // State: has transformation — show chips + edit pencil
  if (hasTransformation) {
    const parts = data.transformation!.split('|').map(s => s.trim())
    return (
      <div className="flex items-center gap-[6px] h-full">
        {parts.map((part, i) => (
          <span
            key={i}
            className="inline-flex items-center px-[4px] py-[2px] rounded-[4px] bg-[#f0f5ff] text-[10px] text-[#3d7bf7] font-semibold leading-[14px] font-mono"
          >
            {part}
          </span>
        ))}
        <button
          onClick={() => props.onEditTransformation?.(data)}
          className="ml-[4px] text-[#6b7280] hover:text-[#1d2433]"
          title="Edit transformation"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 1.75L12.25 3.5M1.75 12.25L2.33 9.92L10.08 2.17C10.31 1.94 10.69 1.94 10.92 2.17L11.83 3.08C12.06 3.31 12.06 3.69 11.83 3.92L4.08 11.67L1.75 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  // State: multiple source fields, no transformation — warning + add button
  if (hasMultipleSourceFields) {
    return (
      <div className="flex items-center gap-[8px] h-full">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d="M8 1.33L14.67 13.33H1.33L8 1.33Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0.5" strokeLinejoin="round"/>
          <path d="M8 6V9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="0.6" fill="white"/>
        </svg>
        <span className="text-[11px] text-[#424867] font-normal leading-[16px]">Transformation required when more than 1 source field is selected.</span>
        <button
          onClick={() => props.onEditTransformation?.(data)}
          className="shrink-0 flex items-center gap-[8px] border-[1.4px] border-[#cbd2e1] rounded-[6px] h-[24px] px-[6px] text-[11px] text-[#6b7280] hover:border-[#adb2bb] transition-colors whitespace-nowrap"
          style={{ fontFamily: "'Museo Sans', sans-serif", fontWeight: 700 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Add Transformation
        </button>
      </div>
    )
  }

  // State: single source, no transformation — empty cell
  return null
}
