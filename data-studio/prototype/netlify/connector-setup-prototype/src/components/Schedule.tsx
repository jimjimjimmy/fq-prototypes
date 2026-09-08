import React, { useState } from 'react';
import type { EndpointState, SyncMode, SyncFrequency, FirstRun } from '../types';
import { CLUSTER_DEFAULTS } from '../data';

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
  endpoint: EndpointState;
  onChange: (field: string, value: string) => void;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fq-color-text-secondary)',
  marginBottom: 6,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: 13,
  border: '1px solid var(--fq-color-border)',
  borderRadius: 'var(--fq-radius-md)',
  outline: 'none',
  color: 'var(--fq-color-text-primary)',
  background: '#fff',
  appearance: 'auto' as React.CSSProperties['appearance'],
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: 13,
  border: '1px solid var(--fq-color-border)',
  borderRadius: 'var(--fq-radius-md)',
  outline: 'none',
  color: 'var(--fq-color-text-primary)',
  background: '#fff',
};

const Schedule: React.FC<Props> = ({ endpoint, onChange }) => {
  const defaults = CLUSTER_DEFAULTS[endpoint.cluster];
  const confirmed = endpoint.confirmed.schedule;

  const mode = confirmed?.mode ?? defaults.syncMode;
  const freq = confirmed?.freq ?? defaults.freq;
  const first = confirmed?.first ?? defaults.first;
  const retries = confirmed?.retries ?? '3';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ maxWidth: 240 }}>
        <label style={labelStyle}>
          Sync Mode
          <Tooltip text="Incremental adds only new or changed records. Full Refresh replaces everything each sync." />
        </label>
        <select style={selectStyle} value={mode} onChange={(e) => onChange('mode', e.target.value as SyncMode)}>
          <option>Incremental</option>
          <option>Full refresh</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ maxWidth: 200 }}>
          <label style={labelStyle}>
            Sync Frequency
            <Tooltip text="How often FloQast pulls data from this endpoint." />
          </label>
          <select style={selectStyle} value={freq} onChange={(e) => onChange('freq', e.target.value as SyncFrequency)}>
            <option>Every hour</option>
            <option>Every 6 hours</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </div>

        <div style={{ maxWidth: 220 }}>
          <label style={labelStyle}>
            Starting Point
            <Tooltip text="Whether the first sync pulls historical data from a past date or starts collecting from today." />
          </label>
          <select style={selectStyle} value={first} onChange={(e) => onChange('first', e.target.value as FirstRun)}>
            <option>Backfill from a date</option>
            <option>Start from today</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 100 }}>
        <label style={labelStyle}>
          Max Retries
          <Tooltip text="How many times FloQast retries a failed sync before reporting an error." />
        </label>
        <input
          style={inputStyle}
          type="text"
          value={retries}
          onChange={(e) => onChange('retries', e.target.value)}
        />
      </div>
    </div>
  );
};

export default Schedule;
