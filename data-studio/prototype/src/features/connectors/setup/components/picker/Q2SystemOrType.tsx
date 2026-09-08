import React from 'react';
import {
  PRE_BUILT_SYSTEMS,
  CUSTOM_TYPES,
  SYSTEM_LETTER,
} from '../../lib/connectorChoice';
import type { Q1, PreBuiltSystem, CustomTransmission } from '../../lib/connectorChoice';

type Props = {
  q1: Q1;
  value: PreBuiltSystem | CustomTransmission | null;
  onChange: (value: PreBuiltSystem | CustomTransmission) => void;
};

const Q2SystemOrType: React.FC<Props> = ({ q1, value, onChange }) => {
  const isPreBuilt = q1 === 'pre-built';
  return (
    <div className="reveal-in">
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--fq-color-text-primary)', margin: '0 0 4px' }}>
        {isPreBuilt ? 'Which system?' : 'Which connection type?'}
      </h3>
      <p style={{ fontSize: 12.5, color: 'var(--fq-color-text-secondary)', margin: '0 0 12px' }}>
        {isPreBuilt
          ? 'FQ-supported integrations — DC API standard (e.g., QBO direct) or CDC (e.g., NetSuite). FQ owns the source mapping.'
          : 'User-defined transmission methods.'}
      </p>

      {isPreBuilt ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {PRE_BUILT_SYSTEMS.map((sys) => {
            const selected = value === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => onChange(sys.id)}
                style={{
                  padding: 12,
                  border: `1px solid ${selected ? 'var(--fq-brand)' : 'var(--fq-color-border)'}`,
                  borderRadius: 'var(--fq-radius-lg)',
                  background: selected ? 'var(--fq-accent-soft)' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 120ms ease, border-color 120ms ease',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: sys.tint,
                    border: `1px solid ${sys.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--fq-color-text-primary)',
                  }}
                >
                  {SYSTEM_LETTER[sys.id]}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fq-color-text-primary)' }}>
                  {sys.name}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {CUSTOM_TYPES.map((opt) => {
            const selected = value === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                style={{
                  textAlign: 'left',
                  padding: 14,
                  border: `1px solid ${selected ? 'var(--fq-brand)' : 'var(--fq-color-border)'}`,
                  borderRadius: 'var(--fq-radius-lg)',
                  background: selected ? 'var(--fq-accent-soft)' : '#fff',
                  cursor: 'pointer',
                  transition: 'background 120ms ease, border-color 120ms ease',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--fq-color-text-primary)',
                    marginBottom: 4,
                  }}
                >
                  {opt.name}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--fq-color-text-secondary)', lineHeight: 1.5 }}>
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Q2SystemOrType;
