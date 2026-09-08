export type WorkflowType = 'Checklist' | 'Reconciliation' | 'Flux' | 'JEM' | 'Matching';
export type ConnectionStatus = 'Direct ERP Link' | 'Intercompany Linked' | 'Standalone';
export type Region = 'Americas' | 'EMEA' | 'APAC';

export interface WorkflowRow {
  id: string;
  workspace: string;
  entity: string;
  region: Region;
  workflowType: WorkflowType;
  connectionStatus: ConnectionStatus;
  connectedTo: string[];
  active: boolean;
  enabled: boolean;
  lastModified: string;
}
