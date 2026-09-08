import { useEffect } from 'react';
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle';
import Close from '@floqastinc/flow-ui_icons/material/Close';

interface Props {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * Success toast — matches the FlowUI white-toast pattern shown in
 * Figma node 2123:90167. Icons come from `@floqastinc/flow-ui_icons`;
 * chrome (surface, border, shadow, typography) is hand-rolled because
 * FlowUI's exported `Toast` component is the dark-surface variant,
 * not the white one.
 *
 * Tokens are inlined from the Figma variable defs:
 *   border         #cbd2e1  (Buttons/Secondary-Dark/default-border)
 *   text           #1b1f27  (Text colors/header-secondary-text)
 *   icon (success) #1fac76  (Semantic Colors/success-primary)
 *   icon (close)   #1d2433cc (Icons/icon-secondary)
 *   shadow         0 2px 4px 0 #00000012 (Elevation/100)
 *   padding        16px     (Spacing/Padding/16)
 *   radius         6px      (Border Radius/border-radius)
 *
 * Bottom-right pinned with a slide-in animation. Used after
 * successful saves, dismissals, etc.
 */
export function Toast({ message, onDismiss, durationMs = 4500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60]">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex items-center gap-3 rounded-md border bg-white [animation:toast-in_240ms_ease-out_both]"
        style={{
          borderColor: '#cbd2e1' /* --flo-cmp-color-border-button-outlined-dark */,
          boxShadow: '0px 2px 4px 0px #00000012' /* --flo-sem-shadow-100 */,
          paddingTop: 13,
          paddingBottom: 13,
          paddingLeft: 16,
          paddingRight: 16,
          minWidth: 320,
        }}
      >
        <span className="inline-flex shrink-0">
          <CheckCircle
            size={20}
            color="#1fac76" /* --flo-sem-color-success-primary */
          />
        </span>
        <span
          className="flex-1"
          style={{
            fontFamily:
              'Museo Sans, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            fontSize: 12,
            lineHeight: '18px',
            color: '#1b1f27' /* --flo-sem-color-text-header-secondary */,
          }}
        >
          {message}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-[#f1f3f9]"
        >
          <Close size={16} color="#1d2433cc" /* --flo-sem-color-icon-secondary */ />
        </button>
      </div>

      <style>{`
        @keyframes toast-in {
          0%   { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
