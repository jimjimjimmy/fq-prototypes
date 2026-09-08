import { useMemo, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAppStore, transactions } from '../../../store/useAppStore';
import { team, getTeamMember } from '../../../data/team';
import { getAccount } from '../../../data/chartOfAccounts';
import type { Resolution } from '../../../data/types';

interface Props {
  recordId: string;
  onDone: (toast: string) => void;
  onClose: () => void;
}

/**
 * Journal Entry handoff modal.
 *
 * For duplicate payments / miscoded transactions / reversals, this creates
 * a draft JE in "Journal Entry Management." The modal shows the pre-filled
 * JE — entity, period, debit/credit lines (auto-computed for the common
 * case of a duplicate payment: Dr AP / Cr Cash), memo linked back to the
 * anomaly, and approver dropdown.
 *
 * Submitting "posts" it: allocates a JE number from the store's counter
 * and attaches it to the anomaly as a Resolution.
 */
export function JournalEntryModal({ recordId, onDone, onClose }: Props) {
  const record = useAppStore((s) => s.records.find((r) => r.id === recordId));
  const resolveRecord = useAppStore((s) => s.resolveRecord);
  const nextJeCounter = useAppStore((s) => s.counters.je);

  const transaction = useMemo(
    () => (record ? transactions.find((t) => t.id === record.transactionId) : null),
    [record],
  );

  const [approverId, setApproverId] = useState('priya-patel');
  const [memo, setMemo] = useState(
    transaction
      ? `Correcting entry for ${transaction.transactionId} — ${transaction.vendorName ?? 'vendor'} (anomaly ${recordId.slice(-6)})`
      : '',
  );

  if (!record || !transaction) return null;

  // Default lines: reverse AP / Cash for duplicate payments; swap signs for
  // reclassifications.
  const lines = [
    {
      account: '2000',
      name: 'Accounts Payable',
      debit: transaction.amount,
      credit: 0,
    },
    {
      account: '1010',
      name: 'Cash - Operating (JPMorgan)',
      debit: 0,
      credit: transaction.amount,
    },
  ];

  const jeNumber = `JE-2026-${String(nextJeCounter + 1).padStart(4, '0')}`;

  const submit = () => {
    // Bump the counter and build the resolution
    const counter = nextJeCounter + 1;
    const newNumber = `JE-2026-${String(counter).padStart(4, '0')}`;
    useAppStore.setState((s) => ({ counters: { ...s.counters, je: counter } }));

    const resolution: Resolution = {
      kind: 'journal-entry',
      jeId: `je-${counter}`,
      jeNumber: newNumber,
      at: new Date().toISOString(),
      byId: 'samantha-sheldon',
    };
    resolveRecord(recordId, resolution);
    const approver = getTeamMember(approverId);
    onDone(
      `Journal entry ${newNumber} submitted to Journal Entry Management${
        approver ? ` — awaiting ${approver.name}` : ''
      }`,
    );
    onClose();
  };

  return (
    <Modal
      title="Post a correcting journal entry"
      subtitle={`This draft will be created in Journal Entry Management as ${jeNumber}.`}
      onClose={onClose}
      size="lg"
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
            Submit for Approval
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <Field label="JE Number" value={jeNumber} mono />
          <Field label="Period" value="April 2026" />
          <Field label="Entity" value={transaction.entityId === 'entity-uk' ? 'Parallax Labs UK' : transaction.entityId === 'entity-ca' ? 'Parallax Labs Canada' : 'Parallax Labs US'} />
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Lines
          </h3>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-1.5 text-left font-medium">Account</th>
                <th className="py-1.5 text-right font-medium">Debit</th>
                <th className="py-1.5 text-right font-medium">Credit</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">
                    <span className="font-mono text-xs text-slate-500">{l.account}</span>{' '}
                    {l.name}
                  </td>
                  <td className="py-2 text-right tabular-nums text-slate-800">
                    {l.debit ? `$${l.debit.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2 text-right tabular-nums text-slate-800">
                    {l.credit ? `$${l.credit.toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
              <tr className="text-xs font-medium text-slate-600">
                <td className="py-1.5">Total</td>
                <td className="py-1.5 text-right tabular-nums">
                  ${lines.reduce((s, l) => s + l.debit, 0).toLocaleString()}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  ${lines.reduce((s, l) => s + l.credit, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Memo
          </label>
          <textarea
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Approver
          </label>
          <select
            value={approverId}
            onChange={(e) => setApproverId(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.roleLabel}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  );
}
