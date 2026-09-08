import { useEffect, useState } from 'react'

export const ENTER_MS = 200

// Same premium ease-out as RevealTransition/SlideScreen - one motion voice
// across the drawer, whether something is revealing, drilling in, or (here)
// appearing one at a time in a list.
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const OFFSET_PX = 8

/**
 * Grows a freshly-mounted item's height in (grid-template-rows 0fr->1fr, the
 * same technique RevealTransition uses) while it fades + slides into place.
 * Unlike RevealTransition (a single block toggling visibility via a `show`
 * prop), this animates each instance once on mount - intended for list rows
 * that appear one at a time, e.g. each additional account added to a
 * selection. Without the height grow, a new row snaps in at full height
 * instantly and only its content fades, which reads as a jump because every
 * row below it shifts down in one frame instead of easing down with it.
 * Existing rows don't replay the animation on re-render since React only
 * mounts a new instance for a genuinely new `key`.
 */
export function EnterTransition({ className, children }: { className?: string; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="grid w-full"
      style={{
        gridTemplateRows: entered ? '1fr' : '0fr',
        transition: `grid-template-rows ${ENTER_MS}ms ${EASING}`,
      }}
    >
      <div
        className={`min-h-0 overflow-hidden ${className ?? ''}`}
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : `translateY(-${OFFSET_PX}px)`,
          transition: `opacity ${ENTER_MS}ms ${EASING}, transform ${ENTER_MS}ms ${EASING}`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
