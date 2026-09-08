import { useState } from 'react';
import Button from '@floqastinc/flow-ui_core/Button';
import Modal from '@floqastinc/flow-ui_core/Modal';
import type { Rule } from '../types';

const tok = {
  bodyText: 'var(--flo-sem-color-text-default, #1d2433)',
  bodySecondary: 'var(--flo-sem-color-text-secondary, #424867)',
  muted: 'var(--flo-sem-color-text-tertiary, #adb2bb)',
  border: 'var(--flo-sem-color-border-default, #e1e6ef)',
  warningBg: 'var(--flo-sem-color-surface-warning-subtle, #fff8eb)',
  warningText: 'var(--flo-sem-color-warning-emphasis, #92400e)',
};

export default function DeactivateRuleModal({
  rule,
  isOpen,
  onClose,
  onConfirm,
}: {
  rule: Rule | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rule: Rule, periodScope: 'current' | 'current-future') => void;
}) {
  const [periodScope, setPeriodScope] = useState<'current' | 'current-future'>('current-future');

  if (!rule || !isOpen) return null;

  const isReactivation = rule.status === 'Deactivated';

  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <div style={{ padding: 24, maxWidth: 480 }}>
        <h3 style={{
          fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 18,
          lineHeight: '24px', color: tok.bodyText, margin: '0 0 16px 0',
        }}>
          {isReactivation ? 'Reactivate Rule' : 'Deactivate Rule'}
        </h3>

        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: '20px',
          color: tok.bodySecondary, margin: '0 0 16px 0',
        }}>
          {isReactivation
            ? `Are you sure you want to reactivate "${rule.name}"? The rule will begin running against transactions again.`
            : `Are you sure you want to deactivate "${rule.name}"? This will remove any anomalies flagged by this rule on transactions.`
          }
        </p>

        {!isReactivation && (
          <>
            <div style={{
              background: tok.warningBg, borderRadius: 6, padding: 12, marginBottom: 16,
              fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '18px', color: tok.warningText,
            }}>
              ⚠ Anomalies with existing user activity (sign-offs, comments) will not be removed.
            </div>

            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, lineHeight: '16px',
              color: tok.bodyText, margin: '0 0 8px 0',
            }}>
              Apply deactivation to:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText,
              }}>
                <input
                  type="radio"
                  name="periodScope"
                  checked={periodScope === 'current-future'}
                  onChange={() => setPeriodScope('current-future')}
                  style={{ accentColor: 'var(--flo-sem-color-success, #1fac76)' }}
                />
                Current and future periods
              </label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText,
              }}>
                <input
                  type="radio"
                  name="periodScope"
                  checked={periodScope === 'current'}
                  onChange={() => setPeriodScope('current')}
                  style={{ accentColor: 'var(--flo-sem-color-success, #1fac76)' }}
                />
                Current period only
              </label>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="outlined" color="dark" onClick={onClose} size="sm">Cancel</Button>
          <Button
            onClick={() => onConfirm(rule, periodScope)}
            size="sm"
            color={isReactivation ? undefined : 'danger' as any}
          >
            {isReactivation ? 'Reactivate' : 'Confirm Deactivation'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
