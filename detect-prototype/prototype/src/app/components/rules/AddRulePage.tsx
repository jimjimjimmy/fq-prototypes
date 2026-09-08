import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import { team } from '../../../data/team';
import { entities } from '../../../data/company';
import { chartOfAccounts } from '../../../data/chartOfAccounts';
import type { Rule } from '../../../data/types';
import { TRANSACTION_FIELDS } from '../../../data/transactionFields';
import { SaveRuleDialog } from './SaveRuleDialog';

/**
 * Legacy operator vocabulary (used in /data/rules.ts) → new operator
 * values per the Figma operator list. Keeps existing rule data
 * compatible with the updated dropdown options.
 */
/**
 * Maps the operator strings used on the saved rule data model (RuleCondition.operator)
 * onto the kebab-case `value` strings the form's operator dropdown uses
 * (CONDITION_OPERATOR_OPTIONS). The data layer uses camelCase ("lessThan",
 * "notEquals") AND legacy kebab-case ("less-than", "not-equals"); both
 * variants need to land on the same dropdown value or edit mode shows
 * blank operators.
 */
const OPERATOR_REMAP: Record<string, string> = {
  // Equality
  equals: 'is',
  is: 'is',
  notEquals: 'is-not',
  'not-equals': 'is-not',
  'is-not': 'is-not',
  // Comparison
  greaterThan: 'is-greater-than',
  'greater-than': 'is-greater-than',
  'is-greater-than': 'is-greater-than',
  greaterThanOrEqual: 'is-greater-than-or-equal',
  'greater-than-or-equal': 'is-greater-than-or-equal',
  'is-greater-than-or-equal': 'is-greater-than-or-equal',
  lessThan: 'is-less-than',
  'less-than': 'is-less-than',
  'is-less-than': 'is-less-than',
  lessThanOrEqual: 'is-less-than-or-equal',
  'less-than-or-equal': 'is-less-than-or-equal',
  'is-less-than-or-equal': 'is-less-than-or-equal',
  // Text matching
  contains: 'contains',
  // "matches" in seed data is shorthand for "contains" / regex-style match;
  // the form catalogue doesn't expose a separate regex operator yet, so
  // contains is the closest user-visible analogue.
  matches: 'contains',
  doesNotContain: 'does-not-contain',
  'does-not-contain': 'does-not-contain',
  startsWith: 'starts-with',
  'starts-with': 'starts-with',
  endsWith: 'ends-with',
  'ends-with': 'ends-with',
  // Date
  isOnOrAfter: 'is-on-or-after',
  'is-on-or-after': 'is-on-or-after',
  isOnOrBefore: 'is-on-or-before',
  'is-on-or-before': 'is-on-or-before',
  // Empty
  isBlank: 'is-blank',
  'is-blank': 'is-blank',
  isNotBlank: 'is-not-blank',
  'is-not-blank': 'is-not-blank',
  // Range
  between: 'between',
  // Sets
  isAnyOf: 'is-any-of',
  'is-any-of': 'is-any-of',
};

/**
 * Subsidiaries the current user has access to. In the real product
 * this would come from the user's permissions; in the prototype the
 * current user can see every entity in the company, so the list
 * derives from the canonical entities array and stays in sync as
 * entities are added or removed.
 *
 * Used to pre-populate the Subsidiary foundation row on new rules:
 * every subsidiary the user has access to is selected by default,
 * and the user can deselect any they don't want the rule to apply to.
 */
const USER_ACCESSIBLE_ENTITY_IDS = entities.map((e) => e.id);

/**
 * Full-page "Create Rule" surface — the Rule Builder.
 *
 * Reference: Figma node 2024:46803 in Rules file.
 *   https://www.figma.com/design/jisKCBFEaLCuZljlTaQJYn/Rules?node-id=2024-46803
 *
 * Three sections, each separated by a horizontal divider:
 *   1. Rule Details — Name (required), Description
 *   2. Rule Parameters — natural-language assist, condition groups,
 *      severity 1–5 slider
 *   3. Anomaly Assignees — Rule Owner (required), collapsible
 *      Assignees list with an info banner on Dynamic Assignment
 *
 * Footer: Cancel link + Save primary button.
 *
 * Form state is local — the prototype doesn't persist new rules. Save
 * just calls onClose so the user returns to the Rules table.
 */

type ConditionGroupOp = 'And' | 'Or';

/** Catalogue of condition fields. Used both for the option list when
 *  the user picks a new field, and for picking the value-control
 *  shape (text input vs multi-select) on a per-field basis. */
type ConditionFieldId =
  | 'subsidiary'
  | 'account'
  | 'amount'
  | 'date'
  | 'department'
  | 'class'
  | 'location'
  | 'vendor'
  | 'memo'
  | '';

interface Condition {
  id: string;
  field: ConditionFieldId;
  operator: string;
  /** Free-text value (used by the default text-input rendering). */
  value: string;
  /** Upper bound of a Between range — paired with `value` as the
   *  lower bound and only rendered when operator === 'between'. */
  valueEnd?: string;
  /** Multi-select value (used when the field renders a checklist
   *  picker — currently subsidiary + account). */
  selectedValues?: string[];
  /** Field dropdown is read-only — used for pre-populated conditions
   *  whose field is fixed (Subsidiary, Account). */
  fieldLocked?: boolean;
  /** Operator dropdown is read-only — the foundation rows
   *  (Subsidiary + Account) lock the operator to "Is" because both
   *  fields are inherently inclusion filters; users only edit which
   *  subsidiaries/accounts the rule applies to, not the comparison. */
  operatorLocked?: boolean;
  /** When false, the row can't be removed via the trash icon —
   *  foundational rows like Subsidiary + Account stay anchored. */
  removable?: boolean;
}

interface ConditionGroup {
  id: string;
  op: ConditionGroupOp;
  conditions: Condition[];
  /** Foundation groups hold the locked scope rows (Subsidiary +
   *  Account). They render with simplified chrome: a "Required
   *  parameters" label instead of the And/Or selector, no "+ Add
   *  Condition" link, and no "Remove Group" link. Every rule has
   *  exactly one foundation group, anchored at the top. */
  foundation?: boolean;
}

interface AssigneeRow {
  id: string;
  user: string;
}

let conditionIdCounter = 1;
let groupIdCounter = 1;
let assigneeIdCounter = 1;
const nextConditionId = () => `c-${conditionIdCounter++}`;
const nextGroupId = () => `g-${groupIdCounter++}`;
const nextAssigneeId = () => `a-${assigneeIdCounter++}`;

export function AddRulePage({
  onClose,
  onSaveSuccess,
  onDirtyChange,
  rule,
  initialAssigneeIds,
  hideBackLink = false,
  namePrefix,
  extraSections,
}: {
  onClose: () => void;
  /** Fires whenever the form's dirty state changes. The host uses
   *  this to gate its own dismissal paths (modal close X, backdrop
   *  click, Esc) so the user gets a discard-changes warning if they
   *  try to leave with unsaved edits. */
  onDirtyChange?: (dirty: boolean) => void;
  /** Fires after the Save Rule confirmation dialog is confirmed.
   *  Host wires this to show a "Your rule has been successfully
   *  saved" toast. In edit mode (rule present, no namePrefix) also
   *  carries a snapshot of the form's current state so the host can
   *  persist the changes and record a before/after diff in the
   *  Activity Log. */
  onSaveSuccess?: (info: {
    scope: 'current-and-future' | 'with-historical';
    historicalPeriods: string[];
    /** Present only when editing an existing rule (rule prop set,
     *  namePrefix absent). Carries the form's current field values
     *  so the host can update the rule in the store and capture a
     *  diff for the Activity Log. */
    formSnapshot?: {
      name: string;
      description: string;
      /** Severity on the 1–5 slider scale. */
      severity: number;
      conditions: Array<{ field: string; operator: string; value: string }>;
    };
  }) => void;
  /** When provided, the form opens in EDIT mode — pre-populated with
   *  this rule's name, description, conditions, severity, and owner.
   *  When omitted, opens in CREATE mode with the standard
   *  Subsidiary/Account seed conditions. */
  rule?: Rule;
  /** Assignee ids to pre-populate. In edit mode these come from
   *  RULE_ASSIGNEES at the call site. */
  initialAssigneeIds?: string[];
  /** Hide the "Back to Rules" link at the top — used when this
   *  form is rendered inside another modal (e.g. the rule view
   *  modal's edit mode) where the host owns the back affordance. */
  hideBackLink?: boolean;
  /** Optional string to prepend to the rule's name when pre-filling.
   *  Used by the Duplicate flow — passes "(Copy) " so the
   *  pre-filled name starts as "(Copy) [Original Name]". */
  namePrefix?: string;
  /** Optional content rendered inside the scrollable body after the
   *  three rule sections but above the sticky footer. Used by
   *  RuleDetailModal's edit mode to keep the Activity Log visible
   *  while the user is editing. */
  extraSections?: React.ReactNode;
}) {
  const [name, setName] = useState(
    rule?.name ? `${namePrefix ?? ''}${rule.name}` : '',
  );
  const [description, setDescription] = useState(rule?.description ?? '');
  // Severity in the rule data is 0–100; the slider is 1–5. Map by
  // 20-point band (1–20→1, 21–40→2, etc.). New rules default to 3.
  const [severity, setSeverity] = useState(
    rule ? Math.max(1, Math.min(5, Math.ceil(rule.severity / 20))) : 3,
  );

  // Every rule opens with two groups stacked vertically:
  //   1. A locked "foundation" group holding the required scope
  //      rows — Subsidiary (Is, multi-select, defaults to every
  //      accessible entity) + Account (Is/Is Not toggleable, multi-
  //      select). This group's chrome is simplified: a "Required
  //      parameters" label instead of And/Or, no Add Condition, no
  //      Remove Group. The user can only edit the values.
  //   2. A regular user group seeded with one empty condition row,
  //      which is where the user expresses the rule's actual
  //      triggering logic. Editable, removable, supports Add Group
  //      to chain additional groups.
  // In EDIT/DUPLICATE mode, the foundation group's values are
  // populated from the rule's saved Subsidiary/Account conditions
  // (if present); the user group is populated from the rule's other
  // conditions.
  const [groups, setGroups] = useState<ConditionGroup[]>(() => {
    const buildFoundationRows = (
      existing: Array<{ field?: string; value?: unknown }> = [],
    ): Condition[] => {
      const findValues = (fieldId: string): string[] => {
        const match = existing.find((c) => c.field === fieldId);
        if (!match) return [];
        const v = match.value;
        if (Array.isArray(v)) return v as string[];
        if (typeof v === 'string' && v) return v.split(',').map((s) => s.trim());
        return [];
      };
      const subsidiaryValues = findValues('subsidiary');
      const accountValues = findValues('account');
      return [
        {
          id: nextConditionId(),
          field: 'subsidiary',
          operator: 'is',
          value: '',
          selectedValues:
            subsidiaryValues.length > 0 ? subsidiaryValues : USER_ACCESSIBLE_ENTITY_IDS,
          fieldLocked: true,
          operatorLocked: true,
          removable: false,
        },
        {
          id: nextConditionId(),
          field: 'account',
          operator: 'is',
          // Account operator is editable — users can flip between
          // "Is" (apply to listed accounts) and "Is Not" (apply to
          // everything except listed accounts).
          value: '',
          selectedValues: accountValues,
          fieldLocked: true,
          operatorLocked: false,
          removable: false,
        },
      ];
    };

    if (rule) {
      const otherConditions = rule.conditions
        .filter((c) => c.field !== 'subsidiary' && c.field !== 'account')
        .map((c) => {
          // Convert the saved value into the form's split shape:
          //   - between/range tuples ([min, max]) → value + valueEnd
          //   - strings, numbers, booleans → stringified into value
          //   - anything else → empty
          let value = '';
          let valueEnd: string | undefined;
          if (Array.isArray(c.value) && c.value.length === 2) {
            value = String(c.value[0]);
            valueEnd = String(c.value[1]);
          } else if (
            typeof c.value === 'string' ||
            typeof c.value === 'number' ||
            typeof c.value === 'boolean'
          ) {
            value = String(c.value);
          }
          return {
            id: nextConditionId(),
            field: (c.field as ConditionFieldId) || '',
            operator: OPERATOR_REMAP[c.operator] ?? c.operator,
            value,
            valueEnd,
          };
        });
      return [
        {
          id: nextGroupId(),
          op: 'And',
          foundation: true,
          conditions: buildFoundationRows(rule.conditions),
        },
        {
          id: nextGroupId(),
          op: 'And',
          conditions:
            otherConditions.length > 0
              ? otherConditions
              : [{ id: nextConditionId(), field: '', operator: '', value: '' }],
        },
      ];
    }
    return [
      {
        id: nextGroupId(),
        op: 'And',
        foundation: true,
        conditions: buildFoundationRows(),
      },
      {
        id: nextGroupId(),
        op: 'And',
        conditions: [{ id: nextConditionId(), field: '', operator: '', value: '' }],
      },
    ];
  });

  const [ruleOwnerId, setRuleOwnerId] = useState(
    rule?.createdById ?? team[0]?.id ?? 'samantha-sheldon',
  );
  const [assigneesExpanded, setAssigneesExpanded] = useState(true);
  // CREATE mode starts with a single Dynamic Assignment row; EDIT
  // mode uses whatever RULE_ASSIGNEES has for this rule (filtered to
  // ensure the row ids are unique).
  const [assignees, setAssignees] = useState<AssigneeRow[]>(() => {
    if (initialAssigneeIds && initialAssigneeIds.length > 0) {
      return initialAssigneeIds.map((id) => ({
        id: nextAssigneeId(),
        user: id,
      }));
    }
    return [{ id: nextAssigneeId(), user: 'dynamic' }];
  });

  // Save confirmation dialog — opens when the user clicks Save in
  // the footer. Confirming the dialog calls onSaveSuccess (toast)
  // and onClose (dismiss the form).
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Dirty tracking — snapshot the form state on first render, then
  // compare the live values on every render. The serialized form
  // strips out ephemeral ids that change between sessions, so only
  // user-visible field changes count as "dirty." The result is
  // surfaced to the host via onDirtyChange so it can gate its own
  // dismissal paths with a discard-changes warning.
  const serializeForDirty = () =>
    JSON.stringify({
      name,
      description,
      severity,
      ruleOwnerId,
      assignees: assignees.map((a) => a.user),
      groups: groups.map((g) => ({
        op: g.op,
        foundation: g.foundation ?? false,
        conditions: g.conditions.map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
          selectedValues: c.selectedValues ?? [],
        })),
      })),
    });
  const initialSnapshot = useRef<string | null>(null);
  useEffect(() => {
    // Capture on mount only — `serializeForDirty` closes over the
    // initial values seeded in the useState initializers above.
    if (initialSnapshot.current === null) {
      initialSnapshot.current = serializeForDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dirty =
    initialSnapshot.current !== null &&
    initialSnapshot.current !== serializeForDirty();
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  return (
    // Three-region layout: pinned back link (when shown), scrollable
    // form body, pinned footer. Only the middle region scrolls so the
    // back link and Cancel/Save actions stay visible at all times.
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      {!hideBackLink && (
        <div className="shrink-0">
          <BackToRulesLink onBack={onClose} />
        </div>
      )}

      {/* Scrollable form body — flex-1 + min-h-0 give it the remaining
           vertical space; overflow-y-auto handles overflow. */}
      <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-6 pb-8 pt-2">
        <RuleDetailsSection
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
        />

        <RuleParametersSection
          groups={groups}
          onGroupsChange={setGroups}
          severity={severity}
          onSeverityChange={setSeverity}
        />

        <AnomalyAssigneesSection
          ruleOwnerId={ruleOwnerId}
          onRuleOwnerChange={setRuleOwnerId}
          expanded={assigneesExpanded}
          onToggleExpanded={() => setAssigneesExpanded((v) => !v)}
          assignees={assignees}
          onAssigneesChange={setAssignees}
        />
        {/* Optional extra sections (e.g. Activity Log) rendered after
             the three rule sections, still inside the scroll area. */}
        {extraSections}
      </div>

      {/* Footer — pinned at the bottom of the form by being a sibling
           of the scroll container (the parent flex column doesn't grow
           it). White surface with a top border. */}
      {/* Primary button label tracks the action the user is taking:
            • Create or Duplicate → "Add"
            • Edit an existing rule → "Save Changes"
          `rule` is only set in edit/duplicate mode; `namePrefix` is
          the duplicate marker, so its presence flips us back to a
          create-style label. */}
      <Footer
        onCancel={onClose}
        onSave={() => setSaveDialogOpen(true)}
        saveLabel={rule && !namePrefix ? 'Save' : 'Add'}
      />

      {saveDialogOpen && (
        <SaveRuleDialog
          onCancel={() => setSaveDialogOpen(false)}
          onConfirm={(scope, historicalPeriods) => {
            setSaveDialogOpen(false);
            // Build a point-in-time snapshot of the form's current
            // state — only for edit mode (rule present, not a
            // duplicate). The snapshot lets the host persist the
            // changed fields to the store and record a before/after
            // diff in the Activity Log.
            const formSnapshot =
              rule && !namePrefix
                ? {
                    name,
                    description,
                    severity,
                    // Flatten only user-defined condition groups (exclude
                    // the locked foundation group — Entity/Account are
                    // structural and never change, so they'd just noise
                    // up the Activity Log diff if included).
                    conditions: groups
                      .filter((g) => !g.foundation)
                      .flatMap((g) =>
                        g.conditions
                          .filter((c) => Boolean(c.field))
                          .map((c) => ({
                            field: c.field,
                            operator: c.operator,
                            value:
                              c.selectedValues && c.selectedValues.length > 0
                                ? c.selectedValues.join(', ')
                                : c.valueEnd
                                  ? `${c.value} and ${c.valueEnd}`
                                  : c.value || '—',
                          })),
                      ),
                  }
                : undefined;
            onSaveSuccess?.({ scope, historicalPeriods, formSnapshot });
            // Mark the form clean BEFORE asking the host to close,
            // so the host's gated-close handler doesn't intercept
            // with a discard-changes warning after a successful save.
            onDirtyChange?.(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ---------- Layout primitives ----------

function BackToRulesLink({ onBack }: { onBack: () => void }) {
  // FlowUI back-link pattern — Inter semibold, body-text colour
  // (#1d2433), soft 40% underline that solidifies on hover. Matches
  // the "View Transactions" text-link treatment used elsewhere in
  // the app. Leading ChevronLeft signals direction.
  return (
    <div className="px-6 py-4">
      <button
        type="button"
        onClick={onBack}
        className="!font-['Inter'] inline-flex items-center gap-1 text-[12px] font-semibold leading-4 text-[#1d2433] underline underline-offset-2 decoration-[#1d2433]/40 transition-colors hover:decoration-[#1d2433]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Rules
      </button>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  // Section heading + divider underneath. Inter bold body-size header
  // followed by a thin neutral rule (#e1e6ef) that runs to the edge of
  // the page gutter.
  return (
    <div className="mb-6 border-b border-[#e1e6ef] pb-3">
      <h2 className="font-['Inter'] text-[14px] font-bold leading-5 text-[#1d2433]">
        {title}
      </h2>
    </div>
  );
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  // Form label for required fields. The visible red-asterisk
  // affordance was removed per design feedback — the field is still
  // semantically required but the visual marker is dropped to keep
  // labels uniform with non-required fields.
  return (
    <label className="mb-2 inline-block font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
      {children}
    </label>
  );
}

function PlainLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 inline-block font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
      {children}
    </label>
  );
}

// ---------- Section 1: Rule Details ----------

function RuleDetailsSection({
  name,
  onNameChange,
  description,
  onDescriptionChange,
}: {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
}) {
  return (
    <section>
      {/* "Rule Details" section header removed per design feedback —
            the form opens directly with the Rule Name input. */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <RequiredLabel>Rule Name</RequiredLabel>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Rule Name"
            className="h-10 w-full max-w-[640px] rounded-md border border-[#e1e6ef] bg-white px-3 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <PlainLabel>Description</PlainLabel>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., This rule flags transactions over $1M"
            className="min-h-[120px] w-full max-w-[640px] resize-y rounded-md border border-[#e1e6ef] bg-white px-3 py-2 font-['Inter'] text-[12px] font-medium leading-[18px] text-[#1d2433] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}

// ---------- Section 2: Rule Parameters ----------

function RuleParametersSection({
  groups,
  onGroupsChange,
  severity,
  onSeverityChange,
}: {
  groups: ConditionGroup[];
  onGroupsChange: (next: ConditionGroup[]) => void;
  severity: number;
  onSeverityChange: (n: number) => void;
}) {
  const foundationGroup = groups.find((g) => g.foundation);
  const userGroups = groups.filter((g) => !g.foundation);

  const addGroup = () =>
    onGroupsChange([
      ...groups,
      {
        id: nextGroupId(),
        op: 'And',
        conditions: [{ id: nextConditionId(), field: '', operator: '', value: '' }],
      },
    ]);

  const removeGroup = (id: string) =>
    // Foundation groups can't be removed via the UI; this guard is
    // belt-and-suspenders since the foundation card doesn't render
    // a Remove Group link anyway.
    onGroupsChange(groups.filter((g) => g.id !== id || g.foundation));

  const updateGroup = (id: string, patch: Partial<ConditionGroup>) =>
    onGroupsChange(groups.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  return (
    <section>
      <SectionHeader title="Rule Parameters" />

      {/* Natural-language assist card — collapsed by default; expands
           to reveal a textarea + Generate action when the header row
           is clicked. */}
      <NaturalLanguageAssist />

      <p className="mb-3 font-['Inter'] text-[12px] font-medium leading-4 text-[#424867]">
        Transactions are flagged as anomalous if the following conditions are met
      </p>

      {/* Condition groups stack vertically. The foundation group
           (Subsidiary + Account scope) renders first with simplified
           chrome — no And/Or, no Add Condition, no Remove Group. The
           user-editable groups follow below, separated by the user's
           And/Or pickers. Empty state triggers when the user has
           removed every user group, leaving only the foundation —
           the user can re-add a logic group from the empty CTA. */}
      <div className="flex max-w-[640px] flex-col gap-4">
        {/* Foundation group — always present, always first. */}
        {foundationGroup && (
          <ConditionGroupCard
            key={foundationGroup.id}
            group={foundationGroup}
            isFoundation
            canRemove={false}
            onRemove={() => {}}
            onChange={(patch) => updateGroup(foundationGroup.id, patch)}
            label="Required parameters"
          />
        )}

        {userGroups.map((group, idx) => (
          <ConditionGroupCard
            key={group.id}
            group={group}
            canRemove
            onRemove={() => removeGroup(group.id)}
            onChange={(patch) => updateGroup(group.id, patch)}
            label={`Group ${idx + 1}`}
          />
        ))}

        {/* Add Group — FlowUI secondary button styling. Always
             rendered (even when the user has removed every group)
             so they can re-add logic without an extra empty-state
             screen in the way. */}
        <button
          type="button"
          onClick={addGroup}
          className="inline-flex h-10 w-fit items-center gap-1.5 rounded-md border border-[#e1e6ef] bg-white px-3 font-header text-xs font-bold leading-4 text-[#424867] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1] hover:text-[#1d2433]"
        >
          <Plus className="h-4 w-4" />
          Add Group
        </button>
      </div>

      {/* Severity Level — 1–5 slider, brand-green track + thumb. */}
      <div className="mt-10 max-w-[640px]">
        <PlainLabel>Severity Level</PlainLabel>
        <SeveritySlider value={severity} onChange={onSeverityChange} />
      </div>
    </section>
  );
}

function NaturalLanguageAssist() {
  // Collapsed by default. Expanded state matches Figma node 2123:86870
  // — the header row stays, and a textarea panel slides into view
  // below it with a "Generate" link in the bottom-right corner.
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');

  return (
    <div className="mb-6 max-w-[640px] overflow-hidden rounded-md border border-[#e1e6ef] bg-white">
      {/* Trigger row — title with the AI sparkle, chevron on the
           right. Chevron flips direction based on expanded state to
           signal the next interaction. */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-[#f8fafc]"
      >
        <span className="inline-flex items-center gap-2 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
          Use natural language to describe your rule
          <Sparkles className="h-4 w-4 text-[#7c3aed]" />
        </span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-[#6b7280]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#6b7280]" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[#e1e6ef] p-3">
          {/* Inner textarea panel — neutral border, placeholder hint.
               Generate button sits bottom-right inside the textarea
               card. When the field is empty it reads as a quiet
               disabled link (muted, ghost surface); the moment the
               user types, it promotes itself to the FlowUI primary
               brand-green button used throughout the app, signalling
               "this is now the next action." */}
          <div className="relative rounded-md border border-[#e1e6ef] bg-white focus-within:border-[#3D7BF7]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your rule in natural language"
              className="min-h-[88px] w-full resize-y bg-transparent px-3 pt-2 pb-12 font-['Inter'] text-[12px] font-medium leading-[18px] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
            />
            {prompt.trim() ? (
              <button
                type="button"
                className="absolute bottom-2 right-2 inline-flex h-8 items-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
              >
                Generate
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="!font-['Inter'] absolute bottom-3 right-3 cursor-not-allowed text-[12px] font-semibold leading-4 text-[#adb2bb]"
              >
                Generate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConditionGroupCard({
  group,
  // Remove Group is gated by canRemove and by group.foundation. The
  // foundation group never renders a Remove Group link regardless of
  // this prop.
  canRemove = true,
  onRemove,
  onChange,
  label,
  isFoundation = false,
}: {
  group: ConditionGroup;
  canRemove?: boolean;
  onRemove: () => void;
  onChange: (patch: Partial<ConditionGroup>) => void;
  label: string;
  /** Foundation groups hold the locked scope rows. They render
   *  simplified chrome: a "Required parameters" label instead of
   *  And/Or, no Add Condition link, no Remove Group link. */
  isFoundation?: boolean;
}) {
  const addCondition = () =>
    onChange({
      conditions: [
        ...group.conditions,
        { id: nextConditionId(), field: '', operator: '', value: '' },
      ],
    });

  const removeCondition = (id: string) =>
    onChange({ conditions: group.conditions.filter((c) => c.id !== id) });

  const updateCondition = (id: string, patch: Partial<Condition>) =>
    onChange({
      conditions: group.conditions.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    });

  return (
    <div className="rounded-md border border-[#e1e6ef] bg-white p-4">
      {/* Header row — same shape for foundation and user groups so
           the two read as the same object class. Foundation groups
           render the And selector in disabled state (locked to "And"
           — the conjunction between Subsidiary and Account is
           inherent to scope filtering) and suppress the Remove Group
           link. User groups stay fully editable. */}
      <div className="mb-3 flex items-center justify-between">
        <FlowSelect
          value={group.op}
          onChange={(v) => onChange({ op: v as ConditionGroupOp })}
          options={[
            { value: 'And', label: 'And' },
            { value: 'Or', label: 'Or' },
          ]}
          className="w-[100px]"
          disabled={isFoundation}
        />
        {!isFoundation && canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
          >
            Remove Group
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {group.conditions.map((c) => (
          <ConditionRow
            key={c.id}
            condition={c}
            isFoundation={isFoundation}
            canRemove={group.conditions.length > 1}
            onRemove={() => removeCondition(c.id)}
            onChange={(patch) => updateCondition(c.id, patch)}
          />
        ))}
      </div>

      {/* Add Condition link — hidden on the foundation group, which
           is locked to its two required rows. */}
      {!isFoundation && (
        <button
          type="button"
          onClick={addCondition}
          className="mt-3 inline-flex h-8 items-center gap-1.5 self-start rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Condition
        </button>
      )}
    </div>
  );
}

// Field options for newly-added (user-created) condition rows.
// Subsidiary is excluded from the new-condition dropdown because
// it's seeded as a locked foundation row (scope-only concept).
// Account is INCLUDED so users can build secondary logic on a
// specific account inside a user-added group, without conflicting
// with the locked Account row at the top.
//
// Sourced from the canonical Transaction field catalog — every field
// shown on the Transaction Details panel is selectable here, even
// those hidden by default in that view.
const NEW_CONDITION_FIELD_OPTIONS: FlowSelectOption[] = TRANSACTION_FIELDS
  .filter((f) => f.id !== 'subsidiary')
  .map((f) => ({ value: f.id, label: f.label }));

// Limited operator set for the foundation Account row — the scope
// filter is inclusion-style ("apply this rule to these accounts" /
// "everything except these accounts"), not comparison-style.
const FOUNDATION_ACCOUNT_OPERATORS: FlowSelectOption[] = [
  { value: 'is', label: 'Is' },
  { value: 'is-not', label: 'Is Not' },
];

// Full field catalogue used to render the locked Field dropdown for
// pre-populated rows. Subsidiary is prepended so the locked
// foundation Entity row has a label to display.
const ALL_CONDITION_FIELD_OPTIONS: FlowSelectOption[] = [
  { value: 'subsidiary', label: 'Entity' },
  ...NEW_CONDITION_FIELD_OPTIONS,
];

// Full operator catalogue per Figma node 2055:80203. Long enough that
// the operator dropdown should be searchable.
const CONDITION_OPERATOR_OPTIONS: FlowSelectOption[] = [
  { value: 'is', label: 'Is' },
  { value: 'is-not', label: 'Is Not' },
  { value: 'contains', label: 'Contains' },
  { value: 'does-not-contain', label: 'Does Not Contain' },
  { value: 'starts-with', label: 'Starts With' },
  { value: 'ends-with', label: 'Ends With' },
  { value: 'is-on-or-after', label: 'Is On or After' },
  { value: 'is-on-or-before', label: 'Is On or Before' },
  { value: 'is-greater-than', label: 'Is Greater Than' },
  { value: 'is-greater-than-or-equal', label: 'Is Greater Than or Equal To' },
  { value: 'is-less-than', label: 'Is Less Than' },
  { value: 'is-less-than-or-equal', label: 'Is Less Than or Equal To' },
  { value: 'is-blank', label: 'Is Blank' },
  { value: 'is-not-blank', label: 'Is Not Blank' },
  { value: 'between', label: 'Between' },
  { value: 'is-any-of', label: 'Is Any Of' },
];

function ConditionRow({
  condition,
  canRemove,
  onRemove,
  onChange,
  isFoundation = false,
}: {
  condition: Condition;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (patch: Partial<Condition>) => void;
  /** True when this row lives in the locked foundation group.
   *  Drives a narrower operator set for the Account row (Is / Is
   *  Not only) — Account in a user-added group keeps the full
   *  catalogue. */
  isFoundation?: boolean;
}) {
  // Field-specific value control. Subsidiary + Account render a
  // multi-select against entities / chart-of-accounts; everything
  // else falls back to the free-text input.
  const usesMultiSelect =
    condition.field === 'subsidiary' || condition.field === 'account';
  const removable = condition.removable !== false && canRemove;

  // "Is Blank" / "Is Not Blank" don't take a value — the operator
  // itself says everything. Hide the value column so users can't
  // express "Class is blank" with an empty text input; they pick
  // the "Is Blank" operator instead. The slot reserves the width
  // (210px) so the rest of the row keeps its column alignment.
  const isBlankOperator =
    condition.operator === 'is-blank' || condition.operator === 'is-not-blank';

  // "Between" takes a range — render two value inputs separated by
  // an "and" label so it reads as "field is between {min} and {max}".
  // Mirrors the FDM rule-operation enhancements design (node 16012:30490).
  const isBetweenOperator = condition.operator === 'between';

  // The Account row in the foundation group is a scope filter, so
  // only Is / Is Not make sense. If a user adds Account in a
  // separate group, they get the full operator catalogue.
  const operatorOptions =
    isFoundation && condition.field === 'account'
      ? FOUNDATION_ACCOUNT_OPERATORS
      : CONDITION_OPERATOR_OPTIONS;

  // Column flex factors:
  //   Field    — narrow (short label like "Amount", "Department")
  //   Operator — narrow too (label-only, e.g. "Is", "Between")
  //   Value    — widest (free-text input or multi-select tag list
  //              that needs room to show entries comfortably; also
  //              hosts the dual-input "{min} and {max}" Between
  //              layout). Extra width comes from the operator
  //              column, not the field.
  const fieldClass = 'min-w-0 flex-[0.75]';
  const operatorClass = 'min-w-0 flex-[0.85]';
  const valueClass = 'min-w-0 flex-[1.4]';

  return (
    <div className="flex items-center gap-2">
      <FlowSelect
        value={condition.field}
        onChange={(v) => onChange({ field: v as ConditionFieldId })}
        placeholder="Select Field"
        className={fieldClass}
        disabled={condition.fieldLocked}
        options={
          condition.fieldLocked
            ? ALL_CONDITION_FIELD_OPTIONS
            : NEW_CONDITION_FIELD_OPTIONS
        }
      />
      <FlowSelect
        value={condition.operator}
        onChange={(v) => onChange({ operator: v })}
        placeholder="Select Operator"
        className={operatorClass}
        disabled={condition.operatorLocked}
        // Skip the search input when the option list is short
        // (the constrained foundation-Account set is just 2 items).
        searchable={operatorOptions.length > 6}
        searchPlaceholder="Search operators"
        options={operatorOptions}
      />
      {/* Value column — wrapped in a stable container so the parent
           flex algorithm sees the same element shape regardless of
           operator. Without this wrapper, a single <input> with
           flex-[1.4] gets a different intrinsic width than a flex
           container with flex-[1.4], causing the field/operator
           columns to shift by ~5px when the user switches to
           Between. is-blank / is-not-blank still hide the column
           entirely so the other two stretch into the freed width. */}
      {!isBlankOperator && (
        <div className={valueClass}>
          {isBetweenOperator ? (
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={condition.value}
                onChange={(e) => onChange({ value: e.target.value })}
                placeholder="Type Value"
                className="h-10 min-w-0 flex-1 rounded-md border border-[#cbd2e1] bg-white px-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
              />
              <span className="shrink-0 px-1 font-['Inter'] text-[12px] font-medium leading-4 text-[#1d2433]">
                and
              </span>
              <input
                type="text"
                value={condition.valueEnd ?? ''}
                onChange={(e) => onChange({ valueEnd: e.target.value })}
                placeholder="Type Value"
                className="h-10 min-w-0 flex-1 rounded-md border border-[#cbd2e1] bg-white px-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
              />
            </div>
          ) : usesMultiSelect ? (
            <FlowMultiSelect
              values={condition.selectedValues ?? []}
              onChange={(next) => onChange({ selectedValues: next })}
              placeholder={
                condition.field === 'subsidiary'
                  ? 'Select entities'
                  : 'Select accounts'
              }
              className="w-full"
              searchable
              searchPlaceholder={
                condition.field === 'subsidiary'
                  ? 'Search entities'
                  : 'Search accounts'
              }
              // Account has 100+ entries in the chart of accounts — a
              // Select all toggle gives the user a one-click "apply to
              // every account" pick. Subsidiary already pre-selects all
              // accessible entities by default, so it doesn't need it.
              showSelectAll={condition.field === 'account'}
              options={
                condition.field === 'subsidiary'
                  ? entities.map((e) => ({ value: e.id, label: e.shortName }))
                  : chartOfAccounts.map((a) => ({
                      value: a.code,
                      label: `${a.code} ${a.name}`,
                    }))
              }
            />
          ) : (
            <input
              type="text"
              value={condition.value}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder="Type Value"
              className="h-10 w-full rounded-md border border-[#cbd2e1] bg-white px-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] placeholder:text-[#adb2bb] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:border-[#3d7bf7] focus:outline-none"
            />
          )}
        </div>
      )}
      {/* Trash button — rendered only on removable user-group rows.
           Foundation rows render nothing here (no placeholder), so
           the value column flex-grows into the trailing space and
           visually "fills the rest of the container." */}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove condition"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ---------- FlowSelect — shared FlowUI-aligned dropdown ----------

interface FlowSelectOption {
  value: string;
  label: string;
  /** Optional leading icon shown both in the trigger (when selected)
   *  and next to the option in the open panel. */
  icon?: React.ReactNode;
}

/**
 * Custom FlowUI Select. Replaces the native <select> elements so we
 * can fully style the open panel (native selects only let the
 * browser draw the option list). Closed trigger reads as a standard
 * 40px form input; open panel is a rounded surface with elevation,
 * neutral border, and hover-lift rows.
 */
function FlowSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
  align = 'left',
  searchable = false,
  searchPlaceholder = 'Search',
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: FlowSelectOption[];
  placeholder?: string;
  /** Tailwind utilities for sizing (e.g. width, height). Defaults to
   *  full width of the parent. */
  className?: string;
  /** Which edge of the trigger the panel aligns to. */
  align?: 'left' | 'right';
  /** When true, the panel renders a pinned search input that filters
   *  options by case-insensitive substring against the option label.
   *  Used for long lists like the team roster. */
  searchable?: boolean;
  /** Placeholder text inside the search input. */
  searchPlaceholder?: string;
  /** Locked/read-only — the trigger renders in a muted state, the
   *  chevron is dropped, and clicks do nothing. Selection is still
   *  visible. Used for pre-populated condition rows. */
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  // Computed position of the dropdown panel. The panel renders in a
  // portal at the document body (escapes the modal's overflow-hidden
  // clipping) and is positioned absolutely against the trigger's
  // bounding box.
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const openPanel = () => {
    if (disabled) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({
        top: rect.bottom + 4,
        left: align === 'right' ? undefined : rect.left,
        right: align === 'right' ? window.innerWidth - rect.right : undefined,
        minWidth: rect.width,
      });
    }
    setOpen((v) => !v);
  };

  // Close on outside click + Escape — the panel lives in a portal,
  // so the outside check has to include both the trigger wrapper
  // and the panel itself.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!wrapperRef.current?.contains(t) && !panelRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Reset the search input and auto-focus it when the panel opens —
  // matches the FlowUI Combobox pattern (search-as-you-type without
  // an extra tab stop).
  useEffect(() => {
    if (!open) return;
    setSearch('');
    if (searchable) {
      // Defer focus to after the panel mounts.
      const id = requestAnimationFrame(() => searchRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open, searchable]);

  const selected = options.find((o) => o.value === value);
  const q = search.trim().toLowerCase();
  const filteredOptions =
    searchable && q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Trigger — matches the FilterDropdown pattern (border-[#cbd2e1],
           soft shadow, 8px horizontal padding, text-xs font-normal)
           so single-selects align visually with the multi-selects in
           the same row. Disabled state swaps the surface to the
           neutral-50 tint and mutes the chevron. */}
      <button
        type="button"
        onClick={openPanel}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          disabled
            ? 'cursor-not-allowed border-[#cbd2e1] bg-[#f8fafc]'
            : open
              ? 'border-[#3d7bf7] bg-white'
              : 'border-[#cbd2e1] bg-white hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`flex min-w-0 flex-1 items-center gap-2 truncate font-['Inter'] text-xs font-normal leading-4 ${
            selected ? 'text-[#1d2433]' : 'text-[#adb2bb]'
          }`}
        >
          {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        {/* Chevron always rendered so disabled triggers keep the same
             structural footprint as active ones. In disabled state
             it's muted; otherwise picks up the info-blue when open. */}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${
            disabled
              ? 'text-[#adb2bb]'
              : open
                ? 'rotate-180 text-[#3d7bf7]'
                : 'text-[#6b7280]'
          }`}
        />
      </button>

      {open &&
        createPortal(
          /* FlowUI dropdown panel — portaled to <body> so it escapes
             the modal's overflow-hidden container instead of being
             clipped. Fixed-positioned at the trigger's bottom edge
             via panelStyle, computed in openPanel. */
          <div
            ref={panelRef}
            role="listbox"
            onClick={(e) => e.stopPropagation()}
            style={panelStyle}
            className="fixed z-[200] flex max-h-[280px] flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white font-['Inter'] shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
          >
          {searchable && (
            <div className="relative shrink-0 border-b border-[#e1e6ef] px-2 py-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
              />
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
                No matches
              </p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex h-9 w-full items-center gap-2 px-2 text-left font-['Inter'] text-xs leading-4 transition-colors ${
                      isSelected
                        ? 'bg-[#f0f5ff] font-semibold text-[#1d2433]'
                        : 'font-normal text-[#1d2433] hover:bg-[#f1f3f9]'
                    }`}
                  >
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="flex-1 truncate">{opt.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>,
          document.body,
        )}
    </div>
  );
}

// ---------- FlowMultiSelect — multi-selection dropdown ----------

/**
 * Multi-select dropdown that mirrors the inbox FilterDropdown +
 * MultiSelectPanel pattern (see InboxFilters → FilterSortModal) so
 * the rule builder's value pickers feel identical to the team's
 * existing filter chrome:
 *
 *   - Trigger: 40px, neutral-300 border with soft shadow, info-blue
 *     border + rotated info-blue chevron when open
 *   - Panel: portaled to document.body so it escapes the host
 *     modal's `overflow-hidden`. Positioned at the trigger's
 *     bounding rect; min-width matches the trigger
 *   - Search input: borderless, transparent surface, leading magnify
 *     icon, autoFocus on open
 *   - Selected-at-top: items already checked when the panel opens
 *     stay pinned above a divider with a Clear text-link; freshly
 *     checked items remain in their original list position so the
 *     list doesn't reshuffle as the user selects
 *   - Rows: 36px tall, brand-green checkbox fill, label goes
 *     semibold when checked
 */
function FlowMultiSelect({
  values,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
  searchable = false,
  searchPlaceholder = 'Search…',
  showSelectAll = false,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  options: FlowSelectOption[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** When true, renders a "Select all" checkbox row at the top of the
   *  panel that toggles every option on/off in one click. Useful for
   *  large option lists like the chart of accounts. */
  showSelectAll?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({ top: rect.bottom + 4, left: rect.left, minWidth: rect.width });
    }
    setOpen(true);
  };

  // Close on outside click + Escape. The panel lives in a portal, so
  // the outside check has to include both the trigger and the panel.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) {
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

  const selectedLabels = options
    .filter((o) => values.includes(o.value))
    .map((o) => o.label);
  const triggerText =
    selectedLabels.length === 0 ? placeholder : selectedLabels.join(', ');
  const isEmpty = selectedLabels.length === 0;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border bg-white px-2 text-left shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FAC76]/20 ${
          open ? 'border-[#3d7bf7]' : 'border-[#cbd2e1] hover:border-[#9aa3b5]'
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate font-['Inter'] text-xs font-normal leading-4 ${
            isEmpty ? 'text-[#adb2bb]' : 'text-[#1d2433]'
          }`}
        >
          {triggerText}
        </span>
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
            // Stop click propagation so the portaled panel doesn't
            // bubble through React's synthetic event tree to the
            // host modal's backdrop onClick.
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] overflow-hidden rounded-md border border-[#e1e6ef] bg-white font-['Inter'] shadow-[0px_4px_12px_rgba(0,0,0,0.15)]"
            style={panelStyle}
          >
            <FlowMultiSelectPanel
              options={options}
              selected={values}
              onChange={onChange}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              showSelectAll={showSelectAll}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

function FlowMultiSelectPanel({
  options,
  selected,
  onChange,
  searchable,
  searchPlaceholder,
  showSelectAll = false,
}: {
  options: FlowSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
}) {
  const [search, setSearch] = useState('');

  // Snapshot of what was selected when the panel mounted. Items in
  // this set stay pinned to the top (with a Clear/divider below them);
  // newly checked items during this session remain in their original
  // position. Mirrors the inbox MultiSelectPanel behaviour so items
  // don't reshuffle while the user is selecting.
  const initialSelectedSet = useMemo(() => new Set(selected), []);
  const hadInitialSelection = initialSelectedSet.size > 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, search]);

  const topOptions = filtered.filter((o) => initialSelectedSet.has(o.value));
  const bottomOptions = filtered.filter((o) => !initialSelectedSet.has(o.value));

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  return (
    <div className="w-full">
      {searchable && (
        <div className="relative border-b border-[#e1e6ef] px-2 py-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#adb2bb]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder ?? 'Search…'}
            className="h-7 w-full rounded-md bg-transparent pl-6 pr-2 font-['Inter'] text-xs font-normal text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
            autoFocus
          />
        </div>
      )}
      <div className="max-h-56 overflow-y-auto">
        {/* Select all is rendered as the first row INSIDE the same
             padded list container as the rest of the options, so the
             spacing between it and the next option is identical to
             the spacing between any two adjacent options. It sits in
             the top section when there are pinned-selected items,
             otherwise in the only/bottom section. */}
        {(() => {
          const selectAllRow = showSelectAll ? (
            <FlowCheckboxRow
              label="Select all"
              checked={selected.length === options.length && options.length > 0}
              onClick={() => {
                if (selected.length === options.length) {
                  onChange([]);
                } else {
                  onChange(options.map((o) => o.value));
                }
              }}
            />
          ) : null;

          return (
            <>
              {hadInitialSelection ? (
                <>
                  <div className="p-1">
                    {selectAllRow}
                    {topOptions.map((o) => (
                      <FlowCheckboxRow
                        key={o.value}
                        label={o.label}
                        icon={o.icon}
                        checked={selectedSet.has(o.value)}
                        onClick={() => toggle(o.value)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center border-b border-[#e1e6ef] px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onChange([])}
                      disabled={selected.length === 0}
                      className="font-['Inter'] text-xs font-semibold leading-4 text-[#3d7bf7] transition-colors hover:text-[#1e4eae] disabled:cursor-not-allowed disabled:text-[#adb2bb]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-1">
                    {filtered.length === 0 && (
                      <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
                        No matches
                      </p>
                    )}
                    {bottomOptions.map((o) => (
                      <FlowCheckboxRow
                        key={o.value}
                        label={o.label}
                        icon={o.icon}
                        checked={selectedSet.has(o.value)}
                        onClick={() => toggle(o.value)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-1">
                  {selectAllRow}
                  {filtered.length === 0 && (
                    <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
                      No matches
                    </p>
                  )}
                  {bottomOptions.map((o) => (
                    <FlowCheckboxRow
                      key={o.value}
                      label={o.label}
                      icon={o.icon}
                      checked={selectedSet.has(o.value)}
                      onClick={() => toggle(o.value)}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

function FlowCheckboxRow({
  label,
  icon,
  checked,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onClick: () => void;
}) {
  // Matches the inbox CheckboxRow — 36px tall, brand-600 fill when
  // checked, label goes semibold to reinforce the selected state.
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2 px-2 text-left transition-colors hover:bg-[#f1f3f9]"
    >
      <span
        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
          checked ? 'border-[#1FAC76] bg-[#1FAC76]' : 'border-[#cbd2e1] bg-white'
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      {icon && <span className="shrink-0">{icon}</span>}
      <span
        className={`min-w-0 flex-1 truncate font-['Inter'] text-xs leading-4 text-[#1d2433] ${
          checked ? 'font-semibold' : 'font-normal'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function SeveritySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  // 1–5 severity slider. Track is the brand brand-600 green; thumb is
  // a larger green dot with a soft halo. Each integer position renders
  // a small green tick dot, with the number labeled below.
  const levels = [1, 2, 3, 4, 5];
  return (
    <div className="relative pb-6 pt-4">
      {/* Track */}
      <div className="relative h-[2px] w-full bg-[#1FAC76]">
        {levels.map((n) => {
          const pct = ((n - 1) / 4) * 100;
          const isActive = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
              aria-label={`Severity ${n}`}
              aria-pressed={isActive}
            >
              {isActive ? (
                // Active thumb — dark green dot with a translucent halo.
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inset-[-6px] rounded-full bg-[#1FAC76]/20" />
                  <span className="h-3.5 w-3.5 rounded-full bg-[#186749]" />
                </span>
              ) : (
                // Tick dot — small filled green circle.
                <span className="block h-2.5 w-2.5 rounded-full bg-[#1FAC76]" />
              )}
            </button>
          );
        })}
      </div>
      {/* Numeric labels under each tick — absolutely positioned with
           the same `left: pct% + -translate-x-1/2` math the ticks use,
           so labels stay centered directly under their ticks regardless
           of font width. */}
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

// ---------- Section 3: Anomaly Assignees ----------

function AnomalyAssigneesSection({
  ruleOwnerId,
  onRuleOwnerChange,
  expanded,
  onToggleExpanded,
  assignees,
  onAssigneesChange,
}: {
  ruleOwnerId: string;
  onRuleOwnerChange: (id: string) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  assignees: AssigneeRow[];
  onAssigneesChange: (next: AssigneeRow[]) => void;
}) {
  const addAssignee = () =>
    // New rows start unselected — no auto-populate to Dynamic
    // Assignment. The placeholder reads "Select" until the user
    // picks an assignee.
    onAssigneesChange([
      ...assignees,
      { id: nextAssigneeId(), user: '' },
    ]);

  const removeAssignee = (id: string) =>
    onAssigneesChange(assignees.filter((a) => a.id !== id));

  const updateAssignee = (id: string, patch: Partial<AssigneeRow>) =>
    onAssigneesChange(
      assignees.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );

  // Owner reference kept for parity with the type API; FlowSelect
  // now handles the trigger rendering, so we only need the value here.
  void ruleOwnerId;

  return (
    <section>
      <SectionHeader title="Assignees" />

      {/* Rule Owner — FlowSelect with each member's avatar as a leading
           icon. Searchable so the team roster filters as the user
           types. */}
      <div className="mb-5 max-w-[640px]">
        <RequiredLabel>Rule Owner</RequiredLabel>
        <FlowSelect
          value={ruleOwnerId}
          onChange={onRuleOwnerChange}
          searchable
          searchPlaceholder="Search team members"
          options={team.map((m) => ({
            value: m.id,
            label: m.name,
            icon: (
              <img
                src={m.avatar}
                alt=""
                className="h-6 w-6 rounded-full border border-white object-cover"
              />
            ),
          }))}
        />
      </div>

      {/* Collapsible Assignees card. Header is a button that toggles
           open/closed. When open: caption + info banner + assignee
           rows + Add Assignee link. */}
      <div className="max-w-[640px] rounded-md border border-[#e1e6ef] bg-white">
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="font-['Inter'] text-[12px] font-bold leading-4 text-[#1d2433]">
            Assignees
          </span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-[#6b7280]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#6b7280]" />
          )}
        </button>

        {expanded && (
          <div className="border-t border-[#e1e6ef] px-4 py-4">
            <p className="mb-3 font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
              The users listed here will be assigned to investigate and resolve the anomaly.
            </p>

            {/* FlowUI informational banner — info-primary border
                  (#3D7BF7) on info-secondary surface (#F0F5FF), Info
                  icon in the same primary. */}
            <div className="mb-4 flex items-start gap-2 rounded-md border border-[#3D7BF7] bg-[#F0F5FF] px-3 py-2.5">
              <Info size={16} color="#3D7BF7" style={{ flexShrink: 0, marginTop: 2 }} />
              <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
                Dynamic Assignment uses AI to determine the assignee based on current user assignments across the platform. If a match can't be determined, it will be assigned to the Rule Owner
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {assignees.map((a) => (
                <AssigneeRowControl
                  key={a.id}
                  assignee={a}
                  canRemove={assignees.length > 1}
                  // Ids already picked in OTHER rows (team members
                  // AND 'dynamic'). Excluded from this row's options
                  // so the user can't pick the same value twice —
                  // only one Dynamic Assignment row is meaningful.
                  unavailableUserIds={assignees
                    .filter((other) => other.id !== a.id && other.user)
                    .map((other) => other.user)}
                  onRemove={() => removeAssignee(a.id)}
                  onChange={(patch) => updateAssignee(a.id, patch)}
                />
              ))}
            </div>

            {/* FlowUI text link — Inter semibold, body-text color,
                 soft 40% underline that solidifies on hover. Matches
                 the "View Transactions" link pattern. */}
            <button
              type="button"
              onClick={addAssignee}
              className="mt-3 inline-flex h-8 items-center gap-1.5 self-start rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Assignee
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function AssigneeRowControl({
  assignee,
  canRemove,
  unavailableUserIds,
  onRemove,
  onChange,
}: {
  assignee: AssigneeRow;
  canRemove: boolean;
  /** Team-member ids already chosen in other assignee rows. Filtered
   *  out of this row's options so the same person can't be picked
   *  twice. */
  unavailableUserIds: string[];
  onRemove: () => void;
  onChange: (patch: Partial<AssigneeRow>) => void;
}) {
  // Sparkles icon marks the AI-driven option both in the trigger
  // (when selected) and in the panel row, so the AI affordance is
  // visible regardless of where the user is looking.
  const sparkle = <Sparkles className="h-4 w-4 text-[#7c3aed]" />;

  // Build the option list — every value already picked in another
  // row is filtered out, including Dynamic Assignment. Only one
  // Dynamic row is meaningful; once one exists, the option drops
  // from every other row's dropdown.
  const options: FlowSelectOption[] = [];
  if (!unavailableUserIds.includes('dynamic')) {
    options.push({ value: 'dynamic', label: 'Dynamic Assignment', icon: sparkle });
  }
  for (const m of team) {
    if (!unavailableUserIds.includes(m.id)) {
      options.push({
        value: m.id,
        label: m.name,
        // Avatar prefix — same treatment as the Rule Owner picker,
        // so the trigger (when a team member is selected) and each
        // option row both render the member's portrait.
        icon: (
          <img
            src={m.avatar}
            alt=""
            className="h-6 w-6 rounded-full border border-white object-cover"
          />
        ),
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Single assignee dropdown — Dynamic Assignment + the full
           team minus anyone already picked in another row.
           Searchable so the roster filters as the user types. */}
      <FlowSelect
        value={assignee.user}
        onChange={(v) => onChange({ user: v })}
        placeholder="Select"
        className="flex-1"
        searchable
        searchPlaceholder="Search team members"
        options={options}
      />

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Remove assignee"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6b7280]"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------- Footer ----------

function Footer({
  onCancel,
  onSave,
  saveLabel,
}: {
  onCancel: () => void;
  onSave: () => void;
  /** Label for the primary button — tied to the action being
   *  performed. Create / Duplicate flows pass "Add Rule"; Edit flow
   *  passes "Save Changes". */
  saveLabel: string;
}) {
  // Footer pinned to the bottom of the form. The parent flex column
  // doesn't grow this row, so it stays at the bottom by default —
  // no sticky positioning needed since the scroll happens in the
  // sibling above. Right-aligned so the primary action sits at the
  // rightmost edge, matching the FlowUI form footer convention.
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#e1e6ef] bg-white px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-9 items-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#424867] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="inline-flex h-9 items-center rounded-md bg-[#1FAC76] px-4 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
      >
        {saveLabel}
      </button>
    </div>
  );
}
