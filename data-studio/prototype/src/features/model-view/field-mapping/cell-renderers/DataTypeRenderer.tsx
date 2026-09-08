import { useState, useRef, useEffect } from 'react'
import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { FieldMapping, DataType } from '../../../../data/field-mappings'

const DATA_TYPES: DataType[] = ['String', 'Boolean', 'DateTime', 'Number']

export default function DataTypeRenderer(props: CustomCellRendererProps<FieldMapping>) {
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

  function selectType(type: DataType) {
    if (props.node) {
      props.node.setDataValue('dataType', type)
    }
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative h-full flex items-center">
      <span className="text-[12px] font-medium text-[#1d2433] leading-[16px]">{data.dataType}</span>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-36 bg-white border border-[#e1e6ef] rounded-[6px] shadow-lg py-1">
          {DATA_TYPES.map(type => (
            <button
              key={type}
              onClick={() => selectType(type)}
              className={`block w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 ${
                type === data.dataType ? 'text-[#1FAC76] font-medium' : 'text-[#1d2433]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
