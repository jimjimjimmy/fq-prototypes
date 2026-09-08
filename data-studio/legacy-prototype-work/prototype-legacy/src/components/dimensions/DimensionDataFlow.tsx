import { useRef, useLayoutEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDimensionById } from '../../data/dimensions'
import type { DimensionSource, DimensionModelRef } from '../../data/dimensions'

type Mode = 'overview' | 'fields'
type RefsMap = Map<string, HTMLElement>

// ── SVG helpers ───────────────────────────────────────────────────────────────

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`
}

function rightOf(el: HTMLElement, base: HTMLElement) {
  const e = el.getBoundingClientRect(), b = base.getBoundingClientRect()
  return { x: e.right - b.left, y: e.top - b.top + e.height / 2 }
}

function leftOf(el: HTMLElement, base: HTMLElement) {
  const e = el.getBoundingClientRect(), b = base.getBoundingClientRect()
  return { x: e.left - b.left, y: e.top - b.top + e.height / 2 }
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDb() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="7" cy="3.5" rx="4.5" ry="1.75" stroke="#64748B" strokeWidth="1.2" />
      <path d="M2.5 3.5v3c0 .966 2.015 1.75 4.5 1.75s4.5-.784 4.5-1.75v-3" stroke="#64748B" strokeWidth="1.2" />
      <path d="M2.5 6.5v3c0 .966 2.015 1.75 4.5 1.75s4.5-.784 4.5-1.75v-3" stroke="#64748B" strokeWidth="1.2" />
    </svg>
  )
}

function IconDim() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="#3B82F6" strokeWidth="1.2" />
      <rect x="8"   y="1.5" width="4.5" height="4.5" rx="1" stroke="#3B82F6" strokeWidth="1.2" />
      <rect x="1.5" y="8"   width="4.5" height="4.5" rx="1" stroke="#3B82F6" strokeWidth="1.2" />
      <rect x="8"   y="8"   width="4.5" height="4.5" rx="1" stroke="#3B82F6" strokeWidth="1.2" />
    </svg>
  )
}

function IconModel() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="#64748B" strokeWidth="1.2" />
      <path d="M1.5 5h11" stroke="#64748B" strokeWidth="1.2" />
      <path d="M5.5 5v7.5"  stroke="#64748B" strokeWidth="1.2" />
    </svg>
  )
}

function IconField() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <rect x=".75" y="2" width="8.5" height="6" rx="1" stroke="#94A3B8" strokeWidth="1" />
      <path d="M3 5h4M3 7h2" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function IconKey() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="3.5" cy="5" r="2" stroke="#3B82F6" strokeWidth="1" />
      <path d="M5.5 5H9M7.5 5v1.5" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// ── Node Cards ────────────────────────────────────────────────────────────────

function SourceCard({ source, mode, refs }: { source: DimensionSource; mode: Mode; refs: RefsMap }) {
  return (
    <div
      ref={el => { if (el) refs.set(`src-${source.id}`, el); else refs.delete(`src-${source.id}`) }}
      style={{
        borderRadius: 8,
        border: '1px solid #E2E8F0',
        borderLeft: '3px solid #94A3B8',
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
        <IconDb />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{source.name}</span>
      </div>
      {mode === 'fields' && source.sourceField && (
        <div style={{ borderTop: '1px solid #E2E8F0', padding: '8px 12px' }}>
          <div
            ref={el => { if (el) refs.set(`src-${source.id}-field`, el); else refs.delete(`src-${source.id}-field`) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px', borderRadius: 4, backgroundColor: '#F1F5F9',
            }}
          >
            <IconField />
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{source.sourceField}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function DimCard({ name, records, mode, refs }: {
  name: string; records: number | null; mode: Mode; refs: RefsMap
}) {
  return (
    <div
      ref={el => { if (el) refs.set('dim', el); else refs.delete('dim') }}
      style={{
        borderRadius: 8,
        border: '2px solid #3B82F6',
        backgroundColor: '#EFF6FF',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px' }}>
        <IconDim />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1D4ED8' }}>{name}</div>
          {records !== null && (
            <div style={{ fontSize: 11, color: '#60A5FA', marginTop: 1 }}>{records.toLocaleString()} values</div>
          )}
        </div>
      </div>
      {mode === 'fields' && (
        <div style={{ borderTop: '1px solid #BFDBFE', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            ref={el => { if (el) refs.set('dim-label', el); else refs.delete('dim-label') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px', borderRadius: 4, backgroundColor: '#DBEAFE',
            }}
          >
            <IconField />
            <span style={{ fontSize: 11, color: '#1D4ED8', fontFamily: 'monospace' }}>label</span>
          </div>
          <div
            ref={el => { if (el) refs.set('dim-key', el); else refs.delete('dim-key') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px', borderRadius: 4, backgroundColor: '#DBEAFE',
            }}
          >
            <IconKey />
            <span style={{ fontSize: 11, color: '#1D4ED8', fontFamily: 'monospace' }}>key</span>
          </div>
        </div>
      )}
    </div>
  )
}

function ModelCard({ model, mode, refs, onClick }: {
  model: DimensionModelRef; mode: Mode; refs: RefsMap; onClick: () => void
}) {
  const isPrimary = model.role === 'primary'
  return (
    <div
      ref={el => { if (el) refs.set(`mdl-${model.id}`, el); else refs.delete(`mdl-${model.id}`) }}
      onClick={onClick}
      style={{
        borderRadius: 8,
        border: '1px solid #E2E8F0',
        borderLeft: `3px solid ${isPrimary ? '#22C55E' : '#CBD5E1'}`,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconModel />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#2563EB' }}>{model.name}</span>
        </div>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: 10,
          backgroundColor: isPrimary ? '#DCFCE7' : '#F1F5F9',
          color: isPrimary ? '#16A34A' : '#64748B',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
          flexShrink: 0,
          marginLeft: 8,
        }}>
          {model.role}
        </span>
      </div>
      {mode === 'fields' && model.modelField && (
        <div style={{ borderTop: '1px solid #E2E8F0', padding: '8px 12px' }}>
          <div
            ref={el => { if (el) refs.set(`mdl-${model.id}-field`, el); else refs.delete(`mdl-${model.id}-field`) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px', borderRadius: 4, backgroundColor: '#F8FAFC',
            }}
          >
            <IconField />
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{model.modelField}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function DimensionDataFlow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dimension = id ? getDimensionById(id) : undefined

  const [mode, setMode] = useState<Mode>('overview')
  const [paths, setPaths] = useState<{ d: string; stroke: string }[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef<RefsMap>(new Map())

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !dimension) return

    const r = refs.current
    const result: { d: string; stroke: string }[] = []

    if (mode === 'overview') {
      const dimEl = r.get('dim')
      if (!dimEl) return

      dimension.sources.forEach(src => {
        const srcEl = r.get(`src-${src.id}`)
        if (!srcEl) return
        const s = rightOf(srcEl, container)
        const e = leftOf(dimEl, container)
        result.push({ d: bezier(s.x, s.y, e.x, e.y), stroke: '#CBD5E1' })
      })

      dimension.modelsUsing.forEach(mdl => {
        const mdlEl = r.get(`mdl-${mdl.id}`)
        if (!mdlEl) return
        const s = rightOf(dimEl, container)
        const e = leftOf(mdlEl, container)
        result.push({ d: bezier(s.x, s.y, e.x, e.y), stroke: '#CBD5E1' })
      })
    } else {
      const dimLabelEl = r.get('dim-label')
      const dimKeyEl   = r.get('dim-key')

      dimension.sources.forEach(src => {
        if (!src.sourceField || !dimLabelEl) return
        const srcFieldEl = r.get(`src-${src.id}-field`)
        if (!srcFieldEl) return
        const s = rightOf(srcFieldEl, container)
        const e = leftOf(dimLabelEl, container)
        result.push({ d: bezier(s.x, s.y, e.x, e.y), stroke: '#93C5FD' })
      })

      dimension.modelsUsing.forEach(mdl => {
        if (!mdl.modelField || !dimKeyEl) return
        const mdlFieldEl = r.get(`mdl-${mdl.id}-field`)
        if (!mdlFieldEl) return
        const s = rightOf(dimKeyEl, container)
        const e = leftOf(mdlFieldEl, container)
        result.push({ d: bezier(s.x, s.y, e.x, e.y), stroke: '#93C5FD' })
      })
    }

    setPaths(result)
  }, [dimension, mode])

  if (!dimension) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 24, overflow: 'auto' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>
          {dimension.sources.length} {dimension.sources.length === 1 ? 'source' : 'sources'}
          {' → '}
          {dimension.modelsUsing.length} {dimension.modelsUsing.length === 1 ? 'model' : 'models'}
        </span>
        <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
          {(['overview', 'fields'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: mode === m ? 600 : 400,
                backgroundColor: mode === m ? '#EFF6FF' : 'transparent',
                color: mode === m ? '#2563EB' : '#6B7280',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {m === 'overview' ? 'Overview' : 'Fields'}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div
        ref={containerRef}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minHeight: 200 }}
      >
        {/* Sources column */}
        <div style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, alignSelf: 'center' }}>
          {dimension.sources.map(src => (
            <SourceCard key={src.id} source={src} mode={mode} refs={refs.current} />
          ))}
        </div>

        {/* Gap — curves live here */}
        <div style={{ flex: 1 }} />

        {/* Dimension card */}
        <div style={{ width: 200, flexShrink: 0, alignSelf: 'center' }}>
          <DimCard name={dimension.name} records={dimension.records} mode={mode} refs={refs.current} />
        </div>

        {/* Gap */}
        <div style={{ flex: 1 }} />

        {/* Models column */}
        <div style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, alignSelf: 'center' }}>
          {dimension.modelsUsing.length > 0 ? (
            dimension.modelsUsing.map(mdl => (
              <ModelCard
                key={mdl.id}
                model={mdl}
                mode={mode}
                refs={refs.current}
                onClick={() => navigate(`/data-studio/model/${mdl.id}/overview`)}
              />
            ))
          ) : (
            <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', padding: '10px 0' }}>
              No models linked
            </div>
          )}
        </div>

        {/* SVG overlay */}
        <svg
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', overflow: 'visible',
          }}
        >
          <defs>
            <marker id="arr-gray" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 7 3 L 0 6 Z" fill="#CBD5E1" />
            </marker>
            <marker id="arr-blue" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 7 3 L 0 6 Z" fill="#93C5FD" />
            </marker>
          </defs>
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.stroke}
              strokeWidth={1.5}
              markerEnd={p.stroke === '#93C5FD' ? 'url(#arr-blue)' : 'url(#arr-gray)'}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
