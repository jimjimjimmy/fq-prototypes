import type { ReactNode } from 'react'
import { IconRail } from './IconRail'
import { SectionNav } from './SectionNav'
import { SearchToolbar } from './SearchToolbar'
import type { ViewId } from '../App'

type Props = {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
  newAgentCount: number
  children: ReactNode
}

const isEmbedded = new URLSearchParams(window.location.search).has('embedded')

export function AppLayout({ currentView, onNavigate, newAgentCount, children }: Props) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {!isEmbedded && <IconRail />}
      <SectionNav currentView={currentView} onNavigate={onNavigate} newAgentCount={newAgentCount} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SearchToolbar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
