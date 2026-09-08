export type Connector = {
  id: string
  name: string
  subtitle: string
  type: 'CDC' | 'API' | 'SFTP'
  status: 'connected' | 'disconnected'
  files: number
  dateAdded: string
}

export const connectorData: Connector[] = [
  {
    id: 'sap-erp',
    name: 'SAP ERP Production',
    subtitle: 'SAP',
    type: 'CDC',
    status: 'connected',
    files: 2,
    dateAdded: '10/1/2025',
  },
  {
    id: 'bank-feed',
    name: 'Bank Feed API',
    subtitle: 'Plaid',
    type: 'API',
    status: 'connected',
    files: 2,
    dateAdded: '10/1/2025',
  },
  {
    id: 'erp-data',
    name: 'ERP Data',
    subtitle: 'Custom',
    type: 'SFTP',
    status: 'connected',
    files: 2,
    dateAdded: '11/1/2025',
  },
  {
    id: 'sftp-connector-2',
    name: 'SFTP Connector 2',
    subtitle: 'Unconfigured',
    type: 'SFTP',
    status: 'disconnected',
    files: 0,
    dateAdded: '12/1/2025',
  },
]
