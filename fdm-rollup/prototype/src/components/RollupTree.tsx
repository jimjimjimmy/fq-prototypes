import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight as IndentRight,
  GripVertical,
  MoreVertical,
  Plus,
  CornerDownRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  AlertTriangle,
} from 'lucide-react'
// AccountTree icon (Material Design) — not in FlowUI icons package, inlined as SVG
function AccountTreeIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14V12H7.33333V5.33333H6V7.33333H1.33333V2H6V4H10V2H14.6667V7.33333H10V5.33333H8.66667V10.6667H10V8.66667H14.6667V14H10ZM11.3333 6H13.3333V3.33333H11.3333V6ZM11.3333 12.6667H13.3333V10H11.3333V12.6667ZM2.66667 6H4.66667V3.33333H2.66667V6Z" />
    </svg>
  )
}
import TableStatusBadge from '@floqastinc/flow-ui_core/TableStatusBadge'
import Checkbox from '@floqastinc/flow-ui_core/Checkbox'
import Input from '@floqastinc/flow-ui_core/Input'
import Button from '@floqastinc/flow-ui_core/Button'
import Modal from '@floqastinc/flow-ui_core/Modal'
import Tooltip from '@floqastinc/flow-ui_core/Tooltip'
import Select from '@floqastinc/flow-ui_core/Select'
import type { MappedAccount, RollupNode } from '../types'
import { getRuleName } from '../data/sample-mappings'
import type { AccountTab } from './MappingPane'

interface RollupTreeProps {
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
  expanded: Set<string>
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>
  searchQuery: string
  countsByDestination: Record<string, number>
  accountsByDestination: Record<string, MappedAccount[]>
  showAccounts: boolean
  accountTab?: AccountTab
  selectedAccountId?: string | null
  onSelectAccount?: (accountId: string) => void
  levelNames?: Record<number, string>
  pendingFocusId?: string | null
  onClearPendingFocus?: () => void
}

export function RollupTree({ nodes, selectedId, onSelect, onRename, onAddChild, onAddSiblingAbove, onAddSibling, onDuplicate, onDelete, onIndent, onOutdent, onChangeLevel, onMoveUp, onMoveDown, onMove, expanded, setExpanded, searchQuery, countsByDestination, accountsByDestination, showAccounts, accountTab = 'all', selectedAccountId = null, onSelectAccount, levelNames = {}, pendingFocusId, onClearPendingFocus }: RollupTreeProps) {
  // Accounts selected via checkbox in the inline sub-rows
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set())
  // Modal interaction state — floating bar appears when accounts are selected;
  // Assign opens the reassign picker modal; Clear Mapping opens the confirmation modal.
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [reassignTargetId, setReassignTargetId] = useState<string | null>(null)
  const [clearMappingModalOpen, setClearMappingModalOpen] = useState(false)
  // Controlled open-state for the Assign-to Select so we can force-close
  // it the moment the user picks a destination (single-select mode shouldn't
  // leave the dropdown open after a choice is made).
  const [reassignSelectOpen, setReassignSelectOpen] = useState(false)

  // Flattened destination list for the reassign Select. Indents each option
  // label with non-breaking spaces so the dropdown reflects hierarchy depth
  // even though Select renders a flat list.
  const reassignDestinationOptions = useMemo(() => {
    const flat: { id: string; label: string }[] = []
    const walk = (node: RollupNode, depth: number) => {
      flat.push({
        id: node.id,
        label: '    '.repeat(depth) + node.name,
      })
      if (node.children) for (const c of node.children) walk(c, depth + 1)
    }
    for (const n of nodes) walk(n, 0)
    return flat
  }, [nodes])

  // Total accounts under each node (direct + descendants). Used to show
  // a rolled-up count on parent rows.
  const rollupCounts = useMemo(() => {
    const result: Record<string, number> = {}
    const walk = (node: RollupNode): number => {
      let total = countsByDestination[node.id] ?? 0
      if (node.children) for (const child of node.children) total += walk(child)
      result[node.id] = total
      return total
    }
    for (const node of nodes) walk(node)
    return result
  }, [nodes, countsByDestination])

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((prev) => {
      const next = new Set(prev)
      next.has(accountId) ? next.delete(accountId) : next.add(accountId)
      return next
    })
  }

  // Called when an "Apply" button is clicked on any node.
  // In a real implementation this would reassign the selected accounts to nodeId.
  // For the prototype we just clear the selection.
  const applyToNode = (_nodeId: string) => {
    setSelectedAccountIds(new Set())
  }

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddChild = (parentId: string) => {
    setExpanded((prev) => new Set([...prev, parentId]))
    onAddChild(parentId)
  }

  const matches = (node: RollupNode): boolean => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (node.name.toLowerCase().includes(q)) return true
    return node.children?.some(matches) ?? false
  }

  return (
    <div className="flex flex-col">
      <ul role="tree" className="flex-1">
        {/* Unassigned section — top, only when accounts exist */}
        {showAccounts && (accountsByDestination['unassigned']?.length ?? 0) > 0 && (
          <SpecialSection
            label="Unassigned"
            accounts={accountsByDestination['unassigned']!}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={toggleAccount}
            accountTab={accountTab}
            selectedAccountId={selectedAccountId ?? null}
            onSelectAccount={onSelectAccount}
          />
        )}

        {(() => {
          const visible = nodes.filter(matches)
          return visible.map((node, idx) => (
            <TreeRow
              key={node.id}
              node={node}
              depth={0}
              indexInSiblings={idx}
              siblingCount={visible.length}
              expanded={expanded}
              onToggle={toggle}
              selectedId={selectedId}
              onSelect={onSelect}
              onRename={onRename}
              onAddChild={handleAddChild}
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
              searchQuery={searchQuery}
              matches={matches}
              countsByDestination={countsByDestination}
              accountsByDestination={accountsByDestination}
              rollupCounts={rollupCounts}
              showAccounts={showAccounts}
              selectedAccountIds={selectedAccountIds}
              onToggleAccount={toggleAccount}
              onApplyToNode={applyToNode}
              accountTab={accountTab}
              selectedAccountId={selectedAccountId}
              onSelectAccount={onSelectAccount}
              levelNames={levelNames}
              pendingFocusId={pendingFocusId}
              onClearPendingFocus={onClearPendingFocus}
            />
          ))
        })()}

        {/* Do Not Map section — bottom, only when accounts exist */}
        {showAccounts && (accountsByDestination['do-not-map']?.length ?? 0) > 0 && (
          <SpecialSection
            label="Do Not Map"
            accounts={accountsByDestination['do-not-map']!}
            selectedAccountIds={selectedAccountIds}
            onToggleAccount={toggleAccount}
            accountTab={accountTab}
            selectedAccountId={selectedAccountId ?? null}
            onSelectAccount={onSelectAccount}
          />
        )}
      </ul>

      {/* Floating action bar — appears when account checkboxes are selected. */}
      {selectedAccountIds.size > 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 inline-flex items-center gap-3 rounded-lg bg-[#1d2433] text-white shadow-lg px-4 py-2.5"
          role="status"
          aria-live="polite"
        >
          {/* Count chip */}
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-white/20 px-1.5 text-[11px] font-semibold tabular-nums">
            {selectedAccountIds.size}
          </span>
          <span className="text-[13px]">
            {selectedAccountIds.size === 1 ? 'Account' : 'Accounts'} Selected
          </span>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={() => setClearMappingModalOpen(true)}
            className="text-[12px] text-white/80 hover:text-white"
          >
            Clear Mapping
          </button>
          <Button
            variant="filled"
            color="primary"
            size="sm"
            onClick={() => {
              setReassignTargetId(null)
              setReassignSelectOpen(false)
              setReassignModalOpen(true)
            }}
          >
            Assign
          </Button>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={() => setSelectedAccountIds(new Set())}
            className="flex items-center justify-center text-white/60 hover:text-white"
            aria-label="Dismiss selection"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Modal: pick a destination from the hierarchy */}
      <Modal
        open={reassignModalOpen}
        onOpenChange={(open: boolean) => setReassignModalOpen(open)}
        size="sm"
        onClick={() => {}}
      >
        <Modal.Header>Assign</Modal.Header>
        <Modal.Body>
          <label className="block text-[13px] font-medium text-[#1d2433] mb-1.5">
            Assign to
          </label>
          {/* Width wrapper so the Select's trigger fills the modal body —
              gives `justify-content: space-between` on the DropdownButton
              real room to push the chevron all the way to the right. */}
          <div style={{ width: '100%' }}>
            <Select
              selectionMode="single"
              filterPlaceholder="Search"
              // Only set buttonLabel when nothing is selected — otherwise it
              // would override the selected option's label.
              buttonLabel={reassignTargetId ? undefined : 'Select Destination'}
              value={reassignTargetId ?? ''}
              isOpen={reassignSelectOpen}
              onOpenChange={setReassignSelectOpen}
              onChange={(value: string | null) => {
                setReassignTargetId(value)
                // Auto-close after a destination is picked. FlowUI Select
                // doesn't do this by default.
                setReassignSelectOpen(false)
              }}
              options={[
                { label: 'Do Not Map', value: 'unassigned' },
                ...reassignDestinationOptions.map((d) => ({
                  label: d.label,
                  value: d.id,
                })),
              ]}
              // Match the dropdown menu width to the trigger's width. Radix
              // exposes the trigger width as a CSS custom property so the
              // portaled popover can mirror it exactly.
              contentWidth="var(--radix-popover-trigger-width)"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="dark" onClick={() => setReassignModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="primary"
            disabled={!reassignTargetId}
            onClick={() => {
              if (!reassignTargetId) return
              applyToNode(reassignTargetId)
              setReassignModalOpen(false)
            }}
          >
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: confirm clearing the mapping for selected accounts */}
      <Modal
        open={clearMappingModalOpen}
        onOpenChange={(open: boolean) => setClearMappingModalOpen(open)}
        size="sm"
        onClick={() => {}}
      >
        <Modal.Header>
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#f59e0b] shrink-0" />
            Clear Mapping
          </span>
        </Modal.Header>
        <Modal.Body>
          <p className="text-[13px] text-[#424867]">
            Clearing this field will remove the destination mapping and update the status to "Unassigned". Do you wish to continue?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="dark" onClick={() => setClearMappingModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="warning"
            onClick={() => {
              setSelectedAccountIds(new Set())
              setClearMappingModalOpen(false)
            }}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

interface TreeRowProps {
  node: RollupNode
  depth: number
  indexInSiblings: number
  siblingCount: number
  expanded: Set<string>
  onToggle: (id: string) => void
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
  searchQuery: string
  matches: (n: RollupNode) => boolean
  countsByDestination: Record<string, number>
  accountsByDestination: Record<string, MappedAccount[]>
  rollupCounts: Record<string, number>
  showAccounts: boolean
  selectedAccountIds: Set<string>
  onToggleAccount: (accountId: string) => void
  onApplyToNode: (nodeId: string) => void
  accountTab?: AccountTab
  selectedAccountId?: string | null
  onSelectAccount?: (accountId: string) => void
  levelNames?: Record<number, string>
  pendingFocusId?: string | null
  onClearPendingFocus?: () => void
}

function TreeRow({ node, depth, indexInSiblings, siblingCount, expanded, onToggle, selectedId, onSelect, onRename, onAddChild, onAddSiblingAbove, onAddSibling, onDuplicate, onDelete, onIndent, onOutdent, onChangeLevel, onMoveUp, onMoveDown, onMove, searchQuery, matches, countsByDestination, accountsByDestination, rollupCounts, showAccounts, selectedAccountIds, onToggleAccount, onApplyToNode, accountTab = 'all', selectedAccountId = null, onSelectAccount, levelNames = {}, pendingFocusId, onClearPendingFocus }: TreeRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(node.name)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropZone, setDropZone] = useState<'before' | 'after' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const canIndent = indexInSiblings > 0 && node.level < 5
  const canOutdent = depth > 0
  const canMoveUp = indexInSiblings > 0
  const canMoveDown = indexInSiblings < siblingCount - 1
  const hasSelection = selectedAccountIds.size > 0

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  useEffect(() => {
    if (pendingFocusId === node.id) {
      setDraft(node.name)
      setEditing(true)
      onClearPendingFocus?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFocusId])

  const startEdit = () => {
    setDraft(node.name)
    setEditing(true)
  }
  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== node.name) onRename(node.id, trimmed)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(node.name)
    setEditing(false)
  }

  const hasChildren = !!node.children?.length
  const isOpen = expanded.has(node.id) || (!!searchQuery && hasChildren)
  const isSelected = selectedId === node.id
  // Direct count for leaves; rolled-up sum for parents.
  const count = hasChildren ? rollupCounts[node.id] ?? 0 : countsByDestination[node.id] ?? 0

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', node.id)
          e.dataTransfer.effectAllowed = 'move'
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          const offsetY = e.clientY - rect.top
          setDropZone(offsetY < rect.height / 2 ? 'before' : 'after')
        }}
        onDragLeave={() => setDropZone(null)}
        onDrop={(e) => {
          e.preventDefault()
          const sourceId = e.dataTransfer.getData('text/plain')
          const mode = dropZone
          setDropZone(null)
          if (sourceId && mode && sourceId !== node.id) onMove(sourceId, node.id, mode)
        }}
        className={`relative group flex items-center gap-2 px-2 py-[3px] cursor-pointer text-[13px] ${
          isSelected ? 'bg-[#f1f3f9]' : 'hover:bg-[#f1f3f9]'
        } ${dropZone === 'before' ? "before:absolute before:-top-px before:left-0 before:right-0 before:h-0.5 before:bg-[#1fac76] before:z-10" : ''} ${
          dropZone === 'after' ? "after:absolute after:-bottom-px after:left-0 after:right-0 after:h-0.5 after:bg-[#1fac76] after:z-10" : ''
        }`}
        onClick={() => onSelect(node.id)}
      >
        {/* Drag handle */}
        <span
          className="flex items-center justify-center w-5 h-full text-[#cbd2e1] group-hover:text-[#6b7280] cursor-grab"
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </span>

        {/* Indent spacer — 24px per level, placed before chevron so chevron indents with depth */}
        <div style={{ width: depth * 24 }} />

        {/* Expand chevron */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) onToggle(node.id)
          }}
          className="flex items-center justify-center w-5 h-full text-[#6b7280]"
        >
          {hasChildren ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
        </button>

        {/* Level dropdown — tooltip shows the level name when one is configured */}
        <Tooltip>
          <Tooltip.Trigger>
            <span className="shrink-0 flex items-center">
              <select
                value={node.level}
                onChange={(e) => {
                  e.stopPropagation()
                  const target = Number(e.target.value)
                  if (target !== node.level) onChangeLevel(node.id, target)
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flo-sem-color-border-input-focus)'
                  e.currentTarget.style.boxShadow = 'var(--flo-sem-shadow-focus-outline)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--flo-sem-color-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                style={{
                  flexShrink: 0,
                  height: '40px',
                  padding: '0 8px',
                  fontSize: '11px',
                  fontFamily: 'var(--flo-sem-font-family-body)',
                  color: 'var(--flo-sem-color-text-body-secondary)',
                  backgroundColor: 'var(--flo-sem-color-surface-neutral-base)',
                  border: '1px solid var(--flo-sem-color-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {[1, 2, 3, 4, 5].map((l) => (
                  <option key={l} value={l}>{`L${l}`}</option>
                ))}
              </select>
            </span>
          </Tooltip.Trigger>
          {levelNames[node.level] && (
            <Tooltip.Content side="top" size="sm">{levelNames[node.level]}</Tooltip.Content>
          )}
        </Tooltip>

        {/* Name — FlowUI Input, always editable */}
        <div
          className="flex-1 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            value={draft}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              else if (e.key === 'Escape') cancel()
            }}
            inputRef={inputRef}
          />
        </div>

        {/* Count + kebab grouped on the right */}
        <div className="flex items-center shrink-0">
        {/* Row menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="flex items-center justify-center w-6 h-6 text-[#adb2bb] hover:text-[#424867] hover:bg-[#f1f3f9] rounded"
            title="More actions"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen(false)
                }}
              />
              {/* FlowUI dropdown panel:
                   - bg surface-neutral-base (#fff) + border #e1e6ef (neutral-300)
                   - shadow var(--flo-base-shadow-panel) — subtle 1px elevation
                   - 6px radius, 6px vertical padding around items
                 */}
              <div
                className="absolute right-0 top-full mt-1 z-20 w-48 overflow-hidden rounded-md border border-[#e1e6ef] bg-white py-1.5 text-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                onClick={(e) => e.stopPropagation()}
                role="menu"
              >
                <MenuItem icon={<ArrowUp size={14} />} label="Add row above" onClick={() => { onAddSiblingAbove(node.id); setMenuOpen(false) }} />
                <MenuItem icon={<ArrowDown size={14} />} label="Add row below" onClick={() => { onAddSibling(node.id); setMenuOpen(false) }} />
                <MenuItem icon={<CornerDownRight size={14} />} label="Add sub-row" onClick={() => { onAddChild(node.id); setMenuOpen(false) }} />
                <div className="my-1.5 border-t border-[#e1e6ef]" />
                <MenuItem icon={<Trash2 size={14} />} label="Delete row" danger onClick={() => { onDelete(node.id); setMenuOpen(false) }} />
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* Inline mapped accounts — visible whenever the global toggle is on */}
      {!hasChildren && showAccounts && count > 0 && (
        <ul>
          {(() => {
            const accounts = accountsByDestination[node.id] ?? []
            // Group by account number so split accounts (multiple rows sharing
            // the same number) collapse into a single expandable parent row.
            const byNumber = new Map<string, MappedAccount[]>()
            for (const acct of accounts) {
              ;(byNumber.get(acct.number) ?? byNumber.set(acct.number, []).get(acct.number)!).push(acct)
            }
            return [...byNumber.values()].map((group) => {
              const hasSplits = group.some((a) => (a.splitDimensions?.length ?? 0) > 0)
              if (group.length > 1 || hasSplits) {
                return (
                  <SplitGroupRow
                    key={group[0].number}
                    accounts={group}
                    destinationName={node.name}
                    depth={depth}
                    selectedAccountIds={selectedAccountIds}
                    onToggleAccount={onToggleAccount}
                    accountTab={accountTab}
                    selectedAccountId={selectedAccountId}
                    onSelectAccount={onSelectAccount}
                  />
                )
              }
              return (
                <AccountSubRow
                  key={group[0].id}
                  account={group[0]}
                  destinationName={node.name}
                  depth={depth}
                  isChecked={selectedAccountIds.has(group[0].id)}
                  onToggle={() => onToggleAccount(group[0].id)}
                  accountTab={accountTab}
                  isFocused={selectedAccountId === group[0].id}
                  onSelect={onSelectAccount ? () => onSelectAccount(group[0].id) : undefined}
                />
              )
            })
          })()}
        </ul>
      )}

      {hasChildren && isOpen && (
        <ul role="group">
          {(() => {
            const visibleChildren = node.children!.filter(matches)
            return visibleChildren.map((child, idx) => (
              <TreeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                indexInSiblings={idx}
                siblingCount={visibleChildren.length}
                expanded={expanded}
                onToggle={onToggle}
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
                searchQuery={searchQuery}
                matches={matches}
                countsByDestination={countsByDestination}
                accountsByDestination={accountsByDestination}
                rollupCounts={rollupCounts}
                showAccounts={showAccounts}
                selectedAccountIds={selectedAccountIds}
                onToggleAccount={onToggleAccount}
                onApplyToNode={onApplyToNode}
                accountTab={accountTab}
                selectedAccountId={selectedAccountId}
                onSelectAccount={onSelectAccount}
                levelNames={levelNames}
                pendingFocusId={pendingFocusId}
                onClearPendingFocus={onClearPendingFocus}
              />
            ))
          })()}
        </ul>
      )}
    </li>
  )
}

function SplitGroupRow({
  accounts,
  destinationName,
  depth,
  selectedAccountIds,
  onToggleAccount,
  accountTab = 'all',
  selectedAccountId = null,
  onSelectAccount,
}: {
  accounts: MappedAccount[]
  destinationName: string
  depth: number
  selectedAccountIds: Set<string>
  onToggleAccount: (id: string) => void
  accountTab?: AccountTab
  selectedAccountId?: string | null
  onSelectAccount?: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const first = accounts[0]
  const allChecked = accounts.every((a) => selectedAccountIds.has(a.id))
  const isInactive = first.isActive === false
  const allSplitDims = accounts.flatMap(a => a.splitDimensions ?? [])
  const hasSplits = allSplitDims.length > 0
  const uniqueDimNames = [...new Set(allSplitDims.map(d => d.name))]

  const methods = accounts.map((a) => a.mappingMethod)
  const uniqueMethods = new Set(methods)
  const isMixed = uniqueMethods.size > 1

  const parentBadge = (() => {
    if (!isMixed) {
      const m = methods[0]
      const color: 'success' | 'info' | 'warning' | 'default' =
        m === 'rule' ? 'success' : m === 'direct' ? 'info' : m === 'do-not-map' ? 'default' : 'warning'
      const label =
        m === 'rule'
          ? (getRuleName(first, destinationName) ?? 'Mapping Rule')
          : m === 'direct'
            ? 'Direct Map'
            : m === 'do-not-map'
              ? 'Do Not Map'
              : 'Unassigned'
      return <TableStatusBadge color={color} size="xs" hasIcon={false}>{label}</TableStatusBadge>
    }
    const ruleCnt = methods.filter((m) => m === 'rule').length
    const directCnt = methods.filter((m) => m === 'direct').length
    const parts: string[] = []
    if (ruleCnt > 0) parts.push(`${ruleCnt} Rule${ruleCnt > 1 ? 's' : ''}`)
    if (directCnt > 0) parts.push(`${directCnt} Direct Map${directCnt > 1 ? 's' : ''}`)
    return (
      <TableStatusBadge color="default" size="xs" hasIcon={false} truncateText={false}>
        {parts.join(' · ')}
      </TableStatusBadge>
    )
  })()

  const handleParentToggle = () => {
    if (allChecked) {
      accounts.forEach((a) => { if (selectedAccountIds.has(a.id)) onToggleAccount(a.id) })
    } else {
      accounts.forEach((a) => { if (!selectedAccountIds.has(a.id)) onToggleAccount(a.id) })
    }
  }

  return (
    <>
      <li
        className={`flex items-center gap-3 py-1 pr-4 text-[12px] cursor-pointer ${
          accounts.some((a) => selectedAccountId === a.id) ? 'bg-[#f1f3f9]' : 'hover:bg-[#f1f3f9]'
        }`}
      >
        <div style={{ width: 92 + depth * 24 }} className="shrink-0" />
        <button
          className="shrink-0 flex items-center justify-center w-4 h-4 text-[#6b7280] hover:text-[#424867]"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`min-w-0 truncate ${
              isInactive ? '[&_label_div]:!text-[#adb2bb] [&_label_div]:!font-normal [&_label_div]:!italic' : ''
            }`}
            style={{ '--flo-sem-color-surface-neutral-weaker': 'transparent', '--flo-sem-color-surface-success-weakest': 'transparent' } as React.CSSProperties}
          >
            <Checkbox
              checked={allChecked}
              onCheckedChange={handleParentToggle}
              label={`${first.number} ${first.name}`}
            />
          </div>
          {hasSplits && (
            <Tooltip>
              <Tooltip.Trigger>
                <span className="shrink-0 flex items-center cursor-default">
                  <AccountTreeIcon size={14} color="var(--flo-sem-color-icon-muted, #adb2bb)" />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" size="sm">
                <span>
                  Split by {uniqueDimNames.length} dimension{uniqueDimNames.length !== 1 ? 's' : ''}
                  {uniqueDimNames.map((name) => (
                    <span key={name} style={{ display: 'block' }}>• {name}</span>
                  ))}
                </span>
              </Tooltip.Content>
            </Tooltip>
          )}
          <span className="shrink-0">{parentBadge}</span>
        </div>
      </li>
      {expanded && accounts.map((acct) => {
        const dimLabel = (acct.splitDimensions ?? []).map((d) => `${d.name}: ${d.value}`).join(' | ')
        const m = acct.mappingMethod
        const color: 'success' | 'info' | 'warning' | 'default' =
          m === 'rule' ? 'success' : m === 'direct' ? 'info' : m === 'do-not-map' ? 'default' : 'warning'
        const label =
          m === 'rule'
            ? (getRuleName(acct, destinationName) ?? 'Mapping Rule')
            : m === 'direct'
              ? 'Direct Map'
              : m === 'do-not-map'
                ? 'Do Not Map'
                : 'Unassigned'
        return (
          <li
            key={acct.id}
            className={`flex items-center gap-3 py-1 pr-4 text-[12px] cursor-pointer ${
              selectedAccountId === acct.id ? 'bg-[#f1f3f9]' : 'hover:bg-[#f1f3f9]'
            }`}
            onClick={onSelectAccount ? () => onSelectAccount(acct.id) : undefined}
          >
            <div style={{ width: 144 + depth * 24 }} className="shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <div
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 truncate text-[#6b7280]"
                style={{ '--flo-sem-color-surface-neutral-weaker': 'transparent', '--flo-sem-color-surface-success-weakest': 'transparent' } as React.CSSProperties}
              >
                <Checkbox
                  checked={selectedAccountIds.has(acct.id)}
                  onCheckedChange={() => onToggleAccount(acct.id)}
                  label={dimLabel || `${acct.number} ${acct.name}`}
                />
              </div>
              <span className="shrink-0">
                <TableStatusBadge color={color} size="xs" hasIcon={false}>{label}</TableStatusBadge>
              </span>
            </div>
          </li>
        )
      })}
    </>
  )
}

function AccountSubRow({
  account,
  destinationName,
  depth,
  isChecked,
  onToggle,
  accountTab = 'all',
  isFocused = false,
  onSelect,
}: {
  account: MappedAccount
  destinationName: string
  depth: number
  isChecked: boolean
  onToggle: () => void
  accountTab?: AccountTab
  isFocused?: boolean
  onSelect?: () => void
}) {
  const methodLabel =
    account.mappingMethod === 'rule'
      ? (getRuleName(account, destinationName) ?? 'Mapping Rule')
      : account.mappingMethod === 'direct'
        ? 'Direct Map'
        : account.mappingMethod === 'do-not-map'
          ? 'Do Not Map'
          : 'Unassigned'
  const methodColor: 'success' | 'info' | 'warning' | 'default' =
    account.mappingMethod === 'rule'
      ? 'success'
      : account.mappingMethod === 'direct'
        ? 'info'
        : account.mappingMethod === 'do-not-map'
          ? 'default'
          : 'warning'

  const isInactive = account.isActive === false

  return (
    <li
      // Row-level click focuses this account in the mapping table. The
      // checkbox is wrapped below in a stopPropagation guard so toggling
      // selection for the bulk-apply flow doesn't also fire the focus
      // handler. isFocused gives the row a soft brand-success tint so
      // the source of the table filter is visible at a glance.
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (!onSelect) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`flex items-center gap-3 py-1 pr-4 text-[12px] cursor-pointer ${
        isFocused ? 'bg-[#f1f3f9]' : 'hover:bg-[#f1f3f9]'
      }`}
    >
      {/* Spacer + 16px phantom chevron space — keeps checkboxes aligned with
          SplitGroupRow parent rows (which have a real 16px chevron at the same offset) */}
      <div style={{ width: 92 + depth * 24 }} className="shrink-0" />
      <div style={{ width: 16 }} className="shrink-0" />

      <div className="flex-1 min-w-0 flex items-center gap-2">
        {/* Inactive treatment — drop the explicit "Inactive" badge and signal
             the state with type instead:
               • muted text color (#adb2bb / --flo-sem-color-text-muted, neutral-400)
               • italic name (long-standing accounting-app convention for
                 inactive items — NetSuite, Sage, QuickBooks all do this)
               • regular font weight (don't let FlowUI's checked-state semibold
                 fight the muted treatment)
             Targeting the FlowUI Checkbox label via the [&_label_div]:
             arbitrary variant since the Checkbox renders its own internal
             <label><div>…</div></label> and the inner div carries its own
             styled-component color/weight. */}
        <div
          // stopPropagation so toggling the checkbox for the bulk-apply flow
          // doesn't also fire the row's onClick (which focuses the account in
          // the mapping table).
          onClick={(e) => e.stopPropagation()}
          className={`min-w-0 truncate ${
            isInactive
              ? '[&_label_div]:!text-[#adb2bb] [&_label_div]:!font-normal [&_label_div]:!italic'
              : ''
          }`}
          style={{ '--flo-sem-color-surface-neutral-weaker': 'transparent', '--flo-sem-color-surface-success-weakest': 'transparent' } as React.CSSProperties}
        >
          <Checkbox
            checked={isChecked}
            onCheckedChange={onToggle}
            label={`${account.number} ${account.name}`}
          />
        </div>
        {account.mappingMethod !== 'unassigned' && account.mappingMethod !== 'do-not-map' && (
          <span className="shrink-0">
            <TableStatusBadge color={methodColor} size="xs" hasIcon={false}>{methodLabel}</TableStatusBadge>
          </span>
        )}
      </div>
    </li>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  // FlowUI dropdown option treatment:
  //   - text default        → #424867 (--flo-sem-color-text-option-default, neutral-600)
  //   - text hover          → #1d2433 (--flo-sem-color-text-option-hover, neutral-800)
  //   - hover background    → #f1f3f9 (--flo-sem-color-background-option-hover, neutral-200)
  //   - danger text         → #d24747 (--flo-sem-color-danger-default, red-600)
  //   - danger hover bg     → #fef1f2 (--flo-sem-color-danger-background, red-100)
  //   - padding             → 8px 16px (matches FlowUI SelectOption row)
  //   - icon color matches the row's text color so hover/danger states feel uniform
  return (
    <button
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-2 px-4 py-2 text-left font-['Inter'] text-[12px] font-medium leading-4 ${
        disabled
          ? 'cursor-default text-[#adb2bb]'
          : danger
            ? 'text-[#d24747] hover:bg-[#fef1f2]'
            : 'text-[#424867] hover:bg-[#f1f3f9] hover:text-[#1d2433]'
      }`}
    >
      <span
        className={
          disabled
            ? 'text-[#adb2bb]'
            : danger
              ? 'text-[#d24747]'
              : 'text-[#6b7280] group-hover:text-[#1d2433]'
        }
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

function SpecialSection({
  label,
  accounts,
  selectedAccountIds,
  onToggleAccount,
  accountTab,
  selectedAccountId,
  onSelectAccount,
}: {
  label: string
  accounts: MappedAccount[]
  selectedAccountIds: Set<string>
  onToggleAccount: (id: string) => void
  accountTab: AccountTab
  selectedAccountId: string | null
  onSelectAccount?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <li role="treeitem" aria-expanded={open}>
      <div
        className="group flex items-center gap-2 px-2 py-[3px] cursor-pointer hover:bg-[#f1f3f9]"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Drag-handle placeholder — keeps left alignment with regular tree rows */}
        <span className="flex items-center justify-center w-5 shrink-0" />
        {/* Badge-width spacer — L1 badge is 18px; without this the chevron sits too far left */}
        <span className="shrink-0 w-[18px]" />
        <button
          className="flex items-center justify-center w-5 shrink-0 text-[#6b7280]"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {/* Zero-width spacer — matches the indent-spacer div in regular tree rows so text aligns with Input */}
        <span className="shrink-0" />
        <span className="flex-1 min-w-0 text-[12px] font-normal text-[#1d2433]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
      </div>

      {open && (
        <ul>
          {accounts.map((acct) => (
            <AccountSubRow
              key={acct.id}
              account={acct}
              destinationName={label}
              depth={0}
              isChecked={selectedAccountIds.has(acct.id)}
              onToggle={() => onToggleAccount(acct.id)}
              accountTab={accountTab}
              isFocused={selectedAccountId === acct.id}
              onSelect={onSelectAccount ? () => onSelectAccount(acct.id) : undefined}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function LevelBadge({ level, name }: { level: number; name?: string }) {
  const tooltipText = name?.trim() ? name : `Level ${level}`
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className="shrink-0">
          <TableStatusBadge color="default" size="xs" hasIcon={false}>{`L${level}`}</TableStatusBadge>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top" size="sm">
        {tooltipText}
      </Tooltip.Content>
    </Tooltip>
  )
}
