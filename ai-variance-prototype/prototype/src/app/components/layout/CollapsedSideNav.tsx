import { useState, useRef, useEffect } from 'react';
import {
  FqLogo, HomeIcon, TodoIcon, CloseIcon, ComplianceIcon, OpsIcon,
  ProjMgmtIcon, ReportingIcon, AiIcon, ReMindIcon, AcademyIcon,
  DetectIcon, ExploreIcon, SettingsIcon,
} from './nav-icons';

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

const ACTIVE_ID = 'reporting';

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top + r.height / 2, left: r.right + 6 });
    }
  }, [show]);

  return (
    <div ref={ref} className="w-full" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="fixed z-50 -translate-y-1/2 pointer-events-none" style={{ top: pos.top, left: pos.left }}>
          <div className="rounded-md bg-neutral-900 px-2.5 py-1.5 shadow-lg whitespace-nowrap">
            <p className="text-[11px] font-medium text-white">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center w-full py-[24px] max-h-[24px] shrink-0">
      <div className="bg-[#e1e6ef] h-px min-h-px min-w-px flex-[1_0_0]" />
    </div>
  );
}

export function CollapsedSideNav() {
  return (
    <div className="w-[56px] bg-[#f8fafc] border-r border-solid border-[#e1e6ef] flex flex-col items-center pb-[24px] shrink-0 h-full shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col items-center relative shrink-0 w-full">
        <div className="flex h-[59px] w-[38px] items-center justify-center shrink-0 rounded-[6px]">
          <FqLogo />
        </div>
        <Tooltip label="Home">
          <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
            <div className="scale-[0.72] origin-center"><HomeIcon /></div>
          </div>
        </Tooltip>
        <Tooltip label="My Work">
          <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
            <div className="scale-[0.72] origin-center"><TodoIcon /></div>
          </div>
        </Tooltip>
        <Divider />
      </div>

      <div className="flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative w-full overflow-y-auto">
        {PRODUCT_APPS.map((app) => {
          const isActive = app.id === ACTIVE_ID;
          return (
            <Tooltip key={app.id} label={app.label}>
              <div className={`flex flex-col h-[45px] w-full items-center justify-center overflow-clip relative shrink-0 cursor-pointer ${
                isActive ? 'bg-[#f1f3f9] border-l-[3px] border-solid border-[#adb2bb]' : 'hover:bg-[#f1f3f9]'
              }`}>
                <div className="origin-center" style={{ transform: `scale(${'scale' in app ? app.scale : 0.72})` }}>
                  <app.Icon />
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-end relative shrink-0 w-full">
        <Divider />
        <Tooltip label="Explore">
          <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
            <div className="scale-[0.72] origin-center"><ExploreIcon /></div>
          </div>
        </Tooltip>
        <Tooltip label="Settings">
          <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer hover:bg-[#f1f3f9]">
            <div className="scale-[0.72] origin-center"><SettingsIcon /></div>
          </div>
        </Tooltip>
        <div className="flex h-[45px] w-[56px] items-center justify-center shrink-0 cursor-pointer">
          <button type="button" className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-indigo-200 hover:ring-indigo-300 transition-all flex items-center justify-center bg-indigo-100" title="Brenda Song">
            <span className="text-[11px] font-semibold text-indigo-700">BS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
