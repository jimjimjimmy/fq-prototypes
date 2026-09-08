import type React from 'react'
import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { palette } from '../tokens.ts'

/**
 * Pinned row-action icons: notes / attachments (with count badges) / settings / follow / kebab.
 * Reads optional `noteCount`, `attachmentCount`, `isFollowed` off the row.
 */
export function ActionRenderer(props: CustomCellRendererProps) {
  const row = props.data
  if (!row) return null
  const noteCount = row.noteCount ?? 0
  const attachmentCount = row.attachmentCount ?? 0
  const isFollowed = Boolean(row.isFollowed)

  return (
    <div className="flex items-center gap-0.5">
      <IconButton title="Notes" count={noteCount}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </IconButton>
      <IconButton title="Attachments" count={attachmentCount}>
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </IconButton>
      <IconButton title="Settings">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </IconButton>
      <button
        className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#f1f5f9]"
        style={{ color: isFollowed ? palette.success : palette.textTertiary }}
        title={isFollowed ? 'Following' : 'Follow'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isFollowed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#f1f5f9]" style={{ color: palette.textTertiary }} title="More">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
    </div>
  )
}

function IconButton({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <button
      className="relative w-7 h-7 rounded flex items-center justify-center hover:bg-[#f1f5f9]"
      style={{ color: palette.textTertiary }}
      title={title}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
      {count != null && count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full text-white text-[9px] font-medium flex items-center justify-center px-0.5"
          style={{ backgroundColor: palette.danger }}
        >
          {count}
        </span>
      )}
    </button>
  )
}
