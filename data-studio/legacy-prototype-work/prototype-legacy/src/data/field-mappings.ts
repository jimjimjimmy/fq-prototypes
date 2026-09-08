export type DataType = 'String' | 'Boolean' | 'DateTime' | 'Number'

export interface SourceField {
  id: string
  name: string
  dataType: DataType
  dataset: string
}

export interface FieldMapping {
  id: string
  fqFieldName: string
  isMandatory: boolean
  isPrimaryKey: boolean
  sourceFields: SourceField[]
  dataType: DataType
  transformation: string | null
  transformationStatus: 'none' | 'manual' | 'ai-generated'
}

// Source field catalog — available fields for dropdown pickers
export const sourceFieldCatalog: SourceField[] = [
  { id: 'sf-1', name: 'account_id', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-2', name: 'entity_code', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-3', name: 'acct_num', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-4', name: 'acct_display_name', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-5', name: 'type_id', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-6', name: 'iso_currency_code', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-7', name: 'cat_mapping', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-8', name: 'long_description', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-9', name: 'record_status', dataType: 'Boolean', dataset: 'us-accounts-raw' },
  { id: 'sf-10', name: 'dept_segment_id', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-11', name: 'cc_code', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-12', name: 'subsidiary_name', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-13', name: 'bal_side_code', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-14', name: 'first_name', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-15', name: 'last_name', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-16', name: 'reconcile_flag', dataType: 'Boolean', dataset: 'us-accounts-raw' },
  { id: 'sf-17', name: 'bs_class', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-18', name: 'last_updated_utc', dataType: 'DateTime', dataset: 'us-accounts-raw' },
  { id: 'sf-19', name: 'sys_user_id', dataType: 'String', dataset: 'us-accounts-raw' },
  { id: 'sf-20', name: 'amount_usd', dataType: 'Number', dataset: 'us-accounts-raw' },
]

function sf(id: string): SourceField {
  return sourceFieldCatalog.find(f => f.id === id)!
}

export const initialFieldMappings: FieldMapping[] = [
  {
    id: 'fm-1',
    fqFieldName: 'Account ID',
    isMandatory: true,
    isPrimaryKey: true,
    sourceFields: [sf('sf-2'), sf('sf-1')],
    dataType: 'String',
    transformation: 'CONCAT(source.entity_code, "-", source.account_id)',
    transformationStatus: 'ai-generated',
  },
  {
    id: 'fm-2',
    fqFieldName: 'Account Number',
    isMandatory: true,
    isPrimaryKey: false,
    sourceFields: [sf('sf-3')],
    dataType: 'String',
    transformation: 'TRIM(source.acct_num)',
    transformationStatus: 'manual',
  },
  {
    id: 'fm-3',
    fqFieldName: 'Account Name',
    isMandatory: true,
    isPrimaryKey: false,
    sourceFields: [sf('sf-4')],
    dataType: 'String',
    transformation: 'PROPER(source.acct_display_name)',
    transformationStatus: 'ai-generated',
  },
  {
    id: 'fm-4',
    fqFieldName: 'Account Type',
    isMandatory: true,
    isPrimaryKey: false,
    sourceFields: [sf('sf-5')],
    dataType: 'String',
    transformation: 'LOWER(source.type_id)',
    transformationStatus: 'manual',
  },
  {
    id: 'fm-5',
    fqFieldName: 'Currency',
    isMandatory: true,
    isPrimaryKey: false,
    sourceFields: [sf('sf-6')],
    dataType: 'String',
    transformation: 'source.iso_currency_code',
    transformationStatus: 'none',
  },
  {
    id: 'fm-6',
    fqFieldName: 'Category',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-7')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-7',
    fqFieldName: 'Description',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-8')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-8',
    fqFieldName: 'Is Active',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-9')],
    dataType: 'Boolean',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-9',
    fqFieldName: 'Department',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-10')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-10',
    fqFieldName: 'Cost Center',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-11')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-11',
    fqFieldName: 'Subsidiary',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-12')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-12',
    fqFieldName: 'Normal Balance',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-13')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-13',
    fqFieldName: 'Full Display Name',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-14'), sf('sf-15')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-14',
    fqFieldName: 'Reconcilable',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-16')],
    dataType: 'Boolean',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-15',
    fqFieldName: 'Balance Sheet Category',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-17')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-16',
    fqFieldName: 'Last Modified Date',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-18')],
    dataType: 'DateTime',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-17',
    fqFieldName: 'Created By',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-19')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-18',
    fqFieldName: 'Amount',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-20')],
    dataType: 'Number',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-19',
    fqFieldName: 'Entity Code',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-2')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
  {
    id: 'fm-20',
    fqFieldName: 'Source ID',
    isMandatory: false,
    isPrimaryKey: false,
    sourceFields: [sf('sf-1')],
    dataType: 'String',
    transformation: null,
    transformationStatus: 'none',
  },
]
