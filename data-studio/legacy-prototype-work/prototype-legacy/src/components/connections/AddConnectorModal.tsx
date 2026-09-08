import { useState } from 'react'
import type { SourceType } from '../../data/connections'
import { Button, Modal, Input } from '@floqastinc/flow-ui_core'

interface ConnectorOption {
  type: SourceType
  title: string
  subtitle: string
  accent: string
}

const CUSTOM_INTEGRATION_OPTIONS: ConnectorOption[] = [
  {
    type: 'API Connector',
    title: 'API Connector',
    subtitle: 'Custom REST API integration. Configure endpoints, authentication, and data mapping for any external API.',
    accent: '#186749',
  },
  {
    type: 'sFTP',
    title: 'SFTP',
    subtitle: 'Secure file transfer connection. Upload and sync CSV/Excel files via SFTP.',
    accent: '#4B5563',
  },
]

const STANDARD_INTEGRATION_OPTIONS: ConnectorOption[] = [
  {
    type: 'Intacct Enhanced',
    title: 'Intacct Enhanced',
    subtitle: 'FloQast-managed connector for full transaction data. Needed for Transactions, GL Lines, and expanded data models.',
    accent: '#0F766E',
  },
  {
    type: 'NetSuite Enhanced',
    title: 'NetSuite Enhanced',
    subtitle: 'FloQast-managed connector for full transaction data. Needed for Transactions, GL Lines, and expanded data models.',
    accent: '#C2410C',
  },
  {
    type: 'QBO Basic',
    title: 'QuickBooks Online Basic',
    subtitle: 'Standard connection via QBO REST API. Best for Accounts and Balances.',
    accent: '#1D4ED8',
  },
  {
    type: 'QBO Enhanced',
    title: 'QuickBooks Online Enhanced',
    subtitle: 'FloQast-managed connector for full transaction data. Needed for Transactions and expanded data models.',
    accent: '#6D28D9',
  },
  {
    type: 'Workday',
    title: 'Workday',
    subtitle: 'FloQast-managed connector for full transaction data. Needed for Transactions, GL Lines, and expanded data models.',
    accent: '#1D4ED8',
  },
]

export default function AddConnectorModal({ onClose, onContinue }: { onClose: () => void; onContinue: (type: SourceType) => void }) {
  const [selected, setSelected] = useState<SourceType | null>(null)
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const filter = (opts: ConnectorOption[]) =>
    query ? opts.filter(o => o.title.toLowerCase().includes(query)) : opts

  const customFiltered = filter(CUSTOM_INTEGRATION_OPTIONS)
  const standardFiltered = filter(STANDARD_INTEGRATION_OPTIONS)
  const hasResults = customFiltered.length > 0 || standardFiltered.length > 0

  const renderCard = ({ type, title, subtitle, accent }: ConnectorOption) => {
    const isSelected = selected === type
    return (
      <button
        key={type}
        onClick={() => setSelected(type)}
        className="flex items-start gap-3.5 px-4 py-3.5 rounded-lg text-left w-full transition-colors"
        style={{ border: `2px solid ${isSelected ? '#186749' : '#E5E7EB'}`, backgroundColor: isSelected ? '#F0FDF9' : '#fff' }}
      >
        <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
          <SourceIcon type={type} accent={accent} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-gray-900 mb-0.5">{title}</div>
          <div className="text-[12px] text-gray-500 leading-relaxed">{subtitle}</div>
        </div>
        {isSelected && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 self-center" style={{ backgroundColor: '#186749' }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </button>
    )
  }

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{label}</span>
      <div className="flex-1 h-[1px] bg-gray-200" />
    </div>
  )

  return (
    <Modal open={true} onOpenChange={(v: boolean) => !v && onClose()} size="md">
      <Modal.Header>Select Connector Type</Modal.Header>
      <Modal.Body>
        <p className="text-[13px] text-gray-500 mb-3">Choose the type of connector you want to set up.</p>

        <div className="mb-4">
          <Input
            value={search}
            onChange={(value: unknown) => setSearch(value as string)}
            placeholder="Search connectors…"
          />
        </div>

        {!hasResults && (
          <div className="py-8 text-center text-[13px] text-gray-400">
            No connectors found for &ldquo;{search}&rdquo;
          </div>
        )}

        {customFiltered.length > 0 && (
          <div className="mb-5">
            <SectionHeader label="Custom Integration" />
            <div className="flex flex-col gap-2">
              {customFiltered.map(renderCard)}
            </div>
          </div>
        )}

        {standardFiltered.length > 0 && (
          <div>
            <SectionHeader label="Standard Integrations" />
            <div className="flex flex-col gap-2">
              {standardFiltered.map(renderCard)}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outlined" color="dark" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected} onClick={() => selected && onContinue(selected)}>Continue →</Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

function SourceIcon({ type, accent }: { type: SourceType; accent: string }) {
  if (type === 'QBO Basic' || type === 'QBO Enhanced') {
    const bg = type === 'QBO Basic' ? '#EFF6FF' : '#F5F3FF'
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="5" fill={bg} />
        <circle cx="11" cy="11" r="6.5" stroke={accent} strokeWidth="1.5" fill="none" />
        <path d="M8 11h6M11 8v6" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'sFTP') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="7" width="18" height="11" rx="2" fill="#E5E7EB" />
        <path d="M8 12h6M8 15h4" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7 4h8l2 3H5L7 4z" fill="#9CA3AF" />
      </svg>
    )
  }
  if (type === 'NetSuite Enhanced') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="5" fill="#FFF7ED" />
        <path d="M6 16V6l10 10V6" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'Intacct Enhanced') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="5" fill="#F0FDFA" />
        <rect x="6" y="10" width="10" height="6" rx="1.5" stroke="#0F766E" strokeWidth="1.5" />
        <path d="M9 10V8a2 2 0 014 0v2" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="13" r="1" fill="#0F766E" />
      </svg>
    )
  }
  if (type === 'Workday') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="5" fill="#EFF6FF" />
        <circle cx="11" cy="9" r="3" stroke="#1D4ED8" strokeWidth="1.5" />
        <path d="M5 18c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  // API Connector fallback
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="6" cy="11" r="2.5" fill="#186749" />
      <circle cx="16" cy="11" r="2.5" fill="#186749" />
      <circle cx="11" cy="6" r="2.5" fill="#186749" />
      <circle cx="11" cy="16" r="2.5" fill="#186749" />
      <path d="M8 9.5l-1.5-1M14 9.5l1.5-1M8 12.5l-1.5 1M14 12.5l1.5 1" stroke="#186749" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
