import { GlobalNavSidebar } from '@shared/components/GlobalNavSidebar/GlobalNavSidebar'
import { TopNav } from './components/TopNav'
import { ReportBuilder } from './components/ReportBuilder'
import { ErrorBoundary } from './ErrorBoundary'

export default function App() {
  return (
    <div className="flex h-screen bg-white text-[#1d2433]">
      <GlobalNavSidebar bottomActive="settings" avatarFallback="CL" />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNav />
        <main className="flex-1 min-h-0 overflow-auto pt-[32px] px-[32px] pb-0">
          <ErrorBoundary>
            <ReportBuilder />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
