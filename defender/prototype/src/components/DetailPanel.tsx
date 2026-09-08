import { useState, useEffect } from 'react';
import type { Anomaly, Comment, Rule } from '../types';
import Accordion from '@floqastinc/flow-ui_core/Accordion';
import Button from '@floqastinc/flow-ui_core/Button';
import TextArea from '@floqastinc/flow-ui_core/TextArea';
import Toggle from '@floqastinc/flow-ui_core/Toggle';
import Tooltip from '@floqastinc/flow-ui_core/Tooltip';
import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer';
import CloseButton from '@floqastinc/flow-ui_core/CloseButton';
import Select from '@floqastinc/flow-ui_core/Select';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Edit from '@floqastinc/flow-ui_icons/material/Edit';
import Done from '@floqastinc/flow-ui_icons/material/Done';
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import OpenInNew from '@floqastinc/flow-ui_icons/material/OpenInNew';
import Close from '@floqastinc/flow-ui_icons/material/Close';
import Person from '@floqastinc/flow-ui_icons/material/Person';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import CalendarMonth from '@floqastinc/flow-ui_icons/material/CalendarMonth';
import RemoveSignoffModal from './RemoveSignoffModal';

export default function DetailPanel({ anomaly, anomalies, rules, onClose, onUpdateAnomaly, onUpdateRule, visibleFields, onRuleClick, onTransactionClick, inline, onOpenFieldSettings }: {
  anomaly: Anomaly | null;
  anomalies: Anomaly[];
  rules: Rule[];
  onClose: () => void;
  onUpdateAnomaly: (updatedAnomaly: Anomaly) => void;
  onUpdateRule: (ruleId: string, preparers: string[], reviewers: string[]) => void;
  visibleFields: Record<string, boolean>;
  onRuleClick?: (ruleName: string) => void;
  onTransactionClick?: (e: React.MouseEvent, transactionId: string) => void;
  inline?: boolean;
  onOpenFieldSettings?: () => void;
}) {
  const [commentText, setCommentText] = useState('');
  const [currentAnomaly, setCurrentAnomaly] = useState(anomaly);
  const [assigneeToggles, setAssigneeToggles] = useState<Record<string, { toggled: boolean; completedBy: string }>>({});
  const [removeSignoffModal, setRemoveSignoffModal] = useState<{ isOpen: boolean; key: string | null }>({ isOpen: false, key: null });
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editedPreparers, setEditedPreparers] = useState<string[]>([]);
  const [editedReviewers, setEditedReviewers] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const currentUser = 'Sarah Johnson';

  const users = [
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jessica Martinez',
    'Michael Chen',
    'David Park',
    'Robert Martinez',
    'Amanda White',
    'James Wilson',
    'Lisa Thompson',
    'Kevin Brown',
    'Maria Garcia',
    'Thomas Anderson',
    'Jennifer Taylor',
    'Christopher Davis',
    'Michelle Moore',
    'Daniel Jackson',
    'Ashley Martin',
    'Matthew Harris',
    'Nicole Clark',
    'Joshua Lewis',
    'Stephanie Walker',
    'Ryan Hall',
    'Laura Allen',
    'Brandon Young',
    'Rebecca King'
  ];

  useEffect(() => {
    setCurrentAnomaly(anomaly);
  }, [anomaly]);

  if (!currentAnomaly) return null;

  const handleStatusChange = (newStatus: Anomaly['status']) => {
    const updated = { ...currentAnomaly, status: newStatus };
    setCurrentAnomaly(updated);
    onUpdateAnomaly(updated);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      text: commentText,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      parentId: replyingTo || undefined,
    };

    const updated = {
      ...currentAnomaly,
      comments: [...currentAnomaly.comments, newComment]
    };

    setCurrentAnomaly(updated);
    onUpdateAnomaly(updated);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveCommentEdit = (commentId: string) => {
    if (!editCommentText.trim()) return;
    const updated = {
      ...currentAnomaly,
      comments: currentAnomaly.comments.map(c =>
        c.id === commentId ? { ...c, text: editCommentText, editedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } : c
      )
    };
    setCurrentAnomaly(updated);
    onUpdateAnomaly(updated);
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    const hasReplies = currentAnomaly.comments.some(c => c.parentId === commentId && !c.deleted);
    const updated = {
      ...currentAnomaly,
      comments: hasReplies
        ? currentAnomaly.comments.map(c => c.id === commentId ? { ...c, deleted: true } : c)
        : currentAnomaly.comments.filter(c => c.id !== commentId)
    };
    setCurrentAnomaly(updated);
    onUpdateAnomaly(updated);
  };

  const handleToggleAssignee = (ruleName: string, assigneeName: string, role: string) => {
    const key = `${ruleName}:${assigneeName}:${role}`;
    const current = assigneeToggles[key];
    const isCurrentlyToggled = current?.toggled || false;

    if (isCurrentlyToggled) {
      setRemoveSignoffModal({ isOpen: true, key });
    } else {
      setAssigneeToggles(prev => ({
        ...prev,
        [key]: { toggled: true, completedBy: currentUser }
      }));
    }
  };

  const handleRemoveSignoffConfirm = () => {
    if (removeSignoffModal.key) {
      setAssigneeToggles(prev => ({
        ...prev,
        [removeSignoffModal.key!]: { toggled: false, completedBy: '' }
      }));
    }
    setRemoveSignoffModal({ isOpen: false, key: null });
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setEditedPreparers(rule.preparers || []);
    setEditedReviewers(rule.reviewers || []);
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
    setEditedPreparers([]);
    setEditedReviewers([]);
  };

  const handleSaveEdit = (rule: Rule) => {
    const originalPreparers = rule.preparers || [];
    const originalReviewers = rule.reviewers || [];
    const dynamicPreparers = originalPreparers.filter(p => p === 'Dynamic Assignment');
    const dynamicReviewers = originalReviewers.filter(r => r === 'Dynamic Assignment');
    const finalPreparers = [...editedPreparers.filter(p => p !== 'Dynamic Assignment' && p !== ''), ...dynamicPreparers];
    const finalReviewers = [...editedReviewers.filter(r => r !== 'Dynamic Assignment' && r !== ''), ...dynamicReviewers];
    onUpdateRule(rule.id, finalPreparers, finalReviewers);
    setEditingRuleId(null);
    setEditedPreparers([]);
    setEditedReviewers([]);
  };

  const handleAddPreparer = () => {
    setEditedPreparers([...editedPreparers, '']);
  };

  const handleAddReviewer = () => {
    setEditedReviewers([...editedReviewers, '']);
  };

  const handleRemovePreparer = (index: number) => {
    setEditedPreparers(editedPreparers.filter((_, i) => i !== index));
  };

  const handleRemoveReviewer = (index: number) => {
    setEditedReviewers(editedReviewers.filter((_, i) => i !== index));
  };

  const handleUpdatePreparer = (index: number, value: string) => {
    const newPreparers = [...editedPreparers];
    newPreparers[index] = value;
    setEditedPreparers(newPreparers);
  };

  const handleUpdateReviewer = (index: number, value: string) => {
    const newReviewers = [...editedReviewers];
    newReviewers[index] = value;
    setEditedReviewers(newReviewers);
  };

  // Comments — flat chronological list (no threading)
  const allComments = [...currentAnomaly.comments]
    .filter(c => !c.deleted)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const visibleCommentCount = allComments.length;

  // Status badge color
  const statusColors: Record<string, { bg: string; text: string }> = {
    'Open': { bg: 'var(--flo-sem-color-surface-warning-subtle, #fff8eb)', text: 'var(--flo-sem-color-warning, #db7712)' },
    'Investigating': { bg: 'var(--flo-sem-color-surface-info-subtle, #e8f0fe)', text: 'var(--flo-sem-color-info, #3d7bf7)' },
    'Resolved': { bg: 'var(--flo-sem-color-surface-success-subtle, #e6f9ed)', text: 'var(--flo-sem-color-success, #1fac76)' },
  };
  const currentStatusColors = statusColors[currentAnomaly.status] || statusColors['Open'];

  // Triggered rules
  const triggeredRuleNames = Array.isArray(currentAnomaly.triggeredRule)
    ? currentAnomaly.triggeredRule
    : currentAnomaly.triggeredRule ? [currentAnomaly.triggeredRule] : [];
  const matchedRules = rules.filter(r => triggeredRuleNames.includes(r.name));

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  const AVATAR_COLORS = ['#1fac76', '#1976d2', '#e67e22', '#9b59b6', '#e74c3c', '#16a085'];
  const getAvatarColor = (name: string): string => {
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  };
  const ColoredAvatar = ({ name }: { name: string }) => (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: getAvatarColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0, userSelect: 'none' }}>
      {getInitials(name)}
    </div>
  );

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDynamicAssignee = (account: string, role: 'Preparer' | 'Reviewer', ruleOwner: string): { name: string; isFallback: boolean } => {
    const accountPrefix = account.split('-')[0];
    const preparerMappings: Record<string, string> = {
      '1000': 'Michael Chen', '1200': 'Sarah Johnson', '1500': 'Emily Rodriguez',
      '1800': 'David Park', '2100': 'Jessica Lee', '2300': 'Robert Martinez',
      '2800': 'Amanda White', '3200': 'James Wilson', '3500': 'Lisa Thompson',
      '3800': 'Kevin Brown', '4100': 'Maria Garcia', '4200': 'Thomas Anderson',
      '4500': 'Jennifer Taylor', '5000': 'Christopher Davis', '5200': 'Michelle Moore',
      '5500': 'Daniel Jackson', '6200': 'Ashley Martin', '6500': 'Matthew Harris',
      '6800': 'Nicole Clark', '7200': 'Joshua Lewis', '7800': 'Stephanie Walker',
      '8100': 'Ryan Hall', '8500': 'Laura Allen', '9200': 'Brandon Young',
      '9500': 'Rebecca King'
    };
    const reviewerMappings: Record<string, string> = {
      '1000': 'Jennifer Taylor', '1200': 'David Park', '1500': 'Robert Martinez',
      '1800': 'Amanda White', '2100': 'Thomas Anderson', '2300': 'Michelle Moore',
      '2800': 'Daniel Jackson', '3200': 'Nicole Clark', '3500': 'Joshua Lewis',
      '3800': 'Stephanie Walker', '4100': 'Ryan Hall', '4200': 'Laura Allen',
      '4500': 'Brandon Young', '5000': 'Rebecca King', '5200': 'Michael Chen',
      '5500': 'Sarah Johnson', '6200': 'Emily Rodriguez', '6500': 'Jessica Lee',
      '6800': 'James Wilson', '7200': 'Lisa Thompson', '7800': 'Kevin Brown',
      '8100': 'Maria Garcia', '8500': 'Christopher Davis', '9200': 'Matthew Harris',
      '9500': 'Ashley Martin'
    };
    if (role === 'Preparer') {
      const mapped = preparerMappings[accountPrefix];
      return mapped ? { name: mapped, isFallback: false } : { name: ruleOwner, isFallback: true };
    } else {
      const mapped = reviewerMappings[accountPrefix];
      return mapped ? { name: mapped, isFallback: false } : { name: ruleOwner, isFallback: true };
    }
  };

  // Render a single comment — flat stream, no nesting
  const renderComment = (comment: Comment) => {
    const isEditing = editingCommentId === comment.id;

    return (
      <div key={comment.id}>
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[12px] h-[32px]">
            <ColoredAvatar name={comment.author} />
            <div className="flex-1 min-w-0 flex flex-col items-start">
              <div className="flex items-start gap-[4px] w-full">
                <span className="text-[12px] font-semibold leading-[18px] flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-default)' }}>{comment.author}</span>
                {comment.editedAt && (
                  <span className="text-xs italic shrink-0" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>(edited)</span>
                )}
              </div>
              <div className="flex items-center gap-[4px] h-[14px]">
                <span className="text-[10px] font-medium leading-[14px] whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>{comment.timestamp.replace(/,\s*(\d{1,2}:\d{2})/, ' | $1')}</span>
              </div>
            </div>
            <div className="flex items-center gap-[4px] shrink-0">
              <button
                onClick={() => handleEditComment(comment)}
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[50px] transition-colors border-0 bg-transparent p-0 cursor-pointer"
                style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[50px] transition-colors border-0 bg-transparent p-0 cursor-pointer"
                style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                title="Delete"
              >
                <Delete size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start">
            {isEditing ? (
              <div className="space-y-2 w-full">
                <TextArea
                  value={editCommentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditCommentText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveCommentEdit(comment.id)}>Save</Button>
                  <Button size="sm" variant="outlined" color="dark" onClick={() => { setEditingCommentId(null); setEditCommentText(''); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-[12px] leading-[18px] font-normal" style={{ color: 'var(--flo-sem-color-text-default)' }}>{comment.text}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const innerContent = (
    <>
        {/* Status Row */}
        {currentAnomaly.anomalyCount > 0 && (
          <div className="px-[24px] pt-[12px] pb-[4px] flex items-center gap-[8px] flex-shrink-0">
            <span className="text-[12px] font-semibold leading-[18px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>Status</span>
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(v => !v)}
                className="flex items-center gap-[8px] h-[24px] px-[6px] py-[4px] rounded-[4px] border-0 cursor-pointer focus:outline-none"
                style={{ backgroundColor: currentStatusColors.bg }}
              >
                <span className="text-[12px] font-semibold leading-[16px] whitespace-nowrap" style={{ color: currentStatusColors.text }}>
                  {currentAnomaly.status}
                </span>
                <ExpandMore size={20} style={{ color: currentStatusColors.text }} />
              </button>
              {statusDropdownOpen && (
                <div
                  className="absolute top-[28px] left-0 z-50 rounded-[6px] py-[4px]"
                  style={{ background: '#fff', border: '1px solid var(--flo-sem-color-border-default)', boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.12)', minWidth: 160 }}
                >
                  {(['Open', 'Investigating', 'Resolved', 'Dismissed', 'Deleted'] as Anomaly['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => { handleStatusChange(s); setStatusDropdownOpen(false); }}
                      className="w-full text-left px-[12px] py-[8px] text-[12px] font-semibold leading-[16px] border-0 bg-transparent cursor-pointer hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]"
                      style={{ color: 'var(--flo-sem-color-text-default)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deleted from ERP banner */}
        {currentAnomaly.status === 'Deleted' && (
          <div style={{
            padding: '10px 24px', background: 'var(--flo-sem-color-surface-danger-subtle, #fef2f2)', borderBottom: '1px solid var(--flo-sem-color-border-danger, #fecaca)',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--flo-sem-color-danger-emphasis, #991b1b)',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          }}>
            <span>⚠</span>
            <div>
              <strong>Deleted from ERP</strong> — This transaction was removed from the source ERP. Data shown is a preserved snapshot for audit trail purposes. Any changes are for reference only.
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 pt-[16px] pb-6 flex flex-col gap-6">
            {/* Details Section — 5-Column Field Grid */}
            <Accordion type="single" collapsible size="sm" defaultValue="transaction-details">
              <Accordion.Item value="transaction-details">
                <Accordion.Trigger>Transaction Details</Accordion.Trigger>
                <Accordion.Content>
                <div className="pb-[16px]">
                  <div className="flex flex-wrap gap-y-[16px] gap-x-[24px] pt-[8px]">
                {visibleFields.transactionId && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Transaction ID</p>
                    <button
                      onClick={(e) => onTransactionClick?.(e, currentAnomaly.transactionId)}
                      className="text-[12px] font-semibold leading-[18px] underline transition-colors mt-[2px] flex items-center gap-1 border-0 bg-transparent p-0 cursor-pointer"
                      style={{ color: 'var(--flo-sem-color-text-default)' }}
                    >
                      {currentAnomaly.transactionId}
                      <OpenInNew size={12} />
                    </button>
                  </div>
                )}

                {visibleFields.transactionDate && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Transaction Date</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.date}</p>
                  </div>
                )}

                {visibleFields.postingPeriod && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Posting Period</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.postingPeriod || 'February 2026'}</p>
                  </div>
                )}

                {visibleFields.amount && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Amount</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>
                      ${currentAnomaly.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {visibleFields.currency && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Currency</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.currency || 'USD'}</p>
                  </div>
                )}

                {visibleFields.type && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Type</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.entryType}</p>
                  </div>
                )}

                {visibleFields.subsidiary && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Subsidiary</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.entity}</p>
                  </div>
                )}

                {visibleFields.account && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Account</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.account}</p>
                  </div>
                )}

                {visibleFields.name && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Name</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.entity}</p>
                  </div>
                )}

                {visibleFields.memo && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Memo</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.description}</p>
                  </div>
                )}

                {visibleFields.department && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Department</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.department || 'Finance'}</p>
                  </div>
                )}

                {visibleFields.class && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Class</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.class || 'Operations'}</p>
                  </div>
                )}

                {visibleFields.location && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Location</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.location || 'Headquarters'}</p>
                  </div>
                )}

                {visibleFields.createdDate && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Created Date</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.date}</p>
                  </div>
                )}

                {visibleFields.createdBy && (
                  <div className="w-[236px]">
                    <p className="text-xs font-medium leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Created By</p>
                    <p className="text-[12px] font-semibold leading-[18px] mt-[2px]" style={{ color: 'var(--flo-sem-color-text-default)' }}>{currentAnomaly.createdBy || 'Sarah Johnson'}</p>
                  </div>
                )}
                  </div>
                  {/* Configure button — inside content per Design Bar principle (not in header) */}
                  {onOpenFieldSettings && (
                    <div style={{ marginTop: 12 }}>
                      <Button variant="outlined" color="dark" size="sm" onClick={onOpenFieldSettings}>
                        Configure Fields
                      </Button>
                    </div>
                  )}
                </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>

            {/* Bottom Half — Two-Column Split: Anomalies + Comments */}
            <div className="flex" style={{ minHeight: '300px', borderTop: '1px solid var(--flo-sem-color-border-default)', borderBottom: '1px solid var(--flo-sem-color-border-default)' }}>
              {/* Anomalies Column */}
              <div className="flex flex-col flex-1 pt-[16px] pb-[24px] gap-[24px] overflow-y-auto">
                <p className="text-[16px] font-bold leading-[20px]" style={{ color: 'var(--flo-sem-color-text-default)', fontFamily: "'Museo_Sans', sans-serif" }}>
                  Anomalies ({matchedRules.length})
                </p>
                <div className="flex flex-col gap-[24px] overflow-y-auto">
                  {matchedRules.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>No anomalies triggered.</p>
                  ) : (
                    matchedRules.map((rule) => {
                      const isEditing = editingRuleId === rule.id;
                      const preparers = isEditing ? editedPreparers : (rule.preparers || []);
                      const reviewers = isEditing ? editedReviewers : (rule.reviewers || []);
                      const allAssignees: Array<{ name: string; role: 'Preparer' | 'Reviewer'; index: number }> = [
                        ...preparers.map((name, index) => ({ name, role: 'Preparer' as const, index })),
                        ...reviewers.map((name, index) => ({ name, role: 'Reviewer' as const, index }))
                      ];

                      return (
                        <div key={rule.id} className="rounded-[6px] bg-white overflow-hidden" style={{ border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                          <Accordion type="single" collapsible size="sm" variant="standard" defaultValue={rule.id}>
                            <Accordion.Item value={rule.id} style={{ border: 'none' }}>
                              <Accordion.Trigger style={{ borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', height: 40, padding: '0 16px' }}>
                                <div className="flex items-center gap-2 w-full min-w-0">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onRuleClick?.(rule.name); }}
                                    className="text-[12px] leading-[18px] hover:underline text-left flex-1 truncate border-0 bg-transparent p-0 cursor-pointer min-w-0"
                                    style={{ color: '#1D2433', fontFamily: "'Museo_Sans', sans-serif", fontWeight: 700 }}
                                  >
                                    {rule.name}
                                  </button>
                                  {!isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleEditRule(rule); }}
                                      className="w-[20px] h-[20px] flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer flex-shrink-0"
                                      style={{ color: 'var(--flo-sem-color-text-tertiary)' }}
                                      title="Edit assignees"
                                    >
                                      <MoreVert size={16} />
                                    </button>
                                  )}
                                </div>
                              </Accordion.Trigger>
                              <Accordion.Content>
                            <div className="px-[16px]">
                              {allAssignees.map((assignee, idx) => {
                                const isDynamic = assignee.name === 'Dynamic Assignment';
                                const dynamicResult = isDynamic ? getDynamicAssignee(currentAnomaly.account, assignee.role, rule.ruleOwner) : null;
                                const displayName = isDynamic ? dynamicResult!.name : assignee.name;
                                const isFallbackAssignment = isDynamic && dynamicResult?.isFallback;
                                const key = `${rule.name}:${assignee.name}:${assignee.role}`;
                                const toggleInfo = assigneeToggles[key];
                                const isToggled = toggleInfo?.toggled || false;
                                const completedBy = toggleInfo?.completedBy || '';
                                const isOverride = isToggled && completedBy !== displayName;

                                if (isEditing && !isToggled && !isDynamic) {
                                  const allSelectedAssignees = [...editedPreparers, ...editedReviewers].filter(name => name !== '');
                                  const availableUsers = users.filter(user =>
                                    !allSelectedAssignees.includes(user) || user === assignee.name
                                  );

                                  return (
                                    <div key={idx} className="flex items-center gap-3">
                                      <div className="flex-1 flex items-center gap-3">
                                        <div className="flex-1">
                                          <Select
                                            value={assignee.name}
                                            onChange={(val: string) => {
                                              if (assignee.role === 'Preparer') {
                                                handleUpdatePreparer(assignee.index, val);
                                              } else {
                                                handleUpdateReviewer(assignee.index, val);
                                              }
                                            }}
                                            options={[
                                              { value: '', label: 'Select assignee...' },
                                              ...availableUsers.map((user) => ({ value: user, label: user })),
                                            ]}
                                            disableClear
                                          />
                                        </div>
                                        <span className="text-xs w-20" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>{assignee.role}</span>
                                        <button
                                          onClick={() => {
                                            if (assignee.role === 'Preparer') {
                                              handleRemovePreparer(assignee.index);
                                            } else {
                                              handleRemoveReviewer(assignee.index);
                                            }
                                          }}
                                          className="text-red-500 hover:text-red-700 transition-colors"
                                          title="Remove"
                                        >
                                          <Delete size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={idx} className="flex items-center gap-[12px] py-[12px]" style={isDynamic ? {
                                    background: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)', borderRadius: 6, padding: '8px 12px', margin: '0 -12px',
                                    border: '1px solid var(--flo-sem-color-border-success, #b8e6d4)',
                                  } : undefined}>
                                    <ColoredAvatar name={displayName} />
                                    <div className="flex-1 min-w-0 flex gap-[4px] items-start">
                                      <div className="flex-1 flex flex-col items-start min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-[12px] font-semibold leading-[18px] truncate" style={{ color: 'var(--flo-sem-color-text-default)' }}>{displayName}</p>
                                        {isOverride && (
                                          <Tooltip>
                                            <Tooltip.Trigger>
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Override
                                              </span>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content side="top" hasArrow size="sm">
                                              {completedBy} completed this task but it is assigned to {displayName}.
                                            </Tooltip.Content>
                                          </Tooltip>
                                        )}
                                      </div>
                                      {isToggled ? (
                                        <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>
                                          <Done size={12} color="var(--flo-sem-color-content-success-medium)" />
                                          <span>{getTodayDate()}</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1.5">
                                          <p className="text-[10px] font-medium leading-[14px]" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>{assignee.role}</p>
                                          {isDynamic && (
                                            <Tooltip>
                                              <Tooltip.Trigger>
                                                <AutoAwesome size={14} color="var(--flo-base-color-purple-600)" />
                                              </Tooltip.Trigger>
                                              <Tooltip.Content side="top" hasArrow size="sm">
                                                {isFallbackAssignment
                                                  ? `Dynamic assignment was unable to determine which user should be assigned, so it was assigned to the Rule Owner (${rule.ruleOwner}) instead. The assignment can be updated as needed.`
                                                  : `This assignment was dynamically generated based on ${currentAnomaly.account}`
                                                }
                                              </Tooltip.Content>
                                            </Tooltip>
                                          )}
                                        </div>
                                      )}
                                      </div>
                                      {!isEditing && (
                                        <div className="flex items-start justify-end py-[4px] shrink-0">
                                          <Toggle
                                            checked={isToggled}
                                            onChange={() => handleToggleAssignee(rule.name, assignee.name, assignee.role)}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {isEditing && (
                                <div className="mt-3 space-y-3">
                                  <div className="flex gap-2">
                                    <Button variant="outlined" color="dark" onClick={handleAddPreparer} size="sm">
                                      Add Preparer
                                    </Button>
                                    <Button variant="outlined" color="dark" onClick={handleAddReviewer} size="sm">
                                      Add Reviewer
                                    </Button>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleSaveEdit(rule)}
                                      disabled={editedPreparers.filter(p => p !== '').length === 0 || editedReviewers.filter(r => r !== '').length === 0}
                                      size="sm"
                                    >
                                      Save
                                    </Button>
                                    <Button variant="outlined" color="dark" onClick={handleCancelEdit} size="sm">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                              </Accordion.Content>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Comments Column */}
              <div className="flex flex-col flex-1 pt-[16px]" style={{ borderLeft: '1px solid var(--flo-sem-color-border-default)' }}>
                <p className="text-[16px] font-bold leading-[20px] pl-[16px]" style={{ color: 'var(--flo-sem-color-text-default)', fontFamily: "'Museo_Sans', sans-serif" }}>
                  Comments ({visibleCommentCount})
                </p>
                <div className="flex-1 overflow-y-auto pl-[16px] pt-[16px]">
                  {allComments.length === 0 ? (
                    <p className="text-[12px]" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>No comments yet.</p>
                  ) : (
                    <div className="flex flex-col gap-[20px]">
                      {allComments.map(comment => renderComment(comment))}
                    </div>
                  )}
                </div>

                {/* New top-level comment input */}
                {!replyingTo && (
                  <div className="flex gap-[8px] items-start pl-[16px] pr-[24px] py-[16px] flex-shrink-0" style={{ backgroundColor: 'var(--flo-sem-color-surface-secondary, #f8fafc)', borderTop: '1px solid var(--flo-sem-color-border-default)' }}>
                    <ColoredAvatar name={currentUser} />
                    <div className="flex-1 flex flex-col bg-white rounded-[6px] p-[8px]" style={{ height: 150, border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Reply"
                        className="flex-1 resize-none border-0 outline-none bg-transparent text-[11px] font-normal leading-[16px] w-full placeholder:text-[var(--flo-sem-color-text-tertiary,#adb2bb)]"
                        style={{ color: 'var(--flo-sem-color-text-default)' }}
                      />
                      <div className="flex items-end justify-end flex-shrink-0">
                        <button
                          onClick={handlePostComment}
                          disabled={!commentText.trim()}
                          className="text-[12px] font-semibold leading-[16px] px-[12px] py-[8px] rounded-[6px] border-0 bg-transparent cursor-pointer"
                          style={{ color: commentText.trim() ? 'var(--flo-sem-color-text-tertiary)' : 'rgba(107,114,128,0.3)' }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Log — moved to separate flex tab per Design Bar consensus (Steve/Benjamin) */}
            {/* "having it a separate panel that is interactive with I'm seeing the transaction detail" */}
          </div>
        </div>
    </>
  );

  if (inline) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {innerContent}
        <RemoveSignoffModal
          isOpen={removeSignoffModal.isOpen}
          onClose={() => setRemoveSignoffModal({ isOpen: false, key: null })}
          onConfirm={handleRemoveSignoffConfirm}
        />
      </div>
    );
  }

  return (
    <SideDrawer show={!!currentAnomaly} onCancel={onClose} width="md" renderOverlay>
      {innerContent}
      <RemoveSignoffModal
        isOpen={removeSignoffModal.isOpen}
        onClose={() => setRemoveSignoffModal({ isOpen: false, key: null })}
        onConfirm={handleRemoveSignoffConfirm}
      />
    </SideDrawer>
  );
}
