import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}

/**
 * Simple modal primitive used across the app (resolution picker, handoff
 * modals, dismiss reason, rule detail). Esc to close; click backdrop to close.
 */
export function Modal({ title, subtitle, onClose, children, footer, size = 'md' }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const width = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full ${width} max-h-[90vh] flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#e1e6ef] px-6 py-4">
          <div className="min-w-0">
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 font-['Inter'] text-xs font-normal leading-4 text-[#6b7280]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
