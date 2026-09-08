import { RotateCw } from 'lucide-react'

function Divider() {
  return (
    <div className="flex items-center w-full py-6 px-0 max-h-6 shrink-0">
      <div className="flex-1 h-px bg-[#e1e6ef]" />
    </div>
  )
}

function NavItem({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      className="flex items-center justify-center w-14 h-[45px] shrink-0 hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  )
}

function ActiveNavItem({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      className="flex items-center justify-center w-full h-[45px] shrink-0 bg-[#e0f6ce] border-l-[3px] border-[#186749]"
    >
      {children}
    </button>
  )
}

export function SideNav() {
  return (
    <div className="w-14 h-full bg-[#f8fafc] border-r border-[#e1e6ef] shadow-[10px_0px_13px_-7px_rgba(0,0,0,0.04)] flex flex-col items-center pb-6 shrink-0">
      {/* Top: Logo + utility icons */}
      <div className="flex flex-col items-center w-full shrink-0">
        <div className="flex items-center justify-center w-[38px] h-[59px]">
          <img src="/icons/fq-logo.svg" alt="FloQast" className="w-[38px] h-[21px] object-contain" />
        </div>

        <NavItem title="Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#424867">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </NavItem>

        <NavItem title="Tasks">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#424867">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
          </svg>
        </NavItem>

        <Divider />
      </div>

      {/* Middle: App icons */}
      <div className="flex flex-col items-center w-full flex-1 min-h-0">
        <NavItem title="Close">
          <div className="h-[17.56px] relative shrink-0 w-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-close.svg" />
          </div>
        </NavItem>

        <NavItem title="Compliance">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-compliance.svg" />
          </div>
        </NavItem>

        <NavItem title="Ops">
          <div className="h-[23px] relative shrink-0 w-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-ops.svg" />
          </div>
        </NavItem>

        <NavItem title="Project Management">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-projmgmt.svg" />
          </div>
        </NavItem>

        <NavItem title="Reporting">
          <div className="h-[20px] relative shrink-0 w-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-reporting.svg" />
          </div>
        </NavItem>

        <NavItem title="AI">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-ai.svg" />
          </div>
        </NavItem>

        <NavItem title="ReMind">
          <div className="h-[21px] relative shrink-0 w-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-remind.svg" />
          </div>
        </NavItem>

        <NavItem title="Academy">
          <div className="h-[21px] relative shrink-0 w-[24px]">
            <img alt="" className="absolute block max-w-none size-full object-contain" src="/icons/nav-academy.svg" />
          </div>
        </NavItem>
      </div>

      {/* Bottom: Multi-instance, divider, Autopilot (active), Explore, Settings, avatar */}
      <div className="flex flex-col items-center w-full shrink-0">
        <NavItem title="Multi-instance">
          <div className="overflow-hidden relative rounded-sm shrink-0 size-[24px]">
            <img alt="" className="absolute block max-w-none size-full" src="/icons/nav-multiinstance.svg" />
            <div className="absolute inset-[22.43%_20%]">
              <img alt="" className="absolute block max-w-none size-full" src="/icons/nav-hashtag.svg" />
            </div>
          </div>
        </NavItem>

        <Divider />

        {/* Autopilot — Active */}
        <ActiveNavItem title="Autopilot">
          <RotateCw size={24} strokeWidth={2} color="#186749" />
        </ActiveNavItem>

        <NavItem title="Explore">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#424867">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
          </svg>
        </NavItem>

        <NavItem title="Settings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#424867">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.11-.22.06-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </NavItem>

        {/* Avatar */}
        <div className="flex items-center justify-center w-full h-[45px]">
          <img
            src="/icons/avatar.png"
            alt="User avatar"
            className="size-7 rounded-full object-cover shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
