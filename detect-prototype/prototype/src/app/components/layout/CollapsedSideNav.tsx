import { useState, useRef } from 'react';
import { getTeamMember, currentUserId } from '../../../data/team';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { UserMenu } from '../profile/UserMenu';
import {
  FqLogo,
  HomeIcon,
  TodoIcon,
  CloseIcon,
  ComplianceIcon,
  OpsIcon,
  ProjMgmtIcon,
  ReportingIcon,
  AiIcon,
  ReMindIcon,
  AcademyIcon,
  DetectIcon,
  ExploreIcon,
  SettingsIcon,
} from './nav-icons';

// ─── Product app list ─────────────────────────────────────────────────────────

const PRODUCT_APPS = [
  { id: 'close',      label: 'Close',       Icon: CloseIcon },
  { id: 'compliance', label: 'Compliance',  Icon: ComplianceIcon },
  { id: 'detect',     label: 'Detect',      Icon: DetectIcon },
  { id: 'ops',        label: 'Ops',         Icon: OpsIcon },
  { id: 'proj-mgmt',  label: 'Proj Mgmt',   Icon: ProjMgmtIcon },
  { id: 'reporting',  label: 'Reporting',   Icon: ReportingIcon },
  { id: 'ai',         label: 'Transform',   Icon: AiIcon, scale: 0.85 },
  { id: 'remind',     label: 'ReMind',      Icon: ReMindIcon },
  { id: 'academy',    label: 'FloQademy',   Icon: AcademyIcon },
] as const;

// IDs the parent App actually swaps between. Other product icons in
// PRODUCT_APPS render but are inert (visual reference only).
type SwappableAppId = 'detect' | 'close';

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center w-full py-[24px] max-h-[24px] shrink-0">
      <div className="bg-[#e1e6ef] h-px min-h-px min-w-px flex-[1_0_0]" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CollapsedSideNav({
  activeAppId,
  onSelectApp,
  onOpenProfile,
}: {
  activeAppId?: SwappableAppId;
  onSelectApp?: (id: SwappableAppId) => void;
  /** Fires when the user picks "Profile Settings" from the avatar
   *  menu. The host swaps the main column to the Profile Settings
   *  page. */
  onOpenProfile?: () => void;
} = {}) {
  const currentUser = getTeamMember(currentUserId);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  return (
    <div className="w-[56px] bg-[#f8fafc] border-r border-solid border-[#e1e6ef] flex flex-col items-center pb-[24px] shrink-0 h-full shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)]">

      {/* Top: logo, home, todo, divider */}
      <div className="flex flex-col items-center relative shrink-0 w-full">

        {/* FQ Logo */}
        <div className="flex h-[59px] w-[38px] items-center justify-center shrink-0 rounded-[6px]">
          <FqLogo />
        </div>

        {/* Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
              <div className="scale-[0.72] origin-center">
                <HomeIcon />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>

        {/* Todo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
              <div className="scale-[0.72] origin-center">
                <TodoIcon />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">My Work</TooltipContent>
        </Tooltip>

        <Divider />
      </div>

      {/* Middle: product app icons */}
      <div className="flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative w-full overflow-y-auto">
        {PRODUCT_APPS.map((app) => {
          const isActive = app.id === activeAppId;
          // Only the apps the parent actually owns are clickable; everything
          // else stays inert as visual reference.
          const isSwappable = app.id === 'detect' || app.id === 'close';
          return (
            <Tooltip key={app.id}>
              <TooltipTrigger asChild>
                <div
                  role={isSwappable ? 'button' : undefined}
                  tabIndex={isSwappable ? 0 : undefined}
                  onClick={() => isSwappable && onSelectApp?.(app.id as SwappableAppId)}
                  onKeyDown={(e) => {
                    if (isSwappable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectApp?.(app.id as SwappableAppId);
                    }
                  }}
                  className={`flex flex-col h-[45px] w-full items-center justify-center overflow-clip relative shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#f1f3f9] border-l-[3px] border-solid border-[#adb2bb]'
                      : 'hover:bg-[#f1f3f9]'
                  }`}
                >
                  <div className="origin-center" style={{ transform: `scale(${('scale' in app ? app.scale : 0.72)})` }}>
                    <app.Icon />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{app.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Bottom: divider, explore, settings, avatar */}
      <div className="flex flex-col items-center justify-end relative shrink-0 w-full">

        <Divider />

        {/* Explore */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
              <div className="scale-[0.72] origin-center">
                <ExploreIcon />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Explore</TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
              <div className="scale-[0.72] origin-center">
                <SettingsIcon />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>

        {/* Avatar — clicking opens the floating user menu. The menu
             then routes "Profile Settings" → onOpenProfile() so the
             host can switch the main column to the Profile Settings
             page. */}
        {currentUser && (
          <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0">
            <button
              ref={avatarBtnRef}
              type="button"
              onClick={() => {
                const rect = avatarBtnRef.current?.getBoundingClientRect();
                if (rect) setAnchorRect(rect);
                setUserMenuOpen((v) => !v);
              }}
              className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-slate-200 hover:ring-slate-300 transition-all"
              title={currentUser.name}
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
            </button>
          </div>
        )}
        {userMenuOpen && anchorRect && (
          <UserMenu
            anchorRect={anchorRect}
            onOpenProfile={() => onOpenProfile?.()}
            onClose={() => setUserMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
