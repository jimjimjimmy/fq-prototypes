import { useEffect, useState } from 'react'

export const SLIDE_MS = 200

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const OFFSET_PX = 24

interface SlideScreenProps {
  exiting: boolean
  // Which side this screen's offscreen position sits on - a drill-in enters
  // from and exits back toward 'right' (default); the main view, returning
  // from a drill-in, does the mirror image and uses 'left'.
  from?: 'right' | 'left'
  // False skips the entrance animation entirely, rendering already in the
  // settled position. Used for the very first mount of the main view (opening
  // the drawer fresh, with no drill-in to return from) - only a genuine
  // return-from-drill-in mount should play the entrance.
  animateEnter?: boolean
  children: React.ReactNode
}

/**
 * Wraps a screen so it slides + fades in from one side on mount, and reverses
 * (slides + fades out toward that same side) when `exiting` flips true. The
 * caller must delay the actual unmount/view change by SLIDE_MS so the exit
 * animation has time to play.
 */
export function SlideScreen({ exiting, from = 'right', animateEnter = true, children }: SlideScreenProps) {
  const [entered, setEntered] = useState(!animateEnter)

  useEffect(() => {
    if (!animateEnter) return
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [animateEnter])

  const shown = entered && !exiting
  const offscreenX = from === 'left' ? -OFFSET_PX : OFFSET_PX

  return (
    <div
      className="flex flex-col h-full w-full"
      style={{
        transform: shown ? 'translateX(0)' : `translateX(${offscreenX}px)`,
        opacity: shown ? 1 : 0,
        transition: `transform ${SLIDE_MS}ms ${EASING}, opacity ${SLIDE_MS}ms ${EASING}`,
      }}
    >
      {children}
    </div>
  )
}
