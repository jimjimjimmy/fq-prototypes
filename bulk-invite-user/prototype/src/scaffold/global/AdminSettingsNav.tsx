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
 * Tokens used:
 *   #ffffff — bar background
 *   #e1e6ef — bottom border + fullscreen-button border (default-container-border)
 *   #1d2433 — title + active tab text (color-neutral-800)
 *   #424867 — inactive tab text (color-neutral-600)
 *   #186749 — active tab underline (color-brand-800)
 *   #cbd2e1 — fullscreen-button border (typed as neutral border-300 per FQ palette)
 *   #f8fafc — fullscreen-button hover background (color-neutral-100)
 *   #424867 — fullscreen-button icon
 *
 * Typography note: tab labels and title inherit Inter from the `html, body`
 * font shim in main.tsx. Figma specifies Museo Sans for these, but FlowUI
 * doesn't bundle Museo Sans and v1 had the same fallback pattern. If exact
 * Museo Sans fidelity becomes important, load it via Google Fonts in
 * index.html alongside Inter.
 */

const SETTINGS_TABS = [
  'Workflows',
  'Entities',
  'Users',
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
    <div className="bg-white border-b border-[#e1e6ef] flex items-center h-[60px] min-h-[60px] max-h-[60px] px-6 shrink-0">
      {/* "Admin Settings" title */}
      <div className="flex items-center h-full pr-3 shrink-0">
        <span className="text-[16px] leading-5 text-[#1d2433] font-semibold whitespace-nowrap">
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
                    ? 'text-[#1d2433] border-[#186749] cursor-default'
                    : 'text-[#424867] border-transparent hover:text-[#1d2433] hover:border-[#186749]'
                }`}
                style={{ fontWeight: 600 }}
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
          className="flex items-center justify-center w-[26px] h-[26px] border border-[#cbd2e1] rounded-[6px] cursor-pointer hover:bg-[#f8fafc] shrink-0 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#424867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
