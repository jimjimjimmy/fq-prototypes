export type Cluster = 'frequently' | 'occasionally' | 'rarely';

export type HttpMethod = 'GET' | 'POST' | 'PATCH';
export type Ingestion = 'Filter by date' | 'Cursor' | 'Full refresh';
export type DateFormat = 'ISO 8601' | 'Unix timestamp' | 'MM/DD/YYYY';
export type ResponseFormat = 'JSON' | 'XML' | 'CSV';
export type SyncMode = 'Incremental' | 'Full refresh';
export type SyncFrequency = 'Every hour' | 'Every 6 hours' | 'Daily' | 'Weekly';
export type FirstRun = 'Backfill from a date' | 'Start from today';

export interface Param {
  k: string;
  v: string;
  t: string;
}

export interface ConfirmedRequest {
  path: string;
  method: HttpMethod;
  ingestion: Ingestion;
  dateParam: string;
  dateFormat: DateFormat;
  respFormat: ResponseFormat;
}

export interface ConfirmedSchedule {
  mode: SyncMode;
  freq: SyncFrequency;
  first: FirstRun;
  retries: string;
}

export interface EndpointState {
  name: string;
  path: string;
  cluster: Cluster;
  params: Param[];
  sections: [boolean, boolean, boolean];
  tested: boolean;
  noParams: boolean;
  confirmed: {
    request: ConfirmedRequest | null;
    params: Param[] | null;
    schedule: ConfirmedSchedule | null;
  };
}

export interface TestResult {
  status: number;
  ms: number;
  fields: number;
}

export interface AppState {
  current: number;
  section: number;
  endpoints: EndpointState[];
}
