import { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { ChevronDown, Columns3, Filter, ListFilter, AlertTriangle, Check, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAgingBuckets, FIELD_ID_TO_KEY } from '@/contexts/AgingBucketsContext';
import { AgGridReact } from '@ag-grid-community/react';
import type { ColDef, ICellRendererParams, IFloatingFilterParams, RowClassParams } from '@ag-grid-community/core';
import { themeQuartz } from '@ag-grid-community/theming';
import { MOCK_RECONCILING_ITEMS, ACCOUNTS } from '@/data/mockReconcilingItems';
import type { ReconcilingItem, FieldError } from '@/data/mockReconcilingItems';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TRUNC: React.CSSProperties = {
  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%',
};

const numFmt = (val: number) =>
  val === 0
    ? '-'
    : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const currencyFmt = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

// ---------------------------------------------------------------------------
// Cell renderers
// ---------------------------------------------------------------------------

function TextCell({ value }: ICellRendererParams<ReconcilingItem>) {
  return (
    <div style={{ ...TRUNC, color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
      {value ?? ''}
    </div>
  );
}

function LinkCell({ value }: ICellRendererParams<ReconcilingItem>) {
  if (!value) return <span />;
  return (
    <div style={TRUNC}>
      <span style={{ textDecoration: 'underline', color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error cell — inline orange error with suggestion popover
// ---------------------------------------------------------------------------

function ErrorCell({ error }: { error: FieldError; value: string | null; onApply: (suggestion: string) => void }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <span style={{
        color: '#db7712', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block', width: '100%',
      }}>
        {error.message}
      </span>
    </div>
  );
}

function ClassificationCell({ value, data }: ICellRendererParams<ReconcilingItem>) {
  const err = data?.errors?.find(e => e.field === 'classification');
  if (err) return <ErrorCell error={err} value={value} onApply={() => {}} />;
  if (!value) {
    return (
      <div style={{ ...TRUNC, color: '#adb2bb', fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
        Not classified
      </div>
    );
  }
  return (
    <div style={{ ...TRUNC, color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
      {value}
    </div>
  );
}

function NullableTextCell({ value, data, colDef }: ICellRendererParams<ReconcilingItem>) {
  const field = colDef?.field as 'reasonCode' | 'plImpact' | undefined;
  const err = field ? data?.errors?.find(e => e.field === field) : undefined;
  if (err) return <ErrorCell error={err} value={value} onApply={() => {}} />;
  if (!value) {
    return (
      <div style={{ ...TRUNC, color: '#adb2bb', fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
        Not classified
      </div>
    );
  }
  return (
    <div style={{ ...TRUNC, color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
      {value}
    </div>
  );
}

function AmountCell({ value }: ICellRendererParams<ReconcilingItem>) {
  if (value === undefined || value === null) return <span />;
  const isNeg = value < 0;
  return (
    <div style={{ ...TRUNC, textAlign: 'right' }}>
      <span style={{ color: isNeg ? '#ef4444' : '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {numFmt(value)}
      </span>
    </div>
  );
}

function AgingCell({ value }: ICellRendererParams<ReconcilingItem>) {
  const isZero = !value || value === 0;
  return (
    <div style={{ ...TRUNC, textAlign: 'right' }}>
      <span style={{ color: isZero ? '#adb2bb' : '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {isZero ? '-' : numFmt(value)}
      </span>
    </div>
  );
}

function StatusCell({ value, data }: ICellRendererParams<ReconcilingItem>) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const errors = data?.errors ?? [];
  const hasErrors = errors.length > 0;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardWidth = 288;
    let left = rect.left;
    if (left + cardWidth > window.innerWidth - 16) left = rect.right - cardWidth;
    setCardPos({ top: rect.bottom + 4, left });
    setOpen(o => !o);
  };

  if (value === 'Valid' || applied) {
    return (
      <div style={TRUNC}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          height: '24px', padding: '0 10px',
          background: '#ecfdf5', borderRadius: '4px',
          color: '#1fac76', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          Valid
        </span>
      </div>
    );
  }

  if (value === 'Needs Correction' && hasErrors) {
    return (
      <>
        <div style={TRUNC}>
          <button
            ref={btnRef}
            onClick={handleOpen}
            style={{
              display: 'inline-flex', alignItems: 'center',
              height: '24px', padding: '0 10px',
              background: '#db7712', borderRadius: '4px',
              color: '#ffffff', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
            }}
          >
            View Suggested Correction
          </button>
        </div>

        {open && createPortal(
          <div
            ref={cardRef}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', top: cardPos.top, left: cardPos.left,
              zIndex: 9999, width: '320px',
              background: '#fff', border: '1px solid #e1e6ef',
              borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #e1e6ef' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>
                {data?.accountNumber}
              </span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', padding: '2px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.5', marginBottom: '14px' }}>
                Suggested based on similar items in this account.
              </p>

              <div style={{ border: '1px solid #e1e6ef', borderRadius: '6px', padding: '12px', background: '#fafbfc' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d2433', fontFamily: 'Inter, sans-serif', marginBottom: '10px' }}>
                  Suggested Correction
                </div>
                <div style={{ border: '1px solid #e1e6ef', borderRadius: '4px', padding: '10px 12px', background: '#fff', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#424867', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                    #fqri-{data?.accountNumber?.replace('-', '')}(
                    {errors.map((err, i) => {
                      const label = err.field === 'classification' ? 'Classification' : err.field === 'reasonCode' ? 'Reason Code' : err.field === 'plImpact' ? 'P&L Impact' : err.field;
                      return (
                        <span key={err.field}>
                          {i > 0 && ', '}
                          {label}: "<span style={{ fontWeight: 600 }}>{err.suggestion}</span>"
                        </span>
                      );
                    })}
                    )
                  </div>
                </div>
                <button
                  onClick={() => {
                    const text = `#fqri-${data?.accountNumber?.replace('-', '')}(${errors.map(e => {
                      const label = e.field === 'classification' ? 'Classification' : e.field === 'reasonCode' ? 'Reason Code' : e.field === 'plImpact' ? 'P&L Impact' : e.field;
                      return `${label}: "${e.suggestion}"`;
                    }).join(', ')})`;
                    const afterCopy = () => {
                      setCopied(true);
                      toast.success('Suggestion copied to clipboard');
                      setTimeout(() => setCopied(false), 2000);
                    };
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text).then(afterCopy).catch(afterCopy);
                    } else {
                      afterCopy();
                    }
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    height: '30px', padding: '0 12px',
                    background: copied ? '#ecfdf5' : '#fff',
                    color: copied ? '#1fac76' : '#424867',
                    border: `1px solid ${copied ? '#1fac76' : '#cbd2e1'}`,
                    borderRadius: '4px',
                    fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? <><Check size={12} /> Suggestion Copied</> : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  if (value === 'Needs Correction') {
    return (
      <div style={TRUNC}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          height: '24px', padding: '0 10px',
          background: '#db7712', borderRadius: '4px',
          color: '#ffffff', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          Needs Correction
        </span>
      </div>
    );
  }

  return (
    <div style={TRUNC}>
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        height: '24px', padding: '0 10px',
        background: '#f1f3f9', borderRadius: '4px',
        color: '#6b7280', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        Not classified
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Account floating filter
// ---------------------------------------------------------------------------
const _acctFilter = {
  selected: [] as string[],
  all: [] as { number: string; name: string }[],
  set: null as ((accts: string[]) => void) | null,
  listeners: new Set<() => void>(),
};

function applyAcctFilter(accounts: string[]) {
  _acctFilter.selected = accounts;
  _acctFilter.set?.(accounts);
  _acctFilter.listeners.forEach(l => l());
}

function AccountNumberFloatingFilter() {
  const [, forceUpdate] = useState(0);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  // Subscribe to external changes — read directly from store each render
  useEffect(() => {
    const sync = () => forceUpdate(n => n + 1);
    _acctFilter.listeners.add(sync);
    return () => { _acctFilter.listeners.delete(sync); };
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdown = document.getElementById('acct-filter-dropdown');
      if (!triggerRef.current?.contains(target) && !dropdown?.contains(target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Always read fresh from store — no stale local copy
  const selected = _acctFilter.selected;
  const allCount = _acctFilter.all.length;
  const isFiltered = selected.length > 0 && selected.length < allCount;
  const label = selected.join(', ');

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 2, left: rect.left });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    const inject = () => {
      const cell = triggerRef.current?.closest('.ag-floating-filter') as HTMLElement | null;
      if (!cell) return;
      const btnWrap = cell.querySelector('.ag-floating-filter-button') as HTMLElement | null;
      const icon = btnWrap?.querySelector('button') as HTMLElement | null;
      btnWrap?.querySelector('.acct-dot')?.remove();
      if (isFiltered && btnWrap && icon) {
        icon.style.color = '#1fac76';
        btnWrap.style.position = 'relative';
        const dot = document.createElement('span');
        dot.className = 'acct-dot';
        dot.style.cssText = 'position:absolute;top:1px;right:1px;width:7px;height:7px;background:#1fac76;border-radius:50%;border:1.5px solid #fff;pointer-events:none;z-index:1;';
        btnWrap.appendChild(dot);
      } else if (icon) {
        icon.style.color = '';
      }
    };
    const id = setTimeout(inject, 30);
    return () => clearTimeout(id);
  }, [isFiltered]);

  const toggleAccount = (num: string) => {
    const next = selected.includes(num) ? selected.filter(s => s !== num) : [...selected, num];
    applyAcctFilter(next);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer' }}
      >
        <div style={{
          width: '100%', height: '26px', display: 'flex', alignItems: 'center',
          padding: '0 8px', background: '#ffffff',
          border: '1px solid rgba(66,72,103,0.15)', borderRadius: '3px', overflow: 'hidden',
        }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#424867', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isFiltered ? label : ''}
          </span>
        </div>
      </div>
      {open && (
        <div id="acct-filter-dropdown" style={{
          position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999,
          background: '#ffffff', border: '1px solid #e1e6ef', borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          minWidth: '240px', padding: '4px 0',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f3f9' }}>
            <input
              type="checkbox"
              checked={selected.length === allCount}
              ref={el => { if (el) el.indeterminate = selected.length > 0 && selected.length < allCount; }}
              onChange={() => {
                const next = selected.length === allCount ? [] : _acctFilter.all.map(a => a.number);
                applyAcctFilter(next);
              }}
              style={{ accentColor: '#1a7b4b', width: '14px', height: '14px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>(Select All)</span>
          </label>
          {_acctFilter.all.map(({ number, name }) => (
            <label key={number} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selected.includes(number)}
                onChange={() => toggleAccount(number)}
                style={{ accentColor: '#1a7b4b', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>{number}</span>
              <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{name}</span>
            </label>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Select options — mutable bridge updated each render from context
// ---------------------------------------------------------------------------
const SELECT_OPTS: Record<string, string[]> = {
  accountName: [...new Set(MOCK_RECONCILING_ITEMS.map(r => r.accountName))],
  classification: [...new Set(MOCK_RECONCILING_ITEMS.filter(r => r.classification).map(r => r.classification as string))],
  reasonCode: [...new Set(MOCK_RECONCILING_ITEMS.filter(r => r.reasonCode).map(r => r.reasonCode as string))],
  plImpact: [...new Set(MOCK_RECONCILING_ITEMS.filter(r => r.plImpact).map(r => r.plImpact as string))],
  status: ['Valid', 'Needs Correction', 'Not classified'],
};

// Module-level bridge for column header labels (updated each render)
const _fieldHeaders = { classification: 'Classification', reasonCode: 'Reason Code', plImpact: 'P&L Impact' };

// ---------------------------------------------------------------------------
// Filter store (module-level bridge between floating filters and parent)
// ---------------------------------------------------------------------------
const _filterStore = {
  text: {} as Record<string, string>,
  select: {} as Record<string, string[]>,
  notify: null as (() => void) | null,
};

function applyTextFilter(field: string, value: string) {
  _filterStore.text[field] = value;
  _filterStore.notify?.();
}

function applySelectFilter(field: string, values: string[]) {
  _filterStore.select[field] = values;
  _filterStore.notify?.();
}

// ---------------------------------------------------------------------------
// Text floating filter (date, description, amount, aging)
// ---------------------------------------------------------------------------
function TextFloatingFilter(props: IFloatingFilterParams) {
  const field = props.column.getColId();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isActive = value.trim() !== '';

  useEffect(() => {
    const inject = () => {
      const cell = wrapRef.current?.closest('.ag-floating-filter') as HTMLElement | null;
      if (!cell) return;
      const btnWrap = cell.querySelector('.ag-floating-filter-button') as HTMLElement | null;
      const icon = btnWrap?.querySelector('button') as HTMLElement | null;
      btnWrap?.querySelector('.col-filter-dot')?.remove();
      if (isActive && btnWrap && icon) {
        icon.style.color = '#1fac76';
        btnWrap.style.position = 'relative';
        const dot = document.createElement('span');
        dot.className = 'col-filter-dot';
        dot.style.cssText = 'position:absolute;top:1px;right:1px;width:7px;height:7px;background:#1fac76;border-radius:50%;border:1.5px solid #fff;pointer-events:none;z-index:1;';
        btnWrap.appendChild(dot);
      } else if (icon) {
        icon.style.color = '';
      }
    };
    const id = setTimeout(inject, 30);
    return () => clearTimeout(id);
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    applyTextFilter(field, v);
  };

  const handleClear = () => {
    setValue('');
    applyTextFilter(field, '');
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '0 4px', position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        style={{
          width: '100%', height: '26px',
          padding: isActive ? '0 28px 0 8px' : '0 8px',
          background: '#ffffff',
          border: '1px solid rgba(66,72,103,0.15)', borderRadius: '3px',
          fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#424867',
          outline: 'none', boxSizing: 'border-box',
        }}
      />
      {isActive && (
        <button
          onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
          style={{
            position: 'absolute', right: '8px',
            width: '16px', height: '16px',
            background: '#adb2bb', border: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, color: '#ffffff', fontSize: '11px', fontWeight: 700,
            lineHeight: 1, flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Select floating filter (accountName, classification, reasonCode, plImpact, status)
// ---------------------------------------------------------------------------
function SelectFloatingFilter(props: IFloatingFilterParams) {
  const field = props.column.getColId();
  const opts = SELECT_OPTS[field] ?? [];
  const [selected, setSelected] = useState<string[]>(opts);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const isFiltered = selected.length < opts.length;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      const dropdown = document.getElementById(`sel-ff-${field}`);
      if (!triggerRef.current?.contains(target) && !dropdown?.contains(target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [field]);

  useEffect(() => {
    const inject = () => {
      const cell = triggerRef.current?.closest('.ag-floating-filter') as HTMLElement | null;
      if (!cell) return;
      const btnWrap = cell.querySelector('.ag-floating-filter-button') as HTMLElement | null;
      const icon = btnWrap?.querySelector('button') as HTMLElement | null;
      btnWrap?.querySelector('.col-filter-dot')?.remove();
      if (isFiltered && btnWrap && icon) {
        icon.style.color = '#1fac76';
        btnWrap.style.position = 'relative';
        const dot = document.createElement('span');
        dot.className = 'col-filter-dot';
        dot.style.cssText = 'position:absolute;top:1px;right:1px;width:7px;height:7px;background:#1fac76;border-radius:50%;border:1.5px solid #fff;pointer-events:none;z-index:1;';
        btnWrap.appendChild(dot);
      } else if (icon) {
        icon.style.color = '';
      }
    };
    const id = setTimeout(inject, 30);
    return () => clearTimeout(id);
  }, [isFiltered]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 2, left: rect.left });
    }
    setOpen(o => !o);
  };

  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    setSelected(next);
    applySelectFilter(field, next);
  };

  const label = isFiltered ? selected.join(', ') : '';

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        style={{ width: '100%', minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer', overflow: 'hidden' }}
      >
        <div style={{
          flex: 1, minWidth: 0, height: '26px', display: 'flex', alignItems: 'center',
          padding: '0 8px', background: '#ffffff',
          border: '1px solid rgba(66,72,103,0.15)', borderRadius: '3px', overflow: 'hidden',
        }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#424867', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label}
          </span>
        </div>
      </div>
      {open && (
        <div id={`sel-ff-${field}`} style={{
          position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999,
          background: '#ffffff', border: '1px solid #e1e6ef', borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          minWidth: '200px', maxHeight: '240px', overflowY: 'auto', padding: '4px 0',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f3f9' }}>
            <input
              type="checkbox"
              checked={selected.length === opts.length}
              ref={el => { if (el) el.indeterminate = selected.length > 0 && selected.length < opts.length; }}
              onChange={() => {
                const next = selected.length === opts.length ? [] : [...opts];
                setSelected(next);
                applySelectFilter(field, next);
              }}
              style={{ accentColor: '#1a7b4b', width: '14px', height: '14px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>(Select All)</span>
          </label>
          {opts.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ accentColor: '#1a7b4b', width: '14px', height: '14px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const gridTheme = themeQuartz.withParams({
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  oddRowBackgroundColor: '#ffffff',
  rowBorder: { style: 'solid', width: 1, color: '#e1e6ef' },
  columnBorder: false,
  headerColumnBorder: false,
  headerColumnResizeHandleColor: '#e1e6ef',
  headerColumnResizeHandleHeight: '50%',
  headerColumnResizeHandleWidth: '2px',
  backgroundColor: '#ffffff',
  headerBackgroundColor: '#f8fafc',
  headerFontSize: 12,
  headerFontWeight: 600,
  headerTextColor: '#1b1f27',
  foregroundColor: '#424867',
  selectedRowBackgroundColor: '#f0f5ff',
  rowHoverColor: 'color-mix(in srgb, transparent, #2196f3 8%)',
  checkboxUncheckedBorderColor: '#cbd2e1',
  accentColor: '#1a7b4b',
  wrapperBorderRadius: '4px',
  spacing: '4px',
});

// ---------------------------------------------------------------------------
// Metric cards
// ---------------------------------------------------------------------------
function MetricCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e1e6ef', borderRadius: '6px',
      padding: '12px 16px', minWidth: '180px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: valueColor ?? '#1d2433', fontFamily: "'Museo Sans', sans-serif", lineHeight: '28px' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', fontWeight: 400, color: '#adb2bb', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
        {sub}
      </div>
    </div>
  );
}

// right-aligned cell style shorthand
const rightCell: React.CSSProperties = {
  paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px',
  display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
  overflow: 'hidden', whiteSpace: 'nowrap',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ReconcilingItemsPageAG() {
  const { recItemsFilter, setCurrentPage } = useNavigation();
  const { bucketLabels, metadataFields } = useAgingBuckets();
  const allRows = MOCK_RECONCILING_ITEMS;
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [statusPinned, setStatusPinned] = useState<'right' | undefined>('right');

  // Unpin Status when the container is wide enough to show all columns without scrolling
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setStatusPinned(entry.contentRect.width >= 2250 ? undefined : 'right');
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync metadata field titles and values into module-level bridges each render
  metadataFields.forEach(f => {
    const key = FIELD_ID_TO_KEY[f.id];
    if (key) {
      SELECT_OPTS[key] = f.values.map(v => v.label);
      (_fieldHeaders as Record<string, string>)[key] = f.title;
    }
  });

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    recItemsFilter ? [recItemsFilter] : ACCOUNTS.map(a => a.number)
  );
  const [filterVersion, setFilterVersion] = useState(0);

  // Keep bridges in sync
  _acctFilter.selected = selectedAccounts;
  _acctFilter.all = ACCOUNTS;
  _acctFilter.set = setSelectedAccounts;
  _filterStore.notify = () => setFilterVersion(v => v + 1);

  const exportToExcel = (rows: ReconcilingItem[]) => {
    const wb = XLSX.utils.book_new();
    const period = 'March 2025';
    const entity = '1 - Close US';

    // Sheet 1: metadata columns
    const s1 = [
      [],
      ['Reconciling Items Listing'],
      [`Period: ${period}`],
      [`Entity: ${entity}`],
      [], [],
      ['Period', 'Account Number', 'Account Name', 'Date', 'Description', 'Amount', 'Classification', 'Reason Code', 'P&L Impact', 'Status'],
      ...rows.map(r => [
        period, r.accountNumber, r.accountName, r.date, r.description, r.amount,
        r.classification ?? 'Not classified', r.reasonCode ?? 'Not classified',
        r.plImpact ?? 'Not classified', r.status,
      ]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(s1);
    ws1['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 42 }, { wch: 14 }, { wch: 20 }, { wch: 22 }, { wch: 14 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Reconciling_Items');

    // Sheet 2: aging columns
    const agingHeaders = ['Period', 'Account Number', 'Account Name', 'Date', 'Description', 'Currency', 'Amount',
      bucketLabels[0] ?? 'Current',
      bucketLabels[1] ?? '1 - 30',
      bucketLabels[2] ?? '31 - 60',
      bucketLabels[3] ?? '61 - 90',
      bucketLabels[4] ?? '91 - 120',
      bucketLabels[5] ?? '120+',
      bucketLabels[6] ?? 'Unidentified Date',
      'Classification', 'Reason Code', 'P&L Impact'];
    const s2Rows = rows.map(r => [
      period, r.accountNumber, r.accountName, r.date, r.description, 'USD', r.amount,
      r.ageCurrent || null, r.age1to30 || null, r.age31to60 || null,
      r.age61to90 || null, r.age91to120 || null, r.age120plus || null, r.ageUnidentified || null,
      r.classification ?? 'Not classified', r.reasonCode ?? 'Not classified', r.plImpact ?? 'Not classified',
    ]);
    const sum = (fn: (r: ReconcilingItem) => number) => rows.reduce((a, r) => a + fn(r), 0);
    const totals = ['Total', '', '', '', '', '', sum(r => r.amount), sum(r => r.ageCurrent), sum(r => r.age1to30), sum(r => r.age31to60), sum(r => r.age61to90), sum(r => r.age91to120), sum(r => r.age120plus), sum(r => r.ageUnidentified)];
    const s2 = [
      [],
      ['Reconciling Items Listing'],
      [`Period: ${period}`],
      [`Entity: ${entity}`],
      [],
      ['*Aging is based off of date entered and is only shown for the current period selected'],
      [],
      agingHeaders,
      ...s2Rows,
      totals,
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(s2);
    ws2['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 42 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 18 }, { wch: 20 }, { wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Reconciling_Items_Aging');

    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).replace(/,/g, '').replace(/ /g, '_');
    XLSX.writeFile(wb, `FloQast_Reconciling_Items_${entity.replace(/ /g, '_')}_March_2025_${dateStr}.xlsx`);
  };

  const filteredRows = useMemo(() => {
    let rows = allRows.filter(r => selectedAccounts.includes(r.accountNumber));
    for (const [field, val] of Object.entries(_filterStore.text)) {
      if (!val.trim()) continue;
      const lower = val.toLowerCase();
      rows = rows.filter(r => {
        const v = (r as unknown as Record<string, unknown>)[field];
        return v != null && String(v).toLowerCase().includes(lower);
      });
    }
    for (const [field, vals] of Object.entries(_filterStore.select)) {
      const all = SELECT_OPTS[field];
      if (!all || vals.length >= all.length) continue;
      rows = rows.filter(r => {
        const v = (r as unknown as Record<string, unknown>)[field];
        return vals.includes(v as string);
      });
    }
    return rows;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccounts, filterVersion]);

  const accountLabel = selectedAccounts.length === ACCOUNTS.length
    ? 'All Accounts'
    : selectedAccounts.length === 1
      ? selectedAccounts[0]
      : selectedAccounts.length === 0
        ? 'No Accounts'
        : `${selectedAccounts.length} accounts`;

  const totalAmount = filteredRows.reduce((s, r) => s + r.amount, 0);
  const needsReview = filteredRows.filter(r => r.status === 'Needs Correction').length;

  const getRowStyle = (params: RowClassParams<ReconcilingItem>) => {
    if (params.data?.status === 'Needs Correction') {
      return { background: '#fff8f0' };
    }
    return undefined;
  };

  const defaultColDef = useMemo<ColDef>(() => ({
    suppressSizeToFit: true,
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    cellStyle: {
      paddingTop: '10px', paddingBottom: '10px',
      paddingLeft: '16px', paddingRight: '16px',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
    },
  }), []);

  const colDefs = useMemo<ColDef<ReconcilingItem>[]>(() => (
  [
    { field: 'accountNumber', headerName: 'Account Number', width: 175, pinned: 'left', cellRenderer: LinkCell, floatingFilterComponent: AccountNumberFloatingFilter },
    { field: 'accountName',   headerName: 'Account Name',   width: 185, pinned: 'left', cellRenderer: LinkCell, floatingFilterComponent: SelectFloatingFilter },
    { field: 'date',          headerName: 'Date',           width: 110, cellRenderer: TextCell, floatingFilterComponent: TextFloatingFilter },
    { field: 'description',   headerName: 'Description',    width: 200, cellRenderer: TextCell, floatingFilterComponent: TextFloatingFilter },
    {
      field: 'amount', headerName: 'Amount', width: 120,
      filter: 'agNumberColumnFilter',
      floatingFilterComponent: TextFloatingFilter,
      cellRenderer: AmountCell,
      cellStyle: rightCell,
      headerClass: 'ag-right-aligned-header',
    },
    { field: 'classification', headerName: _fieldHeaders.classification, width: 155, cellRenderer: ClassificationCell, floatingFilterComponent: SelectFloatingFilter },
    { field: 'reasonCode',    headerName: _fieldHeaders.reasonCode,    width: 155, cellRenderer: NullableTextCell, floatingFilterComponent: SelectFloatingFilter },
    { field: 'plImpact',      headerName: _fieldHeaders.plImpact,      width: 110, cellRenderer: NullableTextCell, floatingFilterComponent: SelectFloatingFilter },
    { field: 'ageCurrent',      headerName: bucketLabels[0] ?? 'Current',           width: 110, hide: !bucketLabels[0], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'age1to30',        headerName: bucketLabels[1] ?? '1 - 30',            width: 100, hide: !bucketLabels[1], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'age31to60',       headerName: bucketLabels[2] ?? '31 - 60',           width: 100, hide: !bucketLabels[2], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'age61to90',       headerName: bucketLabels[3] ?? '61 - 90',           width: 100, hide: !bucketLabels[3], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'age91to120',      headerName: bucketLabels[4] ?? '91 - 120',          width: 110, hide: !bucketLabels[4], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'age120plus',      headerName: bucketLabels[5] ?? '120+',              width: 100, hide: !bucketLabels[5], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    { field: 'ageUnidentified', headerName: bucketLabels[6] ?? 'Unidentified Date', width: 155, hide: !bucketLabels[6], filter: 'agNumberColumnFilter', floatingFilterComponent: TextFloatingFilter, cellRenderer: AgingCell, cellStyle: rightCell, headerClass: 'ag-right-aligned-header' },
    {
      field: 'status',
      headerName: 'Status',
      width: 220,
      pinned: statusPinned,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      floatingFilterComponent: SelectFloatingFilter,
      cellRenderer: StatusCell,
    },
  ]), [bucketLabels, metadataFields, statusPinned]);

  const toolbarBtn = {
    height: '32px', padding: '0 12px', gap: '6px',
    border: '1px solid #e1e6ef', borderRadius: '6px',
    fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#424867',
    background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center',
  } as React.CSSProperties;

  return (
    <div className="h-full flex flex-col bg-white">
      <style>{`
        .ag-header-cell {
          padding-left: 12px !important;
          padding-right: 12px !important;
          border-right: none !important;
        }
        .ag-cell {
          border-right: none !important;
        }
        .ag-header-group-cell {
          padding-left: 12px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #6b7280 !important;
          letter-spacing: 0.6px !important;
          text-transform: uppercase !important;
          font-family: Inter, sans-serif !important;
          background: #f8fafc !important;
          border-bottom: 1px solid #e1e6ef !important;
        }
        .ag-floating-filter {
          background: #ffffff !important;
          border-bottom: 1px solid #e1e6ef !important;
        }
        .ag-floating-filter-input {
          font-size: 12px !important;
          font-family: Inter, sans-serif !important;
        }
        .ag-floating-filter-body {
          overflow: hidden !important;
          min-width: 0 !important;
          flex: 1 !important;
        }
        .ag-right-aligned-header .ag-header-cell-label {
          justify-content: flex-end !important;
        }
        .ag-pinned-right-cols-container .ag-cell {
          border-left: 1px solid #e1e6ef !important;
        }
        .ag-pinned-right-header .ag-header-cell {
          border-left: 1px solid #e1e6ef !important;
        }
        .ag-pinned-left-cols-container {
          border-right: 1px solid #cbd2e1 !important;
          box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
        }
        .ag-pinned-left-header {
          border-right: 1px solid #cbd2e1 !important;
          box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
        }
        .ag-pinned-left-floating-bottom,
        .ag-floating-filter.ag-pinned-left-floating-filter {
          border-right: 1px solid #cbd2e1 !important;
        }
        .ag-floating-filter[col-id="accountNumber"].acct-filter-active .ag-floating-filter-button button {
          color: #3d7bf7 !important;
        }
        .ag-floating-filter[col-id="accountNumber"].acct-filter-active .ag-floating-filter-button {
          position: relative;
        }
        .ag-floating-filter[col-id="accountNumber"].acct-filter-active .ag-floating-filter-button::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 6px;
          height: 6px;
          background: #3d7bf7;
          border-radius: 50%;
          border: 1px solid #ffffff;
        }
      `}</style>

      {/* Sub-navigation tabs */}
      <div className="border-b border-[#e4e7ec] px-6 flex items-center gap-0 h-[44px]" style={{ flexShrink: 0 }}>
        {['Dashboard', 'Folders', 'Checklist', 'Reconciliations', 'Notes', 'Journal Entries', 'Flux Analysis'].map((tab) => (
          <button
            key={tab}
            className={`px-4 h-full text-[12px] font-semibold border-b-2 transition-colors ${
              tab === 'Reconciliations'
                ? 'border-[#1c895f] text-[#000000]'
                : 'border-transparent text-[#424867] hover:text-[#1d2433]'
            }`}
            style={{ fontFamily: "'Museo Sans', sans-serif" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="px-6 flex items-center gap-2 border-b border-[#e4e7ec]" style={{ height: '48px', flexShrink: 0 }}>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          1 - Close US <ChevronDown className="size-3.5 text-[#6b7280]" />
        </button>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          By Period <ChevronDown className="size-3.5 text-[#6b7280]" />
        </button>
        <button style={toolbarBtn} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}>
          March 2025 <ChevronDown className="size-3.5 text-[#6b7280]" />
        </button>
      </div>

      {/* Page header */}
      <div style={{ padding: '16px 24px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontFamily: "'Museo Sans', sans-serif", fontSize: '22px', fontWeight: 700, lineHeight: '28px', color: '#000000', margin: 0 }}>
            Reconciling Items: <span style={{ fontWeight: 400 }}>{accountLabel}</span>
          </h1>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 400, color: '#adb2bb' }}>
            {filteredRows.length}/{allRows.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
          <button
            onClick={() => exportToExcel(filteredRows)}
            style={{
              height: '32px', padding: '0 14px', border: '1px solid #e1e6ef', borderRadius: '6px',
              fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#424867',
              background: '#ffffff', cursor: 'pointer',
            }}>
            Export
          </button>
          <button
            onClick={() => setCurrentPage('ConfigureFields')}
            style={{
              height: '32px', padding: '0 14px', border: '1px solid #e1e6ef', borderRadius: '6px',
              fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#424867',
              background: '#ffffff', cursor: 'pointer',
            }}
          >
            Configure fields
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: '12px', padding: '8px 24px 16px', flexShrink: 0 }}>
        <MetricCard
          label="Reconciling Items"
          value={currencyFmt(totalAmount)}
          sub={`${allRows.length} items total`}
          valueColor="#db7712"
        />
        <MetricCard
          label="Needs Review"
          value={String(needsReview)}
          sub={`of ${filteredRows.length} items`}
        />
      </div>

      {/* Grid */}
      <div ref={gridContainerRef} className="flex-1 px-6 pb-4" style={{ position: 'relative', height: 'calc(100vh - 300px)', width: '100%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          marginLeft: '24px', marginRight: '24px', marginBottom: '16px',
          border: '1px solid #e1e6ef', borderRadius: '4px', overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
          <AgGridReact<ReconcilingItem>
            key={recItemsFilter ?? 'all'}
            rowData={filteredRows}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            theme={gridTheme}
            rowHeight={44}
            headerHeight={36}
            groupHeaderHeight={28}
            floatingFiltersHeight={36}
            suppressRowClickSelection
            suppressMovableColumns={false}
            animateRows
            getRowStyle={getRowStyle}
            onCellClicked={(e) => {
              if (e.colDef.field === 'accountNumber' && e.value) {
                applyAcctFilter([String(e.value)]);
              }
            }}
          />
          </div>
          {/* Sidebar */}
          <div style={{ width: '37px', flexShrink: 0, background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
            <button style={{ width: 36, height: 123, background: 'transparent', border: 'none', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: 0 }}>
              <Columns3 size={12} color="#424867" style={{ transform: 'rotate(90deg)' }} />
              <span style={{ fontSize: '12px', color: '#424867', writingMode: 'vertical-rl' as const, letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Columns</span>
            </button>
            <button style={{ width: 36, height: 109, background: 'transparent', border: 'none', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: 0 }}>
              <Filter size={12} color="#424867" />
              <span style={{ fontSize: '12px', color: '#424867', writingMode: 'vertical-rl' as const, letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
