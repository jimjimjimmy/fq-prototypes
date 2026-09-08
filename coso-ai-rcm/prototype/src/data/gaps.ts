// Cross-agent gap tracker data.
// Per Martin: "a gap is going to be a failed test — that's when you'd designate
// that key system / AI agent is not that reliable and you might have to do
// additional testing." So gaps are tightly coupled to test failures and to the
// agent's reliance state.

export type GapSeverity = 'low' | 'medium' | 'high'
export type GapStatus = 'open' | 'in-progress' | 'pending-review' | 'closed'

export type Gap = {
  id: string
  agentId: string
  agentName: string
  title: string
  description: string
  source: string                    // what triggered the gap (test name, etc.)
  severity: GapSeverity
  assignee: { name: string; initials: string }
  openedAt: string
  deadline: string
  daysToDeadline: number            // negative = overdue
  status: GapStatus
  recommendedAction: string
}

const SW = { name: 'Sue Wong', initials: 'SW' }
const ML = { name: 'Marcus Lee', initials: 'ML' }
const PP = { name: 'Priya Patel', initials: 'PP' }

export const gaps: Gap[] = [
  {
    id: 'gap-1',
    agentId: 'ap-accruals',
    agentName: 'AP Accruals Drafter',
    title: 'October hindsight variance breach (8.2%)',
    description: 'Sampling-based accuracy test for October close failed — Marketing GL came in 8.2% above ground truth, exceeding the 5% threshold.',
    source: 'C-JDG-02 — Variance check (monthly)',
    severity: 'high',
    assignee: SW,
    openedAt: '2026-05-02',
    deadline: '2026-05-16',
    daysToDeadline: 8,
    status: 'in-progress',
    recommendedAction: 'Re-run on Marketing GL with corrected vendor mapping; reconfirm accrual logic against contract terms.',
  },
  {
    id: 'gap-2',
    agentId: 'ap-accruals',
    agentName: 'AP Accruals Drafter',
    title: 'Q3 spot-check failure — lease expense category',
    description: 'Quarterly spot-check found systematic miss-classification of equipment lease expenses into building lease accounts.',
    source: 'C-JDG-02 — Quarterly accuracy spot-check',
    severity: 'high',
    assignee: SW,
    openedAt: '2026-04-30',
    deadline: '2026-05-14',
    daysToDeadline: 6,
    status: 'open',
    recommendedAction: 'Add lease-type classifier check to the prompt; rerun July → September close on the affected category.',
  },
  {
    id: 'gap-3',
    agentId: 'lease-schedules',
    agentName: 'Lease Schedule Computer',
    title: 'Discount-rate parity drift on April lease updates',
    description: 'Monthly sample re-run produced lease liability schedules out of parity with prior-period baselines after the April discount-rate update.',
    source: 'C-TRF-02 — Sample re-run validation',
    severity: 'medium',
    assignee: ML,
    openedAt: '2026-04-25',
    deadline: '2026-05-09',
    daysToDeadline: 1,
    status: 'pending-review',
    recommendedAction: 'Engineering team has shipped a fix; awaiting P2 review of the validation re-run before closing.',
  },
  {
    id: 'gap-4',
    agentId: 'ar-aging',
    agentName: 'AR Aging Analyzer',
    title: 'Threshold change documentation incomplete',
    description: 'A change to the anomaly threshold was made on April 15 without the required dual approval log entry.',
    source: 'C-MON-01 — Threshold change governance',
    severity: 'medium',
    assignee: PP,
    openedAt: '2026-04-19',
    deadline: '2026-05-05',
    daysToDeadline: -3,
    status: 'open',
    recommendedAction: 'Reconstruct change log with sign-offs from both approvers; add to evidence package.',
  },
  {
    id: 'gap-5',
    agentId: 'ar-aging',
    agentName: 'AR Aging Analyzer',
    title: 'Edit-rate spike — collections team review',
    description: 'Approve-without-edit rate dropped from 78% to 51% in the last two weeks; suggests reviewer concerns about output quality.',
    source: 'C-JDG-03 — Edit-rate monitoring',
    severity: 'low',
    assignee: PP,
    openedAt: '2026-05-05',
    deadline: '2026-05-19',
    daysToDeadline: 11,
    status: 'open',
    recommendedAction: 'Sample 20 recently-edited outputs; classify edits to identify common failure pattern.',
  },
]

// ---- Aggregate metrics ----

export function gapsOpenCount(): number {
  return gaps.filter((g) => g.status !== 'closed').length
}

export function gapsOverdueCount(): number {
  return gaps.filter((g) => g.status !== 'closed' && g.daysToDeadline < 0).length
}

export function gapsHighSeverityCount(): number {
  return gaps.filter((g) => g.status !== 'closed' && g.severity === 'high').length
}

export function gapsAvgDaysOpen(): number {
  const open = gaps.filter((g) => g.status !== 'closed')
  if (open.length === 0) return 0
  const today = new Date('2026-05-08')
  const total = open.reduce((sum, g) => {
    const opened = new Date(g.openedAt)
    return sum + Math.round((today.getTime() - opened.getTime()) / (1000 * 60 * 60 * 24))
  }, 0)
  return Math.round(total / open.length)
}
