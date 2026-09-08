import { Button } from '@floqastinc/flow-ui_core'
import { useAIGuided } from '../state/AIGuidedContext'
import { useChatScript } from '../chat/useChatScript'
import ConnectorForm from './ConnectorForm'
import ConnectorTypeModal from './ConnectorTypeModal'

export default function ConnectorsView() {
  const {
    connectors,
    creatingConnector,
    connectorTypeSelected,
    setCreatingConnector,
    setConnectorTypeSelected,
  } = useAIGuided()
  const { emitStep } = useChatScript()

  const showTypeModal = creatingConnector && !connectorTypeSelected

  const typeModal = showTypeModal ? (
    <ConnectorTypeModal
      onClose={() => setCreatingConnector(false)}
      onSelectFile={() => {
        setConnectorTypeSelected(true)
        window.setTimeout(() => emitStep('connector-type-chosen'), 300)
      }}
    />
  ) : null

  if (creatingConnector && connectorTypeSelected) {
    return (
      <ConnectorForm
        onCancel={() => setCreatingConnector(false)}
        onCreated={() => {
          setCreatingConnector(false)
          window.setTimeout(() => emitStep('connector-created'), 400)
        }}
      />
    )
  }

  if (connectors.length === 0) {
    return (
      <>
      {typeModal}
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-[#f1f3f9] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b91a3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <h3 className="text-[14px] font-semibold text-[#1d2433] mb-1">No connectors yet</h3>
        <p className="text-[13px] text-[#6b7280] max-w-[360px] mb-5">
          Connectors bring external data into FloQast — via SFTP, API, or direct upload.
        </p>
        <Button variant="filled" color="primary" size="md" onClick={() => setCreatingConnector(true)}>
          Create a connector
        </Button>
      </div>
      </>
    )
  }

  return (
    <>
    {typeModal}
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] text-[#6b7280]">
          {connectors.length} {connectors.length === 1 ? 'connector' : 'connectors'}
        </div>
        <Button variant="filled" color="primary" size="sm" onClick={() => setCreatingConnector(true)}>
          New connector
        </Button>
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-[#e1e6ef] text-left">
            <th className="py-3 px-3 font-semibold text-[#424867]">Name</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Type</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Status</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Host / Source</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">File Pattern</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Entity Mapping</th>
            <th className="py-3 px-3 font-semibold text-[#424867]">Created</th>
          </tr>
        </thead>
        <tbody>
          {connectors.map((c) => (
            <tr key={c.id} className="border-b border-[#f1f3f9] hover:bg-[#f9fafb]">
              <td className="py-3 px-3 font-semibold text-[#1d2433]">{c.name}</td>
              <td className="py-3 px-3 uppercase text-[11px] tracking-wider text-[#6b7280]">
                {c.type}
              </td>
              <td className="py-3 px-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        c.status === 'connected'
                          ? '#16a34a'
                          : c.status === 'pending'
                            ? '#d97706'
                            : '#dc2626',
                    }}
                  />
                  <span className="capitalize text-[#424867]">{c.status}</span>
                </span>
              </td>
              <td className="py-3 px-3 text-[#424867]">{c.host ?? '—'}</td>
              <td className="py-3 px-3 font-mono text-[11px] text-[#6b7280]">
                {c.filePattern ?? '—'}
              </td>
              <td className="py-3 px-3 text-[#424867]">
                {c.entityMappingFqEntity ?? (
                  <span className="text-[#adb2bb] italic">Not mapped</span>
                )}
              </td>
              <td className="py-3 px-3 text-[#6b7280]">{c.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
