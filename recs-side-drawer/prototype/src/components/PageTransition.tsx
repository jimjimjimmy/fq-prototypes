import { useEffect, useState } from 'react'

const SLIDE_MS = 450
// A softer ease-in-out (gentle start, gentle finish) than the drawer's own
// sharp ease-out - that curve snaps into motion instantly, which read as too
// abrupt for a full-page swap.
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
const OFFSET_PX = 32

interface PageTransitionProps {
  // Which side the incoming page slides in from - matches its position in
  // the Navbar's tab order relative to the page being left (see App's
  // `pageDirection`), same "from the direction you'd expect" convention as
  // the side drawer's own SlideScreen.
  from: 'left' | 'right'
  children: React.ReactNode
}

// A simpler, one-directional cousin of the drawer's SlideScreen: just an
// entrance (no exit choreography), since a page swap unmounts the old page
// outright rather than needing it to slide out first like a drill-in does.
// Mount this keyed by page so each switch gets a fresh entrance.
export function PageTransition({ from, children }: PageTransitionProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const offscreenX = from === 'left' ? -OFFSET_PX : OFFSET_PX

  return (
    <div
      className="flex flex-col w-full"
      style={{
        transform: entered ? 'translateX(0)' : `translateX(${offscreenX}px)`,
        opacity: entered ? 1 : 0,
        transition: `transform ${SLIDE_MS}ms ${EASING}, opacity ${SLIDE_MS}ms ${EASING}`,
      }}
    >
      {children}
    </div>
  )
}
