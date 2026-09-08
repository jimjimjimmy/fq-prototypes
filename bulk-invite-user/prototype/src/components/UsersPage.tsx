/**
 * UsersPage — composes the Users / Team Members admin screen content:
 * page header + toolbar, sub-tabs + filter pills, the users table, and a
 * pagination bar. Mirrors Figma node 2198:6636 (Content Area).
 */
import { UsersPageHeader } from './UsersPageHeader'
import { UsersFilters } from './UsersFilters'
import { UsersTable } from './UsersTable'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Pagination() {
  const pages = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center justify-center gap-1 py-3">
      <button className="flex items-center justify-center w-8 h-8 rounded-[6px] hover:bg-[#f1f3f9]" aria-label="Previous page">
        <Chevron dir="left" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-[6px] text-[13px] ${
            p === 1 ? 'bg-[#f1f3f9] font-semibold text-[#1d2433]' : 'text-[#6b7280] hover:bg-[#f1f3f9]'
          }`}
        >
          {p}
        </button>
      ))}
      <button className="flex items-center justify-center w-8 h-8 rounded-[6px] hover:bg-[#f1f3f9]" aria-label="Next page">
        <Chevron dir="right" />
      </button>
    </div>
  )
}

export function UsersPage({ onInvite, onBulkInvite }: { onInvite?: () => void; onBulkInvite?: () => void }) {
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <UsersPageHeader onInvite={onInvite} onBulkInvite={onBulkInvite} />
      <UsersFilters />
      <UsersTable />
      <Pagination />
    </div>
  )
}
