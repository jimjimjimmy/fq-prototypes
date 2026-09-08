import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { FieldMapping } from '../../../../data/field-mappings'

export default function FqFieldRenderer(props: CustomCellRendererProps<FieldMapping>) {
  const data = props.data
  if (!data) return null

  return (
    <div className="flex items-center gap-[6px] h-full">
      {data.isMandatory && (
        <div className="flex items-center gap-[2px] shrink-0">
          <span className="inline-block w-[4px] h-[4px] rounded-full bg-[#1FAC76]" />
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM11 14H9V9H11V14ZM11 7H9V5H11V7Z" fill="#CBD2E1"/>
          </svg>
        </div>
      )}
      <span className="text-[12px] font-medium text-[#1d2433] leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap">{data.fqFieldName}</span>
      {data.isPrimaryKey && (
        <span className="inline-flex items-center px-[4px] py-[2px] rounded-[4px] bg-[#f0f5ff] text-[#3d7bf7] text-[10px] font-semibold leading-[14px] whitespace-nowrap shrink-0">
          Primary Key
        </span>
      )}
    </div>
  )
}
