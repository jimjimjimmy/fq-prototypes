import { motion, AnimatePresence } from 'motion/react';
import { List, Kanban, BarChart3, Calendar as CalendarIcon, X, RotateCcw } from 'lucide-react';
import type { Task, ActiveFilters } from '@/types';
import { emptyFilters } from '@/types';
import svgPaths from '@/imports/svg-y3pz5guwqq';
import svgPathsAI from '@/imports/svg-dh7smmk73r';
import svgPathsCloseAgent from '@/imports/svg-bweoo5l04e';
import { hasActiveFilters, getActiveFilterCount, applyFilters, dueDateLabel } from '@/hooks/use-task-filters';

type TaskView = 'table' | 'board' | 'timeline' | 'calendar';

interface TaskToolbarProps {
  view: TaskView;
  onViewChange: (view: TaskView) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  activeFilters: ActiveFilters;
  pendingFilters: ActiveFilters;
  onPendingFiltersChange: (filters: ActiveFilters) => void;
  onApplyFilters: () => void;
  onApplyFiltersDirect: (filters: ActiveFilters) => void;
  onResetFilters: () => void;
  onCloseFilter: () => void;
  onClearAllFilters: () => void;
  onRemoveFilterPill: (category: string, value: string) => void;
  totalTasks: number;
  filteredCount: number;
  tasks: Task[];
}

export function TaskToolbar({
  view, onViewChange,
  isFilterOpen, onToggleFilter,
  activeFilters, pendingFilters, onPendingFiltersChange,
  onApplyFilters, onApplyFiltersDirect, onResetFilters, onCloseFilter,
  onClearAllFilters, onRemoveFilterPill,
  totalTasks, filteredCount, tasks,
}: TaskToolbarProps) {
  return (
    <>
      {/* Single Row: Insights + Controls */}
      <div className="flex items-center justify-between px-[34px] py-[20px] border-b border-[#e4e7ec] bg-white min-w-0">
        <div className="flex items-center gap-[16px] flex-1 min-w-0">
          <div className="flex gap-[6px] items-start flex-1 min-w-0">
            <div className="size-[13px] shrink-0 mt-[2px]">
              <svg className="size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                <path d={svgPathsAI.p2f8e6000} fill="#013A30" />
              </svg>
            </div>
            <div className="flex items-start gap-[8px] flex-1 min-w-0">
              <p className="font-['Inter',sans-serif] font-medium leading-[17px] text-[#013a30] line-clamp-2 text-[13px]">
                Your top priority today is resolving the intercompany variance and completing 2 overdue tasks.
              </p>
              <div className="bg-[rgba(0,81,51,0.1)] content-stretch flex gap-[4px] items-center px-[7px] py-[2px] relative rounded-[5px] shrink-0">
                <div aria-hidden="true" className="absolute border border-[rgba(29,88,63,0.2)] border-solid inset-0 pointer-events-none rounded-[5px]" />
                <div className="relative shrink-0 w-[14px]">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center overflow-clip py-[2px] relative rounded-[inherit] w-full">
                    <div className="h-[9.333px] relative shrink-0 w-[11.667px]">
                      <div className="absolute inset-[-6.43%_-5.14%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 10.5335">
                          <g>
                            <path d="M6.43333 2.93333V0.6H4.1" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                            <path d={svgPathsCloseAgent.p3eeed600} stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                            <path d="M0.6 6.4335H1.76667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                            <path d="M11.1 6.4335H12.2667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                            <path d="M8.1835 5.85V7.01667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                            <path d="M4.6835 5.85V7.01667" stroke="#1D583F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-['Inter',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#1d583f] text-[10px]">Prepared by Close Agent</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[12px] items-center shrink-0 ml-[24px]">
          <button
            onClick={onToggleFilter}
            className={`hover:bg-[rgba(255,255,255,0.7)] transition-colors h-[36px] rounded-[12px] border shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] flex gap-[6px] items-center px-[14px] ${
              isFilterOpen || hasActiveFilters(activeFilters)
                ? 'bg-[#00332a] border-[#00332a]'
                : 'bg-[rgba(255,255,255,0.5)] border-[rgba(255,255,255,0.6)]'
            }`}
          >
            <svg className="size-[13px]" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d={svgPaths.p3b69a080} stroke={isFilterOpen || hasActiveFilters(activeFilters) ? '#ffffff' : '#00332a'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            </svg>
            <p className={`font-['Inter',sans-serif] font-semibold leading-[20px] text-[13px] ${isFilterOpen || hasActiveFilters(activeFilters) ? 'text-white' : 'text-[#00332a]'}`}>Filter</p>
            {hasActiveFilters(activeFilters) && !isFilterOpen && (
              <span className="bg-white text-[#00332a] rounded-full size-[18px] flex items-center justify-center font-['Inter',sans-serif] font-semibold text-[10px]">
                {getActiveFilterCount(activeFilters)}
              </span>
            )}
          </button>

          <div className="bg-[rgba(255,255,255,0.5)] rounded-[12px] border border-[rgba(255,255,255,0.6)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] flex p-px">
            {([
              { key: 'board' as const, Icon: Kanban, label: 'Board' },
              { key: 'table' as const, Icon: List, label: 'Table' },
              { key: 'timeline' as const, Icon: BarChart3, label: 'Timeline' },
              { key: 'calendar' as const, Icon: CalendarIcon, label: 'Calendar' },
            ]).map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={`h-[36px] flex gap-[6px] items-center justify-center px-[14px] rounded-[11px] transition-colors ${view === key ? 'bg-white shadow-sm' : 'hover:bg-[rgba(255,255,255,0.3)]'}`}
              >
                <Icon className="size-[13px]" strokeWidth={2} />
                <p className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[#00332a] text-[13px]">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-b border-[#e4e7ec]"
          >
            <FilterPanel
              pendingFilters={pendingFilters}
              setPendingFilters={onPendingFiltersChange}
              onApply={onApplyFilters}
              onApplyDirect={onApplyFiltersDirect}
              onReset={onResetFilters}
              onClose={onCloseFilter}
              tasks={tasks}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Pills */}
      {hasActiveFilters(activeFilters) && !isFilterOpen && (
        <div className="flex items-center gap-[8px] px-[34px] py-[10px] bg-[#fafafa] border-b border-[#e4e7ec] flex-wrap">
          <p className="font-['Inter',sans-serif] font-medium text-[#475467] text-[11px] shrink-0">Filtered by:</p>
          {activeFilters.dueDateRange !== 'all' && (
            <FilterPill label={`Due: ${dueDateLabel(activeFilters.dueDateRange)}`} onRemove={() => onRemoveFilterPill('dueDate', '')} />
          )}
          {activeFilters.statuses.map(s => <FilterPill key={`s-${s}`} label={s} onRemove={() => onRemoveFilterPill('status', s)} />)}
          {activeFilters.types.map(t => <FilterPill key={`t-${t}`} label={t} onRemove={() => onRemoveFilterPill('type', t)} />)}
          {activeFilters.preparers.map(p => <FilterPill key={`p-${p}`} label={p} onRemove={() => onRemoveFilterPill('preparer', p)} />)}
          {activeFilters.reviewers.map(r => <FilterPill key={`r-${r}`} label={r} onRemove={() => onRemoveFilterPill('reviewer', r)} />)}
          {activeFilters.agentStatuses.map(a => <FilterPill key={`a-${a}`} label={a} onRemove={() => onRemoveFilterPill('agentStatus', a)} />)}
          {activeFilters.tags.map(t => <FilterPill key={`tg-${t}`} label={t} onRemove={() => onRemoveFilterPill('tag', t)} />)}
          <button onClick={onClearAllFilters} className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] text-[#DC2626] hover:bg-[#fef2f2] transition-colors">
            <RotateCcw className="size-[11px]" strokeWidth={2} />
            <p className="font-['Inter',sans-serif] font-medium text-[11px]">Clear All</p>
          </button>
          <div className="ml-auto shrink-0">
            <p className="font-['Inter',sans-serif] font-medium text-[#475467] text-[11px]">{filteredCount} of {totalTasks} tasks</p>
          </div>
        </div>
      )}
    </>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-[4px] bg-[#00332a] rounded-[6px] px-[8px] py-[3px]">
      <p className="font-['Inter',sans-serif] font-medium text-white text-[11px] leading-[16px]">{label}</p>
      <button onClick={onRemove} className="hover:bg-[rgba(255,255,255,0.2)] rounded-full p-[1px] transition-colors">
        <X className="size-[10px] text-white" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex items-center gap-[8px] px-[8px] py-[5px] rounded-[6px] hover:bg-[#f3f4f6] cursor-pointer transition-colors select-none">
      <div className={`size-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${checked ? 'bg-[#00332a] border-[#00332a]' : 'bg-white border-[#d1d5db]'}`}>
        {checked && (
          <svg className="size-[10px]" fill="none" viewBox="0 0 10 10">
            <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="font-['Inter',sans-serif] font-medium text-[#344054] text-[12px] leading-[18px] flex-1">{label}</span>
      {count !== undefined && <span className="font-['Inter',sans-serif] font-medium text-[#9ca3af] text-[11px]">{count}</span>}
    </label>
  );
}

function FilterPanel({ pendingFilters, setPendingFilters, onApply, onApplyDirect, onReset, onClose, tasks }: {
  pendingFilters: ActiveFilters;
  setPendingFilters: (f: ActiveFilters) => void;
  onApply: () => void;
  onApplyDirect: (filters: ActiveFilters) => void;
  onReset: () => void;
  onClose: () => void;
  tasks: Task[];
}) {
  const allStatuses: Task['status'][] = ['Not Started', 'In Progress', 'Ready for Review', 'Blocked', 'Complete'];
  const allTypes = [...new Set(tasks.map(t => t.type))].sort();
  const allPreparers = [...new Set(tasks.map(t => t.preparer))].sort();
  const allReviewers = [...new Set(tasks.map(t => t.reviewer))].sort();
  const allAgentStatuses = [...new Set(tasks.map(t => t.agentStatus).filter(Boolean) as string[])].sort();
  const allTags = [...new Set(tasks.flatMap(t => t.tags))].sort();

  const statusCounts: Record<string, number> = {};
  allStatuses.forEach(s => { statusCounts[s] = tasks.filter(t => t.status === s).length; });
  const typeCounts: Record<string, number> = {};
  allTypes.forEach(tp => { typeCounts[tp] = tasks.filter(t => t.type === tp).length; });

  const toggleArrayValue = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const handleQuickFilter = (preset: 'late' | 'blocked' | 'readyForReview' | 'inProgress') => {
    let updated = { ...emptyFilters };
    switch (preset) {
      case 'late': updated.dueDateRange = 'late'; break;
      case 'blocked': updated.statuses = ['Blocked']; break;
      case 'readyForReview': updated.statuses = ['Ready for Review']; break;
      case 'inProgress': updated.statuses = ['In Progress']; break;
    }
    setPendingFilters(updated);
    onApplyDirect(updated);
  };

  const isQuickActive = (preset: string) => {
    if (preset === 'late') return pendingFilters.dueDateRange === 'late' && pendingFilters.statuses.length === 0;
    if (preset === 'blocked') return pendingFilters.statuses.length === 1 && pendingFilters.statuses[0] === 'Blocked' && pendingFilters.dueDateRange === 'all';
    if (preset === 'readyForReview') return pendingFilters.statuses.length === 1 && pendingFilters.statuses[0] === 'Ready for Review' && pendingFilters.dueDateRange === 'all';
    if (preset === 'inProgress') return pendingFilters.statuses.length === 1 && pendingFilters.statuses[0] === 'In Progress' && pendingFilters.dueDateRange === 'all';
    return false;
  };

  const previewCount = applyFilters(tasks, pendingFilters).length;
  const hasChanges = JSON.stringify(pendingFilters) !== JSON.stringify(emptyFilters);

  return (
    <div className="bg-white px-[34px] py-[20px]">
      <div className="mb-[16px]">
        <p className="font-['Inter',sans-serif] font-semibold text-[#101828] text-[12px] mb-[8px]">Quick Filters</p>
        <div className="flex gap-[8px] flex-wrap">
          {[
            { key: 'late' as const, label: 'Late Items', color: 'bg-[#fef2f2] text-[#DC2626] border-[#fecaca]', activeColor: 'bg-[#DC2626] text-white border-[#DC2626]' },
            { key: 'blocked' as const, label: 'Blocked', color: 'bg-[#fdebd7] text-[#e15015] border-[#fed7aa]', activeColor: 'bg-[#e15015] text-white border-[#e15015]' },
            { key: 'readyForReview' as const, label: 'Ready for Review', color: 'bg-[#f4eef9] text-[#73418a] border-[#e9d5f5]', activeColor: 'bg-[#73418a] text-white border-[#73418a]' },
            { key: 'inProgress' as const, label: 'In Progress', color: 'bg-[#e3edf6] text-[#507fc0] border-[#bfdbfe]', activeColor: 'bg-[#507fc0] text-white border-[#507fc0]' },
          ].map(({ key, label, color, activeColor }) => (
            <button
              key={key}
              onClick={() => handleQuickFilter(key)}
              className={`px-[12px] py-[5px] rounded-[8px] border font-['Inter',sans-serif] font-semibold text-[12px] transition-all ${isQuickActive(key) ? activeColor : color} hover:shadow-sm`}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#e4e7ec] mb-[16px]" />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-[20px]">
        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Due Date</p>
          <div className="flex flex-col">
            {(['all', 'late', 'today', 'thisWeek', 'upcoming'] as const).map(range => (
              <label key={range} className="flex items-center gap-[8px] px-[8px] py-[5px] rounded-[6px] hover:bg-[#f3f4f6] cursor-pointer transition-colors select-none">
                <div className={`size-[16px] rounded-full border flex items-center justify-center transition-colors ${pendingFilters.dueDateRange === range ? 'border-[#00332a]' : 'border-[#d1d5db]'}`}>
                  {pendingFilters.dueDateRange === range && <div className="size-[8px] rounded-full bg-[#00332a]" />}
                </div>
                <span className={`font-['Inter',sans-serif] font-medium text-[12px] leading-[18px] ${range === 'late' ? 'text-[#DC2626]' : 'text-[#344054]'}`}>{dueDateLabel(range)}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Status</p>
          <div className="flex flex-col">
            {allStatuses.map(status => (
              <FilterCheckbox key={status} label={status} checked={pendingFilters.statuses.includes(status)} onChange={() => setPendingFilters({ ...pendingFilters, statuses: toggleArrayValue(pendingFilters.statuses, status) })} count={statusCounts[status]} />
            ))}
          </div>
        </div>

        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Type</p>
          <div className="flex flex-col">
            {allTypes.map(type => (
              <FilterCheckbox key={type} label={type} checked={pendingFilters.types.includes(type)} onChange={() => setPendingFilters({ ...pendingFilters, types: toggleArrayValue(pendingFilters.types, type) })} count={typeCounts[type]} />
            ))}
          </div>
        </div>

        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Preparer</p>
          <div className="flex flex-col">
            {allPreparers.map(preparer => (
              <FilterCheckbox key={preparer} label={preparer} checked={pendingFilters.preparers.includes(preparer)} onChange={() => setPendingFilters({ ...pendingFilters, preparers: toggleArrayValue(pendingFilters.preparers, preparer) })} />
            ))}
          </div>
        </div>

        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Reviewer</p>
          <div className="flex flex-col">
            {allReviewers.map(reviewer => (
              <FilterCheckbox key={reviewer} label={reviewer} checked={pendingFilters.reviewers.includes(reviewer)} onChange={() => setPendingFilters({ ...pendingFilters, reviewers: toggleArrayValue(pendingFilters.reviewers, reviewer) })} />
            ))}
          </div>
        </div>

        <div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Agent Status</p>
          <div className="flex flex-col">
            {allAgentStatuses.map(agentStatus => (
              <FilterCheckbox key={agentStatus} label={agentStatus} checked={pendingFilters.agentStatuses.includes(agentStatus)} onChange={() => setPendingFilters({ ...pendingFilters, agentStatuses: toggleArrayValue(pendingFilters.agentStatuses, agentStatus) })} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[16px]">
        <p className="font-['Inter',sans-serif] font-semibold text-[#344054] text-[10px] tracking-[0.44px] uppercase mb-[6px]">Tags</p>
        <div className="flex gap-[6px] flex-wrap">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setPendingFilters({ ...pendingFilters, tags: toggleArrayValue(pendingFilters.tags, tag) })} className={`px-[10px] py-[4px] rounded-[6px] border font-['Inter',sans-serif] font-medium text-[12px] transition-all ${pendingFilters.tags.includes(tag) ? 'bg-[#00332a] text-white border-[#00332a]' : 'bg-[#f9fafb] text-[#344054] border-[#e4e7ec] hover:bg-[#f3f4f6]'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-[20px] pt-[16px] border-t border-[#e4e7ec]">
        <div className="flex items-center gap-[8px]">
          <p className="font-['Inter',sans-serif] font-medium text-[#6b7280] text-[12px]">{previewCount} {previewCount === 1 ? 'task' : 'tasks'} match{previewCount !== 1 ? '' : 'es'}</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <button onClick={onReset} disabled={!hasChanges} className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] text-[#475467] hover:bg-[#f3f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <RotateCcw className="size-[12px]" strokeWidth={2} />Reset
          </button>
          <button onClick={onClose} className="px-[14px] py-[7px] rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] text-[#475467] hover:bg-[#f3f4f6] transition-colors border border-[#e4e7ec]">Cancel</button>
          <button onClick={onApply} className="px-[18px] py-[7px] rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] text-white bg-[#00332a] hover:bg-[#004d3f] transition-colors shadow-sm">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
