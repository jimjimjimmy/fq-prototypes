import { useEffect, useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { useVersion, VERSION_LABELS, VERSION_ORDER } from '../version/VersionContext'

/**
 * Floating prototype-environment overlay.
 *
 * Sits above everything (z-index 9999) and lets you flip the whole app between
 * Autopilot versions at runtime. Draggable by the grip handle so it can be moved
 * out of the way of any screen area; its position is persisted to localStorage.
 * Defaults to the bottom-right corner. Rendered once outside the version switch,
 * so it applies to both versions. Intentionally NOT styled with FlowUI — it's
 * prototype chrome that lives outside the product surface.
 */

const POS_KEY = 'scheduler-1-many:prototype-controller-pos'
const MARGIN = 16 // viewport edge padding / default corner offset

type Pos = { x: number; y: number }

function readStoredPos(): Pos | null {
  try {
    const raw = window.localStorage.getItem(POS_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (typeof p?.x === 'number' && typeof p?.y === 'number') return p
  } catch {
    // ignore malformed / unavailable storage
  }
  return null
}

export function PrototypeController() {
  const { version, setVersion } = useVersion()
  const containerRef = useRef<HTMLDivElement>(null)
  // null position => use the default bottom-right corner.
  const [pos, setPos] = useState<Pos | null>(readStoredPos)
  const [dragging, setDragging] = useState(false)
  // Captured at drag start: pointer origin + element's top-left at that moment.
  const dragStart = useRef({ px: 0, py: 0, ox: 0, oy: 0 })

  const clamp = (x: number, y: number): Pos => {
    const el = containerRef.current
    const w = el?.offsetWidth ?? 0
    const h = el?.offsetHeight ?? 0
    return {
      x: Math.max(MARGIN, Math.min(x, window.innerWidth - w - MARGIN)),
      y: Math.max(MARGIN, Math.min(y, window.innerHeight - h - MARGIN)),
    }
  }

  // Attach window listeners only while dragging.
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      const { px, py, ox, oy } = dragStart.current
      setPos(clamp(ox + (e.clientX - px), oy + (e.clientY - py)))
    }
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging])

  // Persist position whenever it settles.
  useEffect(() => {
    if (!pos) return
    try {
      window.localStorage.setItem(POS_KEY, JSON.stringify(pos))
    } catch {
      // best-effort
    }
  }, [pos])

  // Keep it on-screen if the viewport shrinks.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onHandlePointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    dragStart.current = { px: e.clientX, py: e.clientY, ox: rect.left, oy: rect.top }
    setDragging(true)
    e.preventDefault()
  }

  return (
    <div
      ref={containerRef}
      style={{
        zIndex: 9999,
        ...(pos
          ? { left: pos.x, top: pos.y }
          : { right: MARGIN, bottom: MARGIN }),
      }}
      className="fixed select-none"
      role="region"
      aria-label="Prototype version controller"
    >
      <div className="flex items-center gap-1 rounded-full bg-[#1d2433]/85 px-2 py-1.5 shadow-lg backdrop-blur-sm ring-1 ring-white/10">
        {/* Drag handle — grab here to move the controller. */}
        <button
          type="button"
          onPointerDown={onHandlePointerDown}
          aria-label="Drag to move"
          title="Drag to move"
          style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
          className="flex items-center gap-1 pl-1 pr-1 text-white/45 hover:text-white/70"
        >
          <GripVertical size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Prototype
          </span>
        </button>
        <div
          className="flex items-center gap-0.5 rounded-full bg-black/25 p-0.5"
          role="group"
          aria-label="Active version"
        >
          {VERSION_ORDER.map((v) => {
            const isActive = v === version
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                aria-pressed={isActive}
                className={[
                  'rounded-full px-3 py-1 text-[12px] font-medium transition-colors',
                  isActive
                    ? 'bg-white text-[#1d2433] shadow-sm'
                    : 'text-white/70 hover:text-white',
                ].join(' ')}
              >
                {VERSION_LABELS[v]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
