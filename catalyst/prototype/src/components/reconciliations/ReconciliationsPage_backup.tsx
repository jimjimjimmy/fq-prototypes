import { useState } from 'react';
import { Settings2, Filter, RefreshCw, ChevronDown, CopyMinus, MoreVertical, MessageSquare } from 'lucide-react';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { EditGroupSlideout } from './EditGroupSlideout';

interface RecRow {
  folder: string;
  account: string;
  company: string;
  bankAccount: string;
  refId: string;
  perGL: string;
  recBalance: string;
  recItems: string;
  difference: string;
  assignees: { name: string; role: string }[];
  dueDate: string;
  completed: { name: string; date: string; onTime: boolean }[];
  isGroupHeader?: boolean;
  groupName?: string;
}

const rows: RecRow[] = [
  {
    folder: '01 Cash and cash\nequivalents',
    account: '1225 - Accounts Receivable: Non-trade',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: '(No Value)',
    refId: '#FQ-adf2304-123213',
    perGL: '$10,000.00',
    recBalance: '$453,509.00*',
    recItems: '$120,000.00',
    difference: '$0.00',
    assignees: [
      { name: 'David Suraj', role: 'Preparer' },
      { name: 'Amy Powell', role: 'Preparer' },
    ],
    dueDate: '11/26/2024',
    completed: [
      { name: 'David Suraj', date: '11/20/2024', onTime: true },
      { name: 'Amy Powell', date: '11/27/2024', onTime: false },
    ],
  },
  {
    folder: '01 Cash and cash\nequivalents',
    account: '1225 - Accounts Receivable: Non-trade',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: '(No Value)',
    refId: '#FQ-adf2304-123213',
    perGL: '$20,000.00',
    recBalance: '$453,509.00*',
    recItems: '$120,000.00',
    difference: '$0.00',
    assignees: [
      { name: 'David Suraj', role: 'Preparer' },
      { name: 'Amy Powell', role: 'Preparer' },
    ],
    dueDate: '11/26/2024',
    completed: [
      { name: 'David Suraj', date: '11/20/2024', onTime: true },
      { name: 'Amy Powell', date: '11/27/2024', onTime: false },
    ],
  },
  {
    folder: '01 Cash and cash\nequivalents',
    account: '',
    company: '',
    bankAccount: '',
    refId: '',
    perGL: '$20,000.00',
    recBalance: '$453,509.00*',
    recItems: '$120,000.00',
    difference: '$0.00',
    assignees: [
      { name: 'David Suraj', role: 'Preparer' },
      { name: 'Amy Powell', role: 'Preparer' },
    ],
    dueDate: '11/26/2024',
    completed: [
      { name: 'David Suraj', date: '11/20/2024', onTime: true },
      { name: 'Amy Powell', date: '11/27/2024', onTime: false },
    ],
    isGroupHeader: true,
    groupName: 'Beckys Reconciliation Group',
  },
  {
    folder: '',
    account: '1225 - Accounts Receivable: Non-trade',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: '(No Value)',
    refId: '#FQ-adf2304-123213',
    perGL: '$10,000.00',
    recBalance: '$453,509.00*',
    recItems: '$120,000.00',
    difference: '$0.00',
    assignees: [
      { name: 'David Suraj', role: 'Preparer' },
      { name: 'Amy Powell', role: 'Preparer' },
    ],
    dueDate: '11/26/2024',
    completed: [
      { name: 'David Suraj', date: '11/20/2024', onTime: true },
      { name: 'Amy Powell', date: '11/27/2024', onTime: false },
    ],
  },
  {
    folder: '',
    account: '1225 - Accounts Receivable: Non-trade',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: '(No Value)',
    refId: '#FQ-adf2304-123213',
    perGL: '$10,000.00',
    recBalance: '$453,509.00*',
    recItems: '$120,000.00',
    difference: '$0.00',
    assignees: [
      { name: 'David Suraj', role: 'Preparer' },
      { name: 'Amy Powell', role: 'Preparer' },
    ],
    dueDate: '11/26/2024',
    completed: [
      { name: 'David Suraj', date: '11/20/2024', onTime: true },
      { name: 'Amy Powell', date: '11/27/2024', onTime: false },
    ],
  },
];

export function ReconciliationsPage() {
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Sub-navigation tabs */}
      <div className="border-b border-[#e4e7ec] px-6 flex items-center gap-0">
        {['Dashboard', 'Folders', 'Checklist', 'Reconciliations', 'Notes', 'Journal Entries', 'Flux Analysis'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 text-[14px] font-medium font-['Inter',sans-serif] border-b-2 transition-colors ${
              tab === 'Reconciliations'
                ? 'border-[#1c895f] text-[#1d2433]'
                : 'border-transparent text-[#6b7280] hover:text-[#1d2433]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-[#e4e7ec]">
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif]">
          All Entities <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif]">
          By Period <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif]">
          March 2025 <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
      </div>

      {/* Title bar */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1d2433] font-['Inter',sans-serif]">Reconciliations</h1>
          <p className="text-[13px] text-[#6b7280] font-['Inter',sans-serif]">1/100</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif] hover:bg-neutral-50">
            <Filter className="size-4" /> Filter
          </button>
          <button className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif] hover:bg-neutral-50">
            <RefreshCw className="size-4" /> Refresh <ChevronDown className="size-4" />
          </button>
          <button className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif] hover:bg-neutral-50">
            <CopyMinus className="size-4" /> Collapse All
          </button>
          <button className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-2 text-[13px] text-[#424867] font-['Inter',sans-serif] hover:bg-neutral-50">
            Completeness <ChevronDown className="size-4" />
          </button>
          <button className="bg-[#1c895f] text-white rounded-[6px] h-9 px-4 flex items-center gap-2 text-[13px] font-semibold font-['Inter',sans-serif] hover:bg-[#167a53]">
            Add <ChevronDown className="size-4" />
          </button>
          <button className="size-9 flex items-center justify-center rounded-[6px] hover:bg-neutral-50">
            <MoreVertical className="size-4 text-[#6b7280]" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e4e7ec] text-[11px] font-semibold text-[#6b7280] font-['Inter',sans-serif] uppercase tracking-wide">
              <th className="py-3 px-3 w-[140px]">Period/ Folder</th>
              <th className="py-3 px-3 w-[240px]">Account</th>
              <th className="py-3 px-3 w-[90px]">Per GL</th>
              <th className="py-3 px-3 w-[100px]">Rec. Balance</th>
              <th className="py-3 px-3 w-[100px]">Rec. Items</th>
              <th className="py-3 px-3 w-[80px]">Difference</th>
              <th className="py-3 px-3 w-[180px]">Assignees</th>
              <th className="py-3 px-3 w-[100px]">Due Date</th>
              <th className="py-3 px-3 w-[180px]">Completed</th>
              <th className="py-3 px-3 w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#f0f1f3] hover:bg-[#fafbfc] align-top">
                <td className="py-4 px-3 text-[12px] text-[#1d2433] font-['Inter',sans-serif] whitespace-pre-line">
                  {row.folder}
                </td>
                <td className="py-4 px-3">
                  {row.isGroupHeader ? (
                    <div>
                      <p className="text-[12px] font-semibold text-[#1d2433] font-['Inter',sans-serif]">{row.groupName}</p>
                      <button className="text-[12px] text-[#1c895f] font-['Inter',sans-serif] hover:underline">Collapse Group ^</button>
                    </div>
                  ) : row.account ? (
                    <div>
                      <p className="text-[12px] font-semibold text-[#1d2433] font-['Inter',sans-serif]">{row.account}</p>
                      <p className="text-[11px] text-[#6b7280] font-['Inter',sans-serif]">Company: {row.company}</p>
                      <p className="text-[11px] text-[#6b7280] font-['Inter',sans-serif]">Bank Account: {row.bankAccount}</p>
                      <p className="text-[11px] text-[#6b7280] font-['Inter',sans-serif]">{row.refId}</p>
                    </div>
                  ) : null}
                </td>
                <td className="py-4 px-3 text-[12px] text-[#1d2433] font-['Inter',sans-serif]">{row.perGL}</td>
                <td className="py-4 px-3 text-[12px] text-[#1d2433] font-['Inter',sans-serif]">{row.recBalance}</td>
                <td className="py-4 px-3 text-[12px] text-[#1d2433] font-['Inter',sans-serif]">{row.recItems}</td>
                <td className="py-4 px-3 text-[12px] text-[#1d2433] font-['Inter',sans-serif]">{row.difference}</td>
                <td className="py-4 px-3">
                  <div className="flex flex-col gap-2">
                    {row.assignees.map((a, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <UserAvatar initials={a.name.split(' ').map(n => n[0]).join('')} size="sm" />
                        <div>
                          <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif]">{a.name}</p>
                          <p className="text-[11px] text-[#6b7280] font-['Inter',sans-serif]">{a.role}</p>
                        </div>
                        <div className="ml-auto w-[36px] h-[20px] bg-[#1c895f] rounded-full flex items-center justify-end px-0.5">
                          <div className="size-[16px] rounded-full bg-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex flex-col gap-2">
                    {row.assignees.map((_, j) => (
                      <p key={j} className="text-[12px] text-[#1d2433] font-['Inter',sans-serif]">{row.dueDate}</p>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex flex-col gap-2">
                    {row.completed.map((c, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <UserAvatar initials={c.name.split(' ').map(n => n[0]).join('')} size="xs" />
                        <div>
                          <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif]">{c.name}</p>
                          <p className={`text-[11px] font-['Inter',sans-serif] flex items-center gap-1 ${c.onTime ? 'text-[#1c895f]' : 'text-[#dc2626]'}`}>
                            <span className={`inline-block size-2 rounded-full ${c.onTime ? 'bg-[#1c895f]' : 'bg-[#dc2626]'}`} />
                            {c.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-1">
                    <button className="size-8 flex items-center justify-center rounded hover:bg-neutral-100" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 11.5V13.5H4.5L11.8733 6.12667L9.87333 4.12667L2.5 11.5Z" stroke="#6b7280" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="size-8 flex items-center justify-center rounded hover:bg-neutral-100" title="Comment">
                      <MessageSquare className="size-4 text-[#6b7280]" />
                    </button>
                    <button
                      className="size-8 flex items-center justify-center rounded hover:bg-neutral-100"
                      title="Edit Group Settings"
                      onClick={() => setIsEditGroupOpen(true)}
                    >
                      <Settings2 className="size-4 text-[#6b7280]" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded hover:bg-neutral-100" title="More">
                      <MoreVertical className="size-4 text-[#6b7280]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Group Slideout */}
      <EditGroupSlideout open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen} />
    </div>
  );
}
