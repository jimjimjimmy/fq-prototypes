// Canonical capability / risk / control taxonomy from the Figma "AI Capabilities" matrix
// (file s5mhthDXZDrhn7T4yP8UMe, node 2029:86). The default risks/controls below are starter
// templates for customers — Martin and the internal compliance team will refine them. Users
// can add their own risks on top of these defaults.

export type Severity = 'low' | 'medium' | 'high'
export type ControlFrequency =
  | 'Multiple times per day'
  | 'Daily'
  | 'Weekly'
  | 'Every two weeks'
  | 'Monthly'
  | 'Quarterly'
  | 'Annual'
  | 'As needed'
export type Enforcement = 'Automated in product' | 'Manual SOP' | 'Hybrid'
export type TestResult = 'pass' | 'fail' | 'pending'
export type EvidenceType = 'Run log' | 'Test result' | 'Approval record' | 'Configuration snapshot'

export type Control = {
  id: string                  // C-ING-01, C-GOV-01, etc.
  title: string
  frequency: ControlFrequency
  enforcement: Enforcement
  owner: { name: string; initials: string }
  description: string
}

export type Risk = {
  id: string                  // R-ING-01, etc.
  title: string
  severity: Severity
  description: string
  controlIds: string[]
  isCustom?: boolean          // user-added on top of the defaults
}

export type CapabilityId =
  | 'ING' | 'TRF' | 'PST' | 'ORC' | 'JDG' | 'MON' | 'KNW' | 'INT'

export type Capability = {
  id: CapabilityId
  label: string               // canonical label shown in the risk-assessment view
  shortLabel: string          // compact label for table chips
  description: string
}

// ---- Capabilities ----

export const CAPABILITY_LIBRARY: Record<CapabilityId, Capability> = {
  ING: {
    id: 'ING',
    label: 'Data extraction and ingestion',
    shortLabel: 'Ingestion',
    description: 'Capture and interpret raw data from structured and unstructured sources.',
  },
  TRF: {
    id: 'TRF',
    label: 'Data transformation and integration',
    shortLabel: 'Transformation',
    description: 'Transform raw or unstructured data into usable data by cleaning, normalizing, or combining it.',
  },
  PST: {
    id: 'PST',
    label: 'Automated transaction processing and reconciliation',
    shortLabel: 'Processing',
    description: 'Automate high-volume tasks such as posting, matching, and reconciliation.',
  },
  ORC: {
    id: 'ORC',
    label: 'Workflow orchestration and autonomous task execution',
    shortLabel: 'Orchestration',
    description: 'AI agents coordinate and perform multi-step tasks with minimal human input.',
  },
  JDG: {
    id: 'JDG',
    label: 'Judgment, forecasting, and insight generation',
    shortLabel: 'Judgment',
    description: 'Produce forecasts, insights, or draft analyses.',
  },
  MON: {
    id: 'MON',
    label: 'AI-powered monitoring and continuous review',
    shortLabel: 'Monitoring',
    description: 'Continuously scan activity for anomalies, drift, or emerging risks.',
  },
  KNW: {
    id: 'KNW',
    label: 'Knowledge retrieval and summarization',
    shortLabel: 'Knowledge',
    description: 'Summarize large volumes of information from policy, regulatory, or document stores.',
  },
  INT: {
    id: 'INT',
    label: 'Human-AI collaboration',
    shortLabel: 'Collaboration',
    description: 'Augment human capabilities through chat-based interfaces.',
  },
}

export const CAPABILITIES: Capability[] = Object.values(CAPABILITY_LIBRARY)

// ---- Control library (19 controls; some shared across capabilities) ----

const OB = { name: 'Olivia Brennan', initials: 'OB' }
const SW = { name: 'Sue Wong', initials: 'SW' }
const ML = { name: 'Marcus Lee', initials: 'ML' }
const RK = { name: 'Reza Karimi', initials: 'RK' }

export const CONTROL_LIBRARY: Record<string, Control> = {
  // Governance (cross-capability)
  'C-GOV-01': { id: 'C-GOV-01', title: 'Agent-change 2-person approval', frequency: 'As needed', enforcement: 'Hybrid', owner: OB, description: 'All material changes to agent prompts/config require 2 approvers.' },
  'C-GOV-03': { id: 'C-GOV-03', title: 'Annual agent risk re-assessment', frequency: 'Annual', enforcement: 'Manual SOP', owner: OB, description: 'Annual reassessment per agent; reliance re-confirmed.' },
  'C-GOV-04': { id: 'C-GOV-04', title: 'Model/vendor change notification', frequency: 'As needed', enforcement: 'Automated in product', owner: OB, description: 'Vendor model updates trigger review before adoption.' },

  // Ingestion
  'C-ING-01': { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily', enforcement: 'Automated in product', owner: ML, description: 'Row/volume tie-out between source and landed data per run.' },
  'C-ING-02': { id: 'C-ING-02', title: 'Completeness check on ingestion batch', frequency: 'Daily', enforcement: 'Hybrid', owner: ML, description: 'Agent halts and alerts when batch completeness <100%.' },
  'C-ING-03': { id: 'C-ING-03', title: 'Ingestion credential rotation review', frequency: 'Quarterly', enforcement: 'Manual SOP', owner: OB, description: 'Quarterly credential rotation, tracked centrally.' },

  // Transformation
  'C-TRF-01': { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed', enforcement: 'Manual SOP', owner: OB, description: 'All rule/prompt changes require 2-person approval with ticket.' },
  'C-TRF-02': { id: 'C-TRF-02', title: 'Sample re-run validation', frequency: 'Monthly', enforcement: 'Automated in product', owner: SW, description: 'Monthly re-run on historical sample; output parity checked.' },
  'C-TRF-03': { id: 'C-TRF-03', title: 'Lineage capture & retention', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: ML, description: 'Input-to-output lineage persisted per transaction.' },

  // Posting
  'C-PST-01': { id: 'C-PST-01', title: 'Posting authority matrix', frequency: 'Multiple times per day', enforcement: 'Manual SOP', owner: RK, description: 'Agent roles scoped to authorized posting categories only.' },
  'C-PST-02': { id: 'C-PST-02', title: 'Pre-post human approval > $X', frequency: 'Multiple times per day', enforcement: 'Hybrid', owner: SW, description: 'Material items route to human approver before posting.' },

  // Orchestration
  'C-ORC-01': { id: 'C-ORC-01', title: 'Step failure alerting & SLA', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: ML, description: 'Failed steps alert the owner within SLA; tracked to resolution.' },

  // Judgment
  'C-JDG-01': { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: SW, description: 'Each output stores reasoning/citations for retrievable audit.' },
  'C-JDG-02': { id: 'C-JDG-02', title: 'Sampling-based accuracy test', frequency: 'Quarterly', enforcement: 'Hybrid', owner: SW, description: 'Quarterly sample test vs ground truth; documented workpaper.' },
  'C-JDG-03': { id: 'C-JDG-03', title: 'Edit-rate monitoring', frequency: 'Daily', enforcement: 'Automated in product', owner: OB, description: 'Approve-without-edit rate tracked; threshold triggers reliance review.' },
  'C-JDG-04': { id: 'C-JDG-04', title: 'Bias audit on decision outputs', frequency: 'Annual', enforcement: 'Manual SOP', owner: RK, description: 'Annual review of output distribution for protected-class bias.' },

  // Monitoring
  'C-MON-01': { id: 'C-MON-01', title: 'Threshold change governance', frequency: 'As needed', enforcement: 'Hybrid', owner: OB, description: 'Threshold edits logged and dual-approved; change log retained.' },
  'C-MON-02': { id: 'C-MON-02', title: 'Alert acknowledgement SLA', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: ML, description: 'Unacknowledged alerts escalate automatically.' },

  // Knowledge
  'C-KNW-01': { id: 'C-KNW-01', title: 'Source-of-truth registration & refresh', frequency: 'As needed', enforcement: 'Manual SOP', owner: OB, description: 'Only registered, freshness-tracked sources may be retrieved.' },
  'C-KNW-02': { id: 'C-KNW-02', title: 'Mandatory citation check', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: SW, description: 'Output blocked unless source citation present and resolvable.' },

  // Human-AI collaboration
  'C-INT-01': { id: 'C-INT-01', title: 'Prompt-injection test battery', frequency: 'Quarterly', enforcement: 'Automated in product', owner: RK, description: 'Quarterly red-team tests vs a standard injection suite.' },
  'C-INT-02': { id: 'C-INT-02', title: 'PII redaction on input & output', frequency: 'Multiple times per day', enforcement: 'Automated in product', owner: ML, description: 'Automated PII scrubbing in both directions.' },
}

// ---- Default risks per capability (templates from compliance team) ----

export const DEFAULT_RISKS: Record<CapabilityId, Risk[]> = {
  ING: [
    { id: 'R-ING-01', title: 'Incomplete or inaccurate source capture', severity: 'high', description: 'Some records are missed or distorted at ingestion.', controlIds: ['C-ING-01', 'C-ING-02', 'C-GOV-01'] },
    { id: 'R-ING-02', title: 'Source system authentication drift', severity: 'medium', description: 'Stale credentials or rotated keys cause silent ingestion failures.', controlIds: ['C-ING-03'] },
  ],
  TRF: [
    { id: 'R-TRF-01', title: 'Logic drift during normalization', severity: 'high', description: 'Transformation logic silently shifts and produces inconsistent outputs.', controlIds: ['C-TRF-01', 'C-TRF-02', 'C-GOV-01'] },
    { id: 'R-TRF-02', title: 'Loss of traceability through transforms', severity: 'medium', description: 'Inputs cannot be tied back to outputs after transformation.', controlIds: ['C-TRF-03'] },
  ],
  PST: [
    { id: 'R-PST-01', title: 'Unauthorized posting', severity: 'high', description: 'Agent posts to GL accounts outside its authorized scope or above its threshold.', controlIds: ['C-PST-01', 'C-PST-02', 'C-GOV-01'] },
  ],
  ORC: [
    { id: 'R-ORC-01', title: 'Step failure without notification', severity: 'medium', description: 'Multi-step workflow fails partway and the owner is not notified.', controlIds: ['C-ORC-01'] },
  ],
  JDG: [
    { id: 'R-JDG-01', title: 'Hallucinated or unsupported conclusions', severity: 'high', description: 'Output is not supported by the underlying source data.', controlIds: ['C-JDG-01', 'C-JDG-02'] },
    { id: 'R-JDG-02', title: 'Over-reliance by reviewers', severity: 'medium', description: 'Human reviewers rubber-stamp AI output without meaningful review.', controlIds: ['C-JDG-03', 'C-GOV-03'] },
    { id: 'R-JDG-03', title: 'Bias in decision outputs', severity: 'high', description: 'Output distributions show protected-class bias or systematic skew.', controlIds: ['C-JDG-04'] },
    { id: 'R-JDG-04', title: 'Model/vendor change undermines reliance', severity: 'medium', description: 'A vendor model update changes behavior without governance review.', controlIds: ['C-GOV-04', 'C-JDG-02'] },
  ],
  MON: [
    { id: 'R-MON-01', title: 'Threshold drift — exceptions missed', severity: 'high', description: 'Detection thresholds change over time and let exceptions slip past.', controlIds: ['C-MON-01', 'C-GOV-01'] },
    { id: 'R-MON-02', title: 'Alert fatigue / muted alerts', severity: 'medium', description: 'Reviewers stop responding to alerts or mute them entirely.', controlIds: ['C-MON-02'] },
  ],
  KNW: [
    { id: 'R-KNW-01', title: 'Retrieval from stale policy source', severity: 'medium', description: 'Knowledge agent answers using outdated policy or regulatory text.', controlIds: ['C-KNW-01'] },
    { id: 'R-KNW-02', title: 'Citation missing or incorrect', severity: 'high', description: 'Output asserts facts without resolvable citations to source.', controlIds: ['C-KNW-02'] },
  ],
  INT: [
    { id: 'R-INT-01', title: 'Prompt injection leaking sensitive data', severity: 'high', description: 'Adversarial prompts cause the agent to expose sensitive content.', controlIds: ['C-INT-01'] },
    { id: 'R-INT-02', title: 'PII exposure in conversations', severity: 'high', description: 'Personally identifiable information is sent to or echoed by the agent.', controlIds: ['C-INT-02'] },
  ],
}

// ---- Per-agent details ----

export type Test = {
  id: string
  controlId: string
  title: string
  cadence: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'
  lastRun: string
  result: TestResult
  notes?: string
}

export type Evidence = {
  id: string
  type: EvidenceType
  capturedAt: string
  source: string
  description: string
}

export type DependencyStatus = 'Not started' | 'In progress' | 'Ineffective' | 'Effective'

export type DependencyItem = {
  id: string
  code: string
  title: string
  description: string
  status: DependencyStatus
}

export type KeySystemDetails = {
  auditProject: string
  processes: string[]
  keyReports: string[]
  additionalInformation: string
}

// Workflow describes the agent's step-by-step pipeline. Steps connect linearly;
// the last step in the chain may branch (e.g., human review → Approved/Rejected).
export type WorkflowStepType =
  | 'Data Transformation'
  | 'Pivot Table'
  | 'Upload to Reconciliation'
  | 'Human Review'
  | 'Approval'

export type WorkflowStep = {
  id: string
  title: string
  type: WorkflowStepType
  branches?: { label: string; tone: 'success' | 'fail' }[]
}

export type RunArtifact = {
  id: string
  filename: string
  description?: string   // optional context shown beneath the filename
}

export type RunStatus = 'In Progress' | 'Completed' | 'Failed'

export type RunRecord = {
  id: string
  runBy: { name: string; initials: string }
  ranAt: string         // formatted "4/03/2026 | 9:00am"
  ranAtRelative: string // "6 days ago"
  status: RunStatus
  version: string       // "Version 1"
  inputs?: RunArtifact[]
  outputs?: RunArtifact[]
  humanReview?: {
    step: string
    status: 'pending' | 'approved' | 'rejected'
    decidedBy?: { name: string; initials: string }
  }
}

export type AgentVersion = {
  id: string
  version: string       // "v3.2"
  releasedAt: string    // "Apr 15, 2026"
  author: string
  changes: string       // short release note
  current?: boolean
}

export type AgentDetails = {
  capabilityIds: CapabilityId[]
  defaultRisks: Record<CapabilityId, Risk[]>   // looked up from DEFAULT_RISKS
  controls: Control[]                           // expanded set referenced by the risks
  tests: Test[]
  evidence: Evidence[]
  recentRuns: { id: string; ranAt: string; status: 'success' | 'warning' | 'error'; summary: string }[]
  upNext: { id: string; title: string; due: string; severity: 'info' | 'warning' | 'urgent' }[]
  keySystem: KeySystemDetails
  dependsOn: DependencyItem[]
  dependedOnBy: DependencyItem[]
  workflow: WorkflowStep[]
  runRecords: RunRecord[]
  versions: AgentVersion[]
}

const DEFAULT_KEY_SYSTEM: KeySystemDetails = {
  auditProject: 'FY26 Q4 Close — Compliance Program',
  processes: ['Month-end close', 'Quarterly attestation'],
  keyReports: ['Run output log'],
  additionalInformation: 'Auto-registered from FloQast Transform. Prompt and model versions recorded with every run.',
}

const DEFAULT_DEPENDS_ON: DependencyItem[] = [
  { id: 'dep-default-1', code: 'KS-01', title: 'Vendor master data', description: 'Reference data from the ERP used to validate identities and account mappings.', status: 'Effective' },
]

const DEFAULT_DEPENDED_ON_BY: DependencyItem[] = [
  { id: 'depby-default-1', code: 'PR-01', title: 'Period close attestation', description: 'Sign-off chain for the close period draws on this agent\'s output.', status: 'In progress' },
]

const DEFAULT_WORKFLOW: WorkflowStep[] = [
  { id: 'w-1', title: 'Ingest source data', type: 'Data Transformation' },
  { id: 'w-2', title: 'Apply transformation rules', type: 'Data Transformation' },
  { id: 'w-3', title: 'Generate output', type: 'Data Transformation' },
]

const DEFAULT_RUN_RECORDS: RunRecord[] = [
  {
    id: 'rr-default-1',
    runBy: { name: 'Aaron Valdez', initials: 'AV' },
    ranAt: '4/03/2026 | 9:00am',
    ranAtRelative: '2 hours ago',
    status: 'Completed',
    version: 'Version 1',
  },
]

const DEFAULT_VERSIONS: AgentVersion[] = [
  { id: 'v-1', version: 'v1.0', releasedAt: 'Mar 1, 2026', author: 'System', changes: 'Initial release.', current: true },
]

function detailsFor(capabilityIds: CapabilityId[], extras: Partial<AgentDetails> = {}): AgentDetails {
  const defaultRisks = Object.fromEntries(
    capabilityIds.map((id) => [id, DEFAULT_RISKS[id]] as const)
  ) as Record<CapabilityId, Risk[]>
  const controlIds = new Set(
    capabilityIds.flatMap((id) => DEFAULT_RISKS[id].flatMap((r) => r.controlIds))
  )
  const controls = Array.from(controlIds).map((cid) => CONTROL_LIBRARY[cid]).filter(Boolean)
  return {
    capabilityIds,
    defaultRisks,
    controls,
    tests: [],
    evidence: [],
    recentRuns: [
      { id: 'run-1', ranAt: '2 hours ago', status: 'success', summary: 'Last run completed without flags' },
    ],
    upNext: [
      { id: 'un-1', title: 'Risk assessment review pending', due: 'Due in 30 days', severity: 'info' },
    ],
    keySystem: DEFAULT_KEY_SYSTEM,
    dependsOn: DEFAULT_DEPENDS_ON,
    dependedOnBy: DEFAULT_DEPENDED_ON_BY,
    workflow: DEFAULT_WORKFLOW,
    runRecords: DEFAULT_RUN_RECORDS,
    versions: DEFAULT_VERSIONS,
    ...extras,
  }
}

// AP Accruals Drafter — the SVG-anchored agent. Rich detail with real failing tests.
const AP_ACCRUALS_DETAILS: AgentDetails = detailsFor(['ING', 'TRF', 'JDG'], {
  tests: [
    { id: 't-1', controlId: 'C-JDG-02', title: 'Sampling-based accuracy test — variance < 5%', cadence: 'Monthly', lastRun: '6 days ago', result: 'fail', notes: 'October 2026 variance came in at 8.2% (Marketing GL). Threshold breach opened a gap.' },
    { id: 't-2', controlId: 'C-JDG-01', title: 'Explainability artifact on every output', cadence: 'Monthly', lastRun: '2 days ago', result: 'pass' },
    { id: 't-3', controlId: 'C-TRF-02', title: 'Sample re-run parity', cadence: 'Monthly', lastRun: '2 days ago', result: 'pass' },
    { id: 't-4', controlId: 'C-ING-01', title: 'Source-to-landing reconciliation', cadence: 'Daily', lastRun: '4 hours ago', result: 'pass' },
    { id: 't-5', controlId: 'C-JDG-02', title: 'Quarterly accuracy spot-check', cadence: 'Quarterly', lastRun: '8 days ago', result: 'fail', notes: 'Q3 2026 spot-check failed on the lease expense category. Investigation in progress.' },
    { id: 't-6', controlId: 'C-GOV-01', title: 'Agent-change 2-person approval — config change Apr 15', cadence: 'Monthly', lastRun: '2 days ago', result: 'pass' },
    { id: 't-7', controlId: 'C-GOV-03', title: 'Annual reliance recertification', cadence: 'Annual', lastRun: 'Pending', result: 'pending', notes: 'Due 2026-12-15. Owner: Sue Wong.' },
  ],
  evidence: [
    { id: 'e-1', type: 'Run log', capturedAt: '2026-05-06 04:00 UTC', source: 'Auto-captured from Transform', description: 'October 2026 close run — full input/output, prompt v3.2, model gpt-4o-2026-04, 142 line items' },
    { id: 'e-2', type: 'Test result', capturedAt: '2026-05-02 02:14 UTC', source: 'Auto-captured from Transform', description: 'Sampling-based accuracy test — 8.2% variance on Marketing GL (failure)' },
    { id: 'e-3', type: 'Approval record', capturedAt: '2026-04-28 16:42 UTC', source: 'Auto-captured from Transform', description: 'October close approval chain — 3 sign-offs (Sue Wong → Marcus Lee → Reza Karimi)' },
    { id: 'e-4', type: 'Configuration snapshot', capturedAt: '2026-04-15 09:00 UTC', source: 'Auto-captured from Transform', description: 'Confidence threshold change history — moved from 88% to 90% on 2026-04-15' },
    { id: 'e-5', type: 'Approval record', capturedAt: '2026-01-10 11:00 UTC', source: 'Uploaded by Sue Wong', description: 'Annual reliance attestation 2025 — signed PDF' },
  ],
  recentRuns: [
    { id: 'run-1', ranAt: '6 days ago', status: 'warning', summary: 'October close — 142 line items, 1 variance flag' },
    { id: 'run-2', ranAt: '36 days ago', status: 'success', summary: 'September close — 138 line items, no flags' },
    { id: 'run-3', ranAt: '67 days ago', status: 'success', summary: 'August close — 144 line items, no flags' },
  ],
  upNext: [
    { id: 'un-1', title: 'Investigate October sampling-test variance (8.2%)', due: 'Overdue 2 days', severity: 'urgent' },
    { id: 'un-2', title: 'Q3 spot-check failure — lease expense category', due: 'Due in 3 days', severity: 'urgent' },
    { id: 'un-3', title: 'Annual reliance recertification', due: 'Due in 218 days', severity: 'info' },
    { id: 'un-4', title: 'Review threshold change governance entry (Apr 15)', due: 'Due in 14 days', severity: 'warning' },
  ],
  keySystem: {
    auditProject: 'FY26 Q4 Close — Accounts Payable',
    processes: ['Month-end accruals', 'Open PO reconciliation', 'Quarterly variance review'],
    keyReports: ['Monthly accrual JE draft', 'Open commitment report', 'Hindsight variance report'],
    additionalInformation: 'Prompt v3.2 · Model gpt-4o-2026-04 · Confidence threshold 90% (raised from 88% on 2026-04-15). Auto-captured run logs include input/output, prompt, model, and plugin list per run.',
  },
  dependsOn: [
    { id: 'dep-1', code: 'KS-NET', title: 'NetSuite — Open POs and contracts', description: 'PO line data, vendor master, and committed amounts feed every accrual run.', status: 'Effective' },
    { id: 'dep-2', code: 'KS-RAMP', title: 'Ramp — Card transactions (vendor invoices)', description: 'Card-paid vendor invoices reconciled against PO commitments.', status: 'Effective' },
    { id: 'dep-3', code: 'AGT-RAMP', title: 'Ramp Transaction Classifier (agent)', description: 'Upstream classification feeds the GL account assignment used here.', status: 'Effective' },
    { id: 'dep-4', code: 'KR-VEND', title: 'Vendor master data', description: 'Vendor identifiers and policy mappings used to validate accrual line items.', status: 'In progress' },
  ],
  dependedOnBy: [
    { id: 'depby-1', code: 'PR-CLOSE', title: 'Period close attestation', description: 'Controller sign-off chain pulls accrual JEs as part of the close package.', status: 'In progress' },
    { id: 'depby-2', code: 'AGT-VAR', title: 'AP variance analyzer (agent)', description: 'Downstream variance commentary draws on the accrual draft.', status: 'Effective' },
    { id: 'depby-3', code: 'KR-AUDIT', title: 'Auditor evidence package — AP', description: 'External-audit deliverable is auto-built from this agent\'s evidence.', status: 'Not started' },
    { id: 'depby-4', code: 'KR-FCST', title: 'AP cash forecast', description: 'Treasury\'s 13-week cash forecast consumes the accrual draft for AP timing.', status: 'Ineffective' },
  ],
  workflow: [
    { id: 'wf-1', title: 'Join invoice and PO data', type: 'Data Transformation' },
    { id: 'wf-2', title: 'Filter to open POs', type: 'Data Transformation' },
    { id: 'wf-3', title: 'Create PO pivot table', type: 'Pivot Table' },
    { id: 'wf-4', title: 'Upload completed rec workbook', type: 'Upload to Reconciliation' },
    { id: 'wf-5', title: 'Ask for AP Specialist Approval', type: 'Human Review', branches: [
      { label: 'Approved', tone: 'success' },
      { label: 'Rejected', tone: 'fail' },
    ] },
  ],
  runRecords: [
    {
      id: 'rr-1',
      runBy: { name: 'Aaron Valdez', initials: 'AV' },
      ranAt: '4/03/2026 | 9:00am',
      ranAtRelative: '4 hours ago',
      status: 'In Progress',
      version: 'Version 7',
      inputs: [
        { id: 'in-1', filename: 'invoices_table_apr2026.csv', description: 'Invoice line items from AP module' },
        { id: 'in-2', filename: 'po_table_apr2026.csv', description: 'Open PO commitments from NetSuite' },
      ],
    },
    {
      id: 'rr-2',
      runBy: { name: 'Aaron Valdez', initials: 'AV' },
      ranAt: '3/29/2026 | 8:30am',
      ranAtRelative: '6 days ago',
      status: 'Completed',
      version: 'Version 7',
      inputs: [
        { id: 'in-3', filename: 'invoices_table_mar2026.csv', description: 'Invoice line items from AP module' },
        { id: 'in-4', filename: 'po_table_mar2026.csv', description: 'Open PO commitments from NetSuite' },
      ],
      outputs: [
        { id: 'out-1', filename: 'march_accrual_je_draft.csv', description: 'Draft journal entry — March 2026 close' },
      ],
      humanReview: {
        step: 'AP Specialist Approval',
        status: 'approved',
        decidedBy: { name: 'Sue Wong', initials: 'SW' },
      },
    },
    {
      id: 'rr-3',
      runBy: { name: 'Aaron Valdez', initials: 'AV' },
      ranAt: '3/24/2026 | 5:10pm',
      ranAtRelative: '11 days ago',
      status: 'Completed',
      version: 'Version 6',
      inputs: [
        { id: 'in-5', filename: 'invoices_table_mar_w3.csv', description: 'Invoice line items from AP module' },
        { id: 'in-6', filename: 'po_table_mar_w3.csv', description: 'Open PO commitments from NetSuite' },
      ],
      outputs: [
        { id: 'out-2', filename: 'mar_w3_accrual_je_draft.csv', description: 'Draft journal entry — week 3 mid-month accrual' },
      ],
      humanReview: {
        step: 'AP Specialist Approval',
        status: 'approved',
        decidedBy: { name: 'Sue Wong', initials: 'SW' },
      },
    },
  ],
  versions: [
    { id: 'ver-1', version: 'v7.0', releasedAt: 'Apr 15, 2026', author: 'Sue Wong', changes: 'Raised confidence threshold from 88% to 90%. Updated prompt to require explicit GL code citation.', current: true },
    { id: 'ver-2', version: 'v6.0', releasedAt: 'Feb 28, 2026', author: 'Marcus Lee', changes: 'Added Ramp transaction join. Model upgraded to gpt-4o-2026-04.' },
    { id: 'ver-3', version: 'v5.0', releasedAt: 'Jan 18, 2026', author: 'Sue Wong', changes: 'Expanded scope to include lease accruals. Added lease-specific validation rules.' },
    { id: 'ver-4', version: 'v4.0', releasedAt: 'Nov 02, 2025', author: 'Olivia Brennan', changes: 'Annual reliance recertification. Prompt refresh; no behavior change.' },
  ],
})

const AGENT_TO_CAPABILITIES: Record<string, CapabilityId[]> = {
  'rev-rec': ['JDG', 'TRF'],
  'ap-matcher': ['ING', 'PST'],
  'ap-accruals': ['ING', 'TRF', 'JDG'],
  'bank-recon': ['PST', 'TRF'],
  'ramp-classifier': ['ING', 'TRF', 'JDG'],
  'depreciation-je': ['TRF', 'JDG', 'PST'],
  'lease-schedules': ['TRF', 'JDG'],
  'ar-aging': ['MON', 'JDG'],
  'three-way-match': ['ING', 'PST', 'ORC'],
}

export function getAgentDetails(agentId: string): AgentDetails {
  if (agentId === 'ap-accruals') return AP_ACCRUALS_DETAILS
  const caps = AGENT_TO_CAPABILITIES[agentId] ?? ['JDG']
  return detailsFor(caps)
}

export function getAgentCapabilityIds(agentId: string): CapabilityId[] {
  return AGENT_TO_CAPABILITIES[agentId] ?? ['JDG']
}
