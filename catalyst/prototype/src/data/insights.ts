import type { InsightCard } from '@/types';

export const insightCards: InsightCard[] = [
  {
    title: "Intercompany Variance Identified",
    body: "The Global Close is currently blocked by a $12,400 intercompany variance between Entity US and Entity UK. A Bridge Entry has been prepared based on historical patterns and supporting documentation is attached.",
    taskId: 15,
    agentBadge: "Prepared by Intercompany Agent",
  },
  {
    title: "Cash Clearing Reconciliation Ready",
    body: "Cash clearing account reconciliation is complete — 342 of 345 transactions matched automatically. 3 unmatched items totaling $8,450 require manual review before downstream bank reconciliations can proceed.",
    taskId: 3,
    agentBadge: "Prepared by Cash Reconciliation Agent",
  },
  {
    title: "Depreciation Schedule Prepared",
    body: "Agent generated the February depreciation rollforward for Fixed Assets and validated useful life assumptions against prior periods. One new asset (server rack, $42,000) was flagged for useful life confirmation.",
    taskId: 1,
    agentBadge: "Prepared by Fixed Asset Agent",
  },
  {
    title: "Bank Reconciliation — Wells Fargo Ready",
    body: "Wells Fargo operating account reconciliation is in progress — 512 of 518 transactions matched. 6 exceptions categorized. Waiting on cash clearing reconciliation to complete before finalizing.",
    taskId: 5,
    agentBadge: "Prepared by Bank Reconciliation Agent",
  },
  {
    title: "Stock Compensation Review Prepared",
    body: "Stock-based compensation analysis for Q1 2026 has been prepared. Grant schedules validated against HR records, expense calculations verified, and draft journal entry ready for review.",
    taskId: 7,
    agentBadge: "Prepared by SBC Agent",
  },
];
