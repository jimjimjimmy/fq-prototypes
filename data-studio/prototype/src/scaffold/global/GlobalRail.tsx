/**
 * GlobalRail — Data Studio v2 scaffold (LAW — do not modify without designer review)
 *
 * 56px global FloQast left rail. Identical chrome across every FloQast
 * product surface; the only thing that changes is which icon shows the
 * active state (product app for Close/Compliance/etc., or `settings` when
 * the user is inside Admin Settings — which is where Data Studio lives).
 *
 * Origin & evolution:
 *   - Initial scaffold (2026-05-22): copy-based anchor at
 *     knowledge/design-system/composition-references/chrome/side-nav.tsx
 *     (loaded icons from public/icons/*.svg).
 *   - Updated 2026-05-22 (same day): icons swapped to inline React
 *     components from ./nav-icons.tsx (carried forward from v1, FQ logo
 *     re-colored to current Figma per Natasha's visual verification).
 *     Reason: the anchor SVGs were flat/outdated; v1's components have the
 *     full Figma gradient brand icons.
 *
 * Figma source: 1:14461 in
 *   https://www.figma.com/design/JuKJL3qnOlL88CFBje5cBr/Data-Studio-Scaffold--Claude-
 *
 * Customizations vs anchor:
 *   - `activeApp` defaults to `undefined` (no product app highlighted)
 *     because Data Studio lives under Admin Settings, not as a top-level
 *     product app.
 *   - `activeBottomNav` defaults to `'settings'` so Settings shows the active
 *     state when the user is anywhere in Admin Settings — including Data Studio.
 *   - Active state visual on Settings (light gray fill + 3px gray border-left)
 *     mirrors the product-app active state pattern but with neutral tokens to
 *     avoid implying Settings is a "product."
 *
 * Layout & overflow behavior:
 *   - Rail is clipped to viewport height (overflow-hidden + h-full constrains
 *     to parent's h-screen) so it never exceeds the visible area.
 *   - Top + bottom sections are fixed-height (shrink-0).
 *   - Middle product-apps section uses flex-1 min-h-0 overflow-y-auto so it
 *     scrolls if the viewport is too short to fit all 8 product icons. At
 *     normal laptop heights everything fits without scroll.
 *
 * FlowUI tokens (converted from raw hex 2026-07-01; rendered values unchanged):
 *   --flo-sem-color-light-background — rail background (was var(--flo-sem-color-light-background))
 *   --flo-sem-color-border — border + divider (was var(--flo-sem-color-border))
 *   #e0f6ce — product-app active background. NO FlowUI token matches this
 *     light-green tint (nearest surface-success are #93ebc9 / #ecfff8, both
 *     off); kept raw as a documented design-system gap, not an oversight.
 *   --flo-sem-color-primary-active — product-app active border (was #186749, FloQast brand green)
 *   --flo-sem-color-background-option-hover — Settings active background (was var(--flo-sem-color-background-option-hover))
 *   --flo-sem-color-border-strong — Settings active border (was var(--flo-sem-color-border-strong), intentional)
 */

import { Avatar } from '@floqastinc/flow-ui_core';
// Utility icons: use FlowUI's published Material outlined variants directly.
// Figma's Code Connect map confirms these are the source for Home/Tasks/
// Explore/Settings in the rail. Using the published components (instead of
// v1's hand-extracted SVGs) eliminates the viewBox-padding scaling issue
// that made the v1 versions render too small at 24px.
import HomeOutlined from '@floqastinc/flow-ui_icons/material/HomeOutlined';
import PlaylistAddCheckOutlined from '@floqastinc/flow-ui_icons/material/PlaylistAddCheckOutlined';
import ExploreOutlined from '@floqastinc/flow-ui_icons/material/ExploreOutlined';
import SettingsOutlined from '@floqastinc/flow-ui_icons/material/SettingsOutlined';
import {
  FqLogo,
  CloseIcon,
  ComplianceIcon,
  OpsIcon,
  ProjMgmtIcon,
  ReportingIcon,
  AiIcon,
  ReMindIcon,
  AcademyIcon,
  WorkspaceIcon,
} from './nav-icons';

type ProductApp =
  | 'close'
  | 'compliance'
  | 'ops'
  | 'projmgmt'
  | 'reporting'
  | 'ai'
  | 'remind'
  | 'academy';

type BottomNav = 'workspace' | 'explore' | 'settings' | null;

export interface GlobalRailProps {
  /**
   * Which product app is active. Undefined = no product app highlighted
   * (correct for Admin Settings / Data Studio contexts).
   */
  activeApp?: ProductApp;
  /** Which bottom-nav icon is active. Defaults to 'settings'. */
  activeBottomNav?: BottomNav;
  /** Avatar initials shown at the bottom. Defaults to 'NC' for prototype. */
  avatarInitials?: string;
}

const PRODUCT_APPS: { id: ProductApp; Icon: () => React.ReactElement; label: string }[] = [
  { id: 'close', Icon: CloseIcon, label: 'Close' },
  { id: 'compliance', Icon: ComplianceIcon, label: 'Compliance' },
  { id: 'ops', Icon: OpsIcon, label: 'Ops' },
  { id: 'projmgmt', Icon: ProjMgmtIcon, label: 'Project Management' },
  { id: 'reporting', Icon: ReportingIcon, label: 'Reporting' },
  { id: 'ai', Icon: AiIcon, label: 'AI' },
  { id: 'remind', Icon: ReMindIcon, label: 'ReMind' },
  { id: 'academy', Icon: AcademyIcon, label: 'Academy' },
];

function Divider() {
  return (
    <div className="flex items-center w-full py-3 px-0 shrink-0">
      <div className="flex-1 h-px bg-[var(--flo-sem-color-border)]" />
    </div>
  );
}

function NavItem({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex items-center justify-center w-14 h-[45px] shrink-0 hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  );
}

export function GlobalRail({
  activeApp,
  activeBottomNav = 'settings',
  avatarInitials = 'NC',
}: GlobalRailProps = {}) {
  return (
    <div className="w-14 h-full overflow-hidden bg-[var(--flo-sem-color-light-background)] border-r border-[var(--flo-sem-color-border)] shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)] flex flex-col items-center pb-6 shrink-0">
      {/* Top: Logo + Home + Tasks + divider */}
      <div className="flex flex-col items-center w-full shrink-0">
        <div className="flex items-center justify-center w-[38px] h-[59px]">
          <FqLogo />
        </div>

        <NavItem title="Home">
          <HomeOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
        </NavItem>

        <NavItem title="Tasks">
          <PlaylistAddCheckOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
        </NavItem>

        <Divider />
      </div>

      {/* Middle: 8 product app icons — scrolls vertically if viewport is short.
          overflow-x-hidden prevents a phantom horizontal scrollbar that some
          platforms render when a vertical scrollbar reserves width and the
          inner w-full buttons overflow the reduced content area. */}
      <div className="flex flex-col items-center w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {PRODUCT_APPS.map(({ id, Icon, label }) => {
          const isActive = id === activeApp;
          return isActive ? (
            <button
              key={id}
              title={label}
              className="flex items-center justify-center w-full h-[45px] shrink-0 bg-[#e0f6ce] border-l-[3px] border-[var(--flo-sem-color-primary-active)]"
            >
              <Icon />
            </button>
          ) : (
            <NavItem key={id} title={label}>
              <Icon />
            </NavItem>
          );
        })}
      </div>

      {/* Bottom: Workspace, divider, Explore, Settings, Avatar */}
      <div className="flex flex-col items-center w-full shrink-0">
        {activeBottomNav === 'workspace' ? (
          <button
            title="Multi-instance"
            className="flex items-center justify-center w-full h-[45px] shrink-0 bg-[var(--flo-sem-color-background-option-hover)] border-l-[3px] border-[var(--flo-sem-color-border-strong)]"
          >
            <WorkspaceIcon />
          </button>
        ) : (
          <NavItem title="Multi-instance">
            <WorkspaceIcon />
          </NavItem>
        )}

        <Divider />

        {activeBottomNav === 'explore' ? (
          <button
            title="Explore"
            className="flex items-center justify-center w-full h-[45px] shrink-0 bg-[var(--flo-sem-color-background-option-hover)] border-l-[3px] border-[var(--flo-sem-color-border-strong)]"
          >
            <ExploreOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
          </button>
        ) : (
          <NavItem title="Explore">
            <ExploreOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
          </NavItem>
        )}

        {activeBottomNav === 'settings' ? (
          <button
            title="Settings"
            className="flex items-center justify-center w-full h-[45px] shrink-0 bg-[var(--flo-sem-color-background-option-hover)] border-l-[3px] border-[var(--flo-sem-color-border-strong)]"
          >
            <SettingsOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
          </button>
        ) : (
          <NavItem title="Settings">
            <SettingsOutlined size={20} color="var(--flo-sem-color-icon-primary, #1d2433)" />
          </NavItem>
        )}

        <div className="flex items-center justify-center w-full h-[45px]">
          <Avatar fallback={avatarInitials} size="sm" />
        </div>
      </div>
    </div>
  );
}
