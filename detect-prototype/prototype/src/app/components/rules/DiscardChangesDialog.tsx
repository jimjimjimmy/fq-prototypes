import { useEffect } from 'react';
import { X } from 'lucide-react';
import Warning from '@floqastinc/flow-ui_icons/material/Warning';

/**
 * Discard Changes warning dialog.
 *
 * Shown when the user tries to dismiss the Add Rule / Edit Rule form
 * (via Cancel, modal close X, backdrop click, or Esc) while there are
 * unsaved changes. Lets the user back out and keep editing, or confirm
 * that they want to throw away their work.
 *
 * Matches the warning treatment used by DeactivateRuleDialog —
 * AlertTriangle in FlowUI warning-primary (#db7712), reversible action
 * (not destructive red), confirm button in the same orange palette.
 */
export function DiscardChangesDialog({
  onKeepEditing,
  onDiscard,
}: {
  onKeepEditing: () => void;
  onDiscard: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKeepEditing();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKeepEditing]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onKeepEditing}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      >
        {/* Header — warning triangle + title on the left, close X on
             the right. */}
        <header className="flex items-center justify-between gap-3 px-5 pt-4">
          <div className="flex items-center gap-2.5">
            <Warning
              size={20}
              color="#db7712" /* --flo-sem-color-warning-primary */
              style={{ flexShrink: 0 }}
            />
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              Discard Unsaved Changes
            </h2>
          </div>
          <button
            type="button"
            onClick={onKeepEditing}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div className="px-5 pb-5 pt-3">
          <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
            If you leave now, any unsaved changes will be lost. This action
            can&apos;t be undone.
          </p>
        </div>

        {/* Footer — Keep editing (ghost) + Discard changes
             (warning-primary). */}
        <footer className="flex items-center justify-end gap-3 border-t border-[#e1e6ef] px-5 py-3">
          <button
            type="button"
            onClick={onKeepEditing}
            className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex h-9 items-center rounded-md bg-[#db7712] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#b25d0a]"
          >
            Discard
          </button>
        </footer>
      </div>
    </div>
  );
}
