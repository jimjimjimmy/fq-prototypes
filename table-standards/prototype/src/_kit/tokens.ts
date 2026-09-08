/**
 * FloQast / FlowUI design tokens — the single source of truth for the kit.
 *
 * Three exports, three consumers:
 *   - `t`          → CSS-variable references for JSX/Tailwind chrome (follows live FlowUI theme)
 *   - `tokenValue` → raw hex for AG Grid's themeQuartz.withParams (resolves colors at build time,
 *                    before the CSS-var cascade applies — cannot consume var(--…))
 *   - `palette`    → raw hex for cell-renderer inline styles, so no renderer hardcodes a color
 *
 * Values mirror knowledge/design-system/foundation/colors.md. Change here, propagates everywhere.
 */

/** CSS-variable references — use in JSX/Tailwind so chrome follows any FlowUI theme/rebrand. */
export const t = {
  textBody: 'var(--flo-sem-color-text-body)', //                     #1d2433
  textBodySecondary: 'var(--flo-sem-color-text-body-secondary)', //  #424867
  textBodyTertiary: 'var(--flo-sem-color-text-body-tertiary)', //    #6b7280
  textMuted: 'var(--flo-sem-color-text-muted)', //                   #adb2bb
  textHeaderSecondary: 'var(--flo-sem-color-text-header-secondary)', // #1b1f27

  surfaceBase: 'var(--flo-sem-color-surface-neutral-base)', //       #ffffff
  surfaceWeakest: 'var(--flo-sem-color-surface-neutral-weakest)', // #f8fafc
  surfaceWeaker: 'var(--flo-sem-color-surface-neutral-weaker)', //   #f1f3f9
  optionSelected: 'var(--flo-sem-color-background-option-selected)', // #e1e6ef

  border: 'var(--flo-sem-color-border)', //                          #e1e6ef
  borderWeak: 'var(--flo-sem-color-border-weak)', //                 #f1f3f9
  strokeForms: 'var(--flo-sem-color-stroke-forms)', //              #cbd2e1

  success: 'var(--flo-sem-color-success, #1fac76)',
  warning: 'var(--flo-sem-color-warning, #db7712)',
  info: 'var(--flo-sem-color-info, #3d7bf7)',
  danger: 'var(--flo-sem-color-danger, #d24747)',
  ai: 'var(--flo-sem-color-ai, #9e70fa)',
} as const

/** Raw hex for AG Grid themeQuartz.withParams (cannot use CSS vars at theme-build time). */
export const tokenValue = {
  accent: '#1fac76', // --flo-sem-color-success / primary-default
  border: '#e1e6ef', // --flo-sem-color-border
  foreground: '#1d2433', // --flo-sem-color-text-body
  headerBg: '#f8fafc', // --flo-sem-color-surface-neutral-weakest
  headerText: '#1b1f27', // --flo-sem-color-text-header-secondary
  formsStroke: '#cbd2e1', // --flo-sem-color-stroke-forms
  rowHover: '#f0f5ff', // --flo-sem-color-info-background (subtle blue hover)
  selectedRow: '#f0f5ff',
} as const

/**
 * Raw hex for cell renderers. Mirrors FlowUI foundation/colors.md so renderers never
 * invent a color. Prefer these over ad-hoc hex in any renderer.
 */
export const palette = {
  // text
  textBody: '#1d2433',
  textSecondary: '#424867',
  textTertiary: '#6b7280',
  textMuted: '#adb2bb',
  textHeaderSecondary: '#1b1f27',
  // surfaces / borders
  surfaceBase: '#ffffff',
  surfaceWeakest: '#f8fafc',
  surfaceWeaker: '#f1f3f9',
  border: '#e1e6ef',
  strokeForms: '#cbd2e1',
  // semantic — primary + backgrounds
  success: '#1fac76',
  successStrong: '#186749',
  successBg: '#ecfff8',
  info: '#3d7bf7',
  infoBg: '#f0f5ff',
  warning: '#db7712',
  warningBg: '#fff8eb',
  danger: '#d24747',
  dangerBg: '#fef1f2',
  ai: '#9e70fa',
  aiBg: '#f5f0ff',
} as const

/** Deterministic avatar color from a name (stable across renders — no Math.random). */
const AVATAR_COLORS = ['#1fac76', '#3d7bf7', '#db7712', '#9e70fa', '#d24747', '#0ea5e9', '#e11d92']
export function avatarColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
