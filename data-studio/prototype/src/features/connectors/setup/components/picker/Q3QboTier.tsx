import React from 'react';
import type { QboTier } from '../../lib/connectorChoice';

type Props = {
  value: QboTier | null;
  onChange: (tier: QboTier) => void;
};

type Card = {
  id: QboTier;
  title: string;
  subtitle: string;
  bullets: string[];
};

const cards: Card[] = [
  {
    id: 'basic',
    title: 'QBO Basic',
    subtitle: 'Direct API · OAuth',
    bullets: ['Accounts', 'Trial Balance', 'Daily sync'],
  },
  {
    id: 'enhanced',
    title: 'QBO Enhanced',
    subtitle: 'Continuous sync · broader scope',
    bullets: ['Accounts + Balances', 'Transactions', 'Dimensions', 'Continuous sync'],
  },
];

const Q3QboTier: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="reveal-in">
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--fq-color-text-primary)', margin: '0 0 4px' }}>
        How do you want to connect QBO?
      </h3>
      <p style={{ fontSize: 12.5, color: 'var(--fq-color-text-secondary)', margin: '0 0 12px' }}>
        Since you picked QBO, we need one more thing.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {cards.map((card) => {
          const selected = value === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onChange(card.id)}
              style={{
                textAlign: 'left',
                padding: 16,
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
                  marginBottom: 2,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--fq-color-text-muted)',
                  marginBottom: 10,
                }}
              >
                {card.subtitle}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {card.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontSize: 12.5,
                      color: 'var(--fq-color-text-secondary)',
                      paddingLeft: 12,
                      position: 'relative',
                      lineHeight: 1.7,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 9,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'var(--fq-color-text-muted)',
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Q3QboTier;
