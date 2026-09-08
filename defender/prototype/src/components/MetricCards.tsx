import { useState } from 'react';
import TrendingUp from '@floqastinc/flow-ui_icons/material/TrendingUp';
import TrendingDown from '@floqastinc/flow-ui_icons/material/TrendingDown';

interface MetricCardData {
  value: number | string;
  label: string;
  trend?: { direction: 'up' | 'down'; percent: number };
  color?: string;
  onClick?: () => void;
}

interface MetricCardsProps {
  transactionsScanned: number;
  activeRules: number;
  totalAnomalies: number;
  openCount: number;
  investigatingCount: number;
  resolvedCount: number;
  standardCheckCount: number;
  algorithmCount: number;
  accountFingerprintCount: number;
  onStatusClick?: (status: string) => void;
}

function MetricCard({ data }: { data: MetricCardData }) {
  return (
    <div
      onClick={data.onClick}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: 'var(--flo-sem-color-surface-default, #fff)',
        border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
        borderRadius: 6,
        padding: '16px',
        cursor: data.onClick ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (data.onClick) e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--flo-sem-color-surface-default, #fff)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: 20, fontWeight: 700, lineHeight: '28px',
          fontFamily: '"Museo Sans", sans-serif',
          color: data.color || 'var(--flo-sem-color-text-default, #1d2433)',
        }}>
          {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 500, lineHeight: '18px',
          fontFamily: 'Inter, sans-serif',
          color: data.color || 'var(--flo-sem-color-text-secondary, #6b7280)',
        }}>
          {data.label}
        </span>
      </div>
      {data.trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          {data.trend.direction === 'up'
            ? <TrendingUp size={14} color="var(--flo-sem-color-success, #1fac76)" />
            : <TrendingDown size={14} color="var(--flo-sem-color-danger, #d24747)" />
          }
          <span style={{
            fontSize: 11, fontWeight: 500, lineHeight: '16px',
            fontFamily: 'Inter, sans-serif',
            color: data.trend.direction === 'up'
              ? 'var(--flo-sem-color-success, #1fac76)'
              : 'var(--flo-sem-color-danger, #d24747)',
          }}>
            {data.trend.direction === 'up' ? '+' : ''}{data.trend.percent}% from prior period
          </span>
        </div>
      )}
    </div>
  );
}

export default function MetricCards(props: MetricCardsProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'insights'>('metrics');

  // TODO: Trend percentages are hardcoded — derive from period comparison API when available
  const metricsCards: MetricCardData[] = [
    { value: props.transactionsScanned, label: 'Transactions Scanned', trend: { direction: 'up', percent: 22 } },
    { value: props.activeRules, label: 'Active Rules', trend: { direction: 'up', percent: 15 } },
    { value: props.totalAnomalies, label: 'Anomalies', trend: { direction: 'down', percent: 10 } },
    { value: props.openCount, label: 'Open', color: 'var(--flo-sem-color-danger, #d24747)', onClick: () => props.onStatusClick?.('Open') },
    { value: props.investigatingCount, label: 'Investigating', color: 'var(--flo-sem-color-info, #3d7bf7)', onClick: () => props.onStatusClick?.('Investigating') },
    { value: props.resolvedCount, label: 'Resolved', color: 'var(--flo-sem-color-success, #1fac76)', onClick: () => props.onStatusClick?.('Resolved') },
  ];

  const insightCards: MetricCardData[] = [
    { value: props.standardCheckCount, label: 'Integrity Checks', trend: { direction: 'up', percent: 15 } },
    { value: props.algorithmCount, label: 'Algorithms', trend: { direction: 'up', percent: 12 } },
    { value: props.accountFingerprintCount, label: 'Account Fingerprints', trend: { direction: 'down', percent: 12 } },
  ];

  const cards = activeTab === 'metrics' ? metricsCards : insightCards;

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: '"Museo Sans", sans-serif',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: isActive ? 'var(--flo-sem-color-text-default, #1d2433)' : 'var(--flo-sem-color-text-secondary, #6b7280)',
    borderBottom: isActive ? '2px solid var(--flo-sem-color-text-default, #1d2433)' : '2px solid transparent',
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
        paddingLeft: 8,
      }}>
        <button style={tabStyle(activeTab === 'metrics')} onClick={() => setActiveTab('metrics')}>
          Metrics
        </button>
        <button style={tabStyle(activeTab === 'insights')} onClick={() => setActiveTab('insights')}>
          Insight Cards
        </button>
      </div>

      {/* Cards row */}
      <div style={{
        display: 'flex', gap: 12, padding: '16px 24px',
        flex: 1, alignItems: 'flex-start',
      }}>
        {cards.map((card, i) => (
          <MetricCard key={`${activeTab}-${i}`} data={card} />
        ))}
      </div>
    </div>
  );
}
