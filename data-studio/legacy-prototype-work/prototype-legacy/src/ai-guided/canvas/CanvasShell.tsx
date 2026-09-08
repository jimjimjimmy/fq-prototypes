import { Heading, TabGroup, Tab, Input } from '@floqastinc/flow-ui_core'
import { useAIGuided, type CanvasTab } from '../state/AIGuidedContext'
import CatalogView from './CatalogView'
import ConnectorsView from './ConnectorsView'
import PlaceholderView from './PlaceholderView'

export default function CanvasShell() {
  const { activeTab, setActiveTab } = useAIGuided()

  return (
    <div className="flex flex-col size-full">
      <div className="bg-white pt-[16px] px-[24px] shrink-0">
        <Heading variant="xl">Data Studio</Heading>
      </div>

      <div className="flex items-end justify-between border-b border-[#e1e6ef] h-[50px] px-[24px] shrink-0">
        <TabGroup value={activeTab} onValueChange={(v) => setActiveTab(v as CanvasTab)}>
          <Tab tabId="catalog" title="Catalog" />
          <Tab tabId="connectors" title="Connectors" />
          <Tab tabId="dimensions" title="Dimensions" />
          <Tab tabId="logs" title="Logs" />
        </TabGroup>
        <div className="flex items-center gap-[24px] h-full">
          <div className="flex flex-col items-end justify-center h-full py-[12px]">
            <Input isSearchable placeholder="Start searching..." className="w-[312px]" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-[24px] py-[24px] min-h-0 overflow-auto">
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'connectors' && <ConnectorsView />}
        {activeTab === 'dimensions' && (
          <PlaceholderView
            title="Dimensions"
            description="Global dimensions (e.g., cost center, department) that apply across models. Coming soon."
          />
        )}
        {activeTab === 'logs' && (
          <PlaceholderView
            title="Pipeline Logs"
            description="All pipeline run history across every model — timestamps, statuses, and error details. Coming soon."
          />
        )}
      </div>
    </div>
  )
}
