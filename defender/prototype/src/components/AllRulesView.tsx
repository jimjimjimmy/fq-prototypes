import { useState } from 'react';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import ArrowUpward from '@floqastinc/flow-ui_icons/material/ArrowUpward';
import ArrowDownward from '@floqastinc/flow-ui_icons/material/ArrowDownward';
import SwapVert from '@floqastinc/flow-ui_icons/material/SwapVert';
import ViewColumn from '@floqastinc/flow-ui_icons/material/ViewColumn';
import FilterList from '@floqastinc/flow-ui_icons/material/FilterList';
import GridView from '@floqastinc/flow-ui_icons/material/GridView';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import Button from '@floqastinc/flow-ui_core/Button';
import Tooltip from '@floqastinc/flow-ui_core/Tooltip';
import type { Rule, Anomaly } from '../types';
import RuleSummaryItem from './RuleSummaryItem';

export default function AllRulesView({ rules, onBack, onCreateRule, onEditRule, onDeleteRule, onDeactivateRule, onViewActivityLog, onSelectRule, onCloneRule, anomalies, calculateRiskScore, getRiskScoreColor, getRiskScoreBreakdown }: {
  rules: Rule[];
  onBack: () => void;
  onCreateRule: () => void;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (rule: Rule) => void;
  onDeactivateRule: (rule: Rule) => void;
  onViewActivityLog: (rule: Rule) => void;
  onSelectRule: (rule: Rule) => void;
  onCloneRule: (rule: Rule) => void;
  anomalies: Anomaly[];
  calculateRiskScore: (rule: Rule, anomalies: Anomaly[]) => number;
  getRiskScoreColor: (score: number) => string;
  getRiskScoreBreakdown: (rule: Rule, anomalies: Anomaly[]) => string;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<'name' | 'status' | 'totalCount' | 'unresolvedCount'>('unresolvedCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: 'name' | 'status' | 'totalCount' | 'unresolvedCount') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedRules = [...rules].sort((a, b) => {
    let aValue: string | number = a[sortColumn];
    let bValue: string | number = b[sortColumn];

    if (sortColumn === 'totalCount' || sortColumn === 'unresolvedCount') {
      aValue = a.status === 'Inactive' ? -1 : aValue;
      bValue = b.status === 'Inactive' ? -1 : bValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <SwapVert size={12} color="var(--flo-sem-color-icon-muted)" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUpward size={12} color="var(--flo-sem-color-content-success-medium)" />
      : <ArrowDownward size={12} color="var(--flo-sem-color-content-success-medium)" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-sm hover:text-emerald-700 font-medium mb-2"
          style={{ color: 'var(--flo-sem-color-success)' }}
        >
          &larr; Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--flo-sem-color-text-default)' }}>All Rules</h1>
          <Button onClick={onCreateRule} size="sm">
            <Add size={16} />
            Create New Rule
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-1">
            <div className="border-b border-[var(--flo-sem-color-border-default,#e1e6ef)] bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
              <div className="grid grid-cols-8 gap-4 py-3 px-6 items-center">
                <button
                  onClick={() => handleSort('name')}
                  className="text-xs font-semibold uppercase tracking-wider text-left flex items-center gap-2 hover:text-[var(--flo-sem-color-text-default,#1d2433)] transition-colors"
                  style={{ color: 'var(--flo-sem-color-text-secondary)' }}
                >
                  Name
                  <SortIcon column="name" />
                </button>
                <button
                  onClick={() => handleSort('status')}
                  className="text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:text-[var(--flo-sem-color-text-default,#1d2433)] transition-colors"
                  style={{ color: 'var(--flo-sem-color-text-secondary)' }}
                >
                  Status
                  <SortIcon column="status" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
                  Rule Owner
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
                  Assignees
                </div>
                <button
                  onClick={() => handleSort('totalCount')}
                  className="text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:text-[var(--flo-sem-color-text-default,#1d2433)] transition-colors"
                  style={{ color: 'var(--flo-sem-color-text-secondary)' }}
                >
                  Total Anomalies
                  <SortIcon column="totalCount" />
                </button>
                <button
                  onClick={() => handleSort('unresolvedCount')}
                  className="text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:text-[var(--flo-sem-color-text-default,#1d2433)] transition-colors"
                  style={{ color: 'var(--flo-sem-color-text-secondary)' }}
                >
                  Unresolved Anomalies
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Info size={14} color="var(--flo-sem-color-icon-muted)" />
                    </Tooltip.Trigger>
                    <Tooltip.Content side="bottom" hasArrow size="sm">
                      Total transactions with 'Open' or 'Investigating' status.
                    </Tooltip.Content>
                  </Tooltip>
                  <SortIcon column="unresolvedCount" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
                  Risk Score
                </div>
                <div className="text-right"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {sortedRules.map((rule) => (
                <RuleSummaryItem
                  key={rule.id}
                  rule={rule}
                  onEditRule={onEditRule}
                  onDeleteRule={onDeleteRule}
                  onDeactivateRule={onDeactivateRule}
                  onViewActivityLog={onViewActivityLog}
                  onSelectRule={onSelectRule}
                  onCloneRule={onCloneRule}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  anomalies={anomalies}
                  calculateRiskScore={calculateRiskScore}
                  getRiskScoreColor={getRiskScoreColor}
                  getRiskScoreBreakdown={getRiskScoreBreakdown}
                />
              ))}
            </div>
          </div>

          <div className="border-l border-[var(--flo-sem-color-border-default,#e1e6ef)] w-14 flex flex-col items-center py-6 gap-8 bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
            <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
              <ViewColumn size={20} color="var(--flo-sem-color-icon-secondary)" />
              <div className="writing-mode-vertical">
                <span className="text-xs font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Columns</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
              <FilterList size={20} color="var(--flo-sem-color-icon-secondary)" />
              <div className="writing-mode-vertical">
                <span className="text-xs font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Filters</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
              <GridView size={20} color="var(--flo-sem-color-icon-secondary)" />
              <div className="writing-mode-vertical">
                <span className="text-xs font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
