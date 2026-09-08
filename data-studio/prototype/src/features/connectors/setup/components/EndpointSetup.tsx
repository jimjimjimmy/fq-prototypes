import React, { useState } from 'react';
import type { Cluster } from '../types';

export interface SetupRow {
  id: number;
  name: string;
  path: string;
  cluster: Cluster;
}

interface Props {
  rows: SetupRow[];
  onChange: (rows: SetupRow[]) => void;
}

let nextId = 100;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: 13,
  border: '1px solid var(--fq-color-border)',
  borderRadius: 'var(--fq-radius-md)',
  outline: 'none',
  color: 'var(--fq-color-text-primary)',
  background: '#fff',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'auto' as React.CSSProperties['appearance'],
  cursor: 'pointer',
};

const colHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: 'var(--fq-color-text-muted)',
  padding: '0 0 8px',
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'var(--fq-color-gray-900)',
  color: '#fff',
  fontSize: 12,
  fontWeight: 400,
  padding: '6px 10px',
  borderRadius: 'var(--fq-radius-md)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 100,
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const EndpointSetup: React.FC<Props> = ({ rows, onChange }) => {
  const [addCount, setAddCount] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  const updateRow = (id: number, field: keyof SetupRow, value: string) => {
    onChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deleteRow = (id: number) => {
    onChange(rows.filter(r => r.id !== id));
  };

  const addRows = () => {
    const blanks: SetupRow[] = Array.from({ length: addCount }, () => ({
      id: nextId++,
      name: '',
      path: '',
      cluster: 'occasionally' as Cluster,
    }));
    onChange([...rows, ...blanks]);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--fq-color-bg-page)' }}>
      <div style={{ padding: '32px 48px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 700 }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--fq-color-text-primary)', margin: '0 0 6px' }}>
            Define your endpoints
          </h2>
          <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: 0 }}>
            Add each API endpoint you want to sync. You'll configure request details, parameters, and schedules in the next step.
          </p>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 'var(--fq-radius-lg)', border: '1px solid var(--fq-color-border)', overflow: 'hidden' }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 40px', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--fq-color-border)', background: 'var(--fq-color-gray-50)' }}>
            <span style={colHeaderStyle}>Endpoint name</span>
            <span style={colHeaderStyle}>Endpoint path</span>
            <span
              style={{ ...colHeaderStyle, position: 'relative', cursor: 'default', display: 'inline-block' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Change Frequency
              {showTooltip && (
                <div style={tooltipStyle}>
                  How often does this data change?
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid var(--fq-color-gray-900)',
                  }} />
                </div>
              )}
            </span>
            <span />
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--fq-color-text-muted)', fontStyle: 'italic' }}>
              No endpoints yet — add some below.
            </div>
          ) : (
            rows.map((row, i) => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 160px 40px',
                  gap: 12,
                  padding: '10px 16px',
                  alignItems: 'center',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--fq-color-border-light)' : 'none',
                }}
              >
                <input
                  style={inputStyle}
                  value={row.name}
                  onChange={e => updateRow(row.id, 'name', e.target.value)}
                  placeholder="e.g. GL Transactions"
                />
                <input
                  style={inputStyle}
                  value={row.path}
                  onChange={e => updateRow(row.id, 'path', e.target.value)}
                  placeholder="/endpoint-path"
                />
                <select
                  style={selectStyle}
                  value={row.cluster}
                  onChange={e => updateRow(row.id, 'cluster', e.target.value as Cluster)}
                >
                  <option value="frequently">Frequent</option>
                  <option value="occasionally">Occasional</option>
                  <option value="rarely">Rare</option>
                </select>
                <button
                  onClick={() => deleteRow(row.id)}
                  title="Remove endpoint"
                  style={{
                    width: 28,
                    height: 28,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--fq-color-text-muted)',
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--fq-radius-sm)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e53e3e')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fq-color-text-muted)')}
                >
                  ×
                </button>
              </div>
            ))
          )}

          {/* Add more row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--fq-color-border-light)', background: 'var(--fq-color-gray-50)' }}>
            <span style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>Add</span>
            <input
              type="number"
              min={1}
              max={20}
              value={addCount}
              onChange={e => setAddCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              style={{ width: 52, padding: '6px 8px', fontSize: 13, border: '1px solid var(--fq-color-border)', borderRadius: 'var(--fq-radius-md)', textAlign: 'center', outline: 'none' }}
            />
            <span style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>
              more endpoint{addCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={addRows}
              style={{
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid var(--fq-color-primary)',
                borderRadius: 'var(--fq-radius-md)',
                background: '#fff',
                color: 'var(--fq-color-primary)',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EndpointSetup;
