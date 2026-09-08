import { useState, useRef, useEffect, useMemo } from 'react'
import { Maximize2, MoreVertical, X, Download, Upload, Sliders, Plus } from 'lucide-react'
import Button from '@floqastinc/flow-ui_core/Button'
import Input from '@floqastinc/flow-ui_core/Input'
import Toggle from '@floqastinc/flow-ui_core/Toggle'
import Modal from '@floqastinc/flow-ui_core/Modal'
import { RollupTree } from './RollupTree'
import type { MappedAccount, RollupNode } from '../types'
import type { AccountTab } from './MappingPane'

interface RollupPaneProps {
  nodes: RollupNode[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, name: string) => void
  onAddChild: (parentId: string) => void
  onAddSiblingAbove: (siblingId: string) => void
  onAddSibling: (siblingId: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onIndent: (id: string) => void
  onOutdent: (id: string) => void
  onChangeLevel: (id: string, newLevel: number) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onMove: (sourceId: string, targetId: string, mode: 'before' | 'after') => void
  countsByDestination: Record<string, number>
  accountsByDestination: Record<string, MappedAccount[]>
  onClose?: () => void
  onMaximize?: () => void
  accountTab?: AccountTab
  selectedAccountId?: string | null
  onSelectAccount?: (accountId: string) => void
  levelNames?: Record<number, string>
  onLevelNamesChange?: (next: Record<number, string>) => void
  pendingFocusId?: string | null
  onClearPendingFocus?: () => void
}

function collectAllIds(nodes: RollupNode[], acc: Set<string> = new Set()): Set<string> {
  for (const n of nodes) {
    acc.add(n.id)
    if (n.children) collectAllIds(n.children, acc)
  }
  return acc
}

export function RollupPane({ nodes, selectedId, onSelect, onRename, onAddChild, onAddSiblingAbove, onAddSibling, onDuplicate, onDelete, onIndent, onOutdent, onChangeLevel, onMoveUp, onMoveDown, onMove, countsByDestination, accountsByDestination, onClose, onMaximize, accountTab = 'all', selectedAccountId = null, onSelectAccount, levelNames = {}, onLevelNamesChange, pendingFocusId, onClearPendingFocus }: RollupPaneProps) {
  const [levelModalOpen, setLevelModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => collectAllIds(nodes))
  const [showAccounts, setShowAccounts] = useState<boolean>(() => {
    return localStorage.getItem('fdm-rollup:showAccounts') === 'true'
  })
  useEffect(() => {
    localStorage.setItem('fdm-rollup:showAccounts', String(showAccounts))
  }, [showAccounts])

  // Mapping rules can scope to inactive accounts (e.g. a rule covering a
  // historical sub-ledger), so the hierarchy needs to surface those mappings.
  // The account row already renders an "Inactive" badge when isActive === false,
  // so we pass every mapped account through unfiltered and let the row mark them.
  const filteredCountsByDestination = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const id in accountsByDestination) {
      counts[id] = accountsByDestination[id].length
    }
    return counts
  }, [accountsByDestination])

  const allIds = collectAllIds(nodes)
  const isAllExpanded = allIds.size > 0 && [...allIds].every(id => expanded.has(id))
  const expandAll = () => setExpanded(collectAllIds(nodes))
  const collapseAll = () => setExpanded(new Set())
  const toggleExpandAll = () => isAllExpanded ? collapseAll() : expandAll()

  return (
    <section className="relative flex flex-col h-full bg-white overflow-hidden">
      {/* Title + actions */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h3 className="text-[16px] font-bold text-[#1d2433]">Hierarchy</h3>
        </div>
        <div className="flex items-center gap-2">
          <StructureOverflowMenu onOpenLevelManagement={() => setLevelModalOpen(true)} />
          {onMaximize && (
            <button onClick={onMaximize} title="Maximize" className="text-[#adb2bb] hover:text-[#424867]">
              <Maximize2 size={14} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Close" className="text-[#adb2bb] hover:text-[#424867]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search + show-accounts toggle + expand/collapse button */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 px-4 pb-3 shrink-0">
        <div className="w-[300px] shrink-0">
          <Input
            type="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search for..."
            isSearchable
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center whitespace-nowrap shrink-0">
            <Toggle
              checked={showAccounts}
              onChange={() => setShowAccounts(v => !v)}
              label="Show Accounts"
              size="sm"
            />
          </div>
          <Button
            variant="outlined"
            color="dark"
            size="lg"
            onClick={toggleExpandAll}
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto">
        <RollupTree
          nodes={nodes}
          selectedId={selectedId}
          onSelect={onSelect}
          onRename={onRename}
          onAddChild={onAddChild}
          onAddSiblingAbove={onAddSiblingAbove}
          onAddSibling={onAddSibling}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onIndent={onIndent}
          onOutdent={onOutdent}
          onChangeLevel={onChangeLevel}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMove={onMove}
          expanded={expanded}
          setExpanded={setExpanded}
          searchQuery={query}
          countsByDestination={filteredCountsByDestination}
          accountsByDestination={accountsByDestination}
          showAccounts={showAccounts}
          accountTab={accountTab}
          selectedAccountId={selectedAccountId}
          onSelectAccount={onSelectAccount}
          levelNames={levelNames}
          pendingFocusId={pendingFocusId}
          onClearPendingFocus={onClearPendingFocus}
        />
      </div>

      <LevelManagementModal
        open={levelModalOpen}
        onOpenChange={setLevelModalOpen}
        levelNames={levelNames}
        onSave={(next) => {
          onLevelNamesChange?.(next)
          setLevelModalOpen(false)
        }}
        nodes={nodes}
      />
    </section>
  )
}

function getMaxDepth(nodes: RollupNode[]): number {
  let max = 1
  const walk = (ns: RollupNode[], depth: number) => {
    for (const n of ns) {
      if (depth > max) max = depth
      if (n.children) walk(n.children, depth + 1)
    }
  }
  walk(nodes, 1)
  return max
}

function LevelManagementModal({
  open,
  onOpenChange,
  levelNames,
  onSave,
  nodes,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelNames: Record<number, string>
  onSave: (next: Record<number, string>) => void
  nodes: RollupNode[]
}) {
  const MAX_LEVELS = 15
  const [draft, setDraft] = useState<Record<number, string>>({})
  // Number of level rows currently shown. Grows when the user clicks "+ Add level".
  const [visibleCount, setVisibleCount] = useState<number>(1)

  // Reset draft + visible count when the modal opens so cancel discards uncommitted edits.
  useEffect(() => {
    if (open) {
      setDraft({ ...levelNames })
      // Initialize at the deepest of: tree depth, highest named level, or 1
      const treeDepth = getMaxDepth(nodes)
      const namedDepth = Math.max(0, ...Object.keys(levelNames).map((k) => Number(k)))
      setVisibleCount(Math.min(MAX_LEVELS, Math.max(1, treeDepth, namedDepth)))
    }
  }, [open, levelNames, nodes])

  const updateLevel = (level: number, value: string) =>
    setDraft((prev) => ({ ...prev, [level]: value }))

  const canAddMore = visibleCount < MAX_LEVELS

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" onClick={() => {}}>
      <Modal.Header>Level Management</Modal.Header>
      <Modal.Body>
        <p className="text-[12px] text-[#6b7280] mb-4">
          Name each level of your hierarchy. These labels appear on each node's level badge. Up to {MAX_LEVELS} levels supported.
        </p>
        <ul className="flex flex-col gap-3">
          {Array.from({ length: visibleCount }, (_, i) => i + 1).map((level) => (
            <li key={level} className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center min-w-[36px] h-6 px-2 rounded text-[11px] font-semibold bg-[#e1e6ef] text-[#424867]">
                L{level}
              </span>
              <div className="flex-1">
                <Input
                  value={draft[level] ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLevel(level, e.target.value)}
                  placeholder={`Level ${level} name`}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Button
            variant="ghost"
            color="dark"
            size="sm"
            disabled={!canAddMore}
            onClick={() => setVisibleCount((c) => Math.min(MAX_LEVELS, c + 1))}
          >
            <Plus size={12} strokeWidth={2.5} />
            Add level
          </Button>
          {!canAddMore && (
            <span className="ml-2 text-[11px] text-[#6b7280]">
              Maximum {MAX_LEVELS} levels reached
            </span>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outlined" color="dark" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="filled" color="primary" onClick={() => onSave(draft)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function StructureOverflowMenu({ onOpenLevelManagement }: { onOpenLevelManagement?: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        title="More actions"
        className="inline-flex items-center justify-center w-8 h-8 rounded text-[#adb2bb] hover:text-[#424867]"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white border border-[#e1e6ef] rounded-md shadow-lg py-1 text-[12px]">
          <OverflowItem icon={<Download size={14} />} label="Download" onClick={() => setOpen(false)} />
          <OverflowItem icon={<Upload size={14} />} label="Upload" onClick={() => setOpen(false)} />
          <OverflowItem
            icon={<Sliders size={14} />}
            label="Level Management"
            onClick={() => { setOpen(false); onOpenLevelManagement?.() }}
          />
        </div>
      )}
    </div>
  )
}

function OverflowItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-[#1d2433] hover:bg-[#f8fafc]">
      <span className="text-[#6b7280]">{icon}</span>
      {label}
    </button>
  )
}
