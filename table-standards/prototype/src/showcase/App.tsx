import { useEffect, useState } from 'react'
import { registerGridModules } from '@kit'
import '../_kit/filters/filterStyles.css'
import { PROFILES } from '../profiles/index.ts'
import { ShowcaseNav } from './ShowcaseNav.tsx'
import { ProfileFrame } from './ProfileFrame.tsx'

// Register AG Grid modules once for the whole showcase.
registerGridModules()

/**
 * Master showcase — compiles all five profiles into one runnable example.
 * Each profile is deep-linkable via the URL hash (#p0 … #p3b) and can be iterated in isolation
 * (its folder) without touching the others; this app is what "compiles the versions together."
 */
export function App() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1))

  useEffect(() => {
    const onHash = () => setHash(window.location.hash.slice(1))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const active = PROFILES.find((p) => p.meta.id === hash) ?? PROFILES[0]

  return (
    <div className="h-full flex">
      <ShowcaseNav profiles={PROFILES.map((p) => p.meta)} activeId={active.meta.id} />
      <ProfileFrame profile={active} />
    </div>
  )
}
