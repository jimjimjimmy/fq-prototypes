import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { ChevronDown, ChevronLeft, Plus, Sparkles, Trash2 } from 'lucide-react';
import type { Rule, RuleCondition, RuleConditionOperator } from '../../../data/types';
import { useAppStore } from '../../../store/useAppStore';
import { team } from '../../../data/team';
import { TRANSACTION_FIELD_OPTIONS, LEGACY_FIELD_ALIASES } from '../../../data/transactionFields';

interface Props {
  rule: Rule;
  assignees: string[];
  onSaved: (toast: string) => void;
  onBack: () => void;
  /** Optional ref the parent can use to trigger save — lets the Save
   *  button live in the Modal's sticky footer instead of inside this body. */
  saveRef?: MutableRefObject<(() => void) | null>;
  /** Optional callback so the parent can track the form's dirty state to
   *  enable/disable a hoisted Save button. */
  onDirtyChange?: (dirty: boolean) => void;
  /** Hide the in-body Back/Save row (used when buttons are hoisted). */
  hideFooter?: boolean;
}

// ── Editable condition tree ──────────────────────────────────────────────────

interface EditableCondition {
  id: string;
  kind: 'condition';
  field: string;
  operator: string;
  value: string;
  /** Upper bound of a Between range — paired with `value` as the
   *  lower bound. Only used when operator === 'between'. */
  valueEnd?: string;
}

interface EditableGroup {
  id: string;
  kind: 'group';
  logic: 'AND' | 'OR';
  conditions: EditableCondition[];
}

type RootItem = EditableCondition | EditableGroup;

// ── Field / operator options ─────────────────────────────────────────────────

// Sourced from the canonical Transaction field catalog so the rule
// field dropdown always reflects what's available on the Transaction
// Details panel — including fields hidden there by default.
const FIELD_OPTIONS = TRANSACTION_FIELD_OPTIONS;

// Figma-canonical operator catalogue (Rules file node 2055:80203).
// 16 entries, displayed in this order in the dropdown.
const OPERATOR_OPTIONS = [
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

// Operators that don't take a value input. Includes the legacy
// camelCase variants so existing seeded rules still hide their
// value column correctly.
const NO_VALUE_OPERATORS = new Set([
  'is-blank', 'is-not-blank',
  'isEmpty', 'isNotEmpty',
]);

// ── Severity labels ──────────────────────────────────────────────────────────

const SEVERITY_LABELS: Record<number, string> = {
  1: 'Low risk — informational issues unlikely to require immediate action.',
  2: 'Moderate risk — issues that may warrant review but rarely indicate material risk.',
  3: 'Meaningful risk — issues that should be prioritized in the review queue.',
  4: 'High risk — often indicates a control failure; should be reviewed quickly.',
  5: 'Critical — material weakness indicators requiring immediate escalation.',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function newId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toEditable(c: RuleCondition): EditableCondition {
  // Conditions stored as equals/'' represent "is blank" — show as is-blank
  const isBlank = (c.operator === 'equals' || c.operator === 'matches') && c.value === '';
  // Migrate any seeded camelCase operator values to the Figma-canonical
  // kebab-case so the dropdown shows them as selected.
  const LEGACY_TO_CANONICAL: Record<string, string> = {
    equals: 'is',
    notEquals: 'is-not',
    greaterThan: 'is-greater-than',
    lessThan: 'is-less-than',
    matches: 'contains',
    doesNotContain: 'does-not-contain',
    startsWith: 'starts-with',
    endsWith: 'ends-with',
    isEmpty: 'is-blank',
    isNotEmpty: 'is-not-blank',
  };
  const op = isBlank ? 'is-blank' : (LEGACY_TO_CANONICAL[c.operator] ?? c.operator);
  // Migrate any legacy field id to its canonical Transaction Details
  // counterpart so the dropdown selects the right option.
  const fieldId = LEGACY_FIELD_ALIASES[c.field] ?? c.field;
  return {
    id: c.id,
    kind: 'condition',
    field: fieldId,
    operator: op,
    value: isBlank || Array.isArray(c.value) ? '' : String(c.value ?? ''),
  };
}

function fromEditable(c: EditableCondition): RuleCondition {
  const fieldLabel = FIELD_OPTIONS.find((f) => f.value === c.field)?.label ?? c.field;
  const opLabel = OPERATOR_OPTIONS.find((o) => o.value === c.operator)?.label ?? c.operator;
  const numVal = Number(c.value);
  const value: string | number = c.value !== '' && !isNaN(numVal) ? numVal : c.value;
  return {
    id: c.id,
    field: c.field,
    operator: c.operator as RuleConditionOperator,
    value,
    label: `${fieldLabel} ${opLabel}${c.value ? ` ${c.value}` : ''}`,
    expectedText: c.value || fieldLabel,
  };
}

function flattenItems(items: RootItem[]): EditableCondition[] {
  return items.flatMap((item) =>
    item.kind === 'condition' ? [item] : item.conditions,
  );
}

function defaultCondition(): EditableCondition {
  return { id: newId(), kind: 'condition', field: 'amount', operator: 'is', value: '' };
}

function generateConditionsFromText(text: string): EditableCondition[] {
  const lower = text.toLowerCase();
  const fieldKeywords: [RegExp, string][] = [
    [/\bdepartment\b/, 'department'],
    [/\bclass\b/, 'class'],
    [/\blocation\b/, 'location'],
    [/\bamount\b|\bdollar\b|\$/, 'amount'],
    [/\bdescription\b|\bdesc\b|\bmemo\b/, 'memo'],
    [/\btype\b/, 'type'],
    [/\baccount\b|\bacct\b/, 'account'],
    [/\bdate\b/, 'transactionDate'],
    [/\bentity\b|\bsubsidiary\b/, 'subsidiary'],
    [/\bvendor\b/, 'vendor'],
    [/\bsubmitter\b|\bcreated by\b|\bapprover\b/, 'createdBy'],
    [/\bcurrency\b/, 'currency'],
    [/\breversal\b/, 'reversalId'],
  ];

  const sentences = lower.split(/[,;]|\band\b/).map((s) => s.trim()).filter(Boolean);
  const results: EditableCondition[] = [];

  for (const sentence of sentences) {
    let field = 'amount';
    for (const [re, f] of fieldKeywords) {
      if (re.test(sentence)) { field = f; break; }
    }
    let operator = 'is';
    let value = '';
    if (/\b(?:blank|empty|missing|null)\b/.test(sentence)) {
      operator = 'is-blank';
    } else if (/\b(?:greater than|more than|over|above|exceed)\b/.test(sentence)) {
      operator = 'is-greater-than';
      const m = sentence.match(/[\d,]+(?:\.\d+)?/);
      value = m ? m[0].replace(/,/g, '') : '';
    } else if (/\b(?:less than|under|below)\b/.test(sentence)) {
      operator = 'is-less-than';
      const m = sentence.match(/[\d,]+(?:\.\d+)?/);
      value = m ? m[0].replace(/,/g, '') : '';
    } else if (/\b(?:contain|include|has)\b/.test(sentence)) {
      operator = 'contains';
      const m = sentence.match(/"([^"]+)"|'([^']+)'|(?:contains?|includes?|has)\s+(\S+)/);
      value = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
    } else if (/\b(?:not equal|does not equal|doesn't equal)\b/.test(sentence)) {
      operator = 'is-not';
      const m = sentence.match(/"([^"]+)"|'([^']+)'/);
      value = m ? (m[1] ?? m[2] ?? '') : '';
    } else if (/\b(?:starts? with|begins? with)\b/.test(sentence)) {
      operator = 'starts-with';
      const m = sentence.match(/"([^"]+)"|'([^']+)'|(?:starts?|begins?)\s+with\s+(\S+)/);
      value = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
    } else if (/\b(?:ends? with)\b/.test(sentence)) {
      operator = 'ends-with';
      const m = sentence.match(/"([^"]+)"|'([^']+)'|ends?\s+with\s+(\S+)/);
      value = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
    } else {
      const m = sentence.match(/"([^"]+)"|'([^']+)'|(?:equals?|is)\s+(\S+)/);
      if (m) { operator = 'is'; value = m[1] ?? m[2] ?? m[3] ?? ''; }
    }
    results.push({ id: newId(), kind: 'condition', field, operator, value });
  }
  return results.length > 0 ? results : [defaultCondition()];
}

// ── Sub-components ───────────────────────────────────────────────────────────

function LogicBadge({
  logic,
  onToggle,
}: {
  logic: 'AND' | 'OR';
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
        logic === 'AND'
          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
      }`}
    >
      {logic}
    </button>
  );
}

function ConditionRow({
  condition,
  onChange,
  onRemove,
}: {
  condition: EditableCondition;
  onChange: (patch: Partial<EditableCondition>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Field */}
      <div className="relative min-w-0 flex-1">
        <select
          value={condition.field}
          onChange={(e) => onChange({ field: e.target.value })}
          className="h-8 w-full appearance-none rounded-md border border-slate-200 bg-white px-2.5 pr-6 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
        >
          {FIELD_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-2 h-3.5 w-3.5 text-slate-400" />
      </div>

      {/* Operator */}
      <div className="relative w-36 shrink-0">
        <select
          value={condition.operator}
          onChange={(e) => onChange({ operator: e.target.value })}
          className="h-8 w-full appearance-none rounded-md border border-slate-200 bg-white px-2.5 pr-6 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
        >
          {OPERATOR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-2 h-3.5 w-3.5 text-slate-400" />
      </div>

      {/* Value — Between renders two inputs joined by an "and" label
           so the row reads as "field is between {min} and {max}".
           Other operators render a single value input. */}
      {!NO_VALUE_OPERATORS.has(condition.operator) && (
        condition.operator === 'between' ? (
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <input
              value={condition.value}
              onChange={(e) => onChange({ value: e.target.value })}
              placeholder="value"
              className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
            <span className="shrink-0 px-0.5 font-['Inter'] text-xs font-medium leading-4 text-slate-700">
              and
            </span>
            <input
              value={condition.valueEnd ?? ''}
              onChange={(e) => onChange({ valueEnd: e.target.value })}
              placeholder="value"
              className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
          </div>
        ) : (
          <input
            value={condition.value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="value"
            className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
          />
        )
      )}

      {/* Trash */}
      <button
        type="button"
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function NestedGroupView({
  group,
  onToggleLogic,
  onAddCondition,
  onRemoveCondition,
  onChangeCondition,
}: {
  group: EditableGroup;
  onToggleLogic: () => void;
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
  onChangeCondition: (id: string, patch: Partial<EditableCondition>) => void;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <LogicBadge logic={group.logic} onToggle={onToggleLogic} />
        <span className="text-sm text-slate-600">Group</span>
      </div>

      {/* Conditions */}
      {group.conditions.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {group.conditions.map((c) => (
            <ConditionRow
              key={c.id}
              condition={c}
              onChange={(patch) => onChangeCondition(c.id, patch)}
              onRemove={() => onRemoveCondition(c.id)}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        type="button"
        onClick={onAddCondition}
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
      >
        <Plus className="h-3 w-3" /> Add Condition
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function RuleDetail({ rule, assignees, onSaved, onBack, saveRef, onDirtyChange, hideFooter }: Props) {
  const updateRule = useAppStore((s) => s.updateRule);

  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [ownerId, setOwnerId] = useState(rule.createdById);
  const [severityLevel, setSeverityLevel] = useState(3);
  const [preparerIds, setPreparerIds] = useState<string[]>(assignees);
  const [reviewerIds, setReviewerIds] = useState<string[]>(['dynamic']);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [rootLogic, setRootLogic] = useState<'AND' | 'OR'>('AND');
  const [rootItems, setRootItems] = useState<RootItem[]>(
    () => rule.conditions.map(toEditable),
  );

  // Dirty tracking
  const [initialJson] = useState(
    () => JSON.stringify(rule.conditions.map(toEditable)),
  );
  const dirty =
    name !== rule.name ||
    description !== rule.description ||
    ownerId !== rule.createdById ||
    severityLevel !== 3 ||
    JSON.stringify(rootItems) !== initialJson;

  // ── Assignment helpers ──

  const assignmentOptions = (ids: string[], slotIndex: number) => {
    const othersSelected = ids.filter((id, i) => i !== slotIndex && id !== 'dynamic');
    return team.filter((m) => !othersSelected.includes(m.id));
  };

  const addPreparer = () => {
    const used = preparerIds.filter((id) => id !== 'dynamic');
    const next = team.find((m) => !used.includes(m.id));
    setPreparerIds((prev) => [...prev, next?.id ?? 'dynamic']);
  };

  const addReviewer = () => {
    const used = reviewerIds.filter((id) => id !== 'dynamic');
    const next = team.find((m) => !used.includes(m.id));
    setReviewerIds((prev) => [...prev, next?.id ?? 'dynamic']);
  };

  // ── Root item operations ──

  const addRootCondition = () =>
    setRootItems((prev) => [...prev, defaultCondition()]);

  const addGroup = () =>
    setRootItems((prev) => [
      ...prev,
      { id: newId(), kind: 'group', logic: 'AND', conditions: [defaultCondition()] },
    ]);

  const removeRootItem = (id: string) =>
    setRootItems((prev) => prev.filter((item) => item.id !== id));

  const updateRootCondition = (id: string, patch: Partial<EditableCondition>) =>
    setRootItems((prev) =>
      prev.map((item) => {
        if (item.kind !== 'condition' || item.id !== id) return item;
        const next = { ...item, ...patch };
        if (patch.operator && NO_VALUE_OPERATORS.has(patch.operator)) next.value = '';
        return next;
      }),
    );

  // ── Group operations ──

  const toggleGroupLogic = (groupId: string) =>
    setRootItems((prev) =>
      prev.map((item) =>
        item.kind === 'group' && item.id === groupId
          ? { ...item, logic: item.logic === 'AND' ? 'OR' : 'AND' }
          : item,
      ),
    );

  const addConditionToGroup = (groupId: string) =>
    setRootItems((prev) =>
      prev.map((item) =>
        item.kind === 'group' && item.id === groupId
          ? { ...item, conditions: [...item.conditions, defaultCondition()] }
          : item,
      ),
    );

  const removeConditionFromGroup = (groupId: string, conditionId: string) =>
    setRootItems((prev) =>
      prev
        .map((item) =>
          item.kind === 'group' && item.id === groupId
            ? { ...item, conditions: item.conditions.filter((c) => c.id !== conditionId) }
            : item,
        )
        .filter((item) => !(item.kind === 'group' && item.conditions.length === 0)),
    );

  const updateGroupCondition = (
    groupId: string,
    conditionId: string,
    patch: Partial<EditableCondition>,
  ) =>
    setRootItems((prev) =>
      prev.map((item) => {
        if (item.kind !== 'group' || item.id !== groupId) return item;
        return {
          ...item,
          conditions: item.conditions.map((c) => {
            if (c.id !== conditionId) return c;
            const next = { ...c, ...patch };
            if (patch.operator && NO_VALUE_OPERATORS.has(patch.operator)) next.value = '';
            return next;
          }),
        };
      }),
    );

  // ── Save ──

  const save = () => {
    if (!dirty) { onBack(); return; }
    updateRule(rule.id, {
      name,
      description,
      createdById: ownerId,
      severity: severityLevel * 20,
      conditions: flattenItems(rootItems).map(fromEditable),
    });
    onSaved('Rule updated — engine re-evaluated all transactions');
  };

  // ── AI generate ──

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setRootItems(generateConditionsFromText(aiPrompt));
    setAiLoading(false);
    setAiExpanded(false);
  };

  // Keep the parent (RulesModal) in sync so it can render the Back/Save
  // buttons in the Modal's actual sticky footer slot.
  if (saveRef) saveRef.current = save;
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);

  return (
    <div className="space-y-0">

      {/* Back nav */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        All rules
      </button>

      {/* Name */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Large Transactions"
          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this rule detects..."
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 resize-none"
        />
      </div>

      {/* Rule Owner */}
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Rule Owner</label>
        <div className="relative">
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
          >
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
        <p className="mt-1.5 text-xs text-teal-600">
          The Rule Owner is the default assignee when dynamic assignment cannot determine who should be assigned.
        </p>
      </div>

      <div className="mb-5 border-t border-slate-100" />

      {/* Create Rule with AI */}
      <div className="mb-5 rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setAiExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-800"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Create Rule with AI
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${aiExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {aiExpanded && (
          <div className="border-t border-slate-100 px-3.5 py-3 space-y-2.5">
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='Describe the rule in plain English, e.g. "Flag transactions where the amount is greater than $10,000 and the description is blank"'
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 resize-none"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                AI will map your description to parameters below.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!aiPrompt.trim() || aiLoading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Parameters */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">Parameters</label>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          {/* Root group header */}
          <div className="mb-3 flex items-center gap-2">
            <LogicBadge logic={rootLogic} onToggle={() => setRootLogic((v) => v === 'AND' ? 'OR' : 'AND')} />
            <span className="text-sm text-slate-600">Group</span>
          </div>

          {/* Root items (conditions + nested groups) */}
          {rootItems.length > 0 && (
            <div className="mb-3 space-y-2">
              {rootItems.map((item) =>
                item.kind === 'condition' ? (
                  <ConditionRow
                    key={item.id}
                    condition={item}
                    onChange={(patch) => updateRootCondition(item.id, patch)}
                    onRemove={() => removeRootItem(item.id)}
                  />
                ) : (
                  <NestedGroupView
                    key={item.id}
                    group={item}
                    onToggleLogic={() => toggleGroupLogic(item.id)}
                    onAddCondition={() => addConditionToGroup(item.id)}
                    onRemoveCondition={(cid) => removeConditionFromGroup(item.id, cid)}
                    onChangeCondition={(cid, patch) => updateGroupCondition(item.id, cid, patch)}
                  />
                ),
              )}
            </div>
          )}

          {/* Root add buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addRootCondition}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <Plus className="h-3 w-3" /> Add Condition
            </button>
            <button
              type="button"
              onClick={addGroup}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:bg-[#f1f3f9] hover:text-[#1d2433]"
            >
              <Plus className="h-3 w-3" /> Add Group
            </button>
          </div>
        </div>
      </div>

      {/* Anomaly Assignment */}
      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-slate-700">Anomaly Assignment</label>
        <div className="grid grid-cols-2 gap-4">

          {/* Preparers */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-600">Preparers</p>
            <div className="space-y-1.5 mb-1.5">
              {preparerIds.map((val, i) => (
                <div key={i} className="relative">
                  <select
                    value={val}
                    onChange={(e) => setPreparerIds((prev) => prev.map((v, j) => j === i ? e.target.value : v))}
                    className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  >
                    <option value="dynamic">Dynamic Assignment</option>
                    {assignmentOptions(preparerIds, i).map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
            {preparerIds.includes('dynamic') && (
              <p className="mb-2 text-[11px] leading-snug text-slate-500">
                Automatically assigns the anomaly to the Assignee of the associated Balance Sheet Reconciliation in FloQast.
              </p>
            )}
            <button
              type="button"
              onClick={addPreparer}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-1.5 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              <Plus className="h-3 w-3" /> Add Preparer
            </button>
          </div>

          {/* Reviewers */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-600">Reviewers</p>
            <div className="space-y-1.5 mb-1.5">
              {reviewerIds.map((val, i) => (
                <div key={i} className="relative">
                  <select
                    value={val}
                    onChange={(e) => setReviewerIds((prev) => prev.map((v, j) => j === i ? e.target.value : v))}
                    className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  >
                    <option value="dynamic">Dynamic Assignment</option>
                    {assignmentOptions(reviewerIds, i).map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
            {reviewerIds.includes('dynamic') && (
              <p className="mb-2 text-[11px] leading-snug text-slate-500">
                Automatically assigns the anomaly to the Assignee of the associated Balance Sheet Reconciliation in FloQast.
              </p>
            )}
            <button
              type="button"
              onClick={addReviewer}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-1.5 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              <Plus className="h-3 w-3" /> Add Reviewer
            </button>
          </div>

        </div>
      </div>

      {/* Severity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Severity Level</span>
          <span className="text-sm font-semibold text-slate-900">{severityLevel}</span>
        </div>
        {(() => {
          // Modern slider: neutral track with a single band-aware fill color.
          // Color encodes severity at a glance without the rainbow gradient.
          const fillColor =
            severityLevel <= 1 ? '#eab308'   // yellow-500 — low
            : severityLevel <= 3 ? '#f97316' // orange-500 — medium
            : '#ef4444';                     // red-500 — high
          const pct = ((severityLevel - 1) / 4) * 100;
          return (
            <input
              type="range" min={1} max={5} step={1}
              value={severityLevel}
              onChange={(e) => setSeverityLevel(Number(e.target.value))}
              className="mb-1.5 w-full cursor-pointer appearance-none rounded-full
                h-1.5
                [&::-webkit-slider-runnable-track]:h-1.5
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:mt-[-5px]
                [&::-webkit-slider-thumb]:h-3.5
                [&::-webkit-slider-thumb]:w-3.5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)]
                [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${fillColor} 0% ${pct}%, #e5e7eb ${pct}% 100%)`,
              }}
            />
          );
        })()}
        <div className="flex justify-between text-[11px] text-slate-400 mb-3">
          <span>1 — Low</span>
          <span>5 — Critical</span>
        </div>
        <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2 text-sm text-blue-800">
          <span className="font-semibold">Explanation: </span>
          {SEVERITY_LABELS[severityLevel]}
        </div>
      </div>

      {/* In-body footer — only rendered when the parent has not hoisted the
           Back/Save buttons into the Modal's sticky footer slot. */}
      {!hideFooter && (
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center rounded-md bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className="inline-flex h-9 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Save rule
          </button>
        </div>
      )}
    </div>
  );
}
