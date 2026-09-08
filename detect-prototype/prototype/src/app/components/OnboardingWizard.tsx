import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { team } from '../../data/team';
import { chartOfAccounts } from '../../data/chartOfAccounts';

/**
 * Onboarding wizard for Detect — consolidates the three setup
 * dialogs (Ultimate Owner, Anomaly Assignment, ERP Field Mapping)
 * into a single guided experience.
 *
 * Per FlowUI's Wizard pattern (knowledge/design-system/components/
 * core/wizard.md), this is the modal variant: <3 steps and a
 * configuration-style flow. The COSO acknowledgment stays as a
 * separate legal gate before this wizard mounts.
 *
 * Step gates:
 *   1. Ultimate Owner       — REQUIRED. Next disabled until picked.
 *   2. Anomaly Assignment   — Optional. Skip or fill and continue.
 *   3. ERP Field Mapping    — Optional. Skip or fill and finish.
 *
 * Persistence: each step's localStorage key is committed only on
 * Finish, matching the keys read elsewhere (Settings → General,
 * ERPFieldMappingModal hook, FallbackAssigneeModal hook) so any
 * existing data flow keeps working without a separate migration.
 */

const ULTIMATE_OWNER_KEY = 'detect-ultimate-owner';
const ERP_MAPPINGS_KEY = 'detect-erp-field-mappings';
const FALLBACK_ASSIGNEES_KEY = 'detect-fallback-assignees';

export function useOnboardingComplete() {
  const [done, setDone] = useState(
    () =>
      localStorage.getItem(ULTIMATE_OWNER_KEY) !== null &&
      localStorage.getItem(ERP_MAPPINGS_KEY) !== null &&
      localStorage.getItem(FALLBACK_ASSIGNEES_KEY) !== null,
  );

  const markComplete = (
    ultimateOwnerId: string,
    mappings: Record<string, string>,
    assignments: Record<string, string>,
  ) => {
    localStorage.setItem(ULTIMATE_OWNER_KEY, ultimateOwnerId);
    localStorage.setItem(ERP_MAPPINGS_KEY, JSON.stringify(mappings));
    localStorage.setItem(FALLBACK_ASSIGNEES_KEY, JSON.stringify(assignments));
    setDone(true);
  };

  return { done, markComplete };
}

// ──────────────────────────────────────────────────────────────────
// Wizard shell
// ──────────────────────────────────────────────────────────────────

interface Props {
  onComplete: (
    ultimateOwnerId: string,
    mappings: Record<string, string>,
    assignments: Record<string, string>,
  ) => void;
}

const STEPS = [
  { id: 1, label: 'Ultimate Owner', required: true },
  { id: 2, label: 'Anomaly Assignment' },
  { id: 3, label: 'ERP Field Mapping' },
];

export function OnboardingWizard({ onComplete }: Props) {
  // currentStep 0 = welcome (orientation only, no inputs).
  // currentStep 1-3 = the three configuration steps.
  const [currentStep, setCurrentStep] = useState(0);
  const [ultimateOwnerId, setUltimateOwnerId] = useState('');
  // Seed with the auto-detected mappings so the ERP step opens with
  // the AI's first pass already in place. The "Needs review" group
  // surfaces the fields the AI couldn't confidently match.
  const [mappings, setMappings] = useState<Record<string, string>>(
    AUTO_DETECTED_MAPPINGS,
  );
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const TOTAL_STEPS = STEPS.length;
  // Per-step gates. Step 1 (Ultimate Owner) is required — block
  // Next until a user is picked. Steps 2 and 3 are optional.
  const stepGates: Record<number, boolean> = {
    0: true, // welcome — always advanceable
    1: !!ultimateOwnerId,
    2: true,
    3: true,
  };

  const handlePrimary = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete(ultimateOwnerId, mappings, assignments);
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    } else {
      // Skipping the final step is the same as Finish — commit
      // whatever's in state (which may be empty objects).
      onComplete(ultimateOwnerId, mappings, assignments);
    }
  };

  // Back can return to the welcome (step 0) from step 1, but
  // welcome itself has no further "back" target.
  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  // Closing the wizard on an optional step (Anomaly Assignment or
  // ERP Field Mapping) is equivalent to Skip → Finish — commit
  // whatever the user has entered so they don't have to walk back
  // through the wizard later. Closing is blocked on the welcome
  // and Ultimate Owner steps; Ultimate Owner is required and
  // there's nothing to commit from the welcome screen.
  const canCloseAtCurrentStep = currentStep >= 2;
  const handleClose = () => {
    if (!canCloseAtCurrentStep) return;
    onComplete(ultimateOwnerId, mappings, assignments);
  };

  useEffect(() => {
    if (!canCloseAtCurrentStep) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canCloseAtCurrentStep, ultimateOwnerId, mappings, assignments]);

  return (
    <div className="fixed bottom-0 right-0 left-[56px] top-[60px] z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* Scrim is inset by the side rail (56px) and the global
           top tab nav (60px) so users can still switch products
           or tabs while the wizard is open. */}
      {/* Modal sizes to its content: short steps (Welcome, Ultimate
           Owner) render compact with no empty whitespace, while
           long steps (Anomaly Assignment, ERP Field Mapping) cap at
           88vh and scroll inside the body. Dropping `h-full` lets
           the flex column hug its children instead of always
           filling the parent. */}
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]">
        {/* Header — title + supporting copy. Step indicator was
             removed per design: the per-step content already states
             where the user is, and Back / Next / Finish in the
             footer make navigation explicit. */}
        {/* Header — title shifts per step. Step 0 (welcome) shows
             the wizard-level title; steps 1-3 echo each step's own
             title so the user always knows where they are. The
             body sub-headings are dropped on those steps to avoid
             duplicating the same text twice. */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e1e6ef] bg-white px-6 py-5">
          <h2 className="font-header text-lg font-bold leading-6 text-[#1d2433]">
            {currentStep === 0 && 'Getting Started with FQ Detect'}
            {currentStep === 1 && 'Set Your Ultimate Owner'}
            {currentStep === 2 && 'Anomaly Assignment'}
            {currentStep === 3 && 'Map Your ERP Fields'}
          </h2>
          {canCloseAtCurrentStep && (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Skip and close"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </header>

        {/* Body — scrollable per-step content. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {currentStep === 0 && <WelcomeStep />}
          {currentStep === 1 && (
            <UltimateOwnerStep
              value={ultimateOwnerId}
              onChange={setUltimateOwnerId}
            />
          )}
          {currentStep === 2 && (
            <FallbackAssigneesStep
              assignments={assignments}
              onChange={setAssignments}
            />
          )}
          {currentStep === 3 && (
            <ERPMappingStep mappings={mappings} onChange={setMappings} />
          )}
        </div>

        {/* Footer — adapts per step.
              • Welcome (0): single right-aligned "Get Started" CTA;
                no Back, no Skip — the welcome is one-way.
              • Configuration steps (1-3): Back on the left, Skip
                (optional steps only) + Next/Finish on the right. */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e1e6ef] bg-white px-6 py-3">
          {currentStep === 0 ? (
            <>
              <span />
              <button
                type="button"
                onClick={handlePrimary}
                className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433] disabled:cursor-not-allowed disabled:text-[#adb2bb] disabled:hover:bg-transparent disabled:hover:text-[#adb2bb]"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
                  >
                    Skip for Now
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePrimary}
                  disabled={!stepGates[currentStep]}
                  className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30 disabled:hover:bg-[#1FAC76]/30"
                >
                  {currentStep < TOTAL_STEPS ? 'Next' : 'Finish'}
                </button>
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Step 0 — Welcome / Orientation
// ══════════════════════════════════════════════════════════════════

function WelcomeStep() {
  // Three items below match the configuration steps the user is
  // about to walk through. Keeping descriptions intentionally
  // short — this is orientation, not instruction.
  //
  // The `optional` flag drives an info-blue FlowUI TableStatusBadge
  // next to the title. Required steps don't render a badge — being
  // the default state, they don't need to call themselves out.
  const items: { title: string; description: string; optional?: boolean }[] = [
    {
      title: 'Ultimate Owner',
      description: 'Your safety net for unassigned anomalies.',
    },
    {
      title: 'Anomaly Assignment',
      description: 'Define who reviews each entity-account combination.',
      optional: true,
    },
    {
      title: 'ERP Field Mapping',
      description: "So we match your ERP's labels.",
      optional: true,
    },
  ];

  return (
    <div className="flex flex-col gap-5 px-6 py-6">
      <div>
        <h3 className="font-header text-base font-bold leading-5 text-[#1d2433]">
          Welcome to FQ Detect
        </h3>
        <p className="mt-2 max-w-[540px] font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          Detect catches anomalous transactions and surfaces what&apos;s
          missing from your books before close. The next few steps wire
          up who reviews what, and how we map your ERP&apos;s data — all
          of which you can change anytime in Settings.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433]">
          Here&apos;s what we&apos;ll set up
        </p>
        <ol className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-md border border-[#e1e6ef] bg-white px-4 py-3"
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f3f9] font-['Inter'] text-[11px] font-bold leading-4 text-[#424867]">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
                    {item.title}
                  </p>
                  {item.optional && (
                    // FlowUI TableStatusBadge — info-blue variant
                    // (`#f0f5ff` background / `#3d7bf7` text) for
                    // the "Optional" label. Required steps render
                    // no badge since "required" is the default
                    // state and doesn't need its own callout.
                    <span className="inline-flex items-center rounded-[4px] bg-[#f0f5ff] px-1.5 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-[#3d7bf7]">
                      Optional
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Step 1 — Ultimate Owner
// ══════════════════════════════════════════════════════════════════

function UltimateOwnerStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="px-6 py-5">
      {/* Title rendered in the modal header — body starts with the
           explanatory paragraph so we don't repeat the same heading. */}
      <p className="max-w-[540px] font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
        Pick the user who acts as the final fallback for anomaly assignments.
        If no fallback assignees are set and no rule owner exists, anomalies
        are assigned to this user so they don&apos;t slip through unreviewed.
        <br />
        <br />
        You can change this later under Settings → General.
      </p>

      <label className="mt-5 block">
        <span className="font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
          Ultimate Owner
        </span>
        <div className="mt-1.5 max-w-[320px]">
          <UserPicker value={value} onChange={onChange} />
        </div>
      </label>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Step 3 — ERP Field Mapping
// ══════════════════════════════════════════════════════════════════

const FLOQAST_FIELDS = [
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'transactionLine', label: 'Transaction Line' },
  { id: 'transactionDate', label: 'Transaction Date' },
  { id: 'postingPeriod', label: 'Posting Period' },
  { id: 'amount', label: 'Amount' },
  { id: 'currency', label: 'Currency' },
  { id: 'type', label: 'Type' },
  { id: 'subsidiary', label: 'Entity' },
  { id: 'account', label: 'Account' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'memo', label: 'Memo' },
  { id: 'department', label: 'Department' },
  { id: 'class', label: 'Class' },
  { id: 'location', label: 'Location' },
  { id: 'createdDate', label: 'Created Date' },
  { id: 'createdBy', label: 'Created By' },
];

// Sample ERP source fields — represents the fields the system was
// able to read from the customer's ERP at sync time. In production
// this list would be derived from a real ERP introspection call;
// for the prototype, it's a representative NetSuite-flavored set.
const ERP_SOURCE_FIELDS: { id: string; label: string }[] = [
  { id: 'internal_id', label: 'Internal ID (id)' },
  { id: 'tran_id', label: 'Transaction Number (tranid)' },
  { id: 'line_uniquekey', label: 'Line Key (lineuniquekey)' },
  { id: 'line_seq', label: 'Line Sequence' },
  { id: 'tran_date', label: 'Trans Date (trandate)' },
  { id: 'posted_date', label: 'Posted Date' },
  { id: 'period', label: 'Period (postingperiod)' },
  { id: 'amount', label: 'Amount' },
  { id: 'fx_amount', label: 'FX Amount' },
  { id: 'currency', label: 'Currency' },
  { id: 'trans_type', label: 'Transaction Type' },
  { id: 'record_type', label: 'Record Type (recordtype)' },
  { id: 'subsidiary', label: 'Subsidiary' },
  { id: 'account', label: 'Account' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'entity_name', label: 'Entity (entityname)' },
  { id: 'memo', label: 'Memo' },
  { id: 'description', label: 'Description' },
  { id: 'department', label: 'Department' },
  { id: 'class', label: 'Class' },
  { id: 'location', label: 'Location' },
  { id: 'date_created', label: 'Date Created (datecreated)' },
  { id: 'created_by', label: 'Created By (createdby)' },
  { id: 'approved_date', label: 'Approved Date' },
  { id: 'reference_no', label: 'Reference No' },
  { id: 'status', label: 'Status' },
];

// Auto-detected mappings — the rows the AI was confident about based
// on exact-name or near-match. 10 of 16 FloQast fields. The other 6
// surface in the "Needs review" group so the user can pick from the
// ERP source list above.
const AUTO_DETECTED_MAPPINGS: Record<string, string> = {
  postingPeriod: 'period',
  amount: 'amount',
  currency: 'currency',
  subsidiary: 'subsidiary',
  account: 'account',
  vendor: 'vendor',
  memo: 'memo',
  department: 'department',
  class: 'class',
  location: 'location',
};

function ERPMappingStep({
  mappings,
  onChange,
}: {
  mappings: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const setField = (id: string, value: string) =>
    onChange({ ...mappings, [id]: value });

  // Section assignment is anchored to the AUTO_DETECTED_MAPPINGS
  // snapshot, NOT the current `mappings` state — once a field
  // started life in "Needs review," it stays in that group even
  // after the user picks an ERP field for it. Prevents the rows
  // from reshuffling between sections as the user fills them in.
  const unmappedFields = FLOQAST_FIELDS.filter(
    (f) => !(f.id in AUTO_DETECTED_MAPPINGS),
  );
  const mappedFields = FLOQAST_FIELDS.filter(
    (f) => f.id in AUTO_DETECTED_MAPPINGS,
  );

  // Count of unmapped fields still without a user pick — drives
  // the section header's count-down indicator.
  const unmappedRemaining = unmappedFields.filter(
    (f) => !mappings[f.id],
  ).length;

  return (
    <div>
      <div className="px-6 py-5">
        {/* Title rendered in the modal header — body opens with
             the explanatory paragraph only. */}
        <p className="max-w-[540px] font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          We auto-matched the fields below using your ERP's metadata. Review
          the ones we couldn&apos;t confidently match, then double-check the
          rest. All fields are optional — you can come back later.
        </p>
      </div>

      {/* Section 1 — Needs review (unmapped). Amber treatment to
           draw attention; rows have a left amber accent to read as
           "action items." */}
      <section className="border-y border-[#e1e6ef]">
        <header className="flex items-center justify-between gap-2 bg-[#fff8eb] px-6 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="h-4 w-4 shrink-0 text-[#db7712]"
              strokeWidth={2}
            />
            <span className="font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
              Needs review
            </span>
            <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#424867]">
              · {unmappedRemaining} of {unmappedFields.length}{' '}
              {unmappedFields.length === 1 ? 'field' : 'fields'} still need a
              match
            </span>
          </div>
        </header>
        <div className="divide-y divide-[#e1e6ef]">
          {unmappedFields.map((field) => (
            <ERPMappingRow
              key={field.id}
              field={field}
              value={mappings[field.id] ?? ''}
              onChange={(v) => setField(field.id, v)}
              variant="unmapped"
            />
          ))}
        </div>
      </section>

      {/* Section 2 — Auto-mapped. Neutral treatment, secondary
           visual weight. Still editable but lower-priority. */}
      <section>
        <header className="flex items-center justify-between gap-2 bg-[#f8fafc] px-6 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle
              className="h-4 w-4 shrink-0 text-[#1FAC76]"
              strokeWidth={2}
            />
            <span className="font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
              Auto-mapped
            </span>
            <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#424867]">
              · {mappedFields.length}{' '}
              {mappedFields.length === 1 ? 'field' : 'fields'} matched
              automatically
            </span>
          </div>
        </header>
        <div className="divide-y divide-[#e1e6ef]">
          {mappedFields.map((field) => (
            <ERPMappingRow
              key={field.id}
              field={field}
              value={mappings[field.id] ?? ''}
              onChange={(v) => setField(field.id, v)}
              variant="mapped"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ERPMappingRow({
  field,
  value,
  onChange,
  variant,
}: {
  field: { id: string; label: string };
  value: string;
  onChange: (next: string) => void;
  variant: 'unmapped' | 'mapped';
}) {
  const isUnmapped = variant === 'unmapped';
  const isUnpicked = isUnmapped && !value;
  return (
    <div
      className={`grid grid-cols-[1fr_minmax(0,1fr)] items-center gap-3 px-6 py-2.5 ${
        isUnpicked ? 'border-l-2 border-[#db7712] pl-[22px]' : ''
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate font-['Inter'] text-[13px] font-semibold leading-5 text-[#1d2433]">
          {field.label}
        </span>
        <ArrowRight className="h-3 w-3 shrink-0 text-[#cbd2e1]" />
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-9 w-full appearance-none rounded-md border bg-white pl-2 pr-8 font-['Inter'] text-[12px] leading-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none ${
            isUnpicked
              ? 'border-[#db7712] text-[#adb2bb]'
              : 'border-[#cbd2e1] text-[#1d2433]'
          }`}
        >
          <option value="">Select an ERP field…</option>
          {ERP_SOURCE_FIELDS.map((src) => (
            <option key={src.id} value={src.id}>
              {src.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Step 2 — Anomaly Assignment
// ══════════════════════════════════════════════════════════════════

const TYPE_LABELS: Record<string, string> = {
  asset: 'Assets',
  liability: 'Liabilities',
  equity: 'Equity',
  revenue: 'Revenue',
  cogs: 'Cost of Goods Sold',
  opex: 'Operating Expenses',
};
const TYPE_ORDER = ['asset', 'liability', 'equity', 'revenue', 'cogs', 'opex'];

function downloadTemplate(currentAssignments: Record<string, string>) {
  const nameById = Object.fromEntries(team.map((m) => [m.id, m.name]));
  const validNames = team.map((m) => m.name).join(' | ');
  const rows = [
    [`# Valid assignee names: ${validNames}`],
    ['Account Code', 'Account Name', 'Assignee Name'],
    ...chartOfAccounts.map((a) => [
      a.code,
      a.name,
      nameById[currentAssignments[a.code]] ?? '',
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'detect-fallback-assignees.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string> {
  const nameToId = Object.fromEntries(
    team.map((m) => [m.name.toLowerCase(), m.id]),
  );
  const result: Record<string, string> = {};
  const lines = text.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  for (const line of lines.slice(1)) {
    const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
    const [code, , assigneeName] = cols;
    if (code && assigneeName) {
      const userId = nameToId[assigneeName.toLowerCase()];
      if (userId) result[code] = userId;
    }
  }
  return result;
}

function FallbackAssigneesStep({
  assignments,
  onChange,
}: {
  assignments: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groups: Record<string, typeof chartOfAccounts> = {};
  for (const type of TYPE_ORDER) {
    groups[type] = chartOfAccounts.filter((a) => a.type === type);
  }

  const setAccount = (code: string, userId: string) =>
    onChange({ ...assignments, [code]: userId });

  const setGroup = (type: string, userId: string) => {
    const codes = groups[type].map((a) => a.code);
    const next = { ...assignments };
    for (const code of codes) next[code] = userId;
    onChange(next);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadCount(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        const count = Object.keys(parsed).length;
        if (count === 0) {
          setUploadError(
            'No matching assignees found. Check that names match exactly.',
          );
        } else {
          onChange({ ...assignments, ...parsed });
          setUploadCount(count);
        }
      } catch {
        setUploadError('Could not parse the file. Make sure it is a valid CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <div className="px-6 py-5">
        {/* Title rendered in the modal header — body opens with
             the explanatory paragraph only. */}
        <p className="max-w-[540px] font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
          When an anomaly is detected, define which users should be notified
          for every Entity-Account combination.
        </p>
      </div>

      {/* Bulk actions toolbar */}
      <div className="flex items-center justify-between gap-3 border-y border-[#e1e6ef] bg-[#f8fafc] px-6 py-2">
        <span className="font-['Inter'] text-[11px] font-medium text-[#6b7280]">
          Bulk assign via CSV
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadTemplate(assignments)}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#e1e6ef] bg-white px-2.5 font-header text-[11px] font-bold text-[#424867] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
          >
            <Download className="h-3 w-3" />
            Download Template
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#e1e6ef] bg-white px-2.5 font-header text-[11px] font-bold text-[#424867] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
          >
            <Upload className="h-3 w-3" />
            Upload CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Upload feedback */}
      {(uploadError || uploadCount !== null) && (
        <div
          className={`flex items-center gap-2 px-6 py-2 font-['Inter'] text-[11px] ${
            uploadError
              ? 'bg-[#fef2f2] text-[#c43838]'
              : 'bg-[#ecfff8] text-[#186749]'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {uploadError ??
            `${uploadCount} assignment${uploadCount !== 1 ? 's' : ''} imported from file.`}
        </div>
      )}

      {/* Grouped account list */}
      {TYPE_ORDER.map((type) => {
        const accounts = groups[type];
        if (!accounts?.length) return null;
        const isCollapsed = collapsed[type];
        const groupAssigned = accounts.filter((a) => assignments[a.code])
          .length;

        return (
          <div key={type} className="border-b border-[#e1e6ef] last:border-0">
            <div className="flex items-center justify-between gap-3 bg-[#f8fafc] px-6 py-2">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }))
                }
                className="flex items-center gap-1.5 font-['Inter'] text-[12px] font-semibold leading-4 text-[#1d2433] hover:text-[#1d2433]"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                {TYPE_LABELS[type]}
                <span className="ml-1 font-normal text-[#adb2bb]">
                  ({accounts.length} accounts
                  {groupAssigned > 0 ? `, ${groupAssigned} assigned` : ''})
                </span>
              </button>

              <div className="relative shrink-0">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setGroup(type, e.target.value);
                  }}
                  className="h-7 cursor-pointer appearance-none rounded-md border border-[#e1e6ef] bg-white pl-2.5 pr-7 font-['Inter'] text-[11px] text-[#6b7280] hover:border-[#cbd2e1] focus:outline-none"
                >
                  <option value="">Set all…</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6b7280]" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="divide-y divide-[#e1e6ef]">
                {accounts.map((account) => {
                  const isChild = !!account.parentCode;
                  const assigned = assignments[account.code];
                  return (
                    <div
                      key={account.code}
                      className="flex items-center justify-between gap-3 px-6 py-2"
                      style={{ paddingLeft: isChild ? '2.5rem' : undefined }}
                    >
                      <div className="flex min-w-0 items-baseline gap-2">
                        <span className="shrink-0 font-mono text-[11px] text-[#adb2bb]">
                          {account.code}
                        </span>
                        <span className="truncate font-['Inter'] text-[12px] text-[#1d2433]">
                          {account.name}
                        </span>
                      </div>
                      <div className="relative shrink-0">
                        <select
                          value={assigned ?? ''}
                          onChange={(e) =>
                            setAccount(account.code, e.target.value)
                          }
                          className={`h-7 cursor-pointer appearance-none rounded-md border bg-white pl-2.5 pr-7 font-['Inter'] text-[11px] focus:outline-none ${
                            assigned
                              ? 'border-[#cbd2e1] text-[#1d2433]'
                              : 'border-[#e1e6ef] text-[#adb2bb] hover:border-[#cbd2e1]'
                          }`}
                        >
                          <option value="">Unassigned</option>
                          {team.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6b7280]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// UserPicker — pinned-search dropdown shared with SettingsModal's
// Ultimate Owner control. Inlined here so the wizard is self-
// contained and the styling stays in lock-step with the rest of
// the prototype.
// ──────────────────────────────────────────────────────────────────

function UserPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  // Panel position is computed against the trigger's bounding box
  // and rendered via createPortal to document.body so it can't be
  // clipped by the wizard modal's overflow-hidden.
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !triggerRef.current?.contains(t) &&
        !panelRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSearch('');
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const selected = team.find((m) => m.id === value);
  const q = search.trim().toLowerCase();
  const filtered = team
    .filter((m) => m.id !== value)
    .filter((m) => (q ? m.name.toLowerCase().includes(q) : true));

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-md border px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          open
            ? 'border-[#3d7bf7] bg-white'
            : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
        }`}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={selected.avatar}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
            <span className="truncate font-['Inter'] text-xs font-normal leading-4 text-[#1d2433]">
              {selected.name}
            </span>
          </span>
        ) : (
          <span className="font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
            Select a user…
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#3d7bf7]' : 'text-[#6b7280]'
          }`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="listbox"
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] flex max-h-64 flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={panelStyle}
          >
          <div className="relative shrink-0 border-b border-[#e1e6ef] px-2 py-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
                No matches
              </p>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="option"
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left transition-colors hover:bg-[#f1f3f9]"
                >
                  <img
                    src={m.avatar}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]">
                    {m.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
