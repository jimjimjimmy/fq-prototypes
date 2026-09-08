import type { InsightCard, NotificationItem } from '@/types';

export const rachelInsights: InsightCard[] = [
  {
    title: "General Fund GL Reconciliation Blocked",
    body: "General fund GL reconciliation is due today (Mar 13) but blocked — classified staff payroll is still in review and vendor payment batch needs final sign-off. This is holding up the budget variance analysis downstream.",
    taskId: 113,
  },
  {
    title: "AP Aging Analysis Overdue",
    body: "Accounts payable aging analysis was due Mar 12 and is 1 day overdue. Lisa Park has it ready for James Cooper's review — 3 vendor invoices flagged for duplicate payment detection.",
    taskId: 117,
    agentBadge: "JE Suggested by AP Agent",
  },
  {
    title: "Phase 2 Wrapping Up — 1 Day Past Deadline",
    body: "Expenditure processing deadline was Mar 12. Food services and HVAC capital project are still in progress. 4 of 6 tasks complete. Transportation payments ready for review.",
    taskId: 110,
  },
  {
    title: "Title I Grant Drawdown Complete",
    body: "Federal Title I grant drawdown for $2.4M is complete and reconciled. All expenditures matched to approved budget categories. Ready for quarterly compliance certification.",
    taskId: 102,
    agentBadge: "Prepared by Grant Reconciliation Agent",
  },
];

export const rachelNotifications: NotificationItem[] = [
  {
    avatarInitials: 'SM',
    meta: 'Reconciliation · General Fund GL',
    message: '@racheltorres GL reconciliation is blocked — classified staff payroll batch hasn\'t been approved yet. Can we escalate?',
    isUnread: true,
  },
  {
    avatarInitials: 'JC',
    meta: 'Review · Classified Staff Payroll',
    message: '@racheltorres reviewing now — found a $12K variance in benefits allocation for para-educators. Need Sarah to verify.',
    isUnread: true,
  },
  {
    avatarInitials: 'LP',
    meta: 'Analysis · AP Aging',
    message: '@racheltorres AP aging analysis ready — flagged 3 potential duplicate vendor payments totaling $8,400.',
    isUnread: true,
  },
  {
    avatarInitials: 'SM',
    meta: 'Capital · HVAC Renovation',
    message: '@racheltorres HVAC project draw #4 processed — $185K against bond proceeds. Updated capitalization schedule attached.',
  },
  {
    avatarInitials: 'LP',
    meta: 'Grants · Title I',
    message: '@racheltorres Title I Q1 expenditure report draft is ready. All spend within approved categories — no questioned costs.',
  },
];
