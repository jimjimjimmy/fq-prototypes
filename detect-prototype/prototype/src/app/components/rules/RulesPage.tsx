import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, MoreVertical, Info } from 'lucide-react';
import { rules as seedRules } from '../../../data/rules';
import { RULE_ASSIGNEES } from '../../../data/ruleAssignees';
import { getTeamMember, team } from '../../../data/team';
import { useAppStore } from '../../../store/useAppStore';
import { currentPeriodId } from '../../../data/company';
import { AddRulePage } from './AddRulePage';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

/**
 * Full-page Rules surface (Detect → Rules tab).
 *
 * Built from Figma reference:
 *   https://www.figma.com/design/jisKCBFEaLCuZljlTaQJYn/Rules?node-id=2204-41924
 *
 * Per design feedback, removed from the Figma:
 *   - Zebra striping (every row uses white surface)
 *   - Per-column filter funnel + kebab icons in the header
 *   - The Columns / Filters / Views tool panels that hugged the table
 *     right edge
 *   - The Unresolved Anomalies column (no longer applicable)
 *   - The Risk Score column (no longer applicable)
 *
 * Kept columns: Name · Status · Assignees, plus a 56px trailing
 * actions column for the row-level kebab.
 */

// 4 data columns + 1 trailing actions column. Name flexes between
// 220–420px so it can carry long rule names (~60 chars) without
// truncating, but doesn't sprawl with empty whitespace when names
// are short — keeps the gap between Name and Status tight.
// Status, Assignees, Active Periods are fixed-width. Active Periods
// sits at 150px to fit the header label + tooltip icon without
// wrapping.
// Actions flexes (minmax(56px,1fr)) so any slack in the row goes
// here — pinning the kebab to the right edge of the table no
// matter how short the Name content is.
const COL_TEMPLATE =
  'grid-cols-[minmax(220px,420px)_120px_200px_150px_minmax(56px,1fr)]';

/**
 * Count the unique periods this rule has been active in. Unions:
 *   - All historicalPeriods backfilled across every saved version
 *   - The contiguous run from the rule's createdAt period through the
 *     current period (covers the "current-and-future" save scope)
 * Returns the size of the resulting set. For the prototype this is a
 * pure derivation — no field on the rule data model.
 */
function activePeriodsCountFor(rule: typeof seedRules[number]): number {
  const ids = new Set<string>();
  // Explicit historical backfills from every version save.
  for (const entry of rule.versionHistory ?? []) {
    for (const p of entry.historicalPeriods ?? []) ids.add(p);
  }
  // Implicit current-and-future coverage from rule's creation through now.
  const startId = periodIdFromDate(rule.createdAt);
  if (startId) {
    for (const p of periodsBetween(startId, currentPeriodId)) ids.add(p);
  }
  return ids.size;
}

/** ISO date string → "YYYY-MM" period id (or null if invalid). */
function periodIdFromDate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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

export function RulesPage({
  onOpenRule,
  onEditRule,
  onDuplicateRule,
  onDeactivateRule,
  onActivateRule,
  embedded = false,
  onAddRule,
}: {
  onOpenRule?: (ruleId: string) => void;
  /** Called when the user picks "Edit Rule" from a row's kebab menu
   *  (distinct from clicking the rule name, which opens the
   *  view-only detail modal). Host opens the rule detail modal
   *  directly in edit mode. */
  onEditRule?: (ruleId: string) => void;
  /** Called when the user picks "Duplicate Rule" from a row's kebab
   *  menu. The host opens the rule detail modal in edit mode with
   *  the source rule's data so the user can tweak and save. */
  onDuplicateRule?: (ruleId: string) => void;
  /** Called when the user picks "Deactivate Rule" from a row's
   *  kebab menu (only fires when the rule is currently active). The
   *  host shows the DeactivateRuleDialog warning. */
  onDeactivateRule?: (ruleId: string) => void;
  /** Fires when the user picks "Activate Rule" from a kebab menu on
   *  a currently-inactive rule. Host flips the rule's status back
   *  to active in the store. No confirmation dialog — activation is
   *  reversible. */
  onActivateRule?: (ruleId: string) => void;
  /** When true, the internal page header (Rules title) is skipped —
   *  the host (e.g. RulesListModal) renders its own header. The Add
   *  Rule action button still renders above the table. */
  embedded?: boolean;
  /** Called when the user clicks "+ Add Rule". When provided, the
   *  host (modal) handles routing the user to the Add Rule page.
   *  When omitted, RulesPage opens AddRulePage inline (the
   *  standalone full-page mode). */
  onAddRule?: () => void;
}) {
  // Read rules from the live store so status changes (activate /
  // deactivate) and version bumps re-render this table immediately.
  // The seed import is kept only for type references below.
  const rules = useAppStore((s) => s.rules);

  // Internal Add Rule state — only used when there's no `onAddRule`
  // callback, i.e. RulesPage is rendered as a standalone surface.
  const [internalAddRuleOpen, setInternalAddRuleOpen] = useState(false);

  const handleAddRule = () => {
    if (onAddRule) onAddRule();
    else setInternalAddRuleOpen(true);
  };

  if (internalAddRuleOpen) {
    return <AddRulePage onClose={() => setInternalAddRuleOpen(false)} />;
  }

  return (
    // Page bg is plain white — the surrounding card chrome was
    // intentionally dropped per design feedback so the table reads as
    // the primary content, not as a card-on-canvas.
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
      {/* Page header — standalone mode shows the page title + Add
            Rule button. Embedded mode (inside RulesListModal) has
            neither: the modal's own header carries the title AND
            the Add Rule action, so we skip this block entirely to
            keep the table flush against the modal header. */}
      {!embedded && (
        <div className="bg-white px-6 pb-4 pt-4">
          <div className="flex items-end justify-between">
            <h1 className="font-header text-[24px] font-bold leading-8 text-[#1d2433]">
              Rules
            </h1>
            <button
              type="button"
              onClick={handleAddRule}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Rule
            </button>
          </div>
        </div>
      )}

      {/* Table card — sits directly on the white page background, no
           outer surface tint. The bordered container still groups the
           rows visually. The "Add Rule" row above provides the top
           breathing room; the page already has px-6 for the gutter. */}
      <div className={`px-6 pb-6 ${embedded ? 'pt-4' : ''}`}>
        <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <RulesHeader />
          {rules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              onOpen={onOpenRule}
              onEdit={onEditRule}
              onDuplicate={onDuplicateRule}
              onDeactivate={onDeactivateRule}
              onActivate={onActivateRule}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RulesHeader() {
  // Filter funnel + kebab icons removed from the header per design
  // feedback. Just labels, on the FlowUI AG header surface (#f8fafc),
  // with the standard header bottom border.
  // Status column carries a tooltip explaining what "Active" means
  // (per 6.3.2026 sync with Gaurav — clarifies that active rules
  // automatically run for future periods).
  const cols: { label: string; tooltip?: string }[] = [
    { label: 'Name' },
    {
      label: 'Status',
      tooltip: 'Active rules will automatically run for all future periods',
    },
    { label: 'Assignees' },
    {
      label: 'Active Periods',
      tooltip: 'Total number of periods this rule has run in',
    },
    { label: '' /* actions */ },
  ];
  return (
    <div
      className={`grid ${COL_TEMPLATE} border-b border-[#e1e6ef] bg-[#f8fafc]`}
    >
      {cols.map(({ label, tooltip }, i) => (
        <div
          key={label || `col-${i}`}
          className="flex h-[50px] items-center gap-1.5 whitespace-nowrap px-4 font-['Inter'] text-[12px] font-semibold leading-4 text-[#1b1f27]"
        >
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${label}`}
                  className="inline-flex h-3.5 w-3.5 items-center justify-center text-[#6b7280]"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}

function RuleRow({
  rule,
  onOpen,
  onEdit,
  onDuplicate,
  onDeactivate,
  onActivate,
}: {
  rule: typeof seedRules[number];
  onOpen?: (ruleId: string) => void;
  onEdit?: (ruleId: string) => void;
  onDuplicate?: (ruleId: string) => void;
  onDeactivate?: (ruleId: string) => void;
  onActivate?: (ruleId: string) => void;
}) {
  // Resolve assignees to actual team members. The ruleAssignees map
  // sometimes contains a "dynamic" placeholder for "assignee is
  // inferred from the transaction" — that's not a real person, so we
  // skip it from the display roster and rely on `team` ordering as a
  // deterministic fallback when a rule has no explicit roster yet.
  const assigneeIds = useMemo(() => {
    const ids = RULE_ASSIGNEES[rule.id] ?? [];
    const real = ids.filter((id) => id !== 'dynamic');
    if (real.length > 0) return real;
    // Fallback: first 3 team members so every row renders an avatar
    // group even for rules without an explicit assignee mapping.
    return team.slice(0, 3).map((m) => m.id);
  }, [rule.id]);

  const lead = getTeamMember(assigneeIds[0]);
  const additionalCount = Math.max(0, assigneeIds.length - 1);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(rule.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.(rule.id);
        }
      }}
      className={`grid ${COL_TEMPLATE} cursor-pointer border-b border-[#e1e6ef] bg-white transition-colors last:border-b-0 hover:bg-[#f8fafc]`}
    >
      {/* Col 1: Name + neutral "Version 1" tag. Whole row is the
           click target so the rule name no longer needs its own
           button — rendering as a span keeps the look unchanged. */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="!font-['Inter'] truncate text-left text-[12px] font-medium leading-4 text-[#1d2433]">
          {rule.name}
        </span>
        {/* FlowUI neutral tag — bg neutral-100 (#f1f3f9), text
             neutral-700 (#424867), squared corners, xs size. Reads
             the current version from rule.version (defaults to 1 if
             the rule pre-dates version tracking). */}
        <span className="inline-flex shrink-0 items-center rounded-[4px] bg-[#f1f3f9] px-1.5 py-0.5 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#424867]">
          Version {rule.version ?? 1}
        </span>
      </div>

      {/* Col 2: Status — FlowUI Tables-status tag. Two variants:
           - Active     → success: bg #ecfff8, text #1fac76
           - Deactivated → neutral: bg #f1f3f9 (neutral-100), text
                          #424867 (neutral-700)
           The neutral treatment for inactive aligns with FlowUI's
           guidance that "off / paused" states should not carry a
           semantic colour (e.g. red would imply danger). */}
      <div className="flex items-center px-4 py-3">
        <StatusTag status={rule.status} />
      </div>

      {/* Col 3: Assignees — vertically stacked avatar group on the left
           (one avatar per row, overlapping with negative top margin),
           lead name + "+N Assignees" link on the right. Role/title
           removed per design feedback. */}
      <div className="flex items-center gap-3 px-4 py-3">
        <AvatarStack ids={assigneeIds.slice(0, 3)} />
        <div className="flex min-w-0 flex-col">
          {lead && (
            <span className="truncate font-['Inter'] text-[12px] font-semibold leading-[18px] text-[#1b1f27]">
              {lead.name}
            </span>
          )}
          {additionalCount > 0 && (
            // FlowUI link — info-primary (#3d7bf7), Inter semibold.
            // Non-functional placeholder; mirrors the visual treatment
            // from the Figma reference.
            <span className="!font-['Inter'] self-start text-[11px] font-semibold leading-4 text-[#3d7bf7]">
              +{additionalCount} Assignees
            </span>
          )}
        </div>
      </div>

      {/* Col 4: Active Periods — total count of distinct periods this
           rule has been active in (historical backfills + current-and-
           future coverage). Derived from versionHistory + createdAt;
           no field on the rule data model. */}
      <div className="flex items-center px-4 py-3">
        <span className="font-['Inter'] text-[12px] font-normal leading-4 text-[#1d2433]">
          {(() => {
            const count = activePeriodsCountFor(rule);
            return `${count} period${count === 1 ? '' : 's'}`;
          })()}
        </span>
      </div>

      {/* Col 5: Row actions — kebab opens a 3-item menu. The third
           item flips between "Deactivate" / "Activate" based on the
           current rule status. stopPropagation on the wrapper so a
           click inside the kebab area doesn't bubble up to the
           row-level navigation handler. */}
      <div
        className="flex items-center justify-end px-2 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <RuleActionsMenu
          isActive={rule.status === 'active'}
          // Edit from kebab opens the rule detail modal directly in
          // EDIT mode (skipping view). Clicking the rule's name in
          // Col 1 still calls onOpen → view mode.
          onEdit={() => (onEdit ?? onOpen)?.(rule.id)}
          onDuplicate={() => onDuplicate?.(rule.id)}
          onToggleActive={() => {
            if (rule.status === 'active') {
              // Active → Deactivate: show the warning dialog so the
              // user confirms scope (current period vs current +
              // future).
              onDeactivate?.(rule.id);
            } else {
              // Inactive → Activate: flip status straight back to
              // active. No confirmation dialog — activation is a
              // reversible positive action with no destructive
              // impact, and the table's status tag updates
              // immediately to reflect the new state.
              onActivate?.(rule.id);
            }
          }}
        />
      </div>
    </div>
  );
}

export function RuleActionsMenu({
  isActive,
  onEdit,
  onDuplicate,
  onToggleActive,
  editDisabled = false,
}: {
  isActive: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleActive: () => void;
  /** When true, the Edit Rule item renders disabled — used by the
   *  rule detail modal while the user is auditing a past version
   *  (editing always operates on the current version). */
  editDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Panel position is computed against the trigger's bounding box and
  // rendered in a portal so the dropdown escapes the rules modal's
  // overflow-hidden clipping. Without this, the menu got cut off at
  // the modal edge.
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPanelStyle({
        top: rect.bottom + 4,
        // Right-align the panel to the trigger's right edge so it
        // grows leftward — matches the in-column layout intent.
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(true);
  };

  // Close on outside click + Escape. Outside check has to include
  // both the trigger and the portaled panel.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) {
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Rule actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          open
            ? 'bg-[#f1f3f9] text-[#1d2433]'
            : 'text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1d2433]'
        }`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[200] w-[180px] overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-[0px_4px_12px_0px_rgba(15,23,42,0.08)]"
            style={panelStyle}
          >
            <MenuItem
              label="Edit Rule"
              disabled={editDisabled}
              onClick={() => {
                if (editDisabled) return;
                setOpen(false);
                onEdit();
              }}
            />
            <MenuItem
              label="Duplicate Rule"
              onClick={() => {
                setOpen(false);
                onDuplicate();
              }}
            />
            <MenuItem
              label={isActive ? 'Deactivate Rule' : 'Activate Rule'}
              onClick={() => {
                setOpen(false);
                onToggleActive();
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}

function MenuItem({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  // Dropdown menu item — Inter, 12px medium, body text. Hover lifts to
  // neutral-100 surface to match FlowUI's standard menu pattern.
  // Disabled state mutes the label colour and removes the hover fill
  // so the item reads as inert.
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={`!font-['Inter'] flex w-full items-center px-3 py-2 text-left text-[12px] font-medium leading-4 transition-colors ${
        disabled
          ? 'cursor-not-allowed text-[#adb2bb]'
          : 'text-[#1d2433] hover:bg-[#f1f3f9]'
      }`}
    >
      {label}
    </button>
  );
}

function StatusTag({ status }: { status: 'active' | 'inactive' | 'draft' }) {
  // Visual mapping per FlowUI Tables-status tag tokens. Draft falls
  // back to the neutral treatment for now since there's no Draft
  // example in the seed (kept here so the type is exhaustive).
  const map = {
    active: {
      label: 'Active',
      bg: 'bg-[#ecfff8]', // --flo-sem-color-success-background
      text: 'text-[#1fac76]', // --flo-sem-color-success
    },
    inactive: {
      label: 'Deactivated',
      bg: 'bg-[#f1f3f9]', // neutral-100
      text: 'text-[#424867]', // neutral-700
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

function AvatarStack({ ids }: { ids: string[] }) {
  // Vertically stacked avatars — first two visible, each overlapping
  // the one above by 8px (negative top margin), white ring to
  // separate. The column variant of FlowUI AvatarGroup; reads as a
  // single grouped affordance while taking less horizontal space than
  // the standard horizontal stack.
  const visible = ids.slice(0, 2).map(getTeamMember).filter(Boolean) as NonNullable<
    ReturnType<typeof getTeamMember>
  >[];
  return (
    <div className="flex shrink-0 flex-col -space-y-2">
      {visible.map((m) => (
        <img
          key={m.id}
          src={m.avatar}
          alt={m.name}
          className="h-7 w-7 rounded-full border-2 border-white object-cover"
        />
      ))}
    </div>
  );
}
