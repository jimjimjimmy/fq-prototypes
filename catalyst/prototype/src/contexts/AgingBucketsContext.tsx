import { createContext, useContext, useState, type ReactNode } from 'react';

export const DEFAULT_BUCKET_LABELS = [
  'Current',
  '1 - 30',
  '31 - 60',
  '61 - 90',
  '91 - 120',
  '120+',
  'Unidentified Date',
];

export interface FieldValue { id: string; label: string; }
export interface MetadataField { id: string; title: string; required: boolean; values: FieldValue[]; }

export const DEFAULT_METADATA_FIELDS: MetadataField[] = [
  { id: 'f1', title: 'Classification', required: true, values: [
    { id: 'v1', label: 'Known Difference' },
    { id: 'v2', label: 'Unknown Difference' },
    { id: 'v3', label: 'Timing' },
    { id: 'v4', label: 'Permanent' },
  ]},
  { id: 'f2', title: 'Reason Code', required: false, values: [
    { id: 'v5', label: 'Outstanding Check' },
    { id: 'v6', label: 'Deposit in Transit' },
    { id: 'v7', label: 'Unposted JE' },
    { id: 'v8', label: 'Immaterial Variance' },
    { id: 'v9', label: 'Correction Next Period' },
  ]},
  { id: 'f3', title: 'P&L Impact', required: false, values: [
    { id: 'v10', label: 'P&L Impact' },
    { id: 'v11', label: 'B/S Only' },
    { id: 'v12', label: 'N/A' },
  ]},
];

// Maps fixed field IDs to the data keys used in ReconcilingItem
export const FIELD_ID_TO_KEY: Record<string, string> = {
  f1: 'classification',
  f2: 'reasonCode',
  f3: 'plImpact',
};

interface AgingBucketsContextValue {
  bucketLabels: string[];
  setBucketLabels: (labels: string[]) => void;
  metadataFields: MetadataField[];
  setMetadataFields: (fields: MetadataField[]) => void;
}

const AgingBucketsContext = createContext<AgingBucketsContextValue | null>(null);

export function AgingBucketsProvider({ children }: { children: ReactNode }) {
  const [bucketLabels, setBucketLabels] = useState<string[]>(DEFAULT_BUCKET_LABELS);
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>(DEFAULT_METADATA_FIELDS);
  return (
    <AgingBucketsContext.Provider value={{ bucketLabels, setBucketLabels, metadataFields, setMetadataFields }}>
      {children}
    </AgingBucketsContext.Provider>
  );
}

export function useAgingBuckets() {
  const ctx = useContext(AgingBucketsContext);
  if (!ctx) throw new Error('useAgingBuckets must be used within AgingBucketsProvider');
  return ctx;
}
