import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Heading, TabGroup, Tab, Input } from '@floqastinc/flow-ui_core'

export default function DataStudioShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = location.pathname.includes('/connections')
    ? 'connections'
    : location.pathname.includes('/entity-mappings')
      ? 'entity-mappings'
      : location.pathname.includes('/dimensions')
        ? 'dimensions'
        : 'catalog'

  const handleTabChange = (tabId: string) => {
    navigate(`/data-studio/${tabId}`)
  }

  return (
    <div className="flex flex-col size-full">
      {/* Page header */}
      <div className="bg-white pt-[16px] px-[24px] shrink-0">
        <Heading variant="xl">Data Studio</Heading>
      </div>

      {/* Tab bar with search + CTA */}
      <div className="flex items-end justify-between border-b border-[#e1e6ef] h-[50px] px-[24px] shrink-0">
        <TabGroup value={activeTab} onValueChange={handleTabChange}>
          <Tab tabId="catalog" title="Catalog" />
          <Tab tabId="dimensions" title="Dimensions" />
          <Tab tabId="connections" title="Connections" />
          <Tab tabId="entity-mappings" title="Entity Mappings" />
        </TabGroup>
        <div className="flex items-center gap-[24px] h-full">
          <div className="flex flex-col items-end justify-center h-full py-[12px]">
            <Input isSearchable placeholder="Start searching..." className="w-[312px]" />
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-[24px] py-[24px] min-h-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
