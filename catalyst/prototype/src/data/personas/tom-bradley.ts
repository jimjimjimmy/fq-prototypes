import type { InsightCard, NotificationItem } from '@/types';

export const tomInsights: InsightCard[] = [
  {
    title: "Review Queue: 5 Items Pending",
    body: "You have 5 tasks awaiting review. The warranty provision (blocked) and wholesale revenue recognition are highest priority based on due dates and downstream impact on the close package.",
    taskId: 13,
  },
  {
    title: "Warranty Provision Blocked — Critical Path",
    body: "Warranty provision calculation is blocked on vehicle inventory reconciliations from Solihull and Castle Bromwich. Both are in progress — Priya estimates completion by Mar 3. This is on the critical path to close.",
    taskId: 13,
    agentBadge: "Prepared by Warranty Provision Agent",
  },
  {
    title: "Vehicle Inventory — Solihull Nearing Completion",
    body: "Solihull plant vehicle inventory reconciliation is 92% complete. 4,847 of 5,264 units verified against SAP. 12 units flagged for VIN-level investigation — mostly in-transit vehicles between Solihull and dealers.",
    taskId: 7,
    agentBadge: "Prepared by Inventory Agent",
  },
  {
    title: "Dealer Incentive Accruals In Progress",
    body: "Dealer incentive and bonus accruals are being prepared. Q1 programme rates updated — estimated £8.2M accrual across UK and European dealer networks. Prior period was £7.6M.",
    taskId: 18,
  },
];

export const tomNotifications: NotificationItem[] = [
  {
    avatarInitials: 'PS',
    meta: 'Preparation · Vehicle Inventory — Solihull',
    message: '@tombradley 12 VIN discrepancies identified — sending analysis for your review.',
    isUnread: true,
  },
  {
    avatarInitials: 'PS',
    meta: 'Preparation · Vehicle Inventory — Castle Bromwich',
    message: '@tombradley Castle Bromwich count complete. 3 units in body shop not on production system — adjustment proposed.',
    isUnread: true,
  },
  {
    avatarInitials: 'EH',
    meta: 'Preparation · Revenue Recognition',
    message: '@tombradley updated wholesale revenue analysis — fleet contracts SSP allocation attached.',
  },
  {
    avatarInitials: 'CM',
    meta: 'Close · Monthly Timeline',
    message: '@tombradley please prioritise the warranty provision review — it blocks the close package.',
  },
  {
    avatarInitials: 'EH',
    meta: 'Preparation · Dealer Incentive Accruals',
    message: '@tombradley incentive accrual draft ready — £8.2M vs £7.6M prior month. Need your review.',
  },
];
