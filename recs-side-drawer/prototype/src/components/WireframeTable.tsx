import { useEffect, useRef } from 'react'
import { IconButton } from '@floqastinc/flow-ui_core'
import AddCommentOutlined from '@floqastinc/flow-ui_icons/material/AddCommentOutlined'
import AttachFileAdd from '@floqastinc/flow-ui_icons/material/AttachFileAdd'
import SettingsOutlined from '@floqastinc/flow-ui_icons/material/SettingsOutlined'
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'
import { MOCK_GROUP_ROWS, type ExistingGroupSettings } from './drawers/addGroupTypes'
import type { CreatedRow } from '../hooks/usePostCreateFeedback'

// Canonical per-column widths shared by the header row and every data row -
// max(header bar need, data bar need) per column, so labels always line up
// with the columns below even though each row's "fake word" bar length varies.
// The trailing entry is the row-actions column (comment/attach/settings/overflow).
// 9 data columns total, matching the Group row's own column count (per Figma
// node 8500:45752, the Group row's Main line never renders a 10th column) -
// the flat row previously had an extra column the Group row didn't.
const COLUMN_WIDTHS = [190, 206, 166, 182, 182, 182, 166, 190, 190, 168]

// Columns 1-2 are frozen: sticky within the table's horizontal scroll
// container so the rest of the columns scroll underneath them.
const STICKY_LEFT = [0, COLUMN_WIDTHS[0]]

const HEADER_BARS = [16, 72, 40, 24, 80, 40, 40, 80, 64]

const DATA_ROW_SPEC = {
  col1: { pr: 16 },
  col2: {
    line1: { pr: 72 },
    line2: { pr: 0 },
    line3: { pr: 104 },
  },
  // cols 3-9
  rest: [40, 24, 24, 24, 64, 64, 64],
}

function Bar({ pr, color, height, invisible }: { pr: number; color: string; height: number; invisible?: boolean }) {
  return (
    <div className="shrink-0" style={{ width: 174 - pr, height, backgroundColor: color, opacity: invisible ? 0 : 1 }} />
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
      {/* Row-actions column has no header label, matching the Figma spec. */}
      <div className="shrink-0 self-stretch" style={{ width: COLUMN_WIDTHS[9] }} />
    </div>
  )
}

interface RowActionsProps {
  onOpenSettings: () => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}

function RowActions({ onOpenSettings, onOpenDocuments, documentCount, onOpenReviewNotes, reviewNoteCount }: RowActionsProps) {
  return (
    <div className="flex items-start justify-end gap-[4px] p-[12px] self-stretch shrink-0" style={{ width: COLUMN_WIDTHS[9] }}>
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

interface DataRowProps {
  onOpenSettings: () => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}

function DataRow({ onOpenSettings, onOpenDocuments, documentCount, onOpenReviewNotes, reviewNoteCount }: DataRowProps) {
  return (
    <div className="group border-b border-solid border-[#e1e6ef] flex items-start h-[89px] w-full shrink-0 hover:bg-[#f1f3f9]">
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <Bar pr={DATA_ROW_SPEC.col1.pr} color="#d1d2d3" height={16} />
      </Cell>
      <div
        className="flex flex-col gap-[8px] items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] border-r border-solid border-[#e1e6ef] sticky z-10"
        style={{ width: COLUMN_WIDTHS[1], left: STICKY_LEFT[1] }}
      >
        <Bar pr={DATA_ROW_SPEC.col2.line1.pr} color="#c1c2c3" height={16} />
        <Bar pr={DATA_ROW_SPEC.col2.line2.pr} color="#e1e2e3" height={12} />
        <Bar pr={DATA_ROW_SPEC.col2.line3.pr} color="#e1e2e3" height={12} />
      </div>
      {DATA_ROW_SPEC.rest.map((pr, i) => (
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

// A "Group" row (per Figma node 8500:45752's taller ~336px row instances):
// a "Main" line carrying the group's own identity + row actions, followed by
// one line per member account (indented into the same name column, no
// per-account actions - only the group as a whole is actionable). Column
// visibility deliberately differs from a flat DataRow, matching Figma
// exactly: the Main line shows cols 0/1 (identity) and cols 6-8 (rollup
// values), hides cols 2-5, and drops col 9 entirely; each Account line shows
// cols 1-5 (per-account detail), hides col 0, and drops cols 6-9 + actions.
function GroupMainRow({
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
    <div className="group border-b border-solid border-[#e1e6ef] flex items-start h-[89px] w-full shrink-0 hover:bg-[#f1f3f9]">
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <Bar pr={DATA_ROW_SPEC.col1.pr} color="#d1d2d3" height={16} />
      </Cell>
      <div
        className="flex flex-col gap-[8px] items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] border-r border-solid border-[#e1e6ef] sticky z-10"
        style={{ width: COLUMN_WIDTHS[1], left: STICKY_LEFT[1] }}
      >
        <Bar pr={DATA_ROW_SPEC.col2.line1.pr} color="#c1c2c3" height={16} />
        <Bar pr={DATA_ROW_SPEC.col2.line2.pr} color="#e1e2e3" height={12} />
        <Bar pr={DATA_ROW_SPEC.col2.line3.pr} color="#e1e2e3" height={12} />
      </div>
      {DATA_ROW_SPEC.rest.slice(0, 4).map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i + 2]}>
          <Bar pr={pr} color="#d1d2d3" height={16} invisible />
        </Cell>
      ))}
      {DATA_ROW_SPEC.rest.slice(4, 7).map((pr, i) => (
        <Cell key={i + 4} width={COLUMN_WIDTHS[i + 6]}>
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

function GroupAccountRow() {
  return (
    <div className="group border-b border-solid border-[#e1e6ef] flex items-start h-[89px] w-full shrink-0 hover:bg-[#f1f3f9]">
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <Bar pr={DATA_ROW_SPEC.col1.pr} color="#d1d2d3" height={16} invisible />
      </Cell>
      <div
        className="flex flex-col gap-[8px] items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] border-r border-solid border-[#e1e6ef] sticky z-10"
        style={{ width: COLUMN_WIDTHS[1], left: STICKY_LEFT[1] }}
      >
        <Bar pr={DATA_ROW_SPEC.col2.line1.pr} color="#c1c2c3" height={16} />
        <Bar pr={DATA_ROW_SPEC.col2.line2.pr} color="#e1e2e3" height={12} />
        <Bar pr={DATA_ROW_SPEC.col2.line3.pr} color="#e1e2e3" height={12} />
      </div>
      {DATA_ROW_SPEC.rest.slice(0, 4).map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i + 2]}>
          <Bar pr={pr} color="#d1d2d3" height={16} />
        </Cell>
      ))}
    </div>
  )
}

// The last row-slot in a Group (per Figma): not a member account, but a
// "Total / Close Group" footer - same row shape/column-visibility as an
// Account line, but its name-column only has 2 lines instead of 3, and the
// second line is the blue "Close Group" collapse link (rendered here as a
// plain colored bar, matching this pass's wireframe-only "just color boxes"
// scope - no real text/behavior yet).
function GroupFooterRow() {
  return (
    <div className="group border-b border-solid border-[#e1e6ef] flex items-start h-[89px] w-full shrink-0 hover:bg-[#f1f3f9]">
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <Bar pr={DATA_ROW_SPEC.col1.pr} color="#d1d2d3" height={16} invisible />
      </Cell>
      <div
        className="flex flex-col gap-[8px] items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] border-r border-solid border-[#e1e6ef] sticky z-10"
        style={{ width: COLUMN_WIDTHS[1], left: STICKY_LEFT[1] }}
      >
        <Bar pr={DATA_ROW_SPEC.col2.line1.pr} color="#c1c2c3" height={16} />
        <Bar pr={DATA_ROW_SPEC.col2.line3.pr} color="rgba(61,123,247,0.3)" height={12} />
      </div>
      {DATA_ROW_SPEC.rest.slice(0, 4).map((pr, i) => (
        <Cell key={i} width={COLUMN_WIDTHS[i + 2]}>
          <Bar pr={pr} color="#d1d2d3" height={16} />
        </Cell>
      ))}
    </div>
  )
}

function GroupRow({
  settings,
  onOpenSettings,
  onOpenDocuments,
  documentCount,
  onOpenReviewNotes,
  reviewNoteCount,
}: {
  settings: ExistingGroupSettings
  onOpenSettings: () => void
  onOpenDocuments: () => void
  documentCount: number
  onOpenReviewNotes: () => void
  reviewNoteCount: number
}) {
  return (
    <div className="flex flex-col items-start w-full shrink-0">
      <GroupMainRow
        onOpenSettings={onOpenSettings}
        onOpenDocuments={onOpenDocuments}
        documentCount={documentCount}
        onOpenReviewNotes={onOpenReviewNotes}
        reviewNoteCount={reviewNoteCount}
      />
      {settings.selectedAccountIds.map((accountId) => (
        <GroupAccountRow key={accountId} />
      ))}
      <GroupFooterRow />
    </div>
  )
}

// A row for a just-created Group/Account (see App's post-create feedback
// flow): visually a plain, generic DataRow (same placeholder bars as every
// other wireframe row - no icon, no real label, matching the table's current
// generic-only look) - `isHighlighted` layers a translucent tint over the
// whole row that fades out on its own (see `row-created-pulse` in
// index.css). `row` itself still carries `kind`/`label` for the toast copy
// in App - this row just doesn't display them.
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
      className="group relative border-b border-solid border-[#e1e6ef] flex items-start h-[89px] w-full shrink-0 hover:bg-[#f1f3f9]"
    >
      {isHighlighted && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ animation: 'row-created-pulse 3800ms ease-out forwards' }}
          onAnimationEnd={onHighlightDone}
        />
      )}
      <Cell width={COLUMN_WIDTHS[0]} stickyLeft={STICKY_LEFT[0]}>
        <Bar pr={DATA_ROW_SPEC.col1.pr} color="#d1d2d3" height={16} />
      </Cell>
      <div
        className="flex flex-col gap-[8px] items-start p-[16px] self-stretch shrink-0 box-border bg-white group-hover:bg-[#f1f3f9] border-r border-solid border-[#e1e6ef] sticky z-10"
        style={{ width: COLUMN_WIDTHS[1], left: STICKY_LEFT[1] }}
      >
        <Bar pr={DATA_ROW_SPEC.col2.line1.pr} color="#c1c2c3" height={16} />
        <Bar pr={DATA_ROW_SPEC.col2.line2.pr} color="#e1e2e3" height={12} />
        <Bar pr={DATA_ROW_SPEC.col2.line3.pr} color="#e1e2e3" height={12} />
      </div>
      {DATA_ROW_SPEC.rest.map((pr, i) => (
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

interface WireframeTableProps {
  rowCount?: number
  onOpenSettings: (settings: ExistingGroupSettings) => void
  createdRows?: CreatedRow[]
  highlightRowId?: string | null
  onHighlightDone?: () => void
  onOpenDocuments: (rowKey: string) => void
  documentCounts: Record<string, number>
  defaultDocumentCount: number
  onOpenReviewNotes: (rowKey: string) => void
  reviewNoteCounts: Record<string, number>
  defaultReviewNoteCount: number
}

// Mock group rows land at these 0-indexed positions among the plain flat
// rows (matching Figma's rough rhythm of a few flat rows between each taller
// "Group" row) - lets a handful of rows be named, clickable groups instead
// of every row being an anonymous placeholder.
const GROUP_ROW_POSITIONS = [2, 6, 11]

export function WireframeTable({
  rowCount = 12,
  onOpenSettings,
  createdRows = [],
  highlightRowId = null,
  onHighlightDone = () => {},
  onOpenDocuments,
  documentCounts,
  defaultDocumentCount,
  onOpenReviewNotes,
  reviewNoteCounts,
  defaultReviewNoteCount,
}: WireframeTableProps) {
  const groupRowAtPosition = new Map(GROUP_ROW_POSITIONS.map((pos, i) => [pos, MOCK_GROUP_ROWS[i]]))
  const createdRowRefs = useRef(new Map<string, HTMLDivElement>())

  // Scrolls the just-created row into view once it exists in the DOM -
  // `createdRows` and `highlightRowId` are always set together (see App's
  // `revealCreatedRow`), so the ref is already registered by the time this
  // effect runs.
  useEffect(() => {
    if (!highlightRowId) return
    createdRowRefs.current.get(highlightRowId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightRowId])

  return (
    <div className="border border-solid border-[#e1e6ef] rounded-[6px] w-full overflow-x-auto overflow-y-hidden">
      <div className="flex flex-col items-start" style={{ width: COLUMN_WIDTHS.reduce((a, b) => a + b, 0) }}>
        <HeaderRow />
        {createdRows.map((row) => {
          const rowKey = `recs-created-${row.id}`
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
          const groupRow = groupRowAtPosition.get(i)
          if (groupRow) {
            const rowKey = `recs-group-${groupRow.id}`
            return (
              <GroupRow
                key={i}
                settings={groupRow.settings}
                onOpenSettings={() => onOpenSettings(groupRow.settings)}
                onOpenDocuments={() => onOpenDocuments(rowKey)}
                documentCount={documentCounts[rowKey] ?? defaultDocumentCount}
                onOpenReviewNotes={() => onOpenReviewNotes(rowKey)}
                reviewNoteCount={reviewNoteCounts[rowKey] ?? defaultReviewNoteCount}
              />
            )
          }
          const rowKey = `recs-data-${i}`
          return (
            <DataRow
              key={i}
              onOpenSettings={() => onOpenSettings(MOCK_GROUP_ROWS[0].settings)}
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
