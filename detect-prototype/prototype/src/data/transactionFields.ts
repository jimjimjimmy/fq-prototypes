/**
 * Canonical Transaction field catalog.
 *
 * Single source of truth for:
 *   - Transaction Details panel (which fields are shown / orderable)
 *   - Rule condition field dropdowns (RuleDetail + AddRulePage)
 *   - Rule sentence rendering (DetailPanel formatFieldName)
 *
 * Every field shown on the Transaction Details panel must appear in
 * this list. Adding a field here automatically makes it selectable in
 * rule conditions — even if it's hidden by default in the Transaction
 * Details view, reviewers can still build rules against it.
 */

export interface TransactionFieldDef {
  /** Stable id used in seed data, store, and rule conditions. */
  id: string;
  /** User-facing label shown in dropdowns and the Transaction
   *  Details panel. */
  label: string;
  /** Whether this field renders in the Transaction Details panel by
   *  default. Hidden fields are still selectable in rule conditions. */
  visibleByDefault: boolean;
}

export const TRANSACTION_FIELDS: TransactionFieldDef[] = [
  { id: 'transactionId',   label: 'Transaction ID',   visibleByDefault: false },
  { id: 'transactionLine', label: 'Transaction Line', visibleByDefault: false },
  { id: 'transactionDate', label: 'Transaction Date', visibleByDefault: true },
  { id: 'postingPeriod',   label: 'Posting Period',   visibleByDefault: true },
  { id: 'amount',          label: 'Amount',           visibleByDefault: true },
  { id: 'currency',        label: 'Currency',         visibleByDefault: true },
  { id: 'type',            label: 'Type',             visibleByDefault: true },
  { id: 'subsidiary',      label: 'Entity',           visibleByDefault: true },
  { id: 'account',         label: 'Account',          visibleByDefault: true },
  { id: 'vendor',          label: 'Vendor',           visibleByDefault: true },
  { id: 'memo',            label: 'Memo',             visibleByDefault: true },
  { id: 'reversalId',      label: 'Reversal #',       visibleByDefault: true },
  { id: 'department',      label: 'Department',       visibleByDefault: true },
  { id: 'class',           label: 'Class',            visibleByDefault: true },
  { id: 'location',        label: 'Location',         visibleByDefault: true },
  { id: 'createdDate',     label: 'Created Date',     visibleByDefault: true },
  { id: 'createdBy',       label: 'Created By',       visibleByDefault: true },
  { id: 'customField1',    label: 'Custom Field 1',   visibleByDefault: false },
  { id: 'customField2',    label: 'Custom Field 2',   visibleByDefault: false },
  { id: 'customField3',    label: 'Custom Field 3',   visibleByDefault: false },
];

/** Maps legacy field IDs (from earlier seed data) to the canonical
 *  ids above so the editor and rule-sentence renderers can resolve
 *  the right label without forcing a seed-data migration. */
export const LEGACY_FIELD_ALIASES: Record<string, string> = {
  date: 'transactionDate',
  vendorName: 'vendor',
  description: 'memo',
  submitterId: 'createdBy',
  approverId: 'createdBy',
};

/** Resolve any incoming field id (legacy or canonical) to its
 *  canonical TransactionFieldDef. Returns null if the id isn't
 *  recognised. */
export function getTransactionField(id: string): TransactionFieldDef | null {
  const canonicalId = LEGACY_FIELD_ALIASES[id] ?? id;
  return TRANSACTION_FIELDS.find((f) => f.id === canonicalId) ?? null;
}

/** Convenience accessor for places that just need the label. */
export function getTransactionFieldLabel(id: string): string {
  return getTransactionField(id)?.label ?? id;
}

/** Dropdown options derived from TRANSACTION_FIELDS — used as-is in
 *  rule editors so the dropdown stays in lockstep with the Transaction
 *  Details field list. */
export const TRANSACTION_FIELD_OPTIONS: { value: string; label: string }[] =
  TRANSACTION_FIELDS.map((f) => ({ value: f.id, label: f.label }));
