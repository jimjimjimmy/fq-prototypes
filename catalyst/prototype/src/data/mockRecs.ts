const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR3HNFsm3rGvYj3NZxxR-UYyT9Kw6MrWygaWceeq-a_6w8dw2K3af0b2hgXg0pOqQ/pub?gid=1375070594&single=true&output=csv';
const CSV_URL = `https://corsproxy.io/?url=${encodeURIComponent(SHEET_URL)}&_t=${Date.now()}`;

export interface RecRow {
  id: number;
  entity: string;
  period: string;
  folder: string;
  account: string;
  tags: string;
  blockedBy: string;
  blocks: string;
  controls: string;
  dailyRec: string;
  autoRecType: string;
  accountBalanceFilters: string;
  uniqueRecId: string;
  perGlTotal: string;
  glTransactions: string;
  reconciledBalance: string;
  reconcilingItems: string;
  difference: string;
  preparers: string;
  preparerSignOff: string;
  preparerDueDate: string;
  preparerCompleted: string;
  reviewers: string;
  reviewerSignOff: string;
  reviewerDueDate: string;
  reviewerCompleted: string;
  actions: string;
}

// CSV header name → RecRow key mapping
const HEADER_MAP: Record<string, keyof RecRow> = {
  entity: 'entity',
  period: 'period',
  folder: 'folder',
  account: 'account',
  tags: 'tags',
  'blocked by': 'blockedBy',
  blockedby: 'blockedBy',
  blocks: 'blocks',
  controls: 'controls',
  'daily rec': 'dailyRec',
  dailyrec: 'dailyRec',
  'autorec type': 'autoRecType',
  autorectype: 'autoRecType',
  'account balance filters': 'accountBalanceFilters',
  accountbalancefilters: 'accountBalanceFilters',
  'unique reconciliation id': 'uniqueRecId',
  uniquereconciliationid: 'uniqueRecId',
  uniquerecid: 'uniqueRecId',
  'per gl total': 'perGlTotal',
  pergltotal: 'perGlTotal',
  'gl transactions': 'glTransactions',
  gltransactions: 'glTransactions',
  'reconciled balance': 'reconciledBalance',
  reconciledbalance: 'reconciledBalance',
  'reconciling items': 'reconcilingItems',
  reconcilingitems: 'reconcilingItems',
  difference: 'difference',
  preparers: 'preparers',
  'preparer sign-off': 'preparerSignOff',
  'preparer signoff': 'preparerSignOff',
  preparersignoff: 'preparerSignOff',
  'preparer due date': 'preparerDueDate',
  preparerduedate: 'preparerDueDate',
  'preparer completed': 'preparerCompleted',
  preparercompleted: 'preparerCompleted',
  reviewers: 'reviewers',
  'reviewer sign-off': 'reviewerSignOff',
  'reviewer signoff': 'reviewerSignOff',
  reviewersignoff: 'reviewerSignOff',
  'reviewer due date': 'reviewerDueDate',
  reviewerduedate: 'reviewerDueDate',
  'reviewer completed': 'reviewerCompleted',
  reviewercompleted: 'reviewerCompleted',
  actions: 'actions',
};

function parseCsvLine(rawLine: string): string[] {
  const line = rawLine.replace(/\r/g, '');
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

// ---------------------------------------------------------------------------
// People lookup
// ---------------------------------------------------------------------------
export type Person = { id: string; name: string; avatarUrl: string };

const PEOPLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR3HNFsm3rGvYj3NZxxR-UYyT9Kw6MrWygaWceeq-a_6w8dw2K3af0b2hgXg0pOqQ/pub?gid=1270092161&single=true&output=csv';
const PEOPLE_URL = `https://corsproxy.io/?url=${encodeURIComponent(PEOPLE_SHEET_URL)}&_t=${Date.now()}`;
export async function fetchPeople(): Promise<Map<string, Person>> {
  const map = new Map<string, Person>();
  try {
    const res = await fetch(PEOPLE_URL);
    if (!res.ok) return map;
    const text = await res.text();
    const lines = text.trim().split('\n').filter((l) => l.trim().length > 0);
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,\t]/).map((v) => v.trim().replace(/^"|"$/g, ''));
      const [id, name, avatarUrl] = parts;
      if (id) map.set(id, { id, name: name || id, avatarUrl: avatarUrl || '' });
    }
  } catch {
    // silently fail — grid renders IDs as fallback
  }
  return map;
}

// ---------------------------------------------------------------------------
// Recs data
// ---------------------------------------------------------------------------
export async function fetchMockRecs(): Promise<RecRow[]> {
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const keyMap = headers.map((h) => HEADER_MAP[h] ?? HEADER_MAP[h.replace(/\s+/g, '')] ?? null);

  const rows: RecRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, unknown> = { id: i - 1, actions: '' };

    for (let j = 0; j < keyMap.length; j++) {
      const key = keyMap[j];
      if (!key || key === 'id') continue;
      const val = (values[j] ?? '').trim().replace(/\r/g, '');
      row[key] = val === '' ? '' : val;
    }

    rows.push(row as unknown as RecRow);
  }

  return rows;
}
