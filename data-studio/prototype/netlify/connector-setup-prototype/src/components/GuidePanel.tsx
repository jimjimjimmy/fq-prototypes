import React from 'react';
import type { EndpointState, TestResult } from '../types';
import { CLUSTER_DEFAULTS, SAMPLE_RESPONSE } from '../data';

interface Props {
  endpoint: EndpointState;
  endpointIndex: number;
  totalEndpoints: number;
  testResult: TestResult | null;
  onNavigateToField: (section: number, field: string) => void;
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: 'var(--fq-color-text-muted)',
};

const kvRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 0',
  fontSize: 12,
};

const GuidePanel: React.FC<Props> = ({ endpoint, endpointIndex, totalEndpoints, testResult, onNavigateToField }) => {
  const defaults = CLUSTER_DEFAULTS[endpoint.cluster];
  const req = endpoint.confirmed.request;
  const params = endpoint.confirmed.params;
  const sched = endpoint.confirmed.schedule;

  const isReqConfirmed = endpoint.sections[0];
  const isParamsConfirmed = endpoint.sections[1];
  const isSchedConfirmed = endpoint.sections[2];

  const valueStyle = (confirmed: boolean): React.CSSProperties => ({
    fontSize: 12,
    color: 'var(--fq-color-text-primary)',
    fontStyle: confirmed ? 'normal' : 'italic',
    fontWeight: confirmed ? 500 : 400,
    opacity: confirmed ? 1 : 0.65,
  });

  const needsPath = !(req?.path || endpoint.path);
  const needsDateParam = endpoint.cluster === 'frequently' && !(req?.dateParam || defaults.dateParam);

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--fq-color-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const NeedsInputBadge = ({ section, field }: { section: number; field: string }) => (
    <div
      onClick={() => onNavigateToField(section, field)}
      style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
    >
      <span style={{ fontSize: 12, color: 'var(--fq-color-amber)', fontWeight: 500 }}>Required</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '1px 6px',
          borderRadius: 'var(--fq-radius-full)',
          background: 'var(--fq-color-amber-bg)',
          color: 'var(--fq-color-amber)',
        }}
      >
        Needs input
      </span>
    </div>
  );

  return (
    <div
      style={{
        width: 480,
        minWidth: 480,
        borderLeft: '1px solid var(--fq-color-border)',
        background: 'var(--fq-color-bg-card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px 8px',
        }}
      >
        <span style={sectionLabelStyle}>Endpoint summary</span>
        <span style={{ fontSize: 12, color: 'var(--fq-color-text-muted)' }}>
          {endpointIndex + 1} of {totalEndpoints}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {/* Test result card */}
        {endpoint.tested && testResult && (
          <div
            style={{
              background: 'var(--fq-color-green-light)',
              borderRadius: 'var(--fq-radius-md)',
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fq-color-green)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fq-color-green)' }}>Test passed</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fq-color-text-secondary)', marginBottom: 8 }}>
              HTTP {testResult.status} · {testResult.ms}ms
            </div>
            <pre
              style={{
                fontSize: 10,
                lineHeight: 1.4,
                background: 'var(--fq-color-gray-900)',
                color: '#e6e8eb',
                padding: 10,
                borderRadius: 'var(--fq-radius-sm)',
                overflow: 'auto',
                maxHeight: 120,
                margin: '0 0 8px',
              }}
            >
              {SAMPLE_RESPONSE}
            </pre>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fq-color-text-primary)' }}>
              {testResult.fields} fields detected
            </div>
          </div>
        )}

        {/* Request details summary */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={sectionLabelStyle}>Request details</span>
            {isReqConfirmed && <CheckIcon />}
          </div>
          <div
            style={{
              background: 'var(--fq-color-gray-50)',
              borderRadius: 'var(--fq-radius-md)',
              padding: 10,
            }}
          >
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Endpoint path</span>
              {needsPath ? (
                <NeedsInputBadge section={0} field="path" />
              ) : (
                <span style={valueStyle(isReqConfirmed)}>{req?.path || endpoint.path}</span>
              )}
            </div>
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>HTTP method</span>
              <span style={valueStyle(isReqConfirmed)}>{req?.method || 'GET'}</span>
            </div>
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>How to pull data</span>
              <span style={valueStyle(isReqConfirmed)}>{req?.ingestion || defaults.ingestion}</span>
            </div>
            {(req?.ingestion || defaults.ingestion) === 'Filter by date' && (
              <>
                <div style={kvRowStyle}>
                  <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Date filter param</span>
                  {needsDateParam ? (
                    <NeedsInputBadge section={0} field="dateParam" />
                  ) : (
                    <span style={valueStyle(isReqConfirmed)}>{req?.dateParam || defaults.dateParam}</span>
                  )}
                </div>
                <div style={kvRowStyle}>
                  <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Date format</span>
                  <span style={valueStyle(isReqConfirmed)}>{req?.dateFormat || 'ISO 8601'}</span>
                </div>
              </>
            )}
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Response format</span>
              <span style={valueStyle(isReqConfirmed)}>{req?.respFormat || 'JSON'}</span>
            </div>
          </div>
        </div>

        {/* Query params summary */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={sectionLabelStyle}>Query parameters</span>
            {isParamsConfirmed && <CheckIcon />}
          </div>
          <div
            style={{
              background: 'var(--fq-color-gray-50)',
              borderRadius: 'var(--fq-radius-md)',
              padding: 10,
            }}
          >
            {endpoint.noParams ? (
              <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--fq-color-text-muted)' }}>
                No parameters needed
              </span>
            ) : (params ?? endpoint.params).length > 0 ? (
              (params ?? endpoint.params).map((p, i) => (
                <div key={i} style={kvRowStyle}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{p.k || '(empty)'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={valueStyle(isParamsConfirmed)}>{p.v || '—'}</span>
                    <span style={{ fontSize: 10, color: 'var(--fq-color-text-muted)' }}>{p.t}</span>
                  </span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--fq-color-text-muted)' }}>
                None defined yet
              </span>
            )}
          </div>
        </div>

        {/* Schedule summary */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={sectionLabelStyle}>Schedule</span>
            {isSchedConfirmed && <CheckIcon />}
          </div>
          <div
            style={{
              background: 'var(--fq-color-gray-50)',
              borderRadius: 'var(--fq-radius-md)',
              padding: 10,
            }}
          >
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Sync mode</span>
              <span style={valueStyle(isSchedConfirmed)}>{sched?.mode || defaults.syncMode}</span>
            </div>
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Sync frequency</span>
              <span style={valueStyle(isSchedConfirmed)}>{sched?.freq || defaults.freq}</span>
            </div>
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Starting point</span>
              <span style={valueStyle(isSchedConfirmed)}>{sched?.first || defaults.first}</span>
            </div>
            <div style={kvRowStyle}>
              <span style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)' }}>Max retries</span>
              <span style={valueStyle(isSchedConfirmed)}>{sched?.retries || '3'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;
