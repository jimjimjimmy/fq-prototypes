import { useParams, useNavigate } from 'react-router-dom'
import { getDimensionById } from '../../data/dimensions'

function ModelRow({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500 }}>{name}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: '#adb2bb' }}>
        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function SectionHeader({ label, description }: { label: string; description: string }) {
  return (
    <div style={{ padding: '10px 16px 6px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e1e6ef' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{description}</div>
    </div>
  )
}

export default function DimensionLinkedModelsSection() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dimension = id ? getDimensionById(id) : undefined

  if (!dimension) return null

  const primaryModels = dimension.modelsUsing.filter(m => m.role === 'primary')
  const linkedModels  = dimension.modelsUsing.filter(m => m.role === 'linked')

  if (dimension.modelsUsing.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '320px', gap: '8px', padding: '48px 24px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>No models are linked to this dimension.</span>
        <span style={{ fontSize: '13px', color: '#adb2bb' }}>Link this dimension from a model's field mapping to see it here.</span>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
        {dimension.modelsUsing.length} {dimension.modelsUsing.length === 1 ? 'model' : 'models'} reference this dimension.
      </p>

      <div style={{ border: '1px solid #e1e6ef', borderRadius: '6px', overflow: 'hidden' }}>
        {primaryModels.length > 0 && (
          <>
            <SectionHeader
              label="Primary"
              description="This dimension's values are defined in this model."
            />
            {primaryModels.map(m => (
              <ModelRow key={m.id} name={m.name} onClick={() => navigate(`/data-studio/model/${m.id}/overview`)} />
            ))}
          </>
        )}

        {linkedModels.length > 0 && (
          <>
            <SectionHeader
              label="Linked"
              description="These models reference this dimension as a lookup — matching on a shared key."
            />
            {linkedModels.map(m => (
              <ModelRow key={m.id} name={m.name} onClick={() => navigate(`/data-studio/model/${m.id}/overview`)} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
