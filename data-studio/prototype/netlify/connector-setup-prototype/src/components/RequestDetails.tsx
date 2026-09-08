import React, { useState } from 'react';
import type { EndpointState, HttpMethod, Ingestion } from '../types';
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
  flashField: string | null;
}

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  tooltip,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  tooltip?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}{tooltip && <Tooltip text={tooltip} />}</label>
      <div style={{ display: 'inline-flex', borderRadius: 'var(--fq-radius-md)', border: '1px solid var(--fq-color-border)', overflow: 'hidden' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              border: 'none',
              borderRight: '1px solid var(--fq-color-border)',
              cursor: 'pointer',
              fontWeight: value === opt ? 600 : 400,
              background: value === opt ? 'var(--fq-color-primary)' : '#fff',
              color: value === opt ? '#fff' : 'var(--fq-color-text-primary)',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fq-color-text-secondary)',
  marginBottom: 6,
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'auto' as React.CSSProperties['appearance'],
};

const RequestDetails: React.FC<Props> = ({ endpoint, onChange, flashField }) => {
  const defaults = CLUSTER_DEFAULTS[endpoint.cluster];
  const confirmed = endpoint.confirmed.request;

  const path = confirmed?.path ?? endpoint.path;
  const method = confirmed?.method ?? 'GET';
  const ingestion = confirmed?.ingestion ?? defaults.ingestion;
  const dateParam = confirmed?.dateParam ?? defaults.dateParam;
  const dateFormat = confirmed?.dateFormat ?? 'ISO 8601';
  const respFormat = confirmed?.respFormat ?? 'JSON';

  const isFrequent = endpoint.cluster === 'frequently';
  const showDateFields = ingestion === 'Filter by date';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>
          Endpoint Path or URL Path
          <Tooltip text="The specific path for this data resource. Look for it in your endpoint list (e.g., /v2/transactions)." />
        </label>
        <input
          className={flashField === 'path' ? 'flash-amber' : ''}
          style={inputStyle}
          value={path}
          onChange={(e) => onChange('path', e.target.value)}
          placeholder="/endpoint-path"
        />
      </div>

      <ToggleGroup<HttpMethod>
        label="HTTP Method"
        options={['GET', 'POST', 'PATCH']}
        value={method as HttpMethod}
        onChange={(v) => onChange('method', v)}
        tooltip="How the request is sent. Your docs show GET, POST, or similar next to each endpoint."
      />

      <ToggleGroup<Ingestion>
        label="How to Pull Data"
        options={['Filter by date', 'Cursor', 'Full refresh']}
        value={ingestion as Ingestion}
        onChange={(v) => onChange('ingestion', v)}
        tooltip="Whether FloQast fetches only new records, uses a bookmark, or re-pulls everything each sync."
      />

      {showDateFields ? (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, maxWidth: 280 }}>
            <label style={labelStyle}>
              Date Filter Parameter Name
              <Tooltip text="The parameter name your API uses to filter by date. Look in the Parameters table in your docs." />
            </label>
            <input
              className={flashField === 'dateParam' ? 'flash-amber' : ''}
              style={{
                ...inputStyle,
                ...(isFrequent && !dateParam ? { borderColor: 'var(--fq-color-amber)' } : {}),
              }}
              value={dateParam}
              onChange={(e) => onChange('dateParam', e.target.value)}
              placeholder="e.g. updated_after"
            />
          </div>
          <div style={{ maxWidth: 180 }}>
            <label style={labelStyle}>
              Date Format
              <Tooltip text="The date format this endpoint expects. Check the example values in your docs." />
            </label>
            <select
              style={selectStyle}
              value={dateFormat}
              onChange={(e) => onChange('dateFormat', e.target.value)}
            >
              <option>ISO 8601</option>
              <option>Unix timestamp</option>
              <option>MM/DD/YYYY</option>
            </select>
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: 180 }}>
        <label style={labelStyle}>
          Response Format
          <Tooltip text="The data format this endpoint returns. Usually listed near the endpoint description." />
        </label>
        <select
          style={selectStyle}
          value={respFormat}
          onChange={(e) => onChange('respFormat', e.target.value)}
        >
          <option>JSON</option>
          <option>XML</option>
          <option>CSV</option>
        </select>
      </div>
    </div>
  );
};

export default RequestDetails;
