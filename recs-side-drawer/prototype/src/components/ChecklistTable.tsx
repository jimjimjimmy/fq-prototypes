import { useEffect, useRef } from 'react'
import { IconButton } from '@floqastinc/flow-ui_core'
import AddCommentOutlined from '@floqastinc/flow-ui_icons/material/AddCommentOutlined'
import AttachFileAdd from '@floqastinc/flow-ui_icons/material/AttachFileAdd'
import SettingsOutlined from '@floqastinc/flow-ui_icons/material/SettingsOutlined'
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'
import type { CreatedRow } from '../hooks/usePostCreateFeedback'

// Per Figma node 8673:70836 ("Row") - 5 columns, first two frozen/sticky
// (matching Reconciliations' WireframeTable), no group/account nesting since
// every Checklist row is the same shape (no "Group" variant exists for this
// table).
const COLUMN_WIDTHS = [272, 272, 206, 190, 190]
const STICKY_LEFT = [0, COLUMN_WIDTHS[0]]
const HEADER_BARS = [24, 40, 48, 48, 48]
const ROW_SPEC = {
  col1: { pr: [72, 0, 32, 104] },
  col2: { pr: [32, 104] },
  rest: [40, 64, 64],
}

function Bar({ pr, color, height, rounded }: { pr: number; color: string; height: number; rounded?: boolean }) {
  return (
    <div
      className={`shrink-0 ${rounded ? 'rounded-[16px]' : ''}`}
      style={{ width: 174 - pr, height, backgroundColor: color }}
    />
  )
}

function Cell({
  width,
  borderRight,
  stickyLeft,
  children,
}: {
  width: number
  borderRight?: boolean
  stickyLeft?: number
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] ${borderRight ? 'border-r border-solid border-[#e1e6ef]' : ''} ${stickyLeft !== undefined ? 'sticky z-10' : ''}`}
      style={{ width, left: stickyLeft }}
    >
      {children}
    </div>
  )
}

function HeaderRow() {
  return (
    <div className="border-b border-solid border-[#e1e6ef] flex items-start h-[49px] w-full shrink-0">
      {HEADER_BARS.map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i]} borderRight={i === 1} stickyLeft={STICKY_LEFT[i]}>
          <Bar pr={pr} color="#b1b2b3" height={16} />
        </Cell>
      ))}
      <div className="shrink-0 self-stretch" style={{ width: 168 }} />
    </div>
  )
}

function RowActions({
  onOpenSettings,
  onOpenDocuments,
  documentCount,
  onOpenReviewNotes,
  reviewNoteCount,
}: {
  onOpenSettings: () => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}) {
  return (
    <div className="flex items-start justify-end gap-[4px] p-[12px] self-stretch shrink-0" style={{ width: 168 }}>
      <IconButton size="table" onClick={onOpenReviewNotes} numericalIndicator={reviewNoteCount}>
        <AddCommentOutlined className="size-[20px]" />
      </IconButton>
      <IconButton size="table" onClick={onOpenDocuments} numericalIndicator={documentCount}>
        <AttachFileAdd className="size-[20px]" />
      </IconButton>
      <IconButton size="table" onClick={onOpenSettings}>
        <SettingsOutlined className="size-[20px]" />
      </IconButton>
      <IconButton size="table" onClick={() => {}}>
        <MoreVert className="size-[20px]" />
      </IconButton>
    </div>
  )
}

function DataRow({
  onOpenSettings,
  onOpenDocuments,
  documentCount,
  onOpenReviewNotes,
  reviewNoteCount,
}: {
  onOpenSettings: () => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}) {
  return (
    <div className="group border-b border-solid border-[#e1e6ef] flex items-start h-[109px] w-full shrink-0 hover:bg-[#f1f3f9]">
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <div className="flex flex-col gap-[8px] items-start w-full">
          <Bar pr={ROW_SPEC.col1.pr[0]} color="#d1d2d3" height={16} />
          <Bar pr={ROW_SPEC.col1.pr[1]} color="#e1e2e3" height={12} />
          <Bar pr={ROW_SPEC.col1.pr[2]} color="#e1e2e3" height={12} />
          <Bar pr={ROW_SPEC.col1.pr[3]} color="#c8cacb" height={12} rounded />
        </div>
      </Cell>
      <Cell width={COLUMN_WIDTHS[1]} borderRight stickyLeft={STICKY_LEFT[1]}>
        <div className="flex flex-col gap-[8px] items-start w-full">
          <Bar pr={ROW_SPEC.col2.pr[0]} color="#e1e2e3" height={12} />
          <Bar pr={ROW_SPEC.col2.pr[1]} color="#c8cacb" height={12} rounded />
          <div className="rounded-[16px] opacity-30" style={{ width: 174 - ROW_SPEC.col2.pr[1], height: 12, backgroundColor: '#3d7bf7' }} />
        </div>
      </Cell>
      {ROW_SPEC.rest.map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i + 2]}>
          <Bar pr={pr} color="#d1d2d3" height={16} />
        </Cell>
      ))}
      <RowActions
        onOpenSettings={onOpenSettings}
        onOpenDocuments={onOpenDocuments}
        documentCount={documentCount}
        onOpenReviewNotes={onOpenReviewNotes}
        reviewNoteCount={reviewNoteCount}
      />
    </div>
  )
}

// A row for a just-created Task (see App's post-create feedback flow) -
// visually a plain, generic DataRow (matching the table's current
// generic-only look, per the same convention as Reconciliations' table) -
// `isHighlighted` layers a translucent tint over the whole row that fades
// out on its own (see `row-created-pulse` in index.css).
function CreatedTableRow({
  isHighlighted,
  onHighlightDone,
  registerRef,
  onOpenDocuments,
  documentCount,
  onOpenReviewNotes,
  reviewNoteCount,
}: {
  isHighlighted: boolean
  onHighlightDone: () => void
  registerRef: (el: HTMLDivElement | null) => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}) {
  return (
    <div
      ref={registerRef}
      className="group relative border-b border-solid border-[#e1e6ef] flex items-start h-[109px] w-full shrink-0 hover:bg-[#f1f3f9]"
    >
      {isHighlighted && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ animation: 'row-created-pulse 3800ms ease-out forwards' }}
          onAnimationEnd={onHighlightDone}
        />
      )}
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <div className="flex flex-col gap-[8px] items-start w-full">
          <Bar pr={ROW_SPEC.col1.pr[0]} color="#d1d2d3" height={16} />
          <Bar pr={ROW_SPEC.col1.pr[1]} color="#e1e2e3" height={12} />
          <Bar pr={ROW_SPEC.col1.pr[2]} color="#e1e2e3" height={12} />
        </div>
      </Cell>
      <Cell width={COLUMN_WIDTHS[1]} borderRight stickyLeft={STICKY_LEFT[1]}>
        <Bar pr={ROW_SPEC.col2.pr[0]} color="#e1e2e3" height={12} />
      </Cell>
      {ROW_SPEC.rest.map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i + 2]}>
          <Bar pr={pr} color="#d1d2d3" height={16} />
        </Cell>
      ))}
      <RowActions
        onOpenSettings={() => {}}
        onOpenDocuments={onOpenDocuments}
        documentCount={documentCount}
        onOpenReviewNotes={onOpenReviewNotes}
        reviewNoteCount={reviewNoteCount}
      />
    </div>
  )
}

interface ChecklistTableProps {
  rowCount?: number
  createdRows?: CreatedRow[]
  highlightRowId?: string | null
  onHighlightDone?: () => void
  // The table has no per-row data model (every row is a generic placeholder,
  // per the wireframe-only scope) - every row's gear opens the same canned,
  // already-filled-out task, matching Reconciliations' flat rows.
  onOpenSettings?: () => void
  onOpenDocuments: (rowKey: string) => void
  documentCounts: Record<string, number>
  defaultDocumentCount: number
  onOpenReviewNotes: (rowKey: string) => void
  reviewNoteCounts: Record<string, number>
  defaultReviewNoteCount: number
}

export function ChecklistTable({
  rowCount = 7,
  createdRows = [],
  highlightRowId = null,
  onHighlightDone = () => {},
  onOpenSettings = () => {},
  onOpenDocuments,
  documentCounts,
  defaultDocumentCount,
  onOpenReviewNotes,
  reviewNoteCounts,
  defaultReviewNoteCount,
}: ChecklistTableProps) {
  const createdRowRefs = useRef(new Map<string, HTMLDivElement>())

  useEffect(() => {
    if (!highlightRowId) return
    createdRowRefs.current.get(highlightRowId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightRowId])

  return (
    <div className="border border-solid border-[#e1e6ef] rounded-[6px] w-full overflow-x-auto overflow-y-hidden">
      <div className="flex flex-col items-start" style={{ width: COLUMN_WIDTHS.reduce((a, b) => a + b, 0) + 168 }}>
        <HeaderRow />
        {createdRows.map((row) => {
          const rowKey = `checklist-created-${row.id}`
          return (
            <CreatedTableRow
              key={row.id}
              isHighlighted={row.id === highlightRowId}
              onHighlightDone={onHighlightDone}
              registerRef={(el) => {
                if (el) createdRowRefs.current.set(row.id, el)
                else createdRowRefs.current.delete(row.id)
              }}
              onOpenDocuments={() => onOpenDocuments(rowKey)}
              documentCount={documentCounts[rowKey] ?? defaultDocumentCount}
              onOpenReviewNotes={() => onOpenReviewNotes(rowKey)}
              reviewNoteCount={reviewNoteCounts[rowKey] ?? defaultReviewNoteCount}
            />
          )
        })}
        {Array.from({ length: rowCount }).map((_, i) => {
          const rowKey = `checklist-data-${i}`
          return (
            <DataRow
              key={i}
              onOpenSettings={onOpenSettings}
              onOpenDocuments={() => onOpenDocuments(rowKey)}
              documentCount={documentCounts[rowKey] ?? defaultDocumentCount}
              onOpenReviewNotes={() => onOpenReviewNotes(rowKey)}
              reviewNoteCount={reviewNoteCounts[rowKey] ?? defaultReviewNoteCount}
            />
          )
        })}
      </div>
    </div>
  )
}
