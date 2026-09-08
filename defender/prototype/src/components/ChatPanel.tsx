import { useState, useEffect, useRef } from 'react';
import type { Anomaly, Rule, PrepopulatedRuleData, Condition, Group } from '../types';
import { parseNaturalLanguageRule } from '../utils/rule-parser';
import { Actions, type Model } from 'flexlayout-react';
import Close from '@floqastinc/flow-ui_icons/material/Close';

interface ChatPanelProps {
  isOpen: boolean;
  selectedAnomaly: Anomaly | null;
  rules: Rule[];
  onCreateRule: (data: PrepopulatedRuleData) => void;
  onSelectRuleCreatorTab: () => void;
  layoutModelRef: React.RefObject<Model | null>;
}

function evaluateCondition(condition: Condition, anomaly: Anomaly): boolean {
  const fieldMap: Record<string, string> = {
    'Amount': 'amount',
    'Date': 'date',
    'Account': 'account',
    'Department': 'department',
    'Class': 'class',
    'Location': 'location',
    'Memo': 'memo',
    'Created By': 'createdBy',
    'Entry Type': 'entryType',
    'Vendor': 'entity',
    'Day Of Week': 'dayOfWeek',
    'Has PO': 'poReference',
    'Is Round Number': 'isRoundNumber',
    'Is Post Close': 'isPostClose',
    'Vendor Age': 'vendorAgeAtTransaction'
  };

  const field = fieldMap[condition.field];
  if (!field) return false;

  const value = anomaly[field as keyof Anomaly];
  const conditionValue = condition.value;

  if (value === undefined || value === null) {
    return condition.operator === 'Is Empty';
  }

  if (typeof value === 'boolean') {
    switch (condition.operator) {
      case 'Equals': return value === (conditionValue.toLowerCase() === 'true');
      case 'Not Equals': return value !== (conditionValue.toLowerCase() === 'true');
      case 'Is Empty': return false;
      case 'Is Not Empty': return true;
      default: return false;
    }
  }

  const stringValue = String(value).toLowerCase();
  const conditionStringValue = conditionValue.toLowerCase();

  switch (condition.operator) {
    case 'Equals':
      if (condition.field === 'Amount') {
        return Number(value) === Number(conditionValue);
      }
      return stringValue === conditionStringValue;
    case 'Not Equals':
      if (condition.field === 'Amount') {
        return Number(value) !== Number(conditionValue);
      }
      return stringValue !== conditionStringValue;
    case 'Greater Than':
      return Number(value) > Number(conditionValue);
    case 'Less Than':
      return Number(value) < Number(conditionValue);
    case 'Greater Than or Equal':
      return Number(value) >= Number(conditionValue);
    case 'Less Than or Equal':
      return Number(value) <= Number(conditionValue);
    case 'Contains':
      return stringValue.includes(conditionStringValue);
    case 'Does Not Contain':
      return !stringValue.includes(conditionStringValue);
    case 'Starts With':
      return stringValue.startsWith(conditionStringValue);
    case 'Ends With':
      return stringValue.endsWith(conditionStringValue);
    case 'Is Empty':
      return !value || stringValue === '';
    case 'Is Not Empty':
      return !!value && stringValue !== '';
    default:
      return false;
  }
}

function evaluateGroup(group: Group, anomaly: Anomaly): boolean {
  if (group.items.length === 0) return false;

  const results = group.items.map(item => {
    if (item.type === 'condition') {
      return evaluateCondition(item, anomaly);
    } else {
      return evaluateGroup(item, anomaly);
    }
  });

  return group.logic === 'AND'
    ? results.every(r => r)
    : results.some(r => r);
}

function evaluateRule(rule: Rule, anomaly: Anomaly): boolean {
  if (!rule.logic || rule.logic.items.length === 0) return false;
  return evaluateGroup(rule.logic, anomaly);
}

function buildAnomalyExplanation(anomaly: Anomaly, matchingRules: Rule[]): string[] {
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ruleNames = matchingRules.map(r => `"${r.name}"`).join(' and ');
  const ruleDescriptions = matchingRules.map(r => r.description || r.name);

  const explanation = `I've reviewed transaction ${anomaly.transactionId} for ${anomaly.entity} — a ${anomaly.entryType} of ${fmt(anomaly.amount)} posted to ${anomaly.account} on ${anomaly.date}.`;

  const whyFlagged = matchingRules.length === 1
    ? `This transaction was flagged by the ${ruleNames} rule. ${ruleDescriptions[0]}.`
    : `This transaction was flagged by ${matchingRules.length} rules: ${ruleNames}. ${ruleDescriptions.join(' Additionally, ')}.`;

  const resolutionSteps: string[] = [];
  matchingRules.forEach(rule => {
    if (rule.name === 'Transaction >$1M') {
      resolutionSteps.push('Verify that proper authorization was obtained for this large transaction and confirm supporting documentation is on file.');
    } else if (rule.name === 'Round Dollar Amounts') {
      resolutionSteps.push('Confirm whether the round dollar amount reflects an estimate or an actual invoice — if an estimate, obtain the finalized invoice amount.');
    } else if (rule.name === 'Missing Department') {
      resolutionSteps.push('Assign the correct department classification to ensure proper cost center reporting.');
    } else if (rule.name === 'Missing Approvals') {
      resolutionSteps.push('Obtain the required approval signatures and attach them to the transaction record.');
    } else if (rule.name === 'Duplicate Entry') {
      resolutionSteps.push('Compare against existing transactions to confirm this is not a duplicate posting — if it is, void the duplicate entry.');
    } else if (rule.name === 'High-Value Vendor') {
      resolutionSteps.push('Verify the vendor is on the approved vendor list and that contract terms support this payment amount.');
    } else if (rule.name === 'High-Volume Accounts') {
      resolutionSteps.push('Review the account activity for this period to confirm the volume is expected and authorized.');
    } else if (rule.name === 'Unusual Entry Type') {
      resolutionSteps.push('Confirm the entry type is appropriate for this transaction and reclassify if necessary.');
    } else {
      resolutionSteps.push(`Review the transaction against the "${rule.name}" rule criteria and update the status once resolved.`);
    }
  });

  const recommendation = `To resolve: ${resolutionSteps.join(' ')} Once confirmed, update the transaction status to Resolved.`;

  return [explanation, whyFlagged, recommendation];
}

export default function ChatPanel({
  isOpen,
  selectedAnomaly,
  rules,
  onCreateRule,
  onSelectRuleCreatorTab,
  layoutModelRef,
}: ChatPanelProps) {
  const [chatMessages, setChatMessages] = useState<{ from: 'digit' | 'user'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'idle' | 'create-rule' | 'anomaly-explanation'>('idle');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatContextAnomalyId, setChatContextAnomalyId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // When the panel opens with an anomaly selected, seed the anomaly explanation
  useEffect(() => {
    if (isOpen && selectedAnomaly && selectedAnomaly.anomalyCount > 0) {
      const matchingRules = rules.filter(r =>
        r.status === 'Active' && evaluateRule(r, selectedAnomaly)
      );

      if (matchingRules.length > 0 && chatContextAnomalyId !== selectedAnomaly.id) {
        setChatContextAnomalyId(selectedAnomaly.id);
        setChatMode('anomaly-explanation');
        setChatMessages([]);
        setIsChatTyping(true);

        const timer = setTimeout(() => {
          setIsChatTyping(false);
          const [explanation, whyFlagged, recommendation] = buildAnomalyExplanation(selectedAnomaly, matchingRules);
          setChatMessages([
            { from: 'digit', text: explanation },
            { from: 'digit', text: whyFlagged },
            { from: 'digit', text: recommendation },
          ]);
        }, 900);

        return () => clearTimeout(timer);
      }
    } else if (!isOpen) {
      setChatContextAnomalyId(null);
    }
  }, [isOpen, selectedAnomaly?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  const handleChatSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { from: 'user', text }]);
    setIsChatTyping(true);

    setTimeout(() => {
      setIsChatTyping(false);
      if (chatMode === 'create-rule') {
        const { logic, nameParts, descriptionParts } = parseNaturalLanguageRule(text);
        const hasConditions = logic.items.length > 0;

        const ruleName = nameParts.length > 0
          ? nameParts.join(', ')
          : text.split(/\s+/).slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        const description = descriptionParts.length > 0
          ? `Flag all transactions with ${descriptionParts.join(', ')}.`
          : text.charAt(0).toUpperCase() + text.slice(1).replace(/\.?\s*$/, '.') ;

        const populatedData: PrepopulatedRuleData = {
          name: ruleName,
          description,
          naturalLanguageInput: text,
          logic: hasConditions ? logic : { id: 'root', type: 'group' as const, logic: 'AND' as const, items: [] },
        };

        onCreateRule(populatedData);
        if (layoutModelRef.current) {
          layoutModelRef.current.doAction(Actions.selectTab('rule-creator-tab'));
        }

        if (hasConditions) {
          setChatMessages(prev => [...prev, {
            from: 'digit',
            text: `I've built a rule based on your description and pre-filled the Rule Creator tab with the details. Take a look and adjust anything before saving!`,
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            from: 'digit',
            text: `I've pre-filled the rule name and description in the Rule Creator tab. I wasn't able to automatically detect specific conditions from your description, but you can add them manually in the builder. Give it a look!`,
          }]);
        }
      }
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[var(--flo-sem-color-border-default,#e1e6ef)]" style={{ maxHeight: '480px' }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--flo-sem-color-border-default,#f1f3f9)]" style={{ backgroundColor: 'var(--flo-sem-color-success)' }}>
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-white/40" style={{ backgroundColor: '#ffffff' }}>
          <img src="/AI_Avatar.png" alt="Assistant" className="w-full h-full object-contain p-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Assistant</p>
          <p className="text-xs text-white" style={{ opacity: 0.85 }}>Online</p>
        </div>
        <button
          onClick={() => {
            setChatMessages([]);
            setChatMode('idle');
            setChatInput('');
            setChatContextAnomalyId(null);
            setIsChatTyping(false);
          }}
          className="text-white text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          title="Reset conversation"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
        {chatMode !== 'anomaly-explanation' && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-[var(--flo-sem-color-border-default,#f1f3f9)]" style={{ backgroundColor: '#ffffff' }}>
            <img src="/AI_Avatar.png" alt="Assistant" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[var(--flo-sem-color-border-default,#f1f3f9)]">
              <p className="text-sm text-[var(--flo-sem-color-text-default,#1d2433)] leading-relaxed">
                Welcome to Data Defender! I can see that your FloQast role is <span className="font-semibold">Manager</span>. Based on this, can I help with any of the following?
              </p>
              {chatMessages.length === 0 && (
                <div className="mt-3 space-y-2">
                  {[
                    'Create a new rule',
                    'Edit an existing rule',
                    'Update anomaly user assignment',
                  ].map((option) => (
                    <button
                      key={option}
                      className="block w-full text-left text-sm font-medium px-3 py-2 rounded-lg border transition-colors"
                      style={{ color: 'var(--flo-sem-color-success)', borderColor: 'var(--flo-sem-color-success)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0fdf9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        if (option === 'Create a new rule') {
                          setChatMode('create-rule');
                          setChatMessages([
                            { from: 'user', text: option },
                            { from: 'digit', text: "I've opened up the Rule Creator tab for you! You can fill in the details of the rule in there, or just tell me what kind of rule you're looking for and I'll do my best to build it for you." },
                          ]);
                          if (layoutModelRef.current) {
                            layoutModelRef.current.doAction(Actions.selectTab('rule-creator-tab'));
                          }
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        {chatMessages.map((msg, i) => (
          msg.from === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[75%] bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-[var(--flo-sem-color-border-default,#f1f3f9)]" style={{ backgroundColor: '#ffffff' }}>
                <img src="/AI_Avatar.png" alt="Assistant" className="w-full h-full object-contain p-0.5" />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[var(--flo-sem-color-border-default,#f1f3f9)]">
                  <p className="text-sm text-[var(--flo-sem-color-text-default,#1d2433)] leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          )
        ))}
        {isChatTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-[var(--flo-sem-color-border-default,#f1f3f9)]" style={{ backgroundColor: '#ffffff' }}>
              <img src="/AI_Avatar.png" alt="Assistant" className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[var(--flo-sem-color-border-default,#f1f3f9)] inline-flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--flo-sem-color-text-tertiary,#adb2bb)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--flo-sem-color-text-tertiary,#adb2bb)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--flo-sem-color-text-tertiary,#adb2bb)] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-[var(--flo-sem-color-border-default,#f1f3f9)] flex items-center gap-2">
        <input
          type="text"
          placeholder={chatMode === 'create-rule' ? 'Describe the rule you want...' : chatMode === 'anomaly-explanation' ? 'Ask a follow-up question...' : 'Type a message...'}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleChatSend(); }}
          className="flex-1 text-sm px-3 py-2 rounded-full border border-[var(--flo-sem-color-border-default,#e1e6ef)] focus:outline-none focus:border-[var(--flo-sem-color-success,#1fac76)] bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]"
        />
        <button
          onClick={handleChatSend}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ backgroundColor: 'var(--flo-sem-color-success)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--flo-base-color-core-700)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--flo-sem-color-success)'; }}
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
