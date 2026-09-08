import { useMemo, useState } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { ListTree, Table2, GitBranch, Check, Plus, MoreHorizontal } from 'lucide-react'
import TabGroup from '@floqastinc/flow-ui_core/TabGroup'
import Tab from '@floqastinc/flow-ui_core/Tab'
import Button from '@floqastinc/flow-ui_core/Button'
import Tooltip from '@floqastinc/flow-ui_core/Tooltip'
import { GlobalNavSidebar } from '@shared/components/GlobalNavSidebar/GlobalNavSidebar'
import { TopNav } from './components/TopNav'
import { InnerSidebar } from './components/InnerSidebar'
import { PageHeader } from './components/PageHeader'
import { RollupPane } from './components/RollupPane'
import { MappingPane, applyAccountTab, type AccountTab } from './components/MappingPane'
import { MappingRulesPane } from './components/MappingRulesPane'
import { EmptyState } from './components/EmptyState'
import { Toast } from './components/Toast'
import { type PaneKey } from './components/PaneToggleGroup'
import { sampleRollup } from './data/sample-rollup'
import { sampleMappings } from './data/sample-mappings'
import type { MappedAccount, RollupNode } from './types'
import './index.css'

const MUSEO = "'Museo Sans', sans-serif"

const TAB_LABELS: Record<AccountTab, string> = {
  all: 'All',
  accounts: 'Accounts',
  'six-star': 'Accounts & Subs',
}

function findNode(nodes: RollupNode[], id: string): RollupNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function buildDestinationNames(nodes: RollupNode[]): Record<string, string> {
  const map: Record<string, string> = {}
  const walk = (ns: RollupNode[]) => {
    for (const n of ns) {
      map[n.id] = n.name
      if (n.children) walk(n.children)
    }
  }
  walk(nodes)
  return map
}

function renameNode(nodes: RollupNode[], id: string, name: string): RollupNode[] {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, name }
    if (n.children) return { ...n, children: renameNode(n.children, id, name) }
    return n
  })
}

function newId(): string {
  return `n-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

// Deep-clone a subtree, assigning fresh IDs. Only the top-level node gets the
// "(Copy)" suffix — descendants keep their original names so the duplicate
// reads cleanly without "(Copy)" noise on every nested node.
function cloneSubtree(node: RollupNode, isRoot = true): RollupNode {
  return {
    ...node,
    id: newId(),
    name: isRoot ? `(Copy) ${node.name}` : node.name,
    children: node.children?.map((c) => cloneSubtree(c, false)),
  }
}

// Insert a new child as the first child of `parentId`.
function addChild(nodes: RollupNode[], parentId: string): { nodes: RollupNode[]; newId: string } {
  const id = newId()
  const next = nodes.map((n): RollupNode => {
    if (n.id === parentId) {
      const child: RollupNode = { id, name: 'New group', level: n.level + 1 }
      return { ...n, children: [child, ...(n.children ?? [])] }
    }
    if (n.children) return { ...n, children: addChild(n.children, parentId).nodes }
    return n
  })
  return { nodes: next, newId: id }
}

// Insert a new sibling immediately before `siblingId` at the same level.
function addSiblingAbove(nodes: RollupNode[], siblingId: string): { nodes: RollupNode[]; newId: string } {
  const id = newId()
  const idx = nodes.findIndex((n) => n.id === siblingId)
  if (idx >= 0) {
    const sibling = nodes[idx]
    const fresh: RollupNode = { id, name: 'New group', level: sibling.level }
    const next = [...nodes.slice(0, idx), fresh, ...nodes.slice(idx)]
    return { nodes: next, newId: id }
  }
  const next = nodes.map((n): RollupNode => {
    if (n.children) return { ...n, children: addSiblingAbove(n.children, siblingId).nodes }
    return n
  })
  return { nodes: next, newId: id }
}

// Insert a new sibling immediately after `siblingId` at the same level.
function addSibling(nodes: RollupNode[], siblingId: string): { nodes: RollupNode[]; newId: string } {
  const id = newId()
  const idx = nodes.findIndex((n) => n.id === siblingId)
  if (idx >= 0) {
    const sibling = nodes[idx]
    const fresh: RollupNode = { id, name: 'New group', level: sibling.level }
    const next = [...nodes.slice(0, idx + 1), fresh, ...nodes.slice(idx + 1)]
    return { nodes: next, newId: id }
  }
  const next = nodes.map((n): RollupNode => {
    if (n.children) return { ...n, children: addSibling(n.children, siblingId).nodes }
    return n
  })
  return { nodes: next, newId: id }
}

// Duplicate `id` (with all descendants, new IDs) as a sibling immediately after.
function duplicate(nodes: RollupNode[], id: string): { nodes: RollupNode[]; newId: string } {
  const idx = nodes.findIndex((n) => n.id === id)
  if (idx >= 0) {
    const copy = cloneSubtree(nodes[idx])
    const next = [...nodes.slice(0, idx + 1), copy, ...nodes.slice(idx + 1)]
    return { nodes: next, newId: copy.id }
  }
  let resultId = ''
  const next = nodes.map((n): RollupNode => {
    if (n.children) {
      const r = duplicate(n.children, id)
      if (r.newId) resultId = r.newId
      return { ...n, children: r.nodes }
    }
    return n
  })
  return { nodes: next, newId: resultId }
}

function deleteNode(nodes: RollupNode[], id: string): RollupNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => (n.children ? { ...n, children: deleteNode(n.children, id) } : n))
}

// Collect all node IDs in a subtree (including the node itself).
function collectSubtreeIds(node: RollupNode, acc: string[] = []): string[] {
  acc.push(node.id)
  node.children?.forEach((c) => collectSubtreeIds(c, acc))
  return acc
}

function deepCloneNodes(nodes: RollupNode[]): RollupNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? deepCloneNodes(n.children) : undefined,
  }))
}

interface NodeContext {
  siblings: RollupNode[]
  index: number
  parent: RollupNode | null
}

function findContext(nodes: RollupNode[], id: string, parent: RollupNode | null = null): NodeContext | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return { siblings: nodes, index: i, parent }
    if (nodes[i].children) {
      const r = findContext(nodes[i].children!, id, nodes[i])
      if (r) return r
    }
  }
  return null
}

function relevelInPlace(node: RollupNode, level: number): void {
  node.level = level
  node.children?.forEach((c) => relevelInPlace(c, level + 1))
}

function isDescendantOf(node: RollupNode, candidateId: string): boolean {
  if (!node.children) return false
  for (const c of node.children) {
    if (c.id === candidateId) return true
    if (isDescendantOf(c, candidateId)) return true
  }
  return false
}

// Indent: source becomes the LAST child of its previous sibling.
function indentNode(nodes: RollupNode[], id: string): RollupNode[] {
  const tree = deepCloneNodes(nodes)
  const ctx = findContext(tree, id)
  if (!ctx || ctx.index === 0) return nodes
  const prev = ctx.siblings[ctx.index - 1]
  const [moved] = ctx.siblings.splice(ctx.index, 1)
  prev.children = prev.children ?? []
  relevelInPlace(moved, prev.level + 1)
  prev.children.push(moved)
  return tree
}

// Direct level change: update node.level and cascade to all children.
// Does not move the node in the tree — purely relabels hierarchy depth.
function changeLevelNode(nodes: RollupNode[], id: string, newLevel: number): RollupNode[] {
  const tree = deepCloneNodes(nodes)
  const ctx = findContext(tree, id)
  if (!ctx) return nodes
  relevelInPlace(ctx.siblings[ctx.index], newLevel)
  return tree
}

// Outdent: source becomes a sibling immediately AFTER its parent.
function outdentNode(nodes: RollupNode[], id: string): RollupNode[] {
  const tree = deepCloneNodes(nodes)
  const ctx = findContext(tree, id)
  if (!ctx || !ctx.parent) return nodes
  const parent = ctx.parent
  const [moved] = ctx.siblings.splice(ctx.index, 1)
  const grand = findContext(tree, parent.id)
  if (!grand) return nodes
  relevelInPlace(moved, parent.level)
  grand.siblings.splice(grand.index + 1, 0, moved)
  return tree
}

function moveUp(nodes: RollupNode[], id: string): RollupNode[] {
  const tree = deepCloneNodes(nodes)
  const ctx = findContext(tree, id)
  if (!ctx || ctx.index === 0) return nodes
  const arr = ctx.siblings
  ;[arr[ctx.index - 1], arr[ctx.index]] = [arr[ctx.index], arr[ctx.index - 1]]
  return tree
}

function moveDown(nodes: RollupNode[], id: string): RollupNode[] {
  const tree = deepCloneNodes(nodes)
  const ctx = findContext(tree, id)
  if (!ctx || ctx.index >= ctx.siblings.length - 1) return nodes
  const arr = ctx.siblings
  ;[arr[ctx.index], arr[ctx.index + 1]] = [arr[ctx.index + 1], arr[ctx.index]]
  return tree
}

// Drag-reorder: move sourceId to before/after targetId (same level as target).
function moveRelative(
  nodes: RollupNode[],
  sourceId: string,
  targetId: string,
  mode: 'before' | 'after',
): RollupNode[] {
  if (sourceId === targetId) return nodes
  const source = findNode(nodes, sourceId)
  if (source && isDescendantOf(source, targetId)) return nodes
  const tree = deepCloneNodes(nodes)
  const sCtx = findContext(tree, sourceId)
  if (!sCtx) return nodes
  const [moved] = sCtx.siblings.splice(sCtx.index, 1)
  const tCtx = findContext(tree, targetId)
  if (!tCtx) return nodes
  const target = tCtx.siblings[tCtx.index]
  relevelInPlace(moved, target.level)
  tCtx.siblings.splice(mode === 'before' ? tCtx.index : tCtx.index + 1, 0, moved)
  return tree
}

export default function App() {
  const [nodes, setNodes] = useState<RollupNode[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // selectedAccountId: clicking an account row in the hierarchy focuses just
  // that account in the mapping table. Mutually exclusive with selectedId
  // (destination focus) — picking one clears the other.
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [visiblePanes, setVisiblePanes] = useState<Set<PaneKey>>(() => new Set<PaneKey>(['rollup', 'mapping']))
  const [accountTab, setAccountTab] = useState<AccountTab>('all')
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null)
  // User-defined names for each hierarchy depth. Surfaced on badge hover and editable
  // via Level Management. Defaults are FDM-typical (Statement / Section / etc.).
  const [levelNames, setLevelNames] = useState<Record<number, string>>({
    1: 'Statement',
    2: 'Section',
    3: 'Subsection',
    4: 'Group',
    5: 'Line',
  })

  const togglePane = (pane: PaneKey) => {
    setVisiblePanes((prev) => {
      const next = new Set(prev)
      if (next.has(pane)) {
        next.delete(pane)
      } else {
        next.add(pane)
      }
      return next
    })
  }

  const maximizePane = (pane: PaneKey) => setVisiblePanes(new Set<PaneKey>([pane]))
  const canMaximize = visiblePanes.size > 1

  const selectedNode = useMemo(
    () => (selectedId ? findNode(nodes, selectedId) : null),
    [selectedId, nodes],
  )

  const destinationNamesById = useMemo(() => buildDestinationNames(nodes), [nodes])

  // Embedded accounts in the hierarchy respect the active tab.
  const scopedAccounts = useMemo(
    () => applyAccountTab(accountTab, sampleMappings),
    [accountTab],
  )

  const accountsByDestination = useMemo(() => {
    const map: Record<string, MappedAccount[]> = {}
    // On the All tab, split accounts (those with splitDimensions) show as
    // separate rows — one per dimension-value record — so users can see exactly
    // how the account landed. On other tabs, dedupe by (destinationId, number)
    // so each account number appears at most once.
    const seen = new Set<string>()
    for (const a of scopedAccounts) {
      if (a.destinationId === 'unassigned' || a.destinationId === 'do-not-map') {
        ;(map[a.destinationId] ??= []).push(a)
        continue
      }
      const isSplit = (a.splitDimensions?.length ?? 0) > 0
      const key = accountTab === 'all' && isSplit
        ? `${a.destinationId}::${a.id}`
        : `${a.destinationId}::${a.number}`
      if (seen.has(key)) continue
      seen.add(key)
      ;(map[a.destinationId] ??= []).push(a)
    }
    return map
  }, [scopedAccounts, accountTab])

  const countsByDestination = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const id in accountsByDestination) counts[id] = accountsByDestination[id].length
    return counts
  }, [accountsByDestination])

  const handleRename = (id: string, name: string) => {
    setNodes((prev) => renameNode(prev, id, name))
    setHasChanges(true)
  }

  const handleAddChild = (parentId: string) => {
    const result = addChild(nodes, parentId)
    setNodes(result.nodes)
    setPendingFocusId(result.newId)
    setHasChanges(true)
    setToast('New child group added.')
  }

  const handleAddSiblingAbove = (siblingId: string) => {
    const result = addSiblingAbove(nodes, siblingId)
    setNodes(result.nodes)
    setPendingFocusId(result.newId)
    setHasChanges(true)
    setToast('New group added above.')
  }

  const handleAddSibling = (siblingId: string) => {
    const result = addSibling(nodes, siblingId)
    setNodes(result.nodes)
    setPendingFocusId(result.newId)
    setHasChanges(true)
    setToast('New sibling group added.')
  }

  const handleDuplicate = (id: string) => {
    setNodes((prev) => duplicate(prev, id).nodes)
    setHasChanges(true)
    setToast('Group duplicated.')
  }

  const handleIndent = (id: string) => {
    setNodes((prev) => {
      const next = indentNode(prev, id)
      if (next !== prev) {
        setHasChanges(true)
      }
      return next
    })
  }

  const handleOutdent = (id: string) => {
    setNodes((prev) => {
      const next = outdentNode(prev, id)
      if (next !== prev) {
        setHasChanges(true)
      }
      return next
    })
  }

  const handleChangeLevel = (id: string, newLevel: number) => {
    setNodes((prev) => {
      const next = changeLevelNode(prev, id, newLevel)
      if (next !== prev) setHasChanges(true)
      return next
    })
  }

  const handleMoveUp = (id: string) => {
    setNodes((prev) => {
      const next = moveUp(prev, id)
      if (next !== prev) setHasChanges(true)
      return next
    })
  }

  const handleMoveDown = (id: string) => {
    setNodes((prev) => {
      const next = moveDown(prev, id)
      if (next !== prev) setHasChanges(true)
      return next
    })
  }

  const handleMove = (sourceId: string, targetId: string, mode: 'before' | 'after') => {
    setNodes((prev) => {
      const next = moveRelative(prev, sourceId, targetId, mode)
      if (next !== prev) {
        setHasChanges(true)
      }
      return next
    })
  }

  const beginWith = (next: RollupNode[]) => {
    setNodes(next)
    setHasStarted(true)
    setHasChanges(true)
    // All tab is the default — show both the hierarchy and the mapping table
    setVisiblePanes(new Set<PaneKey>(['rollup', 'mapping']))
    setSelectedId(null)
  }

  const handleStartScratch = () => {
    beginWith([{ id: newId(), name: 'New rollup', level: 1 }])
    setToast('Started a new hierarchy. Add your first group.')
  }

  const handleUseExample = () => {
    beginWith(sampleRollup)
    setToast('Loaded example financial statement template.')
  }

  const handleUseAI = () => {
    beginWith(sampleRollup)
    setToast('AI agent generated a roll-up based on your chart of accounts.')
  }

  const handleUploadExcel = () => {
    beginWith(sampleRollup)
    setToast('Imported roll-up structure from Excel.')
  }

  const handleStartOver = () => {
    setNodes([])
    setHasStarted(false)
    setHasChanges(false)
    setSelectedId(null)
    setVisiblePanes(new Set<PaneKey>(['mapping']))
    setToast('Hierarchy cleared. Choose how to begin.')
  }

  const handleDelete = (id: string) => {
    const node = findNode(nodes, id)
    if (!node) return
    const subtreeIds = new Set(collectSubtreeIds(node))
    const affected = sampleMappings.filter((a) => subtreeIds.has(a.destinationId)).length
    const msg =
      affected > 0
        ? `Delete "${node.name}" and ${node.children?.length ? 'its child groups' : 'this group'}? ${affected} mapped account${affected === 1 ? '' : 's'} will become unassigned.`
        : `Delete "${node.name}"?`
    if (!window.confirm(msg)) return
    setNodes((prev) => deleteNode(prev, id))
    setHasChanges(true)
    if (selectedId === id) setSelectedId(null)
    setToast(`Deleted "${node.name}".`)
  }

  return (
    <div className="flex h-screen bg-[#f1f3f9] text-[#1d2433]">
      <GlobalNavSidebar bottomActive="settings" avatarFallback="EE" />

      <div className="flex flex-col flex-1 min-w-0">
        <TopNav />

        <div className="flex flex-1 min-h-0">
          <InnerSidebar />

          <div className="flex flex-col flex-1 min-w-0">
            <PageHeader
              hasChanges={hasChanges}
              onCancel={() => {
                setHasChanges(false)
                setToast('Changes discarded.')
              }}
              onSaveDraft={() => {
                setHasChanges(false)
                setToast('Draft saved. Mapping rules preserved.')
              }}
              onSaveAndPublish={() => {
                setHasChanges(false)
                setToast('Published. Mapping rules preserved.')
              }}
              onStartOver={handleStartOver}
              canStartOver={hasStarted}
              isEmpty={!hasStarted}
            />

            {/* Single tab bar row: scope tabs left, progress + Views right */}
            {hasStarted && (
              <div className="flex items-center justify-between px-6 bg-white border-b border-[#e1e6ef] shrink-0">
                <AccountTabStrip
                  tab={accountTab}
                  onChange={setAccountTab}
                  accounts={sampleMappings}
                />
                <div className="flex items-center gap-3">
                  <MappingProgress accounts={sampleMappings} accountTab={accountTab} />
                  <div className="w-px h-5 bg-[#e1e6ef]" />
                  <AddViewButton visible={visiblePanes} onToggle={togglePane} />
                </div>
              </div>
            )}

            <main className="flex-1 min-h-0">
              {!hasStarted ? (
                <EmptyState
                  onStartScratch={handleStartScratch}
                  onUseExample={handleUseExample}
                  onUseAI={handleUseAI}
                  onUploadExcel={handleUploadExcel}
                />
              ) : (
                <PaneLayout
                  visiblePanes={visiblePanes}
                  rollup={
                    <RollupPane
                      nodes={nodes}
                      selectedId={selectedId}
                      onSelect={(id) => {
                        setSelectedAccountId(null)
                        setSelectedId((prev) => (prev === id ? null : id))
                      }}
                      selectedAccountId={selectedAccountId}
                      onSelectAccount={(id) => {
                        setSelectedId(null)
                        setSelectedAccountId((prev) => (prev === id ? null : id))
                      }}
                      onRename={handleRename}
                      onAddChild={handleAddChild}
                      onAddSiblingAbove={handleAddSiblingAbove}
                      onAddSibling={handleAddSibling}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      onIndent={handleIndent}
                      onOutdent={handleOutdent}
                      onChangeLevel={handleChangeLevel}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onMove={handleMove}
                      countsByDestination={countsByDestination}
                      accountsByDestination={accountsByDestination}
                      onClose={() => togglePane('rollup')}
                      onMaximize={canMaximize ? () => maximizePane('rollup') : undefined}
                      accountTab={accountTab}
                      levelNames={levelNames}
                      onLevelNamesChange={setLevelNames}
                      pendingFocusId={pendingFocusId}
                      onClearPendingFocus={() => setPendingFocusId(null)}
                    />
                  }
                  mapping={
                    <div className="relative h-full">
                      <MappingPane
                        selectedNode={selectedNode}
                        selectedAccountId={selectedAccountId}
                        onClearSelectedAccount={() => setSelectedAccountId(null)}
                        accounts={sampleMappings}
                        accountTab={accountTab}
                        destinationNamesById={destinationNamesById}
                        onClose={() => togglePane('mapping')}
                        onMaximize={canMaximize ? () => maximizePane('mapping') : undefined}
                      />
                    </div>
                  }
                  rules={
                    <MappingRulesPane
                      destinationNames={Object.values(destinationNamesById)}
                      onClose={() => togglePane('rules')}
                      onMaximize={canMaximize ? () => maximizePane('rules') : undefined}
                    />
                  }
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}

interface PaneLayoutProps {
  visiblePanes: Set<PaneKey>
  rollup: React.ReactNode
  mapping: React.ReactNode
  rules: React.ReactNode
}

// Builds the resizable layout based on which panes are visible.
// 1 pane: full width (no PanelGroup). 2+ panes: PanelGroup with handles.
function PaneLayout({ visiblePanes, rollup, mapping, rules }: PaneLayoutProps) {
  const order: PaneKey[] = ['rollup', 'mapping', 'rules']
  const items = order.filter((p) => visiblePanes.has(p))

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-[14px] font-bold text-[#1d2433] mb-1">No views selected</p>
          <p className="text-[12px] text-[#adb2bb]">Use the <span className="font-semibold">Views</span> menu above to open Map, Rules, or Hierarchy.</p>
        </div>
      </div>
    )
  }

  if (items.length === 1) {
    const only = items[0]
    return (
      <div className="h-full">
        {only === 'rollup' ? rollup : only === 'mapping' ? mapping : rules}
      </div>
    )
  }

  // Even split feels right for both 2-pane and 3-pane configurations and
  // keeps default sizes summing to 100. Users can drag to adjust.
  const defaultSize = Math.floor(100 / items.length)
  const minSize = items.length === 3 ? 20 : 25

  // Use the visible-set as the autoSaveId so each unique combination remembers
  // its own sizing, but a different combo gets a fresh layout instead of
  // inheriting (and breaking) sizes from a different number of panels.
  const layoutKey = items.join('-')

  const renderPane = (p: PaneKey) =>
    p === 'rollup' ? rollup : p === 'mapping' ? mapping : rules

  return (
    <PanelGroup
      key={layoutKey}
      direction="horizontal"
      autoSaveId={`fdm-rollup-split-${layoutKey}`}
    >
      {items.flatMap((p, i) => {
        const panel = (
          <Panel key={p} defaultSize={defaultSize} minSize={minSize}>
            {renderPane(p)}
          </Panel>
        )
        if (i === 0) return [panel]
        const handle = (
          <PanelResizeHandle
            key={`handle-${i}`}
            className="w-px bg-[#e1e6ef] hover:bg-[#1fac76] data-[resize-handle-state=drag]:bg-[#1fac76] cursor-col-resize transition-colors"
          />
        )
        return [handle, panel]
      })}
    </PanelGroup>
  )
}

function AccountTabStrip({
  tab,
  onChange,
  accounts,
}: {
  tab: AccountTab
  onChange: (t: AccountTab) => void
  accounts: import('./types').MappedAccount[]
}) {
  const items: { key: AccountTab; label: string; hasMenu: boolean }[] = [
    { key: 'all', label: 'All', hasMenu: false },
    { key: 'accounts', label: 'Accounts', hasMenu: false },
    { key: 'six-star', label: 'Accounts & Subs', hasMenu: true },
  ]
  return (
    <div className="flex items-center gap-3">
      <TabGroup value={tab} onValueChange={(v) => onChange(v as AccountTab)}>
        {items.map(({ key, label, hasMenu }) => (
          <Tab
            key={key}
            tabId={key}
            title={
              hasMenu ? (
                <span className="inline-flex items-center gap-1.5">
                  {label}
                  <span
                    role="button"
                    aria-label={`${label} tab options`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center w-5 h-5 rounded text-[#6b7280] hover:text-[#1d2433] hover:bg-[#e1e6ef]"
                  >
                    <MoreHorizontal size={14} />
                  </span>
                </span>
              ) : (
                label
              )
            }
          >
            {null}
          </Tab>
        ))}
      </TabGroup>
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            variant="outlined"
            color="dark"
            size="md"
            padding={false}
            onClick={() => {}}
            aria-label="Add mapping tab"
          >
            <Plus size={10} strokeWidth={2.5} />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" size="sm" style={{ maxWidth: 240 }}>
          Add a mapping tab to break high-level accounts into multiple rows paired with the dimensions you select
        </Tooltip.Content>
      </Tooltip>
    </div>
  )
}

function MappingProgress({ accounts, accountTab }: { accounts: import('./types').MappedAccount[]; accountTab: AccountTab }) {
  const scoped = applyAccountTab(accountTab, accounts)
  const total = scoped.length
  const mapped = scoped.filter((a) => a.mappingMethod !== 'unassigned').length
  const progress = total === 0 ? 0 : Math.round((mapped / total) * 100)
  const tabLabel = TAB_LABELS[accountTab]
  return (
    <div className="relative group/progress flex items-center gap-2 cursor-default">
      {/* Progress bar — hidden on small viewports */}
      <div className="hidden lg:block w-28 h-1.5 rounded-full bg-[#e1e6ef] overflow-hidden">
        <div className="h-full bg-[#1fac76] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-[11px] tabular-nums text-[#6b7280] whitespace-nowrap">{progress}%</span>
      {/* Hover tooltip with full context */}
      <span className="pointer-events-none absolute right-0 top-full mt-1.5 z-20 whitespace-nowrap rounded bg-[#1d2433] text-white text-[11px] px-2.5 py-1.5 opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-md">
        <span className="block font-bold mb-0.5">Mapping progress — {tabLabel}</span>
        {mapped} of {total} accounts mapped ({progress}%)
      </span>
    </div>
  )
}

function AddViewButton({ visible, onToggle }: { visible: Set<PaneKey>; onToggle: (pane: PaneKey) => void }) {
  const [open, setOpen] = useState(false)
  const all: { key: PaneKey; label: string; icon: React.ReactNode }[] = [
    { key: 'mapping', label: 'Map', icon: <Table2 size={13} /> },
    { key: 'rules', label: 'Rules', icon: <GitBranch size={13} /> },
    { key: 'rollup', label: 'Hierarchy', icon: <ListTree size={13} /> },
  ]
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-white border border-[#cbd2e1] text-[12px] text-[#424867] hover:bg-[#f8fafc] shadow-sm"
        style={{ fontFamily: MUSEO, fontWeight: 700 }}
      >
        Views
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#adb2bb]">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white border border-[#e1e6ef] rounded-md shadow-lg py-1 text-[12px]">
            {all.map(({ key, label, icon }) => {
              const isVisible = visible.has(key)
              return (
                <button
                  key={key}
                  onClick={() => onToggle(key)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f8fafc]"
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isVisible ? 'bg-[#1fac76] border-[#1fac76]' : 'border-[#cbd2e1]'}`}>
                    {isVisible && <Check size={10} className="text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-[#6b7280]">{icon}</span>
                  <span className={isVisible ? 'text-[#1d2433]' : 'text-[#6b7280]'} style={{ fontWeight: 700 }}>{label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
