import type { PersonaId, InsightCard, NotificationItem } from '@/types';
import { emmaInsights, emmaNotifications } from './emma-harrison';
import { tomInsights, tomNotifications } from './tom-bradley';
import { claireInsights, claireNotifications } from './claire-mitchell';
import { rachelInsights, rachelNotifications } from './rachel-torres';

export interface PersonaData {
  insights: InsightCard[];
  notifications: NotificationItem[];
}

const personaDataMap: Record<PersonaId, PersonaData> = {
  'emma-harrison': { insights: emmaInsights, notifications: emmaNotifications },
  'tom-bradley': { insights: tomInsights, notifications: tomNotifications },
  'claire-mitchell': { insights: claireInsights, notifications: claireNotifications },
  'rachel-torres': { insights: rachelInsights, notifications: rachelNotifications },
};

export function getPersonaData(personaId: PersonaId): PersonaData {
  return personaDataMap[personaId];
}
