import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { RulesPage } from './RulesPage';
import { AddRulePage } from './AddRulePage';
import { DiscardChangesDialog } from './DiscardChangesDialog';

/**
 * Rules workspace modal — a single large modal that hosts the
 * complete Rules experience: the rules table AND the Add Rule
 * creation form. Clicking "+ Add Rule" swaps the modal body to the
 * form; Cancel / Save / breadcrumb-Rules returns to the table —
 * always inside the same modal, no surface teleporting.
 *
 * Why one modal and not page-page-modal:
 *   - The modal is already large (max-w-3xl, 92vh) — plenty of room
 *     for the form's max-w-[640px] inner column.
 *   - Single mental model: "I'm in Rules" stays true open-to-close.
 *   - Save → back to list → close X is linear and predictable; no
 *     reopening of the modal for confirmation.
 *
 * Esc behavior is contextual: in Add Rule view, Esc steps back to
 * the list; otherwise Esc closes the modal.
 */
export function RulesListModal({
  onClose,
  onOpenRule,
  onEditRule,
  onDuplicateRule,
  onDeactivateRule,
  onActivateRule,
  onSaveSuccess,
}: {
  onClose: () => void;
  /** Fires after the user confirms the Save Rule dialog inside the
   *  Add Rule form. Host wires this to show the success toast. */
  onSaveSuccess?: (info: {
    scope: 'current-and-future' | 'with-historical';
    historicalPeriods: string[];
    formSnapshot?: {
      name: string;
      description: string;
      severity: number;
      conditions: Array<{ field: string; operator: string; value: string }>;
    };
  }) => void;
  onOpenRule?: (ruleId: string) => void;
  /** Fires when the user picks "Edit Rule" from a kebab menu. Host
   *  opens the rule detail modal directly in edit mode (skipping
   *  view). Distinct from clicking the rule name, which opens the
   *  view-only modal. */
  onEditRule?: (ruleId: string) => void;
  /** Fires when the user picks "Duplicate Rule" from a kebab menu.
   *  Host typically opens the rule detail modal in edit mode with
   *  the source rule's data. */
  onDuplicateRule?: (ruleId: string) => void;
  /** Fires when the user picks "Deactivate Rule" (only on rules
   *  that are currently active). Host shows the warning dialog. */
  onDeactivateRule?: (ruleId: string) => void;
  /** Fires when the user picks "Activate Rule" (only on rules that
   *  are currently inactive). Host flips status back to active. */
  onActivateRule?: (ruleId: string) => void;
}) {
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  // Dirty state of the Add Rule form, mirrored from AddRulePage via
  // onDirtyChange. We keep it in both state (for re-renders) and a
  // ref (for synchronous reads inside close handlers — React state
  // updates are async, so the ref always has the latest value).
  const formDirty = useRef(false);
  const [, forceRerender] = useState(0);
  const setFormDirty = (d: boolean) => {
    formDirty.current = d;
    forceRerender((v) => v + 1);
  };
  // Pending action queued behind the discard-changes warning. When
  // set, the warning is showing; confirming runs `pendingClose`,
  // dismissing throws it away.
  const [pendingClose, setPendingClose] = useState<null | (() => void)>(null);

  // Gated close helper — used by Cancel, modal X, backdrop, Esc.
  // When the form is dirty, queue the action behind the discard
  // warning; otherwise run it immediately.
  const attemptClose = (action: () => void) => {
    if (addRuleOpen && formDirty.current) {
      setPendingClose(() => action);
    } else {
      action();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Esc dismisses the discard dialog first if it's open.
      if (pendingClose) {
        setPendingClose(null);
        return;
      }
      attemptClose(() => {
        if (addRuleOpen) setAddRuleOpen(false);
        else onClose();
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, addRuleOpen, pendingClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={() => attemptClose(onClose)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // Width is responsive to the inner view:
        //   • Rules table → max-w-5xl (extra room over the prior
        //     max-w-4xl so long month names in Starting Period
        //     — "September 2026", "November 2026" — never wrap)
        //   • Add Rule form → max-w-3xl (form content is ~640px so a
        //     narrower modal removes the excess whitespace)
        // Height hugs content (max-h-[92vh] caps it on overflow);
        // dropping `h-full` lets the table view size to its row count
        // and the form size to its sections.
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)] transition-[max-width] duration-200 ${
          addRuleOpen ? 'max-w-3xl' : 'max-w-5xl'
        }`}
      >
        {/* Modal header — title on the left; on the right, the
             "+ Add Rule" CTA sits beside the close X when we're
             viewing the rules table (in Add Rule view it's hidden
             since the user is already inside the form). The Add
             Rule button moved here from the page header so the
             primary action lives at the top of the workspace
             alongside dismiss. */}
        <header className="flex items-center justify-between gap-3 border-b border-[#e1e6ef] px-6 py-3">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            {addRuleOpen ? 'Add Rule' : 'Rules'}
          </h2>
          <div className="flex items-center gap-2">
            {!addRuleOpen && (
              <button
                type="button"
                onClick={() => setAddRuleOpen(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Rule
              </button>
            )}
            <button
              type="button"
              onClick={() => attemptClose(onClose)}
              aria-label="Close"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Body — rules table OR Add Rule form. The form's
             breadcrumb-Rules and Cancel/Save all return to the list
             by clearing addRuleOpen, keeping the user in this modal.
             AddRulePage's onClose is gated by attemptClose so the
             user gets a discard-changes warning when they cancel
             with unsaved edits. */}
        <div className="flex min-h-0 flex-1 flex-col">
          {addRuleOpen ? (
            <AddRulePage
              onClose={() => attemptClose(() => setAddRuleOpen(false))}
              onDirtyChange={setFormDirty}
              onSaveSuccess={onSaveSuccess}
            />
          ) : (
            <RulesPage
              embedded
              onAddRule={() => setAddRuleOpen(true)}
              onOpenRule={onOpenRule}
              onEditRule={onEditRule}
              onDuplicateRule={onDuplicateRule}
              onDeactivateRule={onDeactivateRule}
              onActivateRule={onActivateRule}
            />
          )}
        </div>
      </div>

      {pendingClose && (
        <DiscardChangesDialog
          onKeepEditing={() => setPendingClose(null)}
          onDiscard={() => {
            const action = pendingClose;
            setPendingClose(null);
            setFormDirty(false);
            action();
          }}
        />
      )}
    </div>
  );
}
