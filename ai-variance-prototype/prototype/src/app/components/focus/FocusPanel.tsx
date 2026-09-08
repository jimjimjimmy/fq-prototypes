import React, { useState, useEffect } from 'react';
import {
  Sparkles, ChevronRight, Pencil, RefreshCw,
  FileText, RotateCcw, ChevronDown, ChevronUp, Check, X, Receipt, ExternalLink, Paperclip, Maximize2, Copy,
} from 'lucide-react';
import type { VarianceItem, Collection, Status } from '../../../data/variances';
import { formatDollarFull, formatDollar, formatPercent } from '../../../data/variances';
import { TransactionsDrawer } from '../table/TransactionsDrawer';
import { TrendsDrawer } from '../table/TrendsDrawer';

interface Props {
  item: VarianceItem | null;
  collection: Collection | null;
  onStatusChange: (itemId: string, status: Status, draft?: string) => void;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AvatarChip({ name, initials, color }: { name: string; initials: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-neutral-200"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <p className="text-sm font-medium text-neutral-900 leading-none">{name}</p>
    </div>
  );
}

// ─── SignOffToggle — Detect exact match ───────────────────────────────────────

function SignOffToggle({
  signedOff,
  disabled,
  onSignOff,
  onReopen,
}: {
  signedOff: boolean;
  disabled?: boolean;
  onSignOff: () => void;
  onReopen: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => (signedOff ? onReopen() : onSignOff())}
      className={`inline-flex items-center gap-3 rounded-lg border px-4 py-2.5 font-body text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        signedOff
          ? 'border-[#014a3d] bg-[#014a3d] text-white hover:bg-[#00332a]'
          : 'border-transparent bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      }`}
    >
      <span className="min-w-[70px] text-left">
        {signedOff ? 'Signed off' : 'Sign off'}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
          signedOff ? 'bg-white/25' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all duration-200 ${
            signedOff ? 'translate-x-[18px] bg-white' : 'translate-x-0.5 bg-neutral-400'
          }`}
        />
      </span>
    </button>
  );
}

// ─── WorkflowHeader — Detect ReviewHeader exact match ─────────────────────────

function WorkflowHeader({
  item,
  onSignOff,
  onRecall,
}: {
  item: VarianceItem;
  onSignOff: () => void;
  onRecall: () => void;
}) {
  const preparerSignedOff = item.status === 'ready-for-review' || item.status === 'signed-off';
  const reviewerSignedOff = item.status === 'signed-off';
  const signOffDate = item.signedOffAt;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-6 py-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4">

        {/* ── Preparer (current user) ── */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Avatar initials={item.preparer.initials} color={item.preparer.color} src={item.preparer.avatar} />
          <div className="flex items-center gap-1.5 leading-none">
            <p className="font-body text-sm font-medium leading-none text-neutral-900">{item.preparer.name}</p>
            <span className="inline-flex items-center rounded px-1 py-0.5 font-body text-[9px] font-medium uppercase tracking-wide bg-neutral-900 text-white leading-none">
              You
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {preparerSignedOff ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#014a3d] px-2.5 py-1 font-body text-xs font-medium text-white">
                <Check className="h-3 w-3" />
                Signed off
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-body text-xs font-medium text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-neutral-400 inline-block" />
                Pending
              </span>
            )}
            {preparerSignedOff && signOffDate && (
              <span className="font-mono text-[10px] leading-none text-neutral-400">{signOffDate}</span>
            )}
          </div>
        </div>

        {/* Divider arrow */}
        <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0" />

        {/* ── Reviewer ── */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Avatar initials={item.reviewer.initials} color={item.reviewer.color} src={item.reviewer.avatar} />
          <p className="font-body text-sm font-medium leading-none text-neutral-900">{item.reviewer.name}</p>
          <div className="flex flex-col items-center gap-1">
            {reviewerSignedOff ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#014a3d] px-2.5 py-1 font-body text-xs font-medium text-white">
                <Check className="h-3 w-3" />
                Signed off
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-body text-xs font-medium text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-neutral-400 inline-block" />
                Pending
              </span>
            )}
            {reviewerSignedOff && signOffDate && (
              <span className="font-mono text-[10px] leading-none text-neutral-400">{signOffDate}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Explanation card ─────────────────────────────────────────────────────────

type ExplState = 'blank' | 'generating' | 'visible' | 'editing';

const COSO_STEPS = [
  { label: 'Retrieving journal entries and source transactions…',  sub: 'Transaction layer' },
  { label: 'Assessing materiality against COSO thresholds…',       sub: 'Risk Assessment' },
  { label: 'Evaluating control environment and risk factors…',     sub: 'Control Environment' },
  { label: 'Cross-referencing prior period explanations…',         sub: 'Monitoring' },
  { label: 'Drafting compliant explanation…',                      sub: 'Information & Communication' },
];

interface ExplMeta {
  source: 'ai' | 'manual';
  author: string;
  at: string;
}

interface ExplanationCardProps {
  item: VarianceItem;
  explState: ExplState;
  generatingStep: number;
  editText: string;
  explMeta: ExplMeta | null;
  priorPeriodLabel: string;
  onDraftWithAI: () => void;
  onWriteManually: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: (text: string) => void;
  onEditTextChange: (text: string) => void;
  onRegenerate: () => void;
}

function ExplanationCard({
  item, explState, generatingStep, editText, explMeta, priorPeriodLabel,
  onDraftWithAI, onWriteManually, onEditStart, onEditCancel, onEditSave, onEditTextChange, onRegenerate,
}: ExplanationCardProps) {
  const [priorOpen, setPriorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasDraft = !!item.draftExplanation;
  const showActions = explState === 'visible';
  const hasPrior = !!item.priorPeriodExplanation;

  function handleCopyPrior() {
    if (!item.priorPeriodExplanation) return;
    navigator.clipboard.writeText(item.priorPeriodExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="mt-4 border-t border-neutral-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base tracking-tight text-neutral-900 flex items-center gap-2">
          Explanation
          {hasDraft && explState === 'visible' && (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
              Edited
            </span>
          )}
        </h3>
        {showActions && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 font-body text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors px-2 py-1 rounded-md hover:bg-neutral-100"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={onEditStart}
              className="flex items-center gap-1.5 font-body text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors px-2 py-1 rounded-md hover:bg-neutral-100"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>
        )}
      </div>

      {explState === 'blank' && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 py-7 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold tracking-tight text-neutral-700">No explanation drafted yet</p>
            <p className="mt-0.5 font-display text-xs tracking-tight text-neutral-400">Draft with AI in one click, or write manually</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDraftWithAI}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Draft with AI
            </button>
            <button
              type="button"
              onClick={onWriteManually}
              className="font-body text-sm text-neutral-400 hover:text-neutral-700 transition-colors px-2 py-2"
            >
              Write manually
            </button>
          </div>
        </div>
      )}

      {explState === 'generating' && (
        <div className="rounded-lg bg-neutral-50 px-5 py-5">
          <div className="mb-4 flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-purple-400 animate-spin shrink-0" />
            <span className="font-display text-xs font-semibold tracking-tight text-purple-600 uppercase">
              AI Drafting
            </span>
            <span className="ml-auto font-mono text-[10px] text-neutral-400">
              COSO 2013
            </span>
          </div>
          <div className="space-y-2.5">
            {COSO_STEPS.map((step, i) => {
              const done = i < generatingStep;
              const active = i === generatingStep;
              return (
                <div key={i} className={`flex items-start gap-2.5 transition-opacity duration-300 ${i > generatingStep ? 'opacity-30' : 'opacity-100'}`}>
                  <div className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                    done  ? 'border-purple-400 bg-purple-400' :
                    active ? 'border-purple-400 bg-white' :
                             'border-neutral-300 bg-white'
                  }`}>
                    {done && <Check className="h-2 w-2 text-white" />}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-display text-xs tracking-tight leading-snug ${active ? 'text-neutral-700' : done ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      {step.label}
                    </p>
                    <p className="font-mono text-[9px] text-neutral-400 mt-0.5 uppercase tracking-wider">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-400 transition-all duration-500"
              style={{ width: `${(generatingStep / (COSO_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {explState === 'editing' && (
        <div className="space-y-3">
          <textarea
            className="w-full font-display text-sm tracking-tight text-neutral-700 leading-relaxed border border-neutral-200 rounded-md px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 bg-neutral-50"
            rows={6}
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            placeholder="Write your explanation here…"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onEditCancel}
              className="font-body text-sm text-neutral-500 hover:text-neutral-700 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onEditSave(editText)}
              className="font-body text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {explState === 'visible' && (
        <div>
          {hasDraft && item.draftExplanation ? (
            <p className="font-display text-sm tracking-tight text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {item.draftExplanation}
            </p>
          ) : (
            <ul className="space-y-2">
              {item.aiExplanation.map((bullet, i) => (
                <li key={i} className="flex gap-3 font-display text-sm tracking-tight text-neutral-700 leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-300 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Audit stamp */}
          {explMeta && (
            <p className="mt-3 font-mono text-[10px] text-neutral-400 flex items-center gap-1.5">
              {explMeta.source === 'ai'
                ? <><span className="inline-flex items-center rounded bg-purple-50 px-1 py-0.5 text-purple-500 font-semibold">AI</span> Generated</>
                : <><span className="inline-flex items-center rounded bg-neutral-100 px-1 py-0.5 text-neutral-500 font-semibold">{explMeta.author}</span> Edited</>
              }
              <span className="text-neutral-300">·</span>
              {explMeta.at}
            </p>
          )}

          {/* Prior period */}
          {hasPrior && (
            <div className="mt-4 border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={() => setPriorOpen(v => !v)}
                className="flex items-center gap-1.5 font-body text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {priorOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                Prior period: {priorPeriodLabel}
              </button>
              {priorOpen && (
                <div className="mt-2 relative border-l-2 border-neutral-100 pl-3">
                  <p className="font-display text-sm tracking-tight text-neutral-400 leading-relaxed italic pr-8">
                    {item.priorPeriodExplanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPrior}
                    className="absolute top-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  });
}

function Avatar({ initials, color, src }: { initials: string; color: string; src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
      />
    );
  }
  return (
    <div
      className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-neutral-200"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ─── @mention renderer ────────────────────────────────────────────────────────

function renderWithMentions(text: string): React.ReactNode {
  const parts = text.split(/(@[A-Z][a-z]+ [A-Z][a-z]+)/g);
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="inline-flex items-center rounded bg-indigo-50 px-1 text-indigo-700">
        {part}
      </span>
    ) : part,
  );
}

// ─── Review Notes card ────────────────────────────────────────────────────────

interface NoteEntry {
  id: string;
  author: string;
  initials: string;
  color: string;
  src?: string;
  text: string;
  at: string;
}

const NOTES_BY_ITEM: Record<string, NoteEntry[]> = {
  'mis-sales': [
    {
      id: 'note-mis-sales-1',
      author: 'Brenda Song', initials: 'BS', color: '#6366f1', src: 'https://i.pravatar.cc/56?img=47',
      text: 'Can you confirm the Acme Corp renewal closed in March? Seeing +$28.4k and want to make sure it\'s not bleeding into April. @David Jung',
      at: '2026-03-17T14:22:00Z',
    },
    {
      id: 'note-mis-sales-2',
      author: 'David Jung', initials: 'DJ', color: '#0ea5e9', src: 'https://i.pravatar.cc/56?img=69',
      text: '@Brenda Song confirmed — JE-2026-0312 posted March 1. All three renewals are in period. Good to proceed.',
      at: '2026-03-18T09:05:00Z',
    },
  ],
  'mis-sales-merch': [
    {
      id: 'note-merch-1',
      author: 'Brenda Song', initials: 'BS', color: '#6366f1', src: 'https://i.pravatar.cc/56?img=47',
      text: 'Expected decline — Q4 clearance activity drove higher Feb numbers which didn\'t repeat. March is back to normalized run rate.',
      at: '2026-03-20T11:00:00Z',
    },
  ],
  'mis-sales-service': [],
  'gvc-payroll': [
    {
      id: 'note-pay-1',
      author: 'Brenda Song', initials: 'BS', color: '#6366f1', src: 'https://i.pravatar.cc/56?img=47',
      text: 'The 340 OT hours looks high compared to Q4. @David Jung can you break out year-end close vs. the product launch sprint? Want to call it out separately in the explanation.',
      at: '2026-04-02T10:15:00Z',
    },
    {
      id: 'note-pay-2',
      author: 'David Jung', initials: 'DJ', color: '#0ea5e9', src: 'https://i.pravatar.cc/56?img=69',
      text: '@Brenda Song split is ~180 hrs year-end close, ~160 hrs product launch. Both were pre-approved. I can pull the manager sign-offs if needed.',
      at: '2026-04-02T14:30:00Z',
    },
  ],
  'gvc-software': [
    {
      id: 'note-sw-1',
      author: 'Brenda Song', initials: 'BS', color: '#6366f1', src: 'https://i.pravatar.cc/56?img=47',
      text: 'Salesforce uplift was in the Q4 forecast. Snowflake and Wiz were both board-approved in December — PO-2026-0041 and PO-2026-0055 are attached.',
      at: '2026-04-05T09:00:00Z',
    },
  ],
  'gvc-prof-services': [],
};

function ReviewNotesCard({ item, initialNotes }: { item: VarianceItem; initialNotes: NoteEntry[] }) {
  const [expanded, setExpanded] = useState(true);
  const [notes, setNotes] = useState<NoteEntry[]>(initialNotes);
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        author: item.preparer.name,
        initials: item.preparer.initials,
        color: item.preparer.color,
        text: trimmed,
        at: new Date().toISOString(),
      },
    ]);
    setValue('');
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-display text-base tracking-tight text-neutral-900">
          Review Notes
          {notes.length > 0 && (
            <span className="font-mono text-sm font-normal text-neutral-400"> ({notes.length})</span>
          )}
        </span>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
          : <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
        }
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-6 py-5">
          {notes.length > 0 && (
            <div className="mb-5 space-y-5">
              {notes.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <Avatar initials={note.initials} color={note.color} src={note.src} />
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="font-body text-sm font-medium text-neutral-900">{note.author}</p>
                      <span className="font-mono text-xs text-neutral-400">{formatDateTime(note.at)}</span>
                    </div>
                    <p className="font-display text-sm tracking-tight leading-relaxed text-neutral-700">{renderWithMentions(note.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={notes.length > 0 ? 'border-t border-neutral-200 pt-5' : ''}>
            <div className="flex gap-3">
              <Avatar initials={item.preparer.initials} color={item.preparer.color} src={item.preparer.avatar} />
              <div className="flex flex-1 flex-col gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
                  placeholder="Add a review note…"
                  className="font-display rounded-md border border-neutral-300 px-3 py-2 text-sm tracking-tight placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={!value.trim()}
                  className="inline-flex h-8 items-center self-end rounded-md bg-white px-3 font-body text-sm font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-400"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Log card ────────────────────────────────────────────────────────

type ActivityKind = 'system' | 'human';
interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  at: string;
  author?: string;
  initials?: string;
  color?: string;
  src?: string;
  message: string;
  dotColor?: string;
}

const SEED_ACTIVITY: ActivityEntry[] = [
  {
    id: 'act-1',
    kind: 'system',
    at: '2026-03-01T08:00:00Z',
    message: 'Variance opened — Mar 2026 vs Feb 2026 (Month over Month)',
    dotColor: 'bg-blue-300',
  },
  {
    id: 'act-2',
    kind: 'system',
    at: '2026-03-14T10:30:00Z',
    message: 'AI explanation generated',
    dotColor: 'bg-purple-300',
  },
  {
    id: 'act-3',
    kind: 'human',
    at: '2026-03-17T14:20:00Z',
    author: 'Brenda Song',
    initials: 'BS',
    color: '#6366f1',
    src: 'https://i.pravatar.cc/56?img=47',
    message: 'Confirmed explanation with sales ops. Submitted for preparer review.',
  },
  {
    id: 'act-4',
    kind: 'system',
    at: '2026-03-17T14:22:00Z',
    message: 'Submitted for review',
    dotColor: 'bg-blue-300',
  },
  {
    id: 'act-5',
    kind: 'human',
    at: '2026-03-18T09:07:00Z',
    author: 'David Jung',
    initials: 'DJ',
    color: '#0ea5e9',
    src: 'https://i.pravatar.cc/56?img=69',
    message: 'Reviewed and approved. No downstream action required.',
  },
];

function ActivityLogCard({ entries }: { entries: ActivityEntry[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-display text-base tracking-tight text-neutral-900">
          Activity Log
          <span className="font-mono text-sm font-normal text-neutral-400"> ({entries.length})</span>
        </span>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
          : <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
        }
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-6 py-5">
          <ul className="space-y-5">
            {entries.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                {entry.kind === 'system' ? (
                  <div className={`ml-2 mt-[7px] h-2 w-2 shrink-0 rounded-full ${entry.dotColor}`} />
                ) : (
                  <Avatar initials={entry.initials!} color={entry.color!} src={entry.src} />
                )}
                <div className="min-w-0 flex-1">
                  {entry.kind === 'system' ? (
                    <>
                      <p className="font-display text-sm tracking-tight text-neutral-700">{entry.message}</p>
                      <span className="font-mono text-xs text-neutral-400">{formatDateTime(entry.at)}</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-body text-sm font-medium text-neutral-900">{entry.author}</span>
                        <span className="font-mono text-xs text-neutral-400">{formatDateTime(entry.at)}</span>
                      </div>
                      <p className="font-display text-sm tracking-tight leading-relaxed text-neutral-600">{entry.message}</p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Supporting Documents card ────────────────────────────────────────────────

interface SupportingDoc {
  id: string;
  name: string;
  ref: string;
  type: 'PDF' | 'XLSX' | 'Contract' | 'Report';
  uploadedBy: string;
  uploadedAt: string;
}

const DOCS_BY_ITEM: Record<string, SupportingDoc[]> = {
  'mis-sales': [
    { id: 'doc-mis-1', name: 'Acme Corp Multi-Year Enterprise Agreement', ref: 'MSA-2026-031', type: 'Contract', uploadedBy: 'Brenda Song', uploadedAt: '2026-03-02' },
    { id: 'doc-mis-2', name: 'Q1 Sales Pipeline Report — March Close', ref: 'RPT-2026-Q1-03', type: 'PDF', uploadedBy: 'David Jung', uploadedAt: '2026-03-18' },
  ],
  'mis-sales-merch': [
    { id: 'doc-merch-1', name: 'Q4 2025 Clearance Campaign Summary', ref: 'MKT-2025-Q4-CLR', type: 'PDF', uploadedBy: 'Brenda Song', uploadedAt: '2026-03-20' },
  ],
  'mis-sales-service': [
    { id: 'doc-svc-1', name: 'Pinnacle Financial — Implementation SOW', ref: 'SOW-2026-014', type: 'Contract', uploadedBy: 'Brenda Song', uploadedAt: '2026-03-08' },
    { id: 'doc-svc-2', name: 'NorthStar Logistics — Managed Service Agreement', ref: 'MSA-2026-028', type: 'Contract', uploadedBy: 'Brenda Song', uploadedAt: '2026-03-01' },
  ],
  'gvc-payroll': [
    { id: 'doc-pay-1', name: 'Q1 Overtime Authorization — Engineering & Finance', ref: 'HR-2026-OT-Q1', type: 'PDF', uploadedBy: 'David Jung', uploadedAt: '2026-04-02' },
  ],
  'gvc-software': [
    { id: 'doc-sw-1', name: 'Snowflake Data Analytics — Purchase Order', ref: 'PO-2026-0041', type: 'PDF', uploadedBy: 'Brenda Song', uploadedAt: '2026-01-15' },
    { id: 'doc-sw-2', name: 'Salesforce FY2026 Renewal Agreement', ref: 'VENDOR-SF-2026', type: 'Contract', uploadedBy: 'David Jung', uploadedAt: '2026-01-03' },
  ],
  'gvc-prof-services': [],
};

const DOC_TYPE_STYLES: Record<SupportingDoc['type'], { bg: string; color: string }> = {
  PDF:      { bg: '#fef2f2', color: '#b91c1c' },
  XLSX:     { bg: '#f0fdf4', color: '#15803d' },
  Contract: { bg: '#eff6ff', color: '#1d4ed8' },
  Report:   { bg: '#fefce8', color: '#a16207' },
};

function SupportingDocsCard({ item }: { item: VarianceItem }) {
  const [expanded, setExpanded] = useState(false);
  const docs = DOCS_BY_ITEM[item.id] ?? [];
  if (docs.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-display text-base tracking-tight text-neutral-900 flex items-center gap-2">
          Supporting Documents
          <Paperclip className="h-4 w-4 text-neutral-400 shrink-0" />
          {docs.length > 0 && (
            <span className="font-mono text-sm font-normal text-neutral-400"> ({docs.length})</span>
          )}
        </span>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
          : <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900" />
        }
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
          {docs.map((doc) => {
            const style = DOC_TYPE_STYLES[doc.type];
            return (
              <div key={doc.id} className="flex items-start gap-3 rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2.5 hover:bg-neutral-100 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm tracking-tight text-neutral-800 truncate leading-snug">{doc.name}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      {doc.type}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">{doc.ref}</span>
                    <span className="font-mono text-[10px] text-neutral-300">·</span>
                    <span className="font-display text-[10px] tracking-tight text-neutral-400">{doc.uploadedBy}</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-neutral-300 mt-0.5 shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Supporting Transactions card ─────────────────────────────────────────────

function SupportingTransactionsCard({ item }: { item: VarianceItem }) {
  const [expanded, setExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const txs = item.supportingTransactions ?? [];
  if (txs.length === 0) return null;

  const net = txs.reduce((sum, t) => sum + t.amount, 0);
  const isUp = net >= 0;

  return (
    <section className="mt-4 border-t border-neutral-200 pt-4">
      {drawerOpen && (
        <TransactionsDrawer
          open={drawerOpen}
          item={item}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      <div className="flex w-full items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group flex flex-1 items-center gap-2 min-w-0"
        >
          <h3 className="font-display text-base tracking-tight text-neutral-900 flex items-center gap-2">
            <Receipt className="h-4 w-4 text-neutral-400 shrink-0" />
            Transactions
            <span className="font-mono text-sm font-normal text-neutral-400">({txs.length})</span>
          </h3>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
            : <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700" />
          }
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-mono text-sm tabular-nums ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatDollar(net)} net
          </span>
          <div className="group relative">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <div className="whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 font-display text-[11px] font-medium tracking-tight text-white shadow-sm">
                Detailed transaction grid
              </div>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="rounded-lg border border-neutral-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Date</th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">JE #</th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Description</th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-right">Amount</th>
                <th className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Ref</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx, i) => {
                const up = tx.amount >= 0;
                return (
                  <tr
                    key={tx.id}
                    className={`border-b border-neutral-100 last:border-0 ${i % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}`}
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-500 whitespace-nowrap">
                      {tx.jeNumber}
                    </td>
                    <td className="px-3 py-2.5 font-display text-sm tracking-tight text-neutral-700">
                      {tx.description}
                    </td>
                    <td className={`px-3 py-2.5 font-mono text-sm tabular-nums text-right whitespace-nowrap ${up ? 'text-emerald-700' : 'text-red-600'}`}>
                      {formatDollar(tx.amount)}
                    </td>
                    <td className="px-3 py-2.5">
                      {tx.docRef ? (
                        <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 hover:bg-neutral-200 cursor-pointer transition-colors">
                          {tx.docRef}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ─── FocusPanel ───────────────────────────────────────────────────────────────

function nowStamp() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatSignOffDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

export function FocusPanel({ item, collection, onStatusChange }: Props) {
  const [explState, setExplState] = useState<ExplState>('blank');
  const [generatingStep, setGeneratingStep] = useState(0);
  const [editText, setEditText] = useState('');
  const [draft, setDraft] = useState('');
  const [trendsOpen, setTrendsOpen] = useState(false);
  const [explMeta, setExplMeta] = useState<ExplMeta | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(SEED_ACTIVITY);

  function pushActivity(entry: Omit<ActivityEntry, 'id'>) {
    setActivityLog(prev => [...prev, { ...entry, id: `act-${Date.now()}` }]);
  }

  useEffect(() => {
    setDraft(item?.draftExplanation ?? '');
    setExplState(item?.draftExplanation ? 'visible' : item?.aiExplanation ? 'blank' : 'blank');
    setEditText('');
    setExplMeta(item?.draftExplanation ? { source: 'manual', author: item.preparer.name, at: item.signedOffAt ?? nowStamp() } : null);
    setActivityLog(SEED_ACTIVITY);
  }, [item?.id]);

  if (!item || !collection) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 ring-8 ring-neutral-50 flex items-center justify-center">
          <FileText className="h-6 w-6 text-neutral-300" />
        </div>
        <p className="font-display text-sm tracking-tight leading-relaxed text-neutral-400 text-center max-w-[240px]">
          Select a material variance to review, accept, and sign-off.
        </p>
      </div>
    );
  }

  function handleDraftWithAI() {
    setGeneratingStep(0);
    setExplState('generating');
    setTimeout(() => setGeneratingStep(1), 600);
    setTimeout(() => setGeneratingStep(2), 1200);
    setTimeout(() => setGeneratingStep(3), 1900);
    setTimeout(() => setGeneratingStep(4), 2500);
    setTimeout(() => {
      setExplState('visible');
      setGeneratingStep(0);
      const stamp = nowStamp();
      setExplMeta({ source: 'ai', author: 'AI', at: stamp });
      pushActivity({ kind: 'system', at: new Date().toISOString(), message: `AI explanation generated · ${stamp}`, dotColor: 'bg-purple-300' });
    }, 3200);
  }

  function handleWriteManually() {
    setEditText('');
    setExplState('editing');
  }

  function handleEditStart() {
    setEditText(item!.draftExplanation ?? item!.aiExplanation.join('\n\n'));
    setExplState('editing');
  }

  function handleEditCancel() {
    setExplState(draft || item!.draftExplanation ? 'visible' : 'blank');
  }

  function handleEditSave(text: string) {
    setDraft(text);
    setExplState('visible');
    const stamp = nowStamp();
    setExplMeta({ source: 'manual', author: item!.preparer.name, at: stamp });
    pushActivity({ kind: 'human', at: new Date().toISOString(), author: item!.preparer.name, initials: item!.preparer.initials, color: item!.preparer.color, src: item!.preparer.avatar, message: `Edited explanation · ${stamp}` });
    onStatusChange(item!.id, 'in-progress', text);
  }

  function handleRegenerate() {
    setGeneratingStep(0);
    setExplState('generating');
    setTimeout(() => setGeneratingStep(1), 600);
    setTimeout(() => setGeneratingStep(2), 1200);
    setTimeout(() => setGeneratingStep(3), 1900);
    setTimeout(() => setGeneratingStep(4), 2500);
    setTimeout(() => {
      setExplState('visible');
      setGeneratingStep(0);
      const stamp = nowStamp();
      setExplMeta({ source: 'ai', author: 'AI', at: stamp });
      pushActivity({ kind: 'system', at: new Date().toISOString(), message: `AI explanation regenerated · ${stamp}`, dotColor: 'bg-purple-300' });
    }, 3200);
  }

  function handleSaveDraft() {
    onStatusChange(item.id, 'in-progress', draft || item.aiExplanation.join('\n\n'));
  }

  function handleSignOff() {
    onStatusChange(item.id, 'ready-for-review', draft || item.aiExplanation.join('\n\n'));
    pushActivity({ kind: 'human', at: new Date().toISOString(), author: item.preparer.name, initials: item.preparer.initials, color: item.preparer.color, src: item.preparer.avatar, message: `Signed off · ${nowStamp()}` });
  }

  function handleRecall() {
    onStatusChange(item.id, 'in-progress', item.draftExplanation);
    pushActivity({ kind: 'system', at: new Date().toISOString(), message: `Sign-off recalled · ${nowStamp()}`, dotColor: 'bg-amber-300' });
  }

  const isUp = item.changeAmount >= 0;
  const isSignedOff = item.status === 'signed-off' || item.status === 'ready-for-review';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
      {trendsOpen && collection && (
        <TrendsDrawer
          open={trendsOpen}
          item={item}
          collection={collection}
          onClose={() => setTrendsOpen(false)}
        />
      )}
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl flex flex-col gap-6 p-8">

          {/* Workflow trail — full width, above two-column layout */}
          <WorkflowHeader item={item} onSignOff={handleSignOff} onRecall={handleRecall} />

          {/* Two-column layout */}
          <div className="flex flex-col xl:flex-row items-start gap-6">

            {/* ── Main card ── */}
            <article className="w-full min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white p-8">

              {/* Card header: account name + actions */}
              <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="font-display text-xl font-normal tracking-tight text-neutral-900">
                    {item.accountName}
                  </span>
                  <span className="ml-2 font-display font-normal tracking-tight text-neutral-400 text-base">
                    · {item.accountNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isSignedOff && (
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={explState !== 'visible'}
                      className="inline-flex items-center rounded-lg border border-transparent px-4 py-2.5 font-body text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Save Draft
                    </button>
                  )}
                  <div className="flex flex-col items-end gap-1">
                    <SignOffToggle
                      signedOff={isSignedOff}
                      disabled={explState === 'editing'}
                      onSignOff={handleSignOff}
                      onReopen={handleRecall}
                    />
                    {isSignedOff && item.signedOffAt && (
                      <span className="font-mono text-[10px] leading-none text-neutral-400">
                        {item.signedOffAt}
                      </span>
                    )}
                  </div>
                </div>
              </header>

              {/* Numbers */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {collection.priorPeriod}
                    </p>
                    <p className="mt-1 font-mono text-xl tabular-nums text-neutral-900">
                      {formatDollarFull(item.priorAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {collection.currentPeriod}
                    </p>
                    <p className="mt-1 font-mono text-xl tabular-nums text-neutral-900">
                      {formatDollarFull(item.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Change
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`font-mono text-xl tabular-nums ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
                        {formatDollar(item.changeAmount)}
                      </span>
                      <span className={`font-mono text-sm tabular-nums ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                        {formatPercent(item.changePercent)}
                      </span>
                      <div className="group relative">
                        <button
                          type="button"
                          onClick={() => setTrendsOpen(true)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          <div className="whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 font-display text-[11px] font-medium tracking-tight text-white shadow-sm">
                            Trends
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Explanation */}
              <ExplanationCard
                item={item}
                explState={explState}
                generatingStep={generatingStep}
                editText={editText}
                explMeta={explMeta}
                priorPeriodLabel={collection.priorPeriod}
                onDraftWithAI={handleDraftWithAI}
                onWriteManually={handleWriteManually}
                onEditStart={handleEditStart}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditTextChange={setEditText}
                onRegenerate={handleRegenerate}
              />

              {/* Supporting Transactions */}
              <SupportingTransactionsCard item={item} />
            </article>

            {/* ── Right sidebar ── */}
            <aside className="w-full shrink-0 space-y-6 xl:w-[300px]">
              <ReviewNotesCard key={item.id} item={item} initialNotes={NOTES_BY_ITEM[item.id] ?? []} />
              <SupportingDocsCard key={`docs-${item.id}`} item={item} />
              <ActivityLogCard entries={activityLog} />
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
