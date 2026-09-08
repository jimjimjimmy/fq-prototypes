import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Clock, AlertCircle, User, Paperclip, MessageSquare, ChevronRight, Sparkles, X, FileText, Download, Upload, Calendar, Building2, ChevronDown, Search, Folder, Pin } from 'lucide-react';
import svgPaths from "../imports/svg-ni0ebo43wn";
import { AIWorkspaceLinear } from './AIWorkspaceLinear';
import { WorkflowCard } from './WorkflowCard';

interface TaskDetailProps {
  taskId: string;
  onBack: () => void;
  entrySource?: 'home' | 'tasks' | 'workspace' | 'search';
  workspaceSection?: string;
}

interface ReviewNote {
  id: string;
  author: string;
  initials: string;
  time: string;
  message: string;
  isAgent?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  isAgentGenerated?: boolean;
}

export function TaskDetailPage({ taskId, onBack, entrySource = 'workspace', workspaceSection = 'Entity Reconciliation' }: TaskDetailProps) {
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [expandedAttachments, setExpandedAttachments] = useState(false);
  const [showSupportingEvidence, setShowSupportingEvidence] = useState(false);
  const [journalEntrySubmitted, setJournalEntrySubmitted] = useState(false);
  const [showBreadcrumbDropdown, setShowBreadcrumbDropdown] = useState(false);

  // Realistic accounting task data
  const task = {
    id: taskId,
    title: 'Intercompany Variance — UK/US Ledger Reconciliation',
    status: 'Ready for review' as const,
    currentStage: 'review' as const,
    period: 'February 2026',
    dueDate: '3/3/2026',
    entity: 'Intacct',
    folder: 'Intercompany Reconciliations',
    frequency: 'Monthly',
    assignee: 'James Wilson',
    assigneeInitials: 'JW',
    assigneeRole: 'Staff Accountant',
    assignees: [
      { name: 'James Wilson', initials: 'JW', role: 'Staff Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Michael Chen', initials: 'MC', role: 'Accounting Manager', badge: 'Reviewer' },
      { name: 'Katherine Johnson', initials: 'KJ', role: 'Senior Accountant', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Intercompany Reconciliation Agent',
    criticalPath: { 
      isOnPath: true, 
      downstreamTasks: 2,
      pathDescription: 'IC Reconciliation (You) → Consolidation Eliminations (Blocked) → Board Reporting (Blocked)',
      upstream: [
        { task: 'UK Revenue Recognition', status: 'complete', time: '9:15 AM' }
      ],
      downstream: [
        { task: 'Consolidation Eliminations', status: 'blocked', assignee: 'M. Chen' },
        { task: 'Board Reporting', status: 'blocked', assignee: 'Finance Team' }
      ]
    },
    description: 'Reconcile intercompany transactions between UK and US entities for January 2026. Validate foreign exchange calculations, ensure proper elimination entries are prepared, and verify all supporting documentation is complete for consolidation.',
    
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Validated', status: 'complete', agent: 'IC Validation Agent' },
      { id: 'categorize', label: 'Variance Identified', status: 'complete', agent: 'IC Reconciliation Agent' },
      { id: 'review', label: 'Ready for Review', status: 'current', agent: 'You' }
    ],

    whySurfaced: 'Surfaced because this variance blocks consolidation eliminations and downstream board reporting.',

    systemVerified: [
      'FX rate validated against Reuters feed (1.30 GBP/USD)',
      'Invoice #INV-2026-0147 matched to PO system',
      'No material threshold breaches detected'
    ],

    aiPreparedWork: [
      'Intercompany variance identified and analyzed',
      'Draft bridge journal entry prepared (JE-2026-0147)',
      'Supporting evidence assembled from both entities'
    ],

    nextActionSteps: [
      'Validate variance reconciliation',
      'Review draft bridge journal entry',
      'Submit for controller approval'
    ],

    supportingEvidence: [
      { 
        section: 'UK Entity (Source)',
        items: [
          { label: 'Invoice #', value: 'INV-2026-0147' },
          { label: 'Date', value: 'Jan 31, 2026' },
          { label: 'Amount (GBP)', value: '£24,500.00' }
        ]
      },
      { 
        section: 'US Entity (Ledger)',
        items: [
          { label: 'GL Account', value: '7000-IC-UK' },
          { label: 'Period', value: 'Jan 2026' },
          { label: 'Amount (USD)', value: '$31,850.00' }
        ]
      },
      { 
        section: 'Variance Analysis',
        items: [
          { label: 'Expected (FX: 1.30)', value: '$31,850.00' },
          { label: 'Variance Identified', value: '$0.00 Variance within threshold' },
          { label: 'Proposed Entry', value: 'Dr Intercompany Receivable UK\nCr Intercompany Payable US' }
        ]
      }
    ],

    systemVerifiedSignals: [
      'FX rate matches historical Reuters feed pattern',
      'Invoice reference validated in UK ERP system',
      'No material threshold breaches detected',
      'Account balances reconciled across both entities'
    ],

    aiVerifiedItems: [
      'UK invoice INV-2026-0147 matched to US intercompany receivable',
      'FX calculation verified: £24,500 × 1.30 = $31,850',
      'Both entity GL accounts validated for intercompany posting'
    ],

    requiresHumanReview: [
      'Approve bridge entry allocation method',
      'Verify entity-level GL posting accounts'
    ],

    reviewRationale: 'AI has completed intercompany variance analysis and FX validation. Your review ensures the bridge entry methodology is appropriate and that both UK and US entity GL accounts are correctly mapped for consolidation elimination.',

    attachments: [
      { id: '1', name: 'UK_Invoice_INV-2026-0147.pdf', size: '284 KB', type: 'pdf', isAgentGenerated: false },
      { id: '2', name: 'US_Ledger_Extract_Jan2026.xlsx', size: '156 KB', type: 'excel', isAgentGenerated: true },
      { id: '3', name: 'FX_Rate_Validation_Report.pdf', size: '189 KB', type: 'pdf', isAgentGenerated: true },
      { id: '4', name: 'Bridge_JE_Draft_JE-2026-0147.xlsx', size: '92 KB', type: 'excel', isAgentGenerated: true },
      { id: '5', name: 'IC_Reconciliation_Summary.pdf', size: '412 KB', type: 'pdf', isAgentGenerated: true }
    ] as Attachment[],

    reviewNotes: [
      {
        id: '1',
        author: 'Intercompany Reconciliation Agent',
        initials: 'AI',
        time: '2 hours ago',
        message: 'Identified UK invoice INV-2026-0147 (£24,500) posted to US ledger account 7000-IC-UK. FX rate validated at 1.30 GBP/USD per Reuters feed. Calculated expected USD amount: $31,850. Variance detected: $0.00. Bridge journal entry drafted for consolidation elimination.',
        isAgent: true
      },
      {
        id: '2',
        author: 'Sarah Lin',
        initials: 'SL',
        time: '1 hour ago',
        message: 'Verified the FX rate against our January rate table - 1.30 is correct for the transaction date. UK invoice documentation looks complete.'
      },
      {
        id: '3',
        author: 'Katherine Johnson',
        initials: 'KJ',
        time: '25 min ago',
        message: 'Reviewing the bridge entry now. GL account mapping looks appropriate for both entities. Will validate elimination methodology and approve for posting.'
      }
    ] as ReviewNote[],

    recommendedAutomations: [
      {
        id: '1',
        title: 'Automate Intercompany Matching',
        description: 'Enable real-time matching of intercompany invoices across UK and US entities to reduce manual reconciliation time.',
        confidence: 'High',
        timeSaved: '~3 hours/month'
      },
      {
        id: '2',
        title: 'FX Rate Auto-Validation',
        description: 'Automatically validate foreign exchange rates against Reuters feed for all intercompany transactions.',
        confidence: 'High',
        timeSaved: '~1.5 hours/month'
      },
      {
        id: '3',
        title: 'Bridge Entry Auto-Generation',
        description: 'Automatically generate and queue bridge journal entries for intercompany variances under $50K threshold.',
        confidence: 'Medium',
        timeSaved: '~2 hours/month'
      }
    ],

    automationInsight: {
      aiPreparedWork: [
        'Matched UK invoice to US ledger intercompany account',
        'Validated FX rate calculation against Reuters feed',
        'Generated bridge journal entry for elimination',
        'Assembled supporting documentation from both entities'
      ],
      humanReviewedWork: [
        'Approved bridge entry allocation methodology',
        'Verified GL account mapping for both entities'
      ],
      futureImprovements: [
        'Implement automated intercompany invoice matching at transaction level',
        'Enable real-time FX rate validation during invoice entry',
        'Add automated bridge entry posting for low-materiality variances'
      ]
    },

    subtasks: [
      {
        id: '1',
        title: 'Validate FX Rate Against Reuters Feed',
        status: 'complete' as const,
        assignee: 'James Wilson',
        assigneeInitials: 'JW',
        dueDate: 'Feb 27'
      },
      {
        id: '2',
        title: 'Cross-Reference UK Invoice to PO System',
        status: 'complete' as const,
        assignee: 'James Wilson',
        assigneeInitials: 'JW',
        dueDate: 'Feb 27'
      },
      {
        id: '3',
        title: 'Review Draft Bridge JE for Accuracy',
        status: 'in-progress' as const,
        assignee: 'James Wilson',
        assigneeInitials: 'JW',
        dueDate: 'Mar 3'
      },
      {
        id: '4',
        title: 'Verify GL Account Mapping (UK/US)',
        status: 'pending' as const,
        assignee: 'James Wilson',
        assigneeInitials: 'KJ',
        dueDate: 'Mar 3'
      },
      {
        id: '5',
        title: 'Reviewer Final Approval',
        status: 'pending' as const,
        assignee: 'Michael Chen',
        assigneeInitials: 'MC',
        dueDate: 'Mar 4'
      }
    ],

    dependencies: [
      {
        id: '1',
        taskName: 'UK Revenue Recognition — Jan 2026',
        type: 'blocked-by' as const,
        status: 'complete' as const,
        assignee: 'Emma Wilson',
        assigneeInitials: 'EW'
      },
      {
        id: '2',
        taskName: 'Consolidation Eliminations',
        type: 'blocking' as const,
        status: 'blocked' as const,
        assignee: 'Tyler Davis',
        assigneeInitials: 'MC'
      },
      {
        id: '3',
        taskName: 'Board Reporting Package',
        type: 'blocking' as const,
        status: 'blocked' as const,
        assignee: 'David Martinez',
        assigneeInitials: 'DM'
      },
      {
        id: '4',
        taskName: 'FX Rate Validation Automation',
        type: 'related-to' as const,
        status: 'in-progress' as const,
        assignee: 'IT Team',
        assigneeInitials: 'IT'
      }
    ]
  };

  const handleSignOff = () => {
    setIsSignedOff(true);
  };

  const handleDismiss = () => {
    onBack();
  };

  // Generate dynamic breadcrumb path based on entry source
  const getBreadcrumbPath = () => {
    switch (entrySource) {
      case 'home':
        return [{ label: 'Home', onClick: onBack }];
      case 'tasks':
        return [{ label: 'Tasks', onClick: onBack }];
      case 'workspace':
        return [
          { label: 'Close Workspace', onClick: onBack },
          { label: workspaceSection, onClick: onBack }
        ];
      case 'search':
        return [{ label: 'Search Results', onClick: onBack }];
      default:
        return [{ label: 'Close Workspace', onClick: onBack }];
    }
  };

  // Generate task-specific pinned views based on task type
  const getPinnedViews = () => {
    // For intercompany reconciliation tasks, show relevant views
    if (task.folder === 'Intercompany Reconciliations') {
      return [
        { id: '1', label: 'Reconciliation Summary', icon: Pin },
        { id: '2', label: 'Variance Detail', icon: Pin },
        { id: '3', label: 'Supporting Documents', icon: Pin }
      ];
    }
    // Default fallback
    return [];
  };

  // Generate contextual hierarchy based on task location
  const getTaskHierarchy = () => {
    // Build hierarchy based on task's folder/entity structure
    const hierarchy = [];
    
    // Parent section (based on folder)
    if (task.folder === 'Intercompany Reconciliations') {
      hierarchy.push({
        id: 'parent',
        label: 'Intercompany Reconciliations',
        isCurrent: false,
        children: [
          {
            id: 'current',
            label: task.title,
            isCurrent: true
          },
          {
            id: 'sibling1',
            label: 'UK/EU IC Reconciliation',
            isCurrent: false
          },
          {
            id: 'sibling2',
            label: 'APAC IC Reconciliation',
            isCurrent: false
          }
        ]
      });
    }

    return hierarchy;
  };

  const breadcrumbPath = getBreadcrumbPath();
  const pinnedViews = getPinnedViews();
  const taskHierarchy = getTaskHierarchy();

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-gradient-to-b from-[#f8faf9] via-[#f0f5f3] via-50% to-[#e8f2ed]">
      {/* Max-width container */}
      <div className="w-full max-w-[1360px] mx-auto px-[34px] flex flex-col pb-[48px]">
        
        {/* Back Navigation */}
        <div className="pt-[24px] pb-[16px]">
          
        </div>

        {/* Breadcrumb Navigation */}
        <div className="pb-[20px] relative">
          <div className="flex items-center gap-[8px]">
            {/* Dynamic Breadcrumb Path */}
            {breadcrumbPath.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-[8px]">
                <button 
                  onClick={crumb.onClick}
                  className="font-['Inter',sans-serif] font-medium text-[13px] text-[#667085] hover:text-[#101828] transition-colors"
                >
                  {crumb.label}
                </button>
                <ChevronRight className="w-[14px] h-[14px] text-[#d1d5db]" />
              </div>
            ))}
            
            {/* Current Task (with dropdown) */}
            <div className="relative">
              <button
                onClick={() => setShowBreadcrumbDropdown(!showBreadcrumbDropdown)}
                className="flex items-center gap-[6px] font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] hover:text-[#047857] transition-colors group max-w-[400px]"
              >
                <span className="truncate">{task.title}</span>
                <ChevronDown className={`w-[14px] h-[14px] shrink-0 transition-transform ${showBreadcrumbDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {showBreadcrumbDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowBreadcrumbDropdown(false)}
                    />
                    
                    {/* Dropdown Content */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[calc(100%+8px)] z-50 w-[350px] bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      {/* AI Search Section */}
                      <div className="p-[16px] border-b border-[#f3f4f6]">
                        <div className="relative">
                          <Search className="absolute left-[12px] top-[50%] translate-y-[-50%] w-[16px] h-[16px] text-[#9ca3af]" />
                          <input
                            type="text"
                            placeholder="Search for a path or view…"
                            className="w-full pl-[38px] pr-[12px] py-[9px] border border-[#d1d5db] rounded-[8px] font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Scrollable Content */}
                      <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
                        {/* Pinned Views - Only show if there are any */}
                        {pinnedViews.length > 0 && (
                          <div className="px-[16px] py-[12px] border-b border-[#f3f4f6]">
                            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[10px]">
                              Pinned Views
                            </p>
                            <div className="space-y-[4px]">
                              {pinnedViews.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setShowBreadcrumbDropdown(false)}
                                  className="w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[6px] hover:bg-[#f9fafb] transition-colors group"
                                >
                                  <item.icon className="w-[14px] h-[14px] text-[#9ca3af] group-hover:text-[#047857] shrink-0" />
                                  <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[#475467] group-hover:text-[#101828]">
                                    {item.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Nested Hierarchy - Dynamic */}
                        {taskHierarchy.length > 0 && (
                          <div className="px-[16px] py-[12px]">
                            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[10px]">
                              Hierarchy
                            </p>
                            <div className="space-y-[2px]">
                              {taskHierarchy.map((section) => (
                                <div key={section.id}>
                                  {/* Parent folder/section */}
                                  <button
                                    onClick={() => setShowBreadcrumbDropdown(false)}
                                    className="w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[6px] hover:bg-[#f9fafb] transition-colors group"
                                  >
                                    <Folder className="w-[14px] h-[14px] text-[#9ca3af] group-hover:text-[#047857] shrink-0" />
                                    <span className="font-['Inter',sans-serif] font-medium text-[13px] text-[#475467] group-hover:text-[#101828]">
                                      {section.label}
                                    </span>
                                  </button>

                                  {/* Children */}
                                  {section.children && section.children.length > 0 && (
                                    <div className="pl-[14px] space-y-[2px] mt-[2px]">
                                      {section.children.map((child) => (
                                        <button
                                          key={child.id}
                                          onClick={() => setShowBreadcrumbDropdown(false)}
                                          className={`w-full flex items-center gap-[10px] px-[10px] py-[8px] rounded-[6px] transition-colors group ${
                                            child.isCurrent
                                              ? 'bg-[rgba(4,120,87,0.04)] border border-[rgba(4,120,87,0.1)]'
                                              : 'hover:bg-[#f9fafb]'
                                          }`}
                                        >
                                          <Folder className={`w-[14px] h-[14px] shrink-0 ${
                                            child.isCurrent ? 'text-[#047857]' : 'text-[#9ca3af] group-hover:text-[#047857]'
                                          }`} />
                                          <span className={`font-['Inter',sans-serif] font-${child.isCurrent ? 'semibold' : 'medium'} text-[13px] truncate ${
                                            child.isCurrent ? 'text-[#047857]' : 'text-[#475467] group-hover:text-[#101828]'
                                          }`}>
                                            {child.label}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Context Helper */}
                      
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Task Header */}
        <motion.div
          className="pb-[24px]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex-1">
              <div className="flex items-center gap-[12px] mb-[6px]">
                <h1 className="font-['Inter',sans-serif] font-semibold text-[24px] leading-[32px] text-[#101828]">
                  {task.title}
                </h1>
                <span className="px-[10px] py-[4px] bg-[#f4eef9] text-[#73418a] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[12px]">
                  {task.status}
                </span>
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-[13px] leading-[18px] text-[#475467]">
                Prepared by <span className="text-[#047857] font-semibold">{task.preparedByAgent}</span>
              </p>
            </div>
            <button
              onClick={() => {
                if (journalEntrySubmitted) {
                  handleSignOff();
                }
              }}
              disabled={!journalEntrySubmitted}
              className={`flex items-center gap-[8px] px-[20px] py-[10px] rounded-[8px] transition-all shrink-0 ${
                journalEntrySubmitted
                  ? 'bg-[#047857] hover:bg-[#065f46] text-white shadow-sm cursor-pointer'
                  : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
              }`}
            >
              <Check className="w-[16px] h-[16px]" />
              <span className="font-['Inter',sans-serif] font-semibold text-[14px]">
                Sign-off task
              </span>
            </button>
          </div>
        </motion.div>

        {/* ABOVE THE FOLD: AI Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-[24px] mb-[40px]">
          {/* Left Column: AI Working Surface */}
          <div className="space-y-[16px]">
            {/* Lightweight Workflow Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <WorkflowProgressTracker stages={task.workflowStages} />
            </motion.div>

            {/* AI Workspace Linear Component */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <AIWorkspaceLinear 
                task={task}
                isSignedOff={isSignedOff}
                onSignOff={handleSignOff}
                onDismiss={handleDismiss}
                onJournalEntrySubmitted={() => setJournalEntrySubmitted(true)}
              />
            </motion.div>

            {/* Post-Sign-Off Insight State */}
            <AnimatePresence>
              {isSignedOff && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                >
                  <PostMortemInsight insight={task.automationInsight} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Tabbed Item Details + Dependencies */}
          <div className="space-y-[20px]">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ItemDetailsCard task={task} />
            </motion.div>

            {/* Workflow Card - Work & Dependencies */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <WorkflowCard task={task} />
            </motion.div>
          </div>
        </div>

        {/* BELOW THE FOLD: Audit Detail Area */}
        <motion.div
          className="space-y-[24px] pt-[24px] border-t-[2px] border-[#e4e7ec]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Section Header */}
          

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {/* Item Details */}
            

            {/* Assignees */}
            
          </div>

          {/* Review Notes (70%) + Attachments (30%) - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-[70fr_30fr] gap-[24px]">
            {/* Review Notes - Conversational Thread */}
            <div className="bg-white/95 rounded-[12px] border border-white/60 p-[24px] bg-[#ffffffe6]">
              <div className="flex items-center justify-between mb-[20px]">
                <h3 className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#101828] flex items-center gap-[8px]">
                  <MessageSquare className="w-[16px] h-[16px] text-[#475467]" />
                  Review Notes
                </h3>
                <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[#475467] px-[8px] py-[2px] bg-[#f3f4f6] rounded-[6px]">
                  {task.reviewNotes.length}
                </span>
              </div>

              <div className="space-y-[16px]">
                {/* Show all notes in thread view */}
                {(showAllNotes ? task.reviewNotes : task.reviewNotes.slice(-2)).map((note) => (
                  <ReviewNoteThread key={note.id} note={note} />
                ))}

                {!showAllNotes && task.reviewNotes.length > 2 && (
                  <button
                    onClick={() => setShowAllNotes(true)}
                    className="flex items-center gap-[6px] text-[#047857] hover:text-[#065f46] transition-colors px-[12px] py-[6px] hover:bg-[rgba(4,120,87,0.05)] rounded-[6px]"
                  >
                    <span className="font-['Inter',sans-serif] font-semibold text-[12.5px]">
                      Show {task.reviewNotes.length - 2} earlier comments
                    </span>
                    <ChevronRight className="w-[14px] h-[14px]" />
                  </button>
                )}

                {showAllNotes && task.reviewNotes.length > 2 && (
                  <button
                    onClick={() => setShowAllNotes(false)}
                    className="flex items-center gap-[6px] text-[#475467] hover:text-[#101828] transition-colors px-[12px] py-[6px]"
                  >
                    <span className="font-['Inter',sans-serif] font-semibold text-[12.5px]">
                      Show less
                    </span>
                  </button>
                )}
              </div>

              {/* Add Comment Input */}
              <div className="mt-[20px] pt-[20px] border-t border-[#e5e7eb]">
                <div className="flex items-start gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
                    <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#c0e8d7]">
                      KJ
                    </p>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full px-[14px] py-[10px] border border-[#d1d5db] rounded-[8px] font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-[8px]">
                      <div className="flex items-center gap-[6px]">
                        <button className="p-[6px] hover:bg-[#f3f4f6] rounded-[6px] transition-colors">
                          <Paperclip className="w-[16px] h-[16px] text-[#667085]" />
                        </button>
                      </div>
                      <button className="px-[14px] py-[7px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] transition-colors">
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments - Compact 30% Column */}
            <div className="bg-white/95 rounded-[12px] border border-white/60 p-[20px] bg-[#ffffff]">
              <div className="flex items-center justify-between mb-[16px]">
                <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828] flex items-center gap-[7px]">
                  <Paperclip className="w-[15px] h-[15px] text-[#475467]" />
                  Attachments
                </h3>
                <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#475467] px-[7px] py-[2px] bg-[#f3f4f6] rounded-[5px]">
                  {task.attachments.length}
                </span>
              </div>
              
              <div className="space-y-[8px] mb-[16px]">
                {task.attachments.map((attachment) => (
                  <AttachmentItemCompact key={attachment.id} attachment={attachment} />
                ))}
              </div>

              {/* Upload Area - Compact */}
              <div className="pt-[16px] border-t border-[#e5e7eb]">
                <div className="border-[2px] border-dashed border-[#d1d5db] rounded-[8px] p-[16px] hover:border-[#047857] hover:bg-[rgba(4,120,87,0.02)] transition-all cursor-pointer group">
                  <div className="flex flex-col items-center gap-[6px]">
                    <Upload className="w-[20px] h-[20px] text-[#9ca3af] group-hover:text-[#047857] transition-colors" />
                    <p className="font-['Inter',sans-serif] font-medium text-[11.5px] text-[#475467] group-hover:text-[#047857] transition-colors text-center">
                      Drop files
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Automations */}
          
        </motion.div>
      </div>
    </div>
  );
}

function WorkflowProgressTracker({ stages }: { stages: any[] }) {
  // Calculate progress to include current step
  const currentIndex = stages.findIndex(s => s.status === 'current');
  const completedCount = stages.filter(s => s.status === 'complete').length;
  const activeIndex = currentIndex !== -1 ? currentIndex : completedCount - 1;
  const progressPercent = (activeIndex / (stages.length - 1)) * 100;

  return (
    <div className="bg-white rounded-[12px] border border-white/60 px-[28px] py-[24px] shadow-[0px_2px_8px_rgba(0,51,42,0.04)] bg-[#ffffff99]">
      {/* Container for progress line and steps */}
      <div className="relative">
        {/* Continuous background line - full width */}
        <div className="absolute top-[8px] left-0 right-0 h-[2px] bg-[#e5e7eb]" />
        
        {/* Progressive green line overlay - extends to current step */}
        <div 
          className="absolute top-[8px] left-0 h-[2px] bg-[#02533F] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Steps container - equal width distribution */}
        <div className="relative flex">
          {stages.map((stage, idx) => {
            const isComplete = stage.status === 'complete';
            const isCurrent = stage.status === 'current';
            const isPending = !isComplete && !isCurrent;

            return (
              <div 
                key={stage.id} 
                className="flex flex-col items-start gap-[10px]"
                style={{ 
                  width: `${100 / stages.length}%`
                }}
              >
                {/* Circle milestone */}
                <div className="relative">
                  <div 
                    className={`w-[16px] h-[16px] rounded-full flex items-center justify-center transition-all duration-400 ease-out ${
                      isComplete 
                        ? 'bg-[#02533F]' 
                        : isCurrent
                        ? 'bg-white border-[2.5px] border-[#02533F]'
                        : 'bg-white border-[2px] border-[#d1d5db]'
                    }`}
                  >
                    {isComplete && (
                      <Check className="w-[9px] h-[9px] text-white stroke-[2.5]" />
                    )}
                    {isCurrent && (
                      <div className="w-[5px] h-[5px] rounded-full bg-[#02533F]" />
                    )}
                  </div>
                </div>

                {/* Text labels underneath - left aligned */}
                <div className="flex flex-col gap-[3px] max-w-[140px]">
                  <p className={`font-['Inter',sans-serif] font-semibold text-[11.5px] leading-[15px] transition-colors duration-300 ${
                    isComplete || isCurrent ? 'text-[#101828]' : 'text-[#9ca3af]'
                  }`}>
                    {stage.label}
                  </p>
                  {stage.agent && (
                    <p className={`font-['Inter',sans-serif] font-medium text-[10px] leading-[13px] transition-colors duration-300 ${
                      isComplete ? 'text-[#02533F]' : isCurrent ? 'text-[#101828]' : 'text-[#cbd5e1]'
                    }`}>
                      {stage.agent}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ItemDetailsCard({ task }: any) {
  const [showAllAssignees, setShowAllAssignees] = useState(false);
  const visibleAssignees = showAllAssignees ? task.assignees : task.assignees.slice(0, 2);
  const remainingCount = task.assignees.length - 2;

  return (
    <div className="bg-white/95 rounded-[12px] border border-white/60 shadow-[0px_2px_8px_rgba(0,51,42,0.04)] bg-[#ffffffe6] h-[590px] flex flex-col">
      <div className="px-[22px] pt-[22px] pb-[12px] shrink-0">
        <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828] flex items-center gap-[8px]">
          <FileText className="w-[16px] h-[16px] text-[#475467]" />
          Item Details
        </h3>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-[22px] pb-[22px] scrollbar-hide">
        {/* 2-Column Grid for details */}
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[14px] mb-[14px]">
          <ItemDetailRow label="Status" value={task.status} />
          <ItemDetailRow label="Period" value={task.period} />
          <ItemDetailRow label="Due Date" value={task.dueDate} />
          <ItemDetailRow label="Estimated Time" value={task.estimatedTime || "~2 hours"} />
          <ItemDetailRow label="Entity" value={task.entity} />
          <ItemDetailRow label="Folder" value={task.folder} />
          <ItemDetailRow label="Frequency" value={task.frequency} />
        </div>
          
        {/* Collapsible Assignees Section */}
        <div className="pt-[14px] border-t border-[#f3f4f6]">
          <div className="flex items-center justify-between mb-[8px]">
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px]">
              Assigned To
            </p>
            <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] px-[6px] py-[1px] bg-[#f3f4f6] rounded-[4px]">
              {task.assignees.length}
            </span>
          </div>
          
          <div className="space-y-[8px]">
            {visibleAssignees.map((assignee: any, idx: number) => (
              <div key={idx} className="flex items-center gap-[10px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
                  <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#c0e8d7]">
                    {assignee.initials}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[6px]">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12.5px] text-[#101828] truncate">
                      {assignee.name}
                    </p>
                    {assignee.badge && (
                      <span className="px-[8px] py-[2px] bg-[#f3f4f6] text-[#667085] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11px] shrink-0">
                        {assignee.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] truncate">
                    {assignee.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Expand/Collapse Toggle */}
          {task.assignees.length > 2 && (
            <button
              onClick={() => setShowAllAssignees(!showAllAssignees)}
              className="flex items-center gap-[5px] mt-[10px] text-[#047857] hover:text-[#065f46] transition-colors px-[8px] py-[4px] hover:bg-[rgba(4,120,87,0.05)] rounded-[6px]"
            >
              <span className="font-['Inter',sans-serif] font-semibold text-[11.5px]">
                {showAllAssignees ? 'Show less' : `Show ${remainingCount} more`}
              </span>
              <motion.div
                animate={{ rotate: showAllAssignees ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-[13px] h-[13px]" />
              </motion.div>
            </button>
          )}
        </div>

        <div className="pt-[14px] border-t border-[#f3f4f6]">
          <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] uppercase tracking-[0.4px] mb-[6px]">
            Description
          </p>
          <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
            {task.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ItemDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] mb-[3px]">
        {label}
      </p>
      <p className="font-['Inter',sans-serif] font-semibold text-[12.5px] text-[#101828]">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#9ca3af]">
        {label}
      </p>
      <p className="font-['Inter',sans-serif] font-semibold text-[12.5px] text-[#101828]">
        {value}
      </p>
    </div>
  );
}

function ReviewNoteThread({ note }: { note: ReviewNote }) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="group">
      <div className="flex items-start gap-[12px] px-[12px] py-[10px] rounded-[8px] hover:bg-[rgba(0,0,0,0.02)] transition-colors">
        {/* Avatar */}
        <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0 ${ 
          note.isAgent 
            ? 'bg-gradient-to-br from-[#047857] to-[#065f46]'
            : 'bg-gradient-to-b from-[#005133] to-[#0a3b33]'
        }`}>
          {note.isAgent ? (
            <Sparkles className="w-[15px] h-[15px] text-white" />
          ) : (
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#c0e8d7]">
              {note.initials}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] mb-[5px]">
            <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">
              {note.author}
            </p>
            {note.isAgent && (
              <span className="px-[6px] py-[1px] bg-[#f0fdf4] text-[#166534] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[10px]">
                Agent
              </span>
            )}
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af]">
              {note.time}
            </p>
          </div>
          <p className="font-['Inter',sans-serif] font-medium text-[12.5px] leading-[18px] text-[#475467] mb-[8px]">
            {note.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-[4px] text-[#667085] hover:text-[#047857] transition-colors opacity-0 group-hover:opacity-100"
            >
              <MessageSquare className="w-[13px] h-[13px]" />
              <span className="font-['Inter',sans-serif] font-medium text-[11.5px]">
                Reply
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Reply Input (shown when clicking Reply) */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-[44px] mt-[8px]"
          >
            <div className="flex items-start gap-[12px] px-[12px] py-[10px]">
              <div className="w-[28px] h-[28px] rounded-[7px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center shrink-0">
                <p className="font-['Inter',sans-serif] font-semibold text-[10px] text-[#c0e8d7]">
                  KJ
                </p>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Write a reply..."
                  className="w-full px-[12px] py-[8px] border border-[#d1d5db] rounded-[7px] font-['Inter',sans-serif] font-medium text-[12.5px] text-[#101828] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-[6px] mt-[6px]">
                  <button 
                    onClick={() => setShowReplyInput(false)}
                    className="px-[12px] py-[6px] text-[#667085] hover:bg-[#f3f4f6] rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11.5px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-[12px] py-[6px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[6px] font-['Inter',sans-serif] font-semibold text-[11.5px] transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AttachmentItemCompact({ attachment }: { attachment: Attachment }) {
  return (
    <div 
      className="flex items-center gap-[12px] px-[14px] py-[11px] bg-white rounded-[8px] border border-[#e5e7eb] hover:border-[#d1d5db] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.04)] transition-all cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[8px]">
          <p className="font-['Inter',sans-serif] font-medium text-[13px] text-[#101828] truncate">
            {attachment.name}
          </p>
          {attachment.isAgentGenerated && (
            <span className="px-[6px] py-[1px] bg-[rgba(4,120,87,0.1)] text-[#047857] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[9.5px] shrink-0">
              AI Generated
            </span>
          )}
        </div>
        <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af]">
          {attachment.size}
        </p>
      </div>
      <Download className="w-[16px] h-[16px] text-[#9ca3af] group-hover:text-[#047857] transition-colors" />
    </div>
  );
}

function AutomationCard({ automation }: any) {
  return (
    <div className="p-[16px] rounded-[10px] border border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.04)] transition-all">
      <div className="flex items-start justify-between gap-[12px] mb-[10px]">
        <div className="flex-1">
          <h4 className="font-['Inter',sans-serif] font-semibold text-[13.5px] text-[#101828] mb-[4px]">
            {automation.title}
          </h4>
          <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#667085]">
            {automation.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-[12px] border-t border-[#f3f4f6]">
        <div className="flex items-center gap-[12px]">
          <div>
            <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[2px]">
              Confidence
            </p>
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
              {automation.confidence}
            </p>
          </div>
          <div className="w-[1px] h-[24px] bg-[#e5e7eb]" />
          <div>
            <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[2px]">
              Time Saved
            </p>
            <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
              {automation.timeSaved}
            </p>
          </div>
        </div>

        <button className="px-[14px] py-[7px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[8px] font-['Inter',sans-serif] font-semibold text-[12px] transition-colors">
          Enable Automation
        </button>
      </div>
    </div>
  );
}

function PostMortemInsight({ insight }: any) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-[12px] border border-[#bbf7d0] p-[28px] relative overflow-hidden shadow-[0px_4px_16px_rgba(4,120,87,0.1)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-[10px] mb-[20px]">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#047857] flex items-center justify-center shrink-0">
            <Sparkles className="w-[20px] h-[20px] text-white" />
          </div>
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#166534] uppercase tracking-[0.5px] mb-[2px]">
              Post-Sign-Off Insight
            </p>
            <h3 className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[22px] text-[#101828]">
              Workflow Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] mb-[20px]">
          {/* Agent Prepared */}
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">
              Agent Prepared
            </p>
            <div className="space-y-[5px]">
              {insight.aiPreparedWork.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <Check className="w-[12px] h-[12px] text-[#047857] shrink-0 mt-[3px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* You Reviewed */}
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">
              You Reviewed
            </p>
            <div className="space-y-[5px]">
              {insight.humanReviewedWork.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-[#047857] shrink-0 mt-[6px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Improvements */}
          <div>
            <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#166534] uppercase tracking-[0.4px] mb-[10px]">
              Future Improvements
            </p>
            <div className="space-y-[5px]">
              {insight.futureImprovements.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-[6px]">
                  <Sparkles className="w-[12px] h-[12px] text-[#047857] shrink-0 mt-[2px]" />
                  <p className="font-['Inter',sans-serif] font-medium text-[11.5px] leading-[16px] text-[#166534]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-[20px] border-t border-[#bbf7d0]">
          <p className="font-['Inter',sans-serif] font-medium text-[12.5px] leading-[18px] text-[#166534] mb-[14px]">
            This workflow demonstrates effective human-in-the-loop automation. Consider enabling the recommended automations to further streamline this process.
          </p>
          <button className="px-[16px] py-[10px] bg-[#047857] hover:bg-[#065f46] text-white rounded-[10px] font-['Inter',sans-serif] font-semibold text-[13px] transition-colors">
            View Recommended Automations
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Compatibility export for backward compatibility
export function DrilldownTemplate({ onBack }: { onBack: () => void }) {
  return <TaskDetailPage taskId="task-001" onBack={onBack} />;
}