import type { WorkflowType, Region, WorkflowRow } from '@/types';

export const workflowData: WorkflowRow[] = [
  { id: 'w1', workspace: 'US Entity - Corporate', entity: 'US Corp', region: 'Americas', workflowType: 'Checklist', connectionStatus: 'Direct ERP Link', connectedTo: ['Global Consolidations'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w2', workspace: 'US Entity - Corporate', entity: 'US Corp', region: 'Americas', workflowType: 'Reconciliation', connectionStatus: 'Direct ERP Link', connectedTo: ['Global Consolidations', 'US Intercompany'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w3', workspace: 'US Entity - Corporate', entity: 'US Corp', region: 'Americas', workflowType: 'JEM', connectionStatus: 'Direct ERP Link', connectedTo: ['Global Consolidations'], active: true, enabled: true, lastModified: 'Feb 21, 2026' },
  { id: 'w4', workspace: 'EMEA - UK Subsidiary', entity: 'UK Sub', region: 'EMEA', workflowType: 'Checklist', connectionStatus: 'Intercompany Linked', connectedTo: ['EMEA Regional', 'UK Statutory'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w5', workspace: 'EMEA - UK Subsidiary', entity: 'UK Sub', region: 'EMEA', workflowType: 'Reconciliation', connectionStatus: 'Intercompany Linked', connectedTo: ['EMEA Regional'], active: true, enabled: true, lastModified: 'Feb 20, 2026' },
  { id: 'w6', workspace: 'EMEA - UK Subsidiary', entity: 'UK Sub', region: 'EMEA', workflowType: 'Flux', connectionStatus: 'Intercompany Linked', connectedTo: ['EMEA Regional'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w7', workspace: 'EMEA - Germany', entity: 'DE GmbH', region: 'EMEA', workflowType: 'Checklist', connectionStatus: 'Direct ERP Link', connectedTo: ['EMEA Regional', 'EU Compliance'], active: true, enabled: true, lastModified: 'Feb 21, 2026' },
  { id: 'w8', workspace: 'EMEA - Germany', entity: 'DE GmbH', region: 'EMEA', workflowType: 'Matching', connectionStatus: 'Direct ERP Link', connectedTo: ['EMEA Regional'], active: false, enabled: false, lastModified: 'Feb 18, 2026' },
  { id: 'w9', workspace: 'EMEA - France', entity: 'FR SAS', region: 'EMEA', workflowType: 'Reconciliation', connectionStatus: 'Standalone', connectedTo: [], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w10', workspace: 'APAC - Singapore', entity: 'SG Pte', region: 'APAC', workflowType: 'Checklist', connectionStatus: 'Direct ERP Link', connectedTo: ['APAC Regional'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w11', workspace: 'APAC - Singapore', entity: 'SG Pte', region: 'APAC', workflowType: 'Reconciliation', connectionStatus: 'Direct ERP Link', connectedTo: ['APAC Regional', 'Global Consolidations'], active: true, enabled: true, lastModified: 'Feb 21, 2026' },
  { id: 'w12', workspace: 'APAC - Singapore', entity: 'SG Pte', region: 'APAC', workflowType: 'JEM', connectionStatus: 'Standalone', connectedTo: [], active: true, enabled: true, lastModified: 'Feb 19, 2026' },
  { id: 'w13', workspace: 'APAC - Japan', entity: 'JP KK', region: 'APAC', workflowType: 'Checklist', connectionStatus: 'Direct ERP Link', connectedTo: ['APAC Regional'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w14', workspace: 'APAC - Japan', entity: 'JP KK', region: 'APAC', workflowType: 'Flux', connectionStatus: 'Direct ERP Link', connectedTo: ['APAC Regional'], active: false, enabled: false, lastModified: 'Feb 15, 2026' },
  { id: 'w15', workspace: 'Americas - Canada', entity: 'CA Ltd', region: 'Americas', workflowType: 'Checklist', connectionStatus: 'Intercompany Linked', connectedTo: ['Americas Regional', 'Global Consolidations'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w16', workspace: 'Americas - Canada', entity: 'CA Ltd', region: 'Americas', workflowType: 'Reconciliation', connectionStatus: 'Intercompany Linked', connectedTo: ['Americas Regional'], active: true, enabled: true, lastModified: 'Feb 21, 2026' },
  { id: 'w17', workspace: 'Americas - Brazil', entity: 'BR Ltda', region: 'Americas', workflowType: 'Matching', connectionStatus: 'Standalone', connectedTo: [], active: true, enabled: true, lastModified: 'Feb 20, 2026' },
  { id: 'w18', workspace: 'Americas - Brazil', entity: 'BR Ltda', region: 'Americas', workflowType: 'JEM', connectionStatus: 'Standalone', connectedTo: [], active: false, enabled: false, lastModified: 'Feb 14, 2026' },
  { id: 'w19', workspace: 'Global Consolidations', entity: 'HQ', region: 'Americas', workflowType: 'Flux', connectionStatus: 'Direct ERP Link', connectedTo: ['US Entity - Corporate', 'EMEA Regional', 'APAC Regional'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
  { id: 'w20', workspace: 'Global Consolidations', entity: 'HQ', region: 'Americas', workflowType: 'Reconciliation', connectionStatus: 'Direct ERP Link', connectedTo: ['US Entity - Corporate'], active: true, enabled: true, lastModified: 'Feb 22, 2026' },
];

export const allWorkflowTypes: WorkflowType[] = ['Checklist', 'Reconciliation', 'Flux', 'JEM', 'Matching'];
export const allRegions: Region[] = ['Americas', 'EMEA', 'APAC'];
