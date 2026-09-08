export type EntityMapping = {
  id: string
  entity: string
  model: string
  identifier: string
  createdDate: string
  createdBy: string
}

export const mockEntityMappings: EntityMapping[] = [
  {
    id: 'em-1',
    entity: 'FQ US',
    model: 'Accounts Lineage Model',
    identifier: 'US_ENTITY_001',
    createdDate: '2026-02-15',
    createdBy: 'admin@company.com',
  },
  {
    id: 'em-2',
    entity: 'FQ UK',
    model: 'Transactions Lineage Model',
    identifier: 'UK_ENTITY_002',
    createdDate: '2026-02-20',
    createdBy: 'admin@company.com',
  },
  {
    id: 'em-3',
    entity: 'FQ DE',
    model: 'GL Lineage Model',
    identifier: 'DE_ENTITY_003',
    createdDate: '2026-03-01',
    createdBy: 'admin@company.com',
  },
  {
    id: 'em-4',
    entity: 'FQ AU',
    model: 'Accounts Lineage Model',
    identifier: 'AU_ENTITY_004',
    createdDate: '2026-03-05',
    createdBy: 'admin@company.com',
  },
]

export const availableEntities = ['FQ US', 'FQ UK', 'FQ DE', 'FQ AU', 'FQ JP', 'FQ CA', 'FQ FR']

export const availableModels = [
  'Accounts Lineage Model',
  'Transactions Lineage Model',
  'GL Lineage Model',
  'Exchange Rates Model',
  'Trial Balance Model',
]
