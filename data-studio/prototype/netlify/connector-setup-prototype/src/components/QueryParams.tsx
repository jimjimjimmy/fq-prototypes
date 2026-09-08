import React, { useState } from 'react';
import type { Param } from '../types';

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5, verticalAlign: 'middle', cursor: 'default' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display: 'block' }}>
        <circle cx="6.5" cy="6.5" r="6" stroke="var(--fq-color-text-muted)" strokeWidth="1"/>
        <text x="6.5" y="9.5" textAnchor="middle" fontSize="8" fill="var(--fq-color-text-muted)" fontFamily="inherit" fontWeight="600">?</text>
      </svg>
      {show && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--fq-color-gray-900)',
          color: '#fff',
          fontSize: 12,
          padding: '6px 10px',
          borderRadius: 'var(--fq-radius-md)',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          maxWidth: 400,
          whiteSpace: 'normal' as const,
          lineHeight: 1.4,
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

interface Props {
  params: Param[];
  noParams: boolean;
  onParamsChange: (params: Param[]) => void;
  onNoParamsChange: (val: boolean) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fq-color-text-secondary)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 13,
  border: '1px solid var(--fq-color-border)',
  borderRadius: 'var(--fq-radius-md)',
  outline: 'none',
  color: 'var(--fq-color-text-primary)',
};

const QueryParams: React.FC<Props> = ({ params, noParams, onParamsChange, onNoParamsChange }) => {
  const [addCount, setAddCount] = useState(1);

  const updateParam = (i: number, field: keyof Param, value: string) => {
    const updated = [...params];
    updated[i] = { ...updated[i], [field]: value };
    onParamsChange(updated);
  };

  const removeParam = (i: number) => {
    onParamsChange(params.filter((_, idx) => idx !== i));
  };

  const addParams = () => {
    const blanks: Param[] = Array.from({ length: addCount }, () => ({ k: '', v: '', t: 'String' }));
    onParamsChange([...params, ...blanks]);
  };

  return (
    <div>
      {!noParams && (
        <>
          {/* Column headers outside scroll container so tooltips aren't clipped */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 32px', gap: 12, marginBottom: 8 }}>
            <span style={labelStyle}>Parameter Name <Tooltip text="The parameter's name as it appears in your docs — usually in a Parameters or Query String table." /></span>
            <span style={labelStyle}>Value <Tooltip text="The value to send for this parameter on every request." /></span>
            <span style={labelStyle}>Value Type <Tooltip text="The data type for this parameter. Check the Type column in your API's parameter table." /></span>
            <span />
          </div>

          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          {/* Param rows */}
          {params.map((p, i) => (
            <div
              key={i}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 32px', gap: 12, marginBottom: 8, alignItems: 'center' }}
            >
              <input
                style={inputStyle}
                value={p.k}
                onChange={(e) => updateParam(i, 'k', e.target.value)}
                placeholder="key"
              />
              <input
                style={inputStyle}
                value={p.v}
                onChange={(e) => updateParam(i, 'v', e.target.value)}
                placeholder="value"
              />
              <select
                style={{ ...inputStyle, appearance: 'auto' as React.CSSProperties['appearance'] }}
                value={p.t}
                onChange={(e) => updateParam(i, 't', e.target.value)}
              >
                <option>String</option>
                <option>Integer</option>
                <option>Boolean</option>
                <option>Date</option>
              </select>
              <button
                onClick={() => removeParam(i)}
                style={{
                  width: 28,
                  height: 28,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--fq-color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--fq-radius-sm)',
                }}
              >
                ×
              </button>
            </div>
          ))}
          </div>

          {/* Add more */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>Add</span>
            <input
              type="number"
              min={1}
              max={10}
              value={addCount}
              onChange={(e) => setAddCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              style={{
                width: 48,
                padding: '6px 8px',
                fontSize: 13,
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-md)',
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>more</span>
            <button
              onClick={addParams}
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
        </>
      )}

      {/* No params checkbox */}
      <div style={{ marginTop: noParams ? 0 : 16, paddingTop: noParams ? 0 : 16, borderTop: noParams ? 'none' : '1px solid var(--fq-color-border-light)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>
          <input
            type="checkbox"
            checked={noParams}
            onChange={(e) => onNoParamsChange(e.target.checked)}
            style={{ accentColor: 'var(--fq-color-primary)' }}
          />
          No parameters needed for this endpoint
        </label>

        {noParams && (
          <div
            style={{
              marginTop: 12,
              padding: '12px 16px',
              background: 'var(--fq-color-gray-50)',
              borderRadius: 'var(--fq-radius-md)',
              fontSize: 13,
              color: 'var(--fq-color-text-secondary)',
              fontStyle: 'italic',
            }}
          >
            No parameters needed — this endpoint will be called without query parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryParams;
