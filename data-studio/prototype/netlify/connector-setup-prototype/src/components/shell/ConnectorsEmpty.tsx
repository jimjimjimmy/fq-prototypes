import React from 'react';

const ConnectorsEmpty: React.FC<{ onAddConnector: () => void }> = ({ onAddConnector }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        height: '100%',
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--fq-color-text-primary)',
          margin: 0,
          marginBottom: 8,
        }}
      >
        Welcome to Data Studio
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--fq-color-text-secondary)',
          margin: 0,
          marginBottom: 24,
          maxWidth: 480,
          lineHeight: 1.5,
        }}
      >
        All your source data in one place — ready to power Close, Reporting, Compliance, and more.
      </p>
      <button
        onClick={onAddConnector}
        style={{
          padding: '10px 20px',
          fontSize: 13,
          fontWeight: 600,
          background: 'var(--fq-brand)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--fq-radius-md)',
          cursor: 'pointer',
        }}
      >
        + Add Connector
      </button>
    </div>
  );
};

export default ConnectorsEmpty;
