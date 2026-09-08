import React, { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronRight, RotateCcw, Sparkles, AlertTriangle,
  Clock, CheckCircle, FileText, ListTodo, TrendingUp, Check, X,
  Edit3, Building2, BookOpen, BarChart2, Layers, Home, Settings,
  Bell, ArrowUpRight, ChevronUp,
  Upload, Tag, Filter, Users, Calculator, ClipboardCheck, ChevronLeft, Pencil,
} from 'lucide-react';

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function fmt$(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pct(n: number): string {
  return `${n > 0 ? '+' : ''}${n}%`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'accrual' | 'anomaly' | 'variance' | 'approval' | 'exception' | 'task';
type AccrualKind = 'reversal' | 'predicted' | 'variance-flagged' | 'provision';
type Severity = 'high' | 'medium' | 'low';

interface AgingBucket { label: string; ar: number; rate: number; provision: number; }
interface OverrideCustomer { name: string; reason: string; amount: number; override: 'full' | 'specific' | 'exclude'; rate?: number; }
interface JEPreviewLine { type: 'dr' | 'cr'; account: string; amount: number; }

interface AccrualItem {
  id: string; category: 'accrual'; resolved: boolean;
  kind: AccrualKind;
  title: string;
  account: string;
  accountCode: string;
  amount: number;
  entity: string;
  accrualDate?: string;
  originalEntry?: { dr: string; cr: string; amount: number };
  historicalAmounts?: number[];
  historicalLabels?: string[];
  typicalAmount?: number;
  journalEntry?: JEPreviewLine[];
  // provision-specific
  priorAmount?: number;
  overrideCount?: number;
  agingBuckets?: AgingBucket[];
  overrideCustomers?: OverrideCustomer[];
}

interface AnomalyItem {
  id: string; category: 'anomaly'; resolved: boolean;
  txnId: string; date: string; amount: number;
  entity: string; account: string;
  severity: Severity; flagReason: string; vendor: string;
}

interface VarianceItem {
  id: string; category: 'variance'; resolved: boolean;
  account: string;
  actual: number; compareTo: number;
  compareLabel: string; pctChange: number;
  period: string;
  accountCode: string;
}

interface AgentFlag {
  label: string;
  detail: string;
  line?: string;
}

interface GlImpact {
  label: string;
  amount: number;
  direction: 'increase' | 'decrease';
}

interface AgentFinding {
  riskScore: number;
  glImpacts: GlImpact[];
  flags: AgentFlag[];
  passedChecks: string[];
}

interface ApprovalItem {
  id: string; category: 'approval'; resolved: boolean;
  type: 'je' | 'rec' | 'task';
  title: string; submittedBy: string;
  entryCount: number; amount: number; submittedAgo: string;
  agentFinding?: AgentFinding;
}

interface ExceptionItem {
  id: string; category: 'exception'; resolved: boolean;
  title: string; count: number; amount: number; note: string;
  source: string;
}

interface TaskItem {
  id: string; category: 'task'; resolved: boolean;
  title: string; module: string;
  dueStatus: 'overdue' | 'today';
  timeNote: string;
  blocks?: string[];
}

type InboxItem = AccrualItem | AnomalyItem | VarianceItem | ApprovalItem | ExceptionItem | TaskItem;
type ViewMode = 'product' | 'priority' | 'action' | 'unified';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SEED_ITEMS: InboxItem[] = [
  // — Accruals
  {
    id: 'acr-1', category: 'accrual', resolved: false,
    kind: 'reversal',
    title: 'March Professional Services',
    account: 'Accrued Liabilities', accountCode: '2050',
    amount: 42500, entity: 'FloQast Inc.',
    accrualDate: '3/31/2026',
    originalEntry: { dr: '6420 Professional Fees', cr: '2050 Accrued Liabilities', amount: 42500 },
    journalEntry: [
      { type: 'dr', account: '2050 Accrued Liabilities', amount: 42500 },
      { type: 'cr', account: '6420 Professional Fees', amount: 42500 },
    ],
  },
  {
    id: 'acr-2', category: 'accrual', resolved: false,
    kind: 'predicted',
    title: 'IT Services & Software',
    account: '6310 IT & Software', accountCode: '6310',
    amount: 8200, entity: 'FloQast Inc.',
    historicalAmounts: [8100, 7950, 8400, 8000, 8300],
    historicalLabels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    journalEntry: [
      { type: 'dr', account: '6310 IT & Software', amount: 8200 },
      { type: 'cr', account: '2010 Accrued Liabilities', amount: 8200 },
    ],
  },
  {
    id: 'acr-3', category: 'accrual', resolved: false,
    kind: 'predicted',
    title: 'Office Rent — HQ',
    account: '6100 Rent Expense', accountCode: '6100',
    amount: 45000, entity: 'FloQast Inc.',
    historicalAmounts: [45000, 45000, 45000, 45000, 45000],
    historicalLabels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    journalEntry: [
      { type: 'dr', account: '6100 Rent Expense', amount: 45000 },
      { type: 'cr', account: '2010 Accrued Liabilities', amount: 45000 },
    ],
  },
  {
    id: 'acr-4', category: 'accrual', resolved: false,
    kind: 'variance-flagged',
    title: 'Marketing Agency Retainer',
    account: '6530 Marketing', accountCode: '6530',
    amount: 85000, entity: 'FloQast Inc.',
    typicalAmount: 42500,
    journalEntry: [
      { type: 'dr', account: '6530 Marketing Expense', amount: 85000 },
      { type: 'cr', account: '2010 Accrued Liabilities', amount: 85000 },
    ],
  },
  {
    id: 'acr-5', category: 'accrual', resolved: false,
    kind: 'provision',
    title: 'Bad Debt (AFDA) Provision',
    account: '1299 Allowance for Doubtful Accounts', accountCode: '1299',
    amount: 234800, entity: 'FloQast Inc.',
    priorAmount: 198400,
    overrideCount: 2,
    journalEntry: [
      { type: 'dr', account: '7210 Bad Debt Expense', amount: 234800 },
      { type: 'cr', account: '1299 Allowance for Doubtful Accounts', amount: 234800 },
    ],
    agingBuckets: [
      { label: 'Current',  ar: 2840000, rate: 1,  provision: 28400  },
      { label: '31–60',    ar: 680000,  rate: 5,  provision: 34000  },
      { label: '61–90',    ar: 320000,  rate: 15, provision: 48000  },
      { label: '91–120',   ar: 110000,  rate: 40, provision: 44000  },
      { label: '120+',     ar: 80000,   rate: 80, provision: 64000  },
    ],
    overrideCustomers: [
      { name: 'Meridian Healthcare', reason: 'Chapter 11 filing — litigation hold', amount: 45000, override: 'full' },
      { name: 'TechStart Ltd.', reason: 'Negotiated payment plan — 50% recovery expected', amount: 12800, override: 'specific', rate: 50 },
    ],
  },

  // — Anomalies
  {
    id: 'anm-1', category: 'anomaly', resolved: false,
    txnId: 'TXN-4821', date: '3/28/2026', amount: 124500,
    entity: 'FloQast Inc.', account: '6420 Professional Fees',
    severity: 'high', flagReason: 'Amount 4× typical for this vendor',
    vendor: 'Acme Consulting LLC',
  },
  {
    id: 'anm-2', category: 'anomaly', resolved: false,
    txnId: 'TXN-4792', date: '3/29/2026', amount: 8200,
    entity: 'FloQast Inc.', account: '6310 IT & Software',
    severity: 'medium', flagReason: 'Transaction posted on weekend',
    vendor: 'Stripe Inc.',
  },
  {
    id: 'anm-3', category: 'anomaly', resolved: false,
    txnId: 'TXN-4756', date: '3/27/2026', amount: 3450,
    entity: 'FloQast Canada Ltd.', account: '6200 Office Supplies',
    severity: 'low', flagReason: 'Duplicate vendor payment pattern',
    vendor: 'Office Depot',
  },

  // — Variances
  {
    id: 'var-1', category: 'variance', resolved: false,
    account: 'Travel & Entertainment',
    accountCode: '6810',
    actual: 124000, compareTo: 89000,
    compareLabel: 'YTD Budget', pctChange: 39,
    period: 'Q1 2026',
  },
  {
    id: 'var-2', category: 'variance', resolved: false,
    account: 'Consulting Fees',
    accountCode: '6420',
    actual: 215000, compareTo: 180000,
    compareLabel: 'Prior Year', pctChange: 19,
    period: 'Q1 2026',
  },

  // — Approvals
  {
    id: 'apr-1', category: 'approval', resolved: false,
    type: 'je', title: 'March Close JE Batch',
    submittedBy: 'Sarah Chen',
    entryCount: 4, amount: 127000, submittedAgo: '2 hrs ago',
    agentFinding: {
      riskScore: 72,
      glImpacts: [
        { label: 'Liabilities', amount: 42500, direction: 'increase' },
        { label: 'Expenses', amount: 42500, direction: 'increase' },
      ],
      flags: [
        {
          label: 'Variance Warning',
          line: 'Line 3 · 6420 Professional Fees',
          detail: '$42,500 is 900% above the 3-month average of $4,250 for this account. Possible input error — confirm extra zero.',
        },
        {
          label: 'Missing Reversal Date',
          line: 'Line 3–4',
          detail: 'Entry credits Accrued Liabilities. This appears to be an accrual but no reversal date is set. A reversal date is required to prevent overstatement next period.',
        },
      ],
      passedChecks: [
        'No duplicate entries detected',
        'All dimension fields present',
        'Account–cost center combinations valid',
        'Subledger integrity verified',
      ],
    },
  },
  {
    id: 'apr-2', category: 'approval', resolved: false,
    type: 'rec', title: 'Corporate Checking Rec',
    submittedBy: 'Marcus Torres',
    entryCount: 1, amount: 284500, submittedAgo: '4 hrs ago',
    agentFinding: {
      riskScore: 14,
      glImpacts: [],
      flags: [],
      passedChecks: [
        'Balance matches bank statement',
        'No unmatched transactions',
        'No prior-period adjustments detected',
        'Prepared within normal business hours',
        'Preparer is authorized for this account',
      ],
    },
  },
  {
    id: 'apr-3', category: 'approval', resolved: false,
    type: 'je', title: 'Q1 Expense Accrual Package',
    submittedBy: 'Sarah Chen',
    entryCount: 12, amount: 312000, submittedAgo: '1 hr ago',
    agentFinding: {
      riskScore: 87,
      glImpacts: [
        { label: 'Liabilities', amount: 312000, direction: 'increase' },
        { label: 'Expenses', amount: 312000, direction: 'increase' },
      ],
      flags: [
        {
          label: 'Duplicate Detected',
          line: 'JE-2831',
          detail: 'Entry matches JE-2831 posted on 3/28/2026 — same accounts, same amount, same memo. If intentional, add a note to distinguish.',
        },
        {
          label: 'GL / Segment Mismatch',
          line: 'Line 7 · 6000 Marketing',
          detail: "Cost center 'Engineering' used with account '6000 Marketing'. This combination has not appeared in the last 3 months. Verify the cost center assignment.",
        },
        {
          label: 'Missing Reversal Date',
          line: 'Lines 3, 7, 11',
          detail: '3 of 12 entries credit Accrued Liabilities but have no reversal date set. Liabilities may be overstated in the following period.',
        },
      ],
      passedChecks: [
        'All dimension fields present',
        'Subledger integrity verified',
        'No subledger violations detected',
      ],
    },
  },

  // — Exceptions
  {
    id: 'exc-1', category: 'exception', resolved: false,
    title: 'Chase Corporate Card',
    count: 3, amount: 4230,
    note: '3 unmatched transactions since 3/28',
    source: 'Recs Matching',
  },
  {
    id: 'exc-2', category: 'exception', resolved: false,
    title: 'Intercompany: FQ Canada ↔ FQ US',
    count: 1, amount: 18500,
    note: 'Elimination entry difference',
    source: 'Intercompany',
  },

  // — Tasks
  {
    id: 'tsk-1', category: 'task', resolved: false,
    title: 'Post monthly depreciation JE',
    module: 'Close Management',
    dueStatus: 'today', timeNote: '2 hrs remaining',
    blocks: ['Submit financial close package', 'Controller sign-off'],
  },
  {
    id: 'tsk-2', category: 'task', resolved: false,
    title: 'Submit financial close package',
    module: 'Close Management',
    dueStatus: 'overdue', timeNote: '30 min overdue',
    blocks: ['Controller review', 'External audit package'],
  },
  {
    id: 'tsk-3', category: 'task', resolved: false,
    title: 'Review Wells Fargo bank rec',
    module: 'Reconciliations',
    dueStatus: 'today', timeNote: '4 hrs remaining',
    blocks: ['Q1 cash position report'],
  },
];

const SECTIONS: { id: Category; label: string; source: string }[] = [
  { id: 'accrual',   label: 'Accruals',             source: 'Accruals' },
  { id: 'anomaly',   label: 'Anomalies',             source: 'Detect' },
  { id: 'variance',  label: 'Variances to Explain',  source: 'Flux' },
  { id: 'approval',  label: 'Approvals',             source: 'JE · Recs' },
  { id: 'exception', label: 'Exceptions',            source: 'Recs Matching' },
  { id: 'task',      label: 'Close Actions',          source: 'Close Mgmt' },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, labels, color = '#1fac76' }: {
  data: number[]; labels?: string[]; color?: string;
}) {
  const W = 200; const H = 48; const pad = 4;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y] as [number, number];
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      ))}
      {/* Projected point with dashed line */}
      <line x1={last[0]} y1={last[1]} x2={W - pad} y2={last[1]}
        stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      <circle cx={W - pad} cy={last[1]} r="3" fill="white"
        stroke={color} strokeWidth="1.5" />
      <text x={W - pad} y={last[1] - 6} textAnchor="middle"
        fontSize="8" fill={color} fontFamily="JetBrains Mono, monospace">?</text>
      {labels && labels.map((l, i) => {
        const x = pad + (i / (data.length - 1)) * (W - pad * 2);
        return (
          <text key={i} x={x} y={H} textAnchor="middle"
            fontSize="7" fill="#adb2bb" fontFamily="JetBrains Mono, monospace">{l}</text>
        );
      })}
    </svg>
  );
}

// ─── Side Nav ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: Home,       label: 'Home' },
  { icon: CheckCircle,label: 'Close' },
  { icon: FileText,   label: 'Journal Entries' },
  { icon: BookOpen,   label: 'Reconciliations' },
  { icon: BarChart2,  label: 'Reporting' },
  { icon: Layers,     label: 'Transform' },
  { icon: Building2,  label: 'Compliance' },
];

function SideNav() {
  return (
    <div className="flex flex-col items-center w-14 shrink-0 border-r border-[#e1e6ef] bg-white h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center w-full h-14 border-b border-[#e1e6ef]">
        <div className="w-7 h-7 rounded-lg bg-[#1fac76] flex items-center justify-center">
          <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-display)' }}>F</span>
        </div>
      </div>

      {/* Inbox — active */}
      <div className="relative flex items-center justify-center w-full h-11 mt-1 group cursor-pointer">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ecfff8]">
          <Bell size={16} className="text-[#1fac76]" />
        </div>
        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-[#d4183d] flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">18</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5 mt-2 w-full px-2.5">
        {NAV_ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} title={label}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6b7280] hover:text-[#1d2433] hover:bg-[#f5f6f8] cursor-pointer transition-colors">
            <Icon size={16} />
          </div>
        ))}
      </div>

      <div className="mt-auto pb-3 flex flex-col items-center gap-0.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6b7280] hover:text-[#1d2433] hover:bg-[#f5f6f8] cursor-pointer">
          <Settings size={15} />
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1fac76]/20 flex items-center justify-center cursor-pointer">
          <span className="text-[#1c895f] text-xs font-semibold">GJ</span>
        </div>
      </div>
    </div>
  );
}

// ─── Severity badge ───────────────────────────────────────────────────────────

function SeverityBadge({ s }: { s: Severity }) {
  const cfg = {
    high:   'bg-[#fff1f4] text-[#d4183d]',
    medium: 'bg-[#fff8eb] text-[#db7712]',
    low:    'bg-[#f5f6f8] text-[#6b7280]',
  };
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', cfg[s])}>
      {s}
    </span>
  );
}

// ─── Kind badge (accrual type) ────────────────────────────────────────────────

function KindBadge({ kind }: { kind: AccrualKind }) {
  if (kind === 'reversal') return (
    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-700">
      <RotateCcw size={9} /> Reversal due
    </span>
  );
  if (kind === 'predicted') return (
    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#f5f0ff] text-[#7c3aed]">
      <Sparkles size={9} /> AI predicted
    </span>
  );
  if (kind === 'provision') return (
    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#f0f9ff] text-[#0369a1]">
      <Sparkles size={9} /> AI provision
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[#fff8eb] text-[#db7712]">
      <AlertTriangle size={9} /> Variance flagged
    </span>
  );
}

// ─── AI Reasoning Block ───────────────────────────────────────────────────────

function AIReasoningBlock({ checks, flags }: { checks: string[]; flags?: string[] }) {
  return (
    <div className="rounded-lg border border-[#e1e6ef] mb-5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f6f8] border-b border-[#e1e6ef]">
        <Sparkles size={12} className="text-[#7c3aed]" />
        <span className="text-xs font-semibold text-[#424867]">What AI checked</span>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {flags && flags.map((flag, i) => (
          <div key={`flag-${i}`} className="flex items-start gap-2">
            <AlertTriangle size={11} className="text-[#db7712] shrink-0 mt-0.5" />
            <span className="text-xs text-[#db7712]">{flag}</span>
          </div>
        ))}
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle size={11} className="text-[#1fac76] shrink-0" />
            <span className="text-xs text-[#6b7280]">{check}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inbox Cards ──────────────────────────────────────────────────────────────

function AgingMiniBar({ buckets }: { buckets: AgingBucket[] }) {
  const totalAr = buckets.reduce((s, b) => s + b.ar, 0);
  const colors = ['#1fac76', '#86efac', '#fbbf24', '#f97316', '#ef4444'];
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden gap-px mt-1.5">
      {buckets.map((b, i) => (
        <div key={i} className="h-full rounded-sm" style={{ width: `${(b.ar / totalAr) * 100}%`, background: colors[i] }} title={`${b.label}: ${fmt$(b.ar)}`} />
      ))}
    </div>
  );
}

function AccrualCard({ item, selected, onClick }: { item: AccrualItem; selected: boolean; onClick: () => void }) {
  const momChange = item.priorAmount ? item.amount - item.priorAmount : null;

  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-[#1d2433] font-medium leading-snug truncate">{item.title}</span>
        <span className="shrink-0 font-mono text-sm text-[#1d2433]">{fmt$(item.amount)}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-[#6b7280] truncate">{item.accountCode} · {item.entity}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.overrideCount != null && item.overrideCount > 0 && (
            <span className="text-[10px] font-semibold bg-[#fff8eb] text-[#db7712] rounded px-1.5 py-0.5">
              ⚠ {item.overrideCount} override{item.overrideCount !== 1 ? 's' : ''}
            </span>
          )}
          <KindBadge kind={item.kind} />
        </div>
      </div>
      {item.kind === 'provision' && item.agingBuckets && (
        <>
          <AgingMiniBar buckets={item.agingBuckets} />
          {momChange !== null && (
            <div className={cn('text-[10px] mt-1', momChange > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>
              {momChange > 0 ? '↑' : '↓'} {fmt$(Math.abs(momChange))} vs prior period
            </div>
          )}
        </>
      )}
    </button>
  );
}

function AnomalyCard({ item, selected, onClick }: { item: AnomalyItem; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono text-[#6b7280]">{item.txnId} · {item.date}</span>
        <span className="shrink-0 font-mono text-sm text-[#1d2433]">{fmt$(item.amount)}</span>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs text-[#6b7280] truncate">{item.entity} · {item.account}</span>
        <SeverityBadge s={item.severity} />
      </div>
      <div className="mt-1 text-xs text-[#6b7280]">{item.flagReason}</div>
    </button>
  );
}

function VarianceCard({ item, selected, onClick }: { item: VarianceItem; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-[#1d2433] font-medium leading-snug truncate">{item.account}</span>
        <span className={cn('shrink-0 text-xs font-semibold', item.pctChange > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>
          {pct(item.pctChange)}
        </span>
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-[#6b7280]">
        <TrendingUp size={11} className="text-[#db7712]" />
        <span>Actual {fmt$(item.actual)} vs {item.compareLabel} {fmt$(item.compareTo)}</span>
      </div>
    </button>
  );
}

function RiskBadge({ score }: { score: number }) {
  const cfg = score >= 75
    ? { bg: 'bg-[#fff1f4]', text: 'text-[#d4183d]' }
    : score >= 30
    ? { bg: 'bg-[#fff8eb]', text: 'text-[#db7712]' }
    : { bg: 'bg-[#ecfff8]', text: 'text-[#1c895f]' };
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums', cfg.bg, cfg.text)}>
      {score}
    </span>
  );
}

function ApprovalCard({ item, selected, onClick }: { item: ApprovalItem; selected: boolean; onClick: () => void }) {
  const typeLabel = item.type === 'je' ? 'Journal Entry' : item.type === 'rec' ? 'Reconciliation' : 'Task';
  const flagCount = item.agentFinding?.flags.length ?? 0;
  const riskScore = item.agentFinding?.riskScore;
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-[#1d2433] font-medium leading-snug truncate">{item.title}</span>
        <span className="shrink-0 font-mono text-sm text-[#1d2433]">{fmt$(item.amount)}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-[#6b7280]">{typeLabel} · {item.submittedBy} · {item.submittedAgo}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {flagCount > 0 && (
            <span className="text-[10px] text-[#db7712] font-semibold">
              ⚠ {flagCount}
            </span>
          )}
          {riskScore !== undefined && <RiskBadge score={riskScore} />}
        </div>
      </div>
    </button>
  );
}

function ExceptionCard({ item, selected, onClick }: { item: ExceptionItem; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-[#1d2433] font-medium leading-snug truncate">{item.title}</span>
        <span className="shrink-0 font-mono text-sm text-[#d4183d]">{fmt$(item.amount)}</span>
      </div>
      <div className="mt-1 text-xs text-[#6b7280]">{item.note}</div>
    </button>
  );
}

function TaskCard({ item, selected, onClick }: { item: TaskItem; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-[#1d2433] font-medium leading-snug">{item.title}</span>
        {item.dueStatus === 'overdue'
          ? <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-[#fff1f4] text-[#d4183d] rounded px-1.5 py-0.5">Overdue</span>
          : <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-[#fff8eb] text-[#db7712] rounded px-1.5 py-0.5">Today</span>
        }
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-[#6b7280]">
        <Clock size={11} />
        <span>{item.module} · {item.timeNote}</span>
      </div>
    </button>
  );
}

// ─── Blocking close helpers ───────────────────────────────────────────────────

function isBlockingClose(item: InboxItem): boolean {
  if (item.resolved) return false;
  if (item.category === 'task') {
    const t = item as TaskItem;
    return t.dueStatus === 'overdue' ||
      (t.blocks ?? []).some(b => b.toLowerCase().includes('controller'));
  }
  if (item.category === 'approval') return ((item as ApprovalItem).agentFinding?.riskScore ?? 0) >= 75;
  if (item.category === 'accrual') return (item as AccrualItem).kind === 'provision';
  if (item.category === 'exception') return (item as ExceptionItem).amount >= 10000;
  if (item.category === 'anomaly') return (item as AnomalyItem).severity === 'high';
  return false;
}

function getBlockingReason(item: InboxItem): string {
  if (item.category === 'task') {
    const t = item as TaskItem;
    if (t.dueStatus === 'overdue') return `Overdue — blocking ${(t.blocks ?? ['close'])[0]}`;
    const b = (t.blocks ?? []).find(x => x.toLowerCase().includes('controller'));
    if (b) return `Blocks ${b}`;
    return 'Blocking close';
  }
  if (item.category === 'approval')
    return `Risk score ${(item as ApprovalItem).agentFinding?.riskScore} — flagged for review`;
  if (item.category === 'accrual') return 'Balance sheet provision — sign-off required';
  if (item.category === 'exception') return 'Unresolved rec exception';
  if (item.category === 'anomaly') return 'High-severity — unreviewed';
  return 'Blocking close';
}

// ─── InboxSection ─────────────────────────────────────────────────────────────

function InboxSection({
  id, label, source, items, selectedId, onSelect, defaultOpen = true, blockingIds,
}: {
  id: Category; label: string; source: string;
  items: InboxItem[]; selectedId: string | null;
  onSelect: (id: string) => void; defaultOpen?: boolean;
  blockingIds?: Set<string>;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const activeCount = items.filter(i => !i.resolved).length;
  if (items.length === 0) return null;

  const sectionColor: Record<Category, string> = {
    accrual:   'text-[#7c3aed]',
    anomaly:   'text-[#d4183d]',
    variance:  'text-[#db7712]',
    approval:  'text-[#2563eb]',
    exception: 'text-[#d4183d]',
    task:      'text-[#db7712]',
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#f5f6f8] transition-colors group">
        <div className="flex items-center gap-2">
          {open
            ? <ChevronDown size={12} className="text-[#adb2bb]" />
            : <ChevronRight size={12} className="text-[#adb2bb]" />}
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6b7280]">{label}</span>
          <span className="text-[10px] text-[#adb2bb]">{source}</span>
        </div>
        {activeCount > 0 && (
          <span className={cn('text-xs font-semibold tabular-nums', sectionColor[id])}>{activeCount}</span>
        )}
      </button>

      {open && (
        <div>
          {items.map(item => {
            const sel = item.id === selectedId;
            const isBlocking = blockingIds?.has(item.id);
            let cardEl: React.ReactNode = null;
            if (item.category === 'accrual')
              cardEl = <AccrualCard   item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            else if (item.category === 'anomaly')
              cardEl = <AnomalyCard   item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            else if (item.category === 'variance')
              cardEl = <VarianceCard  item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            else if (item.category === 'approval')
              cardEl = <ApprovalCard  item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            else if (item.category === 'exception')
              cardEl = <ExceptionCard item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            else if (item.category === 'task')
              cardEl = <TaskCard      item={item} selected={sel} onClick={() => onSelect(item.id)} />;
            if (!cardEl) return null;
            return (
              <div key={item.id} className="relative">
                {isBlocking && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4183d] z-10" />}
                {cardEl}
                {isBlocking && (
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#fff8eb] border-t border-[#fcd34d]">
                    <AlertTriangle size={9} className="text-[#db7712] shrink-0" />
                    <span className="text-[10px] font-medium text-[#db7712]">{getBlockingReason(item)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Daily Digest (calculated from inbox state) ────────────────────────────────

function DailyDigest({ items }: { items: InboxItem[] }) {
  const daysRemaining = 2; // Day 3 of ~5 day close
  const blockingItems = items.filter(isBlockingClose);
  const highRiskApprovals = items.filter(i =>
    i.category === 'approval' && ((i as ApprovalItem).agentFinding?.riskScore ?? 0) >= 75
  );
  const overdueTasks = items.filter(i =>
    i.category === 'task' && (i as TaskItem).dueStatus === 'overdue'
  );

  // Calculate top issue types
  const issueCounts = items.reduce((acc, item) => {
    if (isBlockingClose(item)) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topIssues = Object.entries(issueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([cat]) => cat);

  // Health status
  let health: 'on-track' | 'attention' | 'critical';
  if (blockingItems.length === 0 && highRiskApprovals.length === 0) {
    health = 'on-track';
  } else if (blockingItems.length <= 2 && highRiskApprovals.length <= 1) {
    health = 'attention';
  } else {
    health = 'critical';
  }

  const healthConfig = {
    'on-track': { bg: 'bg-[#ecfff8]', text: 'text-[#1fac76]', label: 'On track' },
    'attention': { bg: 'bg-[#fff8eb]', text: 'text-[#db7712]', label: 'Attention needed' },
    'critical': { bg: 'bg-[#fff1f4]', text: 'text-[#d4183d]', label: 'Behind schedule' },
  };

  const cfg = healthConfig[health];

  return (
    <div className={cn('mx-3 mt-2 mb-3 rounded-lg border overflow-hidden', cfg.bg)}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className={cn('text-xs font-semibold', cfg.text)}>{cfg.label}</div>
            <div className="text-sm font-medium text-[#1d2433] mt-0.5">{daysRemaining} days to close</div>
          </div>
          <div className={cn('text-xs font-bold', cfg.text)}>
            {blockingItems.length} blocking
          </div>
        </div>
        {(highRiskApprovals.length > 0 || overdueTasks.length > 0) && (
          <div className="flex items-center gap-3 text-[10px] text-[#6b7280] mt-2 pt-2 border-t" style={{ borderColor: cfg.bg }}>
            {highRiskApprovals.length > 0 && (
              <span>{highRiskApprovals.length} high-risk approval{highRiskApprovals.length !== 1 ? 's' : ''}</span>
            )}
            {overdueTasks.length > 0 && (
              <span>{overdueTasks.length} overdue</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── View-mode helpers ────────────────────────────────────────────────────────

const PRODUCT_CHIP: Record<Category, { label: string }> = {
  accrual:   { label: 'Accruals' },
  anomaly:   { label: 'Detect' },
  variance:  { label: 'Flux' },
  approval:  { label: 'JE · Recs' },
  exception: { label: 'Recs' },
  task:      { label: 'Close' },
};

function getActionGroup(item: InboxItem): 'decide' | 'approve' | 'do' {
  if (item.category === 'task') return 'do';
  if (item.category === 'variance') return 'do';
  if (item.category === 'anomaly') return 'decide';
  if (item.category === 'exception') return 'decide';
  if (item.category === 'accrual')
    return (item as AccrualItem).kind === 'variance-flagged' ? 'decide' : 'approve';
  if (item.category === 'approval')
    return ((item as ApprovalItem).agentFinding?.riskScore ?? 0) >= 75 ? 'decide' : 'approve';
  return 'approve';
}

function getPriorityGroup(item: InboxItem): 'critical' | 'attention' | 'normal' {
  if (isBlockingClose(item)) return 'critical';
  if (item.category === 'anomaly' && (item as AnomalyItem).severity !== 'low') return 'attention';
  if (item.category === 'approval' && ((item as ApprovalItem).agentFinding?.riskScore ?? 0) >= 30) return 'attention';
  if (item.category === 'task') return 'attention';
  if (item.category === 'accrual' && (item as AccrualItem).kind === 'variance-flagged') return 'attention';
  return 'normal';
}

// ─── Normalized Inbox Card ────────────────────────────────────────────────────

function InboxCard({ item, selected, onClick, isBlocking }: {
  item: InboxItem; selected: boolean; onClick: () => void; isBlocking?: boolean;
}) {
  const chip = PRODUCT_CHIP[item.category];

  const getTitle = (): string => {
    if (item.category === 'accrual')   return (item as AccrualItem).title;
    if (item.category === 'anomaly')   return (item as AnomalyItem).vendor;
    if (item.category === 'variance')  return (item as VarianceItem).account;
    if (item.category === 'approval')  return (item as ApprovalItem).title;
    if (item.category === 'exception') return (item as ExceptionItem).title;
    if (item.category === 'task')      return (item as TaskItem).title;
    return '';
  };

  const getAmount = (): number | null => {
    if (item.category === 'accrual')   return (item as AccrualItem).amount;
    if (item.category === 'anomaly')   return (item as AnomalyItem).amount;
    if (item.category === 'approval')  return (item as ApprovalItem).amount;
    if (item.category === 'exception') return (item as ExceptionItem).amount;
    return null;
  };

  const getMeta = (): string => {
    if (item.category === 'accrual') {
      const a = item as AccrualItem;
      return `${a.accountCode} · ${a.entity}`;
    }
    if (item.category === 'anomaly') {
      const a = item as AnomalyItem;
      return `${a.txnId} · ${a.date}`;
    }
    if (item.category === 'variance') {
      const v = item as VarianceItem;
      return v.accountCode;
    }
    if (item.category === 'approval') {
      const a = item as ApprovalItem;
      return `${a.submittedBy} · ${a.submittedAgo}`;
    }
    if (item.category === 'exception') {
      const e = item as ExceptionItem;
      return `${e.source} · ${e.count} item${e.count !== 1 ? 's' : ''}`;
    }
    if (item.category === 'task') {
      const t = item as TaskItem;
      return `${t.module}`;
    }
    return '';
  };

  const getStatusBadges = (): React.ReactNode[] => {
    const badges: React.ReactNode[] = [];

    if (item.category === 'accrual') {
      const a = item as AccrualItem;
      badges.push(<KindBadge key="kind" kind={a.kind} />);
      if (a.overrideCount != null && a.overrideCount > 0) {
        badges.push(
          <span key="override" className="text-[10px] font-semibold bg-[#fff8eb] text-[#db7712] rounded px-1.5 py-0.5">
            ⚠ {a.overrideCount} override{a.overrideCount !== 1 ? 's' : ''}
          </span>
        );
      }
    }

    if (item.category === 'anomaly') {
      badges.push(<SeverityBadge key="severity" s={(item as AnomalyItem).severity} />);
    }

    if (item.category === 'variance') {
      const v = item as VarianceItem;
      badges.push(
        <span key="pct" className={cn('text-xs font-semibold', v.pctChange > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>
          {pct(v.pctChange)} vs {v.compareLabel}
        </span>
      );
    }

    if (item.category === 'approval') {
      const a = item as ApprovalItem;
      const flagCount = a.agentFinding?.flags.length ?? 0;
      const riskScore = a.agentFinding?.riskScore;
      if (flagCount > 0) {
        badges.push(
          <span key="flags" className="text-[10px] text-[#db7712] font-semibold">
            ⚠ {flagCount}
          </span>
        );
      }
      if (riskScore !== undefined) {
        badges.push(<RiskBadge key="risk" score={riskScore} />);
      }
    }

    if (item.category === 'task') {
      const t = item as TaskItem;
      if (t.dueStatus === 'overdue') {
        badges.push(
          <span key="overdue" className="text-[10px] font-semibold uppercase bg-[#fff1f4] text-[#d4183d] rounded px-1.5 py-0.5">
            Overdue
          </span>
        );
      } else {
        badges.push(
          <span key="today" className="text-[10px] font-semibold uppercase bg-[#f5f6f8] text-[#6b7280] rounded px-1.5 py-0.5">
            Today
          </span>
        );
      }
    }

    if (isBlocking) {
      badges.push(
        <span key="blocking" className="flex items-center gap-0.5 text-[10px] font-semibold text-[#d4183d]">
          <AlertTriangle size={9} className="shrink-0" />
          blocking close
        </span>
      );
    }

    return badges;
  };

  const amount = getAmount();

  return (
    <button type="button" onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-[#e1e6ef] transition-colors',
        selected ? 'bg-indigo-50/60' : 'bg-white hover:bg-slate-50',
        item.resolved && 'opacity-50',
      )}>
      {/* Title + Amount */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm text-[#1d2433] font-medium leading-snug flex-1 truncate">{getTitle()}</span>
        {amount !== null && (
          <span className="shrink-0 font-mono text-sm text-[#1d2433]">{fmt$(amount)}</span>
        )}
      </div>

      {/* Metadata + Product Chip */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs text-[#6b7280] truncate flex-1">{getMeta()}</span>
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-[#6b7280] bg-[#f5f6f8] rounded px-1.5 py-0.5">
          {chip.label}
        </span>
      </div>

      {/* Status Badges */}
      {getStatusBadges().length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {getStatusBadges()}
        </div>
      )}
    </button>
  );
}

function AgentHandledSection() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles size={11} className="text-[#1fac76]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6b7280]">Agent-Handled</span>
        </div>
        <span className="text-xs font-semibold tabular-nums text-[#1fac76]">{OVERNIGHT_ACTIVITY.length}</span>
      </div>
      <div>
        {OVERNIGHT_ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-[#e1e6ef] bg-[#f9fafb]">
            <Check size={11} className="text-[#1fac76] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-[#424867]">{a.label}</div>
              <div className="text-[10px] text-[#6b7280] mt-0.5">{a.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSection({ label, icon, colorClass, items, selectedId, onSelect, blockingIdSet, collapsible = true }: {
  label: string; icon?: React.ReactNode; colorClass: string;
  items: InboxItem[]; selectedId: string | null;
  onSelect: (id: string) => void; blockingIdSet?: Set<string>; collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const activeCount = items.filter(i => !i.resolved).length;
  if (items.length === 0) return null;

  return (
    <div>
      {collapsible ? (
        <button type="button" onClick={() => setOpen(o => !o)}
          className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#f5f6f8] transition-colors">
          <div className="flex items-center gap-2">
            {open ? <ChevronDown size={12} className="text-[#adb2bb]" /> : <ChevronRight size={12} className="text-[#adb2bb]" />}
            {icon}
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6b7280]">{label}</span>
          </div>
          {activeCount > 0 && (
            <span className={cn('text-xs font-semibold tabular-nums', colorClass)}>{activeCount}</span>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6b7280]">{label}</span>
          </div>
          {activeCount > 0 && (
            <span className={cn('text-xs font-semibold tabular-nums', colorClass)}>{activeCount}</span>
          )}
        </div>
      )}
      {(!collapsible || open) && (
        <div>
          {items.map(item => {
            const sel = item.id === selectedId;
            const isBlocking = blockingIdSet?.has(item.id);
            return (
              <div key={item.id} className="relative">
                {isBlocking && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4183d] z-10" />}
                <InboxCard item={item} selected={sel} onClick={() => onSelect(item.id)} isBlocking={isBlocking} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── InboxPanel ───────────────────────────────────────────────────────────────

const OVERNIGHT_ACTIVITY = [
  { label: 'AR export processed',            detail: '47 customers · $4,030,000 · 0 errors' },
  { label: 'IC rows identified & excluded',  detail: '3 rows · $420K removed from provision base' },
  { label: 'Aging schedule applied',         detail: '5 buckets · 44 standard customers' },
  { label: 'AFDA provision calculated',      detail: '$234,800 · +18% vs prior period' },
  { label: 'IT Services accrual predicted',  detail: '$8,200 · 98% confidence' },
  { label: 'Office Rent accrual predicted',  detail: '$45,000 · 98% confidence' },
];

function OvernightDigest({ onDismiss }: { onDismiss: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mx-3 mt-3 mb-1 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
      >
        <Sparkles size={12} className="text-[#1fac76] shrink-0" />
        <span className="text-xs font-semibold text-[#166534] flex-1">
          Agents resolved {OVERNIGHT_ACTIVITY.length} items overnight
        </span>
        <span className="text-[10px] text-[#4ade80]">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="border-t border-[#bbf7d0]">
          {OVERNIGHT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 border-b border-[#dcfce7] last:border-0">
              <Check size={10} className="text-[#1fac76] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-[#166534] leading-tight">{a.label}</div>
                <div className="text-[10px] text-[#4ade80] font-medium mt-0.5 leading-tight" style={{color:'#16a34a'}}>{a.detail}</div>
              </div>
            </div>
          ))}
          <div className="px-3 py-2 flex justify-end">
            <button
              onClick={e => { e.stopPropagation(); onDismiss(); }}
              className="text-[10px] font-medium text-[#4ade80] hover:text-[#166534] transition-colors"
              style={{color:'#16a34a'}}
            >
              Dismiss ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InboxPanel({ items, selectedId, onSelect }: {
  items: InboxItem[]; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const [blockingFilter, setBlockingFilter] = useState(false);
  const [showDigest, setShowDigest] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('priority');
  const [unifiedFilter, setUnifiedFilter] = useState<Category | null>(null);
  const totalOpen = items.filter(i => !i.resolved).length;
  const aiHandled = OVERNIGHT_ACTIVITY.length;

  const overdueCount = useMemo(() =>
    items.filter(i => !i.resolved && i.category === 'task' && (i as TaskItem).dueStatus === 'overdue').length,
  [items]);

  const blockingCount = useMemo(() =>
    items.filter(i => !i.resolved && i.category === 'approval' && ((i as ApprovalItem).agentFinding?.riskScore ?? 0) >= 75).length,
  [items]);

  const blockingCloseCount = useMemo(() => items.filter(isBlockingClose).length, [items]);
  const blockingIdSet = useMemo(() => new Set(items.filter(isBlockingClose).map(i => i.id)), [items]);

  const byCategory = useMemo(() => {
    const map: Record<Category, InboxItem[]> = {
      accrual: [], anomaly: [], variance: [], approval: [], exception: [], task: [],
    };
    const filtered = blockingFilter ? items.filter(isBlockingClose) : items;
    for (const item of filtered) map[item.category].push(item);
    return map;
  }, [items, blockingFilter]);

  const byPriority = useMemo(() => {
    const active = items.filter(i => !i.resolved);
    return {
      critical:  active.filter(i => getPriorityGroup(i) === 'critical'),
      attention: active.filter(i => getPriorityGroup(i) === 'attention'),
      normal:    active.filter(i => getPriorityGroup(i) === 'normal'),
    };
  }, [items]);

  const byAction = useMemo(() => {
    const active = items.filter(i => !i.resolved);
    return {
      decide:  active.filter(i => getActionGroup(i) === 'decide'),
      approve: active.filter(i => getActionGroup(i) === 'approve'),
      do:      active.filter(i => getActionGroup(i) === 'do'),
    };
  }, [items]);

  const sortedUnified = useMemo(() => {
    const active = items.filter(i => !i.resolved);
    return [...active].sort((a, b) => {
      const rank = { critical: 0, attention: 1, normal: 2 };
      return rank[getPriorityGroup(a)] - rank[getPriorityGroup(b)];
    });
  }, [items]);

  return (
    <div className="flex flex-col w-[340px] shrink-0 border-r border-[#e1e6ef] h-screen overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#e1e6ef]">
        <div className="flex items-start justify-between mb-0.5">
          <h1 className="font-display text-lg text-[#1d2433]">Accounting Inbox</h1>
          <a
            href="http://localhost:4321/mission-control.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-[#6b7280] hover:text-[#1fac76] transition-colors mt-1 whitespace-nowrap"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#1fac76]" />
            Controller view
            <ArrowUpRight size={10} />
          </a>
        </div>
        <p className="text-xs text-[#6b7280]">March 31, 2026 · Close Period · Day 3</p>

        {/* Agent headline */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#1fac76]" />
            <span className="text-xs font-semibold text-[#1d2433]">Agents handled {aiHandled} overnight</span>
          </div>
          <span className="text-xs font-semibold text-[#6b7280] tabular-nums">{totalOpen} need you</span>
        </div>

        {/* Exception chips — secondary */}
        {(overdueCount > 0 || blockingCount > 0) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {overdueCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff1f4] text-[#d4183d] rounded-full px-2 py-0.5">
                <span className="w-1 h-1 rounded-full bg-[#d4183d]" />
                {overdueCount} overdue
              </span>
            )}
            {blockingCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#fff8eb] text-[#db7712] rounded-full px-2 py-0.5">
                <span className="w-1 h-1 rounded-full bg-[#db7712]" />
                {blockingCount} blocking controller
              </span>
            )}
          </div>
        )}

        {/* Blocking close filter toggle */}
        {blockingCloseCount > 0 && (
          <button
            onClick={() => setBlockingFilter(f => !f)}
            className={cn(
              'mt-2 w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
              blockingFilter
                ? 'bg-[#fff1f4] border border-[#f5c6ce] text-[#d4183d]'
                : 'bg-[#f5f6f8] border border-transparent text-[#6b7280] hover:bg-[#eef0f4] hover:text-[#1d2433]',
            )}
          >
            <div className="flex items-center gap-1.5">
              <Filter size={11} />
              <span>{blockingFilter ? 'Showing critical path' : `${blockingCloseCount} items blocking close`}</span>
            </div>
            <span className={cn('text-[10px] font-semibold', blockingFilter ? 'text-[#d4183d]' : 'text-[#9ca3af]')}>
              {blockingFilter ? 'Show all ×' : 'Filter →'}
            </span>
          </button>
        )}

        {totalOpen > 0 && (
          <div className="mt-2.5">
            <div className="h-1.5 rounded-full bg-[#e1e6ef] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1fac76] transition-all"
                style={{ width: `${Math.round(((SEED_ITEMS.length - totalOpen) / SEED_ITEMS.length) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {totalOpen === 0 && (
          <div className="mt-3 flex items-center gap-2 text-[#1fac76]">
            <CheckCircle size={14} />
            <span className="text-xs font-semibold">All clear — inbox zero</span>
          </div>
        )}

        {/* View mode switcher */}
        <div className="mt-3 flex items-center gap-0.5 bg-[#f5f6f8] rounded-lg p-0.5">
          {(['priority', 'action', 'unified', 'product'] as ViewMode[]).map(mode => {
            const labels: Record<ViewMode, string> = {
              product: 'Products', priority: 'Priority', action: 'Action', unified: 'Unified',
            };
            return (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={cn(
                  'flex-1 text-[10px] font-semibold rounded-md py-1 transition-colors whitespace-nowrap',
                  viewMode === mode
                    ? 'bg-white text-[#1d2433] shadow-sm'
                    : 'text-[#6b7280] hover:text-[#1d2433]',
                )}>
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Daily digest — all views */}
        <DailyDigest items={items} />

        {/* ── Products view (default) ───────────────────────────────────── */}
        {viewMode === 'product' && (
          <>
            {showDigest && !blockingFilter && (
              <OvernightDigest onDismiss={() => setShowDigest(false)} />
            )}
            {blockingFilter && (
              <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 bg-[#fff1f4] border-b border-[#f5c6ce]">
                <AlertTriangle size={11} className="text-[#d4183d] shrink-0" />
                <span className="text-[11px] font-semibold text-[#d4183d]">
                  Critical path — {blockingCloseCount} item{blockingCloseCount !== 1 ? 's' : ''} holding up March close
                </span>
              </div>
            )}
            {SECTIONS.map((s, i) => (
              <InboxSection
                key={s.id}
                id={s.id}
                label={s.label}
                source={s.source}
                items={byCategory[s.id]}
                selectedId={selectedId}
                onSelect={onSelect}
                defaultOpen={i < 2}
                blockingIds={blockingFilter ? blockingIdSet : undefined}
              />
            ))}
          </>
        )}

        {/* ── Priority view ─────────────────────────────────────────────── */}
        {viewMode === 'priority' && (
          <>
            <GenericSection
              label="Close Blockers"
              icon={<AlertTriangle size={11} className="text-[#d4183d]" />}
              colorClass="text-[#d4183d]"
              items={byPriority.critical}
              selectedId={selectedId}
              onSelect={onSelect}
              blockingIdSet={blockingIdSet}
              collapsible={false}
            />
            <GenericSection
              label="Needs Attention"
              icon={<Clock size={11} className="text-[#db7712]" />}
              colorClass="text-[#db7712]"
              items={byPriority.attention}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsible={false}
            />
            <GenericSection
              label="Review When Ready"
              icon={<CheckCircle size={11} className="text-[#6b7280]" />}
              colorClass="text-[#6b7280]"
              items={byPriority.normal}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsible={false}
            />
            <AgentHandledSection />
          </>
        )}

        {/* ── Action view ───────────────────────────────────────────────── */}
        {viewMode === 'action' && (
          <>
            <div className="px-4 pt-3 pb-2 text-[10px] text-[#6b7280]">
              Items grouped by what you need to do — not where they came from.
            </div>
            <GenericSection
              label="Decide"
              icon={<AlertTriangle size={11} className="text-[#7c3aed]" />}
              colorClass="text-[#7c3aed]"
              items={byAction.decide}
              selectedId={selectedId}
              onSelect={onSelect}
              blockingIdSet={blockingIdSet}
              collapsible={false}
            />
            <GenericSection
              label="Approve"
              icon={<CheckCircle size={11} className="text-[#2563eb]" />}
              colorClass="text-[#2563eb]"
              items={byAction.approve}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsible={false}
            />
            <GenericSection
              label="Do"
              icon={<ListTodo size={11} className="text-[#db7712]" />}
              colorClass="text-[#db7712]"
              items={byAction.do}
              selectedId={selectedId}
              onSelect={onSelect}
              collapsible={false}
            />
          </>
        )}

        {/* ── Unified view ──────────────────────────────────────────────── */}
        {viewMode === 'unified' && (
          <>
            <div className="px-4 pt-3 pb-2.5 border-b border-[#e1e6ef]">
              <p className="text-[10px] text-[#6b7280] leading-relaxed mb-2">All items sorted by urgency. Filter by product:</p>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setUnifiedFilter(null)}
                  className={cn(
                    'text-[10px] font-semibold rounded-md px-2 py-1 transition-colors',
                    unifiedFilter === null ? 'bg-[#1d2433] text-white' : 'bg-[#f5f6f8] text-[#6b7280] hover:bg-[#e9ebef]',
                  )}>All</button>
                {SECTIONS.map(s => {
                  const chip = PRODUCT_CHIP[s.id];
                  const active = unifiedFilter === s.id;
                  return (
                    <button key={s.id}
                      onClick={() => setUnifiedFilter(f => f === s.id ? null : s.id)}
                      className={cn(
                        'text-[10px] font-semibold rounded-md px-2 py-1 transition-colors',
                        active ? 'bg-[#1d2433] text-white' : 'bg-[#f5f6f8] text-[#6b7280] hover:bg-[#e9ebef]',
                      )}>
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              {sortedUnified
                .filter(item => unifiedFilter === null || item.category === unifiedFilter)
                .map(item => {
                  const sel = item.id === selectedId;
                  const isBlocking = blockingIdSet.has(item.id);
                  return (
                    <div key={item.id} className="relative">
                      {isBlocking && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4183d] z-10" />}
                      <InboxCard item={item} selected={sel} onClick={() => onSelect(item.id)} isBlocking={isBlocking} />
                    </div>
                  );
                })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ─── Provision Review Slide-Over ─────────────────────────────────────────────

const REVIEW_STEPS: { label: string; icon: React.ReactNode; summary: string }[] = [
  { label: 'AR Input',    icon: <Upload size={14} />,        summary: 'floqast-ar-march2026.csv loaded — 47 customers, $4,030,000 total AR, 0 errors' },
  { label: 'Txn Types',  icon: <Tag size={14} />,           summary: 'Standard Invoices + Credit Memos included · Intercompany and write-offs excluded' },
  { label: 'IC Filter',  icon: <Filter size={14} />,        summary: '3 intercompany rows identified and excluded ($420K) — High confidence' },
  { label: 'Collections',icon: <Users size={14} />,         summary: '2 customers flagged for non-standard treatment before calculation' },
  { label: 'Calculate',  icon: <Calculator size={14} />,    summary: 'Aging rates applied to 44 standard customers · Overrides applied to 2' },
  { label: 'Sign-off',   icon: <ClipboardCheck size={14} />,summary: 'Review provision totals and post to authorise JE generation' },
];

interface ProvisionEditState {
  txnInclusion: Record<string, boolean>;
  icDecisions: Record<string, 'exclude' | 'keep'>;
  customerOverrides: Record<string, { treatment: 'standard' | 'specific' | 'full' | 'exclude'; rate: number }>;
  agingRates: number[];
  reviewer: string;
  signOffDate: string;
  auditNotes: string;
  totalProvision: number;
}

interface ProvisionEditHandlers {
  setTxn: (key: string, val: boolean) => void;
  setIc: (code: string, decision: 'exclude' | 'keep') => void;
  setCustomer: (name: string, treatment: 'standard' | 'specific' | 'full' | 'exclude', rate?: number) => void;
  setRate: (idx: number, val: number) => void;
  setReviewer: (v: string) => void;
  setSignOffDate: (v: string) => void;
  setAuditNotes: (v: string) => void;
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn('relative w-10 h-5 rounded-full transition-colors shrink-0', on ? 'bg-[#1fac76]' : 'bg-[#d1d5db]')}
    >
      <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

function ProvisionReviewStepContent({ stepIdx, item, editState, onEdit }: {
  stepIdx: number; item: AccrualItem;
  editState: ProvisionEditState; onEdit: ProvisionEditHandlers;
}) {
  const buckets = item.agingBuckets!;
  const overrides = item.overrideCustomers!;
  const bucketColors = ['#1fac76','#86efac','#fbbf24','#f97316','#ef4444'];

  // ── Step 0: AR Input ──────────────────────────────────────────────────────────
  if (stepIdx === 0) return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
        <div className="px-5 py-3 bg-[#f5f6f8] border-b border-[#e1e6ef] text-xs font-semibold text-[#424867] uppercase tracking-wide">Source file</div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f9fafb] border border-[#e1e6ef]">
            <FileText size={20} className="text-[#6b7280] shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1d2433]">floqast-ar-march2026.csv</div>
              <div className="text-xs text-[#9ca3af]">Uploaded Mar 31, 2026 · 47 rows · 2.1 KB</div>
            </div>
            <span className="text-[10px] font-semibold bg-[#ecfff8] text-[#1c895f] rounded px-2 py-0.5">0 errors</span>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#1d2433] border border-[#e1e6ef] rounded-lg px-3 py-1.5 bg-white hover:bg-[#f9fafb] transition-colors">
              <Upload size={11} /> Replace
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['47', 'Customers'], ['$4,030,000', 'Total AR'], ['5', 'Aging buckets']].map(([v, l]) => (
              <div key={l} className="p-3 rounded-lg bg-[#f9fafb] border border-[#e1e6ef]">
                <div className="text-lg font-semibold font-mono text-[#1d2433]">{v}</div>
                <div className="text-[10px] text-[#9ca3af] uppercase tracking-wide mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f5f6f8] border-b border-[#e1e6ef] text-xs font-semibold text-[#424867] uppercase tracking-wide">Column mapping</div>
            {[
              { source: 'customer_name', mapped: 'Customer Name' },
              { source: 'invoice_date', mapped: 'Invoice Date' },
              { source: 'balance_due', mapped: 'AR Balance' },
              { source: 'invoice_currency', mapped: 'Currency' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#f3f4f6] last:border-0">
                <span className="text-xs font-mono text-[#6b7280] w-36">{m.source}</span>
                <ChevronRight size={11} className="text-[#9ca3af] shrink-0" />
                <span className="text-xs font-medium text-[#1d2433] flex-1">{m.mapped}</span>
                <span className="text-[10px] font-semibold bg-[#ecfff8] text-[#1c895f] rounded px-1.5 py-0.5">Auto-mapped</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Step 1: Txn Types ─────────────────────────────────────────────────────────
  if (stepIdx === 1) {
    const TXN_ROWS = [
      { code: 'INV', label: 'Standard Invoices', count: 41, amount: 3920000 },
      { code: 'CM',  label: 'Credit Memos',       count: 6,  amount: 240000 },
      { code: 'JE',  label: 'Journal Entries',     count: 2,  amount: 68000 },
      { code: 'IC',  label: 'Intercompany',        count: 3,  amount: 420000 },
      { code: 'ADJ', label: 'Adjustments',         count: 1,  amount: 15000 },
      { code: 'WO',  label: 'Write-offs',          count: 0,  amount: 0 },
    ];
    const includedAR = TXN_ROWS.filter(t => editState.txnInclusion[t.code]).reduce((s,t) => s + t.amount, 0);
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#6b7280]">Toggle transaction types to include or exclude them from the provision base. Excluded types don't contribute to the AR aging balance.</p>
        <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
          {TXN_ROWS.map((t) => {
            const on = editState.txnInclusion[t.code] ?? false;
            return (
              <div key={t.code} className={cn('flex items-center gap-3 px-5 py-3.5 border-b border-[#f3f4f6] last:border-0 transition-opacity', !on && 'opacity-50')}>
                <span className="text-xs font-mono font-bold text-[#9ca3af] w-8">{t.code}</span>
                <span className="text-sm font-medium text-[#1d2433] flex-1">{t.label}</span>
                <span className="text-xs text-[#9ca3af] w-14 text-right">{t.count} rows</span>
                <span className="text-sm font-mono text-[#6b7280] w-28 text-right">{t.amount > 0 ? fmt$(t.amount) : '—'}</span>
                <ToggleSwitch on={on} onChange={v => onEdit.setTxn(t.code, v)} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#f5f6f8] border border-[#e1e6ef] text-sm">
          <span className="text-[#6b7280]">Included AR base</span>
          <span className="font-mono font-semibold text-[#1d2433]">{fmt$(includedAR)}</span>
        </div>
      </div>
    );
  }

  // ── Step 2: IC Filter ─────────────────────────────────────────────────────────
  if (stepIdx === 2) {
    const IC_ROWS = [
      { entity: 'FloQast Entity B',       code: 'FQ-EB-2026', amount: 180000, confidence: 'High' },
      { entity: 'FloQast EU Operations',  code: 'FQ-EU-2026', amount: 140000, confidence: 'High' },
      { entity: 'FloQast APAC Ltd.',      code: 'FQ-AP-2026', amount: 100000, confidence: 'High' },
    ];
    const keptTotal = IC_ROWS.filter(r => editState.icDecisions[r.code] === 'keep').reduce((s,r) => s + r.amount, 0);
    const excludedTotal = IC_ROWS.filter(r => editState.icDecisions[r.code] !== 'keep').reduce((s,r) => s + r.amount, 0);
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#6b7280]">The agent identified these rows as intercompany using entity name matching and subsidiary codes. Review each and choose to exclude or keep in the provision base.</p>
        <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
          <div className="px-5 py-3 bg-[#f5f6f8] border-b border-[#e1e6ef] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#424867]">Identified IC rows</span>
            {excludedTotal > 0 && <span className="text-[10px] font-semibold bg-[#fee2e2] text-[#d4183d] rounded px-2 py-0.5">{IC_ROWS.filter(r => editState.icDecisions[r.code] !== 'keep').length} excluded · {fmt$(excludedTotal)} removed</span>}
          </div>
          {IC_ROWS.map((r) => {
            const decision = editState.icDecisions[r.code] ?? 'exclude';
            const isKept = decision === 'keep';
            return (
              <div key={r.code} className={cn('flex items-center gap-3 px-5 py-3.5 border-b border-[#f3f4f6] last:border-0', isKept && 'bg-[#f0fdf4]')}>
                <Building2 size={14} className="text-[#9ca3af] shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1d2433]">{r.entity}</div>
                  <div className="text-xs text-[#9ca3af]">{r.code}</div>
                </div>
                <span className="text-[10px] font-semibold bg-[#ecfff8] text-[#1c895f] rounded px-1.5 py-0.5">{r.confidence}</span>
                <span className="font-mono text-sm text-[#6b7280] w-24 text-right">{fmt$(r.amount)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit.setIc(r.code, 'exclude')}
                    className={cn('text-[11px] font-semibold rounded px-2.5 py-1 transition-colors', !isKept ? 'bg-[#fee2e2] text-[#d4183d]' : 'bg-[#f3f4f6] text-[#9ca3af] hover:bg-[#fee2e2] hover:text-[#d4183d]')}
                  >Exclude</button>
                  <button
                    onClick={() => onEdit.setIc(r.code, 'keep')}
                    className={cn('text-[11px] font-semibold rounded px-2.5 py-1 transition-colors', isKept ? 'bg-[#ecfff8] text-[#1c895f]' : 'bg-[#f3f4f6] text-[#9ca3af] hover:bg-[#ecfff8] hover:text-[#1c895f]')}
                  >Keep</button>
                </div>
              </div>
            );
          })}
        </div>
        {keptTotal > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#fff8eb] border border-[#fcd34d]">
            <AlertTriangle size={12} className="text-[#db7712] shrink-0" />
            <span className="text-xs text-[#db7712]"><span className="font-semibold">{fmt$(keptTotal)}</span> IC balance kept in provision base — ensure this is intentional</span>
          </div>
        )}
      </div>
    );
  }

  // ── Step 3: Collections ───────────────────────────────────────────────────────
  if (stepIdx === 3) {
    const TREATMENT_OPTS = [
      { value: 'standard',  label: 'Standard aging' },
      { value: 'specific',  label: 'Specific %' },
      { value: 'full',      label: 'Full provision (100%)' },
      { value: 'exclude',   label: 'Exclude entirely' },
    ] as const;
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#6b7280]">Set the collection treatment for each flagged customer. The provision for each will recalculate immediately.</p>
        <div className="space-y-2">
          {overrides.map((c) => {
            const ov = editState.customerOverrides[c.name] ?? { treatment: 'standard' as const, rate: 0 };
            const provisionAmt = ov.treatment === 'full' ? c.amount
              : ov.treatment === 'specific' ? Math.round(c.amount * ov.rate / 100)
              : ov.treatment === 'exclude' ? 0
              : Math.round(c.amount * 0.15);
            return (
              <div key={c.name} className="rounded-lg border border-[#e1e6ef] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[#1d2433]">{c.name}</div>
                    <div className="text-xs text-[#9ca3af] mt-0.5">{c.reason}</div>
                  </div>
                  <span className="font-mono text-sm text-[#1d2433] shrink-0">{fmt$(c.amount)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wide text-[#9ca3af] font-semibold mb-1 block">Treatment</label>
                    <select
                      value={ov.treatment}
                      onChange={e => onEdit.setCustomer(c.name, e.target.value as 'standard' | 'specific' | 'full' | 'exclude', ov.rate)}
                      className="w-full text-sm border border-[#e1e6ef] rounded-lg px-3 py-2 bg-white text-[#1d2433] focus:outline-none focus:border-[#1fac76] transition-colors"
                    >
                      {TREATMENT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  {ov.treatment === 'specific' && (
                    <div className="w-28">
                      <label className="text-[10px] uppercase tracking-wide text-[#9ca3af] font-semibold mb-1 block">Rate (%)</label>
                      <div className="flex items-center border border-[#e1e6ef] rounded-lg bg-white overflow-hidden focus-within:border-[#1fac76] transition-colors">
                        <input
                          type="number" min={0} max={100} step={1}
                          value={ov.rate}
                          onChange={e => onEdit.setCustomer(c.name, 'specific', Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full text-sm px-3 py-2 bg-transparent focus:outline-none text-right font-mono"
                        />
                        <span className="pr-3 text-sm text-[#9ca3af]">%</span>
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] font-semibold mb-1">Provision</div>
                    <div className={cn('text-sm font-mono font-semibold',
                      ov.treatment === 'full' ? 'text-[#d4183d]'
                      : ov.treatment === 'exclude' ? 'text-[#9ca3af] line-through'
                      : 'text-[#1d2433]'
                    )}>
                      {ov.treatment === 'exclude' ? fmt$(provisionAmt) : fmt$(provisionAmt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="rounded-lg border border-[#e1e6ef] bg-[#f9fafb] p-4 text-sm text-[#6b7280]">
            <span className="font-medium text-[#1d2433]">44 remaining customers</span> — standard aging rates applied. No collection flags.
          </div>
        </div>
      </div>
    );
  }

  // ── Step 4: Calculate ─────────────────────────────────────────────────────────
  if (stepIdx === 4) {
    const stdTotal = buckets.reduce((s, b, i) => s + Math.round(b.ar * editState.agingRates[i] / 100), 0);
    const overrideTotal = overrides.reduce((s, c) => {
      const ov = editState.customerOverrides[c.name] ?? { treatment: 'standard' as const, rate: 0 };
      if (ov.treatment === 'full') return s + c.amount;
      if (ov.treatment === 'specific') return s + Math.round(c.amount * ov.rate / 100);
      if (ov.treatment === 'exclude') return s;
      return s + Math.round(c.amount * 0.15);
    }, 0);
    const grandTotal = stdTotal + overrideTotal;
    const changePct = Math.round((grandTotal - item.priorAmount!) / item.priorAmount! * 100);

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[#e1e6ef] p-3.5 text-center">
            <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">AR Base</div>
            <div className="text-base font-semibold font-mono text-[#1d2433]">{fmt$(buckets.reduce((s,b) => s + b.ar, 0))}</div>
          </div>
          <div className="rounded-lg border border-[#1fac76] bg-[#ecfff8] p-3.5 text-center">
            <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Provision</div>
            <div className="text-base font-semibold font-mono text-[#1d2433]">{fmt$(grandTotal)}</div>
          </div>
          <div className={cn('rounded-lg border p-3.5 text-center', changePct > 15 ? 'border-[#fcd34d] bg-[#fffbeb]' : 'border-[#e1e6ef]')}>
            <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">vs Prior</div>
            <div className={cn('text-base font-semibold font-mono', changePct > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>{changePct > 0 ? '+' : ''}{changePct}%</div>
          </div>
        </div>
        <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
          <div className="px-5 py-3 bg-[#f5f6f8] border-b border-[#e1e6ef] text-xs font-semibold text-[#424867] uppercase tracking-wide">Aging rate schedule — edit to recalculate</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-[#9ca3af]">Bucket</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-[#9ca3af]">AR Balance</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-[#9ca3af]">Rate</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-[#9ca3af]">Provision</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((b, i) => {
                const rate = editState.agingRates[i];
                const prov = Math.round(b.ar * rate / 100);
                return (
                  <tr key={i} className="border-b border-[#f3f4f6] last:border-0">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: bucketColors[i] }} />
                        {b.label}
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-right font-mono text-[#6b7280]">{fmt$(b.ar)}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end border border-[#e1e6ef] rounded-lg bg-white overflow-hidden focus-within:border-[#1fac76] transition-colors w-20 ml-auto">
                        <input
                          type="number" min={0} max={100} step={1}
                          value={rate}
                          onChange={e => onEdit.setRate(i, Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-full text-sm px-2 py-1.5 bg-transparent focus:outline-none text-right font-mono"
                        />
                        <span className="pr-2 text-xs text-[#9ca3af]">%</span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-right font-mono font-medium text-[#1d2433]">{fmt$(prov)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t-2 border-[#e1e6ef] bg-[#f9fafb] flex justify-between text-sm font-semibold">
            <span className="text-[#424867]">Standard customers subtotal</span>
            <span className="font-mono text-[#1d2433]">{fmt$(stdTotal)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
          <div className="px-5 py-3 bg-[#f5f6f8] border-b border-[#e1e6ef] text-xs font-semibold text-[#424867] uppercase tracking-wide">Customer overrides</div>
          {overrides.map((c) => {
            const ov = editState.customerOverrides[c.name] ?? { treatment: 'standard' as const, rate: 0 };
            const prov = ov.treatment === 'full' ? c.amount : ov.treatment === 'specific' ? Math.round(c.amount * ov.rate / 100) : ov.treatment === 'exclude' ? 0 : Math.round(c.amount * 0.15);
            return (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 border-b border-[#f3f4f6] last:border-0">
                <span className="flex-1 text-sm text-[#1d2433]">{c.name}</span>
                <span className="text-xs text-[#9ca3af]">{ov.treatment === 'full' ? '100%' : ov.treatment === 'specific' ? `${ov.rate}%` : ov.treatment === 'exclude' ? 'Excluded' : '~15%'}</span>
                <span className={cn('font-mono text-sm font-medium', ov.treatment === 'exclude' ? 'text-[#9ca3af] line-through' : 'text-[#1d2433]')}>{fmt$(prov)}</span>
              </div>
            );
          })}
          <div className="px-5 py-3 border-t-2 border-[#e1e6ef] bg-[#ecfff8] flex justify-between text-sm font-bold text-[#1d2433]">
            <span>Total provision</span>
            <span className="font-mono">{fmt$(grandTotal)}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 5: Sign-off ──────────────────────────────────────────────────────────
  const grandTotal = editState.totalProvision;
  const changePct = Math.round((grandTotal - item.priorAmount!) / item.priorAmount! * 100);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#1fac76] bg-[#ecfff8] p-4 text-center">
          <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Provision</div>
          <div className="text-xl font-semibold font-mono text-[#1d2433]">{fmt$(grandTotal)}</div>
        </div>
        <div className="rounded-lg border border-[#e1e6ef] p-4 text-center">
          <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Prior Period</div>
          <div className="text-xl font-semibold font-mono text-[#6b7280]">{fmt$(item.priorAmount!)}</div>
        </div>
        <div className={cn('rounded-lg border p-4 text-center', changePct > 15 ? 'border-[#fcd34d] bg-[#fffbeb]' : 'border-[#e1e6ef]')}>
          <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Change</div>
          <div className={cn('text-xl font-semibold font-mono', changePct > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>{changePct > 0 ? '+' : ''}{changePct}%</div>
        </div>
      </div>
      <div className="rounded-lg border border-[#e1e6ef] p-4 space-y-3">
        <div className="font-semibold text-[#424867] text-xs uppercase tracking-wide">Sign-off details</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-[#6b7280] block mb-1">Prepared by</label>
            <input
              type="text" placeholder="Your name"
              value={editState.reviewer}
              onChange={e => onEdit.setReviewer(e.target.value)}
              className="w-full text-sm border border-[#e1e6ef] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#1fac76] transition-colors placeholder:text-[#d1d5db]"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6b7280] block mb-1">Sign-off date</label>
            <input
              type="date"
              value={editState.signOffDate}
              onChange={e => onEdit.setSignOffDate(e.target.value)}
              className="w-full text-sm border border-[#e1e6ef] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#1fac76] transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium text-[#6b7280] block mb-1">Audit notes <span className="text-[#9ca3af] font-normal">(optional)</span></label>
          <textarea
            rows={3} placeholder="Describe any judgements, overrides, or changes from prior period…"
            value={editState.auditNotes}
            onChange={e => onEdit.setAuditNotes(e.target.value)}
            className="w-full text-sm border border-[#e1e6ef] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#1fac76] transition-colors resize-none placeholder:text-[#d1d5db]"
          />
        </div>
      </div>
      <div className="rounded-lg border border-[#e1e6ef] p-4 space-y-2 text-sm text-[#6b7280]">
        <div className="font-semibold text-[#424867] text-xs uppercase tracking-wide mb-2">Why the provision changed</div>
        <div className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[#db7712] shrink-0 mt-1.5" />Meridian Healthcare moved to full provision (Chapter 11) — adds $45K</div>
        <div className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[#db7712] shrink-0 mt-1.5" />2 new customers entered the 91–120 day bucket vs last period</div>
        <div className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-[#6b7280] shrink-0 mt-1.5" />Standard aging rate schedule unchanged</div>
      </div>
    </div>
  );
}

function ProvisionReviewSlideOver({ item, initialStep = 5, onClose, onPost }: {
  item: AccrualItem; initialStep?: number; onClose: () => void; onPost: () => void;
}) {
  const [step, setStep] = useState(initialStep);
  const isSignOff = step === 5;

  // ── Editable state ────────────────────────────────────────────────────────────
  const [txnInclusion, setTxnInclusion] = useState<Record<string, boolean>>({
    INV: true, CM: true, JE: false, IC: false, ADJ: false, WO: false,
  });
  const [icDecisions, setIcDecisions] = useState<Record<string, 'exclude' | 'keep'>>({
    'FQ-EB-2026': 'exclude', 'FQ-EU-2026': 'exclude', 'FQ-AP-2026': 'exclude',
  });
  const [customerOverrides, setCustomerOverrides] = useState<Record<string, { treatment: 'standard' | 'specific' | 'full' | 'exclude'; rate: number }>>(() => {
    const init: Record<string, { treatment: 'standard' | 'specific' | 'full' | 'exclude'; rate: number }> = {};
    item.overrideCustomers!.forEach(c => {
      init[c.name] = { treatment: c.override === 'full' ? 'full' : c.override === 'specific' ? 'specific' : 'standard', rate: c.rate ?? 0 };
    });
    return init;
  });
  const [agingRates, setAgingRates] = useState<number[]>(item.agingBuckets!.map(b => b.rate));
  const [reviewer, setReviewer] = useState('');
  const [signOffDate, setSignOffDate] = useState('2026-03-31');
  const [auditNotes, setAuditNotes] = useState('');

  const totalProvision = useMemo(() => {
    const stdTotal = item.agingBuckets!.reduce((s, b, i) => s + Math.round(b.ar * agingRates[i] / 100), 0);
    const ovTotal = item.overrideCustomers!.reduce((s, c) => {
      const ov = customerOverrides[c.name] ?? { treatment: 'standard' as const, rate: 0 };
      if (ov.treatment === 'full') return s + c.amount;
      if (ov.treatment === 'specific') return s + Math.round(c.amount * ov.rate / 100);
      if (ov.treatment === 'exclude') return s;
      return s + Math.round(c.amount * 0.15);
    }, 0);
    return stdTotal + ovTotal;
  }, [agingRates, customerOverrides, item]);

  const editState: ProvisionEditState = {
    txnInclusion, icDecisions, customerOverrides, agingRates,
    reviewer, signOffDate, auditNotes, totalProvision,
  };

  const onEdit: ProvisionEditHandlers = {
    setTxn: (key, val) => setTxnInclusion(prev => ({ ...prev, [key]: val })),
    setIc: (code, decision) => setIcDecisions(prev => ({ ...prev, [code]: decision })),
    setCustomer: (name, treatment, rate) => setCustomerOverrides(prev => ({ ...prev, [name]: { treatment, rate: rate ?? prev[name]?.rate ?? 0 } })),
    setRate: (idx, val) => setAgingRates(prev => { const next = [...prev]; next[idx] = val; return next; }),
    setReviewer,
    setSignOffDate,
    setAuditNotes,
  };

  return (
    <div className="fixed inset-0 z-50 flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel — slides in from right */}
      <div className="w-[78%] max-w-4xl bg-white shadow-2xl flex flex-col h-full">
        {/* Panel header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e1e6ef] bg-[#f9fafb]">
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280] hover:text-[#1d2433] transition-colors mr-2">
            <ChevronLeft size={14} /> Back to inbox
          </button>
          <div className="w-px h-4 bg-[#e1e6ef]" />
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#7c3aed]" />
            <span className="text-sm font-semibold text-[#1d2433]">Bad Debt (AFDA) Provision · Agent workflow</span>
          </div>
          <span className="ml-auto text-xs text-[#9ca3af]">OOTB v1.2 · March 31, 2026</span>
        </div>

        {/* Step navigator */}
        <div className="flex items-center border-b border-[#e1e6ef] bg-white px-6 overflow-x-auto">
          {REVIEW_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors',
                  active ? 'border-[#1fac76] text-[#1d2433]' : 'border-transparent',
                  done ? 'text-[#1fac76]' : !active ? 'text-[#9ca3af] hover:text-[#6b7280]' : '',
                )}
              >
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                  done ? 'bg-[#1fac76] text-white' : active ? 'bg-[#1d2433] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]',
                )}>
                  {done ? <Check size={10} /> : i + 1}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Step title + summary */}
            <div className="flex items-start gap-3 mb-6">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                isSignOff ? 'bg-[#ecfff8] text-[#1fac76]' : 'bg-[#f5f0ff] text-[#7c3aed]'
              )}>
                {REVIEW_STEPS[step].icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-semibold text-[#1d2433]">
                    Step {step + 1} — {REVIEW_STEPS[step].label}
                  </h3>
                  {step < 5 && (
                    <span className="text-[10px] font-semibold bg-[#ecfff8] text-[#1c895f] rounded px-1.5 py-0.5">AI completed</span>
                  )}
                  {step === 5 && (
                    <span className="text-[10px] font-semibold bg-[#fff8eb] text-[#db7712] rounded px-1.5 py-0.5">Awaiting your sign-off</span>
                  )}
                </div>
                <p className="text-sm text-[#6b7280]">{REVIEW_STEPS[step].summary}</p>
              </div>
            </div>

            <ProvisionReviewStepContent stepIdx={step} item={item} editState={editState} onEdit={onEdit} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#e1e6ef] bg-[#f9fafb] flex items-center justify-between gap-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-[#6b7280] hover:text-[#1d2433] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <div className="flex items-center gap-2">
            {step < 5 ? (
              <button
                onClick={() => setStep(s => Math.min(5, s + 1))}
                className="flex items-center gap-1.5 bg-[#1d2433] hover:bg-[#374151] text-white font-medium text-sm rounded-lg px-5 py-2 transition-colors"
              >
                Next step <ChevronRight size={14} />
              </button>
            ) : (
              <>
                <button onClick={onClose} className="border border-[#e1e6ef] bg-white hover:bg-slate-50 text-[#424867] font-medium text-sm rounded-lg px-5 py-2 transition-colors">
                  Back to inbox
                </button>
                <button
                  onClick={onPost}
                  className="flex items-center gap-2 bg-[#1fac76] hover:bg-[#179a67] text-white font-semibold text-sm rounded-lg px-5 py-2 transition-colors"
                >
                  <Check size={14} /> Post provision {fmt$(totalProvision)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── JE Preview Modal ─────────────────────────────────────────────────────────

function JEPreviewModal({ item, onConfirm, onCancel }: {
  item: AccrualItem; onConfirm: () => void; onCancel: () => void;
}) {
  const lines = item.journalEntry ?? [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#e1e6ef]">
          <div className="w-9 h-9 rounded-xl bg-[#ecfff8] flex items-center justify-center shrink-0">
            <FileText size={16} className="text-[#1fac76]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d2433]">Journal Entry Preview</h3>
            <p className="text-xs text-[#9ca3af]">Review before posting to the GL</p>
          </div>
          <button onClick={onCancel} className="ml-auto text-[#adb2bb] hover:text-[#6b7280]">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* JE lines */}
          <div className="rounded-lg border border-[#e1e6ef] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f6f8] border-b border-[#e1e6ef]">
              <span className="text-xs font-semibold text-[#424867] uppercase tracking-wide">Proposed Entry</span>
              <span className="text-xs text-[#6b7280]">March 31, 2026</span>
            </div>
            <div className="px-4 py-3.5 space-y-2.5">
              {lines.map((line, i) => (
                <JELine key={i} label={line.type === 'dr' ? 'DR' : 'CR'} account={line.account} amount={line.amount} indent={line.type === 'cr'} />
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-[#e1e6ef] bg-[#f9fafb] flex justify-between items-center">
              <span className="text-xs text-[#9ca3af]">{item.entity}</span>
              <span className="text-xs font-semibold font-mono text-[#1d2433]">{fmt$(item.amount)}</span>
            </div>
          </div>

          {/* AI memo */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#f5f0ff] border border-[#e8daff] mb-5">
            <Sparkles size={11} className="text-[#7c3aed] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-[#7c3aed] mb-0.5">AI-generated memo</p>
              <p className="text-xs text-[#6b7280]">{item.title} — March 2026 close · Prepared by AI · Reviewed by GJ</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1fac76] hover:bg-[#179a67] text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-colors"
            >
              <Check size={14} /> Post to GL
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg border border-[#e1e6ef] text-[#424867] text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail: Accrual ──────────────────────────────────────────────────────────

function AccrualDetail({ item, onResolve }: { item: AccrualItem; onResolve: () => void }) {
  const [note, setNote] = useState('');
  const [modifiedAmount, setModifiedAmount] = useState(String(item.amount));
  const [showModify, setShowModify] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewInitialStep, setReviewInitialStep] = useState(5);
  const [showJEPreview, setShowJEPreview] = useState(false);

  const handlePost = () => setShowJEPreview(true);
  const jeModal = showJEPreview && item.journalEntry ? (
    <JEPreviewModal
      item={item}
      onConfirm={() => { setShowJEPreview(false); onResolve(); }}
      onCancel={() => setShowJEPreview(false)}
    />
  ) : null;

  if (item.kind === 'reversal') {
    const orig = item.originalEntry!;
    return (
      <>
        {jeModal}
        <div className="p-8 max-w-2xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
          <KindBadge kind="reversal" />
        </div>
        <p className="text-sm text-[#6b7280] mb-6">
          Accrued {item.accrualDate} · {item.entity} · {item.account}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Original */}
          <div className="rounded-lg border border-[#e1e6ef] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f5f6f8] border-b border-[#e1e6ef]">
              <span className="text-xs font-semibold text-[#424867] uppercase tracking-wide">Original Entry · {item.accrualDate}</span>
            </div>
            <div className="p-4 space-y-2">
              <JELine label="DR" account={orig.dr} amount={orig.amount} />
              <JELine label="CR" account={orig.cr} amount={orig.amount} indent />
            </div>
          </div>

          {/* Proposed reversal */}
          <div className="rounded-lg border border-blue-100 overflow-hidden bg-blue-50/30">
            <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Proposed Reversal · Apr 1, 2026</span>
            </div>
            <div className="p-4 space-y-2">
              <JELine label="DR" account={orig.cr} amount={orig.amount} />
              <JELine label="CR" account={orig.dr} amount={orig.amount} indent />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-[#424867] mb-1.5">Note (optional)</label>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add a note about this reversal..."
            className="w-full rounded-lg border border-[#e1e6ef] text-sm text-[#1d2433] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
            rows={2}
          />
        </div>

        <ActionRow
          primary={{ label: 'Post Reversal', onClick: handlePost }}
          secondary={[
            { label: 'Modify', onClick: () => setShowModify(true) },
            { label: 'Skip Period', onClick: onResolve, variant: 'ghost' },
          ]}
        />
        </div>
      </>
    );
  }

  if (item.kind === 'predicted') {
    const hist = item.historicalAmounts!;
    const avg = Math.round(hist.reduce((a, b) => a + b, 0) / hist.length);
    return (
      <>
        {jeModal}
        <div className="p-8 max-w-2xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
          <KindBadge kind="predicted" />
        </div>
        <p className="text-sm text-[#6b7280] mb-6">
          {item.entity} · {item.account} · AI suggested based on {hist.length}-month pattern
        </p>

        {/* Historical pattern */}
        <div className="rounded-lg border border-[#e1e6ef] p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#424867] uppercase tracking-wide">Historical Pattern</span>
            <span className="text-xs text-[#6b7280]">{hist.length}-month avg: <span className="font-mono font-semibold text-[#1d2433]">{fmt$(avg)}</span></span>
          </div>
          <Sparkline data={hist} labels={item.historicalLabels} color="#1fac76" />
          <div className="mt-1 text-[10px] text-[#adb2bb] text-right">Mar →</div>
        </div>

        {/* Suggested amount */}
        <div className="rounded-lg bg-[#ecfff8] border border-[#1fac76]/20 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#1c895f] font-medium mb-0.5">AI Suggested Amount</p>
              <p className="font-display text-2xl text-[#1d2433]">{fmt$(item.amount)}</p>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {item.amount > avg ? '+' : ''}{Math.round(((item.amount - avg) / avg) * 100)}% vs avg ·
                Account {item.accountCode}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#1c895f]">
              <Sparkles size={18} />
              <span className="text-xs font-semibold">94% confidence</span>
            </div>
          </div>
        </div>

        <AIReasoningBlock
          checks={[
            `${hist.length}-month historical pattern analysed — consistent within ±5%`,
            'Seasonality adjustment applied (none detected for this account)',
            'Vendor contract amount cross-referenced against AP subledger',
            'No budget variance detected at current predicted amount',
          ]}
        />

        {showModify && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#424867] mb-1.5">Modify Amount</label>
            <input
              type="text" value={modifiedAmount}
              onChange={e => setModifiedAmount(e.target.value)}
              className="w-48 rounded-lg border border-[#e1e6ef] text-sm font-mono text-[#1d2433] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xs font-medium text-[#424867] mb-1.5">Note (optional)</label>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="Explain any deviation from the predicted amount..."
            className="w-full rounded-lg border border-[#e1e6ef] text-sm text-[#1d2433] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
            rows={2}
          />
        </div>

        <ActionRow
          primary={{ label: `Post ${fmt$(Number(modifiedAmount.replace(/[^0-9]/g, '')) || item.amount)}`, onClick: handlePost }}
          secondary={[
            { label: 'Modify Amount', onClick: () => setShowModify(v => !v) },
            { label: 'Skip Period', onClick: onResolve, variant: 'ghost' },
          ]}
        />
        </div>
      </>
    );
  }

  // provision
  if (item.kind === 'provision') {
    const buckets = item.agingBuckets!;
    const overrides = item.overrideCustomers!;
    const totalAr = buckets.reduce((s, b) => s + b.ar, 0);
    const momChange = item.priorAmount ? item.amount - item.priorAmount : 0;
    const momPct = item.priorAmount ? Math.round((momChange / item.priorAmount) * 100) : 0;
    const bucketColors = ['#1fac76','#86efac','#fbbf24','#f97316','#ef4444'];

    return (
      <>
        {jeModal}
        {showReview && (
          <ProvisionReviewSlideOver
            item={item}
            initialStep={reviewInitialStep}
            onClose={() => setShowReview(false)}
            onPost={() => { setShowReview(false); onResolve(); }}
          />
        )}

        <div className="p-8 max-w-2xl">
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-display text-xl text-[#1d2433]">Bad Debt (AFDA) Provision</h2>
            <KindBadge kind="provision" />
          </div>
          <p className="text-sm text-[#6b7280] mb-5">
            {item.entity} · {item.account} · AI agent · OOTB v1.2
          </p>

          {/* Summary amounts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg border border-[#e1e6ef] p-4">
              <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Provision</div>
              <div className="text-xl font-semibold font-mono text-[#1d2433]">{fmt$(item.amount)}</div>
            </div>
            <div className="rounded-lg border border-[#e1e6ef] p-4">
              <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Prior Period</div>
              <div className="text-xl font-semibold font-mono text-[#6b7280]">{fmt$(item.priorAmount!)}</div>
            </div>
            <div className={cn('rounded-lg border p-4', momChange > 0 ? 'border-[#fcd34d] bg-[#fffbeb]' : 'border-[#a7f3d0] bg-[#ecfff8]')}>
              <div className="text-[10px] uppercase tracking-wide text-[#9ca3af] mb-1">Change</div>
              <div className={cn('text-xl font-semibold font-mono', momChange > 0 ? 'text-[#db7712]' : 'text-[#1fac76]')}>
                {momChange > 0 ? '+' : ''}{fmt$(momChange)} <span className="text-sm">({momPct > 0 ? '+' : ''}{momPct}%)</span>
              </div>
            </div>
          </div>

          {/* Aging breakdown */}
          <div className="rounded-lg border border-[#e1e6ef] mb-5 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f5f6f8] border-b border-[#e1e6ef] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#424867]">AR Aging Breakdown</span>
              <button
                onClick={() => { setReviewInitialStep(4); setShowReview(true); }}
                className="flex items-center gap-1 text-[11px] font-medium text-[#6b7280] hover:text-[#1fac76] transition-colors"
              >
                <Pencil size={10} /> Edit rates
              </button>
            </div>
            <div className="px-4 pt-3 pb-1">
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                {buckets.map((b, i) => (
                  <div key={i} className="h-full" style={{ width: `${(b.ar / totalAr) * 100}%`, background: bucketColors[i], borderRadius: i === 0 ? '4px 0 0 4px' : i === buckets.length-1 ? '0 4px 4px 0' : '0' }} />
                ))}
              </div>
              <div className="flex mt-1.5 mb-2">
                {buckets.map((b, i) => (
                  <div key={i} className="flex items-center gap-1" style={{ width: `${(b.ar / totalAr) * 100}%` }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: bucketColors[i] }} />
                    <span className="text-[9px] text-[#9ca3af] truncate">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-t border-[#f3f4f6]">
                  <th className="text-left px-4 py-2 text-[#9ca3af] font-medium">Bucket</th>
                  <th className="text-right px-4 py-2 text-[#9ca3af] font-medium">AR Balance</th>
                  <th className="text-right px-4 py-2 text-[#9ca3af] font-medium">Rate</th>
                  <th className="text-right px-4 py-2 text-[#9ca3af] font-medium">Provision</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map((b, i) => (
                  <tr key={i} className="border-t border-[#f3f4f6]">
                    <td className="px-4 py-2 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: bucketColors[i] }} />
                      {b.label}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-[#6b7280]">{fmt$(b.ar)}</td>
                    <td className="px-4 py-2 text-right text-[#6b7280]">{b.rate}%</td>
                    <td className="px-4 py-2 text-right font-mono font-medium text-[#1d2433]">{fmt$(b.provision)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#e1e6ef] bg-[#f9fafb]">
                  <td className="px-4 py-2 font-semibold" colSpan={3}>Total provision</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-[#1d2433]">{fmt$(item.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Reasoning */}
          <AIReasoningBlock
            flags={[
              `+${momPct}% vs prior period — exceeds 10% review threshold`,
              `${overrides.length} customers require non-standard treatment`,
            ]}
            checks={[
              `AR export processed — ${fmt$(totalAr)} total AR, 47 customers`,
              '3 intercompany rows identified and excluded ($420K)',
              'Aging buckets applied across 5 tiers to 44 customers',
              'Collections notes reviewed — no disputes in current bucket',
              'Standard aging rates applied per approved methodology',
            ]}
          />

          {/* Override customers */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#424867] mb-2.5 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-[#db7712]" />
              Customer overrides requiring your review
            </div>
            <div className="space-y-2">
              {overrides.map((c, i) => (
                <div key={i} className="rounded-lg border border-[#fcd34d] bg-[#fffbeb] p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-[#1d2433]">{c.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-sm text-[#1d2433]">{fmt$(c.amount)}</span>
                      <button
                        onClick={() => { setReviewInitialStep(3); setShowReview(true); }}
                        className="flex items-center gap-0.5 text-[11px] font-medium text-[#6b7280] hover:text-[#db7712] transition-colors"
                      >
                        <Pencil size={10} /> Edit
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-[#6b7280] mb-2">{c.reason}</div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-[10px] font-semibold rounded px-1.5 py-0.5 uppercase tracking-wide',
                      c.override === 'full' ? 'bg-[#fee2e2] text-[#d4183d]' : 'bg-[#fff8eb] text-[#db7712]'
                    )}>
                      {c.override === 'full' ? '100% provision' : `${c.rate}% specific`}
                    </span>
                    <span className="text-xs text-[#9ca3af]">Agent recommendation</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split CTAs */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handlePost}
              className="w-full flex items-center justify-center gap-2 bg-[#1fac76] hover:bg-[#179a67] text-white font-semibold text-sm rounded-lg px-4 py-3 transition-colors"
            >
              <Check size={16} /> Post provision {fmt$(item.amount)}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { setReviewInitialStep(5); setShowReview(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#e1e6ef] bg-white hover:bg-slate-50 text-[#424867] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                <BookOpen size={14} /> Review agent steps
              </button>
              <button
                onClick={() => { setReviewInitialStep(4); setShowReview(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#e1e6ef] bg-white hover:bg-slate-50 text-[#424867] font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
              >
                <Pencil size={14} /> Edit calculation
              </button>
            </div>
            <button
              onClick={onResolve}
              className="w-full text-center text-xs text-[#9ca3af] hover:text-[#6b7280] py-1 transition-colors"
            >
              Escalate to Controller
            </button>
          </div>
        </div>
      </>
    );
  }

  // variance-flagged
  const typical = item.typicalAmount!;
  const overPct = Math.round(((item.amount - typical) / typical) * 100);
  return (
    <>
      {jeModal}
      <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
        <KindBadge kind="variance-flagged" />
      </div>
      <p className="text-sm text-[#6b7280] mb-6">
        {item.entity} · {item.account} · Review before posting
      </p>

      {/* Comparison bar */}
      <div className="rounded-lg border border-[#e1e6ef] p-5 mb-5">
        <p className="text-xs font-semibold text-[#424867] uppercase tracking-wide mb-4">Amount vs Typical</p>
        <div className="space-y-3">
          <AmountBar label="Typical" amount={typical} max={item.amount} color="#1fac76" />
          <AmountBar label="This Month" amount={item.amount} max={item.amount} color="#db7712" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <AlertTriangle size={14} className="text-[#db7712] shrink-0" />
          <span className="text-[#db7712] font-medium">{overPct}% above typical amount</span>
          <span className="text-[#6b7280]">— explanation required</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-[#424867] mb-1.5">Explanation <span className="text-[#d4183d]">*</span></label>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Explain why this amount differs from the typical amount..."
          className="w-full rounded-lg border border-[#e1e6ef] text-sm text-[#1d2433] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
          rows={3}
        />
      </div>

      <ActionRow
        primary={{ label: 'Confirm & Post', onClick: handlePost, disabled: note.length < 5 }}
        secondary={[
          { label: 'Modify Amount', onClick: () => setShowModify(true) },
          { label: 'Escalate', onClick: onResolve, variant: 'ghost' },
        ]}
      />
      </div>
    </>
  );
}

function JELine({ label, account, amount, indent = false }: { label: string; account: string; amount: number; indent?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between text-sm', indent && 'pl-4')}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold w-4 text-[#adb2bb]">{label}</span>
        <span className="text-[#424867] font-mono text-xs">{account}</span>
      </div>
      <span className="font-mono text-xs text-[#1d2433]">{fmt$(amount)}</span>
    </div>
  );
}

function AmountBar({ label, amount, max, color }: { label: string; amount: number; max: number; color: string }) {
  const w = Math.round((amount / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#6b7280]">{label}</span>
        <span className="text-xs font-mono font-semibold text-[#1d2433]">{fmt$(amount)}</span>
      </div>
      <div className="h-2 rounded-full bg-[#f5f6f8] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Detail: Anomaly ──────────────────────────────────────────────────────────

function AnomalyDetail({ item, onResolve }: { item: AnomalyItem; onResolve: () => void }) {
  const [note, setNote] = useState('');
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.vendor}</h2>
        <SeverityBadge s={item.severity} />
      </div>
      <p className="text-sm text-[#6b7280] mb-6">
        {item.txnId} · {item.date} · {item.entity}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Amount" value={fmt$(item.amount)} mono />
        <StatCard label="Account" value={item.account} />
        <StatCard label="Flag Reason" value={item.flagReason} />
      </div>

      <AIReasoningBlock
        flags={[`${item.flagReason}`]}
        checks={[
          '12-month vendor payment history analysed',
          'Compared to same-period prior year — no matching transaction found',
          'GL account and cost center combination verified as valid',
          'Duplicate payment check passed — no matching TXN in period',
        ]}
      />

      <div className="mb-6">
        <label className="block text-xs font-medium text-[#424867] mb-1.5">Resolution Note</label>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Add context or explanation..."
          className="w-full rounded-lg border border-[#e1e6ef] text-sm text-[#1d2433] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
          rows={2}
        />
      </div>

      <ActionRow
        primary={{ label: 'Sign Off', onClick: onResolve }}
        secondary={[
          { label: 'Create JE', onClick: onResolve },
          { label: 'Escalate to Controller', onClick: onResolve, variant: 'ghost' },
        ]}
      />
    </div>
  );
}

// ─── Detail: Variance ─────────────────────────────────────────────────────────

function VarianceDetail({ item, onResolve }: { item: VarianceItem; onResolve: () => void }) {
  const [note, setNote] = useState('');
  const delta = item.actual - item.compareTo;
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.account}</h2>
        <span className="text-sm font-semibold text-[#db7712] bg-[#fff8eb] px-2 py-0.5 rounded">
          {pct(item.pctChange)} vs {item.compareLabel}
        </span>
      </div>
      <p className="text-sm text-[#6b7280] mb-6">{item.accountCode} · {item.period}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Actual" value={fmt$(item.actual)} mono highlight />
        <StatCard label={item.compareLabel} value={fmt$(item.compareTo)} mono />
        <StatCard label="Difference" value={`+${fmt$(delta)}`} mono warn />
      </div>

      <AmountBar label="Actual" amount={item.actual} max={item.actual} color="#db7712" />
      <div className="mt-2 mb-5">
        <AmountBar label={item.compareLabel} amount={item.compareTo} max={item.actual} color="#1fac76" />
      </div>

      <AIReasoningBlock
        flags={[`${item.pctChange > 0 ? '+' : ''}${item.pctChange}% vs ${item.compareLabel} — exceeds the 10% review threshold`]}
        checks={[
          `Compared ${item.period} actuals against ${item.compareLabel}`,
          'Sub-account breakdown reviewed — variance concentrated in 3 cost centres',
          'Prior-period journal entries scanned — no reclass found',
          'No offsetting variance detected in related accounts',
        ]}
      />

      <div className="mb-6">
        <label className="block text-xs font-medium text-[#424867] mb-1.5">Explain Variance <span className="text-[#d4183d]">*</span></label>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Describe the business reason for this variance..."
          className="w-full rounded-lg border border-[#e1e6ef] text-sm text-[#1d2433] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1fac76]/30 focus:border-[#1fac76]"
          rows={3}
        />
      </div>

      <ActionRow
        primary={{ label: 'Submit Explanation', onClick: onResolve, disabled: note.length < 5 }}
        secondary={[{ label: 'Escalate to Controller', onClick: onResolve, variant: 'ghost' }]}
      />
    </div>
  );
}

// ─── Detail: Approval ─────────────────────────────────────────────────────────

function ApprovalDetail({ item, onResolve }: { item: ApprovalItem; onResolve: () => void }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [agentOpen, setAgentOpen] = useState(true);
  const af = item.agentFinding;
  const flagCount = af?.flags.length ?? 0;
  const typeLabel = item.type === 'je' ? 'Journal Entry Batch' : 'Reconciliation';

  const riskLabel = !af ? null
    : af.riskScore >= 75 ? { text: 'High Risk',      color: 'text-[#d4183d]', bg: 'bg-[#fff1f4]', border: 'border-[#f5c6ce]' }
    : af.riskScore >= 30 ? { text: 'Elevated Risk',  color: 'text-[#db7712]', bg: 'bg-[#fff8eb]', border: 'border-[#f5d9a8]' }
    :                      { text: 'Low Risk',        color: 'text-[#1c895f]', bg: 'bg-[#ecfff8]', border: 'border-[#a3e6c8]' };

  const canApprove = flagCount === 0 || acknowledged;

  return (
    <div className="p-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
        <span className="text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-700 rounded px-1.5 py-0.5">
          Pending Approval
        </span>
      </div>
      <p className="text-sm text-[#6b7280] mb-5">
        {typeLabel} · {item.submittedBy} · {item.submittedAgo}
      </p>

      {/* Risk score + GL impact row */}
      {af && (
        <div className={cn('rounded-lg border p-4 mb-5 flex items-start justify-between gap-6', riskLabel!.bg, riskLabel!.border)}>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#adb2bb] mb-1">Risk Score</p>
            <div className="flex items-baseline gap-2">
              <span className={cn('font-display text-3xl font-bold', riskLabel!.color)}>{af.riskScore}</span>
              <span className={cn('text-xs font-semibold', riskLabel!.color)}>{riskLabel!.text}</span>
            </div>
            {flagCount > 0 && (
              <p className="text-xs text-[#6b7280] mt-1">{flagCount} flag{flagCount !== 1 ? 's' : ''} require review before approval</p>
            )}
            {flagCount === 0 && (
              <p className="text-xs text-[#1c895f] mt-1">All checks passed — safe to approve</p>
            )}
          </div>
          {af.glImpacts.length > 0 && (
            <div className="shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#adb2bb] mb-1.5">GL Impact</p>
              <div className="space-y-1">
                {af.glImpacts.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-[#6b7280]">{g.direction === 'increase' ? '↑' : '↓'} {g.label}</span>
                    <span className="font-mono font-semibold text-[#1d2433]">{g.direction === 'increase' ? '+' : '–'}{fmt$(g.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {af.glImpacts.length === 0 && (
            <div className="shrink-0 text-xs text-[#adb2bb] italic">No JE impact — reconciliation only</div>
          )}
        </div>
      )}

      {/* Entry summary */}
      <div className="rounded-lg border border-[#e1e6ef] p-4 mb-5">
        <p className="text-xs font-semibold text-[#424867] uppercase tracking-wide mb-3">Entry Summary</p>
        <div className="space-y-2">
          {Array.from({ length: Math.min(item.entryCount, 3) }, (_, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#6b7280]">JE-{2847 + i}</span>
              <span className="text-xs text-[#424867]">Accrual entry {i + 1}</span>
              <span className="text-xs font-mono text-[#1d2433]">{fmt$(Math.round(item.amount / item.entryCount))}</span>
            </div>
          ))}
          {item.entryCount > 3 && (
            <div className="text-xs text-[#adb2bb] pt-1">+{item.entryCount - 3} more entries</div>
          )}
        </div>
      </div>

      {/* Detective Copilot panel */}
      {af && (
        <div className="rounded-lg border border-[#e1e6ef] mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setAgentOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#7c3aed]" />
              <span className="text-xs font-semibold text-[#424867]">Detective Copilot</span>
              {flagCount > 0
                ? <span className="text-[10px] font-bold text-[#db7712] bg-[#fff8eb] rounded px-1.5 py-0.5">{flagCount} flag{flagCount !== 1 ? 's' : ''}</span>
                : <span className="text-[10px] font-semibold text-[#1c895f] bg-[#ecfff8] rounded px-1.5 py-0.5">All clear</span>
              }
            </div>
            {agentOpen ? <ChevronUp size={13} className="text-[#adb2bb]" /> : <ChevronDown size={13} className="text-[#adb2bb]" />}
          </button>

          {agentOpen && (
            <div className="divide-y divide-[#f5f6f8]">
              {/* Active flags */}
              {af.flags.map((flag, i) => (
                <div key={i} className="px-4 py-3.5 bg-white">
                  <div className="flex items-start gap-2 mb-1">
                    <AlertTriangle size={13} className="text-[#db7712] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#1d2433]">{flag.label}</span>
                        {flag.line && (
                          <span className="text-[10px] font-mono text-[#adb2bb] bg-[#f5f6f8] rounded px-1.5 py-0.5">{flag.line}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">{flag.detail}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Passing checks */}
              <div className="px-4 py-3 bg-white">
                <div className="space-y-1.5">
                  {af.passedChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={11} className="text-[#1fac76] shrink-0" />
                      <span className="text-xs text-[#adb2bb]">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Acknowledgement — only shown when flags exist */}
      {flagCount > 0 && (
        <label className="flex items-start gap-3 mb-5 cursor-pointer group">
          <div
            onClick={() => setAcknowledged(a => !a)}
            className={cn(
              'mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
              acknowledged ? 'bg-[#1fac76] border-[#1fac76]' : 'border-[#cbd2e1] group-hover:border-[#1fac76]',
            )}
          >
            {acknowledged && <Check size={10} className="text-white" />}
          </div>
          <span className="text-xs text-[#424867] leading-relaxed">
            I have reviewed the {flagCount} flagged item{flagCount !== 1 ? 's' : ''} and confirm this entry is correct.
            My approval will be logged with this acknowledgement.
          </span>
        </label>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onResolve} disabled={!canApprove}
          className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-[#1fac76] hover:bg-[#1c895f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
          <Check size={14} />
          {flagCount > 0 ? 'Approve with Acknowledgement' : 'Approve'}
        </button>
        <button onClick={onResolve}
          className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg border border-[#e1e6ef] hover:bg-[#f5f6f8] text-[#d4183d] text-sm transition-colors">
          <X size={13} /> Reject
        </button>
        <button onClick={onResolve}
          className="h-9 px-4 rounded-lg border border-[#e1e6ef] hover:bg-[#f5f6f8] text-[#6b7280] text-sm transition-colors">
          View All
        </button>
      </div>
    </div>
  );
}

// ─── Detail: Exception ────────────────────────────────────────────────────────

function ExceptionDetail({ item, onResolve }: { item: ExceptionItem; onResolve: () => void }) {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
        <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#fff1f4] text-[#d4183d] rounded px-1.5 py-0.5">{item.count} unmatched</span>
      </div>
      <p className="text-sm text-[#6b7280] mb-6">{item.source} · {item.note}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Exception Amount" value={fmt$(item.amount)} mono warn />
        <StatCard label="Count" value={String(item.count)} mono />
      </div>

      <div className="rounded-lg border border-[#e1e6ef] p-4 mb-6">
        <p className="text-xs font-semibold text-[#424867] uppercase tracking-wide mb-3">Unmatched Items</p>
        {Array.from({ length: item.count }, (_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#f5f6f8] last:border-0 text-sm">
            <div>
              <span className="text-xs font-mono text-[#6b7280]">TXN-{5100 + i}</span>
              <span className="text-xs text-[#424867] ml-2">3/{28 + i}/2026</span>
            </div>
            <span className="text-xs font-mono font-medium text-[#d4183d]">{fmt$(Math.round(item.amount / item.count))}</span>
          </div>
        ))}
      </div>

      <ActionRow
        primary={{ label: 'Open in Reconciliations', onClick: onResolve }}
        secondary={[{ label: 'Create Manual Match', onClick: onResolve, variant: 'ghost' }]}
      />
    </div>
  );
}

// ─── Detail: Task ─────────────────────────────────────────────────────────────

function TaskDetail({ item, onResolve }: { item: TaskItem; onResolve: () => void }) {
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-xl text-[#1d2433]">{item.title}</h2>
        {item.dueStatus === 'overdue'
          ? <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#fff1f4] text-[#d4183d] rounded px-1.5 py-0.5">Overdue</span>
          : <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#fff8eb] text-[#db7712] rounded px-1.5 py-0.5">Due Today</span>
        }
      </div>
      <p className="text-sm text-[#6b7280] mb-6">{item.module} · {item.timeNote}</p>

      <div className="rounded-lg border border-[#e1e6ef] p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className={item.dueStatus === 'overdue' ? 'text-[#d4183d]' : 'text-[#db7712]'} />
          <span className="text-xs font-semibold text-[#424867]">Close Task · March 2026</span>
        </div>
        <p className="text-sm text-[#424867]">
          Part of the March 2026 close checklist.
        </p>
      </div>

      {item.blocks && item.blocks.length > 0 && (
        <div className="rounded-lg border border-[#f5d9a8] bg-[#fffbeb] p-4 mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <ArrowUpRight size={13} className="text-[#db7712]" />
            <span className="text-xs font-semibold text-[#424867]">
              Completing this unblocks {item.blocks.length} item{item.blocks.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-1.5">
            {item.blocks.map((dep, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#db7712] shrink-0" />
                <span className="text-xs text-[#6b7280]">{dep}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ActionRow
        primary={{ label: 'Mark Complete', onClick: onResolve }}
        secondary={[
          { label: 'Open Task', onClick: onResolve },
          { label: 'Escalate to Controller', onClick: onResolve, variant: 'ghost' },
        ]}
      />
    </div>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function StatCard({ label, value, mono, highlight, warn }: { label: string; value: string; mono?: boolean; highlight?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-lg border border-[#e1e6ef] p-3">
      <p className="text-[10px] font-medium text-[#adb2bb] uppercase tracking-wide mb-1">{label}</p>
      <p className={cn(
        'text-sm font-semibold',
        mono && 'font-mono',
        highlight && 'text-[#1fac76]',
        warn && 'text-[#db7712]',
        !highlight && !warn && 'text-[#1d2433]',
      )}>{value}</p>
    </div>
  );
}

function ActionRow({ primary, secondary }: {
  primary: { label: string; onClick: () => void; disabled?: boolean };
  secondary?: { label: string; onClick: () => void; variant?: 'default' | 'ghost' }[];
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={primary.onClick}
        disabled={primary.disabled}
        className="flex items-center justify-center gap-2 h-9 px-5 rounded-lg bg-[#1fac76] hover:bg-[#1c895f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
        <Check size={13} /> {primary.label}
      </button>
      {secondary?.map(btn => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          className={cn(
            'h-9 px-4 rounded-lg text-sm transition-colors',
            btn.variant === 'ghost'
              ? 'text-[#6b7280] hover:text-[#1d2433] hover:bg-[#f5f6f8]'
              : 'border border-[#e1e6ef] text-[#424867] hover:bg-[#f5f6f8]',
          )}>
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyDetail({ totalOpen }: { totalOpen: number }) {
  const icon = totalOpen === 0 ? <CheckCircle size={32} className="text-[#1fac76]" /> : <Bell size={32} className="text-[#adb2bb]" />;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      {icon}
      {totalOpen === 0 ? (
        <>
          <h3 className="font-display text-xl text-[#1d2433] mt-4">Inbox zero</h3>
          <p className="text-sm text-[#6b7280] mt-2 max-w-xs">All items have been actioned. March close is looking good.</p>
        </>
      ) : (
        <>
          <h3 className="font-display text-xl text-[#1d2433] mt-4">Select an item</h3>
          <p className="text-sm text-[#6b7280] mt-2 max-w-xs">
            {totalOpen} item{totalOpen !== 1 ? 's' : ''} need your attention. Choose one from the inbox to review and act.
          </p>
        </>
      )}
    </div>
  );
}

// ─── DetailPanel ──────────────────────────────────────────────────────────────

function DetailPanel({ item, onResolve, totalOpen, items }: {
  item: InboxItem | null; onResolve: (id: string) => void; totalOpen: number; items: InboxItem[];
}) {
  if (!item) return (
    <div className="flex-1 flex items-center justify-center text-[#adb2bb] text-sm">
      No item selected
    </div>
  );

  const title = item.category === 'anomaly' ? item.vendor
    : item.category === 'accrual' ? item.title
    : item.category === 'variance' ? item.account
    : item.category === 'approval' ? item.title
    : item.category === 'exception' ? item.title
    : item.title;

  const categoryLabel: Record<Category, string> = {
    accrual: 'Accrual', anomaly: 'Anomaly', variance: 'Variance',
    approval: 'Approval', exception: 'Exception', task: 'Task',
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Detail header */}
      <div className="h-14 border-b border-[#e1e6ef] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-sm text-[#6b7280]">
          <span className="text-[#adb2bb]">{categoryLabel[item.category]}</span>
          <ChevronRight size={12} className="text-[#adb2bb]" />
          <span className="text-[#1d2433] font-medium truncate max-w-xs">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.resolved && (
            <span className="flex items-center gap-1 text-xs text-[#1fac76] font-medium">
              <CheckCircle size={12} /> Resolved
            </span>
          )}
          <button onClick={() => onResolve(item.id)}
            className="text-xs text-[#adb2bb] hover:text-[#6b7280] flex items-center gap-1 transition-colors">
            <ArrowUpRight size={12} /> Open full view
          </button>
        </div>
      </div>

      {/* Detail body — key forces remount on item change so local state resets */}
      <div key={item.id} className="flex-1 overflow-y-auto">
        {item.category === 'accrual'   && <AccrualDetail   item={item} onResolve={() => onResolve(item.id)} />}
        {item.category === 'anomaly'   && <AnomalyDetail   item={item} onResolve={() => onResolve(item.id)} />}
        {item.category === 'variance'  && <VarianceDetail  item={item} onResolve={() => onResolve(item.id)} />}
        {item.category === 'approval'  && <ApprovalDetail  item={item} onResolve={() => onResolve(item.id)} />}
        {item.category === 'exception' && <ExceptionDetail item={item} onResolve={() => onResolve(item.id)} />}
        {item.category === 'task'      && <TaskDetail      item={item} onResolve={() => onResolve(item.id)} />}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1d2433] text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle size={14} className="text-[#1fac76]" />
      {message}
      <button onClick={onDismiss} className="ml-2 text-[#adb2bb] hover:text-white">
        <X size={12} />
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [items, setItems] = useState<InboxItem[]>(SEED_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find(i => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  const totalOpen = useMemo(() => items.filter(i => !i.resolved).length, [items]);

  const handleResolve = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const toastMsg: Record<Category, string> = {
      accrual:   'Accrual posted successfully',
      anomaly:   'Anomaly signed off',
      variance:  'Variance explanation submitted',
      approval:  'Approval processed',
      exception: 'Exception opened in Reconciliations',
      task:      'Task marked complete',
    };

    setItems(prev => prev.map(i => i.id === id ? { ...i, resolved: true } : i));
    setToast(toastMsg[item.category]);
    setTimeout(() => setToast(null), 3500);

    // Auto-advance to next unresolved item
    const unresolved = items.filter(i => !i.resolved && i.id !== id);
    if (unresolved.length > 0) {
      setSelectedId(unresolved[0].id);
    } else {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#1d2433]">
      <SideNav />
      <InboxPanel items={items} selectedId={selectedId} onSelect={setSelectedId} />
      <DetailPanel item={selectedItem} onResolve={handleResolve} totalOpen={totalOpen} items={items} />
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
