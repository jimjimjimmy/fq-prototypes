import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAppStore } from '../../../store/useAppStore';

interface Props {
  recordId: string;
  onDone: (toast: string) => void;
  onClose: () => void;
}

const REASONS = [
  'Expected variance',
  'Documentation found offline',
  'Approved exception',
  'Duplicate of another anomaly',
  'Auto-corrected / resolved in ERP',
  'Other (see note)',
];

/**
 * Step 2 of the resolution flow when the user chose "Dismiss".
 * Requires a reason (dropdown) + optional note. Permanent audit trail.
 */
export function DismissModal({ recordId, onDone, onClose }: Props) {
  const dismiss = useAppStore((s) => s.dismissRecord);
  const record = useAppStore((s) => s.records.find((r) => r.id === recordId));
  const isAIFlagged = record?.flags.some((f) => f.source.kind === 'ai') ?? false;
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState('');

  const submit = () => {
    dismiss(recordId, reason, note.trim() || undefined);
    onDone(
      isAIFlagged
        ? 'Anomaly ignored — feedback recorded'
        : 'Anomaly ignored — logged to audit trail',
    );
    onClose();
  };

  const title = isAIFlagged ? "Ignore & don't detect again" : 'Ignore — not an issue';
  const subtitle = isAIFlagged
    ? 'Your reason trains the model — similar patterns won\'t be detected on this account in future scans. Stays on the record permanently.'
    : 'Ignoring requires a reason. This stays on the record permanently.';

  return (
    <Modal
      title={title}
      subtitle={subtitle}
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
            Ignore
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add context for auditors or future reviewers."
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </Modal>
  );
}
