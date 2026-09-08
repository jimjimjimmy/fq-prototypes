import React from 'react';

interface Props {
  activeStep: number;
  steps?: string[];
}

const DC_API_STEPS = ['Connect', 'Manage endpoints', 'Review'];

const WizardStepper: React.FC<Props> = ({ activeStep, steps = DC_API_STEPS }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        padding: '16px 24px',
        background: 'var(--fq-color-bg-card)',
        borderBottom: '1px solid var(--fq-color-border)',
      }}
    >
      {steps.map((label, i) => {
        const isDone = i < activeStep;
        const isActive = i === activeStep;
        const isUpcoming = i > activeStep;

        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  width: 64,
                  height: 2,
                  background: isDone ? 'var(--fq-color-green)' : 'var(--fq-color-gray-300)',
                  margin: '0 4px',
                  marginBottom: 20,
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  ...(isDone
                    ? { background: 'var(--fq-color-green)', color: '#fff' }
                    : isActive
                      ? { background: 'var(--fq-color-green)', color: '#fff' }
                      : { background: 'transparent', border: '2px solid var(--fq-color-gray-400)', color: 'var(--fq-color-gray-500)' }),
                }}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isUpcoming ? 'var(--fq-color-text-muted)' : 'var(--fq-color-text-primary)',
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

export default WizardStepper;
