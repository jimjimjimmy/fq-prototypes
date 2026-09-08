import type { NotificationItem } from '@/types';
import { notifications } from '@/data/notifications';

export async function getNotifications(): Promise<NotificationItem[]> {
  return notifications;
}
