import { X, ChevronDown, Settings2, Plus, Pencil, MoreVertical, Trash2 } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { useState } from 'react';

interface EditGroupSlideoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName?: string;
}

const accountFilters = [
  {
    name: '1010 - Cash in Bank - USD Operating',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: 'Morgan Stanley',
    bookCode: 'Book Code A',
  },
  {
    name: '1020 - Cash in Bank - USD Payroll',
    company: 'Global Modern Services, Inc. (USA)',
    bankAccount: 'Morgan Stanley',
    bookCode: 'Book Code A',
  },
];

const assignees = [
  { name: 'Sean Bean', role: 'Monthly Preparer', dueDateType: 'Business Day', dueDateValue: '15', estimatedTime: '05h 45m' },
  { name: 'Ian McKellen', role: 'Monthly Preparer', dueDateType: 'Calendar Day', dueDateValue: '1', estimatedTime: '05h 45m' },
];

export function EditGroupSlideout({ open, onOpenChange, groupName = 'Hamburger Donuts' }: EditGroupSlideoutProps) {
  const [currency, setCurrency] = useState('USD');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[500px] sm:max-w-[500px] p-0 flex flex-col gap-0 border-l border-[#e1e6ef]"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-6 gap-4">
          <SheetTitle className="font-['Museo_Sans',sans-serif] font-bold text-[16px] leading-[20px] text-black">
            Edit Group
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="size-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="size-5 text-[#6b7280]" />
          </button>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-40 flex flex-col gap-6">
          {/* Entity */}
          <FormDropdown label="Entity" value="Beckys Donuts" required />

          {/* Folder */}
          <FormDropdown label="Folder" value="01 Cash and cash equivalents" required />

          {/* Group Name */}
          <FormField label="Group Name" required>
            <div className="border border-[#e1e6ef] rounded-[6px] h-10 px-2 flex items-center shadow-sm bg-white">
              <span className="text-[12px] font-normal text-[#1d2433] font-['Inter',sans-serif]">{groupName}</span>
            </div>
          </FormField>

          {/* Accounts */}
          <FormDropdown label="Accounts" value="2 Accounts Selected" required />

          {/* Account Balance Filters */}
          <div className="flex flex-col">
            <p className="text-[12px] font-medium text-[#424867] font-['Inter',sans-serif] leading-[18px] mb-1">
              Account Balance Filters
            </p>
            <div className="border border-[#e1e6ef] rounded-[6px] overflow-hidden">
              {/* Bulk button */}
              <div className="border-b border-[#e1e6ef] p-2">
                <button className="flex items-center gap-2 px-1.5 py-1.5 rounded-[6px] hover:bg-neutral-50">
                  <Plus className="size-4 text-[#6b7280]" />
                  <span className="font-['Museo_Sans',sans-serif] font-bold text-[11px] text-[#6b7280] leading-[14px]">
                    Bulk Account Balance Filters
                  </span>
                </button>
              </div>
              {/* Account filter cards */}
              {accountFilters.map((account, i) => (
                <div key={i} className="flex items-start px-3 pb-1">
                  <div className="flex-1 py-3 flex flex-col">
                    <p className="text-[11px] font-semibold text-[#1d2433] font-['Inter',sans-serif] leading-[16px] pb-1">
                      {account.name}
                    </p>
                    <div className="flex flex-col text-[11px] leading-[16px] text-[rgba(29,36,51,0.65)]">
                      <div className="flex gap-1">
                        <span className="font-semibold">Company:</span>
                        <span className="font-normal">{account.company}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="font-semibold">Bank Account:</span>
                        <span className="font-normal">{account.bankAccount}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="font-semibold">Book Code:</span>
                        <span className="font-normal">{account.bookCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 pl-4">
                    <button className="size-9 flex items-center justify-center rounded-full hover:bg-neutral-100">
                      <Pencil className="size-4 text-[#6b7280]" />
                    </button>
                    <button className="size-9 flex items-center justify-center rounded-full hover:bg-neutral-100">
                      <MoreVertical className="size-4 text-[#6b7280]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <FormDropdown label="Frequency" value="Monthly" required />

          {/* Assignees */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] leading-[18px]">Assignees</p>
              <button className="text-[11px] font-bold text-[#6b7280] font-['Museo_Sans',sans-serif] px-1.5 py-1 rounded-[6px] hover:bg-neutral-50">
                Edit
              </button>
            </div>
            <div className="border border-[#e1e6ef] rounded-[4px] py-3 flex flex-col gap-2">
              {assignees.map((assignee, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-start gap-4 pr-1">
                    <div className="flex-1 flex items-center gap-3 px-3">
                      <UserAvatar initials={assignee.name.split(' ').map(n => n[0]).join('')} size="sm" />
                      <div className="flex flex-col w-[200px]">
                        <div className="flex items-center gap-1 h-4">
                          <span className="text-[12px] font-semibold text-[#1b1f27] font-['Inter',sans-serif]">{assignee.name}</span>
                          <ChevronDown className="size-4 text-[#6b7280]" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-medium text-[#adb2bb] font-['Inter',sans-serif]">{assignee.role}</span>
                          <ChevronDown className="size-4 text-[#adb2bb]" />
                        </div>
                      </div>
                    </div>
                    <button className="size-9 flex items-center justify-center rounded-full hover:bg-neutral-100">
                      <Trash2 className="size-4 text-[#6b7280]" />
                    </button>
                  </div>
                  <div className="flex gap-6 items-end px-3">
                    <div className="flex gap-4 items-center pl-10 w-[264px]">
                      <div className="flex-1">
                        <div className="border border-[#e1e6ef] rounded-[6px] h-10 px-2 flex items-center gap-2 shadow-sm bg-white">
                          <span className="text-[12px] font-medium text-[#424867] font-['Inter',sans-serif] flex-1 truncate">{assignee.dueDateType}</span>
                          <ChevronDown className="size-5 text-[#6b7280] shrink-0" />
                        </div>
                      </div>
                      <div className="w-10">
                        <div className="border border-[#e1e6ef] rounded-[6px] h-10 px-2 flex items-center shadow-sm bg-white">
                          <span className="text-[12px] font-normal text-[#1d2433] font-['Inter',sans-serif]">{assignee.dueDateValue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-[#6b7280] font-['Inter',sans-serif] leading-[16px] mb-1">Estimated Time</p>
                      <div className="border border-[#e1e6ef] rounded-[6px] h-10 px-2 flex items-center shadow-sm bg-white">
                        <span className="text-[12px] font-normal text-[#1d2433] font-['Inter',sans-serif]">{assignee.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  {i < assignees.length - 1 && <div className="mx-0 my-3 h-px bg-[#e1e6ef]" />}
                </div>
              ))}
              {/* Add more */}
              <div className="px-3 pt-2">
                <div className="flex items-center gap-1">
                  <Plus className="size-5 text-[#adb2bb]" />
                  <span className="text-[12px] font-semibold text-[#adb2bb] font-['Inter',sans-serif]">
                    Add <span className="underline text-[#1d2433]">Preparer</span> or <span className="underline text-[#1d2433]">Reviewer</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Dropdown */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="size-1 rounded-full bg-[#1d2433]" />
              <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] leading-[18px]">Currency</p>
            </div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-10 border-[#cbd2e1] rounded-[6px] shadow-sm bg-white text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="MXN">MXN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* General Settings */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] leading-[18px]">General Settings</p>
              <button className="text-[11px] font-bold text-[#6b7280] font-['Museo_Sans',sans-serif] px-1.5 py-0.5 rounded-[6px] hover:bg-neutral-50">
                Edit
              </button>
            </div>
            <div className="border border-[#e1e6ef] rounded-[4px] p-2 flex flex-col gap-1 text-[12px] leading-[18px]">
              <SettingsRow label="Currency:" value="USD" />
              <SettingsRow label="Rec Type:" value="AutoRec Disabled" />
              <SettingsRow label="Fixed Balance:" value="NA" />
              <SettingsRow label="Threshold:" value="$100.00" />
            </div>
          </div>

          {/* Controls */}
          <FormDropdown label="Controls" value="Select Controls" />

          {/* Tags */}
          <FormDropdown label="Tags" value="Select Tags" />
        </div>

        {/* Footer */}
        <SheetFooter className="border-t-0 p-0">
          <div className="flex items-center justify-end gap-4 px-4 py-4 bg-[#f8fafc] h-[72px]">
            <button
              onClick={() => onOpenChange(false)}
              className="h-10 px-3 rounded-[6px] font-['Museo_Sans',sans-serif] font-bold text-[12px] text-[#6b7280] tracking-[-0.12px] hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button className="h-10 px-3 rounded-[6px] bg-[rgba(28,137,95,0.3)] font-['Museo_Sans',sans-serif] font-bold text-[12px] text-white tracking-[-0.12px]">
              Done
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {required && <div className="size-1 rounded-full bg-[#1d2433]" />}
        <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] leading-[16px]">{label}</p>
      </div>
      {children}
    </div>
  );
}

function FormDropdown({ label, value, required }: { label: string; value: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {required && <div className="size-1 rounded-full bg-[#1d2433]" />}
        <p className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] leading-[18px]">{label}</p>
      </div>
      <div className="border border-[#cbd2e1] rounded-[6px] h-10 px-2 flex items-center gap-2 shadow-sm bg-white cursor-pointer hover:border-[#adb2bb]">
        <span className="text-[12px] font-medium text-[#1d2433] font-['Inter',sans-serif] flex-1 truncate">{value}</span>
        <ChevronDown className="size-5 text-[#6b7280] shrink-0" />
      </div>
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="font-semibold text-[rgba(29,36,51,0.9)] font-['Inter',sans-serif] max-w-[88px] shrink-0 whitespace-nowrap">{label}</span>
      <span className="font-normal text-[#1d2433] font-['Inter',sans-serif]">{value}</span>
    </div>
  );
}
