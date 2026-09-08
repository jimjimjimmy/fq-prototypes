import { useMemo, useState, useRef, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { type ColDef, type ICellRendererParams } from '@ag-grid-community/core';
import { defenderGridTheme } from './TransactionGrid';
import Avatar from '@floqastinc/flow-ui_core/Avatar';
import AvatarGroup from '@floqastinc/flow-ui_core/AvatarGroup';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import Edit from '@floqastinc/flow-ui_icons/material/Edit';
import ContentCopy from '@floqastinc/flow-ui_icons/material/ContentCopy';
import OpenInNew from '@floqastinc/flow-ui_icons/material/OpenInNew';
import type { Rule, Anomaly } from '../types';

// Rules grid uses same base theme but with taller rows for multi-line cells
const rulesGridTheme = defenderGridTheme.withParams({
  rowHeight: '70px',
});

// Risk score severity label + color from Figma design
function getRiskSeverity(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'High', color: 'var(--flo-sem-color-danger, #d24747)' };
  if (score >= 25) return { label: 'Medium', color: 'var(--flo-sem-color-warning, #db7712)' };
  return { label: 'Low', color: 'var(--flo-sem-color-success, #1fac76)' };
}

function NameCellRenderer({ data }: ICellRendererParams<Rule>) {
  if (!data) return null;
  const isDeactivated = data.status === 'Deactivated';
  return (
    <div className="flex items-center gap-[8px] h-full" style={isDeactivated ? { opacity: 0.6 } : undefined}>
      <span className="text-[12px] font-semibold leading-[18px]" style={{ color: 'var(--flo-sem-color-text-default, #1d2433)' }}>
        {data.name}
      </span>
      <span
        className="text-[10px] font-semibold leading-[14px] px-[6px] py-[2px] rounded-[4px]"
        style={{ color: 'var(--flo-sem-color-text-secondary, #6b7280)', backgroundColor: 'var(--flo-sem-color-surface-secondary, #f1f3f9)' }}
      >
        Version {data.version || 1}
      </span>
    </div>
  );
}

function StatusCellRenderer({ value }: ICellRendererParams) {
  const statusStyles: Record<string, { color: string; bg: string }> = {
    Active: { color: 'var(--flo-sem-color-success, #1fac76)', bg: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)' },
    Inactive: { color: 'var(--flo-sem-color-text-secondary, #6b7280)', bg: 'var(--flo-sem-color-surface-secondary, #f1f3f9)' },
    Deactivated: { color: 'var(--flo-sem-color-text-tertiary, #adb2bb)', bg: 'var(--flo-sem-color-surface-secondary, #f1f3f9)' },
  };
  const s = statusStyles[value as string] || statusStyles.Active;
  return (
    <span
      className="text-[12px] font-semibold leading-[18px] px-[6px] py-[4px] rounded-[4px] inline-flex items-center"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {value}
    </span>
  );
}

function AssigneesCellRenderer({ data }: ICellRendererParams<Rule>) {
  if (!data) return null;
  const allAssignees = [...(data.preparers || []), ...(data.reviewers || [])];
  const firstAssignee = allAssignees[0];
  const firstRole = data.preparers?.includes(firstAssignee) ? 'Preparer' : 'Reviewer';
  const remainingCount = allAssignees.length - 1;

  if (allAssignees.length === 0) {
    return <span className="text-[12px]" style={{ color: 'var(--flo-sem-color-text-tertiary, #adb2bb)' }}>No assignees</span>;
  }

  return (
    <div className="flex items-center gap-[8px] h-full">
      <AvatarGroup stacked orientation="vertical">
        {allAssignees.slice(0, 2).map((assignee, idx) =>
          assignee === 'Dynamic Assignment'
            ? <Avatar key={idx} icon={<AutoAwesome size={14} />} size="sm" />
            : <Avatar key={idx} fallback={assignee.split(' ').map(n => n[0]).join('')} size="sm" />
        )}
      </AvatarGroup>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold leading-[18px]" style={{ color: 'var(--flo-sem-color-text-default, #1d2433)' }}>
          {firstAssignee}
        </span>
        <span className="text-[11px] font-medium leading-[16px]" style={{ color: 'var(--flo-sem-color-text-secondary, #6b7280)' }}>
          {firstRole}
        </span>
        {remainingCount > 0 && (
          <span className="text-[11px] font-semibold leading-[16px]" style={{ color: 'var(--flo-sem-color-info, #3d7bf7)' }}>
            +{remainingCount} {remainingCount === 1 ? 'Assignee' : 'Assignees'}
          </span>
        )}
      </div>
    </div>
  );
}

function UnresolvedCellRenderer({ data }: ICellRendererParams<Rule>) {
  if (!data || data.status === 'Inactive' || data.status === 'Deactivated') return <span style={{ color: 'var(--flo-sem-color-text-tertiary, #adb2bb)' }}>—</span>;
  const ratio = data.totalCount > 0 ? (data.unresolvedCount / data.totalCount) * 100 : 0;
  return (
    <div className="flex items-center gap-[8px] h-full">
      <span className="text-[12px] font-medium" style={{ color: 'var(--flo-sem-color-text-default, #1d2433)' }}>
        {data.unresolvedCount}/{data.totalCount}
      </span>
    </div>
  );
}

function RiskScoreCellRenderer({ data, context }: ICellRendererParams<Rule>) {
  if (!data || data.status === 'Inactive' || data.status === 'Deactivated') return <span style={{ color: 'var(--flo-sem-color-text-tertiary, #adb2bb)' }}>—</span>;
  const { calculateRiskScore, anomalies } = context;
  const score = calculateRiskScore(data, anomalies);
  const { label, color } = getRiskSeverity(score);
  return (
    <div className="flex items-center gap-[8px] h-full">
      <span className="text-[12px] font-semibold" style={{ color }}>
        {label} ({score})
      </span>
    </div>
  );
}

function ActionsCellRenderer({ data, context }: ICellRendererParams<Rule>) {
  if (!data) return null;
  const { openMenuId, setOpenMenuId, onEditRule, onDuplicateRule, onDeactivateRule } = context;
  const isOpen = openMenuId === data.id;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpenMenuId]);

  const isDeactivated = data.status === 'Deactivated';

  return (
    <div className="flex items-center justify-end h-full" style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : data.id); }}
        className="p-[4px] hover:bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded transition-colors border-0 bg-transparent cursor-pointer"
      >
        <MoreVert size={16} color="var(--flo-sem-color-text-secondary, #6b7280)" />
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, zIndex: 50,
          width: 200, background: 'var(--flo-sem-color-surface-default, #fff)', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '4px 0',
          fontFamily: 'Inter, sans-serif', fontSize: 12,
        }}>
          {!isDeactivated && (
            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onEditRule(data); }}
              style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--flo-sem-color-text-default, #1d2433)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Edit size={14} color="var(--flo-sem-color-text-secondary, #6b7280)" /> Edit Rule
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onDuplicateRule(data); }}
            style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--flo-sem-color-text-default, #1d2433)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <ContentCopy size={14} color="var(--flo-sem-color-text-secondary, #6b7280)" /> Duplicate Rule
          </button>
          <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onDeactivateRule(data); }}
            style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, color: isDeactivated ? 'var(--flo-sem-color-success, #1fac76)' : 'var(--flo-sem-color-danger, #d24747)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            {isDeactivated ? '↺ Reactivate Rule' : '⏸ Deactivate Rule'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function RulesGrid({ rules, anomalies, calculateRiskScore, onRuleClicked, onEditRule, onDuplicateRule, onDeactivateRule }: {
  rules: Rule[];
  anomalies: Anomaly[];
  calculateRiskScore: (rule: Rule, anomalies: Anomaly[]) => number;
  onRuleClicked: (rule: Rule) => void;
  onEditRule: (rule: Rule) => void;
  onDuplicateRule: (rule: Rule) => void;
  onDeactivateRule: (rule: Rule) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Name',
      field: 'name',
      flex: 2,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: NameCellRenderer,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'Assignees',
      field: 'preparers',
      flex: 1.5,
      filter: true,
      floatingFilter: true,
      cellRenderer: AssigneesCellRenderer,
    },
    {
      headerName: 'Unresolved Anomalies',
      field: 'unresolvedCount',
      width: 180,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: UnresolvedCellRenderer,
      headerComponentParams: {
        template: '<div class="ag-cell-label-container"><span class="ag-header-cell-text">Unresolved Anomalies</span></div>',
      },
    },
    {
      headerName: 'Risk Score',
      field: 'riskScore',
      width: 150,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: RiskScoreCellRenderer,
      comparator: (valueA: number, valueB: number, nodeA: any, nodeB: any) => {
        const scoreA = calculateRiskScore(nodeA.data, anomalies);
        const scoreB = calculateRiskScore(nodeB.data, anomalies);
        return scoreA - scoreB;
      },
    },
    {
      headerName: '',
      field: 'actions',
      width: 50,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      suppressHeaderMenuButton: true,
    },
  ], [anomalies, calculateRiskScore]);

  const defaultColDef = useMemo<ColDef>(() => ({
    suppressHeaderMenuButton: false,
    suppressMovable: true,
  }), []);

  return (
    <div className="flex-1 min-h-0">
      <AgGridReact
        theme={rulesGridTheme}
        rowData={[...rules].sort((a, b) => {
          // Deactivated rules sort to bottom (per Figma: Gaurav confirmed deactivating sends to bottom of list)
          if (a.status === 'Deactivated' && b.status !== 'Deactivated') return 1;
          if (a.status !== 'Deactivated' && b.status === 'Deactivated') return -1;
          return 0;
        })}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowGroupPanelShow="always"
        onRowClicked={(e) => e.data && onRuleClicked(e.data)}
        context={{ calculateRiskScore, anomalies, openMenuId, setOpenMenuId, onEditRule, onDuplicateRule, onDeactivateRule }}
        rowSelection="single"
        suppressCellFocus
        animateRows
        overlayNoRowsTemplate={'<div style="padding: 40px; text-align: center; color: #adb2bb;"><div style="font-size: 32px; margin-bottom: 12px;">📋</div><div style="font-size: 14px; font-weight: 600; color: #1d2433; margin-bottom: 4px;">No rules created yet</div><div style="font-size: 12px;">Click "Add Rule" to create your first anomaly detection rule, or check Suggested Rules for recommendations.</div></div>'}
      />
    </div>
  );
}
