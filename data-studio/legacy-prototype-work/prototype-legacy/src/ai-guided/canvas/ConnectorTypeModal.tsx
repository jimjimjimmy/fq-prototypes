import { Button } from '@floqastinc/flow-ui_core'

type ConnectorTypeOption = {
  id: string
  name: string
  description: string
  available: boolean
}

const OPTIONS: ConnectorTypeOption[] = [
  {
    id: 'file',
    name: 'File',
    description: 'Ingest data by transferring files via direct upload or sFTP connection',
    available: true,
  },
  {
    id: 'sap',
    name: 'SAP',
    description: 'Connect your SAP ERP system for automated data extraction',
    available: false,
  },
  {
    id: 'cdc',
    name: 'Change Data Capture (CDC)',
    description: 'Real-time database synchronization',
    available: false,
  },
  {
    id: 'connector',
    name: 'Connector',
    description: 'Pre-built integrations with third-party systems',
    available: false,
  },
  {
    id: 'api',
    name: 'Push Data via API',
    description: 'Receive data through REST API endpoints',
    available: false,
  },
]

type Props = {
  onClose: () => void
  onSelectFile: () => void
}

export default function ConnectorTypeModal({ onClose, onSelectFile }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-[560px] max-h-[85vh] overflow-y-auto bg-white rounded-[12px] shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e1e6ef]">
          <h2 className="text-[18px] font-semibold text-[#1d2433]">Create Connector</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f1f3f9] text-[#8b91a3]"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-3">
          {OPTIONS.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-4 rounded-[10px] border border-[#e1e6ef] px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[#1d2433] mb-1">
                  {option.name}
                </div>
                <p className="text-[13px] text-[#6b7280] leading-[1.5]">
                  {option.description}
                </p>
              </div>
              {option.available ? (
                <Button variant="filled" color="primary" size="md" onClick={onSelectFile}>
                  Select
                </Button>
              ) : (
                <span className="text-[13px] italic text-[#8b91a3] shrink-0">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
