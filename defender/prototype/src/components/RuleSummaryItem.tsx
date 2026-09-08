import { useState } from 'react';
import Schedule from '@floqastinc/flow-ui_icons/material/Schedule';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import type { Rule, Anomaly } from '../types';
import AssigneeDisplay from './AssigneeDisplay';

export default function RuleSummaryItem({ rule, onEditRule, onDeleteRule, onDeactivateRule, onViewActivityLog, onSelectRule, onCloneRule, openMenuId, setOpenMenuId, anomalies, calculateRiskScore, getRiskScoreColor, getRiskScoreBreakdown }: {
  rule: Rule;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (rule: Rule) => void;
  onDeactivateRule: (rule: Rule) => void;
  onViewActivityLog: (rule: Rule) => void;
  onSelectRule: (rule: Rule) => void;
  onCloneRule: (rule: Rule) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  anomalies: Anomaly[];
  calculateRiskScore: (rule: Rule, anomalies: Anomaly[]) => number;
  getRiskScoreColor: (score: number) => string;
  getRiskScoreBreakdown: (rule: Rule, anomalies: Anomaly[]) => string;
}) {
  const isMenuOpen = openMenuId === rule.id;
  const [showTooltip, setShowTooltip] = useState(false);
  const riskScore = calculateRiskScore(rule, anomalies);
  const riskColor = getRiskScoreColor(riskScore);

  return (
    <div
      className="grid grid-cols-8 gap-4 py-3 px-6 hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors items-center cursor-pointer"
      onClick={() => onSelectRule(rule)}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{rule.name}</span>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{rule.status}</span>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{rule.ruleOwner}</span>
      </div>
      <div className="flex items-center">
        <AssigneeDisplay assignees={[...(rule.preparers || []), ...(rule.reviewers || [])]} />
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: 'var(--flo-sem-color-text-default)' }}>
          {rule.status === 'Inactive' ? '—' : rule.totalCount}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: 'var(--flo-sem-color-text-default)' }}>
          {rule.status === 'Inactive' ? '—' : rule.unresolvedCount}
        </span>
      </div>
      <div className="flex items-center justify-center relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="relative flex items-center gap-2">
          <div className="relative h-2 w-16 bg-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${riskScore}%`,
                backgroundColor: riskColor
              }}
            />
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: riskColor }}
          >
            {rule.status === 'Inactive' ? '—' : riskScore}
          </span>
          {showTooltip && rule.status === 'Active' && (
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 bg-[var(--flo-sem-color-text-default,#1d2433)] text-white text-xs rounded-lg p-3 shadow-lg z-50">
              <div className="font-semibold mb-1">Risk Score Breakdown:</div>
              <div className="text-[var(--flo-sem-color-text-tertiary,#adb2bb)]">{getRiskScoreBreakdown(rule, anomalies)}</div>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewActivityLog(rule);
          }}
          className="p-1 hover:text-[var(--flo-sem-color-text-secondary,#424867)] hover:bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded transition-colors"
          style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
          title="View Activity Log"
        >
          <Schedule size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : rule.id);
          }}
          className="p-1 hover:text-[var(--flo-sem-color-text-secondary,#424867)] hover:bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded transition-colors"
          style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
        >
          <MoreVert size={16} />
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}></div>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg shadow-lg z-20 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRule(rule);
                  setOpenMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors"
                style={{ color: 'var(--flo-sem-color-text-secondary)' }}
              >
                Edit Rule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloneRule(rule);
                  setOpenMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors"
                style={{ color: 'var(--flo-sem-color-text-secondary)' }}
              >
                Clone Rule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeactivateRule(rule);
                  setOpenMenuId(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors"
                style={{ color: 'var(--flo-sem-color-text-secondary)' }}
              >
                {rule.status === 'Active' ? 'Deactivate Rule' : 'Activate Rule'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
