import { useState } from 'react';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import Button from '@floqastinc/flow-ui_core/Button';
import { SUGGESTED_RULES } from '../data/suggested-rules';
import type { SuggestedRuleCategory } from '../types';

interface SuggestedRulesProps {
  onCreateRule: (name: string, description: string, naturalLanguageInput: string) => void;
}

function RuleCard({ rule, onAdd }: {
  rule: typeof SUGGESTED_RULES[0];
  onAdd: () => void;
}) {
  return (
    <div style={{
      background: 'var(--flo-sem-color-surface-default, #fff)',
      border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
      borderRadius: 8,
      padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 13, fontWeight: 600, lineHeight: '18px',
          fontFamily: 'Inter, sans-serif',
          color: 'var(--flo-sem-color-text-default, #1d2433)',
        }}>
          {rule.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 10px', borderRadius: 12,
            fontSize: 11, fontWeight: 600, lineHeight: '16px',
            fontFamily: 'Inter, sans-serif',
            background: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)',
            color: 'var(--flo-sem-color-success, #1fac76)',
          }}>
            {rule.anomalyCount} anomalies
          </span>
          <Button variant="outlined" size="sm" onClick={onAdd}>Add Rule</Button>
        </div>
      </div>
      <p style={{
        fontSize: 12, lineHeight: '18px',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--flo-sem-color-text-secondary, #424867)',
        margin: 0,
      }}>
        {rule.description}
      </p>
    </div>
  );
}

function RuleSection({ category, onCreateRule, initialVisible }: {
  category: SuggestedRuleCategory;
  onCreateRule: SuggestedRulesProps['onCreateRule'];
  initialVisible?: number;
}) {
  const rules = SUGGESTED_RULES.filter(r => r.category === category);
  const [visibleCount, setVisibleCount] = useState(initialVisible || rules.length);
  const hasMore = visibleCount < rules.length;

  return (
    <div style={{
      background: 'var(--flo-sem-color-surface-secondary, #f8fafc)',
      borderRadius: 8,
      padding: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <AutoAwesome size={18} color="var(--flo-sem-color-success, #1fac76)" />
        <span style={{
          fontSize: 15, fontWeight: 700, lineHeight: '20px',
          fontFamily: '"Museo Sans", sans-serif',
          color: 'var(--flo-sem-color-text-default, #1d2433)',
        }}>
          {category}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rules.slice(0, visibleCount).map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onAdd={() => onCreateRule(rule.name, rule.description, rule.naturalLanguageInput)}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: 16 }}>
          <Button variant="outlined" size="sm" onClick={() => setVisibleCount(c => c + 3)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SuggestedRules({ onCreateRule }: SuggestedRulesProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--flo-sem-color-surface-default, #fff)' }}>
      {/* Page header */}
      <div style={{ padding: '24px 24px 0', flexShrink: 0 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 700, lineHeight: '32px',
          fontFamily: '"Museo Sans", sans-serif',
          color: 'var(--flo-sem-color-text-default, #1d2433)',
          margin: '0 0 8px 0',
        }}>
          Suggested Rules
        </h1>
        <p style={{
          fontSize: 13, lineHeight: '20px',
          fontFamily: 'Inter, sans-serif',
          color: 'var(--flo-sem-color-text-secondary, #424867)',
          margin: '0 0 16px 0',
        }}>
          The rules below are based on an initial analysis of your transactions and common accounting anomalies.
        </p>

        {/* Info banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '12px 16px', borderRadius: 8, marginBottom: 24,
          background: 'var(--flo-sem-color-surface-info-subtle, #e0f2fe)',
        }}>
          <Info size={18} color="var(--flo-sem-color-info, #3d7bf7)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{
            fontSize: 12, lineHeight: '18px',
            fontFamily: 'Inter, sans-serif',
            color: 'var(--flo-sem-color-info-emphasis, #1e40af)',
          }}>
            The count of anomalies is based on how many transactions in the current period would be flagged if the rule was activated and may be duplicative against any rules you've already created
          </span>
        </div>
      </div>

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 520 }}>
          <RuleSection category="Transaction Analysis Rules" onCreateRule={onCreateRule} initialVisible={3} />
          <RuleSection category="Common Accounting Anomalies" onCreateRule={onCreateRule} />
        </div>
      </div>
    </div>
  );
}
