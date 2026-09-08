import React from 'react';

type Props = {
  label: string;
  value: string;
  onEdit: () => void;
};

const CollapsedAnswerRow: React.FC<Props> = ({ label, value, onEdit }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        border: '1px solid var(--fq-color-border)',
        borderRadius: 'var(--fq-radius-lg)',
        background: '#fff',
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--fq-ok)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5L5 9L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--fq-color-text-muted)',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--fq-color-text-primary)',
        }}
      >
        {value}
      </span>
      <div style={{ flex: 1 }} />
      <button
        onClick={onEdit}
        style={{
          fontSize: 13,
          color: 'var(--fq-color-text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
        }}
      >
        Edit
      </button>
    </div>
  );
};

export default CollapsedAnswerRow;
