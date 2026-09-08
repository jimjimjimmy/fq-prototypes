import type React from 'react'

/** Metadata that drives the showcase nav + the ProfileFrame spec side-panel. */
export interface ProfileMeta {
  /** Route id, e.g. "p1". */
  id: string
  /** Ladder code, e.g. "P1". */
  code: string
  title: string
  /** One-line description of the profile. */
  subtitle: string
  /** Representative product surface this profile is modeled on. */
  surface: string
  /** Which cross-cutting patterns are ON here + why — the teaching content. */
  patterns: { name: string; detail: string }[]
}

export interface ProfileModule {
  meta: ProfileMeta
  Component: React.FC
}
