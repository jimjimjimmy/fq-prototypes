import { Button, Heading, TabGroup, Tab, Input } from '@floqastinc/flow-ui_core'
import { useAIGuided, type CanvasTab } from '../state/AIGuidedContext'

type Props = {
  onStart: () => void
}

export default function EmptyStart({ onStart }: Props) {
  const { activeTab, setActiveTab } = useAIGuided()

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="pt-[16px] px-[24px] shrink-0">
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#ecfdf5] flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#186749" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h1 className="text-[22px] font-semibold text-[#1d2433] mb-2">
          Welcome to Data Studio
        </h1>
        <p className="text-[14px] text-[#6b7280] max-w-[440px] mb-8 leading-[1.55]">
          Data Studio lets you bring external data into FloQast. Get started by creating a
          connector — this is how FloQast pulls in files or data from your source systems.
        </p>

        <Button variant="filled" color="primary" size="lg" onClick={onStart}>
          Create a connector
        </Button>

        <p className="text-[12px] text-[#adb2bb] mt-6">
          Not sure where to start? Ask the FloQast Assistant on the right for help.
        </p>
      </div>
    </div>
  )
}
