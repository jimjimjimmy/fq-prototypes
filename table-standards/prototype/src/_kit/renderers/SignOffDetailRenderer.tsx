import { useState } from 'react'
import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { Person } from '../types.ts'
import { palette, avatarColor } from '../tokens.ts'

/**
 * Master/detail panel: expand a row to see + toggle each assignee's sign-off.
 * The row must expose an `assignees: Person[]` field. Writes back via applyTransaction —
 * demonstrates AG Grid's native master/detail (Andrew Baranak's "detail table", not a
 * horizontal pivot-expand).
 */
export function SignOffDetailRenderer(props: CustomCellRendererProps) {
  const row = props.data
  const api = props.api
  if (!row?.assignees) return null
  const assignees = row.assignees as Person[]

  return (
    <div className="px-6 py-4" style={{ backgroundColor: palette.surfaceWeakest, borderBottom: `1px solid ${palette.border}` }}>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: palette.textTertiary }}>
        Sign-off status
      </div>
      <div className="flex flex-col gap-3">
        {assignees.map((assignee, index) => (
          <AssigneeRow
            key={assignee.initials + index}
            assignee={assignee}
            onToggle={() => {
              const updated = assignees.map((a, i) =>
                i === index
                  ? { ...a, signedOff: !a.signedOff, signOffDate: !a.signedOff ? todayLabel() : undefined }
                  : a,
              )
              api.applyTransaction({ update: [{ ...row, assignees: updated }] })
            }}
          />
        ))}
      </div>
    </div>
  )
}

function AssigneeRow({ assignee, onToggle }: { assignee: Person; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex items-center gap-3 h-9">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
        style={{ backgroundColor: avatarColor(assignee.name) }}
      >
        {assignee.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium truncate" style={{ color: palette.textBody }}>
          {assignee.name}
        </div>
        <div className="text-[11px]" style={{ color: palette.textMuted }}>
          {assignee.role}
        </div>
      </div>
      <div className="text-[11px] w-24 text-right" style={{ color: palette.textMuted }}>
        {assignee.signedOff ? (
          <span style={{ color: palette.success }}>{assignee.signOffDate}</span>
        ) : (
          'Waiting'
        )}
      </div>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-9 h-5 rounded-full transition-colors shrink-0"
        style={{
          backgroundColor: assignee.signedOff
            ? hovered ? palette.successStrong : palette.success
            : hovered ? '#c5cdd8' : palette.strokeForms,
        }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
          style={{ left: assignee.signedOff ? 18 : 2 }}
        />
      </button>
    </div>
  )
}

function todayLabel() {
  // Static label — Date.now() is unavailable in some harness contexts; a fixed demo date is fine.
  return '07/09/2026'
}
