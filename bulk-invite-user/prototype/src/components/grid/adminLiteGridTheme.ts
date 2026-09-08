import { floqastGridTheme } from './floqastGridTheme'

/**
 * adminLiteGridTheme — the canonical "lightweight" AG Grid profile for FloQast
 * Admin Settings tables.
 *
 * Source: knowledge/design-system/research/ag-grid-admin-settings/README.md
 * (Natasha Clark, 2026-06-01). Admin lists are systems-of-record — browse,
 * find, lightly adjust — so they bump typography + density up from the
 * data-heavy floqastGridTheme baseline and turn every heavyweight grid
 * feature OFF (no filters, grouping, pivoting, side panels, range selection).
 *
 * Overrides vs floqastGridTheme baseline:
 *   fontSize   13px (up from 12px) — scannable, not data-dense
 *   spacing    12px (up from 8px)  — comfortable density
 *   headerHeight 44px
 * Row height is content-driven via colDef autoHeight (room for 32px avatars
 * + multi-line workspace-access cells), not a fixed rowHeight.
 */
export const adminLiteGridTheme = floqastGridTheme.withParams({
  fontSize: '13px',
  spacing: '12px',
  headerHeight: 44,
  // accentColor, borderColor, foregroundColor, headerBackgroundColor inherited
})
