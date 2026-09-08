import { useMemo, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useAppStore, transactions } from '../../../store/useAppStore';
import { team, getTeamMember } from '../../../data/team';
import type { Resolution } from '../../../data/types';

interface Props {
  recordId: string;
  onDone: (toast: string) => void;
  onClose: () => void;
}

/**
 * Close Task handoff — creates a task on this period's close checklist.
 * Pre-fills a descriptive title from the transaction + anomaly and defaults
 * the due date to 3 business days out. Assignee defaults to the first
 * assignee on the record (if any) so the task follows existing ownership.
 */
export function CloseTaskModal({ recordId, onDone, onClose }: Props) {
  const record = useAppStore((s) => s.records.find((r) => r.id === recordId));
  const resolveRecord = useAppStore((s) => s.resolveRecord);
  const nextTaskCounter = useAppStore((s) => s.counters.task);

  const transaction = useMemo(
    () => (record ? transactions.find((t) => t.id === record.transactionId) : null),
    [record],
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState(
    record?.assigneeIds[0] ?? 'samantha-sheldon',
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState(defaultDueDate());

  useMemo(() => {
    if (!transaction || !record) return;
    const primaryFlag = [...record.flags].sort((a, b) => b.severity - a.severity)[0];
    const reason =
      primaryFlag?.source.kind === 'rule'
        ? primaryFlag.source.ruleName
        : 'AI-detected anomaly';
    setTitle(
      `Investigate ${formatMoney(transaction.amount)} ${reason.toLowerCase()} — ${transaction.vendorName ?? transaction.transactionId}`,
    );
    setDescription(
      `Anomaly raised on ${transaction.transactionId}. Review the flag details in Detect and reconcile or correct as appropriate before close.`,
    );
    // Keep default priority 'medium' unless the primary severity says otherwise
    if (primaryFlag) {
      setPriority(primaryFlag.severity >= 80 ? 'high' : primaryFlag.severity >= 50 ? 'medium' : 'low');
    }
  }, [transaction?.id, record?.id]);

  if (!record || !transaction) return null;

  const submit = () => {
    const counter = nextTaskCounter + 1;
    const taskId = `TASK-2026-04-${String(counter).padStart(3, '0')}`;
    useAppStore.setState((s) => ({ counters: { ...s.counters, task: counter } }));

    const resolution: Resolution = {
      kind: 'close-task',
      taskId,
      assigneeId,
      dueDate,
      at: new Date().toISOString(),
      byId: 'samantha-sheldon',
    };
    resolveRecord(recordId, resolution);
    const assignee = getTeamMember(assigneeId);
    onDone(
      `Task ${taskId} added to April 2026 Close Checklist — assigned to ${assignee?.name ?? 'team member'}, due ${formatDate(dueDate)}`,
    );
    onClose();
  };

  return (
    <Modal
      title="Create a close task"
      subtitle="This task will appear on the April 2026 Close Checklist so it's tracked alongside the close process."
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Create Task
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function defaultDueDate(): string {
  const d = new Date();
  let added = 0;
  while (added < 3) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}
function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
