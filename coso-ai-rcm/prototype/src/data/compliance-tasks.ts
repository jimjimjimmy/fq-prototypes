// Cross-agent compliance task / test data for the Tests orchestration view.
// In the live product these would be derived from per-agent test definitions
// joined with run history; here we hand-author plausible items.

export type TaskCadence = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'
export type TaskResult = 'pass' | 'fail' | 'pending'
export type TaskStatus = 'on-track' | 'due-soon' | 'overdue' | 'awaiting-result'

export type ComplianceTask = {
  id: string
  agentId: string
  agentName: string
  controlId: string
  controlTitle: string
  title: string
  cadence: TaskCadence
  owner: { name: string; initials: string }
  lastRun: string
  lastResult: TaskResult
  lastNotes?: string
  nextDue: string         // e.g., '2026-12-15'
  dueIn: string           // human-readable: 'Due in 3 days', 'Overdue 2 days'
  status: TaskStatus
}

const SW = { name: 'Sue Wong', initials: 'SW' }
const ML = { name: 'Marcus Lee', initials: 'ML' }
const PP = { name: 'Priya Patel', initials: 'PP' }
const RK = { name: 'Reza Karimi', initials: 'RK' }

export const complianceTasks: ComplianceTask[] = [
  // AP Accruals — has the failing tests we already model on the agent details
  {
    id: 'task-1',
    agentId: 'ap-accruals',
    agentName: 'AP Accruals Drafter',
    controlId: 'C-JDG-02',
    controlTitle: 'Sampling-based accuracy test',
    title: 'Variance check — accruals vs. actuals < 5%',
    cadence: 'Monthly',
    owner: SW,
    lastRun: '6 days ago',
    lastResult: 'fail',
    lastNotes: 'October 2026 came in at 8.2% on Marketing GL. Threshold breach opened a gap.',
    nextDue: '2026-06-04',
    dueIn: 'Overdue 2 days',
    status: 'overdue',
  },
  {
    id: 'task-2',
    agentId: 'ap-accruals',
    agentName: 'AP Accruals Drafter',
    controlId: 'C-JDG-02',
    controlTitle: 'Sampling-based accuracy test',
    title: 'Quarterly accuracy spot-check',
    cadence: 'Quarterly',
    owner: SW,
    lastRun: '8 days ago',
    lastResult: 'fail',
    lastNotes: 'Q3 2026 spot-check failed on lease expense category. Investigation in progress.',
    nextDue: '2026-08-15',
    dueIn: 'Due in 99 days',
    status: 'on-track',
  },
  {
    id: 'task-3',
    agentId: 'ap-accruals',
    agentName: 'AP Accruals Drafter',
    controlId: 'C-GOV-03',
    controlTitle: 'Annual reliance recertification',
    title: 'Annual reliance recertification',
    cadence: 'Annual',
    owner: SW,
    lastRun: 'Pending',
    lastResult: 'pending',
    nextDue: '2026-12-15',
    dueIn: 'Due in 218 days',
    status: 'on-track',
  },

  // AP Matcher — healthy, all on track
  {
    id: 'task-4',
    agentId: 'ap-matcher',
    agentName: 'Accounts Payable Agent',
    controlId: 'C-ING-01',
    controlTitle: 'Source-to-landing reconciliation',
    title: 'Daily PO ingestion tie-out',
    cadence: 'Daily',
    owner: SW,
    lastRun: '4 hours ago',
    lastResult: 'pass',
    nextDue: '2026-05-09',
    dueIn: 'Due in 1 day',
    status: 'due-soon',
  },
  {
    id: 'task-5',
    agentId: 'ap-matcher',
    agentName: 'Accounts Payable Agent',
    controlId: 'C-PST-02',
    controlTitle: 'Pre-post human approval > $X',
    title: 'Pre-post approval — invoices > $50K',
    cadence: 'Weekly',
    owner: SW,
    lastRun: '3 days ago',
    lastResult: 'pass',
    nextDue: '2026-05-13',
    dueIn: 'Due in 5 days',
    status: 'on-track',
  },

  // Lease Schedule Computer — gap-flagged, ineffective
  {
    id: 'task-6',
    agentId: 'lease-schedules',
    agentName: 'Lease Schedule Computer',
    controlId: 'C-TRF-02',
    controlTitle: 'Sample re-run validation',
    title: 'Lease ROU sample re-run',
    cadence: 'Monthly',
    owner: ML,
    lastRun: '14 days ago',
    lastResult: 'fail',
    lastNotes: 'Discount-rate update in April produced parity drift. Owner investigating.',
    nextDue: '2026-05-12',
    dueIn: 'Due in 4 days',
    status: 'due-soon',
  },

  // Bank Reconciliation Matcher
  {
    id: 'task-7',
    agentId: 'bank-recon',
    agentName: 'Bank Reconciliation Matcher',
    controlId: 'C-PST-01',
    controlTitle: 'Posting authority matrix',
    title: 'Posting authority audit',
    cadence: 'Quarterly',
    owner: ML,
    lastRun: '38 days ago',
    lastResult: 'pass',
    nextDue: '2026-08-01',
    dueIn: 'Due in 85 days',
    status: 'on-track',
  },

  // Ramp Classifier
  {
    id: 'task-8',
    agentId: 'ramp-classifier',
    agentName: 'Ramp Transaction Classifier',
    controlId: 'C-JDG-03',
    controlTitle: 'Edit-rate monitoring',
    title: 'Approve-without-edit rate review',
    cadence: 'Monthly',
    owner: PP,
    lastRun: '4 days ago',
    lastResult: 'pass',
    nextDue: '2026-06-04',
    dueIn: 'Due in 27 days',
    status: 'on-track',
  },

  // AR Aging — needs review
  {
    id: 'task-9',
    agentId: 'ar-aging',
    agentName: 'AR Aging Analyzer',
    controlId: 'C-MON-01',
    controlTitle: 'Threshold change governance',
    title: 'Threshold change log review',
    cadence: 'Monthly',
    owner: PP,
    lastRun: '6 days ago',
    lastResult: 'pending',
    lastNotes: 'Awaiting documentation upload from owner.',
    nextDue: '2026-05-09',
    dueIn: 'Due in 1 day',
    status: 'awaiting-result',
  },

  // Depreciation
  {
    id: 'task-10',
    agentId: 'depreciation-je',
    agentName: 'Depreciation JE Drafter',
    controlId: 'C-TRF-01',
    controlTitle: 'Transformation rule change review',
    title: 'Rule change 2-person approval',
    cadence: 'Quarterly',
    owner: SW,
    lastRun: '12 days ago',
    lastResult: 'pass',
    nextDue: '2026-08-12',
    dueIn: 'Due in 95 days',
    status: 'on-track',
  },
  {
    id: 'task-11',
    agentId: 'depreciation-je',
    agentName: 'Depreciation JE Drafter',
    controlId: 'C-GOV-04',
    controlTitle: 'Model/vendor change notification',
    title: 'Vendor model update review',
    cadence: 'Quarterly',
    owner: RK,
    lastRun: '32 days ago',
    lastResult: 'pass',
    nextDue: '2026-07-08',
    dueIn: 'Due in 60 days',
    status: 'on-track',
  },

  // Bank Recon — KRI drift
  {
    id: 'task-12',
    agentId: 'bank-recon',
    agentName: 'Bank Reconciliation Matcher',
    controlId: 'C-MON-02',
    controlTitle: 'Alert acknowledgement SLA',
    title: 'Alert ack SLA review',
    cadence: 'Weekly',
    owner: ML,
    lastRun: '2 days ago',
    lastResult: 'pass',
    nextDue: '2026-05-13',
    dueIn: 'Due in 5 days',
    status: 'on-track',
  },
]

// ---- Aggregate metrics for the Tests page KPI strip ----

export function tasksOverdue(): number {
  return complianceTasks.filter((t) => t.status === 'overdue').length
}

export function tasksDueThisWeek(): number {
  return complianceTasks.filter((t) => t.status === 'due-soon' || t.status === 'overdue').length
}

export function tasksAwaitingResult(): number {
  return complianceTasks.filter((t) => t.status === 'awaiting-result').length
}

export function tasksPassRate(): number {
  const completed = complianceTasks.filter((t) => t.lastResult === 'pass' || t.lastResult === 'fail')
  if (completed.length === 0) return 0
  return Math.round(100 * completed.filter((t) => t.lastResult === 'pass').length / completed.length)
}
