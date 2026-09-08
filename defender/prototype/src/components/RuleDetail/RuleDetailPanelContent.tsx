import { useState, useEffect } from 'react';
import type { Rule, Group } from '../../types';
import Button from '@floqastinc/flow-ui_core/Button';
import Modal from '@floqastinc/flow-ui_core/Modal';
import Input from '@floqastinc/flow-ui_core/Input';
import TextArea from '@floqastinc/flow-ui_core/TextArea';
import Divider from '@floqastinc/flow-ui_core/Divider';
import Select from '@floqastinc/flow-ui_core/Select';
import Avatar from '@floqastinc/flow-ui_core/Avatar';
import Schedule from '@floqastinc/flow-ui_icons/material/Schedule';
import Close from '@floqastinc/flow-ui_icons/material/Close';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import KeyboardArrowDown from '@floqastinc/flow-ui_icons/material/KeyboardArrowDown';
import CalendarToday from '@floqastinc/flow-ui_icons/material/CalendarToday';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import GroupBuilder from '../RuleBuilder/GroupBuilder';
import { parseNaturalLanguageRule } from '../../utils/rule-parser';

/* ── Design tokens (from Figma get_variable_defs) ──────────────────────── */
const tok = {
  bodyText: 'var(--flo-sem-color-text-default, #1d2433)',
  bodySecondary: 'var(--flo-sem-color-text-secondary, #424867)',
  muted: 'var(--flo-sem-color-text-tertiary, #adb2bb)',
  headerText: 'var(--flo-sem-color-text-default, #000000)',
  dangerPrimary: 'var(--flo-sem-color-danger, #d24747)',
  warningPrimary: 'var(--flo-sem-color-warning, #db7712)',
  successText: 'var(--flo-sem-color-success, #1fac76)',
  successBg: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)',
  border: 'var(--flo-sem-color-border-default, #e1e6ef)',
  neutralBadgeBg: 'var(--flo-sem-color-surface-secondary, #f1f3f9)',
  neutralBadgeText: 'var(--flo-sem-color-text-secondary, #6b7280)',
  white: 'var(--flo-sem-color-surface-default, #ffffff)',
  iconDefault: 'var(--flo-sem-color-text-secondary, #6b7280)',
  aiIcon: 'var(--flo-sem-color-success, #1fac76)',  // Green per Tyler Davis DS standardization
  aiBg: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)',
};

/* ── Helpers (built from probe data) ───────────────────────────────────── */

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Avatar — uses FlowUI Avatar with fallback for initials, sparkle for AI */
function AvatarCircle({ name }: { name: string }) {
  const isAI = name === 'Dynamic Assignment';
  if (isAI) {
    return <Avatar size="sm" icon={<AutoAwesome size={14} />} />;
  }
  return <Avatar size="sm" fallback={getInitials(name)} />;
}

/** Section header: H5 text + 1px divider (from Body / Section-header, gap 4) */
function SectionHeader({ children, noDivider }: { children: string; noDivider?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <h3 style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 16, lineHeight: '20px', color: tok.headerText, margin: 0 }}>
        {children}
      </h3>
      {!noDivider && <div style={{ height: 1, background: tok.border }} />}
    </div>
  );
}

/** Field label: Inter Medium 12px/16px #424867 */
function FieldLabel({ children }: { children: string }) {
  return <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: tok.bodySecondary, margin: '0 0 2px 0' }}>{children}</p>;
}

/** Field value: Inter Semi Bold 12px/18px #1d2433 (probe confirms Semi Bold) */
function FieldValue({ children, color }: { children: React.ReactNode; color?: string }) {
  return <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '18px', color: color || tok.bodyText, margin: 0 }}>{children}</p>;
}

/** Severity slider: 650px wide, green #1fac76, 5 discrete ticks */
function SeveritySlider({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const clamped = Math.max(1, Math.min(5, value));
  const pct = ((clamped - 1) / 4) * 100;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ position: 'relative', height: 8, borderRadius: 4, background: tok.border }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 4, width: `${pct}%`, background: tok.successText }} />
        {[0, 25, 50, 75, 100].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: `${p}%`, transform: 'translate(-50%, -50%)',
            width: i + 1 === clamped ? 16 : 10, height: i + 1 === clamped ? 16 : 10,
            borderRadius: '50%', background: p <= pct ? tok.successText : tok.border,
            border: i + 1 === clamped ? '2px solid white' : 'none',
            boxShadow: i + 1 === clamped ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} onClick={() => onChange?.(n)} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: n === clamped ? 600 : 400, color: n === clamped ? tok.bodyText : tok.muted, cursor: onChange ? 'pointer' : 'default' }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

/* styledSelect removed — now using FlowUI Select component */

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function RuleDetailPanelContent({
  rule, isEditMode, onEditClick, onCancelEdit, onShowAnomalies, onSave, onClose, onDuplicate, onDeactivate,
}: {
  rule: Rule; isEditMode: boolean; onEditClick: () => void; onCancelEdit: () => void;
  onShowAnomalies: () => void; onSave: (rule: Partial<Rule> & { id: string }) => void; onClose: () => void;
  onDuplicate?: () => void; onDeactivate?: () => void;
}) {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const [viewingOldVersion, setViewingOldVersion] = useState(false);
  // Edit mode state for conditions, severity, AI, and save modal
  const [rootGroup, setRootGroup] = useState<Group | null>(rule.logic || null);
  const [editSeverity, setEditSeverity] = useState(rule.severity ? Math.min(5, Math.max(1, Math.ceil(rule.severity * 5 / 9))) : 3);
  const [nlInput, setNlInput] = useState('');
  const [nlError, setNlError] = useState('');
  const [nlAccordionOpen, setNlAccordionOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [applyHistorical, setApplyHistorical] = useState(false);
  const [historicalFrom, setHistoricalFrom] = useState('');
  const [preparers, setPreparers] = useState<string[]>(['Dynamic Assignment']);
  const [reviewers, setReviewers] = useState<string[]>(['Dynamic Assignment']);
  const [ruleOwner, setRuleOwner] = useState<string>('Current User');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [activityLogOpen, setActivityLogOpen] = useState(false);

  useEffect(() => {
    setRuleName(rule.name);
    setDescription(rule.description || '');
    setPreparers(rule.preparers || ['Dynamic Assignment']);
    setReviewers(rule.reviewers || ['Dynamic Assignment']);
    setRuleOwner(rule.ruleOwner);
    setStatus(rule.status);
    setActivityLogOpen(false);
    setRootGroup(rule.logic || null);
    setEditSeverity(rule.severity ? Math.min(5, Math.max(1, Math.ceil(rule.severity * 5 / 9))) : 3);
    setNlInput('');
    setNlError('');
    setNlAccordionOpen(false);
    // Don't reset showSaveModal here — it's handled by handleConfirmSave/handleSave
    // Resetting it in useEffect caused a double-close that triggered focus issues in flexlayout
  }, [rule]);

  const handleSave = () => { setShowSaveModal(true); };
  const handleConfirmSave = () => {
    setShowSaveModal(false);
    onSave({ id: rule.id, name: ruleName, description, preparers, reviewers, ruleOwner, status, logic: rootGroup || undefined, severity: editSeverity });
  };
  const handleGenerateLogic = () => {
    if (!nlInput.trim()) return;
    try {
      const result = parseNaturalLanguageRule(nlInput);
      if (result.logic) {
        setRootGroup(result.logic);
        setNlError('');
        setNlAccordionOpen(false);
      }
    } catch (e: any) {
      setNlError(e.message || 'Could not parse the rule description. Try being more specific.');
    }
  };
  const users = ['Dynamic Assignment', 'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Martinez'];

  // Mock metric breakdown
  const total = rule.totalCount || 3;
  const open = Math.max(1, Math.ceil((rule.unresolvedCount || 2) * 0.5));
  const investigating = Math.max(1, (rule.unresolvedCount || 2) - open);
  const resolved = Math.max(1, total - open - investigating);
  const severity = rule.severity ? Math.min(5, Math.max(1, Math.ceil(rule.severity * 5 / 9))) : 3;

  return (
    <div className="h-full flex flex-col" style={{ background: tok.white }}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '12px 16px', borderBottom: `1px solid ${tok.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 16, lineHeight: '20px', color: tok.bodyText, margin: 0 }}>
            {rule.name}
          </h2>
          {!isEditMode && (rule.version || 1) > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setVersionDropdownOpen(v => !v)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 8px',
                  borderRadius: 4, background: tok.neutralBadgeBg, color: tok.neutralBadgeText,
                  border: 'none', cursor: (rule.version || 1) > 1 ? 'pointer' : 'default',
                }}
              >
                Version {viewingOldVersion ? '1 (read-only)' : (rule.version || 1)}
                {(rule.version || 1) > 1 && <span style={{ fontSize: 8 }}>▼</span>}
              </button>
              {versionDropdownOpen && (rule.version || 1) > 1 && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setVersionDropdownOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 50, marginTop: 4,
                    width: 160, background: '#fff', border: `1px solid ${tok.border}`, borderRadius: 6,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '4px 0',
                  }}>
                    {Array.from({ length: rule.version || 1 }, (_, i) => i + 1).reverse().map(v => (
                      <button key={v} onClick={() => {
                        setVersionDropdownOpen(false);
                        setViewingOldVersion(v < (rule.version || 1));
                      }}
                        style={{
                          width: '100%', padding: '6px 12px', border: 'none', background: 'none',
                          cursor: 'pointer', textAlign: 'left', fontSize: 11, fontFamily: 'Inter, sans-serif',
                          color: v === (rule.version || 1) ? tok.successText : tok.bodyText,
                          fontWeight: v === (rule.version || 1) ? 600 : 400,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        Version {v} {v === (rule.version || 1) ? '(current)' : ''}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {!isEditMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Kebab menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setHeaderMenuOpen(v => !v)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}
              >
                <span style={{ fontSize: 16, color: tok.iconDefault }}>&#8942;</span>
              </button>
              {headerMenuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setHeaderMenuOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200,
                    background: '#fff', border: `1px solid ${tok.border}`, borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '4px 0',
                    fontFamily: 'Inter, sans-serif', fontSize: 12,
                  }}>
                    {rule.status !== 'Deactivated' && (
                      <button onClick={() => { setHeaderMenuOpen(false); onEditClick(); }}
                        style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', color: tok.bodyText }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >Edit Rule</button>
                    )}
                    {onDuplicate && (
                      <button onClick={() => { setHeaderMenuOpen(false); onDuplicate(); }}
                        style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', color: tok.bodyText }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >Duplicate Rule</button>
                    )}
                    {onDeactivate && (
                      <button onClick={() => { setHeaderMenuOpen(false); onDeactivate(); }}
                        style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', color: rule.status === 'Deactivated' ? tok.successText : tok.dangerPrimary }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--flo-sem-color-surface-secondary, #f8fafc)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >{rule.status === 'Deactivated' ? 'Reactivate Rule' : 'Deactivate Rule'}</button>
                    )}
                  </div>
                </>
              )}
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
              <Close size={20} color={tok.iconDefault} />
            </button>
          </div>
        )}
      </div>
      {/* Old version banner */}
      {viewingOldVersion && !isEditMode && (
        <div style={{
          padding: '8px 16px', background: 'var(--flo-sem-color-surface-info-subtle, #f0f5ff)', borderBottom: `1px solid ${tok.border}`,
          fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--flo-sem-color-info-emphasis, #1e40af)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> You are viewing an older version of this rule. This version is read-only.
          </div>
          <button onClick={() => setViewingOldVersion(false)} style={{
            border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-info-emphasis, #1e40af)',
          }}>View Current Version</button>
        </div>
      )}
      {/* Deactivated banner */}
      {rule.status === 'Deactivated' && !isEditMode && !viewingOldVersion && (
        <div style={{
          padding: '8px 16px', background: 'var(--flo-sem-color-surface-warning-subtle, #fff8eb)', borderBottom: `1px solid ${tok.border}`,
          fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--flo-sem-color-warning-emphasis, #92400e)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>⚠</span> This rule is deactivated and no longer running against transactions.
        </div>
      )}

      {/* ── Scrollable Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!isEditMode ? (
          <>
            {/* ── 1. Metric Cards (probe: Metrics v2, HORIZONTAL gap 24) ── */}
            <div style={{ display: 'flex', gap: 24, padding: 16 }}>
              {/* Anomalies Card — 265px fixed, border 1px #e1e6ef, radius 6, pad 16 */}
              <div style={{ width: 265, flexShrink: 0, border: `1px solid ${tok.border}`, borderRadius: 6, padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: tok.bodySecondary, margin: 0 }}>Total Anomalies</p>
                  <p style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 32, lineHeight: '40px', color: tok.headerText, margin: 0 }}>{total}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: tok.dangerPrimary }}>↘</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, lineHeight: '14px', color: tok.dangerPrimary }}>-10% from prior period</span>
                  </div>
                </div>
              </div>
              {/* Anomalies Breakdown — flex, border 1px #e1e6ef, radius 6, pad 16 */}
              <div style={{ flex: 1, border: `1px solid ${tok.border}`, borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: tok.bodySecondary, margin: 0 }}>Current Status</p>
                <div style={{ display: 'flex', flex: 1 }}>
                  {[
                    { count: open, label: 'Open', color: tok.dangerPrimary, border: true },
                    { count: investigating, label: 'Investigating', color: tok.warningPrimary, border: true },
                    { count: resolved, label: 'Resolved', color: tok.successText, border: false },
                  ].map(({ count, label, color, border }) => (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', alignItems: 'center', borderRight: border ? `1px solid ${tok.border}` : 'none' }}>
                      <p style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 32, lineHeight: '40px', color: tok.bodyText, margin: 0 }}>{count}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color, margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sections (probe: Main Container gap 24) ──────────── */}
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ── 2. Rule Details (probe: Details frame, gap 24) ──── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <SectionHeader>Rule Details</SectionHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><FieldLabel>Name</FieldLabel><FieldValue>{rule.name}</FieldValue></div>
                  <div><FieldLabel>Description</FieldLabel><FieldValue>{rule.description || 'No description provided'}</FieldValue></div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <span style={{
                      display: 'inline-block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                      fontSize: 12, lineHeight: '16px', padding: '4px 6px', borderRadius: 4,
                      background: rule.status === 'Active' ? tok.successBg : tok.neutralBadgeBg,
                      color: rule.status === 'Active' ? tok.successText : tok.neutralBadgeText,
                    }}>{rule.status}</span>
                  </div>
                  <div><FieldLabel>FQ Rule ID</FieldLabel><FieldValue>R-{rule.id}</FieldValue></div>
                </div>
              </div>

              {/* ── 3. Rule Parameters (probe: 1336x279, gap 24) ───── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <SectionHeader>Rule Parameters</SectionHeader>
                {rule.logic && rule.logic.items.length > 0 ? (
                  <div style={{ maxWidth: 650 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '18px', color: tok.bodyText, margin: '0 0 16px 0' }}>
                      Transactions are flagged as anomalous if the following conditions are met
                    </p>
                    {/* Condition box: probe shows border 1px #e1e6ef, radius 6, pad 16 */}
                    <div style={{ border: `1px solid ${tok.border}`, borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {rule.logic.items.map(item => {
                        if (item.type !== 'condition') return null;
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '18px', color: tok.bodyText }}>
                            <span style={{ fontWeight: 600 }}>{item.field}</span>
                            <span style={{ color: tok.bodySecondary }}>{item.operator?.toLowerCase()}</span>
                            <span style={{ fontWeight: 600, fontSize: 11, padding: '2px 6px', borderRadius: 4, background: tok.successBg, color: tok.successText }}>{item.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <FieldValue color={tok.muted}>No conditions defined</FieldValue>
                )}
                {/* Severity slider: probe shows 650px wide */}
                <div style={{ maxWidth: 650 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '16px', color: tok.headerText, margin: '0 0 4px 0' }}>Severity Level</p>
                  <SeveritySlider value={severity} />
                </div>
              </div>

              {/* ── 4. Anomaly Assignees (probe: gap 24) ───────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <SectionHeader>Anomaly Assignees</SectionHeader>
                {/* Rule Owner: probe shows .Form/User search menu item, avatar 28px + gap 8 */}
                <div>
                  <FieldLabel>Rule Owner</FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <AvatarCircle name={rule.ruleOwner} />
                    <FieldValue>{rule.ruleOwner}</FieldValue>
                  </div>
                </div>
                {/* Assignees: probe shows Signature/Signoffs, gap 16, 12px internal */}
                <div>
                  <FieldLabel>Assignees</FieldLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
                    {rule.preparers?.map((name, i) => (
                      <div key={`p-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AvatarCircle name={name} />
                        <div>
                          <FieldValue>{name}</FieldValue>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 10, lineHeight: '14px', color: tok.bodySecondary, margin: 0 }}>Preparer</p>
                        </div>
                      </div>
                    ))}
                    {rule.reviewers?.map((name, i) => (
                      <div key={`r-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AvatarCircle name={name} />
                        <div>
                          <FieldValue>{name}</FieldValue>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 10, lineHeight: '14px', color: tok.bodySecondary, margin: 0 }}>Reviewer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 5. Activity Log (probe: Expand/Collapse header) ── */}
              <div>
                <div>
                  <button onClick={() => setActivityLogOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                    <KeyboardArrowDown size={24} color={tok.bodySecondary} style={{ transform: activityLogOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }} />
                    <SectionHeader noDivider>Activity Log</SectionHeader>
                  </button>
                  <div style={{ height: 1, background: tok.border, marginTop: 4 }} />
                </div>

                {activityLogOpen && (
                  <div style={{ marginTop: 24, marginLeft: 4 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, lineHeight: '14px', color: tok.muted, margin: '0 0 12px 0' }}>FQ Rule ID: R-{rule.id}</p>
                    {rule.activityLog.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 0', color: tok.muted }}>
                        <Schedule size={32} color={tok.muted} style={{ opacity: 0.4, display: 'block', margin: '0 auto 8px' }} />
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, margin: 0 }}>No activity recorded yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {rule.activityLog.slice().reverse().map((entry, index) => (
                          <div key={entry.id} style={{ position: 'relative' }}>
                            {index !== rule.activityLog.length - 1 && (
                              <div style={{ position: 'absolute', left: 11, top: 28, bottom: 0, width: 1, background: tok.border }} />
                            )}
                            <div style={{ display: 'flex', gap: 12 }}>
                              <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: tok.neutralBadgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tok.bodySecondary }} />
                              </div>
                              <div style={{ flex: 1, paddingBottom: 12 }}>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, lineHeight: '18px', color: tok.bodyText, margin: '0 0 2px 0' }}>
                                  {entry.author} {entry.action === 'created' ? 'created' : 'updated'} {rule.name}
                                  {' '}<span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: tok.neutralBadgeBg, color: tok.neutralBadgeText }}>Version {rule.activityLog.length - index}</span>
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                                  <CalendarToday size={12} color={tok.muted} />
                                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, lineHeight: '14px', color: tok.muted }}>{entry.timestamp}</span>
                                </div>
                                {entry.action === 'created' && entry.initialFields && (
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: '16px', color: tok.bodySecondary }}>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      <li><strong>Rule Details:</strong>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                          <li>Rule Name: {entry.initialFields.name}</li>
                                          <li>Rule Description: {entry.initialFields.description}</li>
                                        </ul>
                                      </li>
                                      <li><strong>Assignees:</strong>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                          <li>Rule Owner: {rule.ruleOwner}</li>
                                          <li>Preparers: {rule.preparers?.join(', ')}</li>
                                          <li>Reviewers: {rule.reviewers?.join(', ')}</li>
                                        </ul>
                                      </li>
                                      <li><strong>Rule Parameters:</strong>
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                          <li>Transactions are flagged as anomalous if the following conditions are met
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                              {rule.logic?.items.map(item => item.type === 'condition' ? <li key={item.id}>{item.field} {item.operator?.toLowerCase()} {item.value}</li> : null)}
                                            </ul>
                                          </li>
                                        </ul>
                                      </li>
                                      <li>Severity Level: {severity}</li>
                                    </ul>
                                  </div>
                                )}
                                {entry.action === 'edited' && entry.changes && (
                                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: '16px', color: tok.bodySecondary }}>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: tok.dangerPrimary }}>Previously</p>
                                    <ul style={{ margin: '0 0 8px 0', paddingLeft: 16 }}>{entry.changes.map((c, idx) => <li key={idx}>{c.field}: {c.oldValue}</li>)}</ul>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: tok.bodyText }}>Updated</p>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>{entry.changes.map((c, idx) => <li key={idx}>{c.field}: {c.newValue}</li>)}</ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ── Edit Mode (Figma node 2055:80726 — fully functional in-place edit) ── */
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Rule Details section — fields become editable */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SectionHeader>Rule Details</SectionHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ maxWidth: 400 }}>
                  <Input label="* Name" value={ruleName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleName(e.target.value)} size="sm" />
                </div>
                <div style={{ maxWidth: 400 }}>
                  <TextArea label="Description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} size="sm" />
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <span style={{
                    display: 'inline-block', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                    fontSize: 12, lineHeight: '16px', padding: '4px 6px', borderRadius: 4,
                    background: tok.successBg, color: tok.successText,
                  }}>{rule.status}</span>
                </div>
                <div><FieldLabel>FQ Rule ID</FieldLabel><FieldValue>R-{rule.id}</FieldValue></div>
              </div>
            </div>

            {/* Rule Parameters — FUNCTIONAL condition builder + AI input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SectionHeader>Rule Parameters</SectionHeader>

              {/* AI Natural Language — functional accordion */}
              <div>
                <button onClick={() => setNlAccordionOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  padding: '10px 12px', border: `1px solid ${tok.border}`, borderRadius: 6,
                  background: nlAccordionOpen ? tok.aiBg : 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText,
                }}>
                  <span>Use natural language to describe your rule <AutoAwesome size={14} color={tok.aiIcon} /></span>
                  <span style={{ color: tok.muted, transform: nlAccordionOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>›</span>
                </button>
                {nlAccordionOpen && (
                  <div style={{ padding: '12px', border: `1px solid ${tok.border}`, borderTop: 'none', borderRadius: '0 0 6px 6px', background: tok.aiBg }}>
                    <textarea value={nlInput} onChange={e => { setNlInput(e.target.value); setNlError(''); }}
                      placeholder="e.g., Flag any vendor bill over $10,000 from new vendors"
                      rows={3} style={{ width: '100%', padding: '8px 12px', border: `1px solid ${tok.border}`, borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText, outline: 'none', resize: 'none', boxSizing: 'border-box', background: tok.white }}
                    />
                    {nlError && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: tok.dangerPrimary, margin: '4px 0 0 0' }}>{nlError}</p>}
                    <div style={{ marginTop: 8 }}>
                      <Button size="sm" onClick={handleGenerateLogic} disabled={!nlInput.trim()}>Generate</Button>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: '18px', color: tok.bodyText, margin: 0 }}>
                Transactions are flagged as anomalous if the following conditions are met
              </p>

              {/* GroupBuilder — real, functional condition editor */}
              <div style={{ maxWidth: 650 }}>
                {rootGroup ? (
                  <GroupBuilder group={rootGroup} onUpdate={setRootGroup} onDelete={() => {}} depth={0} />
                ) : (
                  <div style={{ padding: 16, border: `1px dashed ${tok.border}`, borderRadius: 6, textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.muted, margin: '0 0 8px 0' }}>No conditions defined</p>
                    <Button variant="ghost" size="sm" onClick={() => setRootGroup({ id: 'g-new', type: 'group', logic: 'AND', items: [] })}>
                      <Add size={14} /> Add Condition Group
                    </Button>
                  </div>
                )}
              </div>

              {/* Severity slider — INTERACTIVE */}
              <div style={{ maxWidth: 650 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, lineHeight: '16px', color: tok.headerText, margin: '0 0 4px 0' }}>Severity Level</p>
                <SeveritySlider value={editSeverity} onChange={setEditSeverity} />
              </div>
            </div>

            {/* Anomaly Assignees — functional dropdowns with role switching */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SectionHeader>Anomaly Assignees</SectionHeader>
              <div>
                <FieldLabel>* Rule Owner</FieldLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <AvatarCircle name={ruleOwner} />
                  <div style={{ flex: 1, maxWidth: 350 }}>
                    <Select
                      options={users.filter(u => u !== 'Dynamic Assignment').map(u => ({ value: u, label: u }))}
                      value={ruleOwner}
                      onChange={(val: string) => setRuleOwner(val)}
                      disableClear
                    />
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Assignees</FieldLabel>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: tok.bodySecondary, margin: '4px 0 12px 0' }}>
                  The users listed here will be assigned to investigate and resolve the anomaly.
                </p>
                <div style={{ background: 'var(--flo-sem-color-surface-info-subtle, #e0f2fe)', borderRadius: 6, padding: '10px 12px', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--flo-sem-color-info-emphasis, #0369a1)', fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ</span>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: '16px', color: 'var(--flo-sem-color-info-emphasis, #0369a1)', margin: 0 }}>
                    Dynamic Assignment uses AI to determine the assignee based on current user assignments across the platform. If a match can't be determined, it will be assigned to the Rule Owner.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {preparers.map((preparer, index) => (
                    <div key={`p-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AvatarCircle name={preparer} />
                      <div style={{ flex: 1, maxWidth: 200 }}>
                        <Select options={users.map(u => ({ value: u, label: u }))} value={preparer} onChange={(val: string) => { const n = [...preparers]; n[index] = val; setPreparers(n); }} disableClear />
                      </div>
                      <div style={{ width: 120 }}>
                        <Select options={[{ value: 'Preparer', label: 'Preparer' }, { value: 'Reviewer', label: 'Reviewer' }]} value="Preparer" onChange={(val: string) => {
                          if (val === 'Reviewer') { setReviewers([...reviewers, preparer]); setPreparers(preparers.filter((_, i) => i !== index)); }
                        }} disableFilter disableClear />
                      </div>
                      {preparers.length > 1 && <button onClick={() => setPreparers(preparers.filter((_, i) => i !== index))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: tok.muted }}><Delete size={14} /></button>}
                    </div>
                  ))}
                  {reviewers.map((reviewer, index) => (
                    <div key={`r-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AvatarCircle name={reviewer} />
                      <div style={{ flex: 1, maxWidth: 200 }}>
                        <Select options={users.map(u => ({ value: u, label: u }))} value={reviewer} onChange={(val: string) => { const n = [...reviewers]; n[index] = val; setReviewers(n); }} disableClear />
                      </div>
                      <div style={{ width: 120 }}>
                        <Select options={[{ value: 'Preparer', label: 'Preparer' }, { value: 'Reviewer', label: 'Reviewer' }]} value="Reviewer" onChange={(val: string) => {
                          if (val === 'Preparer') { setPreparers([...preparers, reviewer]); setReviewers(reviewers.filter((_, i) => i !== index)); }
                        }} disableFilter disableClear />
                      </div>
                      {reviewers.length > 1 && <button onClick={() => setReviewers(reviewers.filter((_, i) => i !== index))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: tok.muted }}><Delete size={14} /></button>}
                    </div>
                  ))}
                  <button onClick={() => setPreparers([...preparers, 'Dynamic Assignment'])}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', color: tok.bodySecondary, padding: '4px 0' }}>
                    <Add size={14} /> Add Assignee
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Log — stays visible in edit mode (collapsed) */}
            <div>
              <div>
                <button onClick={() => setActivityLogOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                  <KeyboardArrowDown size={24} color={tok.bodySecondary} style={{ transform: activityLogOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }} />
                  <SectionHeader noDivider>Activity Log</SectionHeader>
                </button>
                <div style={{ height: 1, background: tok.border, marginTop: 4 }} />
              </div>
            </div>
          </div>
        )}
      </div>{/* end scrollable content */}

      {/* ── Save Rule Modal ── */}
      {showSaveModal && (
        <Modal open={showSaveModal} onOpenChange={(open: boolean) => { if (!open) setShowSaveModal(false); }}>
          <div style={{ padding: 24, maxWidth: 440 }}>
            <h3 style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 18, color: tok.bodyText, margin: '0 0 12px 0' }}>Save Rule</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: '20px', color: tok.bodySecondary, margin: '0 0 16px 0' }}>
              Saving will create <strong>Version {(rule.version || 1) + 1}</strong> of this rule.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText, cursor: 'pointer' }}>
                <input type="radio" name="period" checked={!applyHistorical} onChange={() => setApplyHistorical(false)} style={{ accentColor: 'var(--flo-sem-color-success, #1fac76)' }} />
                Apply to current and future periods
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 12, color: tok.bodyText, cursor: 'pointer' }}>
                <input type="radio" name="period" checked={applyHistorical} onChange={() => setApplyHistorical(true)} style={{ accentColor: 'var(--flo-sem-color-success, #1fac76)' }} />
                Apply to current, future, and historical periods
              </label>
              {applyHistorical && (
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <FieldLabel>Select historical periods from:</FieldLabel>
                  <input type="month" value={historicalFrom} onChange={e => setHistoricalFrom(e.target.value)}
                    style={{ padding: '6px 8px', border: `1px solid ${tok.border}`, borderRadius: 4, fontSize: 12, fontFamily: 'Inter, sans-serif', marginTop: 4 }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button variant="outlined" color="dark" size="sm" onClick={() => setShowSaveModal(false)}>Cancel</Button>
              <Button size="sm" onClick={handleConfirmSave} disabled={applyHistorical && !historicalFrom}>Confirm & Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0" style={{ borderTop: `1px solid ${tok.border}`, padding: '12px 16px', background: tok.neutralBadgeBg }}>
        {!isEditMode ? (
          <div className="flex gap-3">
            <Button variant="outlined" color="dark" onClick={onEditClick} size="sm">Edit Rule</Button>
            <Button onClick={onShowAnomalies} size="sm">Show Anomalies</Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outlined" color="dark" size="sm" onClick={() => { setRuleName(rule.name); setDescription(rule.description || ''); setPreparers(rule.preparers || ['Dynamic Assignment']); setReviewers(rule.reviewers || ['Dynamic Assignment']); setStatus(rule.status); onCancelEdit(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!ruleName.trim()} size="sm">Save Changes</Button>
          </div>
        )}
      </div>
    </div>
  );
}
