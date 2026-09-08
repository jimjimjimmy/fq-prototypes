import type React from 'react'
import { useMemo, useState } from 'react'
import type { ColDef } from '@ag-grid-community/core'
import {
  GridShell,
  TableToolbar,
  accountNumberCol,
  textCol,
  setCol,
  badgeCol,
  currencyCol,
  palette,
  t,
  type Density,
  type BadgeColor,
} from '@kit'
import { makeAccounts, type AccountRow } from '@kit/data/mock.ts'
import type { ProfileMeta } from '../types.ts'

export const meta: ProfileMeta = {
  id: 'p0',
  code: 'P0',
  title: 'Simple',
  subtitle: 'Look something up and move on. Display + light sort.',
  surface: 'Chart of Accounts · entity & account lists · most Admin Settings',
  patterns: [
    { name: 'Comfortable density', detail: 'System-of-record surfaces read best a little roomier (13px / 44px header) — not the compact working density.' },
    { name: 'Quiet by default', detail: 'No filter chrome, no tool panel. A simple table must look simple — never like out-of-the-box AG Grid.' },
    { name: 'Alternate: FlowUI Table', detail: 'For the very simplest read-only cases FlowUI Table is a valid off-ramp — shown below. Complexity graduates to AG Grid.' },
  ],
}

const TYPE_COLORS: Record<string, BadgeColor> = {
  Asset: 'success',
  Liability: 'danger',
  Equity: 'highlight',
  Revenue: 'success',
  Expense: 'default',
}
const STATUS_COLORS: Record<string, BadgeColor> = {
  Active: 'success',
  Inactive: 'default',
}

export default function P0Simple() {
  const [density, setDensity] = useState<Density>('comfortable')
  const [quickSearch, setQuickSearch] = useState('')
  const rowData = useMemo(() => makeAccounts(), [])

  const columnDefs = useMemo<ColDef<AccountRow>[]>(
    () => [
      accountNumberCol('accountNumber', 'Account #', { width: 120, pinned: 'left' }),
      textCol('accountName', 'Account name', { flex: 1, minWidth: 200 }),
      badgeCol('accountType', 'Type', { width: 140, colorMap: TYPE_COLORS }),
      setCol('category', 'Category', { width: 200 }),
      setCol('entity', 'Entity', { width: 170 }),
      badgeCol('status', 'Status', { width: 120, colorMap: STATUS_COLORS }),
      currencyCol('balance', 'Balance', { width: 160 }),
    ],
    [],
  )

  return (
    <div className="h-full flex flex-col overflow-auto">
      <TableToolbar
        title="Chart of Accounts"
        quickSearch={quickSearch}
        onQuickSearch={setQuickSearch}
        density={density}
        onDensityChange={setDensity}
      />
      <div style={{ height: 360, flexShrink: 0 }}>
        <GridShell
          density={density}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickSearch}
        />
      </div>

      <FlowUiTableAlternate rows={rowData.slice(0, 6)} />
    </div>
  )
}

/** The "alternate P0" — a plain FlowUI-styled table for the simplest read-only surfaces. */
function FlowUiTableAlternate({ rows }: { rows: AccountRow[] }) {
  return (
    <div className="mt-6">
      <div className="text-[13px] font-semibold mb-1" style={{ color: t.textBody }}>
        Alternate P0 — FlowUI Table
      </div>
      <div className="text-[12px] mb-2" style={{ color: t.textMuted }}>
        For bounded, read-only lists that never need the data layer. An off-ramp, not a competing standard.
      </div>
      <div
        className="overflow-hidden"
        style={{ border: `1px solid ${palette.border}`, borderRadius: 6 }}
      >
        <table className="w-full border-collapse text-[13px]" style={{ color: t.textBody }}>
          <thead>
            <tr style={{ backgroundColor: palette.surfaceWeakest, color: palette.textHeaderSecondary }}>
              <Th>Account #</Th>
              <Th>Account name</Th>
              <Th>Category</Th>
              <Th right>Balance</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.accountNumber}
                style={{ borderTop: i === 0 ? undefined : `1px solid ${palette.border}` }}
              >
                <Td>{row.accountNumber}</Td>
                <Td>{row.accountName}</Td>
                <Td>{row.category}</Td>
                <Td right>
                  <span className="tabular-nums">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.balance)}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className="text-[12px] font-semibold px-3 py-2"
      style={{ textAlign: right ? 'right' : 'left', borderBottom: `1px solid ${palette.border}` }}
    >
      {children}
    </th>
  )
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <td className="px-3 py-2" style={{ textAlign: right ? 'right' : 'left' }}>
      {children}
    </td>
  )
}
