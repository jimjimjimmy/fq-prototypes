import { useMemo, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAppStore, transactions } from '../../../store/useAppStore';
import { getAccount } from '../../../data/chartOfAccounts';
import { getPeriod } from '../../../data/company';
import type { Resolution } from '../../../data/types';

interface Props {
  recordId: string;
  onDone: (toast: string) => void;
  onClose: () => void;
}

/**
 * Flux / Variance Analysis handoff modal.
 *
 * Attaches a narrative explanation to the variance row for this account
 * in the current period's flux analysis. The variance shown is illustrative
 * — in a real integration it would come from Variance Analysis.
 */
export function FluxModal({ recordId, onDone, onClose }: Props) {
  const record = useAppStore((s) => s.records.find((r) => r.id === recordId));
  const resolveRecord = useAppStore((s) => s.resolveRecord);

  const transaction = useMemo(
    () => (record ? transactions.find((t) => t.id === record.transactionId) : null),
    [record],
  );

  const [explanation, setExplanation] = useState('');
  const [markComplete, setMarkComplete] = useState(true);

  if (!record || !transaction) return null;

  const period = getPeriod(transaction.periodId);
  const monthAbbr = period?.label.split(' ')[0].slice(0, 3).toUpperCase() ?? 'APR';
  const fluxId = `FLUX-${monthAbbr}-${transaction.glAccountCode}`;
  const account = getAccount(transaction.glAccountCode);
  const fluxLabel = `${transaction.glAccountCode} ${account?.name ?? ''}`;

  // Illustrative variance (in a real integration, this would come from the flux service)
  const variance = Math.round(transaction.amount * 0.7);
  const variancePct = 23;

  const submit = () => {
    const resolution: Resolution = {
      kind: 'flux-explanation',
      fluxId,
      account: fluxLabel,
      at: new Date().toISOString(),
      byId: 'samantha-sheldon',
    };
    resolveRecord(recordId, resolution);
    onDone(`Explanation attached to flux for ${fluxLabel}, April vs March`);
    onClose();
  };

  return (
    <Modal
      title="Add a flux / variance explanation"
      subtitle="This narrative attaches to the account's variance row so it carries through to close review."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={explanation.trim().length === 0}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-slate-300"
          >
            Attach Explanation
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Variance row
          </div>
          <div className="mt-1 font-medium text-slate-900">{fluxLabel}</div>
          <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Prior</div>
              <div className="font-mono tabular-nums text-slate-700">
                $—
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Current</div>
              <div className="font-mono tabular-nums text-slate-700">
                $—
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Variance</div>
              <div className="font-mono tabular-nums text-rose-700">
                +${variance.toLocaleString()} ({variancePct}%)
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Explanation
          </label>
          <textarea
            rows={4}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="What explains this variance? E.g., 'Q2 sponsorship upgrade for SaaStr — pre-approved by CFO, outside normal cadence.'"
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={markComplete}
            onChange={(e) => setMarkComplete(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Mark this account's variance explanation as complete for April 2026
        </label>
      </div>
    </Modal>
  );
}
