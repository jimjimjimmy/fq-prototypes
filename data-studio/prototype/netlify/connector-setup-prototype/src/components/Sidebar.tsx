import React from 'react';
import type { EndpointState } from '../types';
import { CLUSTER_LABELS, CLUSTER_ORDER } from '../data';
import type { Cluster } from '../types';

interface Props {
  endpoints: EndpointState[];
  current: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

function getStatusDot(ep: EndpointState, isActive: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    width: isActive ? 10 : 8,
    height: isActive ? 10 : 8,
    borderRadius: '50%',
    flexShrink: 0,
  };

  if (isActive) {
    return { ...base, background: '#fff', border: '2px solid var(--fq-color-green)' };
  }
  if (ep.tested) {
    return { ...base, background: 'var(--fq-color-green)' };
  }
  if (ep.sections.some(Boolean)) {
    return { ...base, background: 'var(--fq-color-amber)' };
  }
  return { ...base, background: 'transparent', border: '2px solid var(--fq-color-gray-400)' };
}

const Sidebar: React.FC<Props> = ({ endpoints, current, onSelect, onAdd }) => {
  const grouped = CLUSTER_ORDER.reduce<Record<Cluster, { ep: EndpointState; idx: number }[]>>(
    (acc, c) => {
      acc[c] = endpoints
        .map((ep, idx) => ({ ep, idx }))
        .filter(({ ep }) => ep.cluster === c);
      return acc;
    },
    { frequently: [], occasionally: [], rarely: [] },
  );

  return (
    <div
      style={{
        width: 200,
        minWidth: 200,
        borderRight: '1px solid var(--fq-color-border)',
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
          padding: '12px 12px 8px',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--fq-color-text-muted)',
          }}
        >
          Endpoints
        </span>
        <button
          onClick={onAdd}
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--fq-color-primary)',
            background: 'transparent',
            border: '1px solid var(--fq-color-primary)',
            borderRadius: 'var(--fq-radius-sm)',
            padding: '2px 8px',
            cursor: 'pointer',
          }}
        >
          + Add
        </button>
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 8px' }}>
        {CLUSTER_ORDER.map((cluster) => {
          const items = grouped[cluster];
          if (items.length === 0) return null;
          return (
            <div key={cluster}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--fq-color-text-muted)',
                  padding: '10px 12px 4px',
                }}
              >
                {CLUSTER_LABELS[cluster]}
              </div>
              {items.map(({ ep, idx }) => {
                const isActive = idx === current;
                return (
                  <div
                    key={idx}
                    onClick={() => onSelect(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: isActive ? 'var(--fq-color-bg-active)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--fq-color-green)' : '3px solid transparent',
                    }}
                  >
                    <div style={getStatusDot(ep, isActive)} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          color: 'var(--fq-color-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ep.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--fq-color-text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ep.path}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
