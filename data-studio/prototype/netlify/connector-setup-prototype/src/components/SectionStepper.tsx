import React from 'react';

const SECTIONS = ['Request', 'Query Parameters', 'Schedule'];

interface Props {
  active: number;
  completed: [boolean, boolean, boolean];
  onSelect: (index: number) => void;
}

const SectionStepper: React.FC<Props> = ({ active, completed, onSelect }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20, padding: '0 8px' }}>
      {SECTIONS.map((label, i) => {
        const isDone = completed[i];
        const isActive = i === active;
        const isClickable = isDone || i < active;

        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginTop: 8,
                  background: completed[i - 1] ? 'var(--fq-color-green)' : 'var(--fq-color-gray-300)',
                }}
              />
            )}
            <div
              onClick={() => isClickable && onSelect(i)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                cursor: isClickable ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                  ...(isDone
                    ? { background: 'var(--fq-color-green)', color: '#fff' }
                    : isActive
                      ? { background: 'var(--fq-color-green)', color: '#fff' }
                      : {
                          background: 'transparent',
                          border: '1.5px solid var(--fq-color-gray-300)',
                          color: 'var(--fq-color-gray-400)',
                        }),
                }}
              >
                {isDone ? (
                  <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--fq-color-text-primary)'
                    : isDone
                      ? 'var(--fq-color-green)'
                      : 'var(--fq-color-text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SectionStepper;
