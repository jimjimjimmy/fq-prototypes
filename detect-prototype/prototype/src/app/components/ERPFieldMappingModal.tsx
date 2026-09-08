import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSave: (mappings: Record<string, string>) => void;
  onSkip: () => void;
}

const STORAGE_KEY = 'detect-erp-field-mappings';

export function useERPFieldMappings() {
  const [mappingsDone, setMappingsDone] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const saveMappings = (mappings: Record<string, string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
    setMappingsDone(true);
  };

  const skipMappings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    setMappingsDone(true);
  };

  return { mappingsDone, saveMappings, skipMappings };
}

const FLOQAST_FIELDS = [
  { id: 'transactionId',   label: 'Transaction ID' },
  { id: 'transactionLine', label: 'Transaction Line' },
  { id: 'transactionDate', label: 'Transaction Date' },
  { id: 'postingPeriod',   label: 'Posting Period' },
  { id: 'amount',          label: 'Amount' },
  { id: 'currency',        label: 'Currency' },
  { id: 'type',            label: 'Type' },
  { id: 'subsidiary',      label: 'Entity' },
  { id: 'account',         label: 'Account' },
  { id: 'vendor',          label: 'Vendor' },
  { id: 'memo',            label: 'Memo' },
  { id: 'department',      label: 'Department' },
  { id: 'class',           label: 'Class' },
  { id: 'location',        label: 'Location' },
  { id: 'createdDate',     label: 'Created Date' },
  { id: 'createdBy',       label: 'Created By' },
];

/**
 * Optional second step of the setup flow. Lets users map FloQast's
 * transaction fields to their ERP's field names. All fields are optional —
 * users can skip the entire step or leave individual fields blank.
 */
export function ERPFieldMappingModal({ onSave, onSkip }: Props) {
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const setField = (id: string, value: string) => {
    setMappings((prev) => ({ ...prev, [id]: value }));
  };

  const mappedCount = Object.values(mappings).filter((v) => v.trim()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 flex flex-col max-h-[90vh]">

        <header className="shrink-0 border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Map Your ERP Fields
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Optional — tell us how your ERP labels these fields so we can match them correctly.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Optional
            </span>
          </div>
        </header>

        {/* Column headers */}
        <div className="shrink-0 grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            FloQast Field
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Your ERP Field Name
          </span>
        </div>

        {/* Field rows */}
        <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-100">
          {FLOQAST_FIELDS.map((field) => (
            <div key={field.id} className="grid grid-cols-2 items-center gap-3 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">{field.label}</span>
                <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
              </div>
              <input
                type="text"
                value={mappings[field.id] ?? ''}
                onChange={(e) => setField(field.id, e.target.value)}
                placeholder="e.g. GL Account"
                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>
          ))}
        </div>

        <footer className="shrink-0 flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={() => onSave(mappings)}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            {mappedCount > 0 ? `Save ${mappedCount} Mapping${mappedCount !== 1 ? 's' : ''}` : 'Save'}
          </button>
        </footer>

      </div>
    </div>
  );
}
