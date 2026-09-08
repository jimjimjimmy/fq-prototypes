import React from 'react';

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      style={{
        height: 3,
        width: '100%',
        background: 'var(--fq-color-border)',
        borderRadius: 'var(--fq-radius-full)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: 'var(--fq-brand)',
          transition: 'width 220ms ease',
        }}
      />
    </div>
  );
};

export default ProgressBar;
