/**
 * MappingScreen — the completed entity mapping shown after the build progress.
 *
 * Layout: configured entities as top tabs, Reconciliations / Checklists filter
 * toggles + Download / Expand actions, the folder → Reconciliations / Checklist
 * tree (reused from the Close "Resolve" journey), and a primary
 * "Save and Finalize Entities" CTA pinned to the bottom.
 *
 * Tokens: brand green #1FAC76/#1C895F (active tab, checkboxes, CTA), #e1e6ef
 * borders, #1d2433 body.
 */
import { useMemo, useState } from 'react'
import type { ColDef } from '@ag-grid-community/core'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import DownloadOutlined from '@floqastinc/flow-ui_icons/material/DownloadOutlined'
// @ts-ignore
import ExpandContent from '@floqastinc/flow-ui_icons/material/ExpandContent'
import { FOLDERS, TreeCell, FlatGrid, type GridRow } from './ImpactedRecordsGrid'

export function MappingScreen({
  entities,
  onFinalize,
  finalizeLabel = 'Save and Finalize Entities',
}: {
  entities: string[]
  onFinalize?: () => void
  /** Primary CTA label. Defaults to the onboarding wording; Create Entities overrides it. */
  finalizeLabel?: string
}) {
  const tabs = entities.length ? entities : ['Entity 1']
  const [active, setActive] = useState(0)
  const [showRec, setShowRec] = useState(true)
  const [showChk, setShowChk] = useState(true)

  const allIds = useMemo(
    () => new Set(FOLDERS.flatMap((f) => [f.id, ...f.groups.map((g) => g.id)])),
    [],
  )
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allIds))

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const rows = useMemo<GridRow[]>(() => {
    const out: GridRow[] = []
    for (const f of FOLDERS) {
      const groups = f.groups.filter(
        (g) => (g.kind === 'reconciliation' && showRec) || (g.kind === 'checklist' && showChk),
      )
      const fCount = groups.reduce((n, g) => n + g.items.length, 0)
      // Folder row mirrors the screenshot's "<name> — <description>" label.
      out.push({ id: f.id, kind: 'folder', level: 0, label: `${f.label} — ${f.label}`, count: fCount })
      if (!expanded.has(f.id)) continue
      for (const g of groups) {
        out.push({ id: g.id, kind: 'group', level: 1, label: g.label, groupKind: g.kind, count: g.items.length })
        if (!expanded.has(g.id)) continue
        for (const item of g.items) out.push({ id: item.id, kind: 'leaf', level: 2, ...item })
      }
    }
    return out
  }, [expanded, showRec, showChk])

  const columnDefs = useMemo<ColDef<GridRow>[]>(
    () => [
      { colId: 'tree', headerName: 'Folder / Description', flex: 2, minWidth: 340, sortable: false, cellRenderer: TreeCell, cellRendererParams: { toggle, expanded } },
      { colId: 'frequency', headerName: 'Frequency', field: 'frequency', width: 130, sortable: false },
      { colId: 'preparer', headerName: 'Preparer', field: 'preparer', width: 230, sortable: false },
      { colId: 'preparerDue', headerName: 'Preparer Due', field: 'preparerDue', width: 140, sortable: false },
      { colId: 'reviewer', headerName: 'Reviewer', field: 'reviewer', width: 230, sortable: false },
      { colId: 'reviewerDue', headerName: 'Reviewer Due', field: 'reviewerDue', width: 140, sortable: false },
    ],
    [expanded],
  )

  return (
    <div className="h-full min-h-0 flex flex-col">
      {/* Entity tabs */}
      <div className="flex items-center gap-6 border-b border-[#e1e6ef] shrink-0">
        {tabs.map((name, i) => (
          <button
            key={name}
            onClick={() => setActive(i)}
            className={`relative py-2.5 text-[14px] font-semibold transition-colors ${
              i === active ? 'text-[#1C895F]' : 'text-[#1d2433] hover:text-[#1C895F]'
            }`}
          >
            {name}
            {i === active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1FAC76]" />}
          </button>
        ))}
      </div>

      {/* Filters + actions */}
      <div className="flex items-center justify-between py-3 shrink-0">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[13px] text-[#1d2433] cursor-pointer">
            <input type="checkbox" checked={showRec} onChange={(e) => setShowRec(e.target.checked)} className="w-4 h-4 accent-[#1FAC76]" />
            Reconciliations
          </label>
          <label className="flex items-center gap-2 text-[13px] text-[#1d2433] cursor-pointer">
            <input type="checkbox" checked={showChk} onChange={(e) => setShowChk(e.target.checked)} className="w-4 h-4 accent-[#1FAC76]" />
            Checklists
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#e1e6ef] bg-white text-[13px] font-medium text-[#1d2433] hover:bg-[#f8fafc] transition-colors">
            <DownloadOutlined size={16} color="#424867" />
            Download
          </button>
          <button
            onClick={() => setExpanded(new Set(allIds))}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#e1e6ef] bg-white text-[13px] font-medium text-[#1d2433] hover:bg-[#f8fafc] transition-colors"
          >
            <ExpandContent size={16} color="#424867" />
            Expand
          </button>
        </div>
      </div>

      {/* Mapping tree */}
      <div className="flex-1 min-h-0">
        <FlatGrid<GridRow> rowData={rows} columnDefs={columnDefs} />
      </div>

      {/* Finalize CTA */}
      <div className="shrink-0 flex justify-end pt-4">
        <Button color="primary" variant="filled" onClick={() => onFinalize?.()}>
          {finalizeLabel}
        </Button>
      </div>
    </div>
  )
}
