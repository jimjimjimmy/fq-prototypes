import { CAPABILITY_LIBRARY, getAgentCapabilityIds, type CapabilityId } from './risks-controls'

export type Reliance = 'reliable' | 'not-reliable' | 'out-of-scope'
export type Health = 'healthy' | 'warning' | 'error'
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'On demand'

export type Agent = {
  id: string
  name: string
  description: string
  owner: { name: string; initials: string }
  capabilityIds: CapabilityId[]
  reliance: Reliance
  openGaps: number
  frequency: Frequency
  lastRun: string
  health: Health
  /**
   * When true, this agent was just registered in Transform and is
   * waiting on the compliance manager to review its auto-generated
   * risks and controls. Drives the new-agent badges and callouts.
   */
  isNewFromTransform?: boolean
}

export const INITIAL_AGENTS: Agent[] = (
  [
    {
      id: 'rev-rec',
      name: 'Revenue Recognition Drafter',
      description: 'Drafts ASC 606 revenue allocation entries from contract performance obligations',
      owner: { name: 'Reza Karimi', initials: 'RK' },
      reliance: 'out-of-scope' as const,
      openGaps: 0,
      frequency: 'Monthly' as const,
      lastRun: 'Just registered',
      health: 'healthy' as const,
      isNewFromTransform: true,
    },
    {
      id: 'ap-matcher',
      name: 'Accounts Payable Agent',
      description: 'Matches POs to invoices and goods receipts; flags exceptions',
      owner: { name: 'Sue Wong', initials: 'SW' },
      reliance: 'reliable',
      openGaps: 0,
      frequency: 'Daily' as const,
      lastRun: '2 hours ago',
      health: 'healthy' as const,
    },
    {
      id: 'ap-accruals',
      name: 'AP Accruals Drafter',
      description: 'Drafts month-end accrual JEs from open POs and contracts',
      owner: { name: 'Sue Wong', initials: 'SW' },
      reliance: 'not-reliable',
      openGaps: 2,
      frequency: 'Monthly' as const,
      lastRun: '6 days ago',
      health: 'warning' as const,
    },
    {
      id: 'bank-recon',
      name: 'Bank Reconciliation Matcher',
      description: 'Matches bank statement transactions to GL entries',
      owner: { name: 'Marcus Lee', initials: 'ML' },
      reliance: 'reliable',
      openGaps: 0,
      frequency: 'Daily' as const,
      lastRun: '4 hours ago',
      health: 'healthy' as const,
    },
    {
      id: 'ramp-classifier',
      name: 'Ramp Transaction Classifier',
      description: 'Classifies card transactions to GL accounts using policy rules',
      owner: { name: 'Priya Patel', initials: 'PP' },
      reliance: 'reliable',
      openGaps: 0,
      frequency: 'Daily' as const,
      lastRun: '1 hour ago',
      health: 'healthy' as const,
    },
    {
      id: 'depreciation-je',
      name: 'Depreciation JE Drafter',
      description: 'Calculates and drafts monthly depreciation journal entries',
      owner: { name: 'Sue Wong', initials: 'SW' },
      reliance: 'reliable',
      openGaps: 0,
      frequency: 'Monthly' as const,
      lastRun: '12 days ago',
      health: 'healthy' as const,
    },
    {
      id: 'lease-schedules',
      name: 'Lease Schedule Computer',
      description: 'Computes ROU asset and lease liability amortization schedules',
      owner: { name: 'Marcus Lee', initials: 'ML' },
      reliance: 'not-reliable',
      openGaps: 1,
      frequency: 'Monthly' as const,
      lastRun: '14 days ago',
      health: 'error' as const,
    },
    {
      id: 'ar-aging',
      name: 'AR Aging Analyzer',
      description: 'Flags anomalies in customer aging buckets and unusual collection patterns',
      owner: { name: 'Priya Patel', initials: 'PP' },
      reliance: 'out-of-scope',
      openGaps: 0,
      frequency: 'Weekly' as const,
      lastRun: '2 days ago',
      health: 'healthy' as const,
    },
  ] satisfies Omit<Agent, 'capabilityIds'>[]
).map((a) => ({ ...a, capabilityIds: getAgentCapabilityIds(a.id) }))

export function capabilityShortLabel(id: CapabilityId): string {
  return CAPABILITY_LIBRARY[id].shortLabel
}

export function capabilityLabel(id: CapabilityId): string {
  return CAPABILITY_LIBRARY[id].label
}

export const newAgentCount = INITIAL_AGENTS.filter((a) => a.isNewFromTransform).length

export type TraditionalSystem = {
  id: string
  name: string
  vendor: string
  category: string
  reliance: Reliance
  health: Health
}

export const traditionalSystems: TraditionalSystem[] = [
  { id: 'netsuite', name: 'NetSuite', vendor: 'Oracle', category: 'ERP', reliance: 'reliable', health: 'healthy' },
  { id: 'workiva', name: 'Workiva', vendor: 'Workiva', category: 'Reporting', reliance: 'reliable', health: 'healthy' },
  { id: 'floqast', name: 'FloQast Close', vendor: 'FloQast', category: 'Close management', reliance: 'reliable', health: 'healthy' },
  { id: 'ramp', name: 'Ramp', vendor: 'Ramp', category: 'Spend management', reliance: 'reliable', health: 'healthy' },
]
