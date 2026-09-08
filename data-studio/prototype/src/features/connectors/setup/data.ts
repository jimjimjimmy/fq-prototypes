import type { EndpointState, TestResult, Cluster, Ingestion, SyncMode, SyncFrequency, FirstRun } from './types';

interface EndpointSeed {
  name: string;
  path: string;
  cluster: Cluster;
  params: { k: string; v: string; t: string }[];
}

const SEED: EndpointSeed[] = [
  {
    name: 'GL Transactions',
    path: '/transactions',
    cluster: 'frequently',
    params: [
      { k: 'format', v: 'json', t: 'String' },
      { k: 'subsidiary', v: '1', t: 'Integer' },
    ],
  },
  {
    name: 'Journal Entries',
    path: '/journal-entries',
    cluster: 'frequently',
    params: [{ k: 'status', v: 'posted', t: 'String' }],
  },
  {
    name: 'AP Transactions',
    path: '/ap-transactions',
    cluster: 'frequently',
    params: [],
  },
  {
    name: 'Vendors',
    path: '/vendors',
    cluster: 'occasionally',
    params: [{ k: 'status', v: 'active', t: 'String' }],
  },
  {
    name: 'Customers',
    path: '/customers',
    cluster: 'occasionally',
    params: [],
  },
  {
    name: 'Subsidiaries',
    path: '/subsidiaries',
    cluster: 'rarely',
    params: [{ k: 'level', v: 'all', t: 'String' }],
  },
];

export const CLUSTER_DEFAULTS: Record<
  Cluster,
  { ingestion: Ingestion; dateParam: string; syncMode: SyncMode; freq: SyncFrequency; first: FirstRun }
> = {
  frequently: {
    ingestion: 'Filter by date',
    dateParam: 'updated_after',
    syncMode: 'Incremental',
    freq: 'Every hour',
    first: 'Backfill from a date',
  },
  occasionally: {
    ingestion: 'Full refresh',
    dateParam: '',
    syncMode: 'Full refresh',
    freq: 'Daily',
    first: 'Start from today',
  },
  rarely: {
    ingestion: 'Full refresh',
    dateParam: '',
    syncMode: 'Full refresh',
    freq: 'Weekly',
    first: 'Start from today',
  },
};

export const CLUSTER_LABELS: Record<Cluster, string> = {
  frequently: 'Frequent',
  occasionally: 'Occasional',
  rarely: 'Rare',
};

export const CLUSTER_ORDER: Cluster[] = ['frequently', 'occasionally', 'rarely'];

export function buildInitialEndpoints(): EndpointState[] {
  return SEED.map((s) => ({
    name: s.name,
    path: s.path,
    cluster: s.cluster,
    params: s.params,
    sections: [false, false, false] as [boolean, boolean, boolean],
    tested: false,
    noParams: s.params.length === 0,
    confirmed: { request: null, params: null, schedule: null },
  }));
}

export const TEST_RESULTS: Record<string, TestResult> = {
  '/transactions': { status: 200, ms: 312, fields: 27 },
  '/journal-entries': { status: 200, ms: 284, fields: 19 },
  '/ap-transactions': { status: 200, ms: 198, fields: 14 },
  '/vendors': { status: 200, ms: 241, fields: 22 },
  '/customers': { status: 200, ms: 310, fields: 18 },
  '/subsidiaries': { status: 200, ms: 155, fields: 11 },
};

export const SAMPLE_RESPONSE = `{
  "data": [
    {
      "id": "txn_001",
      "date": "2026-01-15",
      "amount": 14250.00,
      "currency": "USD",
      "account": "1000",
      "description": "Monthly rev..."
    }
  ],
  "meta": {
    "total": 1247,
    "page": 1,
    "per_page": 100
  }
}`;
