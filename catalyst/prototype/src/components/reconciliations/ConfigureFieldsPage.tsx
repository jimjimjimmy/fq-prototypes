import { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAgingBuckets, type MetadataField } from '@/contexts/AgingBucketsContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AgingBucket { id: string; label: string; }

const uid = () => Math.random().toString(36).slice(2, 9);

const BUCKET_TEMPLATES: Record<string, { label: string; buckets: string[] }> = {
  custom1: {
    label: 'Custom 1',
    buckets: ['Current', '1 - 30 days', '31 - 60 days', '61 - 90 days', '91 - 120 days', '120+ days', 'Unidentified Date'],
  },
  monthly: {
    label: 'Monthly',
    buckets: ['Current Month', '1 Month Prior', '2 Months Prior', '3 Months Prior', '4 - 6 Months Prior', '6+ Months Prior', 'Unidentified Date'],
  },
  quarterly: {
    label: 'Quarterly (90-day)',
    buckets: ['Current Quarter', '1 Quarter Prior', '2 Quarters Prior', '3 Quarters Prior', '4+ Quarters Prior', 'Unidentified Date'],
  },
  semiannual: {
    label: 'Semi-Annual (180-day)',
    buckets: ['Current', '1 - 180 days', '181 - 360 days', '360+ days', 'Unidentified Date'],
  },
  annual: {
    label: 'Annual',
    buckets: ['Current Year', '1 Year Prior', '2 Years Prior', '3 Years Prior', '4+ Years Prior', 'Unidentified Date'],
  },
};

const makeBuckets = (labels: string[]): AgingBucket[] =>
  labels.map(label => ({ id: uid(), label }));

const DEFAULT_BUCKETS: AgingBucket[] = makeBuckets(BUCKET_TEMPLATES.custom1.buckets);

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------
const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: 0, height: '40px',
  border: '1px solid #e1e6ef', borderRadius: '6px',
  padding: '0 12px', fontSize: '14px',
  fontFamily: 'Inter, sans-serif', color: '#1d2433',
  background: '#ffffff', outline: 'none', boxSizing: 'border-box',
};

const trashBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '4px', color: '#d1d5db', display: 'flex',
  alignItems: 'center', flexShrink: 0,
};

const addBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '5px',
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#424867', fontSize: '13px', fontWeight: 500,
  fontFamily: 'Inter, sans-serif', padding: '4px 0', marginTop: '4px',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '16px',
  fontWeight: 600, color: '#1d2433', margin: 0,
};

const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 500,
  color: '#6b7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ConfigureFieldsPage() {
  const { setCurrentPage } = useNavigation();
  const { bucketLabels, setBucketLabels, metadataFields, setMetadataFields } = useAgingBuckets();
  const [fields, setFields] = useState<MetadataField[]>(() => metadataFields);
  const [buckets, setBuckets] = useState<AgingBucket[]>(() =>
    bucketLabels.map(label => ({ id: Math.random().toString(36).slice(2), label }))
  );
  const [selectedTemplate, setSelectedTemplate] = useState('custom1');
  const [applyToAll, setApplyToAll] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (val: T | ((prev: T) => T)) => { setter(val as any); setIsDirty(true); };

  const setFieldsDirty = markDirty(setFields);
  const setBucketsDirty = markDirty(setBuckets);

  // Field operations
  const addField = () =>
    setFieldsDirty((f: MetadataField[]) => [...f, { id: uid(), title: '', required: false, values: [{ id: uid(), label: '' }] }]);
  const deleteField = (id: string) => setFieldsDirty((f: MetadataField[]) => f.filter(x => x.id !== id));
  const updateTitle = (id: string, title: string) => setFieldsDirty((f: MetadataField[]) => f.map(x => x.id === id ? { ...x, title } : x));
  const toggleRequired = (id: string) => setFieldsDirty((f: MetadataField[]) => f.map(x => x.id === id ? { ...x, required: !x.required } : x));
  const addValue = (fId: string) => setFieldsDirty((f: MetadataField[]) => f.map(x => x.id === fId ? { ...x, values: [...x.values, { id: uid(), label: '' }] } : x));
  const updateValue = (fId: string, vId: string, label: string) =>
    setFieldsDirty((f: MetadataField[]) => f.map(x => x.id === fId ? { ...x, values: x.values.map(v => v.id === vId ? { ...v, label } : v) } : x));
  const deleteValue = (fId: string, vId: string) =>
    setFieldsDirty((f: MetadataField[]) => f.map(x => x.id === fId ? { ...x, values: x.values.filter(v => v.id !== vId) } : x));

  // Bucket operations
  const addBucket = () => setBucketsDirty((b: AgingBucket[]) => [...b, { id: uid(), label: '' }]);
  const updateBucket = (id: string, label: string) => setBucketsDirty((b: AgingBucket[]) => b.map(x => x.id === id ? { ...x, label } : x));
  const deleteBucket = (id: string) => setBucketsDirty((b: AgingBucket[]) => b.filter(x => x.id !== id));

  const toolbarBtn: React.CSSProperties = {
    height: '32px', padding: '0 12px', gap: '6px',
    border: '1px solid #e1e6ef', borderRadius: '6px',
    fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#424867',
    background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>

      {/* Sub-navigation tabs */}
      <div style={{ borderBottom: '1px solid #e4e7ec', display: 'flex', alignItems: 'center', height: '44px', flexShrink: 0, paddingLeft: '24px' }}>
        {['Dashboard', 'Folders', 'Checklist', 'Reconciliations', 'Notes', 'Journal Entries', 'Flux Analysis'].map(tab => (
          <button key={tab} style={{
            padding: '0 16px', height: '100%', fontSize: '12px', fontWeight: 600,
            borderBottom: tab === 'Reconciliations' ? '2px solid #1c895f' : '2px solid transparent',
            color: tab === 'Reconciliations' ? '#000000' : '#424867',
            background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: "'Museo Sans', sans-serif",
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e4e7ec', height: '48px', flexShrink: 0 }}>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          1 - Close US <ChevronDown size={14} color="#6b7280" />
        </button>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          By Period <ChevronDown size={14} color="#6b7280" />
        </button>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          March 2025 <ChevronDown size={14} color="#6b7280" />
        </button>
      </div>

      {/* Page header */}
      <div style={{ padding: '28px 40px 0', flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Museo Sans', sans-serif", fontSize: '24px', fontWeight: 700, color: '#000000', margin: 0 }}>
          Configure Fields
        </h1>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '28px 40px' }}>

          {/* ── Custom Metadata Fields ── */}
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={sectionTitle}>Custom Metadata Fields</h2>
              <button
                onClick={addField}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e1e6ef', borderRadius: '6px', height: '32px', padding: '0 12px', fontSize: '13px', fontWeight: 500, color: '#424867', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
              >
                <Plus size={14} /> Add Field
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e1e6ef', paddingTop: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                {fields.map(field => (
                  <div key={field.id}>
                    <span style={fieldLabel}>Field Title</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                      <input
                        type="text"
                        value={field.title}
                        placeholder="Field Name"
                        onChange={e => updateTitle(field.id, e.target.value)}
                        style={inputStyle}
                      />
                      <button style={trashBtn} onClick={() => deleteField(field.id)}
                        onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => toggleRequired(field.id)}
                        style={{ accentColor: '#1a7b4b', width: '15px', height: '15px', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: field.required ? '#1d2433' : '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        Required
                      </span>
                    </label>

                    <span style={{ ...fieldLabel, paddingLeft: '24px' }}>Values</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '24px' }}>
                      {field.values.map(val => (
                        <div key={val.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={val.label}
                            placeholder="Add a value"
                            onChange={e => updateValue(field.id, val.id, e.target.value)}
                            style={inputStyle}
                          />
                          <button style={trashBtn} onClick={() => deleteValue(field.id, val.id)}
                            onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button style={addBtn} onClick={() => addValue(field.id)}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Aging Buckets ── */}
          <section>
            <h2 style={{ ...sectionTitle, marginBottom: '20px' }}>Aging Buckets</h2>
            <div style={{ borderTop: '1px solid #e1e6ef', paddingTop: '28px', paddingLeft: '24px' }}>

              <div style={{ marginBottom: '20px', maxWidth: '260px' }}>
                <span style={fieldLabel}>Bucket Template</span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedTemplate}
                    onChange={e => {
                      const key = e.target.value;
                      setSelectedTemplate(key);
                      setBucketsDirty(makeBuckets(BUCKET_TEMPLATES[key].buckets));
                    }}
                    style={{ ...inputStyle, flex: 'unset', width: '100%', appearance: 'none', paddingRight: '32px', cursor: 'pointer' }}
                  >
                    {Object.entries(BUCKET_TEMPLATES).map(([key, t]) => (
                      <option key={key} value={key}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '260px', paddingLeft: '24px' }}>
                {buckets.map(bucket => (
                  <div key={bucket.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={bucket.label}
                      onChange={e => updateBucket(bucket.id, e.target.value)}
                      style={inputStyle}
                    />
                    <button style={trashBtn} onClick={() => deleteBucket(bucket.id)}
                      onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button style={addBtn} onClick={addBucket}>
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </section>

          {/* ── Apply to Other Entities ── */}
          <div style={{ borderTop: '1px solid #e1e6ef', marginTop: '48px', paddingTop: '20px', paddingBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={e => { setApplyToAll(e.target.checked); setIsDirty(true); }}
                style={{ accentColor: '#1a7b4b', width: '15px', height: '15px', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>
                  Apply to Other Entities
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  Configuration applies to all reconciling items in this entity.
                </div>
              </div>
            </label>
          </div>

          {/* ── Save / Cancel ── */}
          <div style={{ borderTop: '1px solid #e1e6ef', paddingTop: '20px', paddingBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                if (!isDirty) return;
                setBucketLabels(buckets.map(b => b.label));
                setMetadataFields(fields);
                setCurrentPage('ReconcilingItems');
              }}
              disabled={!isDirty}
              style={{ background: isDirty ? '#1fac76' : 'rgba(31,172,118,0.35)', color: '#ffffff', border: 'none', borderRadius: '6px', height: '36px', padding: '0 20px', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: isDirty ? 'pointer' : 'not-allowed' }}
            >
              Save
            </button>
            <button
              onClick={() => setCurrentPage('ReconcilingItems')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#424867', fontFamily: 'Inter, sans-serif', padding: '0' }}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
