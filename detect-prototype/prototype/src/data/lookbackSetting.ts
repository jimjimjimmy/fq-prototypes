import { useEffect, useState } from 'react';

/**
 * Lookback Period — shared between Settings → General and the
 * Insights detail pane. Persisted to localStorage so the value
 * survives reloads, and broadcasts changes via a custom event so
 * surfaces consuming the hook re-render the moment the user
 * saves a new value (instead of waiting until they navigate away
 * and back).
 *
 * Defaults to 24 months — matches the GENERAL_INITIAL value in
 * SettingsModal so the prototype tells a coherent story on first
 * load.
 */

const LOOKBACK_KEY = 'detect-lookback-months';
const LOOKBACK_EVENT = 'detect-lookback-changed';
const DEFAULT_LOOKBACK_MONTHS = 24;

export function getLookbackMonths(): number {
  if (typeof window === 'undefined') return DEFAULT_LOOKBACK_MONTHS;
  const stored = window.localStorage.getItem(LOOKBACK_KEY);
  const parsed = stored ? Number(stored) : NaN;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_LOOKBACK_MONTHS;
}

export function setLookbackMonths(months: number): void {
  window.localStorage.setItem(LOOKBACK_KEY, String(months));
  // Same-tab fan-out — `storage` only fires across tabs natively.
  window.dispatchEvent(new CustomEvent(LOOKBACK_EVENT));
}

export function useLookbackMonths(): number {
  const [months, setMonths] = useState<number>(() => getLookbackMonths());
  useEffect(() => {
    const handler = () => setMonths(getLookbackMonths());
    window.addEventListener(LOOKBACK_EVENT, handler);
    window.addEventListener('storage', handler); // cross-tab
    return () => {
      window.removeEventListener(LOOKBACK_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);
  return months;
}

/**
 * Compute the human-readable lookback strip rendered in the
 * Insights detail pane. Returns the summary ("Last 12 months")
 * and the date range ("May 2025 – Apr 2026") separately so
 * surfaces can render the summary inline and tuck the range
 * into a tooltip on demand.
 *
 * The window is anchored at the end of the prior month (so an
 * insight surfaced on May 14 looks at "May 2025 – Apr 2026") to
 * align with how close periods conventionally span the prior
 * calendar month.
 */
export function formatLookbackLabel(
  months: number,
  now: Date = new Date(),
): { summary: string; range: string } {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  // End of window = previous month (close-period convention).
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  // Start = end - (months - 1) so an N-month window inclusive of
  // both endpoints spans N months total.
  const start = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (months - 1), 1),
  );
  const noun = months === 1 ? 'month' : 'months';
  return {
    summary: `Last ${months} ${noun}`,
    range: `${fmt(start)} – ${fmt(end)}`,
  };
}
