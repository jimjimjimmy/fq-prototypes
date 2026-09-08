import type { InsightCard, NotificationItem } from '@/types';

export const emmaInsights: InsightCard[] = [
  {
    title: "Bank Reconciliation — JPMorgan USD Ready",
    body: "JPMorgan USD operating account reconciliation is complete — 847 of 853 transactions matched. 6 exceptions categorised as FX timing differences. Ready for Richard Keane's review.",
    taskId: 6,
    agentBadge: "Prepared by Bank Reconciliation Agent",
  },
  {
    title: "Revenue Recognition Blocked",
    body: "Wholesale revenue recognition to dealers is blocked — waiting on dealer network AR reconciliation approval. 3 fleet contracts with variable consideration require manual SSP allocation under IFRS 15.",
    taskId: 17,
  },
  {
    title: "Warranty Provision Awaiting Data",
    body: "Warranty provision calculation is blocked — needs completed vehicle inventory reconciliations from both Solihull and Castle Bromwich plants plus updated dealer claims data.",
    taskId: 13,
    agentBadge: "Prepared by Warranty Provision Agent",
  },
  {
    title: "Barclays & HSBC Reconciliations Complete",
    body: "Both Barclays GBP Operating and HSBC EUR Commercial bank reconciliations are complete and signed off. All transactions matched — no outstanding exceptions.",
    taskId: 4,
    agentBadge: "Prepared by Bank Reconciliation Agent",
  },
];

export const emmaNotifications: NotificationItem[] = [
  {
    avatarInitials: 'RK',
    meta: 'Review · JPMorgan USD Bank Reconciliation',
    message: '@emmaharrison please confirm the 6 FX timing differences before I approve.',
    isUnread: true,
  },
  {
    avatarInitials: 'TB',
    meta: 'Review · Dealer Network AR',
    message: '@emmaharrison AR reconciliation looks good — one query on the Range Rover Sport fleet deal.',
    isUnread: true,
  },
  {
    avatarInitials: 'RK',
    meta: 'Close · FX Translation',
    message: '@emmaharrison reminder: hedge effectiveness testing needs your GBP/EUR and GBP/USD data by Mar 8.',
  },
  {
    avatarInitials: 'CM',
    meta: 'Close · Monthly Close Package',
    message: '@emmaharrison close package is blocked until warranty provision and tax are finalised.',
  },
  {
    avatarInitials: 'PS',
    meta: 'Close · Vehicle Inventory — Solihull',
    message: '@emmaharrison Solihull inventory count variance is £42K — need your sign-off on the adjustment.',
  },
];
