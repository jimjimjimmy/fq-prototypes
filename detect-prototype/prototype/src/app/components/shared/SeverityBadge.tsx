import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ScoreFactor } from '../../../data/types';

/**
 * Severity score pill — shows just the number with color-coded severity band.
 *
 * On hover, reveals an explainer panel (rendered into document.body via a
 * portal so it isn't clipped by overflow:hidden ancestors like the inbox
 * list or animating card wrappers):
 *   - Severity level (High / Medium / Low) + score
 *   - Per-factor breakdown of how the score was composed
 *   - Short methodology note
 */
interface Props {
  severity: number; // 0–100
  size?: 'sm' | 'md' | 'lg';
  breakdown?: ScoreFactor[];
  /** Reserved for future placement variants — not actively used now that
   *  the tooltip is rendered via portal with viewport-aware positioning. */
  tooltipAlign?: 'left' | 'right';
}

export function severityBand(severity: number): 'high' | 'medium' | 'low' {
  if (severity >= 67) return 'high';
  if (severity >= 33) return 'medium';
  return 'low';
}

export function severityLabel(severity: number): string {
  return severityBand(severity) === 'high'
    ? 'High'
    : severityBand(severity) === 'medium'
      ? 'Medium'
      : 'Low';
}

export function SeverityBadge({ severity, size = 'md', breakdown }: Props) {
  const band = severityBand(severity);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const bgColor =
    band === 'high' ? '#fce6e4' : band === 'medium' ? '#fdebd7' : '#fef9c3';
  const textClass =
    band === 'high'
      ? 'text-[#d04232]'
      : band === 'medium'
        ? 'text-[#e15015]'
        : 'text-[#a16207]';

  const sizes =
    size === 'sm'
      ? 'px-1 py-0.5 text-[10px] leading-[14px]'
      : size === 'lg'
        ? 'px-1.5 py-0.5 text-xs leading-4'
        : 'px-1 py-0.5 text-[10px] leading-[14px]';

  const hasBreakdown = breakdown && breakdown.length > 0;
  const levelLabel = severityLabel(severity);

  const showTooltip = () => {
    const el = badgeRef.current;
    if (!el || !hasBreakdown) return;
    const rect = el.getBoundingClientRect();
    const tooltipWidth = 288; // w-72
    // Anchor the tooltip's right edge to the badge's right edge so it
    // doesn't overflow the viewport when the badge is in the inbox.
    const left = Math.max(
      8,
      Math.min(rect.right - tooltipWidth, window.innerWidth - tooltipWidth - 8),
    );
    setPos({ top: rect.bottom + 6, left });
    setHover(true);
  };
  const hideTooltip = () => setHover(false);

  return (
    <>
      <span
        ref={badgeRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`inline-flex cursor-help items-center rounded-[4px] font-['Inter'] font-semibold tabular-nums ${textClass} ${sizes}`}
        style={{ background: bgColor }}
        title={
          hasBreakdown
            ? undefined
            : `${levelLabel} severity · ${severity}/100`
        }
      >
        {severity}
      </span>

      {hasBreakdown && hover && pos &&
        createPortal(
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={hideTooltip}
            className="pointer-events-auto fixed z-[200] w-72 rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.05)]"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="flex items-baseline justify-between border-b border-[#e1e6ef] px-4 py-3">
              <span className="font-header text-sm font-bold leading-5 text-[#1d2433]">
                {levelLabel} severity
              </span>
              <span className="font-['Inter'] text-xs font-semibold leading-4 tabular-nums text-[#424867]">
                {severity} / 100
              </span>
            </div>

            <ul className="space-y-2 px-4 py-3">
              {breakdown!.map((f, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <span className="flex-1 font-['Inter'] text-xs leading-4 text-[#424867]">{f.label}</span>
                  <span
                    className={`shrink-0 font-['Inter'] text-xs font-semibold leading-4 tabular-nums ${
                      f.points >= 0 ? 'text-[#1d2433]' : 'text-[#1FAC76]'
                    }`}
                  >
                    {f.points >= 0 ? '+' : ''}
                    {f.points}
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-t border-[#e1e6ef] px-4 py-3 font-['Inter'] text-[11px] leading-4 text-[#6b7280]">
              Severity score combines dollar exposure, anomaly type weighting,
              and historical pattern deviation. Hover the score on any item to
              see its breakdown.
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
