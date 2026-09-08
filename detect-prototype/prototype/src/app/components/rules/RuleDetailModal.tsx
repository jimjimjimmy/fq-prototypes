import { useEffect, useRef, useState } from 'react';
import {
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import { useAppStore } from '../../../store/useAppStore';
import { RULE_ASSIGNEES } from '../../../data/ruleAssignees';
import { getTeamMember, team } from '../../../data/team';
import { entities, currentPeriodId } from '../../../data/company';
import type { Rule } from '../../../data/types';
import { AddRulePage } from './AddRulePage';
import { DiscardChangesDialog } from './DiscardChangesDialog';
import { getTransactionFieldLabel } from '../../../data/transactionFields';

/**
 * Per-rule view-only modal — opens when the user clicks a rule link
 * from an anomaly's "detected by" affordance. Mirrors the Add Rule
 * form's section structure (Rule Details · Rule Parameters ·
 * Assignees) so the prototype has one consistent rule-rendering
 * language, but everything is presentational — no inputs, no
 * dropdowns. Also surfaces an anomaly summary strip at the top and
 * a collapsible Activity Log at the bottom.
 *
 * Design reference: Figma node 2130:37989 in the Rules file.
 */

// Map the rule's id to a stable "FQ Rule ID" (R-1, R-2, ...) based
// on its position in the rules list. Just demo formatting — keeps
// the read-only "FQ Rule ID" field looking like a real identifier.
function fqRuleIdFor(rules: Rule[], ruleId: string): string {
  const idx = rules.findIndex((r) => r.id === ruleId);
  return idx >= 0 ? `R-${idx + 1}` : '—';
}

// Friendly operator phrase used in the read-only condition sentence.
// Accepts both camelCase (as stored on the rule data model — e.g. "lessThan",
// "notEquals") and kebab-case (as used by the form's dropdown — e.g.
// "is-less-than", "is-not"). Both must map to the same phrase or the
// view-only sentence shows raw operator strings.
function operatorPhrase(operator: string): string {
  const map: Record<string, string> = {
    // Equality
    equals: 'is',
    is: 'is',
    notEquals: 'is not',
    'not-equals': 'is not',
    'is-not': 'is not',
    // Comparison
    greaterThan: 'is greater than',
    'greater-than': 'is greater than',
    'is-greater-than': 'is greater than',
    greaterThanOrEqual: 'is greater than or equal to',
    'greater-than-or-equal': 'is greater than or equal to',
    'is-greater-than-or-equal': 'is greater than or equal to',
    lessThan: 'is less than',
    'less-than': 'is less than',
    'is-less-than': 'is less than',
    lessThanOrEqual: 'is less than or equal to',
    'less-than-or-equal': 'is less than or equal to',
    'is-less-than-or-equal': 'is less than or equal to',
    // Text matching
    contains: 'contains',
    // "matches" in seed data is shorthand for regex-style/contains — read
    // it the same way the form's edit mode does.
    matches: 'contains',
    doesNotContain: 'does not contain',
    'does-not-contain': 'does not contain',
    startsWith: 'starts with',
    'starts-with': 'starts with',
    endsWith: 'ends with',
    'ends-with': 'ends with',
    // Date
    isOnOrAfter: 'is on or after',
    'is-on-or-after': 'is on or after',
    isOnOrBefore: 'is on or before',
    'is-on-or-before': 'is on or before',
    // Empty
    isBlank: 'is blank',
    'is-blank': 'is blank',
    isNotBlank: 'is not blank',
    'is-not-blank': 'is not blank',
    // Range / sets
    between: 'is between',
    isAnyOf: 'is any of',
    'is-any-of': 'is any of',
    isNoneOf: 'is none of',
    'is-none-of': 'is none of',
  };
  return map[operator] ?? operator;
}

function formatFieldName(field: string): string {
  if (!field) return '—';
  // Resolved against the canonical Transaction field catalog so this
  // sentence renderer stays in lockstep with the Transaction Details
  // panel and rule editor dropdowns (subsidiary → "Entity",
  // legacy `date` → "Transaction Date", etc.).
  const label = getTransactionFieldLabel(field);
  if (label !== field) return label;
  return field.charAt(0).toUpperCase() + field.slice(1);
}

/**
 * "2024-03" → "March 2024". Falls back to the raw id if parsing fails
 * so unknown formats still display something. */
function formatPeriodId(id: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(id);
  if (!m) return id;
  const [, year, month] = m;
  const monthIdx = Math.max(0, Math.min(11, Number(month) - 1));
  const monthName = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ][monthIdx];
  return `${monthName} ${year}`;
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} • ${d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  } catch {
    return iso;
  }
}

// Separate date/time formatters used by the Activity Log metadata row.
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  });
}

export function RuleDetailModal({
  ruleId,
  onClose,
  mode = 'view',
  onBackToList,
  onSaveSuccess,
  onDuplicate,
  onDeactivate,
  onActivate,
}: {
  ruleId: string;
  onClose: () => void;
  /** Triggered when the user picks "Duplicate Rule" from the kebab
   *  inside the view-mode breadcrumb row. Host typically transitions
   *  the modal to duplicate mode for the same rule. */
  onDuplicate?: () => void;
  /** Triggered when the user picks "Deactivate Rule" from the kebab
   *  (only fires when the rule is currently active). Host opens the
   *  deactivate warning dialog. */
  onDeactivate?: () => void;
  /** Triggered when the user picks "Activate Rule" from the kebab
   *  (only fires when the rule is currently inactive). Host flips
   *  the rule's status back to active. No confirmation dialog. */
  onActivate?: () => void;
  /** Fires after the user confirms the Save Rule dialog. Host wires
   *  this to show the success toast. */
  onSaveSuccess?: (info: {
    scope: 'current-and-future' | 'with-historical';
    historicalPeriods: string[];
    formSnapshot?: {
      name: string;
      description: string;
      severity: number;
      conditions: Array<{ field: string; operator: string; value: string }>;
    };
  }) => void;
  /**
   * Modal mode:
   *   - 'view': read-only sections + Edit button in header. Default.
   *   - 'edit': opens directly in the Add Rule form pre-populated
   *     with this rule. Activity Log stays visible below the form.
   *     Cancel/Save returns to view mode.
   *   - 'duplicate': opens in the form pre-populated with the source
   *     rule's data, name prepended with "(Copy) ". Modal title
   *     reads "Duplicate Rule". Cancel/Save closes the modal
   *     entirely (no view to return to — this is a creation flow).
   */
  mode?: 'view' | 'edit' | 'duplicate';
  /** Optional "Back to Rules" callback. When provided, renders a
   *  breadcrumb at the top of the modal body so the user can
   *  navigate back to the Rules list (rather than dismissing the
   *  modal entirely). Wired by the host (App.tsx) only when the
   *  modal was opened from the Rules list modal. */
  onBackToList?: () => void;
}) {
  const rules = useAppStore((s) => s.rules);
  const rule = rules.find((r) => r.id === ruleId);
  // editMode reflects which view the user is currently looking at.
  // 'duplicate' and 'edit' both start in editMode=true. From there:
  //   - 'duplicate': Cancel/Save closes the modal (no view to return to)
  //   - 'edit': Cancel/Save returns to view (editMode → false)
  //   - 'view': starts false; Edit button toggles to true; Cancel/Save returns to false
  const [editMode, setEditMode] = useState(mode !== 'view');
  // Which version of the rule the user is currently viewing. Defaults
  // to the rule's current version. Only relevant in view mode — edit
  // and duplicate flows always operate on the current version.
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);

  // Dirty state of the embedded AddRulePage form (when editing or
  // duplicating). Tracked via ref for synchronous reads inside
  // close handlers; the no-op re-render trigger keeps the discard
  // logic reactive too.
  const formDirty = useRef(false);
  const [, forceRerender] = useState(0);
  const setFormDirty = (d: boolean) => {
    formDirty.current = d;
    forceRerender((v) => v + 1);
  };
  // Pending close action queued behind the discard-changes warning.
  const [pendingClose, setPendingClose] = useState<null | (() => void)>(null);

  // Gated close — when editing, divert dirty-state dismissals into
  // the discard warning. View mode skips the gate entirely.
  const attemptClose = (action: () => void) => {
    if (editMode && formDirty.current) {
      setPendingClose(() => action);
    } else {
      action();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (pendingClose) {
        setPendingClose(null);
        return;
      }
      attemptClose(onClose);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, editMode, pendingClose]);

  if (!rule) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-[#e1e6ef] bg-white p-6 shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1)]"
        >
          <p className="font-['Inter'] text-[12px] text-[#6b7280]">Rule not found.</p>
        </div>
      </div>
    );
  }

  const fqRuleId = fqRuleIdFor(rules, rule.id);
  const assigneeIds = RULE_ASSIGNEES[rule.id] ?? ['dynamic'];
  const owner = getTeamMember(rule.createdById) ?? team[0];
  // Severity slider position — map 0–100 to 1–5.
  const severityLevel = Math.max(1, Math.min(5, Math.ceil(rule.severity / 20)));

  // Version list for the header chip's dropdown. V1 is synthesized
  // from the rule's createdAt/createdById; V2+ come from
  // versionHistory entries. Sorted newest first for display.
  const currentVersion = rule.version ?? 1;
  const allVersionEntries = [
    {
      version: 1,
      editedAt: rule.createdAt,
      editedById: rule.createdById,
    },
    ...(rule.versionHistory ?? []).map((e) => ({
      version: e.version,
      editedAt: e.editedAt,
      editedById: e.editedById,
    })),
  ];
  const versionsNewestFirst = [...allVersionEntries].reverse();
  const activeVersion = viewingVersion ?? currentVersion;
  const isViewingCurrent = activeVersion === currentVersion;
  const viewingEntry = allVersionEntries.find((e) => e.version === activeVersion);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={() => attemptClose(onClose)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // Form-only modal: max-w-3xl (768px) wraps the ~640px form
        // content with minimal right-side whitespace. Height hugs
        // content (max-h-[92vh] caps overflow), so short rules
        // collapse the modal instead of leaving empty space below
        // the body.
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_10px_25px_-3px_rgba(0,0,0,0.1),0px_4px_20px_-2px_rgba(0,0,0,0.05)]"
      >
        {/* Modal header — rule name as title + close X. In view
             mode, an interactive Version chip sits beside the name
             so the user can audit past versions of the rule without
             leaving the modal. Edit/Duplicate modes hide the chip —
             they're authoring the next version, so version
             selection isn't a relevant action. */}
        <header className="flex items-center justify-between gap-3 border-b border-[#e1e6ef] px-6 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate font-header text-base font-bold leading-5 text-[#1d2433]">
              {mode === 'duplicate' ? 'Duplicate Rule' : rule.name}
            </h2>
            {!editMode && mode === 'view' && (
              <VersionPicker
                versions={versionsNewestFirst}
                currentVersion={currentVersion}
                viewingVersion={activeVersion}
                onChange={(v) =>
                  setViewingVersion(v === currentVersion ? null : v)
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Edit + Deactivate/Activate live in the header as
                 FlowUI outlined secondary buttons. Visible only in
                 view mode AND on the current version — both actions
                 are inherently "current rule" operations. The kebab
                 that used to sit on the breadcrumb row is gone now;
                 these buttons are its replacement. */}
            {!editMode && mode === 'view' && isViewingCurrent && (
              <>
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex h-8 items-center rounded-md border border-[#cbd2e1] bg-white px-3 font-header text-xs font-bold leading-4 text-[#1d2433] transition-colors hover:border-[#9aa3b5] hover:bg-[#f8fafc]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rule.status === 'active') onDeactivate?.();
                    else onActivate?.();
                  }}
                  className="inline-flex h-8 items-center rounded-md border border-[#cbd2e1] bg-white px-3 font-header text-xs font-bold leading-4 text-[#1d2433] transition-colors hover:border-[#9aa3b5] hover:bg-[#f8fafc]"
                >
                  {rule.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => attemptClose(onClose)}
              aria-label="Close"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>


        {/* Body — view-only sections by default; in edit mode, the
             AddRulePage form takes over with the rule pre-populated.
             Cancel/Save inside the form returns to view mode (the
             AddRulePage's onClose handler). The "Back to Rules" link
             is hidden in this context — the modal's close X owns
             dismissal of the whole modal. */}
        {editMode ? (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Breadcrumb sits at the top of the form body in edit
                 and duplicate flows, above the form sections, so the
                 user can return to the Rules list without dismissing
                 the modal. No kebab in edit/duplicate modes — the
                 user is already past the view surface. */}
            {onBackToList && (
              <div className="px-6 py-4">
                <BackToRulesBreadcrumb onBack={onBackToList} />
              </div>
            )}
            <AddRulePage
              // Duplicate is a creation flow with no view to fall back
              // to, so Cancel/Save closes the modal. Edit (from view
              // or from kebab) returns to view mode so the user sees
              // their saved state before dismissing.
              onClose={() => {
                // Both branches are gated by attemptClose so the
                // user gets a discard-changes warning if they have
                // unsaved edits. Save success clears the dirty
                // state inside AddRulePage before calling this, so
                // it falls through to the action immediately.
                attemptClose(() => {
                  if (mode === 'duplicate') onClose();
                  else setEditMode(false);
                });
              }}
              onDirtyChange={setFormDirty}
              onSaveSuccess={onSaveSuccess}
              rule={rule}
              initialAssigneeIds={assigneeIds}
              hideBackLink
              namePrefix={mode === 'duplicate' ? '(Copy) ' : undefined}
              // Activity Log is rendered in both edit and duplicate
              // modes (collapsed by default in either case). In
              // duplicate mode the log shows the SOURCE rule's
              // history — useful context for the user about what
              // they're copying.
              extraSections={
                <ActivityLog
                  rule={rule}
                  fqRuleId={fqRuleId}
                  assigneeIds={assigneeIds}
                />
              }
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {/* Back-to-Rules breadcrumb — only rendered when the
                 modal was opened from the Rules list (host wires
                 onBackToList in that case). Edit/Deactivate moved
                 into the modal header as outlined buttons, so this
                 row is dedicated to navigation only. */}
            {onBackToList && (
              <div className="px-6 py-4">
                <BackToRulesBreadcrumb onBack={onBackToList} />
              </div>
            )}

            {/* FlowUI info inline-alert — surfaces the historical-
                 view state without taking up much room. Sits inside
                 the scrollable body so it travels with the content
                 rather than as separate header chrome. No CTA — the
                 user returns to the current version via the chip in
                 the header. */}
            {!isViewingCurrent && viewingEntry && (
              <div className="px-6 pt-2">
                <div className="flex items-start gap-3 rounded-md border border-[#3d7bf7] bg-[#f0f5ff] p-3">
                  <Info size={16} color="#3d7bf7" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="font-body text-xs font-normal leading-[18px] text-[#1d2433]">
                    You&apos;re viewing Version {activeVersion} of this rule from{' '}
                    {formatDateTime(viewingEntry.editedAt)}.
                  </p>
                </div>
              </div>
            )}

            {/* Body content — dimmed when the user is auditing a
                 past version so the historical state reads as
                 read-only. The prototype doesn't snapshot per-
                 version property data, so the actual content stays
                 the same — the dim treatment + banner above
                 communicate the mode change. The Activity Log only
                 renders on the current version (audit history is a
                 live-rule concept, not a per-snapshot one). */}
            <div
              className={`flex flex-col gap-8 px-6 pb-8 transition-opacity ${
                isViewingCurrent ? '' : 'pt-4 opacity-70'
              }`}
            >
              <RuleDetailsSection rule={rule} fqRuleId={fqRuleId} showStatus={isViewingCurrent} />
              <RuleParametersSection rule={rule} severityLevel={severityLevel} />
              <AssigneesSection
                ownerName={owner?.name ?? '—'}
                ownerAvatar={owner?.avatar}
                assigneeIds={assigneeIds}
              />
              {isViewingCurrent && <ImpactedPeriodsSection rule={rule} />}
              {isViewingCurrent && (
                <ActivityLog rule={rule} fqRuleId={fqRuleId} assigneeIds={assigneeIds} />
              )}
            </div>
          </div>
        )}
      </div>

      {pendingClose && (
        <DiscardChangesDialog
          onKeepEditing={() => setPendingClose(null)}
          onDiscard={() => {
            const action = pendingClose;
            setPendingClose(null);
            setFormDirty(false);
            action();
          }}
        />
      )}
    </div>
  );
}

function BackToRulesBreadcrumb({ onBack }: { onBack: () => void }) {
  // FlowUI back-link pattern — Inter semibold, body-text colour
  // (#1d2433), soft 40% underline that solidifies on hover. Same
  // treatment as the BackToRulesLink in AddRulePage. No padding —
  // the parent row owns the gutter so the breadcrumb can sit
  // alongside other elements (e.g. the rule actions kebab).
  return (
    <button
      type="button"
      onClick={onBack}
      className="!font-['Inter'] inline-flex items-center gap-1 text-[12px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]"
    >
      <ChevronLeft className="h-3.5 w-3.5" />
      Back to Rules
    </button>
  );
}

// ---------- Section primitives ----------

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 border-b border-[#e1e6ef] pb-2">
      <h3 className="font-['Inter'] text-[14px] font-bold leading-5 text-[#1d2433]">
        {title}
      </h3>
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#6b7280]">
        {label}
      </span>
      <div className="font-['Inter'] text-[12px] font-semibold leading-5 text-[#1d2433]">
        {children}
      </div>
    </div>
  );
}

// ---------- Rule Details section ----------

function RuleDetailsSection({
  rule,
  fqRuleId,
  showStatus = true,
}: {
  rule: Rule;
  fqRuleId: string;
  showStatus?: boolean;
}) {
  // "Rule Details" section header was removed — the modal opens
  // directly with the Name row.
  return (
    <section>
      <div className="flex flex-col gap-4">
        <FieldRow label="Name">{rule.name}</FieldRow>
        <FieldRow label="Description">{rule.description}</FieldRow>
        {showStatus && (
          <FieldRow label="Status">
            <StatusTag status={rule.status} />
          </FieldRow>
        )}
        <FieldRow label="FQ Rule ID">{fqRuleId}</FieldRow>
      </div>
    </section>
  );
}

function StatusTag({ status }: { status: 'active' | 'inactive' | 'draft' }) {
  // Same vocabulary used on the Rules table — Active in success
  // green, Deactivated / Draft in neutral.
  const map = {
    active: {
      label: 'Active',
      bg: 'bg-[#ecfff8]',
      text: 'text-[#1fac76]',
    },
    inactive: {
      label: 'Deactivated',
      bg: 'bg-[#f1f3f9]',
      text: 'text-[#424867]',
    },
    draft: {
      label: 'Draft',
      bg: 'bg-[#f1f3f9]',
      text: 'text-[#424867]',
    },
  } as const;
  const v = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-1.5 py-1 font-['Inter'] text-[12px] font-semibold leading-[18px] ${v.bg} ${v.text}`}
    >
      {v.label}
    </span>
  );
}

// ---------- Rule Parameters section ----------

function RuleParametersSection({
  rule,
  severityLevel,
}: {
  rule: Rule;
  severityLevel: number;
}) {
  // Mirror the edit-mode structure in view: a foundation group with
  // the locked scope rows (Entity + Account), then a user group
  // with whatever logic conditions the rule defines.
  const subsidiaryCondition = rule.conditions.find(
    (c) => c.field === 'subsidiary',
  );
  const accountCondition = rule.conditions.find((c) => c.field === 'account');
  const userConditions = rule.conditions.filter(
    (c) => c.field !== 'subsidiary' && c.field !== 'account',
  );

  // Foundation value defaults — seed rules don't store
  // Subsidiary/Account explicitly, so fall back to "all accessible
  // entities" + "All accounts" so the view always reads as a
  // complete rule.
  const entityValue = (() => {
    const raw = subsidiaryCondition?.value;
    if (Array.isArray(raw) && raw.length > 0) {
      return (raw as string[])
        .map((id) => entities.find((e) => e.id === id)?.shortName ?? id)
        .join(', ');
    }
    if (typeof raw === 'string' && raw) return raw;
    return entities.map((e) => e.shortName).join(', ');
  })();
  const accountValue = (() => {
    const raw = accountCondition?.value;
    if (Array.isArray(raw) && raw.length > 0) return (raw as string[]).join(', ');
    if (typeof raw === 'string' && raw) return raw;
    return 'All accounts';
  })();
  const accountOperator = accountCondition?.operator ?? 'is';

  return (
    <section>
      <SectionHeader title="Rule Parameters" />
      <p className="mb-3 font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
        Transactions are flagged as anomalous if the following conditions are met
      </p>

      {/* Required parameters group — read-only mirror of the locked
           foundation group in edit mode. The "And" tag indicates that
           Entity AND Account both apply. */}
      <div className="mb-3 rounded-md border border-[#e1e6ef] bg-white p-4">
        <ReadOnlyGroupHeader op="And" />
        <div className="flex flex-col gap-1.5">
          <ConditionSentence field="subsidiary" operator="is" value={entityValue} />
          <ConditionSentence
            field="account"
            operator={accountOperator}
            value={accountValue}
          />
        </div>
      </div>

      {/* User logic group(s) — render the rule's actual conditions
           below the foundation. If the rule has no non-foundation
           conditions, skip the second card entirely. */}
      {userConditions.length > 0 && (
        <div className="mb-6 rounded-md border border-[#e1e6ef] bg-white p-4">
          <ReadOnlyGroupHeader op="And" />
          <div className="flex flex-col gap-1.5">
            {userConditions.map((c, i) => (
              <ConditionSentence
                key={c.id ?? i}
                field={c.field}
                operator={c.operator}
                value={typeof c.value === 'string' ? c.value : String(c.value ?? '')}
              />
            ))}
          </div>
        </div>
      )}

      <p className="mb-2 mt-6 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
        Severity Level
      </p>
      <SeveritySlider value={severityLevel} />
    </section>
  );
}

/**
 * Header for a read-only condition group. Renders the conjunction
 * (And/Or) as a FlowUI info-tag pill — bright blue on a light blue
 * surface, uppercase, to clearly signal the static state and
 * stand out from neutral chips elsewhere in the view.
 */
function ReadOnlyGroupHeader({ op }: { op: 'And' | 'Or' }) {
  return (
    <div className="mb-3 flex items-center">
      <span className="inline-flex items-center rounded-[4px] bg-[#eff5ff] px-2 py-0.5 font-['Inter'] text-[10px] font-bold uppercase leading-4 tracking-wide text-[#3d7bf7]">
        {op}
      </span>
    </div>
  );
}

function ConditionSentence({
  field,
  operator,
  value,
}: {
  field: string;
  operator: string;
  value: string;
}) {
  // Sentence-style display per the Figma — bold field name, normal
  // operator phrase, value rendered as a neutral chip when it's a
  // discrete value (number, short string).
  return (
    <p className="font-['Inter'] text-[12px] leading-5 text-[#1d2433]">
      <span className="font-bold">{formatFieldName(field)}</span>{' '}
      <span className="font-normal text-[#424867]">{operatorPhrase(operator)}</span>{' '}
      {value && (
        <span className="ml-1 inline-flex items-center rounded-[4px] bg-[#f1f3f9] px-1.5 py-0.5 font-['Inter'] text-[11px] font-medium leading-4 text-[#1d2433]">
          {value}
        </span>
      )}
    </p>
  );
}

function SeveritySlider({ value }: { value: number }) {
  // Read-only version of the Add Rule severity slider — same track
  // + thumb visual but no click handlers.
  const levels = [1, 2, 3, 4, 5];
  return (
    <div className="relative max-w-[640px] pb-6 pt-4">
      <div className="relative h-[2px] w-full bg-[#1FAC76]">
        {levels.map((n) => {
          const pct = ((n - 1) / 4) * 100;
          const isActive = n === value;
          return (
            <div
              key={n}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
              aria-label={`Severity ${n}${isActive ? ' (current)' : ''}`}
            >
              {isActive ? (
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inset-[-6px] rounded-full bg-[#1FAC76]/20" />
                  <span className="h-3.5 w-3.5 rounded-full bg-[#186749]" />
                </span>
              ) : (
                <span className="block h-2.5 w-2.5 rounded-full bg-[#1FAC76]" />
              )}
            </div>
          );
        })}
      </div>
      {/* Numeric labels under each tick — absolutely positioned with
           the same `left: pct% + -translate-x-1/2` math the ticks use,
           so labels stay centered directly under their ticks. */}
      <div className="relative mt-3 h-4 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
        {levels.map((n) => {
          const pct = ((n - 1) / 4) * 100;
          return (
            <span
              key={n}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {n}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Assignees section ----------

function AssigneesSection({
  ownerName,
  ownerAvatar,
  assigneeIds,
}: {
  ownerName: string;
  ownerAvatar?: string;
  assigneeIds: string[];
}) {
  return (
    <section>
      <SectionHeader title="Assignees" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#6b7280]">
            Rule Owner
          </span>
          <div className="flex items-center gap-2">
            {ownerAvatar && (
              <img
                src={ownerAvatar}
                alt=""
                className="h-6 w-6 rounded-full border border-white object-cover"
              />
            )}
            <span className="font-['Inter'] text-[12px] font-semibold leading-5 text-[#1d2433]">
              {ownerName}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#6b7280]">
            Assignees
          </span>
          {assigneeIds.map((id, i) => (
            <AssigneeRow key={`${id}-${i}`} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AssigneeRow({ id }: { id: string }) {
  if (id === 'dynamic') {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100">
          <Sparkles className="h-3.5 w-3.5 text-[#7c3aed]" />
        </span>
        <span className="font-['Inter'] text-[12px] font-semibold leading-5 text-[#1d2433]">
          Dynamic Assignment
        </span>
      </div>
    );
  }
  const member = getTeamMember(id);
  if (!member) return null;
  return (
    <div className="flex items-center gap-2">
      <img
        src={member.avatar}
        alt=""
        className="h-6 w-6 shrink-0 rounded-full border border-white object-cover"
      />
      <span className="font-['Inter'] text-[12px] font-semibold leading-5 text-[#1d2433]">
        {member.name}
      </span>
    </div>
  );
}

// ---------- Activity Log ----------

/* -------------------------------------------------------------------------- */
/* ActivePeriodsSection — collapsible accordion listing every period this     */
/* rule has been active in (newest first). Sits above the Activity Log so     */
/* the "temporal" pair clusters at the bottom of the modal.                   */
/*                                                                            */
/* Format decisions from 6.3.2026 sync with Gaurav:                           */
/*   - Per-period list, NOT grouped by year. Year grouping would break for    */
/*     non-calendar fiscal years and 13-period accounting schemes.            */
/*   - Comma-separated text, no pills or visual treatment — this is metadata, */
/*     not actionable. Lowest visual weight.                                  */
/*   - Default state shows the 5 most recent periods + "Show all (N)" link.   */
/*     Inline expansion when clicked.                                         */
/*   - Title shows count in parens — "Active Periods (24)" — so users see     */
/*     the total without expanding.                                           */
/* -------------------------------------------------------------------------- */

/** ISO date string → "YYYY-MM" period id (or null if invalid). */
function periodIdFromDate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Compare two "YYYY-MM" ids chronologically — used for newest-first sort. */
function comparePeriodIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Yields every period id from `start` to `end` inclusive. */
function* periodsBetween(start: string, end: string): Generator<string> {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    yield `${y}-${String(m).padStart(2, '0')}`;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
}

/**
 * Compute the full list of period ids this rule has been active in,
 * newest first. Unions explicit historical backfills with the contiguous
 * run from createdAt period through currentPeriodId.
 */
function activePeriodIdsFor(rule: Rule): string[] {
  const ids = new Set<string>();
  for (const entry of rule.versionHistory ?? []) {
    for (const p of entry.historicalPeriods ?? []) ids.add(p);
  }
  const startId = periodIdFromDate(rule.createdAt);
  if (startId) {
    for (const p of periodsBetween(startId, currentPeriodId)) ids.add(p);
  }
  return Array.from(ids).sort(comparePeriodIds).reverse();
}

/** "2024-03" → "March 2024". */
function formatPeriodLabel(id: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(id);
  if (!m) return id;
  const [, year, month] = m;
  const monthIdx = Math.max(0, Math.min(11, Number(month) - 1));
  const monthName = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ][monthIdx];
  return `${monthName} ${year}`;
}

/** Default visible count when the section is expanded — show the latest 5,
 *  rest behind a "Show all" link to keep the modal scannable for rules with
 *  long active histories. */
const PERIOD_PREVIEW_COUNT = 5;

function ImpactedPeriodsSection({ rule }: { rule: Rule }) {
  // Section is collapsed by default. Once expanded, periods are shown as a
  // comma-separated list — first 5 by default, with a "Show all (N)" link
  // to reveal the rest inline.
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const periodIds = activePeriodIdsFor(rule);
  const total = periodIds.length;
  const visibleIds =
    showAll || total <= PERIOD_PREVIEW_COUNT
      ? periodIds
      : periodIds.slice(0, PERIOD_PREVIEW_COUNT);
  const remaining = total - visibleIds.length;

  return (
    <section>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 pb-3 text-left"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-[#6b7280]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#6b7280]" />
        )}
        <h3 className="font-['Inter'] text-[14px] font-bold leading-5 text-[#1d2433]">
          Active Periods ({total})
        </h3>
      </button>

      {/* Divider always visible so the section reads as a structural
           region even when collapsed (matches Activity Log). */}
      <div className="border-t border-[#e1e6ef]" />

      {expanded && (
        <div className="pt-3">
          {total === 0 ? (
            <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#6b7280]">
              This rule hasn&apos;t been active in any period yet.
            </p>
          ) : (
            <>
              {/* Periods rendered as a single wrapping comma-separated
                   string. Inline text — no pills, no grouping. Newest first. */}
              <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
                {visibleIds.map(formatPeriodLabel).join(', ')}
              </p>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="mt-2 font-['Inter'] text-[12px] font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
                >
                  Show all {total} periods
                </button>
              )}
              {showAll && total > PERIOD_PREVIEW_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="mt-2 font-['Inter'] text-[12px] font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae]"
                >
                  Show less
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

function ActivityLog({
  rule,
  fqRuleId,
  assigneeIds,
}: {
  rule: Rule;
  fqRuleId: string;
  assigneeIds: string[];
}) {
  // Collapsed by default across all modes (view, edit, duplicate)
  // so the rule content is the user's first focus. The Activity Log
  // is one click away when needed.
  const [expanded, setExpanded] = useState(false);
  const owner = getTeamMember(rule.createdById);
  const editor = getTeamMember(rule.lastEditedById);

  // Activity stream: walk the rule's versionHistory (newest first) to
  // produce one "updated" entry per save event, then append a single
  // "created" entry at the bottom for the initial save. Each updated
  // entry surfaces the save scope (current+future vs. with-historical)
  // and the explicit historical periods so the user can see exactly
  // what each version did.
  //
  // Backwards compat: rules that pre-date version tracking still get
  // a synthesized "updated" entry if their lastEditedAt differs from
  // createdAt — same behavior as before.
  const versionEntries = rule.versionHistory ?? [];
  const hasRealHistory = versionEntries.length > 0;
  const hasSyntheticEdit =
    !hasRealHistory && rule.createdAt !== rule.lastEditedAt;
  // Show a "Deactivated" entry at the top when inactive with a timestamp.
  // Clears when the rule is re-activated (deactivatedAt is set to '').
  const showDeactivated =
    rule.status === 'inactive' && Boolean(rule.deactivatedAt);
  const deactivator = showDeactivated ? getTeamMember(rule.lastEditedById) : null;
  // Show an "Activated" entry at the top when the rule is active and was
  // previously re-activated (activatedAt is set). Clears when the rule
  // is deactivated again (activatedAt is set to '').
  const showActivated =
    rule.status === 'active' && Boolean(rule.activatedAt);
  const activator = showActivated ? getTeamMember(rule.lastEditedById) : null;
  const assigneeNames = assigneeIds
    .map((id) => (id === 'dynamic' ? 'Dynamic Assignment' : getTeamMember(id)?.name))
    .filter(Boolean)
    .join(', ');

  // Historical periods for the create entry: all active periods before the
  // current one, sorted oldest-first for display (mirrors Figma order).
  const createHistoricalPeriods = activePeriodIdsFor(rule)
    .filter((p) => p < currentPeriodId)
    .reverse();

  return (
    <section>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 pb-3 text-left"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-[#6b7280]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#6b7280]" />
        )}
        <h3 className="font-['Inter'] text-[14px] font-bold leading-5 text-[#1d2433]">
          Activity Log
        </h3>
      </button>

      {/* Section divider — always visible so the Activity Log reads
           as a structural region even when collapsed. */}
      <div className="border-t border-[#e1e6ef]" />

      {expanded && (
        <>
          {/* FQ Rule ID context — sits below the divider as the first
               thing the user sees when the log opens, before the
               activity entries. */}
          <div className="mb-4 pt-3 font-['Inter'] text-[12px] font-normal leading-4 text-[#424867]">
            FQ Rule ID: <span className="font-bold text-[#1d2433]">{fqRuleId}</span>
          </div>

          {/* Activity timeline — newest at the top, oldest (created)
              at the bottom. Each entry owns its own dot + connector
              line so the line never dangles past the last entry. The
              dot aligns with the activity title text; the line
              bridges from below the dot to the next entry's dot. */}
          <ol className="relative flex flex-col gap-6">
            {/* Deactivation entry — appears at the top when the rule is
                currently inactive. Cleared when the rule is re-activated. */}
            {showDeactivated && (
              <ActivityEntry
                author={deactivator?.name ?? 'System'}
                verb="Deactivated"
                fromRuleName={rule.name}
                fromVersion={String(rule.version ?? 1)}
                timestamp={rule.deactivatedAt!}
              >
                <li>Apply to future periods</li>
              </ActivityEntry>
            )}

            {/* Activation entry — appears at the top when the rule was
                previously deactivated and is now active again. Cleared
                when the rule is deactivated again. */}
            {showActivated && (
              <ActivityEntry
                author={activator?.name ?? 'System'}
                verb="Activated"
                fromRuleName={rule.name}
                fromVersion={String(rule.version ?? 1)}
                timestamp={rule.activatedAt!}
              >
                <li>Apply to future periods</li>
              </ActivityEntry>
            )}

            {/* Real version-history entries — newest first. Each save
                event renders one "updated" ActivityEntry with the
                scope/periods it applied to. */}
            {hasRealHistory &&
              versionEntries
                .slice()
                .reverse()
                .map((entry) => {
                  const entryEditor = getTeamMember(entry.editedById);
                  const hasDiff =
                    entry.prevSnapshot != null && entry.nextSnapshot != null;
                  // When the rule name changed, show the old name in the
                  // "from" chip and the new name in the "to" chip — matching
                  // the Figma title pattern  "Updated 'X' V1 to 'Y' V2".
                  const fromName = entry.prevSnapshot?.name ?? rule.name;
                  const toName = entry.nextSnapshot?.name ?? rule.name;
                  return (
                    <ActivityEntry
                      key={entry.version}
                      author={entryEditor?.name ?? 'System'}
                      verb="Updated"
                      fromRuleName={fromName}
                      toRuleName={toName}
                      fromVersion={String(entry.version - 1)}
                      toVersion={String(entry.version)}
                      timestamp={entry.editedAt}
                    >
                      <ActivityScopeNote
                        scope={entry.scope}
                        historicalPeriods={entry.historicalPeriods}
                      />
                      {(() => {
                        const prev = entry.prevSnapshot;
                        const next = entry.nextSnapshot;

                        // No snapshot data — synthesize plausible before/after
                        // content from the rule's current fields so every
                        // Updated entry looks consistent in the Activity Log.
                        if (!prev || !next) {
                          const userConds = rule.conditions.filter(
                            (c) =>
                              c.field !== 'subsidiary' && c.field !== 'account',
                          );
                          // "Previously" looks like the rule before the last
                          // condition was added. If only one condition exists,
                          // both blocks show the same set (scope-only change).
                          const prevConds =
                            userConds.length > 1
                              ? userConds.slice(0, -1)
                              : userConds;
                          const renderSynthConds = (
                            conds: typeof userConds,
                          ) => (
                            <li>
                              Rule Parameters:
                              <ul className="ml-5 list-disc">
                                <li>
                                  Transactions are flagged as anomalous if the
                                  following conditions are met
                                </li>
                                {conds.map((c, i) => (
                                  <li key={i} className="ml-5">
                                    {formatFieldName(c.field)}{' '}
                                    {operatorPhrase(String(c.operator))}{' '}
                                    {String(c.value ?? '')}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                          return (
                            <>
                              <ActivityChangeBlock title="Previously">
                                {renderSynthConds(prevConds)}
                              </ActivityChangeBlock>
                              <ActivityChangeBlock title="Updated to">
                                {renderSynthConds(userConds)}
                              </ActivityChangeBlock>
                            </>
                          );
                        }

                        const nameChanged = prev.name !== next.name;
                        const descChanged = prev.description !== next.description;
                        const sevChanged = prev.severity !== next.severity;
                        // Normalize operators before comparing — the form remaps
                        // camelCase/raw operators (e.g. "equals" → "is") so a
                        // simple JSON.stringify diff would always report conditions
                        // changed even when the user didn't touch them.
                        const normOp = (op: string) => operatorPhrase(op);
                        const normConds = (conds: typeof prev.conditions) =>
                          conds.map((c) => ({
                            field: c.field,
                            op: normOp(c.operator),
                            // Treat blank/dash values as equivalent ("" and "—" both
                            // mean "no value" — the form uses "—" as a placeholder).
                            value: c.value === '—' ? '' : c.value,
                          }));
                        const condsChanged =
                          JSON.stringify(normConds(prev.conditions)) !==
                          JSON.stringify(normConds(next.conditions));
                        const anyFieldChanged = nameChanged || descChanged || sevChanged;
                        const showConditions = condsChanged || !anyFieldChanged;

                        const renderConditions = (
                          conds: typeof prev.conditions,
                        ) => (
                          <li>
                            Rule Parameters:
                            <ul className="ml-5 list-disc">
                              <li>
                                Transactions are flagged as anomalous if the
                                following conditions are met
                              </li>
                              {conds.map((c, i) => (
                                <li key={i} className="ml-5">
                                  {formatFieldName(c.field)}{' '}
                                  {operatorPhrase(c.operator)}{' '}
                                  {c.value !== '—' ? c.value : ''}
                                </li>
                              ))}
                            </ul>
                          </li>
                        );

                        return (
                          <>
                            <ActivityChangeBlock title="Previously">
                              {nameChanged && <li>Rule Name: {prev.name}</li>}
                              {descChanged && (
                                <li>Description: {prev.description}</li>
                              )}
                              {sevChanged && (
                                <li>Severity Level: {prev.severity}</li>
                              )}
                              {showConditions &&
                                prev.conditions.length > 0 &&
                                renderConditions(prev.conditions)}
                            </ActivityChangeBlock>
                            <ActivityChangeBlock title="Updated to">
                              {nameChanged && <li>Rule Name: {next.name}</li>}
                              {descChanged && (
                                <li>Description: {next.description}</li>
                              )}
                              {sevChanged && (
                                <li>Severity Level: {next.severity}</li>
                              )}
                              {showConditions &&
                                next.conditions.length > 0 &&
                                renderConditions(next.conditions)}
                            </ActivityChangeBlock>
                          </>
                        );
                      })()}
                    </ActivityEntry>
                  );
                })}

            {/* Legacy synthesized "updated" entry — only fires when a
                rule's lastEditedAt differs from createdAt AND there's
                no real version history (i.e. the rule pre-dates
                version tracking). */}
            {hasSyntheticEdit && (
              <ActivityEntry
                author={editor?.name ?? owner?.name ?? 'System'}
                verb="Updated"
                fromRuleName={rule.name}
                fromVersion="1"
                toVersion="2"
                timestamp={rule.lastEditedAt}
              >
                <ActivityChangeBlock title="Previously">
                  <li>
                    Rule Parameters:
                    <ul className="ml-5 list-disc">
                      <li>Transactions are flagged as anomalous if the following conditions are met</li>
                      {rule.conditions.map((c, i) => (
                        <li key={i} className="ml-5">
                          {formatFieldName(c.field)} {operatorPhrase(c.operator)}{' '}
                          {String(c.value ?? '').replace(/\d+/, (m) =>
                            String(Math.max(0, Number(m) - 1)),
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ActivityChangeBlock>
                <ActivityChangeBlock title="Updated to">
                  <li>
                    Rule Parameters:
                    <ul className="ml-5 list-disc">
                      <li>Transactions are flagged as anomalous if the following conditions are met</li>
                      {rule.conditions.map((c, i) => (
                        <li key={i} className="ml-5">
                          {formatFieldName(c.field)} {operatorPhrase(c.operator)}{' '}
                          {String(c.value ?? '')}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ActivityChangeBlock>
              </ActivityEntry>
            )}

            <ActivityEntry
              author={owner?.name ?? 'System'}
              verb="Created"
              fromRuleName={rule.name}
              fromVersion="1"
              timestamp={rule.createdAt}
              isLast
            >
              {createHistoricalPeriods.length > 0 ? (
                <li>
                  Apply to current, future periods and historical periods:
                  <ul className="ml-5 list-disc">
                    <li>{createHistoricalPeriods.map(formatPeriodId).join(', ')}</li>
                  </ul>
                </li>
              ) : (
                <li>Apply to current and future periods</li>
              )}
              <li>
                Rule Details:
                <ul className="ml-5 list-disc">
                  <li>Rule Name: {rule.name}</li>
                  <li>Rule Description: {rule.description}</li>
                </ul>
              </li>
              <li>
                Assignees:
                <ul className="ml-5 list-disc">
                  <li>Rule Owner: {owner?.name ?? '—'}</li>
                  <li>{assigneeNames || '—'}</li>
                </ul>
              </li>
              <li>
                Rule Parameters:
                <ul className="ml-5 list-disc">
                  <li>Transactions are flagged as anomalous if the following conditions are met</li>
                  {rule.conditions.map((c, i) => (
                    <li key={i} className="ml-5">
                      {formatFieldName(c.field)} {operatorPhrase(c.operator)}{' '}
                      {String(c.value ?? '')}
                    </li>
                  ))}
                </ul>
              </li>
              <li>Severity Level: {Math.max(1, Math.min(5, Math.ceil(rule.severity / 20)))}</li>
            </ActivityEntry>
          </ol>
        </>
      )}
    </section>
  );
}

function ActivityEntry({
  author,
  verb,
  fromRuleName,
  toRuleName,
  fromVersion,
  toVersion,
  timestamp,
  children,
  isLast = false,
}: {
  author: string;
  /** "Updated", "Created", "Deactivated", or "Activated" */
  verb: 'Updated' | 'Created' | 'Deactivated' | 'Activated';
  /** Rule name at the "from" version (shown in the left chip). */
  fromRuleName: string;
  /** Rule name at the "to" version — only needed for "Updated" when
   *  the name itself changed. Defaults to fromRuleName when omitted. */
  toRuleName?: string;
  fromVersion: string;
  toVersion?: string;
  timestamp: string;
  children: React.ReactNode;
  /** True for the oldest entry (rendered at the bottom). When set,
   *  the vertical connector line below the dot is suppressed so the
   *  timeline doesn't dangle past the last activity. */
  isLast?: boolean;
}) {
  const effectiveToName = toRuleName ?? fromRuleName;
  return (
    <li className="relative pl-6">
      {/* Timeline dot */}
      <span className="absolute left-0 top-1.5 z-10 inline-flex h-2 w-2 rounded-full bg-[#cbd2e1]" />

      {/* Connector line — suppressed on the last (oldest) entry */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[3.5px] top-[14px] bottom-[-26px] w-px bg-[#e1e6ef]"
        />
      )}

      <div className="flex flex-col gap-1">
        {/* Title: Updated/Created "{fromRuleName}" Version N [to "{toRuleName}" Version M]
            The "to" side shows the new name if it changed, or the same name if not. */}
        <div className="flex flex-wrap items-center gap-1.5 font-['Inter'] text-[12px] font-semibold leading-5 text-[#1d2433]">
          {verb} &ldquo;{fromRuleName}&rdquo;
          <VersionChip version={fromVersion} />
          {toVersion && (
            <>
              <span className="font-normal text-[#424867]">to</span>
              &ldquo;{effectiveToName}&rdquo;
              <VersionChip version={toVersion} />
            </>
          )}
        </div>

        {/* Metadata: author · date · time (no calendar icon) */}
        <div className="flex items-center gap-1 font-['Inter'] text-[11px] font-normal leading-4 text-[#adb2bb]">
          <span>{author}</span>
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#adb2bb]" aria-hidden />
          <span>{fmtDate(timestamp)}</span>
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#adb2bb]" aria-hidden />
          <span>{fmtTime(timestamp)}</span>
        </div>

        <ul className="ml-5 mt-2 list-disc font-['Inter'] text-[12px] font-normal leading-5 text-[#1d2433]">
          {children}
        </ul>
      </div>
    </li>
  );
}

/**
 * Renders the scope/period applicability bullets for a single save
 * version in the Activity Log. "current-and-future" gets a short
 * single-bullet note; "with-historical" adds a second bullet listing
 * the period names so it's auditable at a glance.
 */
function ActivityScopeNote({
  scope,
  historicalPeriods,
}: {
  scope: 'current-and-future' | 'with-historical';
  historicalPeriods?: string[];
}) {
  const hasHistorical =
    scope === 'with-historical' && historicalPeriods && historicalPeriods.length > 0;
  // Periods shown oldest-first (Figma order: Jan, Feb, Mar, Apr)
  const displayPeriods = hasHistorical
    ? [...historicalPeriods!].sort().map(formatPeriodId)
    : [];
  return (
    <li>
      {hasHistorical
        ? 'Apply to current, future periods and historical periods:'
        : 'Apply to current and future periods'}
      {hasHistorical && (
        <ul className="ml-5 list-disc">
          <li>{displayPeriods.join(', ')}</li>
        </ul>
      )}
    </li>
  );
}

function ActivityChangeBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className="-ml-5 mt-2 font-['Inter'] text-[12px] font-bold leading-5 text-[#1d2433]">
        {title}
      </p>
      {children}
    </>
  );
}

function VersionChip({ version }: { version: string }) {
  return (
    <span className="inline-flex items-center rounded-[4px] bg-[#f1f3f9] px-1.5 py-0.5 font-['Inter'] text-[10px] font-medium leading-4 text-[#424867]">
      Version {version}
    </span>
  );
}

/**
 * Interactive version picker — renders as a neutral pill chip (same
 * visual language as VersionChip + the rules-table tag) with a
 * chevron, and on click expands a FlowUI dropdown panel listing
 * every version of this rule newest-first. Picking a past version
 * fires onChange so the parent can flip the modal into a read-only
 * historical view.
 */
function VersionPicker({
  versions,
  currentVersion,
  viewingVersion,
  onChange,
}: {
  versions: { version: number; editedAt: string; editedById: string }[];
  currentVersion: number;
  viewingVersion: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
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

  // Rules with only one version have nothing to switch to — render
  // the chip as a static, non-interactive span (no chevron, no
  // hover, no panel) so the affordance matches the reality.
  if (versions.length <= 1) {
    return (
      <span className="inline-flex items-center rounded-[4px] bg-[#f1f3f9] px-1.5 py-0.5 font-['Inter'] text-[10px] font-medium leading-4 text-[#424867]">
        Version {viewingVersion}
      </span>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-['Inter'] text-[10px] font-medium leading-4 transition-colors ${
          open
            ? 'bg-[#e1e6ef] text-[#1d2433]'
            : 'bg-[#f1f3f9] text-[#424867] hover:bg-[#e1e6ef] hover:text-[#1d2433]'
        }`}
      >
        Version {viewingVersion}
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        // FlowUI dropdown panel — newest version at the top. Rows
        // are deliberately minimal: just the version number, with
        // a hover-fill on the active row. No "current" annotation,
        // no timestamp, no selected-state check — the chip itself
        // is the source of truth for which version is being viewed.
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+4px)] z-30 min-w-[160px] overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
        >
          <div className="p-1">
            {versions.map((v) => (
              <button
                key={v.version}
                type="button"
                role="option"
                onClick={() => {
                  onChange(v.version);
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-[4px] px-2 py-1.5 text-left font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433] transition-colors hover:bg-[#f1f3f9]"
              >
                Version {v.version}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
