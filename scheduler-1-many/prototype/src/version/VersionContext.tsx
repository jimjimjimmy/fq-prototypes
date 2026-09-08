import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Prototype version controller.
 *
 * We're exploring "Event Based" Autopilot directly on top of the live
 * "One-to-Many" prototype rather than forking the code or branching git.
 * A single global toggle (persisted to localStorage) lets us flip the entire
 * app between the two concepts at runtime. See `PrototypeController` for the
 * floating overlay that drives this, and `App.tsx` for the swap pattern.
 */

export type AppVersion = 'one-to-many' | 'event-based'

/** Human-readable labels — the only place version display strings live. */
export const VERSION_LABELS: Record<AppVersion, string> = {
  'one-to-many': 'One-to-Many',
  'event-based': 'Event Based',
}

/** Ordered list for rendering the segmented control. */
export const VERSION_ORDER: AppVersion[] = ['one-to-many', 'event-based']

// NOTE: Intentionally NOT renamed during the Schedule→Job / Scheduler→Autopilot
// terminology refactor. This is the localStorage persistence namespace (keyed to
// the project slug), not product copy — renaming it would silently discard every
// existing user's saved version selection. Treated as an internal contract.
const STORAGE_KEY = 'scheduler-1-many:prototype-version'
const DEFAULT_VERSION: AppVersion = 'one-to-many'

interface VersionContextValue {
  version: AppVersion
  setVersion: (next: AppVersion) => void
  toggleVersion: () => void
}

const VersionContext = createContext<VersionContextValue | null>(null)

function readStoredVersion(): AppVersion {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'one-to-many' || stored === 'event-based') return stored
  } catch {
    // localStorage can throw in private-mode / sandboxed contexts — fall through.
  }
  return DEFAULT_VERSION
}

export function VersionProvider({ children }: { children: ReactNode }) {
  // Lazy initializer so we read storage once, before first paint.
  const [version, setVersionState] = useState<AppVersion>(readStoredVersion)

  // Persist every change. Kept in an effect so a write failure never breaks render.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, version)
    } catch {
      // Ignore — persistence is best-effort for a prototype.
    }
  }, [version])

  const setVersion = useCallback((next: AppVersion) => setVersionState(next), [])

  const toggleVersion = useCallback(
    () =>
      setVersionState((prev) =>
        prev === 'one-to-many' ? 'event-based' : 'one-to-many',
      ),
    [],
  )

  const value = useMemo(
    () => ({ version, setVersion, toggleVersion }),
    [version, setVersion, toggleVersion],
  )

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>
}

export function useVersion(): VersionContextValue {
  const ctx = useContext(VersionContext)
  if (!ctx) {
    throw new Error('useVersion must be used within a <VersionProvider>')
  }
  return ctx
}
