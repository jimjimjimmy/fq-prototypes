import type { ReactNode } from 'react'
import { SideNav } from './SideNav'

interface AutopilotAppShellProps {
  children?: ReactNode
}

export function AutopilotAppShell({ children }: AutopilotAppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <SideNav />
      <div className="flex flex-col flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
