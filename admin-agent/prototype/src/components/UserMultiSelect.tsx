/**
 * UserMultiSelect — searchable, multi-select checkbox list over the seeded USERS
 * (data/users.ts). Reused by the per-entity Users step. Controlled (selectedIds +
 * onChange). Plain styling, consistent with the other entity-flow inputs.
 */
import { useState } from 'react'
import { USERS } from '../data/users'

export function UserMultiSelect({ selectedIds, onChange }: { selectedIds: string[]; onChange: (ids: string[]) => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = USERS.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q))
  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])

  return (
    <div className="flex flex-col gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users"
        className="h-9 w-full min-w-0 box-border rounded-[6px] border border-[#cbd2e1] px-2.5 text-[13px] text-[#1d2433] placeholder:text-[#9ca3af] bg-white focus:outline-none focus:border-[#1e8ae9]"
      />
      <div className="max-h-[220px] overflow-y-auto rounded-[6px] border border-[#e1e6ef] divide-y divide-[#f1f3f9]">
        {filtered.map((u) => (
          <label key={u.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#f8fafc]">
            <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggle(u.id)} className="w-4 h-4 accent-[#1FAC76]" />
            <span className="flex flex-col min-w-0">
              <span className="text-[13px] text-[#1d2433] truncate">{u.name}</span>
              <span className="text-[12px] text-[#6b7280] truncate">{u.email}</span>
            </span>
            <span className="ml-auto shrink-0 text-[12px] text-[#6b7280]">{u.role}</span>
          </label>
        ))}
        {filtered.length === 0 && <p className="px-3 py-2 text-[12px] text-[#6b7280]">No users match “{query}”.</p>}
      </div>
      <span className="text-[12px] text-[#6b7280]">{selectedIds.length} selected</span>
    </div>
  )
}
