import { Modal } from '../shared/Modal';
import { BookOpen, CheckSquare, CircleCheck } from 'lucide-react';

export type ResolveKind =
  | 'journal-entry'
  | 'close-task'
  | 'no-action';

interface Props {
  onPick: (kind: ResolveKind) => void;
  onClose: () => void;
}

/**
 * Step 1 of the resolution flow — pick which downstream action to take.
 * Each option hands off to a FloQast product domain:
 *   - Journal Entry → Journal Entry Management
 *   - Reconciliation → Reconciliations
 *   - Close Task → Close Management
 *   - Flux Explanation → Variance Analysis
 *   - Dismiss → audit trail only, stays in Detect
 */
export function ResolvePickerModal({ onPick, onClose }: Props) {
  return (
    <Modal
      title="What would you like to do next?"
      subtitle="Each option creates a matching artifact in another FloQast product."
      onClose={onClose}
      size="lg"
    >
      <div className="grid grid-cols-1 gap-2">
        <Option
          icon={<BookOpen className="h-5 w-5" />}
          title="Post a Correcting Journal Entry"
          description="Creates a draft JE in Journal Entry Management to reverse or reclassify the transaction."
          onClick={() => onPick('journal-entry')}
        />
        <Option
          icon={<CheckSquare className="h-5 w-5" />}
          title="Create a Close Task"
          description="Adds an investigation task to this period's close checklist with an owner and due date."
          onClick={() => onPick('close-task')}
        />
        <div className="my-1 border-t border-slate-100" />
        <Option
          icon={<CircleCheck className="h-5 w-5" />}
          title="Mark as Reviewed — No Action Needed"
          description="The anomaly was reviewed and is valid as posted. Marks the item resolved with no downstream artifact."
          onClick={() => onPick('no-action')}
        />
      </div>
    </Modal>
  );
}

function Option({
  icon,
  title,
  description,
  onClick,
  muted,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
        muted
          ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
      }`}
    >
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
          muted
            ? 'bg-slate-200 text-slate-600'
            : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
        }`}
      >
        {icon}
      </span>
      <div>
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-slate-600">{description}</div>
      </div>
    </button>
  );
}
