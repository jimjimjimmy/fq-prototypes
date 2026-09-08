import { X } from 'lucide-react';
import type { ComponentType } from 'react';
import Warning from '@floqastinc/flow-ui_icons/material/Warning';
import Error from '@floqastinc/flow-ui_icons/material/Error';

type ConfirmVariant = 'danger' | 'warning';

type VariantStyle = {
  Icon: ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  iconColor: string;
  buttonClass: string;
};

const VARIANT_STYLES: Record<ConfirmVariant, VariantStyle> = {
  // Destructive — filled FlowUI Error icon in danger-primary red, used
  // for irreversible deletes (e.g. comment delete).
  danger: {
    Icon: Error as VariantStyle['Icon'],
    iconColor: '#d3392f', /* --flo-sem-color-danger-primary */
    buttonClass: 'bg-[#d3392f] hover:bg-[#a82a22]',
  },
  // Warning — filled FlowUI Warning icon in warning-primary orange, used
  // for reversible-but-cautionary actions (e.g. removing a sign-off).
  warning: {
    Icon: Warning as VariantStyle['Icon'],
    iconColor: '#db7712', /* --flo-sem-color-warning-primary */
    buttonClass: 'bg-[#db7712] hover:bg-[#b25d09]',
  },
};

/**
 * Reusable confirmation dialog used for destructive or cautionary actions.
 * Matches the FlowUI confirmation-modal pattern: leading icon + title +
 * close X, body copy, Cancel + variant-colored primary button.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  const { Icon, iconColor, buttonClass } = VARIANT_STYLES[variant];
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pb-5">
          <p className="font-['Inter'] text-xs font-normal leading-[18px] text-[#424867]">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-white transition-colors ${buttonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
