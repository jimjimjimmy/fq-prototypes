import { useState, useEffect } from 'react';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import Person from '@floqastinc/flow-ui_icons/material/Person';
import Close from '@floqastinc/flow-ui_icons/material/Close';
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Select from '@floqastinc/flow-ui_core/Select';
import Input from '@floqastinc/flow-ui_core/Input';
import TextArea from '@floqastinc/flow-ui_core/TextArea';
import Button from '@floqastinc/flow-ui_core/Button';
import SectionHeader from '@floqastinc/flow-ui_core/SectionHeader';
import Divider from '@floqastinc/flow-ui_core/Divider';
import Accordion from '@floqastinc/flow-ui_core/Accordion';
import Modal from '@floqastinc/flow-ui_core/Modal';
import CloseButton from '@floqastinc/flow-ui_core/CloseButton';
import GroupBuilder from './GroupBuilder';
import { USERS } from '../../data/constants';
import { parseNaturalLanguageRule } from '../../utils/rule-parser';
import type { Rule, Group, PrepopulatedRuleData } from '../../types';

const AI_PURPLE = 'var(--flo-base-color-purple-600)';

export interface RuleBuilderContentProps {
  editingRule?: Rule | null;
  prepopulatedData?: PrepopulatedRuleData | null;
  onSave: (rule: Partial<Rule> & { id?: string }) => void;
  onClose: () => void;
  variant: 'panel' | 'inline';
}

export default function RuleBuilderContent({ editingRule, prepopulatedData, onSave, onClose, variant }: RuleBuilderContentProps) {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [aiAccordionValue, setAiAccordionValue] = useState<string | undefined>(undefined);
  const [rootGroup, setRootGroup] = useState<Group>({
    id: 'root',
    type: 'group',
    logic: 'AND',
    items: []
  });
  const [preparers, setPreparers] = useState<string[]>(['Dynamic Assignment']);
  const [reviewers, setReviewers] = useState<string[]>(['Dynamic Assignment']);
  const [ruleOwner, setRuleOwner] = useState<string>('Current User');
  const [openPreparerDropdown, setOpenPreparerDropdown] = useState<number | null>(null);
  const [openReviewerDropdown, setOpenReviewerDropdown] = useState<number | null>(null);
  const [aiGenerationError, setAiGenerationError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [applyHistorical, setApplyHistorical] = useState(false);
  const [historicalFrom, setHistoricalFrom] = useState('');
  const [nlAccordionOpen, setNlAccordionOpen] = useState(false);

  const users = USERS;

  const getSeverityExplanation = (value: number): string => {
    if (value >= 9) return 'This rule monitors for significant material misstatements or high-level fraud indicators that could severely impact financial statements.';
    if (value >= 7) return 'This rule detects serious violations or material issues that require immediate attention and executive oversight.';
    if (value >= 5) return 'This rule identifies moderate-risk issues that may lead to financial impact if not addressed promptly.';
    if (value >= 3) return 'This rule flags minor compliance concerns or process deviations that should be reviewed but pose limited financial risk.';
    return 'This rule provides informational alerts for awareness purposes with minimal impact on financial accuracy.';
  };

  const addPreparer = () => setPreparers([...preparers, 'Dynamic Assignment']);
  const addReviewer = () => setReviewers([...reviewers, 'Dynamic Assignment']);

  const removePreparer = (index: number) => {
    if (preparers.length > 1) setPreparers(preparers.filter((_, i) => i !== index));
  };

  const removeReviewer = (index: number) => {
    if (reviewers.length > 1) setReviewers(reviewers.filter((_, i) => i !== index));
  };

  const updatePreparer = (index: number, value: string) => {
    const next = [...preparers];
    next[index] = value;
    setPreparers(next);
  };

  const updateReviewer = (index: number, value: string) => {
    const next = [...reviewers];
    next[index] = value;
    setReviewers(next);
  };

  const handleGenerateLogic = () => {
    if (!naturalLanguageInput.trim()) return;
    try {
      setAiGenerationError(null);
      const generatedGroup = parseNaturalLanguageRule(naturalLanguageInput);
      setRootGroup(generatedGroup.logic);
    } catch {
      setAiGenerationError('Unable to generate rule.');
    }
  };

  useEffect(() => {
    if (editingRule) {
      setRuleName(editingRule.name);
      setDescription(editingRule.description || '');
      setNaturalLanguageInput('');
      setAiAccordionValue(undefined);
      setRootGroup(editingRule.logic || { id: 'root', type: 'group', logic: 'AND', items: [] });
      setPreparers(editingRule.preparers || ['Dynamic Assignment']);
      setReviewers(editingRule.reviewers || ['Dynamic Assignment']);
      setRuleOwner(editingRule.ruleOwner);
      setSeverity(editingRule.severity || 5);
      setAiGenerationError(null);
    } else if (prepopulatedData) {
      setRuleName(prepopulatedData.name);
      setDescription(prepopulatedData.description);
      setNaturalLanguageInput(prepopulatedData.naturalLanguageInput);
      setAiAccordionValue(prepopulatedData.naturalLanguageInput ? 'ai-input' : undefined);
      setRootGroup(prepopulatedData.logic || { id: 'root', type: 'group', logic: 'AND', items: [] });
      setPreparers(prepopulatedData.preparers || ['Dynamic Assignment']);
      setReviewers(prepopulatedData.reviewers || ['Dynamic Assignment']);
      setRuleOwner(prepopulatedData.ruleOwner || 'Current User');
      setSeverity(prepopulatedData.severity || 5);
      setAiGenerationError(null);
    } else {
      setRuleName('');
      setDescription('');
      setNaturalLanguageInput('');
      setAiAccordionValue(undefined);
      setRootGroup({ id: 'root', type: 'group', logic: 'AND', items: [] });
      setPreparers(['Dynamic Assignment']);
      setReviewers(['Dynamic Assignment']);
      setRuleOwner('Current User');
      setSeverity(5);
      setAiGenerationError(null);
    }
  }, [editingRule, prepopulatedData]);

  const resetState = () => {
    setRuleName('');
    setDescription('');
    setNaturalLanguageInput('');
    setAiAccordionValue(undefined);
    setRootGroup({ id: 'root', type: 'group', logic: 'AND', items: [] });
    setPreparers(['Dynamic Assignment']);
    setReviewers(['Dynamic Assignment']);
    setRuleOwner('Current User');
    setSeverity(5);
    setOpenPreparerDropdown(null);
    setOpenReviewerDropdown(null);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    onSave({ id: editingRule?.id, name: ruleName, description, logic: rootGroup, preparers, reviewers, ruleOwner, severity });
    setShowSaveModal(false);
    setApplyHistorical(false);
    setHistoricalFrom('');
    if (variant === 'panel') {
      resetState();
      onClose();
    }
  };

  const handleClose = () => {
    if (variant === 'panel') {
      resetState();
    }
    onClose();
  };

  const isPanel = variant === 'panel';

  /* ── Variant-driven rendering helpers ── */

  const renderUserIcon = (name: string) =>
    name === 'Dynamic Assignment'
      ? <AutoAwesome size={16} color={AI_PURPLE} />
      : <Person size={16} color="var(--flo-sem-color-icon-muted)" />;

  const renderAssigneeDropdown = (
    items: string[],
    openIndex: number | null,
    setOpenIndex: (i: number | null) => void,
    closeOther: () => void,
    update: (i: number, v: string) => void,
    remove: (i: number) => void,
    addLabel: string,
    addFn: () => void,
  ) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => { setOpenIndex(openIndex === index ? null : index); closeOther(); }}
            className="w-full px-3 py-2 border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg text-sm text-left bg-white hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2" style={{ color: 'var(--flo-sem-color-text-default)' }}>
              {renderUserIcon(item)}
              {item}
            </span>
            <div className="flex items-center gap-2">
              {items.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); remove(index); }}
                  className="hover:text-[var(--flo-sem-color-text-secondary,#424867)]"
                  style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                >
                  <Close size={16} />
                </button>
              )}
              <ExpandMore size={16} color="var(--flo-sem-color-icon-muted)" />
            </div>
          </button>
          {openIndex === index && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg shadow-lg max-h-60 overflow-auto">
              {users.map((user) => (
                <button
                  key={user}
                  onClick={() => { update(index, user); setOpenIndex(null); }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors flex items-center gap-2"
                  style={{ color: 'var(--flo-sem-color-text-default)' }}
                >
                  {renderUserIcon(user)}
                  {user}
                </button>
              ))}
            </div>
          )}
          {item === 'Dynamic Assignment' && (
            <p className="mt-1 text-xs" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
              Automatically assigns the anomaly to the Assignee of the associated Balance Sheet Reconciliation in FloQast.
            </p>
          )}
        </div>
      ))}
      <Button variant="ghost" color="dark" onClick={addFn} size="sm">
        <Add size={16} />
        {addLabel}
      </Button>
    </div>
  );

  const renderSeverityContent = () => (
    <div>
      {/* Severity slider — 1-5 scale per Figma, green gradient with dot stops */}
      <div style={{ position: 'relative', padding: '8px 0 0' }}>
        <input
          type="range"
          min="1"
          max="5"
          value={Math.min(5, severity)}
          onChange={(e) => setSeverity(parseInt(e.target.value))}
          className="w-full appearance-none cursor-pointer"
          style={{
            height: 6, borderRadius: 3,
            background: `linear-gradient(to right, var(--flo-sem-color-success, #1fac76) 0%, var(--flo-sem-color-success, #1fac76) ${((Math.min(5, severity) - 1) / 4) * 100}%, var(--flo-sem-color-border-default, #e1e6ef) ${((Math.min(5, severity) - 1) / 4) * 100}%, var(--flo-sem-color-border-default, #e1e6ef) 100%)`,
            outline: 'none',
          }}
        />
        {/* Number labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} style={{ fontSize: 12, fontWeight: severity === n ? 700 : 400, color: severity === n ? 'var(--flo-sem-color-text-default)' : 'var(--flo-sem-color-text-tertiary)', fontFamily: 'Inter, sans-serif' }}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      {isPanel ? (
        <div className="px-6 pt-6 pb-0 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: 'var(--flo-sem-color-text-default)' }}>
            {editingRule ? 'Edit Rule' : 'Create New Rule'}
          </h2>
          <CloseButton onClick={handleClose} />
        </div>
      ) : (
        <div style={{ padding: '16px 24px', flexShrink: 0 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: 0 }}>Rule Details</h2>
        </div>
      )}

      {/* Scrollable form body */}
      <div className={isPanel ? 'overflow-y-auto flex-1 p-6' : 'overflow-y-auto flex-1 px-6 py-6'}>
        <div className={isPanel ? 'flex flex-col gap-6' : 'space-y-6'}>

          {/* Rule Details section — Name + Description (per Figma: no Rule Owner here) */}
          <div className={isPanel ? 'flex flex-col gap-4' : 'space-y-4'}>
            {isPanel ? (
              <>
                <Input
                  label="Name"
                  value={ruleName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleName(e.target.value)}
                  placeholder="e.g., Large Transactions"
                />
                <TextArea
                  label="Description"
                  isLabelVisible
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Describe what this rule detects..."
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>* Name</label>
                  <input
                    type="text"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--flo-sem-color-success,#1fac76)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., This rule flags transactions over $1M"
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--flo-sem-color-border-default,#e1e6ef)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--flo-sem-color-success,#1fac76)] focus:border-transparent resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* AI Accordion */}
          <div>
            {isPanel ? (
              <>
                <Divider />
                <div className="mt-6">
                  <Accordion type="single" collapsible variant="standard" size="sm" value={aiAccordionValue} onValueChange={(val: string) => setAiAccordionValue(val || undefined)}>
                    <Accordion.Item value="ai-input">
                      <Accordion.Trigger>
                        <span className="flex items-center gap-2">
                          <AutoAwesome size={16} color={AI_PURPLE} />
                          Create Rule with AI
                        </span>
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div className="p-4 pt-0">
                          <TextArea
                            value={naturalLanguageInput}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                              setNaturalLanguageInput(e.target.value);
                              setAiGenerationError(null);
                            }}
                            placeholder="e.g., Flag any Vendor Bill over $10,000 in the Marketing department"
                          />
                          <Button onClick={handleGenerateLogic} disabled={!naturalLanguageInput.trim()} size="sm">
                            Generate
                          </Button>
                          {aiGenerationError && (
                            <p className="mt-2 text-sm" style={{ color: 'var(--flo-sem-color-danger)' }}>{aiGenerationError}</p>
                          )}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </>
            ) : (
              <div>
                {/* NL Accordion — per Figma: rounded border container, chevron toggle, Generate button inside textarea */}
                <div style={{
                  border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
                  borderRadius: 8, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setNlAccordionOpen(o => !o)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                      color: 'var(--flo-sem-color-text-default)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Use natural language to describe your rule
                      <AutoAwesome size={14} color="var(--flo-sem-color-success)" />
                    </span>
                    <ExpandMore size={18} color="var(--flo-sem-color-text-tertiary)" style={{ transform: nlAccordionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {nlAccordionOpen && (
                    <div style={{ padding: '0 16px 16px', position: 'relative' }}>
                      <div style={{
                        border: aiGenerationError ? '1px solid var(--flo-sem-color-danger)' : '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
                        borderRadius: 6, overflow: 'hidden', position: 'relative',
                      }}>
                        <textarea
                          value={naturalLanguageInput}
                          onChange={(e) => { setNaturalLanguageInput(e.target.value); setAiGenerationError(null); }}
                          placeholder="Describe your rule in natural language"
                          rows={4}
                          style={{
                            width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
                            fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'var(--flo-sem-color-text-default)',
                            background: 'transparent',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 12px 12px' }}>
                          <Button onClick={handleGenerateLogic} disabled={!naturalLanguageInput.trim()} size="sm">
                            Generate
                          </Button>
                        </div>
                      </div>
                      {aiGenerationError && (
                        <p style={{ fontSize: 12, color: 'var(--flo-sem-color-danger)', marginTop: 8, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                          {aiGenerationError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Parameters */}
          <div>
            {isPanel ? (
              <>
                <SectionHeader level={2}>Parameters</SectionHeader>
                <Divider />
                <div className="mt-4" />
              </>
            ) : (
              <>
                <Divider />
                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: '24px 0 16px' }}>Rule Parameters</h3>
              </>
            )}

            {/* Helper text per Figma — with sparkle when AI-generated conditions exist */}
            <p style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary)', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
              Transactions are flagged as anomalous if the following conditions are met
              {rootGroup.items.some(item => item.type === 'condition' && (item as any).aiGenerated) && (
                <AutoAwesome size={12} color="var(--flo-sem-color-success)" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
              )}
            </p>

            {/* Condition builder or empty state */}
            {rootGroup.items.length === 0 ? (
              <div style={{
                border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
                borderRadius: 8, padding: '48px 24px', textAlign: 'center',
                background: 'var(--flo-sem-color-surface-secondary, #f8fafc)',
              }}>
                {/* Empty state illustration placeholder */}
                <div style={{ marginBottom: 16, opacity: 0.4 }}>
                  <svg width="80" height="60" viewBox="0 0 80 60" fill="none" style={{ margin: '0 auto' }}>
                    <rect x="10" y="5" width="60" height="10" rx="3" fill="var(--flo-sem-color-border-default, #e1e6ef)" />
                    <rect x="5" y="20" width="70" height="8" rx="3" fill="var(--flo-sem-color-border-default, #e1e6ef)" />
                    <rect x="15" y="33" width="50" height="8" rx="3" fill="var(--flo-sem-color-border-default, #e1e6ef)" />
                    <rect x="20" y="46" width="40" height="8" rx="3" fill="var(--flo-sem-color-border-default, #e1e6ef)" />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--flo-sem-color-text-default)', marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
                  There are no conditions
                </p>
                <p style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary)', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
                  Describe your rule above to generate conditions, or add a group manually
                </p>
                <Button onClick={() => {
                  setRootGroup({ id: 'root', type: 'group', logic: 'AND', items: [{ id: `c-${Date.now()}`, type: 'condition', field: 'Amount', operator: 'Greater Than', value: '' }] });
                }} size="sm">
                  Add Group
                </Button>
              </div>
            ) : (
              <GroupBuilder group={rootGroup} onUpdate={setRootGroup} onDelete={() => setRootGroup({ ...rootGroup, items: [] })} depth={0} />
            )}
          </div>

          {/* Anomaly Assignees — per Figma: Rule Owner + unified assignee list with role dropdown */}
          <div>
            {isPanel ? (
              <>
                <SectionHeader level={2}>Anomaly Assignees</SectionHeader>
                <Divider />
              </>
            ) : (
              <>
                <Divider />
                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: '24px 0 16px' }}>Anomaly Assignees</h3>
              </>
            )}

            {/* Rule Owner — moved here per Figma (was above Parameters) */}
            <div style={{ marginBottom: 16 }}>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>* Rule Owner</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--flo-sem-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  {ruleOwner.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <Select
                    options={users.filter(u => u !== 'Dynamic Assignment').map(u => ({ value: u, label: u }))}
                    value={ruleOwner}
                    onChange={(val: string) => setRuleOwner(val)}
                    disableClear
                  />
                </div>
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
                The Rule Owner is the default assignee when dynamic assignment cannot determine who should be assigned.
              </p>
            </div>

            {/* Assignees — unified list with role dropdown per Figma */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-default)' }}>Assignees</label>
                <ExpandMore size={16} color="var(--flo-sem-color-text-tertiary)" />
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
                The users listed here will be assigned to investigate and resolve the anomaly.
              </p>

              {/* Dynamic Assignment info box */}
              <div style={{
                background: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)',
                borderRadius: 8, padding: '12px 16px', marginBottom: 16,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <AutoAwesome size={16} color="var(--flo-sem-color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs" style={{ color: 'var(--flo-sem-color-text-default)', margin: 0, lineHeight: 1.5 }}>
                  Dynamic Assignment uses AI to determine the assignee based on current user assignments across the platform. If a match can't be determined, it will be assigned to the Rule Owner
                </p>
              </div>

              {/* Unified assignee rows: avatar + name + role + delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...preparers.map(p => ({ name: p, role: 'Preparer' as const })), ...reviewers.map(r => ({ name: r, role: 'Reviewer' as const }))].map((assignee, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: assignee.name === 'Dynamic Assignment' ? 'var(--flo-sem-color-success)' : 'var(--flo-sem-color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                      {assignee.name === 'Dynamic Assignment' ? <AutoAwesome size={12} /> : assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <Select
                        options={[{ value: 'Dynamic Assignment', label: 'Dynamic Assignment' }, ...users.filter(u => u !== 'Dynamic Assignment').map(u => ({ value: u, label: u }))]}
                        value={assignee.name}
                        onChange={(val: string) => {
                          if (assignee.role === 'Preparer') updatePreparer(preparers.indexOf(assignee.name), val);
                          else updateReviewer(reviewers.indexOf(assignee.name), val);
                        }}
                        disableClear
                      />
                    </div>
                    <div style={{ width: 130 }}>
                      <Select
                        options={[{ value: 'Preparer', label: 'Preparer' }, { value: 'Reviewer', label: 'Reviewer' }]}
                        value={assignee.role}
                        onChange={(val: string) => {
                          const newRole = val as 'Preparer' | 'Reviewer';
                          if (assignee.role === 'Preparer' && newRole === 'Reviewer') {
                            removePreparer(preparers.indexOf(assignee.name));
                            setReviewers(prev => [...prev, assignee.name]);
                          } else if (assignee.role === 'Reviewer' && newRole === 'Preparer') {
                            removeReviewer(reviewers.indexOf(assignee.name));
                            setPreparers(prev => [...prev, assignee.name]);
                          }
                        }}
                        disableFilter
                        disableClear
                      />
                    </div>
                    <Button variant="ghost" size="sm" color="danger" onClick={() => {
                      if (assignee.role === 'Preparer') removePreparer(preparers.indexOf(assignee.name));
                      else removeReviewer(reviewers.indexOf(assignee.name));
                    }} style={{ padding: 4, minWidth: 'auto' }}>
                      <Delete size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addPreparer()}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--flo-sem-color-text-secondary)', padding: 0 }}
              >
                <Add size={16} /> Add Assignee
              </button>
            </div>
          </div>

          {/* Risk Configuration */}
          {isPanel ? (
            <div>
              <SectionHeader level={2}>Risk Configuration</SectionHeader>
              <Divider />
              <div className="space-y-4 mt-4">
                {renderSeverityContent()}
              </div>
            </div>
          ) : (
            <div>
              <Divider />
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: '24px 0 16px' }}>Severity Level</h3>
              <div className="space-y-4">
                {renderSeverityContent()}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      {isPanel ? (
        <div className="px-4 py-4 bg-[var(--flo-base-color-neutral-100)] flex gap-4 justify-end">
          <Button variant="outlined" color="dark" onClick={handleClose} size="sm">Cancel</Button>
          <Button onClick={handleSave} disabled={!ruleName.trim()} size="sm">Save Rule</Button>
        </div>
      ) : (
        <div className="border-t border-[var(--flo-sem-color-border-default,#e1e6ef)] px-6 py-4 flex gap-3 flex-shrink-0">
          <Button variant="outlined" color="dark" onClick={handleClose} size="sm">Cancel</Button>
          <Button onClick={handleSave} disabled={!ruleName.trim()} size="sm">Save Rule</Button>
        </div>
      )}

      {/* Save confirmation modal */}
      <Modal open={showSaveModal} onOpenChange={(open: boolean) => { if (!open) { setShowSaveModal(false); setApplyHistorical(false); } }} size="sm">
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: 0 }}>Save Rule</h3>
            <CloseButton onClick={() => setShowSaveModal(false)} />
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
            Saving these changes will create a new version of this rule which will be run and be applied to all transactions in the selected periods.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: !applyHistorical ? 600 : 400, color: 'var(--flo-sem-color-text-default)' }}>
              <input type="radio" name="period" checked={!applyHistorical} onChange={() => setApplyHistorical(false)} style={{ accentColor: 'var(--flo-sem-color-success)' }} />
              Current and future periods only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: applyHistorical ? 600 : 400, color: 'var(--flo-sem-color-text-default)' }}>
              <input type="radio" name="period" checked={applyHistorical} onChange={() => setApplyHistorical(true)} style={{ accentColor: 'var(--flo-sem-color-success)' }} />
              Current, future and historical periods
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', paddingTop: 16 }}>
            <Button variant="outlined" color="dark" onClick={() => { setShowSaveModal(false); setApplyHistorical(false); }} size="sm">Cancel</Button>
            <Button onClick={handleConfirmSave} size="sm">
            Save
          </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
