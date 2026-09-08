import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { Task, SortableColumn } from '@/types';
import { TaskRow } from '../TaskRow';

interface TableViewProps {
  tasks: Task[];
  onSelectTask: (id: number) => void;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  sortColumn: SortableColumn | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: SortableColumn) => void;
}

function SortableHeader({ label, column, sortColumn, sortDirection, onSort, className }: {
  label: string;
  column: SortableColumn;
  sortColumn: SortableColumn | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: SortableColumn) => void;
  className: string;
}) {
  const isActive = sortColumn === column;
  return (
    <button
      onClick={() => onSort(column)}
      className={`flex h-full items-center gap-[4px] px-[12px] ${className} group cursor-pointer select-none`}
    >
      <p className="font-['Inter',sans-serif] font-semibold leading-[18px] text-[10px] tracking-[0.44px] uppercase text-[#00332a]">{label}</p>
      <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        {isActive && sortDirection === 'asc' ? (
          <ArrowUp className="size-[12px] text-[#00332a]" strokeWidth={2.5} />
        ) : isActive && sortDirection === 'desc' ? (
          <ArrowDown className="size-[12px] text-[#00332a]" strokeWidth={2.5} />
        ) : (
          <ArrowUpDown className="size-[12px] text-[#6b7280]" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}

export function TableView({ tasks, onSelectTask, currentPage, totalPages, rowsPerPage, onPageChange, onRowsPerPageChange, sortColumn, sortDirection, onSort }: TableViewProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-[24px]">
        <div className="border border-[#e4e7ec] rounded-[12px] overflow-hidden bg-white">
          <div className="w-full">
            <div className="bg-[rgba(245,245,245,1)] flex h-[40px] items-center w-full sticky top-0 z-10 border-b border-[#e4e7ec]">
              <div className="flex flex-col h-full items-start justify-center px-[20px] flex-[3]">
                <p className="font-['Inter',sans-serif] font-semibold leading-[18px] text-[#00332a] text-[10px] tracking-[0.44px] uppercase">Name</p>
              </div>
              <SortableHeader label="Type" column="type" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="w-[100px]" />
              <SortableHeader label="Status" column="status" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="flex-[1.2]" />
              <SortableHeader label="Due Date" column="dueDate" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="w-[95px]" />
              <SortableHeader label="Preparer" column="preparer" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="flex-1" />
              <SortableHeader label="Reviewer" column="reviewer" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="flex-1" />
              <div className="flex h-full items-center px-[12px] flex-1">
                <p className="font-['Inter',sans-serif] font-semibold leading-[18px] text-[#00332a] text-[10px] tracking-[0.44px] uppercase">Tags</p>
              </div>
              <SortableHeader label="Agent Status" column="agentStatus" sortColumn={sortColumn} sortDirection={sortDirection} onSort={onSort} className="flex-[1.2] min-w-0" />
            </div>

            <div className="flex flex-col">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onSelect={() => onSelectTask(task.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e4e7ec] px-[24px] py-[16px] bg-[#fafafa]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <p className="font-['Inter',sans-serif] font-medium text-[#475467] text-[12px]">Rows per page:</p>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-white border border-[#e4e7ec] rounded-[6px] px-[8px] py-[4px] font-['Inter',sans-serif] font-medium text-[#101828] text-[12px]"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white border border-[#e4e7ec] rounded-[6px] p-[6px] hover:bg-[#fafafa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-[16px] text-[#475467]" strokeWidth={2} />
            </button>

            <div className="flex items-center gap-[4px]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] h-[32px] rounded-[6px] px-[8px] font-['Inter',sans-serif] font-medium text-[12px] transition-colors ${
                    currentPage === page
                      ? 'bg-[#00332a] text-white'
                      : 'bg-white border border-[#e4e7ec] text-[#475467] hover:bg-[#fafafa]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-white border border-[#e4e7ec] rounded-[6px] p-[6px] hover:bg-[#fafafa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-[16px] text-[#475467]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
