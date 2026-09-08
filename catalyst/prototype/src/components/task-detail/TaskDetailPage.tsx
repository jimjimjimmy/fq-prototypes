import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, ChevronDown, Search, Folder, Pin } from 'lucide-react';
import { useTaskStore } from '@/runtime/TaskStore';
import { AIWorkspaceLinear } from '../AIWorkspaceLinear';
import { WorkflowCard } from '../WorkflowCard';
import { WorkflowProgressTracker } from './WorkflowProgressTracker';
import { ItemDetailsCard } from './ItemDetailsCard';
import { TaskReviewNotes } from './TaskReviewNotes';
import { TaskAttachments } from './TaskAttachments';
import { PostMortemInsight } from './PostMortemInsight';

interface TaskDetailPageProps {
  taskId: number;
  onBack: () => void;
  entrySource?: 'home' | 'tasks' | 'workspace' | 'search';
  workspaceSection?: string;
}

export function TaskDetailPage({ taskId, onBack, entrySource = 'workspace', workspaceSection = 'Entity Reconciliation' }: TaskDetailPageProps) {
  const { getTask, getTaskDetail, dispatch } = useTaskStore();
  const task = getTask(taskId);
  const detail = getTaskDetail(taskId);

  const [showBreadcrumbDropdown, setShowBreadcrumbDropdown] = useState(false);

  if (!task || !detail) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-['Inter',sans-serif] font-medium text-[14px] text-[#475467]">Task not found</p>
      </div>
    );
  }

  const isSignedOff = detail.isSignedOff ?? false;
  const journalEntrySubmitted = detail.journalEntrySubmitted ?? false;

  const handleSignOff = () => {
    dispatch({ type: 'TOGGLE_SIGN_OFF', taskId });
  };

  const handleJournalEntrySubmitted = () => {
    dispatch({ type: 'SUBMIT_JOURNAL_ENTRY', taskId });
  };

  // Build breadcrumb path
  const breadcrumbPath = (() => {
    switch (entrySource) {
      case 'home': return [{ label: 'Home', onClick: onBack }];
      case 'tasks': return [{ label: 'Tasks', onClick: onBack }];
      case 'workspace': return [{ label: 'Close Workspace', onClick: onBack }, { label: workspaceSection, onClick: onBack }];
      case 'search': return [{ label: 'Search Results', onClick: onBack }];
      default: return [{ label: 'Close Workspace', onClick: onBack }];
    }
  })();

  // Build pinned views and hierarchy from detail config
  const pinnedViews = detail.folder === 'Intercompany Reconciliations'
    ? [
        { id: '1', label: 'Reconciliation Summary', icon: Pin },
        { id: '2', label: 'Variance Detail', icon: Pin },
        { id: '3', label: 'Supporting Documents', icon: Pin },
      ]
    : [];

  const taskHierarchy = detail.folder === 'Intercompany Reconciliations'
    ? [{
        id: 'parent',
        label: 'Intercompany Reconciliations',
        isCurrent: false,
        children: [
          { id: 'current', label: detail.title, isCurrent: true },
          { id: 'sibling1', label: 'UK/EU IC Reconciliation', isCurrent: false },
          { id: 'sibling2', label: 'APAC IC Reconciliation', isCurrent: false },
        ],
      }]
    : [];

  // Build task object for legacy AIWorkspaceLinear / WorkflowCard compatibility
  const legacyTask = {
    id: String(taskId),
    title: detail.title,
    status: task.status === 'Ready for Review' ? 'Ready for review' as const : task.status as any,
    currentStage: detail.currentStage as any,
    period: detail.period,
    dueDate: task.dueDate,
    entity: detail.entity,
    folder: detail.folder,
    frequency: detail.frequency,
    assignee: detail.assignees[0]?.name ?? '',
    assigneeInitials: detail.assignees[0]?.initials ?? '',
    assigneeRole: detail.assignees[0]?.role ?? '',
    assignees: detail.assignees,
    preparedByAgent: detail.preparedByAgent ?? '',
    criticalPath: detail.criticalPath ?? { isOnPath: false, downstreamTasks: 0, pathDescription: '', upstream: [], downstream: [] },
    description: detail.description,
    workflowStages: detail.workflowStages,
    whySurfaced: detail.whySurfaced ?? '',
    systemVerified: detail.systemVerified ?? [],
    aiPreparedWork: detail.aiPreparedWork ?? [],
    nextActionSteps: detail.nextActionSteps ?? [],
    supportingEvidence: detail.supportingEvidence ?? [],
    systemVerifiedSignals: detail.systemVerifiedSignals ?? [],
    aiVerifiedItems: detail.aiVerifiedItems ?? [],
    requiresHumanReview: detail.requiresHumanReview ?? [],
    reviewRationale: detail.reviewRationale ?? '',
    attachments: detail.attachments ?? [],
    reviewNotes: detail.reviewNotes ?? [],
    recommendedAutomations: detail.recommendedAutomations ?? [],
    automationInsight: detail.automationInsight ?? { aiPreparedWork: [], humanReviewedWork: [], futureImprovements: [] },
    subtasks: detail.subtasks ?? [],
    dependencies: detail.dependencies ?? [],
  };

  const hasAIWorkspace = !!detail.preparedByAgent && detail.tier <= 2;

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-gradient-to-b from-[#f8faf9] via-[#f0f5f3] via-50% to-[#e8f2ed]">
      <div className="w-full max-w-[1360px] mx-auto px-[34px] flex flex-col pb-[48px]">

        {/* Back Navigation spacer */}
        <div className="pt-[24px] pb-[16px]" />

        {/* Breadcrumb Navigation */}
        <div className="pb-[20px] relative">
          <div className="flex items-center gap-[8px]">
            {breadcrumbPath.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-[8px]">
                <button onClick={crumb.onClick} className="font-['Inter',sans-serif] font-medium text-[13px] text-[#667085] hover:text-[#101828] transition-colors">
                  {crumb.label}
                </button>
                <ChevronRight className="w-[14px] h-[14px] text-[#d1d5db]" />
              </div>
            ))}

            <div className="relative">
              <button
                onClick={() => setShowBreadcrumbDropdown(!showBreadcrumbDropdown)}
                className="flex items-center gap-[6px] font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] hover:text-[#047857] transition-colors group max-w-[400px]"
              >
                <span className="truncate">{detail.title}</span>
                <ChevronDown className={`w-[14px] h-[14px] shrink-0 transition-transform ${showBreadcrumbDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showBreadcrumbDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowBreadcrumbDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[calc(100%+8px)] z-50 w-[350px] bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      <div className="p-[16px] border-b border-[#f3f4f6]">
                        <div className="relative">
                          <Search className="absolute left-[12px] top-[50%] translate-y-[-50%] w-[16px] h-[16px] text-[#9ca3af]" />
                          <input type="text" placeholder="Search for a path or view…" className="w-full pl-[38px] pr-[12px] py-[9px] border border-[#d1d5db] rounded-[8px] font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent" />
                        </div>
                      </div>

                      <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
                        {pinnedViews.length > 0 && (
                          <div className="px-[16px] py-[12px] border-b border-[#f3f4f6]">
                            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[10px]">Pinned Views</p>
                            <div className="space-y-[4px]">
                              {pinnedViews.map((item) => (
                                <button key={item.id} onClick={() => setShowBreadcrumbDropdown(false)} className="w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[6px] hover:bg-[#f9fafb] transition-colors group">
                                  <item.icon className="w-[14px] h-[14px] text-[#9ca3af] group-hover:text-[#047857] shrink-0" />
                                  <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[#475467] group-hover:text-[#101828]">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {taskHierarchy.length > 0 && (
                          <div className="px-[16px] py-[12px]">
                            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[10px]">Hierarchy</p>
                            <div className="space-y-[2px]">
                              {taskHierarchy.map((section) => (
                                <div key={section.id}>
                                  <button onClick={() => setShowBreadcrumbDropdown(false)} className="w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[6px] hover:bg-[#f9fafb] transition-colors group">
                                    <Folder className="w-[14px] h-[14px] text-[#9ca3af] group-hover:text-[#047857] shrink-0" />
                                    <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[#475467] group-hover:text-[#101828]">{section.label}</span>
                                  </button>
                                  {section.children?.map((child) => (
                                    <button key={child.id} onClick={() => setShowBreadcrumbDropdown(false)} className={`w-full flex items-center gap-[10px] px-[10px] py-[8px] ml-[14px] rounded-[6px] transition-colors group ${child.isCurrent ? 'bg-[rgba(4,120,87,0.04)] border border-[rgba(4,120,87,0.1)]' : 'hover:bg-[#f9fafb]'}`}>
                                      <Folder className={`w-[14px] h-[14px] shrink-0 ${child.isCurrent ? 'text-[#047857]' : 'text-[#9ca3af] group-hover:text-[#047857]'}`} />
                                      <span className={`font-['Inter',sans-serif] font-${child.isCurrent ? 'semibold' : 'medium'} text-[13px] truncate ${child.isCurrent ? 'text-[#047857]' : 'text-[#475467] group-hover:text-[#101828]'}`}>{child.label}</span>
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Task Header */}
        <motion.div className="pb-[24px]" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex-1">
              <div className="flex items-center gap-[12px] mb-[6px]">
                <h1 className="font-['Inter',sans-serif] font-semibold text-[24px] leading-[32px] text-[#101828]">{detail.title}</h1>
                <span className={`px-[10px] py-[4px] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[12px] ${
                  task.status === 'Complete' ? 'bg-[#e3f5e6] text-[#2a6a39]' :
                  task.status === 'Blocked' ? 'bg-[#fdebd7] text-[#e15015]' :
                  task.status === 'In Progress' ? 'bg-[#e3edf6] text-[#507fc0]' :
                  'bg-[#f4eef9] text-[#73418a]'
                }`}>{task.status}</span>
              </div>
              {detail.preparedByAgent && (
                <p className="font-['Inter',sans-serif] font-medium text-[13px] leading-[18px] text-[#475467]">
                  Prepared by <span className="text-[#047857] font-semibold">{detail.preparedByAgent}</span>
                </p>
              )}
            </div>
            {isSignedOff ? (
              <div className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[8px] bg-[#e3f5e6] text-[#2a6a39] shrink-0">
                <Check className="w-[16px] h-[16px]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[14px]">Signed off</span>
              </div>
            ) : (
              <button
                onClick={() => { if (journalEntrySubmitted) handleSignOff(); }}
                disabled={!journalEntrySubmitted}
                className={`flex items-center gap-[8px] px-[20px] py-[10px] rounded-[8px] transition-all shrink-0 ${
                  journalEntrySubmitted ? 'bg-[#047857] hover:bg-[#065f46] text-white shadow-sm cursor-pointer' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                <Check className="w-[16px] h-[16px]" />
                <span className="font-['Inter',sans-serif] font-semibold text-[14px]">Sign-off task</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* ABOVE THE FOLD: AI Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-[24px] mb-[40px]">
          <div className="space-y-[16px]">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
              <WorkflowProgressTracker stages={detail.workflowStages} />
            </motion.div>

            {hasAIWorkspace && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <AIWorkspaceLinear
                  task={legacyTask}
                  isSignedOff={isSignedOff}
                  onSignOff={handleSignOff}
                  onDismiss={onBack}
                  onJournalEntrySubmitted={handleJournalEntrySubmitted}
                />
              </motion.div>
            )}

            <AnimatePresence>
              {isSignedOff && detail.automationInsight && (
                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}>
                  <PostMortemInsight insight={detail.automationInsight} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-[20px]">
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <ItemDetailsCard detail={detail} dueDate={task.dueDate} taskStatus={task.status} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <WorkflowCard task={legacyTask} />
            </motion.div>
          </div>
        </div>

        {/* BELOW THE FOLD: Audit Detail Area */}
        <motion.div className="space-y-[24px] pt-[24px] border-t-[2px] border-[#e4e7ec]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]" />

          {(detail.reviewNotes?.length || detail.attachments?.length) ? (
            <div className="grid grid-cols-1 lg:grid-cols-[70fr_30fr] gap-[24px]">
              {detail.reviewNotes && detail.reviewNotes.length > 0 && (
                <TaskReviewNotes notes={detail.reviewNotes} />
              )}
              {detail.attachments && detail.attachments.length > 0 && (
                <TaskAttachments attachments={detail.attachments} />
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
