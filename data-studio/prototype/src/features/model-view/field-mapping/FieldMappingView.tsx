import { useState, useCallback } from 'react'
import type { FieldMapping } from '../../../data/field-mappings'
import { initialFieldMappings } from '../../../data/field-mappings'
import FieldMappingTable from './FieldMappingTable'
import InlineTransformationEditor from './InlineTransformationEditor'
import TransformationWindow from './TransformationWindow'
import RunTestModal from './RunTestModal'
import PublishDialog from './PublishDialog'

// 'dropdown' and 'chat-panel' modes were used for the directed and
// conversational AI flows respectively. AI surfaces are intentionally
// disabled in this build, so those modes are no longer reachable —
// see routes.tsx and the field-mapping README for re-enablement notes.
type EditMode = 'none' | 'inline' | 'floating'

export default function FieldMappingView() {
  const [mappings, setMappings] = useState<FieldMapping[]>(initialFieldMappings)
  const [activeMapping, setActiveMapping] = useState<FieldMapping | null>(null)
  const [editMode, setEditMode] = useState<EditMode>('none')
  const [sidePanel, setSidePanel] = useState<'columns' | 'filters' | null>(null)
  const [isTestOpen, setIsTestOpen] = useState(false)
  const [isPublishOpen, setIsPublishOpen] = useState(false)

  const handleEditTransformation = useCallback((mapping: FieldMapping) => {
    setActiveMapping(mapping)
    setEditMode('floating')
  }, [])

  function handleSaveTransformation(expression: string) {
    if (!activeMapping) return
    setMappings(prev =>
      prev.map(m =>
        m.id === activeMapping.id
          ? { ...m, transformation: expression, transformationStatus: 'manual' as const }
          : m
      )
    )
    setEditMode('none')
    setActiveMapping(null)
  }

  function handleClose() {
    setEditMode('none')
    setActiveMapping(null)
  }

  function handlePopOut() {
    setEditMode('floating')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section header: Field Mapping */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e6ef]">
        <p
          className="text-[20px] font-bold text-black leading-[26px]"
          style={{ fontFamily: "'Museo Sans', sans-serif" }}
        >
          Field Mapping
        </p>
        <div className="flex items-center gap-2">
          {/* Run Test button */}
          <button
            onClick={() => setIsTestOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Run Test
          </button>
          {/* Publish button */}
          <button
            onClick={() => setIsPublishOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#186749] text-white rounded-md hover:bg-[#145a3e] transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
            Publish
          </button>
          {/* Search input */}
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="absolute left-2 top-1/2 -translate-y-1/2 text-[#adb2bb]">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-[312px] h-[40px] pl-9 pr-3 rounded-[6px] border border-[#e1e6ef] bg-white text-xs text-[#1d2433] placeholder-[#adb2bb] shadow-sm focus:outline-none focus:border-[#cbd2e1]"
            />
          </div>
          {/* Expand icon */}
          <button className="flex items-center justify-center w-[28px] h-[26px] rounded-[6px] border-[1.4px] border-[#cbd2e1] text-[#6b7280] hover:text-[#1d2433] hover:border-[#adb2bb]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 6V2H6M10 2H14V6M14 10V14H10M6 14H2V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Table + side panel tabs */}
      <div className="flex-1 px-6 py-4 overflow-auto">
        <div className="flex">
          {/* Table area */}
          <div className="flex-1 min-w-0">
            <FieldMappingTable
              rowData={mappings}
              onEditTransformation={handleEditTransformation}
            />
          </div>

          {/* Right side panel tabs — AG Grid Tool Panel */}
          <div className="flex flex-col w-[31px] shrink-0 bg-[#f8fafc] border-l border-[#e1e6ef]">
            <button
              onClick={() => setSidePanel(sidePanel === 'columns' ? null : 'columns')}
              className={`flex flex-col gap-[6px] items-center py-[12px] w-[30px] text-[13px] tracking-[0.325px] ${
                sidePanel === 'columns'
                  ? 'bg-[#f8fafc] text-[#424867]'
                  : 'bg-[#f8fafc] text-[#424867] border-l-2 border-[#f8fafc] hover:bg-[#f0f2f5]'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <rect x="2" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1"/>
                <rect x="9" y="2" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <span className="text-[13px] font-normal" style={{ writingMode: 'vertical-rl' }}>Columns</span>
            </button>
            <div className="h-px w-full bg-[#e1e6ef]" />
            <button
              onClick={() => setSidePanel(sidePanel === 'filters' ? null : 'filters')}
              className={`flex flex-col gap-[6px] items-center py-[12px] w-[30px] text-[13px] tracking-[0.325px] ${
                sidePanel === 'filters'
                  ? 'bg-[#f8fafc] text-[#424867]'
                  : 'bg-[#f8fafc] text-[#424867] border-l-2 border-[#f8fafc] hover:bg-[#f0f2f5]'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span className="text-[13px] font-normal" style={{ writingMode: 'vertical-rl' }}>Filters</span>
            </button>
          </div>
        </div>

        {/* + Add Custom Field */}
        <button className="flex items-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
          <span className="text-lg leading-none">+</span>
          Add Custom Field
        </button>
      </div>

      {/* Inline editor overlay */}
      {editMode === 'inline' && activeMapping && (
        <InlineTransformationEditor
          mapping={activeMapping}
          onSave={handleSaveTransformation}
          onClose={handleClose}
          onPopOut={handlePopOut}
        />
      )}

      {/* Floating transformation window */}
      {editMode === 'floating' && activeMapping && (
        <TransformationWindow
          mapping={activeMapping}
          onSave={handleSaveTransformation}
          onClose={handleClose}
        />
      )}

      <RunTestModal
        isOpen={isTestOpen}
        onClose={() => setIsTestOpen(false)}
        mappings={mappings}
      />

      <PublishDialog
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        mappings={mappings}
      />
    </div>
  )
}
