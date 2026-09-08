import { useRef, useState } from 'react';
import { ArrowUpDown, Sparkles } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { useAppStore } from '../../../store/useAppStore';
import { RuleDetail } from './RuleDetail';
import { getTeamMember } from '../../../data/team';
import { RULE_ASSIGNEES } from '../../../data/ruleAssignees';
import type { Rule } from '../../../data/types';

interface Props {
  initialRuleId?: string;
  onClose: () => void;
  onDone: (toast: string) => void;
}

function Avatar({ memberId, size = 'md' }: { memberId: string; size?: 'sm' | 'md' }) {
  const member = getTeamMember(memberId);
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs';
  // "Dynamic Assignment" is a non-person assignee meaning "the rule picks
  // someone at firing time" — keep the Sparkles glyph so it's still
  // visually distinct from human assignees.
  if (memberId === 'dynamic') {
    return (
      <div className={`${dim} flex items-center justify-center rounded-full bg-violet-100 ring-2 ring-white`}>
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
      </div>
    );
  }
  // Real team members: use the avatar photo so this matches every other
  // avatar surface in the app (assignee chips, comments, sign-off card).
  // Fall back to a neutral initials chip only if the avatar URL is missing.
  if (member?.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className={`${dim} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <div className={`${dim} flex items-center justify-center rounded-full bg-neutral-300 font-semibold text-white ring-2 ring-white`}>
      {member?.initials ?? '?'}
    </div>
  );
}


function AssigneesCell({ rule }: { rule: Rule }) {
  const ids = RULE_ASSIGNEES[rule.id] ?? [rule.createdById];
  const primary = ids[0];
  const overflow = ids.length - 1;
  const primaryLabel = primary === 'dynamic' ? 'Dynamic Assignment' : (getTeamMember(primary)?.name ?? 'Unknown');
  // Show at most 2 stacked avatars (secondary behind, primary in front)
  const visibleIds = ids.slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center">
        {visibleIds.map((id, i) => (
          <div key={`${id}-${i}`} className="-ml-2 first:ml-0" style={{ zIndex: i }}>
            <Avatar memberId={id} size="sm" />
          </div>
        ))}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800 leading-tight truncate">{primaryLabel}</div>
        {overflow > 0 && (
          <div className="text-[11px] text-slate-400 leading-tight">+{overflow} Assignee{overflow > 1 ? 's' : ''}</div>
        )}
      </div>
    </div>
  );
}

export function RulesModal({ initialRuleId, onClose, onDone }: Props) {
  const rules = useAppStore((s) => s.rules);

  const [selectedId, setSelectedId] = useState<string | null>(initialRuleId ?? null);
  const selected = selectedId ? rules.find((r) => r.id === selectedId) : null;

  const isEmpty = !selected && rules.length === 0;

  // RuleDetail's save() captures internal form state, so we let it write its
  // current save function into a ref each render. The hoisted footer button
  // then calls saveRef.current(). dirty mirrors RuleDetail's dirty flag so
  // the Save button's enabled state stays correct without re-rendering tax.
  const saveRef = useRef<(() => void) | null>(null);
  const [ruleDirty, setRuleDirty] = useState(false);

  return (
    <Modal
      title={selected ? selected.name : 'Rules'}
      subtitle={undefined}
      onClose={onClose}
      size="lg"
      footer={
        selected ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex h-9 items-center rounded-md bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => saveRef.current?.()}
              disabled={!ruleDirty}
              className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Save Rule
            </button>
          </>
        ) : !isEmpty ? (
          <button
            type="button"
            onClick={() => onDone('Create rule — coming soon')}
            className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Create Rule
          </button>
        ) : undefined
      }
    >
      {selected ? (
        <RuleDetail
          rule={selected}
          assignees={RULE_ASSIGNEES[selected.id] ?? ['dynamic']}
          onSaved={(msg) => {
            onDone(msg);
            setSelectedId(null);
          }}
          onBack={() => setSelectedId(null)}
          saveRef={saveRef}
          onDirtyChange={setRuleDirty}
          hideFooter
        />
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-900">No rules yet</p>
            <p className="mt-1 text-sm text-slate-500">Create a rule to start detecting anomalies in your transactions.</p>
          </div>
          <button
            type="button"
            onClick={() => onDone('Create rule — coming soon')}
            className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Create Rule
          </button>
        </div>
      ) : (
        <div>
          {/* Table header */}
          <div className="grid grid-cols-[1fr_110px_1fr] gap-4 border-b border-slate-100 pb-2 mb-1">
            <button type="button" className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600">
              Name <ArrowUpDown className="h-3 w-3" />
            </button>
            <button type="button" className="flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600">
              Status <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assignees
            </span>
          </div>

          {/* Rows */}
          <div>
            {rules.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className="grid w-full grid-cols-[1fr_110px_1fr] gap-4 items-center border-b border-slate-50 py-3 text-left transition-colors hover:bg-slate-50 last:border-b-0"
              >
                <span className="text-sm font-semibold text-slate-900 truncate">{r.name}</span>
                <StatusBadge status={r.status} />
                <AssigneesCell rule={r} />
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function StatusBadge({ status }: { status: Rule['status'] }) {
  if (status === 'active') {
    return <span className="text-sm text-slate-600">Active</span>;
  }
  return (
    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
      {status}
    </span>
  );
}
