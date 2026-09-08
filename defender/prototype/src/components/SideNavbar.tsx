import Avatar from '@floqastinc/flow-ui_core/Avatar';
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
  WorkspaceIcon,
  ExploreIcon,
  SettingsIcon,
} from './nav-icons';

const PRODUCT_APPS = [
  { id: 'close', label: 'Close', icon: CloseIcon },
  { id: 'compliance', label: 'Compliance', icon: ComplianceIcon },
  { id: 'ops', label: 'Ops', icon: OpsIcon },
  { id: 'proj-mgmt', label: 'Proj Mgmt', icon: ProjMgmtIcon },
  { id: 'reporting', label: 'Reporting', icon: ReportingIcon },
  { id: 'ai', label: 'AI', icon: AiIcon },
  { id: 'remind', label: 'ReMind', icon: ReMindIcon },
  { id: 'academy', label: 'Academy', icon: AcademyIcon },
] as const;

function Divider() {
  return (
    <div className="flex items-center w-full py-[24px] max-h-[24px] shrink-0">
      <div className="bg-[#e1e6ef] h-px min-h-px min-w-px flex-[1_0_0]" />
    </div>
  );
}

export default function SideNavbar() {
  return (
    <div className="w-[56px] bg-[#f8fafc] border-r border-solid border-[#e1e6ef] flex flex-col items-center pb-[24px] shrink-0 h-full shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)]">
      {/* Top section: logo, home, todo, divider */}
      <div className="flex flex-col items-center relative shrink-0 w-full">
        <div className="flex h-[59px] w-[38px] items-center justify-center shrink-0 rounded-[6px]">
          <FqLogo />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <HomeIcon />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <TodoIcon />
        </div>
        <Divider />
      </div>

      {/* Middle section: product app icons */}
      <div className="flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative w-full">
        {PRODUCT_APPS.map((app) => {
          const isActive = app.id === 'reporting';
          return (
            <div
              key={app.id}
              className={`flex flex-col h-[45px] w-full items-center justify-center overflow-clip relative shrink-0 cursor-pointer ${
                isActive ? 'bg-[#f1f3f9] border-l-[3px] border-solid border-[#adb2bb]' : ''
              }`}
            >
              <app.icon />
            </div>
          );
        })}
      </div>

      {/* Bottom section: workspace, divider, explore, settings, avatar */}
      <div className="flex flex-col items-center justify-end relative shrink-0 w-full">
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer overflow-clip">
          <div className="overflow-hidden rounded-[2px]">
            <WorkspaceIcon />
          </div>
        </div>
        <Divider />
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <ExploreIcon />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <SettingsIcon />
        </div>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <Avatar fallback="BE" size="sm" />
        </div>
      </div>
    </div>
  );
}
