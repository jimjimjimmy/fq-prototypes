import React from 'react';
import ProgressBar from './ProgressBar';
import CollapsedAnswerRow from './CollapsedAnswerRow';
import Q1PreBuiltCustom from './Q1PreBuiltCustom';
import Q2SystemOrType from './Q2SystemOrType';
import Q3QboTier from './Q3QboTier';
import {
  CUSTOM_TYPES,
  PRE_BUILT_SYSTEMS,
  isComplete,
  v2AnswersToChoice,
} from '../../lib/connectorChoice';
import type {
  CustomTransmission,
  PreBuiltSystem,
  Q1,
  QboTier,
  V2Answers,
  ConnectorChoice,
} from '../../lib/connectorChoice';

type Props = {
  answers: V2Answers;
  onAnswersChange: (answers: V2Answers) => void;
  onCancel: () => void;
  onSubmit: (choice: ConnectorChoice) => void;
};

function q2Label(q1: Q1): string {
  return q1 === 'pre-built' ? 'Which system?' : 'Which connection type?';
}

function q2Value(answers: V2Answers): string {
  if (!answers.q2) return '';
  if (answers.q1 === 'pre-built') {
    return PRE_BUILT_SYSTEMS.find((s) => s.id === answers.q2)?.name ?? '';
  }
  return CUSTOM_TYPES.find((t) => t.id === answers.q2)?.name ?? '';
}

function progressPercent(answers: V2Answers): number {
  const needsQ3 = answers.q1 === 'pre-built' && answers.q2 === 'qbo';
  const total = needsQ3 ? 3 : 2;
  let done = 0;
  if (answers.q1) done += 1;
  if (answers.q2) done += 1;
  if (needsQ3 && answers.q3) done += 1;
  return (done / total) * 100;
}

const V2Picker: React.FC<Props> = ({ answers, onAnswersChange, onCancel, onSubmit }) => {
  const q1Answered = !!answers.q1;
  const q2Answered = !!answers.q2;
  const needsQ3 = answers.q1 === 'pre-built' && answers.q2 === 'qbo';
  const complete = isComplete(answers);

  const setQ1 = (q1: Q1) => onAnswersChange({ q1, q2: null, q3: null });
  const setQ2 = (q2: PreBuiltSystem | CustomTransmission) =>
    onAnswersChange({ ...answers, q2, q3: null });
  const setQ3 = (q3: QboTier) => onAnswersChange({ ...answers, q3 });

  const editQ1 = () => onAnswersChange({ q1: null, q2: null, q3: null });
  const editQ2 = () => onAnswersChange({ ...answers, q2: null, q3: null });

  const handleContinue = () => {
    const choice = v2AnswersToChoice(answers);
    if (choice) onSubmit(choice);
  };

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
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 52,
          background: '#fff',
          borderBottom: '1px solid var(--fq-color-border)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            fontSize: 13,
            color: 'var(--fq-color-text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ✕ Cancel
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--fq-color-text-primary)' }}>
          Add a connector
        </span>
        <div style={{ width: 60 }} />
      </div>

      {/* Picker body */}
      <div
        className="modal-in"
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            background: '#fff',
            border: '1px solid var(--fq-color-border)',
            borderRadius: 'var(--fq-radius-xl)',
            boxShadow: 'var(--fq-shadow-md)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '20px 24px 12px' }}>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--fq-color-text-primary)',
                margin: 0,
                marginBottom: 4,
              }}
            >
              Add a connector
            </h1>
            <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: 0 }}>
              A few quick questions to get you connected.
            </p>
          </div>

          <div style={{ padding: '0 24px' }}>
            <ProgressBar percent={progressPercent(answers)} />
          </div>

          <div style={{ padding: '20px 24px 8px' }}>
            {/* Q1 */}
            {q1Answered ? (
              <CollapsedAnswerRow
                label="Pre-Built or Custom?"
                value={answers.q1 === 'pre-built' ? 'Pre-Built' : 'Custom'}
                onEdit={editQ1}
              />
            ) : (
              <Q1PreBuiltCustom value={answers.q1} onChange={setQ1} />
            )}

            {/* Q2 */}
            {q1Answered &&
              (q2Answered ? (
                <CollapsedAnswerRow label={q2Label(answers.q1!)} value={q2Value(answers)} onEdit={editQ2} />
              ) : (
                <Q2SystemOrType q1={answers.q1!} value={answers.q2} onChange={setQ2} />
              ))}

            {/* Q3 */}
            {needsQ3 && q2Answered && <Q3QboTier value={answers.q3} onChange={setQ3} />}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '14px 24px',
              borderTop: '1px solid var(--fq-color-border)',
            }}
          >
            <button
              onClick={handleContinue}
              disabled={!complete}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                background: complete ? 'var(--fq-brand)' : 'var(--fq-color-gray-200)',
                color: complete ? '#fff' : 'var(--fq-color-text-muted)',
                border: 'none',
                borderRadius: 'var(--fq-radius-md)',
                cursor: complete ? 'pointer' : 'not-allowed',
                opacity: complete ? 1 : 0.6,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2Picker;
