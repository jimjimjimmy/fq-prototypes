import React from 'react';

interface Props {
  section: number;
  tested: boolean;
  testing: boolean;
  testPassed: boolean;
  onTest: () => void;
  onContinue: () => void;
  onBack: () => void;
  prevEndpoint: string | null;
  nextEndpoint: string | null;
  onPrev: () => void;
  onNext: () => void;
}

const FooterActions: React.FC<Props> = ({
  section,
  tested,
  testing,
  onTest,
  onContinue,
  onBack,
  prevEndpoint,
  nextEndpoint,
  onPrev,
  onNext,
}) => {
  const leftLabel = section === 1 ? '← Request' : section === 2 ? '← Query Parameters' : null;

  const rightLabel =
    section === 0
      ? 'Query Parameters →'
      : section === 1
        ? 'Schedule →'
        : testing
          ? 'Testing...'
          : tested
            ? '✓ Test passed'
            : 'Test Endpoint';

  const rightDisabled = section === 2 && testing;
  const rightIsDone = section === 2 && tested;

  const rightStyle: React.CSSProperties = rightIsDone
    ? {
        padding: '8px 20px',
        fontSize: 13,
        fontWeight: 600,
        border: '1px solid var(--fq-color-green)',
        borderRadius: 'var(--fq-radius-md)',
        background: 'var(--fq-color-green-light)',
        color: 'var(--fq-color-green)',
        cursor: 'default',
      }
    : rightDisabled
      ? {
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 600,
          border: '1px solid var(--fq-color-gray-300)',
          borderRadius: 'var(--fq-radius-md)',
          background: 'var(--fq-color-gray-50)',
          color: 'var(--fq-color-text-muted)',
          cursor: 'not-allowed',
        }
      : {
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          borderRadius: 'var(--fq-radius-md)',
          background: 'var(--fq-color-primary)',
          color: '#fff',
          cursor: 'pointer',
        };

  const handleRight = () => {
    if (rightDisabled || rightIsDone) return;
    if (section === 2) {
      onTest();
    } else {
      onContinue();
    }
  };

  return (
    <div>
      <div
        style={{
          borderTop: '1px solid var(--fq-color-border)',
          paddingTop: 16,
          marginTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {leftLabel ? (
          <button
            onClick={onBack}
            style={{
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid var(--fq-color-border)',
              borderRadius: 'var(--fq-radius-md)',
              background: '#fff',
              color: 'var(--fq-color-text-primary)',
              cursor: 'pointer',
            }}
          >
            {leftLabel}
          </button>
        ) : (
          <span />
        )}

        <button style={rightStyle} onClick={handleRight} disabled={rightDisabled}>
          {rightLabel}
        </button>
      </div>

      {(prevEndpoint || nextEndpoint) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          {prevEndpoint ? (
            <button
              onClick={onPrev}
              style={{
                fontSize: 12,
                color: 'var(--fq-color-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ← {prevEndpoint}
            </button>
          ) : (
            <span />
          )}
          {nextEndpoint ? (
            <button
              onClick={onNext}
              style={{
                fontSize: 12,
                color: 'var(--fq-color-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {nextEndpoint} →
            </button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
};

export default FooterActions;
