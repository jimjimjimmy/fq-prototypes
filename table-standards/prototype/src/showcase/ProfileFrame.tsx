import type React from 'react'
import { useState } from 'react'
import { t, palette, decisionsForProfile, type Decision } from '@kit'
import type { ProfileModule } from '../profiles/index.ts'
import type { ProfileLevel } from '../_kit/decisions.ts'

/** Renders one profile's live table + a (collapsible) spec side-panel explaining the patterns + decisions. */
export function ProfileFrame({ profile }: { profile: ProfileModule }) {
  const { meta, Component } = profile
  const [specOpen, setSpecOpen] = useState(true)
  return (
    <div className="flex-1 min-w-0 h-full flex flex-col">
      {/* Profile header */}
      <div className="px-6 py-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${palette.border}` }}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: palette.successBg, color: palette.success }}
            >
              {meta.code}
            </span>
            <h1 className="text-[18px] font-semibold" style={{ color: t.textBody }}>
              {meta.title}
            </h1>
          </div>
          <p className="text-[13px] mt-1" style={{ color: t.textBodySecondary }}>
            {meta.subtitle}
          </p>
        </div>
        <button
          onClick={() => setSpecOpen((o) => !o)}
          className="h-8 px-3 rounded-md border text-[12px] font-medium shrink-0"
          style={{ borderColor: t.strokeForms, color: t.textBodySecondary, backgroundColor: t.surfaceBase }}
        >
          {specOpen ? 'Hide notes' : 'Show notes'}
        </button>
      </div>

      {/* Body: live table + spec panel */}
      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0 p-6 overflow-hidden">
          {/* key remounts the profile on switch → clean grid state */}
          <Component key={meta.id} />
        </div>
        {specOpen && <SpecPanel profile={profile} />}
      </div>
    </div>
  )
}

function SpecPanel({ profile }: { profile: ProfileModule }) {
  const { meta } = profile
  const decisions = decisionsForProfile(meta.code as ProfileLevel)
  const confirmed = decisions.filter((d) => d.status === 'confirmed')
  const needsValidation = decisions.filter((d) => d.status === 'needs-validation')
  const open = decisions.filter((d) => d.status === 'open')

  return (
    <aside
      className="w-[300px] shrink-0 h-full overflow-auto p-5"
      style={{ backgroundColor: palette.surfaceWeakest, borderLeft: `1px solid ${palette.border}` }}
    >
      {/* Patterns in play */}
      <SectionLabel>Patterns in play</SectionLabel>
      <div className="text-[11px] mb-1" style={{ color: t.textMuted }}>
        Representative surface: <span style={{ color: t.textBody }}>{meta.surface}</span>
      </div>
      <div className="flex flex-col gap-3 mb-6">
        {meta.patterns.map((p) => (
          <div key={p.name}>
            <div className="text-[13px] font-semibold" style={{ color: t.textBody }}>
              {p.name}
            </div>
            <div className="text-[12px] leading-snug mt-0.5" style={{ color: t.textBodySecondary }}>
              {p.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Needs validation */}
      {needsValidation.length > 0 && (
        <>
          <SectionLabel>Needs validation</SectionLabel>
          <div className="flex flex-col gap-3 mb-6">
            {needsValidation.map((d) => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </>
      )}

      {/* Open decisions */}
      {open.length > 0 && (
        <>
          <SectionLabel>Open decisions</SectionLabel>
          <div className="flex flex-col gap-3 mb-6">
            {open.map((d) => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </>
      )}

      {/* Confirmed — grouped by the level each rule originates from */}
      <SectionLabel>Confirmed standards</SectionLabel>
      <div className="flex flex-col gap-4">
        {groupByLevel(confirmed).map(({ level, decisions }) => (
          <div key={level}>
            <LevelHeading level={level} count={decisions.length} current={meta.code as ProfileLevel} />
            <div className="flex flex-col gap-3">
              {decisions.map((d) => (
                <DecisionCard key={d.id} decision={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

const PROFILE_ORDER: ProfileLevel[] = ['P0', 'P1', 'P2', 'P3a', 'P3b']
const LEVEL_TITLES: Record<ProfileLevel, string> = {
  P0: 'Simple',
  P1: 'Filterable',
  P2: 'Manipulation',
  P3a: 'Workflow-complex',
  P3b: 'Analytical-complex',
}

/** Buckets decisions by the level they originate from (appliesFrom), in ladder order. */
function groupByLevel(decisions: Decision[]): { level: ProfileLevel; decisions: Decision[] }[] {
  return PROFILE_ORDER.map((level) => ({
    level,
    decisions: decisions.filter((d) => d.appliesFrom === level),
  })).filter((g) => g.decisions.length > 0)
}

function LevelHeading({ level, count, current }: { level: ProfileLevel; count: number; current: ProfileLevel }) {
  const isCurrent = level === current
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        className="text-[11px] font-bold px-1.5 py-0.5 rounded"
        style={{
          backgroundColor: isCurrent ? palette.successBg : palette.surfaceWeaker,
          color: isCurrent ? palette.success : t.textBodySecondary,
        }}
      >
        {level}
      </span>
      <span className="text-[11px] font-medium" style={{ color: t.textBodySecondary }}>
        {LEVEL_TITLES[level]}
        {isCurrent && ' · this level'}
      </span>
      <span className="text-[11px]" style={{ color: t.textMuted }}>
        {count}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: t.textMuted }}>
      {children}
    </div>
  )
}

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', bg: palette.successBg, text: palette.success },
  'needs-validation': { label: 'Needs validation', bg: palette.warningBg, text: palette.warning },
  open: { label: 'Open', bg: palette.infoBg, text: palette.info },
} as const

function DecisionCard({ decision }: { decision: Decision }) {
  const cfg = STATUS_CONFIG[decision.status]
  return (
    <div
      className="rounded-md p-3"
      style={{ backgroundColor: t.surfaceBase, border: `1px solid ${palette.border}` }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-[12px] font-semibold leading-tight" style={{ color: t.textBody }}>
          {decision.title}
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
          style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
      </div>
      <div className="text-[11px] leading-snug" style={{ color: t.textBodySecondary }}>
        {decision.detail}
      </div>
      {decision.validationNote && (
        <div
          className="mt-2 text-[11px] leading-snug px-2 py-1.5 rounded"
          style={{ backgroundColor: palette.warningBg, color: palette.warning }}
        >
          <span className="font-semibold">Validate: </span>
          {decision.validationNote}
        </div>
      )}
    </div>
  )
}
