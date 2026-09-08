import type { InsightCard, NotificationItem } from '@/types';

export const claireInsights: InsightCard[] = [
  {
    title: "Close Progress: 58% On Track",
    body: "5 of 26 tasks are complete, 8 in progress, 5 ready for review, 2 blocked, and 6 not started. The blocked warranty provision and wholesale revenue recognition are highest risk to the Mar 31 board reporting deadline.",
    taskId: 13,
  },
  {
    title: "Critical Path Alert: Dependency Chain",
    body: "The monthly close package (Task #26) depends on consolidation eliminations, tax provision, COGS analysis, depreciation, and warranty provision. Multiple upstream tasks still in progress — monitor the vehicle inventory recs closely.",
    taskId: 26,
  },
  {
    title: "Intercompany Variance — China JV",
    body: "The UK ↔ China JV intercompany reconciliation will require attention once supplier AP is approved. Historical pattern shows £180K–£220K in timing differences on CKD kit shipments. Agent has pre-matched 94% of transactions.",
    taskId: 21,
    agentBadge: "Prepared by Intercompany Agent",
  },
  {
    title: "Agent Automation Summary",
    body: "AI agents have auto-prepared 8 of 26 tasks this period, saving an estimated 22 hours of manual preparation. Bank reconciliations, SAP data extraction, and fixed asset schedules show highest automation rates.",
  },
];

export const claireNotifications: NotificationItem[] = [
  {
    avatarInitials: 'TB',
    meta: 'Review · Warranty Provision',
    message: '@clairemitchell blocked task still awaiting Solihull and Castle Bromwich inventory — may need escalation.',
    isUnread: true,
  },
  {
    avatarInitials: 'PS',
    meta: 'Close · R&D Capitalisation — MLA Platform',
    message: '@clairemitchell MLA platform spend review is past due — working to complete by end of week.',
    isUnread: true,
  },
  {
    avatarInitials: 'EH',
    meta: 'Close · Monthly Close Package',
    message: '@clairemitchell 5 upstream dependencies still pending for board close package.',
    isUnread: true,
  },
  {
    avatarInitials: 'RK',
    meta: 'Review · FX Translation',
    message: '@clairemitchell GBP/EUR hedge effectiveness testing on track — no breakage expected.',
  },
  {
    avatarInitials: 'TB',
    meta: 'Close · Timeline Update',
    message: '@clairemitchell all bank recs on track for completion by Mar 5. Inventory recs targeting Mar 3.',
  },
];
