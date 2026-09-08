/**
 * WorkspaceTree — reusable multi-select workspace picker (select-all + grouped
 * accordions + per-item checkboxes with indeterminate group state). Shared by
 * the single modal's "Assign to Workspaces" block and the bulk table's per-row
 * Workspaces popover, so both stay in sync.
 *
 * Controlled: pass `selected` (Set of workspace ids) + `onChange`. Optional
 * `query` filters items by name (parents render their own search input).
 */
import { useMemo, useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Checkbox from '@floqastinc/flow-ui_core/Checkbox'
import { WORKSPACE_GROUPS, ALL_WORKSPACE_IDS } from '../../data/workspaces'

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 120ms' }}
    >
      <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WorkspaceTree({
  selected,
  onChange,
  query = '',
  maxHeight = 260,
}: {
  selected: Set<string>
  onChange: (next: Set<string>) => void
  query?: string
  maxHeight?: number
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['entities']))

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return WORKSPACE_GROUPS
    return WORKSPACE_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.name.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0)
  }, [query])

  const allChecked = selected.size === ALL_WORKSPACE_IDS.length && ALL_WORKSPACE_IDS.length > 0
  const allIndeterminate = selected.size > 0 && !allChecked

  function mutate(fn: (next: Set<string>) => void) {
    const next = new Set(selected)
    fn(next)
    onChange(next)
  }
  const toggleItem = (id: string, checked: boolean) => mutate((n) => (checked ? n.add(id) : n.delete(id)))
  const toggleGroup = (ids: string[], checked: boolean) => mutate((n) => ids.forEach((id) => (checked ? n.add(id) : n.delete(id))))
  const toggleAll = (checked: boolean) => onChange(checked ? new Set(ALL_WORKSPACE_IDS) : new Set())
  const toggleExpanded = (groupId: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })

  return (
    <div className="border border-[#e1e6ef] rounded-[6px] overflow-hidden">
      {/* Select all */}
      <div className="flex items-center gap-3 h-[50px] px-4 border-b border-[#e1e6ef]">
        <Checkbox checked={allChecked} indeterminate={allIndeterminate} onCheckedChange={(c: boolean) => toggleAll(c)} />
        <span className="text-[13px] font-medium text-[#1d2433]">Select all workspaces</span>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredGroups.length === 0 && (
          <div className="px-4 py-6 text-[13px] text-[#6b7280]">No workspaces match your search.</div>
        )}
        {filteredGroups.map((g) => {
          const itemIds = g.items.map((i) => i.id)
          const count = itemIds.filter((id) => selected.has(id)).length
          const groupChecked = count === itemIds.length && itemIds.length > 0
          const groupIndeterminate = count > 0 && !groupChecked
          const isOpen = expanded.has(g.id) || query.trim() !== ''
          return (
            <div key={g.id}>
              <div className="flex items-center gap-3 h-[50px] px-4 border-b border-[#e1e6ef]">
                <Checkbox checked={groupChecked} indeterminate={groupIndeterminate} onCheckedChange={(c: boolean) => toggleGroup(itemIds, c)} />
                <button onClick={() => toggleExpanded(g.id)} className="flex items-center justify-center w-5 h-5 shrink-0" aria-label={isOpen ? 'Collapse' : 'Expand'}>
                  <Chevron open={isOpen} />
                </button>
                <span className="text-[13px] font-semibold text-[#1d2433]">{g.label}</span>
                <span className="inline-flex items-center h-[18px] px-1.5 rounded-full bg-[#f1f3f9] text-[11px] font-semibold text-[#6b7280]">
                  {count}/{itemIds.length} Selected
                </span>
              </div>
              {isOpen &&
                g.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 h-[50px] pl-[52px] pr-4 border-b border-[#e1e6ef] last:border-b-0">
                    <Checkbox checked={selected.has(item.id)} onCheckedChange={(c: boolean) => toggleItem(item.id, c)} />
                    <span className="text-[13px] text-[#1d2433]">{item.name}</span>
                  </div>
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
