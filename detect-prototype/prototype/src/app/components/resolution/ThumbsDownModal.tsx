import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAppStore } from '../../../store/useAppStore';

interface Props {
  recordId: string;
  flagId: string;
  onDone: (toast: string) => void;
  onClose: () => void;
}

const REASONS = [
  'This is expected behavior for this vendor',
  'Documentation exists outside the system',
  'Pre-approved exception',
  'Transaction was already reviewed manually',
  'Rule covers this more precisely',
  'Other (see note)',
];

/**
 * 👎 "Wrong" modal — captures the training signal with a reason.
 * Stored on the flag's `feedback` field so the model can learn from it.
 */
export function ThumbsDownModal({ recordId, flagId, onDone, onClose }: Props) {
  const recordFeedback = useAppStore((s) => s.recordFeedback);
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState('');

  const submit = () => {
    const fullReason = note.trim() ? `${reason} — ${note.trim()}` : reason;
    recordFeedback(recordId, flagId, 'down', fullReason);
    onDone('Feedback recorded — the model will learn from this');
    onClose();
  };

  return (
    <Modal
      title="Tell us why this was wrong"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
          >
            Record Feedback
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="font-['Inter'] text-xs font-normal leading-[18px] text-[#424867]">
          Your feedback trains the model for future anomaly detection on this account.
        </p>
        <div>
          <label className="font-['Inter'] text-xs font-bold leading-4 text-[#1d2433]">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-[#e1e6ef] bg-white px-2 font-['Inter'] text-xs font-medium leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
          >
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-['Inter'] text-xs font-bold leading-4 text-[#1d2433]">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Any context that helps the model learn faster."
            className="mt-1.5 w-full rounded-md border border-[#e1e6ef] bg-white px-2 py-2 font-['Inter'] text-xs font-medium leading-[18px] text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
