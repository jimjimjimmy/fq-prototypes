import { useState, useRef, useEffect } from 'react'
import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { FieldMapping, SourceField } from '../../../data/field-mappings'
import { sourceFieldCatalog } from '../../../data/field-mappings'

export default function SourceFieldRenderer(props: CustomCellRendererProps<FieldMapping>) {
  const data = props.data
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (!data) return null

  const fields = data.sourceFields
  const label = fields.length === 0
    ? '—'
    : fields.length === 1
      ? fields[0].name
      : `${fields.length} fields`

  const selectedIds = new Set(fields.map(f => f.id))

  function toggleField(field: SourceField) {
    const current = data!.sourceFields
    const exists = current.find(f => f.id === field.id)
    const updated = exists
      ? current.filter(f => f.id !== field.id)
      : [...current, field]
    if (props.api && props.node) {
      props.node.setDataValue('sourceFields', updated)
    }
  }

  return (
    <div ref={ref} className="relative h-full flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[8px] px-[8px] h-[35px] rounded-[6px] border border-[#e1e6ef] bg-white text-[12px] font-medium text-[#181d1f] w-[200px] transition-colors hover:border-[#cbd2e1]"
      >
        <span className="truncate flex-1 text-left leading-[16px]">{label}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#6b7280]">
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-[#e1e6ef] rounded-[6px] shadow-lg py-1 max-h-64 overflow-auto">
          {sourceFieldCatalog.map(field => (
            <label
              key={field.id}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-[12px]"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(field.id)}
                onChange={() => toggleField(field)}
                className="rounded border-[#cbd2e1] text-[#1FAC76] focus:ring-[#1FAC76]"
              />
              <span className="text-[#1d2433]">{field.name}</span>
              <span className="text-[#6b7280] text-[10px] ml-auto">({field.dataType})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
