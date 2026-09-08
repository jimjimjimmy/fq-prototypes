import React from 'react';
import type { Q1 } from '../../lib/connectorChoice';

type Props = {
  value: Q1 | null;
  onChange: (q1: Q1) => void;
};

type Card = { id: Q1; title: string; description: string };

const cards: Card[] = [
  {
    id: 'pre-built',
    title: 'Pre-Built',
    description: 'FQ-supported integrations like QuickBooks Online, NetSuite, Sage Intacct.',
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Bring your own data via file upload, API, or SFTP.',
  },
];

const Q1PreBuiltCustom: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="reveal-in">
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--fq-color-text-primary)', margin: '0 0 12px' }}>
        Pre-Built or Custom?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {cards.map((card) => {
          const selected = value === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onChange(card.id)}
              style={{
                textAlign: 'left',
                padding: 14,
                border: `1px solid ${selected ? 'var(--fq-brand)' : 'var(--fq-color-border)'}`,
                borderRadius: 'var(--fq-radius-lg)',
                background: selected ? 'var(--fq-accent-soft)' : '#fff',
                cursor: 'pointer',
                transition: 'background 120ms ease, border-color 120ms ease',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--fq-color-text-primary)',
                  marginBottom: 4,
                }}
              >
                {card.title}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--fq-color-text-secondary)', lineHeight: 1.5 }}>
                {card.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Q1PreBuiltCustom;
