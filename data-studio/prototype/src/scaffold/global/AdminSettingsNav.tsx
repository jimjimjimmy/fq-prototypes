/**
 * AdminSettingsNav — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * The horizontal top bar that appears when the user is inside Admin Settings.
 * Renders "Admin Settings" title on the left, a horizontal strip of admin
 * sub-section tabs (13 of them, ending with "Data Studio"), and optionally a
 * fullscreen toggle button on the right.
 *
 * Figma source: 1:14464 "Admin Settings Navbar - Single Line" in
 *   https://www.figma.com/design/JuKJL3qnOlL88CFBje5cBr/Data-Studio-Scaffold--Claude-
 *
 * Provenance: built new from Figma for v2 (no anchor existed). The Close-
 * product top-nav anchor at `composition-references/chrome/top-nav.tsx` is
 * for a *different* pattern (product icon + product tabs), not Admin Settings.
 * This component should be contributed back to composition-references as a
 * new anchor entry once v2 lands.
 *
 * The fullscreen button only renders if `onFullscreen` is provided — the L1
 * Figma frame doesn't show it (no fullscreen on top-level routes), but the
 * L2 frames do. L2Frame passes the handler; L1Frame doesn't.
 *
 * FlowUI tokens (converted from raw hex 2026-07-01; rendered values unchanged):
 *   bg-white — bar background
 *   --flo-sem-color-border — bottom border + fullscreen-button border (was #e1e6ef)
 *   --flo-sem-color-text-body — title + active/hover tab text (was #1d2433)
 *   --flo-sem-color-text-body-secondary — inactive tab text (was #424867)
 *   --flo-sem-color-primary-active — active/hover tab underline (was #186749, FloQast brand green)
 *   --flo-sem-color-stroke-forms — fullscreen-button border (was #cbd2e1)
 *   --flo-sem-color-light-background — fullscreen-button hover background (was #f8fafc)
 *   --flo-sem-color-icon-secondary — fullscreen-button icon (was #424867)
 *
 * Typography note: the title + tab labels are Museo Sans per Figma. Museo
 * Sans is loaded in this environment, so it's applied explicitly here (via
 * `fontFamily`) — otherwise the global Inter body shim in main.tsx would make
 * them inherit Inter. Buttons don't inherit font-family, so the tabs set it
 * directly too.
 */

const MUSEO = "'Museo Sans', sans-serif";

const SETTINGS_TABS = [
  'Workflows',
  'Entities',
  'Team Members',
  'Roles',
  'Groups',
  'Checklist',
  'Reconciliations',
  'API Keys',
  'Reports',
  'AI',
  'Connections',
  'Financial Data Model',
  'Data Studio',
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

export interface AdminSettingsNavProps {
  /** Which admin section is active. Defaults to 'Data Studio' for this scaffold. */
  activeTab?: SettingsTab;
  /** Fires when a non-active tab is clicked. In Data Studio context, no other tab is reachable. */
  onTabClick?: (tab: SettingsTab) => void;
  /**
   * Fires when the fullscreen button is clicked. When provided, the
   * fullscreen button renders. When omitted, no fullscreen button shows
   * (L1 mode).
   */
  onFullscreen?: () => void;
}

export function AdminSettingsNav({
  activeTab = 'Data Studio',
  onTabClick,
  onFullscreen,
}: AdminSettingsNavProps = {}) {
  return (
    <div
      className="bg-white border-b border-[var(--flo-sem-color-border)] flex items-center h-[60px] min-h-[60px] max-h-[60px] px-6 shrink-0"
      style={{ fontFamily: MUSEO }}
    >
      {/* "Admin Settings" title */}
      <div className="flex items-center h-full pr-3 shrink-0">
        <span className="text-[16px] leading-5 text-[var(--flo-sem-color-text-body)] font-semibold whitespace-nowrap">
          Admin Settings
        </span>
      </div>

      {/* Tabs */}
      <nav className="flex flex-1 h-full items-center min-w-0">
        {SETTINGS_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <div key={tab} className="flex items-center h-full px-3 shrink-0">
              <button
                onClick={() => onTabClick?.(tab)}
                disabled={isActive || !onTabClick}
                className={`flex items-center justify-center h-full py-2 text-[12px] leading-[18px] tracking-[-0.12px] whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'text-[var(--flo-sem-color-text-body)] border-[var(--flo-sem-color-primary-active)] cursor-default'
                    : 'text-[var(--flo-sem-color-text-body-secondary)] border-transparent hover:text-[var(--flo-sem-color-text-body)] hover:border-[var(--flo-sem-color-primary-active)]'
                }`}
                style={{ fontWeight: 600, fontFamily: MUSEO }}
              >
                {tab}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Fullscreen button — only renders on L2 routes (when onFullscreen is provided) */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          aria-label="Enter fullscreen mode"
          className="flex items-center justify-center w-[26px] h-[26px] border border-[var(--flo-sem-color-stroke-forms)] rounded-[6px] cursor-pointer hover:bg-[var(--flo-sem-color-light-background)] shrink-0 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--flo-sem-color-icon-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      )}
    </div>
  );
}
