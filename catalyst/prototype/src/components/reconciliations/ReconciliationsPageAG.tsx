import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Filter, RefreshCw, ChevronDown, MoreVertical, Calendar, Rows3, AlertTriangle, MessageSquarePlus, Paperclip, Settings, X, Pencil, Trash2, Plus, Columns3 } from 'lucide-react';
import { AgGridReact } from '@ag-grid-community/react';
import type { ColDef, ICellRendererParams, GridApi } from '@ag-grid-community/core';
import { themeQuartz } from '@ag-grid-community/theming';
import { useNavigation } from '@/contexts/NavigationContext';
import { fetchMockRecs, fetchPeople } from '@/data/mockRecs';
import type { RecRow, Person } from '@/data/mockRecs';
import { MOCK_RECONCILING_ITEMS } from '@/data/mockReconcilingItems';

// ---------------------------------------------------------------------------
// Cell Renderers
// ---------------------------------------------------------------------------

const TRUNC: React.CSSProperties = { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%' };

// Plain text cell with truncation
function TextCell({ value }: ICellRendererParams<RecRow>) {
  return (
    <div style={{ ...TRUNC, color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{value ?? ''}</div>
  );
}

// Shared count pill
const CountPill = ({ count, bg }: { count: number; bg: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    height: '16px', minWidth: '20px', padding: '0 4px',
    background: bg, borderRadius: '9999px',
    color: '#ffffff', fontSize: '11px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
    flexShrink: 0,
  }}>
    {count}
  </span>
);

// Renderer 1a — Neutral badge with label + count (Tags, BlockedBy, Blocks, AccountBalanceFilters)
function NeutralBadgeRenderer({ value, colDef }: ICellRendererParams<RecRow>) {
  const count = parseInt(value, 10);
  if (!count || isNaN(count)) return <span />;
  const label = colDef?.headerName ?? '';
  const isBlockedBy = colDef?.field === 'blockedBy';
  return (
    <div style={{ ...TRUNC, display: 'flex', alignItems: 'center', gap: '6px' }}>
      {isBlockedBy && <AlertTriangle size={14} fill="#f59e0b" stroke="#f59e0b" strokeWidth={0} style={{ flexShrink: 0 }} />}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        height: '24px', padding: '2px 6px',
        background: '#f1f3f9', borderRadius: '4px',
        color: '#6b7280', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {label}
        <CountPill count={count} bg="#424867" />
      </span>
    </div>
  );
}

// Renderer 1b — Info badge with label + count (Controls)
function InfoCountBadgeRenderer({ value, colDef }: ICellRendererParams<RecRow>) {
  const count = parseInt(value, 10);
  if (!count || isNaN(count)) return <span />;
  const label = colDef?.headerName ?? '';
  return (
    <div style={TRUNC}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        height: '24px', padding: '2px 6px',
        background: '#f0f5ff', borderRadius: '4px',
        color: '#3d7bf7', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {label}
        <CountPill count={count} bg="#3d7bf7" />
      </span>
    </div>
  );
}

// Renderer 2 — Info badge label only (Daily Rec, AutoRec Type)
function InfoBadgeRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!value) return <span />;
  return (
    <div style={TRUNC}>
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        height: '24px', padding: '2px 6px',
        background: '#f0f5ff', borderRadius: '4px',
        color: '#3d7bf7', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
    </div>
  );
}


// Renderer — Clickable account cell
function AccountCellRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!value) return <span />;
  return (
    <div style={{ ...TRUNC, cursor: 'pointer' }}>
      <span style={{ textDecoration: 'underline', color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

// Renderer — Underlined text link (shows actual value)
function TextLinkRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!value) return <span />;
  return (
    <div style={TRUNC}>
      <span style={{
        textDecoration: 'underline', color: '#424867',
        fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
      }}>
        {value}
      </span>
    </div>
  );
}

// Renderer 3 — GL Transactions link
function GLTransactionsRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!value) return <span />;
  return (
    <div style={TRUNC}>
      <span style={{
        textDecoration: 'underline', color: '#424867',
        fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
      }}>
        View Transactions
      </span>
    </div>
  );
}

// Helper — check if value is a valid currency string (not "Missing" or empty)
function isCurrencyValue(val: unknown): boolean {
  if (!val || typeof val !== 'string') return false;
  return /^[$(\d-]/.test(val.trim());
}

// Renderer 4a — Currency column (perGlTotal, reconciledBalance)
function CurrencyRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!isCurrencyValue(value)) return <span />;
  return (
    <div style={{ ...TRUNC, textAlign: 'right' }}>
      <span style={{ color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

// Accounts that have at least one "Needs Correction" item
const ACCOUNTS_WITH_ISSUES = new Set(
  MOCK_RECONCILING_ITEMS
    .filter(r => r.status === 'Needs Correction')
    .map(r => r.accountNumber)
);

// Renderer 4c — Reconciling Items column with optional warning badge
function RecItemsRenderer({ value, data }: ICellRendererParams<RecRow>) {
  if (!isCurrencyValue(value)) return <span />;
  const accountNum = data?.account?.split(' ')[0] ?? '';
  const hasIssue = ACCOUNTS_WITH_ISSUES.has(accountNum);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', width: '100%' }}>
      {hasIssue && (
        <AlertTriangle
          size={18}
          fill="#db7712"
          stroke="white"
          strokeWidth={2}
          aria-label="Some reconciling items need correction"
          style={{ flexShrink: 0, cursor: 'default' }}
        />
      )}
      <span style={{ color: '#424867', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

// Renderer 4b — Difference column with color coding
function DifferenceRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!isCurrencyValue(value)) return <span />;
  const raw = String(value).replace(/[$,()]/g, '');
  const isNegative = String(value).includes('(') || parseFloat(raw) < 0;
  const num = parseFloat(raw);
  let color = '#424867';
  if (num === 0) color = '#1fac76';
  else if (isNegative) color = '#ef4444';
  return (
    <div style={{ ...TRUNC, textAlign: 'right' }}>
      <span style={{ color, fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

// Renderer 5a — Person avatar + name (looks up person ID in peopleMap)
function PersonRenderer({ value, peopleMap }: ICellRendererParams<RecRow> & { peopleMap: Map<string, Person> }) {
  if (!value) return <span />;
  const key = String(value).trim();
  const person = peopleMap.get(key);
  if (!person) {
    // Fallback: show the raw value as text so it's not blank
    return <div style={{ ...TRUNC, fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#424867' }}>{key}</div>;
  }
  return (
    <div style={{ ...TRUNC, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img
        src={person.avatarUrl}
        alt={person.name}
        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
      <span style={{
        fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#424867',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {person.name}
      </span>
    </div>
  );
}

// Renderer 5b — Toggle (Sign-off columns)
function ToggleRenderer({ value }: ICellRendererParams<RecRow>) {
  const on = !!value;
  return (
    <div style={{ ...TRUNC, display: 'flex', alignItems: 'center' }}>
      <div style={{
        position: 'relative', width: '40px', height: '20px', borderRadius: '9999px',
        backgroundColor: on ? '#1a7b4b' : '#d1d5db', flexShrink: 0, transition: 'background-color 0.15s',
      }}>
        <div style={{
          position: 'absolute', top: '2px',
          left: on ? '22px' : '2px',
          width: '16px', height: '16px', borderRadius: '9999px',
          backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          transition: 'left 0.15s',
        }} />
      </div>
    </div>
  );
}

// Renderer 5c — Date text (Due Date columns)
function DateRenderer({ value }: ICellRendererParams<RecRow>) {
  if (!value) return <span />;
  return (
    <div style={TRUNC}>
      <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#424867' }}>
        {value}
      </span>
    </div>
  );
}

// Renderer 6 — Actions column (4 icon buttons)
const ACTION_ICON_STYLE: React.CSSProperties = {
  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', border: 'none', background: 'transparent', color: '#6B7280', padding: 0, flexShrink: 0,
};

function ActionsCellRenderer({ data, onSettingsClick }: ICellRendererParams<RecRow> & { onSettingsClick: (row: RecRow) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
      <button style={ACTION_ICON_STYLE} className="action-icon-btn"><MessageSquarePlus size={16} /></button>
      <button style={ACTION_ICON_STYLE} className="action-icon-btn"><Paperclip size={16} /></button>
      <button style={ACTION_ICON_STYLE} className="action-icon-btn" onClick={() => data && onSettingsClick(data)}><Settings size={16} /></button>
      <button style={ACTION_ICON_STYLE} className="action-icon-btn"><MoreVertical size={16} /></button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidedrawer — exact port from playspace/recs-with-translation/index.html
// ---------------------------------------------------------------------------

// Shared icon button (36×36, round, hover bg)
const SDIconBtn = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50px', cursor: 'pointer', border: 'none', background: 'transparent',
      padding: 0, flexShrink: 0, transition: 'background 0.1s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    {children}
  </button>
);

// Dropdown (read-only, 40px tall by default)
const SDDropdown = ({ value, placeholder, height, borderColor }: { value: string; placeholder?: string; height?: number; borderColor?: string }) => (
  <div style={{
    background: '#fff', border: `1px solid ${borderColor || '#cbd2e1'}`, borderRadius: '6px',
    height: height || 40, padding: '0 8px', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer',
  }}>
    <span style={{
      flex: 1, minWidth: 0, fontSize: '12px', fontWeight: 500,
      color: value ? '#1d2433' : '#424867',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    }}>
      {value || placeholder || 'Select...'}
    </span>
    <ChevronDown size={20} color="#6b7280" style={{ flexShrink: 0 }} />
  </div>
);

// Static input (read-only, 40px tall by default)
const SDInput = ({ value, height }: { value: string; height?: number }) => (
  <div style={{
    background: '#fff', border: '1px solid #e1e6ef', borderRadius: '6px',
    height: height || 40, padding: '0 8px', display: 'flex', alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  }}>
    <span style={{ fontSize: '12px', color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>{value}</span>
  </div>
);

// Label with optional required dot
const SDLabel = ({ label, required, plain }: { label: string; required?: boolean; plain?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '20px', marginBottom: '4px' }}>
    {required && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D24747', flexShrink: 0 }} />}
    <label style={{ fontSize: '12px', fontWeight: 500, lineHeight: '18px', color: plain ? '#424867' : '#1d2433', fontFamily: 'Inter, sans-serif' }}>{label}</label>
  </div>
);

// Section header with optional Edit button
const SDSectionHeader = ({ title, showEdit }: { title: string; showEdit?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '20px', marginBottom: '4px' }}>
    <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: '#1d2433', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    {showEdit && (
      <span style={{
        fontSize: '11px', fontWeight: 700, color: '#6b7280',
        fontFamily: "'Museo Sans', sans-serif", padding: '6px', borderRadius: '6px',
        cursor: 'pointer', lineHeight: '14px',
      }}>
        Edit
      </span>
    )}
  </div>
);

// Rec Detail Slideout — exact match of playspace/recs-with-translation sidedrawer
function RecDetailSlideout({ rec, onClose }: { rec: RecRow | null; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 999,
          opacity: rec ? 1 : 0, pointerEvents: rec ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px',
        zIndex: 1000, background: '#ffffff',
        borderLeft: '1px solid #e1e6ef',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
        transform: rec ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '24px 24px 20px', flexShrink: 0,
        }}>
          <h2 style={{
            flex: 1, fontFamily: "'Museo Sans', sans-serif", fontWeight: 700,
            fontSize: '16px', lineHeight: '20px', color: '#000', margin: 0,
          }}>
            {rec?.entity || 'Reconciliation'}
          </h2>
          <SDIconBtn onClick={onClose}>
            <X size={20} color="#6b7280" />
          </SDIconBtn>
        </div>

        {/* Body — scrollable */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '0 24px 160px',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          {rec && (
            <>
              {/* Folder */}
              <div>
                <SDLabel label="Folder" required />
                <SDDropdown value={rec.folder} />
              </div>

              {/* Account */}
              <div>
                <SDLabel label="Account" required />
                <SDDropdown value={rec.account} />
              </div>

              {/* Account Balance Filters */}
              <div>
                <SDLabel label="Account Balance Filters" plain />
                <div style={{ border: '1px solid #e1e6ef', borderRadius: '6px', overflow: 'visible' }}>
                  <div style={{ padding: '12px', display: 'flex', alignItems: 'flex-start' }}>
                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#1d2433', lineHeight: '16px', fontFamily: 'Inter, sans-serif' }}>
                        {rec.account}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(29,36,51,0.65)', lineHeight: '16px', fontFamily: 'Inter, sans-serif' }}>
                        <b style={{ fontWeight: 600 }}>Company:</b> {rec.entity}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(29,36,51,0.65)', lineHeight: '16px', fontFamily: 'Inter, sans-serif' }}>
                        <b style={{ fontWeight: 600 }}>Bank Account:</b> (No Value)
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(29,36,51,0.65)', lineHeight: '16px', fontFamily: 'Inter, sans-serif' }}>
                        <b style={{ fontWeight: 600 }}>Book Code:</b> Book Code A
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(29,36,51,0.65)', lineHeight: '16px', fontFamily: 'Inter, sans-serif' }}>
                        <b style={{ fontWeight: 600 }}>Target Company:</b> None
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '2px', paddingTop: '2px', paddingLeft: '12px', flexShrink: 0 }}>
                      <SDIconBtn><Pencil size={18} color="#9ca3af" /></SDIconBtn>
                      <SDIconBtn><MoreVertical size={18} color="#9ca3af" /></SDIconBtn>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <SDLabel label="Frequency" required />
                <SDDropdown value="Monthly" />
              </div>

              {/* Assignees */}
              <div>
                <SDSectionHeader title="Assignees" />
                <div style={{
                  border: '1px solid #e1e6ef', borderRadius: '4px', padding: '12px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}>
                  {/* Assignee row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Top: Assignee + Role + Delete */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {/* Assignee dropdown */}
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '4px' }}>Assignee</label>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              background: '#fff', border: '1px solid #cbd2e1', borderRadius: '6px',
                              height: '36px', padding: '0 8px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer',
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                                background: 'linear-gradient(180deg, #1c895f, #167a53)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff' }}>P</span>
                              </div>
                              <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>Sean Bean</span>
                              <ChevronDown size={16} color="#6b7280" />
                            </div>
                          </div>
                          {/* Role dropdown */}
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '4px' }}>Role</label>
                            <SDDropdown value="Monthly Reviewer" height={36} />
                          </div>
                        </div>
                      </div>
                      {/* Delete button */}
                      <div style={{ paddingTop: '20px' }}>
                        <SDIconBtn>
                          <Trash2 size={18} color="#9ca3af" />
                        </SDIconBtn>
                      </div>
                    </div>
                    {/* Bottom: Due type + Day # + Estimated Time */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                          <SDDropdown value="Business Day" height={36} />
                        </div>
                        <div style={{ width: '44px' }}>
                          <SDInput value="15" height={36} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '11px', fontWeight: 500, color: '#6b7280', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '4px' }}>Estimated Time</label>
                        <SDInput value="05h 45m" height={36} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* + Add Assignee */}
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    padding: '6px 4px', marginTop: '8px', borderRadius: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Plus size={18} color="#6b7280" />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Add Assignee</span>
                </button>
              </div>

              {/* General Settings */}
              <div>
                <SDSectionHeader title="General Settings" showEdit />
                <div style={{
                  border: '1px solid #e1e6ef', borderRadius: '4px', padding: '8px',
                  display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', lineHeight: '18px',
                }}>
                  {[
                    ['Currency:', 'USD'],
                    ['Rec Type:', 'AutoRec Disabled'],
                    ['Fixed Balance:', 'NA'],
                    ['Threshold:', '$100.00'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'rgba(29,36,51,0.9)', maxWidth: '88px', flexShrink: 0, whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>{k}</span>
                      <span style={{ fontWeight: 400, color: '#1d2433', fontFamily: 'Inter, sans-serif' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div>
                <SDLabel label="Controls" plain />
                <SDDropdown value="" placeholder="Select Controls" borderColor="#e1e6ef" />
              </div>

              {/* Tags */}
              <div>
                <SDLabel label="Tags" plain />
                <SDDropdown value="" placeholder="Select Tags" borderColor="#e1e6ef" />
              </div>
            </>
          )}
        </div>

        {/* Footer — matches prototype: bg-[#f8fafc], Museo Sans buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px',
          padding: '0 16px', height: '72px', flexShrink: 0,
          background: '#f8fafc',
        }}>
          <button
            onClick={onClose}
            style={{
              height: '40px', padding: '0 12px', borderRadius: '6px',
              border: 'none', background: 'transparent',
              fontSize: '12px', fontWeight: 700, color: '#6b7280',
              fontFamily: "'Museo Sans', sans-serif", cursor: 'pointer',
              letterSpacing: '-0.12px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button style={{
            height: '40px', padding: '0 12px', borderRadius: '6px',
            border: 'none', background: 'rgba(28,137,95,0.3)', color: '#fff',
            fontSize: '12px', fontWeight: 700, fontFamily: "'Museo Sans', sans-serif",
            cursor: 'default', letterSpacing: '-0.12px',
          }}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Theme — themeQuartz.withParams() exclusively, no CSS injection
// ---------------------------------------------------------------------------
const recsGridTheme = themeQuartz.withParams({
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  oddRowBackgroundColor: '#f8fafc',
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
  wrapperBorderRadius: '4px 0 0 4px',
  spacing: '4px',
});


// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ReconciliationsPageAG() {
  const [rowData, setRowData] = useState<RecRow[]>([]);
  const [peopleMap, setPeopleMap] = useState<Map<string, Person>>(new Map());
  const [selectedRec, setSelectedRec] = useState<RecRow | null>(null);

  const { navigateToRecItems } = useNavigation();
  const gridApiRef = useRef<GridApi<RecRow> | null>(null);
  const onSettingsClick = useCallback((row: RecRow) => setSelectedRec(row), []);

  useEffect(() => {
    Promise.all([fetchMockRecs(), fetchPeople()]).then(([rows, people]) => {
      setRowData(rows);
      setPeopleMap(people);
    });
  }, []);

  const defaultColDef = useMemo<ColDef>(() => ({
    suppressSizeToFit: true,
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: false,
    cellStyle: {
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '16px',
      paddingRight: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  }), []);

  const colDefs = useMemo<ColDef<RecRow>[]>(() => [
    { field: 'entity', headerName: 'Entity', width: 160, cellRenderer: TextCell },
    { field: 'period', headerName: 'Period', width: 144, cellRenderer: TextCell },
    { field: 'folder', headerName: 'Folder', width: 200, cellRenderer: TextCell },
    { field: 'account', headerName: 'Account', width: 190, cellRenderer: AccountCellRenderer },
    { field: 'tags', headerName: 'Tags', width: 170, cellRenderer: NeutralBadgeRenderer },
    { field: 'blockedBy', headerName: 'Blocked By', width: 180, cellRenderer: NeutralBadgeRenderer },
    { field: 'blocks', headerName: 'Blocks', width: 170, cellRenderer: NeutralBadgeRenderer },
    { field: 'controls', headerName: 'Controls', width: 170, cellRenderer: InfoCountBadgeRenderer },
    { field: 'dailyRec', headerName: 'Daily Rec', width: 170, cellRenderer: InfoBadgeRenderer },
    { field: 'autoRecType', headerName: 'AutoRec Type', width: 170, cellRenderer: TextLinkRenderer },
    { field: 'accountBalanceFilters', headerName: 'Account Balance Filters', width: 223, cellRenderer: NeutralBadgeRenderer },
    { field: 'uniqueRecId', headerName: 'Unique Reconciliation ID', width: 223, cellRenderer: TextCell },
    { field: 'perGlTotal', headerName: 'Per GL Total', width: 164, cellRenderer: CurrencyRenderer },
    { field: 'glTransactions', headerName: 'GL Transactions', width: 180, cellRenderer: GLTransactionsRenderer },
    { field: 'reconciledBalance', headerName: 'Reconciled Balance', width: 185, cellRenderer: CurrencyRenderer },
    { field: 'reconcilingItems', headerName: 'Reconciling Items', width: 180, cellRenderer: RecItemsRenderer },
    { field: 'difference', headerName: 'Difference', width: 145, cellRenderer: DifferenceRenderer },
    { field: 'preparers', headerName: 'Preparers', width: 205, cellRenderer: PersonRenderer, cellRendererParams: { peopleMap } },
    { field: 'preparerSignOff', headerName: 'Sign-off', width: 120, cellRenderer: ToggleRenderer },
    { field: 'preparerDueDate', headerName: 'Due Date', width: 150, cellRenderer: DateRenderer },
    { field: 'preparerCompleted', headerName: 'Completed', width: 278, cellRenderer: PersonRenderer, cellRendererParams: { peopleMap } },
    { field: 'reviewers', headerName: 'Reviewers', width: 200, cellRenderer: PersonRenderer, cellRendererParams: { peopleMap } },
    { field: 'reviewerSignOff', headerName: 'Sign-off', width: 120, cellRenderer: ToggleRenderer },
    { field: 'reviewerDueDate', headerName: 'Due Date', width: 150, cellRenderer: DateRenderer },
    { field: 'reviewerCompleted', headerName: 'Completed', width: 305, cellRenderer: PersonRenderer, cellRendererParams: { peopleMap } },
    { field: 'actions', headerName: 'Actions', width: 172, sortable: false, filter: false, pinned: 'right', cellRenderer: ActionsCellRenderer, cellRendererParams: { onSettingsClick } },
  ], [peopleMap, onSettingsClick]);

  return (
    <div className="h-full flex flex-col bg-white">
      <style>{`
        .ag-header-cell {
          padding-left: 16px !important;
          padding-right: 16px !important;
          border-right: none !important;
        }
        .ag-cell {
          border-right: none !important;
          padding: 12px 16px !important;
        }
        .ag-selection-checkbox {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100% !important;
        }
        .ag-cell.ag-selection-checkbox-cell {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .ag-header-cell.ag-header-cell-auto-height .ag-header-cell-comp-wrapper {
          align-items: center !important;
        }
        .action-icon-btn:hover {
          background: color-mix(in srgb, transparent, #2196f3 8%) !important;
        }
      `}</style>
      {/* Sub-navigation tabs */}
      <div className="border-b border-[#e4e7ec] px-6 flex items-center gap-0 h-[44px]">
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

      {/* Toolbar — dropdowns */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-[#e4e7ec] h-[56px]">
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-1 text-[13px] text-[#424867] font-['Inter',sans-serif] cursor-pointer hover:bg-[#f9fafb]">
          All Entities <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-1 text-[13px] text-[#424867] font-['Inter',sans-serif] cursor-pointer hover:bg-[#f9fafb]">
          <Calendar className="size-4 text-[#6b7280]" /> By Period <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
        <div className="border border-[#e1e6ef] rounded-[6px] h-9 px-3 flex items-center gap-1 text-[13px] text-[#424867] font-['Inter',sans-serif] cursor-pointer hover:bg-[#f9fafb]">
          <Calendar className="size-4 text-[#6b7280]" /> March 2025 <ChevronDown className="size-4 text-[#6b7280]" />
        </div>
      </div>

      {/* Page header */}
      <div className="bg-white flex items-center justify-between" style={{ padding: '16px 24px' }}>
        {/* Left — title + subtitle */}
        <div className="flex flex-col">
          <h1 style={{
            fontFamily: "'Museo Sans', sans-serif",
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '32px',
            color: '#000000',
          }}>
            Reconciliations
          </h1>
          <span style={{
            fontFamily: "'Museo Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: '16px',
            color: '#adb2bb',
          }}>
            {rowData.length}/{rowData.length}
          </span>
        </div>

        {/* Right — button row (matches live FloQast app) */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* 1. Filter */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            <Filter className="size-4" /> Filter
          </button>

          {/* 2. Refresh */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            <RefreshCw className="size-4" /> Refresh
          </button>

          {/* 3. Collapse All */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            <Rows3 className="size-4" /> Collapse All
          </button>

          {/* 4. AutoRec Bulk Matching */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            AutoRec Bulk Matching
          </button>

          {/* 5. Currency: Functional */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            Currency: Functional <ChevronDown className="size-4" />
          </button>

          {/* 6. Completeness */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            Completeness <ChevronDown className="size-4" />
          </button>

          {/* 7. Update Font */}
          <button
            className="flex items-center hover:bg-[#f9fafb] transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            Update Font <ChevronDown className="size-4" />
          </button>

          {/* 8. Add (primary) */}
          <button
            className="flex items-center transition-colors"
            style={{
              height: '40px',
              padding: '0 12px',
              gap: '6px',
              borderRadius: '6px',
              fontFamily: "'Museo Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: '#1fac76',
            }}
          >
            + Add <ChevronDown className="size-4" />
          </button>

          {/* 9. ⋮ icon button */}
          <button
            className="flex items-center justify-center hover:bg-[#f9fafb] transition-colors"
            style={{
              width: '40px',
              height: '40px',
              border: '1.4px solid #cbd2e1',
              borderRadius: '6px',
            }}
          >
            <MoreVertical className="size-4 text-[#6b7280]" />
          </button>
        </div>
      </div>

      {/* AG Grid + sidebar placeholder */}
      <div className="flex-1 px-6 pb-4" style={{ position: 'relative', height: 'calc(100vh - 220px)', width: '100%' }}>
        <div style={{
          position: 'absolute', inset: 0, marginLeft: '24px', marginRight: '24px', marginBottom: '16px',
          display: 'flex', border: '1px solid #e1e6ef', borderRadius: '4px', overflow: 'hidden',
        }}>
          <div
            style={{ flex: 1, minWidth: 0 }}
            onClick={(e) => {
              const cell = (e.target as HTMLElement).closest('[col-id="account"]');
              if (!cell || !gridApiRef.current) return;
              const row = cell.closest('[row-index]');
              const rowIndex = row ? parseInt(row.getAttribute('row-index') ?? '-1', 10) : -1;
              if (rowIndex < 0) return;
              const node = gridApiRef.current.getDisplayedRowAtIndex(rowIndex);
              const account = node?.data?.account;
              if (account) navigateToRecItems(String(account).split(' ')[0]);
            }}
          >
            <AgGridReact<RecRow>
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              theme={recsGridTheme}
              rowHeight={48}
              headerHeight={48}
              rowSelection={{ mode: 'multiRow' }}
              suppressRowClickSelection
              suppressMovableColumns={false}
              onGridReady={(p) => { gridApiRef.current = p.api; }}
            />
          </div>
          {/* Fake sidebar — visual placeholder for Enterprise tool panel */}
          <div style={{
            width: '37px', flexShrink: 0,
            background: '#F8FAFC',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: '4px', gap: 0,
          }}>
          <button style={{
            width: 36, height: 123, background: 'transparent', border: 'none', cursor: 'default',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: 0,
          }}>
            <Columns3 size={12} color="#424867" style={{ transform: 'rotate(90deg)' }} />
            <span style={{
              fontSize: '12px', color: '#424867', writingMode: 'vertical-rl' as const,
              transform: 'rotate(180deg)', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}>
              Columns
            </span>
          </button>
          <button style={{
            width: 36, height: 109, background: 'transparent', border: 'none', cursor: 'default',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: 0,
          }}>
            <Filter size={12} color="#424867" />
            <span style={{
              fontSize: '12px', color: '#424867', writingMode: 'vertical-rl' as const,
              transform: 'rotate(180deg)', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}>
              Filters
            </span>
          </button>
          </div>
        </div>
      </div>

      {/* Rec Detail Slideout */}
      <RecDetailSlideout rec={selectedRec} onClose={() => setSelectedRec(null)} />
    </div>
  );
}
