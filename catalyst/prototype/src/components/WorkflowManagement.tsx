import { useState, useMemo } from 'react';
import type { WorkflowType, ConnectionStatus, Region, WorkflowRow } from '@/types';
import { workflowData, allWorkflowTypes, allRegions } from '@/data/workflows';

// ═══════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════════

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-[36px] h-[20px] rounded-full transition-colors duration-200 ${enabled ? 'bg-[#00A651]' : 'bg-[#D1D5DB]'}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-200 ${enabled ? 'translate-x-[16px]' : 'translate-x-0'}`}
      />
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-[5px] px-[8px] py-[3px] rounded-full text-[11px] font-['Inter',sans-serif] font-medium ${active ? 'bg-[#F0FDF4] text-[#15803D]' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}>
      <span className={`w-[6px] h-[6px] rounded-full ${active ? 'bg-[#00A651]' : 'bg-[#D1D5DB]'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function WorkflowTypeBadge({ type }: { type: WorkflowType }) {
  // All badges use neutral gray styling
  return (
    <span
      className="inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[11px] font-['Inter',sans-serif] font-medium border bg-[#F9FAFB] text-[#374151] border-[#E5E7EB]"
    >
      {type}
    </span>
  );
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const icon = status === 'Direct ERP Link' ? (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.5 3.5L9 1l2 2-2.5 2.5M5.5 8.5L3 11l-2-2 2.5-2.5M4 8l4-4" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : status === 'Intercompany Linked' ? (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 6h4M3 3h6v6H3z" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="#6B7280" strokeWidth="1"/><path d="M6 4v2" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/></svg>
  );

  return (
    <span className="inline-flex items-center gap-[4px] text-[11px] font-['Inter',sans-serif] font-normal text-[#6B7280]">
      {icon}
      {status}
    </span>
  );
}

function LinkedTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] border border-[#E5E7EB] text-[10px] font-['Inter',sans-serif] font-medium text-[#374151]">
      {name}
    </span>
  );
}

function FilterCheckbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex items-center gap-[8px] py-[5px] cursor-pointer group">
      <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-colors ${checked ? 'bg-[#00A651] border-[#00A651]' : 'border-[#D1D5DB] bg-white group-hover:border-[#9CA3AF]'}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <span className="flex-1 font-['Inter',sans-serif] font-normal text-[12px] text-[#374151]">{label}</span>
      {count !== undefined && (
        <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[#9CA3AF]">{count}</span>
      )}
    </label>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export function WorkflowManagement() {
  const [rows, setRows] = useState<WorkflowRow[]>(workflowData);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<WorkflowType>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<Region>>(new Set());
  const [sortColumn, setSortColumn] = useState<'workspace' | 'workflowType' | 'connectionStatus' | 'active' | 'lastModified'>('workspace');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  // Filter counts for sidebar
  const typeCounts = useMemo(() => {
    const counts: Record<WorkflowType, number> = { Checklist: 0, Reconciliation: 0, Flux: 0, JEM: 0, Matching: 0 };
    rows.forEach(r => counts[r.workflowType]++);
    return counts;
  }, [rows]);

  const regionCounts = useMemo(() => {
    const counts: Record<Region, number> = { Americas: 0, EMEA: 0, APAC: 0 };
    rows.forEach(r => counts[r.region]++);
    return counts;
  }, [rows]);

  // Filter + search + sort
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.workspace.toLowerCase().includes(q) ||
        r.entity.toLowerCase().includes(q) ||
        r.workflowType.toLowerCase().includes(q) ||
        r.connectedTo.some(c => c.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (selectedTypes.size > 0) {
      result = result.filter(r => selectedTypes.has(r.workflowType));
    }

    // Region filter
    if (selectedRegions.size > 0) {
      result = result.filter(r => selectedRegions.has(r.region));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortColumn === 'workspace') cmp = a.workspace.localeCompare(b.workspace);
      else if (sortColumn === 'workflowType') cmp = a.workflowType.localeCompare(b.workflowType);
      else if (sortColumn === 'connectionStatus') cmp = a.connectionStatus.localeCompare(b.connectionStatus);
      else if (sortColumn === 'active') cmp = (a.active === b.active ? 0 : a.active ? -1 : 1);
      else if (sortColumn === 'lastModified') cmp = a.lastModified.localeCompare(b.lastModified);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rows, search, selectedTypes, selectedRegions, sortColumn, sortDir]);

  const toggleType = (t: WorkflowType) => {
    const next = new Set(selectedTypes);
    next.has(t) ? next.delete(t) : next.add(t);
    setSelectedTypes(next);
  };

  const toggleRegion = (r: Region) => {
    const next = new Set(selectedRegions);
    next.has(r) ? next.delete(r) : next.add(r);
    setSelectedRegions(next);
  };

  const toggleRowEnabled = (id: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled, active: !r.enabled } : r));
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRows.map(r => r.id)));
    }
  };

  const handleSort = (col: typeof sortColumn) => {
    if (sortColumn === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDir('asc');
    }
  };

  const handleBulkToggle = (enable: boolean) => {
    setRows(prev => prev.map(r => selectedRows.has(r.id) ? { ...r, enabled: enable, active: enable } : r));
    setSelectedRows(new Set());
    setBulkEditOpen(false);
  };

  const activeCount = rows.filter(r => r.active).length;
  const hasFilters = selectedTypes.size > 0 || selectedRegions.size > 0;

  const SortIcon = ({ col }: { col: typeof sortColumn }) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`ml-[3px] inline-block transition-transform ${sortColumn === col && sortDir === 'desc' ? 'rotate-180' : ''}`}>
      <path d="M3 6l2 2 2-2M3 4l2-2 2 2" stroke={sortColumn === col ? '#111827' : '#D1D5DB'} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="flex h-full bg-white">
      {/* ═══ FILTER SIDEBAR ═══ */}
      <div className="w-[220px] shrink-0 border-r border-[#E5E7EB] flex flex-col">
        <div className="px-[20px] pt-[24px] pb-[16px]">
          <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#111827] tracking-[-0.1px]">Filters</p>
        </div>

        {/* Module Filter */}
        <div className="px-[20px] pb-[20px]">
          <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9CA3AF] uppercase tracking-[0.5px] mb-[8px]">Workflow Module</p>
          {allWorkflowTypes.map(t => (
            <FilterCheckbox
              key={t}
              label={t}
              checked={selectedTypes.has(t)}
              onChange={() => toggleType(t)}
              count={typeCounts[t]}
            />
          ))}
        </div>

        <div className="mx-[20px] h-[1px] bg-[#F3F4F6]" />

        {/* Region Filter */}
        <div className="px-[20px] pt-[16px] pb-[20px]">
          <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9CA3AF] uppercase tracking-[0.5px] mb-[8px]">Entity Region</p>
          {allRegions.map(r => (
            <FilterCheckbox
              key={r}
              label={r}
              checked={selectedRegions.has(r)}
              onChange={() => toggleRegion(r)}
              count={regionCounts[r]}
            />
          ))}
        </div>

        {hasFilters && (
          <>
            <div className="mx-[20px] h-[1px] bg-[#F3F4F6]" />
            <div className="px-[20px] pt-[12px]">
              <button
                onClick={() => { setSelectedTypes(new Set()); setSelectedRegions(new Set()); }}
                className="font-['Inter',sans-serif] font-medium text-[11px] text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </>
        )}

        {/* Summary Stats */}
        <div className="mt-auto px-[20px] py-[20px] border-t border-[#F3F4F6]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[#9CA3AF]">Total mappings</span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#111827]">{rows.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[#9CA3AF]">Active</span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#00A651]">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[#9CA3AF]">Inactive</span>
              <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#9CA3AF]">{rows.length - activeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN TABLE AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-[12px]">
            <h1 className="font-['Inter',sans-serif] font-semibold text-[18px] text-[#111827] tracking-[-0.3px]">Workflow Management</h1>
            <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#6B7280] bg-[#F3F4F6] px-[8px] py-[3px] rounded-full">
              {filteredRows.length} {filteredRows.length === 1 ? 'mapping' : 'mappings'}
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            {/* Search */}
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.2"/>
                <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search workspaces..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-[240px] h-[34px] pl-[32px] pr-[10px] rounded-[7px] border border-[#E5E7EB] bg-white text-[12px] font-['Inter',sans-serif] font-normal text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/20 transition-colors"
              />
            </div>

            {/* Bulk Edit */}
            <div className="relative">
              <button
                onClick={() => setBulkEditOpen(!bulkEditOpen)}
                disabled={selectedRows.size === 0}
                className={`flex items-center gap-[6px] px-[12px] h-[34px] rounded-[7px] border text-[12px] font-['Inter',sans-serif] font-medium transition-colors ${selectedRows.size > 0 ? 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]' : 'border-[#F3F4F6] bg-[#F9FAFB] text-[#D1D5DB] cursor-not-allowed'}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Bulk Edit{selectedRows.size > 0 && ` (${selectedRows.size})`}
              </button>
              {bulkEditOpen && selectedRows.size > 0 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBulkEditOpen(false)} />
                  <div className="absolute right-0 top-[40px] z-50 w-[180px] bg-white border border-[#E5E7EB] rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-[4px]">
                    <button
                      onClick={() => handleBulkToggle(true)}
                      className="w-full text-left px-[14px] py-[8px] text-[12px] font-['Inter',sans-serif] font-normal text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                    >
                      Enable selected
                    </button>
                    <button
                      onClick={() => handleBulkToggle(false)}
                      className="w-full text-left px-[14px] py-[8px] text-[12px] font-['Inter',sans-serif] font-normal text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                    >
                      Disable selected
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="w-[40px] px-[12px] py-[10px]">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={toggleSelectAll}
                      className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-colors ${selectedRows.size === filteredRows.length && filteredRows.length > 0 ? 'bg-[#00A651] border-[#00A651]' : 'border-[#D1D5DB] bg-white hover:border-[#9CA3AF]'}`}
                    >
                      {selectedRows.size === filteredRows.length && filteredRows.length > 0 && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                  </div>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <button onClick={() => handleSort('workspace')} className="flex items-center font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px] hover:text-[#111827] transition-colors">
                    Workspace Name<SortIcon col="workspace" />
                  </button>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <button onClick={() => handleSort('workflowType')} className="flex items-center font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px] hover:text-[#111827] transition-colors">
                    Workflow Type<SortIcon col="workflowType" />
                  </button>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <button onClick={() => handleSort('connectionStatus')} className="flex items-center font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px] hover:text-[#111827] transition-colors">
                    Connection<SortIcon col="connectionStatus" />
                  </button>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px]">Connected To</span>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <button onClick={() => handleSort('active')} className="flex items-center font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px] hover:text-[#111827] transition-colors">
                    Status<SortIcon col="active" />
                  </button>
                </th>
                <th className="text-center px-[12px] py-[10px]">
                  <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px]">Enabled</span>
                </th>
                <th className="text-left px-[12px] py-[10px]">
                  <button onClick={() => handleSort('lastModified')} className="flex items-center font-['Inter',sans-serif] font-medium text-[10px] text-[#6B7280] uppercase tracking-[0.5px] hover:text-[#111827] transition-colors">
                    Modified<SortIcon col="lastModified" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => (
                <tr
                  key={row.id}
                  className={`border-b border-[#F3F4F6] transition-colors ${selectedRows.has(row.id) ? 'bg-[#F0FDF4]/40' : 'hover:bg-[#F9FAFB]'}`}
                >
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => toggleSelectRow(row.id)}
                        className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-colors ${selectedRows.has(row.id) ? 'bg-[#00A651] border-[#00A651]' : 'border-[#D1D5DB] bg-white hover:border-[#9CA3AF]'}`}
                      >
                        {selectedRows.has(row.id) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex flex-col">
                      <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[#111827] leading-[18px]">{row.workspace}</span>
                      <span className="font-['Inter',sans-serif] font-normal text-[10px] text-[#9CA3AF]">{row.entity} &middot; {row.region}</span>
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <WorkflowTypeBadge type={row.workflowType} />
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <ConnectionBadge status={row.connectionStatus} />
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex flex-wrap gap-[4px]">
                      {row.connectedTo.length > 0 ? (
                        row.connectedTo.map(c => <LinkedTag key={c} name={c} />)
                      ) : (
                        <span className="text-[10px] font-['Inter',sans-serif] font-normal text-[#D1D5DB]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <StatusBadge active={row.active} />
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <div className="flex items-center justify-center">
                      <ToggleSwitch enabled={row.enabled} onChange={() => toggleRowEnabled(row.id)} />
                    </div>
                  </td>
                  <td className="px-[12px] py-[12px]">
                    <span className="font-['Inter',sans-serif] font-normal text-[11px] text-[#9CA3AF]">{row.lastModified}</span>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-[40px]">
                    <p className="font-['Inter',sans-serif] font-normal text-[13px] text-[#9CA3AF]">No workflow mappings match your filters.</p>
                    <button
                      onClick={() => { setSearch(''); setSelectedTypes(new Set()); setSelectedRegions(new Set()); }}
                      className="mt-[8px] font-['Inter',sans-serif] font-medium text-[12px] text-[#00A651] hover:text-[#009647] transition-colors"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}