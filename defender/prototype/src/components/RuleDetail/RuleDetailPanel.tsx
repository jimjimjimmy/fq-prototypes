import { useState, useEffect } from 'react';
import type { Rule } from '../../types';
import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer';
import CloseButton from '@floqastinc/flow-ui_core/CloseButton';
import Button from '@floqastinc/flow-ui_core/Button';
import Input from '@floqastinc/flow-ui_core/Input';
import TextArea from '@floqastinc/flow-ui_core/TextArea';
import Divider from '@floqastinc/flow-ui_core/Divider';
import Select from '@floqastinc/flow-ui_core/Select';
import SectionHeader from '@floqastinc/flow-ui_core/SectionHeader';
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Schedule from '@floqastinc/flow-ui_icons/material/Schedule';
import { USERS } from '../../data/constants';

export default function RuleDetailPanel({
  rule,
  isOpen,
  isEditMode,
  onClose,
  onEditClick,
  onShowAnomalies,
  onSave,
  onBack
}: {
  rule: Rule | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onEditClick: () => void;
  onShowAnomalies: () => void;
  onSave: (rule: Partial<Rule> & { id: string }) => void;
  onBack?: () => void;
}) {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [preparers, setPreparers] = useState<string[]>(['Dynamic Assignment']);
  const [reviewers, setReviewers] = useState<string[]>(['Dynamic Assignment']);
  const [ruleOwner, setRuleOwner] = useState<string>('Current User');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (rule) {
      setRuleName(rule.name);
      setDescription(rule.description || '');
      setPreparers(rule.preparers || ['Dynamic Assignment']);
      setReviewers(rule.reviewers || ['Dynamic Assignment']);
      setRuleOwner(rule.ruleOwner);
      setStatus(rule.status);
    }
  }, [rule]);

  const handleSave = () => {
    onSave({
      id: rule!.id,
      name: ruleName,
      description: description,
      preparers: preparers,
      reviewers: reviewers,
      ruleOwner: ruleOwner,
      status: status
    });
  };

  const users = [
    'Dynamic Assignment',
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jessica Martinez'
  ];

  return (
    <SideDrawer show={isOpen && !!rule} onCancel={onClose} width="md" renderOverlay>
      {rule && (
      <>
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded-lg transition-colors"
                aria-label="Back to transaction"
              >
                <ChevronLeft size={20} color="var(--flo-sem-color-icon-tertiary)" />
              </button>
            )}
            <h2 className="text-base font-semibold" style={{ color: 'var(--flo-sem-color-text-default)' }}>
              {isEditMode ? 'Edit Rule' : 'Rule Details'}
            </h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isEditMode ? (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Rule Name</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{rule.name}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Description</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>{rule.description || 'No description provided'}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Status</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{rule.status}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Rule Owner</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{rule.ruleOwner}</div>
              </div>

              <Divider />

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Total Anomalies</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{rule.totalCount}</div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Unresolved Anomalies</label>
                <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{rule.unresolvedCount}</div>
              </div>

              <Divider />

              <SectionHeader level={2}>Assignees</SectionHeader>
              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Preparers</label>
                <div className="space-y-2">
                  {rule.preparers?.map((preparer, index) => (
                    <div key={index} className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{preparer}</div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Reviewers</label>
                <div className="space-y-2">
                  {rule.reviewers?.map((reviewer, index) => (
                    <div key={index} className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{reviewer}</div>
                  ))}
                </div>
              </div>

              <Divider />

              <div>
                <SectionHeader level={2}>Rule Parameters</SectionHeader>
                <div className="bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] rounded-lg p-4 border border-[var(--flo-sem-color-border-default,#e1e6ef)] mt-4">
                  {rule.logic && rule.logic.items.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium mb-2" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
                        Match {rule.logic.logic === 'AND' ? 'all' : 'any'} of the following conditions:
                      </div>
                      {rule.logic.items.map((item, index) => {
                        if (item.type === 'condition') {
                          return (
                            <div key={item.id} className="flex items-center gap-2 text-sm bg-white rounded px-3 py-2 border border-[var(--flo-sem-color-border-default,#e1e6ef)]" style={{ color: 'var(--flo-sem-color-text-default)' }}>
                              <span className="font-medium">{item.field}</span>
                              <span style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>{item.operator}</span>
                              <span className="font-medium" style={{ color: 'var(--flo-sem-color-success)' }}>{item.value}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="text-sm" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>No conditions defined</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Input
                label="Rule Name"
                value={ruleName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRuleName(e.target.value)}
              />

              <TextArea
                label="Description"
                isLabelVisible
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Status</label>
                <div style={{ width: '100%' }}>
                  <Select
                    value={status}
                    onChange={(val: string) => setStatus(val as 'Active' | 'Inactive')}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                    disableClear
                    disableFilter
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Rule Owner</label>
                <div style={{ width: '100%' }}>
                  <Select
                    value={ruleOwner}
                    onChange={(val: string) => setRuleOwner(val)}
                    options={users.filter(u => u !== 'Dynamic Assignment').map((user) => ({
                      value: user,
                      label: user
                    }))}
                    disableClear
                    disableFilter
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
                  The Rule Owner is the default assignee when dynamic assignment cannot determine who should be assigned.
                </p>
              </div>

              <Divider />

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Preparers</label>
                <div className="space-y-2">
                  {preparers.map((preparer, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div style={{ flex: 1 }}>
                        <Select
                          value={preparer}
                          onChange={(val: string) => {
                            const newPreparers = [...preparers];
                            newPreparers[index] = val;
                            setPreparers(newPreparers);
                          }}
                          options={users.map((user) => ({
                            value: user,
                            label: user
                          }))}
                          disableClear
                          disableFilter
                        />
                      </div>
                      {preparers.length > 1 && (
                        <button
                          onClick={() => setPreparers(preparers.filter((_, i) => i !== index))}
                          className="p-2 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                        >
                          <Delete size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" onClick={() => setPreparers([...preparers, 'Dynamic Assignment'])} size="sm">
                    <Add size={16} />
                    Add Preparer
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--flo-sem-color-text-default)] mb-1">Reviewers</label>
                <div className="space-y-2">
                  {reviewers.map((reviewer, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div style={{ flex: 1 }}>
                        <Select
                          value={reviewer}
                          onChange={(val: string) => {
                            const newReviewers = [...reviewers];
                            newReviewers[index] = val;
                            setReviewers(newReviewers);
                          }}
                          options={users.map((user) => ({
                            value: user,
                            label: user
                          }))}
                          disableClear
                          disableFilter
                        />
                      </div>
                      {reviewers.length > 1 && (
                        <button
                          onClick={() => setReviewers(reviewers.filter((_, i) => i !== index))}
                          className="p-2 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                        >
                          <Delete size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button variant="ghost" onClick={() => setReviewers([...reviewers, 'Dynamic Assignment'])} size="sm">
                    <Add size={16} />
                    Add Reviewer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[var(--flo-base-color-neutral-100)] px-4 py-4">
          {!isEditMode ? (
            <div className="flex gap-3">
              <Button variant="outlined" color="dark" onClick={onEditClick} size="sm">
                Edit Rule
              </Button>
              <Button onClick={onShowAnomalies} size="sm">
                Show Anomalies
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outlined"
                color="dark"
                onClick={() => {
                  if (rule) {
                    setRuleName(rule.name);
                    setDescription(rule.description || '');
                    setPreparers(rule.preparers || ['Dynamic Assignment']);
                    setReviewers(rule.reviewers || ['Dynamic Assignment']);
                    setStatus(rule.status);
                  }
                  onClose();
                }}
                size="sm"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!ruleName.trim()} size="sm">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </>
      )}
    </SideDrawer>
  );
}
