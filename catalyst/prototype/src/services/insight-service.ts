import type { InsightCard } from '@/types';
import { insightCards } from '@/data/insights';

export async function getInsights(): Promise<InsightCard[]> {
  return insightCards;
}
