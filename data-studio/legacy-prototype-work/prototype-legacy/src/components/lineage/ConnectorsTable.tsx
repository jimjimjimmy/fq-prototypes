import { StatusBadge } from '@floqastinc/flow-ui_core'
import { connectorData } from '../../data/connectors'

export default function ConnectorsTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-[30%]">
              Connector Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-[15%]">
              Type
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-[15%]">
              Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide w-[15%]">
              Files
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wide w-[25%]">
              Date Added
            </th>
          </tr>
        </thead>
        <tbody>
          {connectorData.map((connector) => (
            <tr
              key={connector.id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{connector.name}</div>
                <div className="text-xs text-gray-400">{connector.subtitle}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{connector.type}</td>
              <td className="px-4 py-3">
                <StatusBadge color={connector.status === 'connected' ? 'success' : 'danger'}>
                  {connector.status === 'connected' ? 'Connected' : 'Disconnected'}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {connector.files} {connector.files === 1 ? 'File' : 'Files'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-400 text-right">
                {connector.dateAdded}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
