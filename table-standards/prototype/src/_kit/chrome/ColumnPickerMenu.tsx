import { useEffect, useRef, useState } from 'react'
import type { GridApi } from '@ag-grid-community/core'
import { t } from '../tokens.ts'

interface ColEntry {
  colId: string
  headerName: string
  visible: boolean
}

/**
 * Dropdown column picker — shows/hides and reorders columns without the AG Grid
 * right-rail sidebar. Opens a checkbox + drag-handle list from the toolbar,
 * keeping the grid at full width.
 */
export function ColumnPickerMenu({ api }: { api: GridApi | null }) {
  const [open, setOpen] = useState(false)
  const [cols, setCols] = useState<ColEntry[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const dragIndexRef = useRef<number | null>(null)

  // Sync column state from the grid whenever the menu opens
  useEffect(() => {
    if (!open || !api) return
    const colState = api.getColumnState()
    const colDefs = api.getColumnDefs() ?? []
    const updated = colState
      .filter((s) => s.colId !== 'ag-Grid-AutoColumn')
      .map((state) => {
        const def = colDefs.find((d: any) => d.field === state.colId || d.colId === state.colId)
        const headerName = (def as any)?.headerName ?? state.colId
        return { colId: state.colId, headerName, visible: !state.hide }
      })
    setCols(updated)
  }, [open, api])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggleCol = (colId: string, visible: boolean) => {
    if (!api) return
    api.setColumnsVisible([colId], visible)
    setCols((prev) => prev.map((c) => (c.colId === colId ? { ...c, visible } : c)))
  }

  const allVisible = cols.every((c) => c.visible)
  const toggleAll = () => {
    if (!api) return
    const next = !allVisible
    api.setColumnsVisible(cols.map((c) => c.colId), next)
    setCols((prev) => prev.map((c) => ({ ...c, visible: next })))
  }

  // Drag-to-reorder handlers
  const onDragStart = (index: number) => {
    dragIndexRef.current = index
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const from = dragIndexRef.current
    if (from === null || from === index) return
    setCols((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      dragIndexRef.current = index
      return next
    })
  }

  const onDrop = () => {
    if (!api || dragIndexRef.current === null) return
    // Apply the reordered column sequence to the grid
    cols.forEach((col, idx) => {
      api.moveColumnByIndex(api.getColumnState().findIndex((s) => s.colId === col.colId), idx)
    })
    dragIndexRef.current = null
  }

  const hasHidden = cols.some((c) => !c.visible)

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-[12px] font-medium"
        style={{
          borderColor: open || hasHidden ? t.success : t.strokeForms,
          color: open || hasHidden ? t.success : t.textBodySecondary,
          backgroundColor: t.surfaceBase,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18" />
        </svg>
        Columns
        {hasHidden && (
          <span
            className="ml-0.5 text-[10px] font-bold px-1 rounded-full"
            style={{ backgroundColor: t.success, color: '#fff' }}
          >
            {cols.filter((c) => !c.visible).length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 rounded-lg shadow-lg border overflow-hidden"
          style={{ backgroundColor: t.surfaceBase, borderColor: t.strokeForms, minWidth: 220 }}
        >
          {/* Toggle all */}
          <div
            className="px-3 py-2 flex items-center gap-2 cursor-pointer"
            style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
            onClick={toggleAll}
          >
            <Checkbox checked={allVisible} indeterminate={!allVisible && cols.some((c) => c.visible)} />
            <span className="text-[12px] font-medium" style={{ color: t.textBody }}>
              {allVisible ? 'Hide all' : 'Show all'}
            </span>
          </div>

          {/* Per-column rows — draggable */}
          <div className="py-1 max-h-64 overflow-y-auto">
            {cols.map((col, idx) => (
              <div
                key={col.colId}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={onDrop}
                className="px-2 py-1.5 flex items-center gap-2 cursor-default hover:bg-gray-50 select-none"
              >
                {/* Drag handle */}
                <span
                  className="cursor-grab shrink-0"
                  style={{ color: t.textMuted, lineHeight: 1 }}
                  title="Drag to reorder"
                >
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                    <circle cx="3" cy="2.5" r="1.2" />
                    <circle cx="7" cy="2.5" r="1.2" />
                    <circle cx="3" cy="7" r="1.2" />
                    <circle cx="7" cy="7" r="1.2" />
                    <circle cx="3" cy="11.5" r="1.2" />
                    <circle cx="7" cy="11.5" r="1.2" />
                  </svg>
                </span>

                {/* Checkbox + label */}
                <div
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => toggleCol(col.colId, !col.visible)}
                >
                  <Checkbox checked={col.visible} />
                  <span className="text-[12px]" style={{ color: t.textBody }}>
                    {col.headerName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <div
      className="w-4 h-4 rounded flex items-center justify-center shrink-0 border"
      style={{
        backgroundColor: checked || indeterminate ? t.success : t.surfaceBase,
        borderColor: checked || indeterminate ? t.success : t.strokeForms,
      }}
    >
      {indeterminate ? (
        <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
          <path d="M1 1h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : checked ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l2.5 3L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  )
}
