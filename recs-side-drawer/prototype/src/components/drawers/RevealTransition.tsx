import { useEffect, useState } from 'react'

export const REVEAL_MS = 200

// Same premium ease-out used by SlideScreen's drill-in slide - reused here so
// every motion in this drawer feels like one system, not two different ones.
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const OFFSET_PX = 8

/**
 * Grows/shrinks (grid-template-rows 0fr<->1fr) + fades a block of content in
 * (sliding down into place) or out (sliding up out of place). Always mounts
 * `children` regardless of `show` - conditionally unmounting it would remove
 * the target the animation is measuring against and cause a hard cut instead
 * of a smooth motion.
 *
 * A plain `show`-driven style only animates when the component was already
 * mounted for the change - if it mounts fresh with `show` already true (e.g.
 * returning from a drill-in remounts the whole main view), there's no prior
 * frame to transition from and it just pops in. The `rendered` flag below
 * forces one extra frame at the hidden state on mount so the down-in motion
 * always plays, no matter whether this is a normal toggle or a fresh mount.
 */
export function RevealTransition({ show, children }: { show: boolean; children: React.ReactNode }) {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRendered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const active = rendered && show

  return (
    <div
      className="w-full grid"
      style={{
        gridTemplateRows: active ? '1fr' : '0fr',
        transition: `grid-template-rows ${REVEAL_MS}ms ${EASING}`,
      }}
    >
      <div
        className="min-h-0 overflow-hidden w-full"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : `translateY(-${OFFSET_PX}px)`,
          transition: `opacity ${REVEAL_MS}ms ${EASING}, transform ${REVEAL_MS}ms ${EASING}`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
