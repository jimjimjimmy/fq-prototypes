import React, { useState } from 'react';

interface TableDef {
  id: string;
  name: string;
  description: string;
  columns: string[];
  status: 'Required' | 'Optional';
  fqModel: string;
  requiredNote?: string;
}

const STANDARD_TABLES: TableDef[] = [
  {
    id: 'gl_lines',
    name: 'GL Lines',
    description: 'General ledger line-level detail — required for FloQast standard models.',
    columns: ['transaction_id', 'account_id', 'amount', 'currency', 'posting_date', 'subsidiary_id', 'department_id', 'memo'],
    status: 'Required',
    fqModel: 'GL Lines',
    requiredNote: 'This table is required and cannot be deselected. It powers the FloQast GL model.',
  },
  {
    id: 'transactions',
    name: 'Transactions',
    description: 'Journal entry and transaction headers across all transaction types.',
    columns: ['transaction_id', 'type', 'date', 'entity_id', 'department_id', 'subsidiary_id', 'memo', 'amount'],
    status: 'Required',
    fqModel: 'Transactions',
    requiredNote: 'This table is required and cannot be deselected. It powers the FloQast Transactions model.',
  },
  {
    id: 'accounts',
    name: 'Accounts',
    description: 'Chart of accounts including account hierarchy and classification.',
    columns: ['account_id', 'name', 'type', 'number', 'parent_id', 'subsidiary_id', 'description'],
    status: 'Required',
    fqModel: 'Accounts',
    requiredNote: 'This table is required and cannot be deselected. It powers the FloQast Accounts model.',
  },
];

const OPTIONAL_TABLES: TableDef[] = [
  {
    id: 'vendors',
    name: 'Vendors',
    description: 'Vendor master records including contact information and payment terms.',
    columns: ['vendor_id', 'name', 'email', 'phone', 'address', 'subsidiary_id', 'currency', 'is_active'],
    status: 'Optional',
    fqModel: 'Vendors',
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'Customer master records including billing details and account balances.',
    columns: ['customer_id', 'name', 'email', 'phone', 'address', 'subsidiary_id', 'currency', 'balance'],
    status: 'Optional',
    fqModel: 'Customers',
  },
  {
    id: 'subsidiaries',
    name: 'Subsidiaries',
    description: 'Subsidiary structure, hierarchy, and currency configuration.',
    columns: ['subsidiary_id', 'name', 'parent_id', 'currency', 'country', 'is_active'],
    status: 'Optional',
    fqModel: 'Subsidiaries',
  },
  {
    id: 'departments',
    name: 'Departments',
    description: 'Department master records used for cost center reporting.',
    columns: ['department_id', 'name', 'parent_id', 'subsidiary_id', 'is_inactive'],
    status: 'Optional',
    fqModel: 'Departments',
  },
];

const ALL_TABLES = [...STANDARD_TABLES, ...OPTIONAL_TABLES];

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--fq-color-text-muted)',
  padding: '12px 16px 6px',
};

const CdcSelectTables: React.FC = () => {
  const [activeId, setActiveId] = useState('gl_lines');
  const [selectedOptional, setSelectedOptional] = useState<Set<string>>(new Set());

  const activeTable = ALL_TABLES.find(t => t.id === activeId)!;
  const optionalAddedCount = selectedOptional.size;

  const toggleOptional = (id: string) => {
    setSelectedOptional(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      {/* ── Left sidebar ── */}
      <div style={{ width: 240, borderRight: '1px solid var(--fq-color-border)', overflowY: 'auto', background: '#fff', flexShrink: 0 }}>
        <p style={sectionHeaderStyle}>Standard Tables</p>
        {STANDARD_TABLES.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              background: activeId === t.id ? '#f0fdf4' : 'transparent',
              borderLeft: activeId === t.id ? '3px solid var(--fq-color-primary)' : '3px solid transparent',
              border: 'none',
              borderLeftStyle: 'solid',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
              fontWeight: activeId === t.id ? 600 : 400,
              color: 'var(--fq-color-text-primary)',
            }}
          >
            {/* Locked green checkbox */}
            <span style={{
              width: 16, height: 16, borderRadius: 3,
              background: 'var(--fq-color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {t.name}
          </button>
        ))}

        <div style={{ borderTop: '1px solid var(--fq-color-border-light)', marginTop: 8 }} />
        <p style={sectionHeaderStyle}>Optional Tables</p>
        {OPTIONAL_TABLES.map(t => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 16px',
              background: activeId === t.id ? 'var(--fq-color-gray-50)' : 'transparent',
              borderLeft: activeId === t.id ? '3px solid var(--fq-color-gray-400)' : '3px solid transparent',
            }}
          >
            {/* Checkbox — toggle only, does not affect content area */}
            <button
              onClick={() => toggleOptional(t.id)}
              style={{
                width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                border: selectedOptional.has(t.id) ? 'none' : '1.5px solid var(--fq-color-gray-400)',
                background: selectedOptional.has(t.id) ? 'var(--fq-color-primary)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`${selectedOptional.has(t.id) ? 'Deselect' : 'Select'} ${t.name}`}
            >
              {selectedOptional.has(t.id) && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Name — updates content area only, does not affect checkbox */}
            <button
              onClick={() => setActiveId(t.id)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                fontSize: 13,
                fontWeight: activeId === t.id ? 600 : 400,
                color: 'var(--fq-color-text-primary)',
                cursor: 'pointer',
              }}
            >
              {t.name}
            </button>
          </div>
        ))}
      </div>

      {/* ── Center: table detail ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: 'var(--fq-color-bg-page)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fq-color-text-primary)', margin: '0 0 6px' }}>
          {activeTable.name}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
          {activeTable.description}
        </p>

        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fq-color-text-muted)', margin: '0 0 10px' }}>
          Columns
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {activeTable.columns.map(col => (
            <span
              key={col}
              style={{
                padding: '4px 10px',
                fontSize: 12,
                fontFamily: 'monospace',
                background: '#fff',
                border: '1px solid var(--fq-color-border)',
                borderRadius: 'var(--fq-radius-md)',
                color: 'var(--fq-color-text-secondary)',
              }}
            >
              {col}
            </span>
          ))}
        </div>

        {activeTable.requiredNote && (
          <div style={{
            borderLeft: '3px solid var(--fq-color-primary)',
            paddingLeft: 14,
            paddingTop: 2,
            paddingBottom: 2,
          }}>
            <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {activeTable.requiredNote}
            </p>
          </div>
        )}

        {activeTable.status === 'Optional' && (
          <div style={{ marginTop: 4 }}>
            <button
              onClick={() => toggleOptional(activeTable.id)}
              style={{
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                border: selectedOptional.has(activeTable.id)
                  ? '1px solid var(--fq-color-border)'
                  : '1px solid var(--fq-color-primary)',
                borderRadius: 'var(--fq-radius-md)',
                background: '#fff',
                color: selectedOptional.has(activeTable.id)
                  ? 'var(--fq-color-text-secondary)'
                  : 'var(--fq-color-primary)',
                cursor: 'pointer',
              }}
            >
              {selectedOptional.has(activeTable.id) ? 'Remove table' : 'Add table'}
            </button>
          </div>
        )}
      </div>

      {/* ── Right: summary panel ── */}
      <div style={{ width: 220, borderLeft: '1px solid var(--fq-color-border)', padding: '24px 20px', overflowY: 'auto', background: '#fff', flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fq-color-text-muted)', margin: '0 0 14px' }}>
          Table Summary
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Status', value: activeTable.status },
            { label: 'Columns', value: String(activeTable.columns.length) },
            { label: 'FQ model', value: activeTable.fqModel },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fq-color-text-primary)', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--fq-color-border-light)', paddingTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fq-color-text-muted)', margin: '0 0 10px' }}>
            Selected Tables
          </p>
          <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: '0 0 4px' }}>
            {STANDARD_TABLES.length} standard (locked)
          </p>
          <p style={{ fontSize: 13, color: optionalAddedCount > 0 ? 'var(--fq-color-text-primary)' : 'var(--fq-color-text-muted)', margin: 0 }}>
            {optionalAddedCount} optional added
          </p>
        </div>
      </div>
    </div>
  );
};

export default CdcSelectTables;
