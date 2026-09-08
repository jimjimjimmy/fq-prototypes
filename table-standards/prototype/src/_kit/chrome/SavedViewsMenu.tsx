import { useEffect, useRef, useState } from 'react'
import { t } from '../tokens.ts'
import {
  loadViews,
  persistViews,
  captureState,
  applyState,
  makeViewId,
  type SavedView,
} from '../savedViews.ts'

/** Dropdown to save the current grid layout+filters and recall saved views. */
export function SavedViewsMenu({ profileId, api }: { profileId: string; api: any }) {
  const [open, setOpen] = useState(false)
  const [views, setViews] = useState<SavedView[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setViews(loadViews(profileId)), [profileId])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const save = () => {
    const name = window.prompt('Name this view')?.trim()
    if (!name || !api) return
    const view: SavedView = { id: makeViewId(name, views), name, ...captureState(api) }
    const next = [...views, view]
    setViews(next)
    persistViews(profileId, next)
    setActiveId(view.id)
  }

  const apply = (view: SavedView) => {
    applyState(api, view)
    setActiveId(view.id)
    setOpen(false)
  }

  const remove = (id: string) => {
    const next = views.filter((v) => v.id !== id)
    setViews(next)
    persistViews(profileId, next)
    if (activeId === id) setActiveId(null)
  }

  const activeName = views.find((v) => v.id === activeId)?.name ?? 'Default view'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-[12px] font-medium"
        style={{ borderColor: t.strokeForms, color: t.textBodySecondary, backgroundColor: t.surfaceBase }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        {activeName}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-60 rounded-lg border py-1 z-20"
          style={{ borderColor: t.border, backgroundColor: t.surfaceBase, boxShadow: '0 6px 20px rgba(29,36,51,0.12)' }}
        >
          {views.length === 0 && (
            <div className="px-3 py-2 text-[12px]" style={{ color: t.textMuted }}>
              No saved views yet
            </div>
          )}
          {views.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between px-3 py-1.5 hover:bg-[#f8fafc] cursor-pointer"
              onClick={() => apply(v)}
            >
              <span className="text-[12px]" style={{ color: v.id === activeId ? t.success : t.textBody }}>
                {v.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  remove(v.id)
                }}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/5"
                title="Delete view"
                style={{ color: t.textMuted }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <div className="my-1 border-t" style={{ borderColor: t.borderWeak }} />
          <button
            onClick={save}
            className="w-full text-left px-3 py-1.5 text-[12px] font-semibold hover:bg-[#f8fafc]"
            style={{ color: t.info }}
          >
            + Save current view
          </button>
        </div>
      )}
    </div>
  )
}
