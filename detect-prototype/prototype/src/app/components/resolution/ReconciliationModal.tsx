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
 * Reconciliation handoff modal.
 *
 * Auto-matches the relevant reconciliation by GL account + entity + period.
 * Shows the recon's current state and the note to add for the preparer.
 */
export function ReconciliationModal({ recordId, onDone, onClose }: Props) {
  const record = useAppStore((s) => s.records.find((r) => r.id === recordId));
  const resolveRecord = useAppStore((s) => s.resolveRecord);

  const transaction = useMemo(
    () => (record ? transactions.find((t) => t.id === record.transactionId) : null),
    [record],
  );

  const [note, setNote] = useState('');

  if (!record || !transaction) return null;

  const period = getPeriod(transaction.periodId);
  const account = getAccount(transaction.glAccountCode);
  const monthAbbr = period?.label.split(' ')[0].slice(0, 3).toUpperCase() ?? 'APR';
  const reconId = `REC-${monthAbbr}-${transaction.glAccountCode}`;
  const reconName = `${period?.label ?? 'Current Period'} Recon — ${transaction.glAccountCode} ${account?.name ?? ''}`;

  const submit = () => {
    const resolution: Resolution = {
      kind: 'reconciliation',
      reconId,
      reconName,
      at: new Date().toISOString(),
      byId: 'samantha-sheldon',
    };
    resolveRecord(recordId, resolution);
    onDone(`Added as open item to ${reconName}`);
    onClose();
  };

  return (
    <Modal
      title="Add to a reconciliation"
      subtitle="This item will appear as an open line on the matching reconciliation so it's reviewed during close."
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
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Add to Reconciliation
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Matched reconciliation
          </div>
          <div className="mt-1 font-medium text-slate-900">{reconName}</div>
          <div className="mt-0.5 font-mono text-xs text-slate-500">{reconId}</div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              In progress
            </span>
            <span>3 open items currently</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Note to preparer
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why was this detected for reconciliation review?"
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </Modal>
  );
}
