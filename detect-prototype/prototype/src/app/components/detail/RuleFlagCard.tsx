import type { AnomalyFlag, Rule } from '../../../data/types';
import { SeverityBadge } from '../shared/SeverityBadge';
import { SourceBadge } from '../shared/SourceBadge';
import { getTeamMember } from '../../../data/team';

interface Props {
  flag: AnomalyFlag;
  rule?: Rule; // the rule definition (for ownership line)
  onViewRule: () => void;
}

/**
 * Rule-flag card — renders the rule treatment fully inline:
 *   - description (plain-English one-liner)
 *   - matched conditions with BOTH the rule's expected value and the
 *     actual value from this transaction
 *   - ownership line (who configured it, when last edited)
 *   - soft "View rule details →" link for drill-in
 *
 * The card is auditable — everything you need to verify the logic is here.
 */
export function RuleFlagCard({ flag, rule, onViewRule }: Props) {
  if (flag.source.kind !== 'rule') return null;
  const { ruleName, matchedConditions } = flag.source;

  const createdBy = rule ? getTeamMember(rule.createdById) : undefined;
  const lastEditedBy = rule ? getTeamMember(rule.lastEditedById) : undefined;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SourceBadge kind="rule" size="sm" />
            <button
              type="button"
              onClick={onViewRule}
              className="text-sm font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
            >
              {ruleName}
            </button>
          </div>
        </div>
        <SeverityBadge severity={flag.severity} size="md" />
      </header>

      {matchedConditions.length > 0 && (
        <section className="mt-4">
          <h4 className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Matched conditions
          </h4>
          <ul className="mt-2 space-y-2">
            {matchedConditions.map((c, i) => (
              <li
                key={i}
                className="rounded-md border border-slate-100 bg-slate-50 p-2.5"
              >
                <div className="text-sm text-slate-800">{c.label}</div>
                <div className="mt-1 grid grid-cols-2 gap-x-3 text-xs">
                  <div>
                    <span className="text-slate-500">Expected:</span>{' '}
                    <span className="text-slate-700">{c.expected}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Actual:</span>{' '}
                    <span className="font-medium text-rose-700">{c.actual}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rule && (createdBy || lastEditedBy) && (
        <footer className="mt-4 border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">
            {createdBy && <>Configured by {createdBy.name}</>}
            {lastEditedBy && rule.lastEditedAt && (
              <> · Last edited {formatDate(rule.lastEditedAt)}</>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
