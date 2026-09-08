import type { Company, Entity, Period } from './types';

/**
 * Fictional customer scenario for the Detect prototype.
 *
 * Parallax Labs is a mid-market B2B SaaS company selling an AI customer
 * intelligence platform. Three legal entities (all USD-consolidated in
 * this prototype — multi-currency is out of scope). Close cadence is
 * monthly, WD+7 target.
 */

export const entities: Entity[] = [
  {
    id: 'entity-us',
    legalName: 'FloQast, Inc.',
    shortName: 'FloQast Corporate',
    country: 'United States',
    currency: 'USD',
  },
  {
    id: 'entity-uk',
    legalName: 'FloQast EMEA Ltd.',
    shortName: 'FloQast EMEA',
    country: 'United Kingdom',
    currency: 'USD', // consolidated as USD in the prototype
    parentEntityId: 'entity-us',
  },
  {
    id: 'entity-ca',
    legalName: 'FloQast Canada Inc.',
    shortName: 'FloQast Canada',
    country: 'Canada',
    currency: 'USD',
    parentEntityId: 'entity-us',
  },
];

export const company: Company = {
  id: 'floqast',
  name: 'FloQast',
  industry: 'Close management & reconciliation software',
  erp: 'NetSuite',
  arr: 200_000_000,
  headcount: 850,
  stage: 'Growth',
  hqCity: 'Los Angeles',
  hqState: 'CA',
  closeCadence: 'Monthly, WD+7',
  entities,
};

export const periods: Period[] = [
  {
    id: '2026-02',
    label: 'February 2026',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    closeDate: '2026-03-09',
    status: 'closed',
    closedById: 'priya-patel',
    closedAt: '2026-03-09T17:42:00Z',
  },
  {
    id: '2026-03',
    label: 'March 2026',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    closeDate: '2026-04-09',
    status: 'closed',
    closedById: 'priya-patel',
    closedAt: '2026-04-09T18:17:00Z',
  },
  {
    id: '2026-04',
    label: 'April 2026',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    closeDate: '2026-05-11',
    status: 'in-progress',
  },
];

/**
 * The currently-open period. Anomalies in the demo primarily target this
 * period; Feb/Mar are available for historical context.
 */
export const currentPeriodId = '2026-04';

export function getEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function getPeriod(id: string): Period | undefined {
  return periods.find((p) => p.id === id);
}
