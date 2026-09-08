import type { NotificationItem } from '@/types';

export const notifications: NotificationItem[] = [
  {
    avatarInitials: 'SL',
    meta: 'Project Management · Q4 Budget Review',
    message: '@priyasharma please review updated manufacturing cost allocations before sign-off.',
    isUnread: true,
  },
  {
    avatarInitials: 'KJ',
    meta: 'Procurement · Supplier Management',
    message: '@priyasharma Tier 1 supplier contract terms updated — accounting approval required.',
    isUnread: true,
  },
  {
    avatarInitials: 'MC',
    meta: 'Close · Intercompany Reconciliation',
    message: '@priyasharma China JV variance explanation added. Ready for final approval.',
  },
  {
    avatarInitials: 'AR',
    meta: 'Revenue · Dealer Wholesale Revenue',
    message: '@priyasharma updated fleet contract schedule attached for March close.',
  },
  {
    avatarInitials: 'TJ',
    meta: 'AP · Supplier Accrual',
    message: '@priyasharma missing GRN documentation flagged during Tier 1 supplier review.',
  },
];
