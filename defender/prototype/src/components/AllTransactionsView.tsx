import { useState } from 'react';
import ViewColumn from '@floqastinc/flow-ui_icons/material/ViewColumn';
import FilterList from '@floqastinc/flow-ui_icons/material/FilterList';
import GridView from '@floqastinc/flow-ui_icons/material/GridView';
// Toast replaced with custom inline toast (FlowUI Toast requires compound children)
import type { Rule, Anomaly } from '../types';
import TransactionGrid from './TransactionGrid';

export default function AllTransactionsView({ anomalies, onBack, onSelectAnomaly, ruleFilter, onTransactionClick, rules, calculateRiskScore, getRiskScoreColor, statusFilter }: {
  anomalies: Anomaly[];
  onBack: () => void;
  onSelectAnomaly: (anomaly: Anomaly) => void;
  ruleFilter?: string | null;
  onTransactionClick?: (e: React.MouseEvent, transactionId: string) => void;
  rules?: Rule[];
  calculateRiskScore?: (rule: Rule, anomalies: Anomaly[]) => number;
  getRiskScoreColor?: (score: number) => string;
  statusFilter?: string | null;
}) {
  const [toast, setToast] = useState<string | null>(null);

  let filteredAnomalies = anomalies;

  if (ruleFilter) {
    filteredAnomalies = filteredAnomalies.filter(a => {
      if (Array.isArray(a.triggeredRule)) {
        return a.triggeredRule.includes(ruleFilter);
      }
      return a.triggeredRule === ruleFilter;
    });
  }

  if (statusFilter && statusFilter !== 'All') {
    filteredAnomalies = filteredAnomalies.filter(a => a.status === statusFilter && a.anomalyCount > 0);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {toast && (
        <div className="fixed top-4 right-4 z-50" onClick={() => setToast(null)} style={{
          background: 'var(--flo-sem-color-surface-default, #fff)', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
          borderRadius: 8, padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--flo-sem-color-text-default, #1d2433)',
        }}>
          {toast}
        </div>
      )}
      <div className="px-6 pt-4 pb-2 flex-shrink-0">
        <h1 className="text-[20px] font-bold leading-[28px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>Transactions</h1>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Grouping Panel — visual only */}
        <div style={{ height: 50, background: 'var(--flo-base-color-neutral-50)', borderBottom: '1px solid var(--flo-sem-color-border-default)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--flo-sem-color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary)' }}>Drag items here</span>
        </div>

        <div className="flex flex-1 min-h-0">
          <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
            <TransactionGrid
              rowData={filteredAnomalies}
              onRowClicked={onSelectAnomaly}
              onTransactionIdClick={() => {
                setToast('Opening in ERP...');
                setTimeout(() => setToast(null), 3000);
              }}
            />
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

        {/* Footer */}
        <div style={{ height: 50, borderTop: '1px solid var(--flo-sem-color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 12, color: 'var(--flo-sem-color-text-secondary)', flexShrink: 0 }}>
          <span>Showing: <b>{filteredAnomalies.length}</b></span>
          <span>Last refreshed today at 9:00 am</span>
        </div>
      </div>
    </div>
  );
}
