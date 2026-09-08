import React from 'react';

const tabs = ['Catalog', 'Connectors', 'Entity Mappings'];

type ShellProps = {
  children: React.ReactNode;
  onAddConnector: () => void;
  showSectionHeader?: boolean;
};

const DataStudioShell: React.FC<ShellProps> = ({
  children,
  onAddConnector,
  showSectionHeader = true,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        background: 'var(--fq-color-bg-page)',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          padding: '0 24px',
          background: 'var(--fq-brand)',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--fq-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fq-brand)',
            fontWeight: 700,
            fontSize: 14,
            marginRight: 12,
          }}
        >
          F
        </div>
        <span style={{ fontWeight: 600, fontSize: 15, marginRight: 32 }}>Data Studio</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map((tab) => {
            const active = tab === 'Connectors';
            return (
              <span
                key={tab}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  cursor: 'default',
                }}
              >
                {tab}
              </span>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          NC
        </div>
      </div>

      {/* Section header */}
      {showSectionHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '24px 32px 16px',
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--fq-color-text-primary)',
                margin: 0,
                marginBottom: 4,
              }}
            >
              Connectors
            </h1>
            <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: 0 }}>
              Configure and monitor your connections.
            </p>
          </div>
          <button
            onClick={onAddConnector}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              background: 'var(--fq-brand)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--fq-radius-md)',
              cursor: 'pointer',
              boxShadow: 'var(--fq-shadow-xs)',
            }}
          >
            + Add Connector
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
};

export default DataStudioShell;
