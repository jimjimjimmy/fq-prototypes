import { useState } from 'react'
import { ArrowUpDown, Maximize2, Search, X } from 'lucide-react'
import CallSplitOutlined from '@floqastinc/flow-ui_icons/material/CallSplitOutlined'
import Tooltip from '@floqastinc/flow-ui_core/Tooltip'
import type { MappedAccount, RollupNode } from '../types'
import { getRuleName } from '../data/sample-mappings'

const MUSEO = "'Museo Sans', sans-serif"

interface MappingPaneProps {
  selectedNode: RollupNode | null
  // When set, the table collapses to just the single account focused via the
  // hierarchy. Mutually exclusive with selectedNode (the caller is expected
  // to clear one when setting the other).
  selectedAccountId?: string | null
  onClearSelectedAccount?: () => void
  accounts: MappedAccount[]
  accountTab: AccountTab
  destinationNamesById: Record<string, string>
  onClose?: () => void
  onMaximize?: () => void
}

export type AccountTab = 'all' | 'accounts' | 'six-star'

export function applyAccountTab(tab: AccountTab, accounts: MappedAccount[]): MappedAccount[] {
  if (tab === 'all') return accounts
  if (tab === 'accounts') {
    // Drop suspense / clearing markers, keep everything else regardless of mapping method.
    return accounts.filter((a) => a.number !== '9999' && a.number !== '9998')
  }
  // Accounts & Subs — account × sub-dimension combinations. In the prototype this is
  // approximated by accounts that have a non-default cost-center / department breakdown.
  return accounts.filter(
    (a) =>
      a.number !== '9999' &&
      a.number !== '9998' &&
      ((a.costCenter !== undefined && a.costCenter !== '000') ||
        (a.department !== undefined && a.department !== 'Corporate')),
  )
}

export function MappingPane({ selectedNode, selectedAccountId = null, onClearSelectedAccount, accounts, accountTab, destinationNamesById, onClose, onMaximize }: MappingPaneProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [unassignedOnly, setUnassignedOnly] = useState(false)

  const tabAccounts = applyAccountTab(accountTab, accounts)

  // Three filter modes, in priority order:
  //   1. selectedAccountId → account-number focus (set by clicking an
  //      account row in the hierarchy). Shows EVERY row whose account
  //      number matches the clicked one — i.e. every dimension split
  //      and every mapping method (rule, direct, unassigned). When
  //      focused, the tab filter and the Unassigned quick filter are
  //      bypassed: the user clicked an account to investigate it, so
  //      they want the full picture regardless of where they were
  //      narrowing before.
  //   2. selectedNode → destination focus (set by clicking a parent
  //      node in the hierarchy).
  //   3. fallback → all accounts on the current tab.
  const focusedAccount = selectedAccountId
    ? accounts.find((a) => a.id === selectedAccountId)
    : null
  const scoped = focusedAccount
    ? accounts.filter((a) => a.number === focusedAccount.number)
    : selectedNode
      ? tabAccounts.filter((a) => a.destinationId === selectedNode.id)
      : tabAccounts

  const q = searchQuery.trim().toLowerCase()
  const filtered = scoped
    // Bypass the Unassigned quick filter when an account is focused so
    // unassigned splits of the same account show alongside the mapped ones.
    .filter((a) => focusedAccount || !unassignedOnly || a.mappingMethod === 'unassigned')
    .filter((a) =>
      !q ||
      a.number.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.department?.toLowerCase().includes(q) ?? false) ||
      (destinationNamesById[a.destinationId]?.toLowerCase().includes(q) ?? false),
    )

  return (
    <section className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold text-[#1d2433]">Mapping Table</h3>
          {accountTab !== 'all' && accountTab !== 'accounts' && (
            <Tooltip>
              <Tooltip.Trigger>
                <span className="inline-flex items-center gap-[2px] rounded-[4px] bg-[#f1f3f9] px-[4px] py-[2px] cursor-default">
                  <span className="text-[10px] font-semibold leading-[14px] text-[#6b7280]">1 Dimension</span>
                  <CallSplitOutlined size={12} color="#6b7280" />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom" size="sm">
                <span>
                  Split by 1 dimension:
                  <span style={{ display: 'block' }}>• Department</span>
                </span>
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onMaximize && (
            <button onClick={onMaximize} title="Maximize" className="text-[#adb2bb] hover:text-[#424867]">
              <Maximize2 size={14} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Close" className="text-[#adb2bb] hover:text-[#424867]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: search + pipe + quick filter label + chip */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-3 text-[12px] shrink-0">
        <div className="relative w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adb2bb] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within table"
            className="w-full box-border h-9 pl-9 pr-3 rounded-md border border-[#cbd2e1] bg-white text-[12px] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none focus:border-[#1fac76]"
            style={{ fontFamily: MUSEO }}
          />
        </div>
        <div className="w-px h-5 bg-[#e1e6ef] shrink-0" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6b7280] whitespace-nowrap" style={{ fontFamily: MUSEO }}>Quick filter</span>
          <button
            onClick={() => setUnassignedOnly(v => !v)}
            aria-pressed={unassignedOnly}
            className={`inline-flex items-center h-7 px-3 rounded-lg text-[12px] font-semibold transition-colors ${
              unassignedOnly
                ? 'bg-[#424867] text-white'
                : 'bg-[#f1f3f9] text-[#6b7280] hover:bg-[#e9ebf0]'
            }`}
          >
            Unassigned
          </button>
        </div>
      </div>

      {/* Table section — border wrapper is a flex column, NOT overflow-auto */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <div className="relative flex flex-col h-full border border-[#e1e6ef] rounded-lg overflow-hidden">
          {/* Gear icon — Material Design cog, anchored to header row */}
          <button
            title="Configure table"
            className="absolute top-[7px] right-2 z-20 text-[#adb2bb] hover:text-[#424867] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.43 12.97c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </button>

          {/* Inner scroll container — sticky thead locks relative to this div */}
          <div className="flex flex-col flex-1 overflow-auto min-h-0">
            <table className="w-full text-[12px] text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-[#f8fafc] text-[11px]">
                <tr className="group/header text-[#1d2433]">
                  <CheckTh />
                  <SortTh
                    label="Account No."
                    activeFilter={focusedAccount ? { value: focusedAccount.number, onClear: onClearSelectedAccount } : undefined}
                  />
                  <SortTh
                    label="Account Name"
                    activeFilter={focusedAccount ? { value: focusedAccount.name, onClear: onClearSelectedAccount } : undefined}
                  />
                  <SortTh label="Department" />
                  <SortTh label="Destination" />
                  <th className="sticky right-0 bg-[#f8fafc] px-3 py-1.5 font-bold whitespace-nowrap shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)] z-10 border-b-2 border-[#e1e6ef]">
                    Mapping Method
                  </th>
                </tr>
              </thead>
              {filtered.length > 0 && (
                <tbody>
                  {filtered.map((acct) => (
                    <tr
                      key={acct.id}
                      className="group/row hover:bg-[#f8fafc]"
                    >
                      <td className="px-3 py-1 border-b border-[#e1e6ef]">
                        <input type="checkbox" className="rounded border-[#cbd2e1] opacity-0 group-hover/row:opacity-100 transition-opacity" />
                      </td>
                      <td className="px-3 py-1 tabular-nums text-[#1d2433] border-b border-[#e1e6ef]">{acct.number}</td>
                      <td className="px-3 py-1 text-[#1d2433] border-b border-[#e1e6ef]">{acct.name}</td>
                      <td className="px-3 py-1 text-[#424867] border-b border-[#e1e6ef]">{acct.department ?? '—'}</td>
                      <td className="px-3 py-1 text-[#424867] border-b border-[#e1e6ef]">
                        {acct.destinationId === 'unassigned'
                          ? '—'
                          : destinationNamesById[acct.destinationId] ?? '—'}
                      </td>
                      <td className="sticky right-0 px-3 py-1 bg-white group-hover/row:bg-[#f8fafc] border-b border-[#e1e6ef] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]">
                        <StatusPill account={acct} destinationName={destinationNamesById[acct.destinationId]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {filtered.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-[12px] text-[#adb2bb]">
                {q
                  ? `No accounts match "${searchQuery}".`
                  : 'No accounts mapped to this node yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckTh() {
  return (
    <th className="w-8 px-3 py-1.5 border-b-2 border-[#e1e6ef]">
      <input type="checkbox" className="rounded border-[#cbd2e1] opacity-0 group-hover/header:opacity-100 transition-opacity" />
    </th>
  )
}

function SortTh({
  label,
  activeFilter,
}: {
  label: string
  // When set, the column is currently constrained to this value — shown as
  // a small chip beneath the label with an × to clear. Mirrors the focused
  // row tint (#ecfff8 / #1fac76) so the filter source is visually tied to
  // the highlighted row in the hierarchy.
  activeFilter?: { value: string; onClear?: () => void }
}) {
  return (
    <th className="px-3 py-1.5 font-bold whitespace-nowrap border-b-2 border-[#e1e6ef] align-bottom">
      <div className="flex flex-col gap-1">
        <button className="inline-flex items-center gap-1 hover:text-[#1fac76] self-start">
          {label}
          <ArrowUpDown size={12} className="text-[#adb2bb]" />
        </button>
        {activeFilter && (
          <span className="inline-flex self-start items-center gap-1 max-w-full pl-2 pr-1 h-5 rounded bg-[#ecfff8] text-[#1fac76] text-[10px] font-semibold normal-case">
            <span className="truncate">{activeFilter.value}</span>
            {activeFilter.onClear && (
              <button
                type="button"
                onClick={activeFilter.onClear}
                title="Clear filter"
                className="inline-flex items-center justify-center w-4 h-4 rounded text-[#1fac76] hover:bg-[#d1f5e7]"
              >
                <X size={10} />
              </button>
            )}
          </span>
        )}
      </div>
    </th>
  )
}

function StatusPill({ account, destinationName }: { account: MappedAccount; destinationName?: string }) {
  if (account.mappingMethod === 'unassigned') {
    return (
      <span className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#f1f3f9] text-[#6b7280]">
        Unassigned
      </span>
    )
  }
  if (account.mappingMethod === 'rule') {
    return (
      <span
        className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#e9f6f0] text-[#186749]"
        title="Mapped via rule"
      >
        {getRuleName(account, destinationName) ?? 'Mapping Rule'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center h-5 px-2 rounded text-[11px] font-semibold bg-[#e8f0fb] text-[#3b5cb8]">
      Direct Map
    </span>
  )
}
