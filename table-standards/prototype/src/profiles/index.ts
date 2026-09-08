import type { ProfileModule } from './types.ts'
import P0Simple, { meta as p0 } from './P0-simple/index.tsx'
import P1Filterable, { meta as p1 } from './P1-filterable/index.tsx'
import P2Manipulation, { meta as p2 } from './P2-manipulation/index.tsx'
import P3aWorkflow, { meta as p3a } from './P3a-workflow/index.tsx'
import P3bAnalytical, { meta as p3b } from './P3b-analytical/index.tsx'

/** The five profiles, in ladder order. The showcase compiles them; each is edited in isolation. */
export const PROFILES: ProfileModule[] = [
  { meta: p0, Component: P0Simple },
  { meta: p1, Component: P1Filterable },
  { meta: p2, Component: P2Manipulation },
  { meta: p3a, Component: P3aWorkflow },
  { meta: p3b, Component: P3bAnalytical },
]

export type { ProfileModule, ProfileMeta } from './types.ts'
