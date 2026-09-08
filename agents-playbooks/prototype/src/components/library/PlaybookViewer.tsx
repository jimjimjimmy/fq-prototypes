import { useState, useEffect } from 'react'
import {
  Layers, Settings, Clock, Play, ChevronLeft, ChevronRight, ChevronDown, X,
  Sparkles, Check, AlertCircle, Loader, Plus, Square, Send, Pen, Bot, UserCheck,
  FolderOpen, LayoutGrid, Network,
} from 'lucide-react'
import {
  COUPA_PLAYBOOK_CONTENT, PLAYBOOK_CONTENT, PLAYBOOK_TOC,
  PENDING_APPROVAL_NOTES, PLAYBOOK_TEST_RUN, WORKFLOW_DATA, PLAYBOOK_DOC_CONTROLS,
} from '../../data/playbookContent'
import type { TestRunData, EvidenceDialogData, WorkflowControl } from '../../data/playbookContent'
import { RunAgentPanel } from './RunAgentPanel'
import { WorkflowCanvas } from './WorkflowCanvas'
import type { Playbook, PlaybookStatus } from '../../data/mockData'

type ActivePanel = 'version' | 'properties' | 'activity' | 'test' | 'test-review' | 'run' | null
type ViewerRole = 'creator' | 'approver'

const STATUS_CHIP: Record<string, { bg: string; color: string; border: string }> = {
  'Draft':            { bg: '#F0F2F5', color: '#6B7A99', border: '#D0D9E8' },
  'Pending Approval': { bg: '#FEF3E2', color: '#B07D00', border: '#F4A429' },
  'Approved':         { bg: '#EBF4FF', color: '#1557A0', border: '#BFDBFE' },
  'Live':             { bg: '#E6F9F1', color: '#059669', border: '#6EE7B7' },
}

interface TestRunRecord {
  runBy: string
  timestamp: string
  modelVersion: string
  configVersion: string
  dataSources: Array<{ name: string; source: string }>
  vendorDrift: string
  confidencePassRate: string
}

interface PlaybookViewerProps {
  playbook: Playbook | null
  onBack: () => void
  onStatusChange?: (id: string, status: PlaybookStatus) => void
  initialPanel?: 'run'
}

const DEFAULT_TOC = [
  '1. Role and Objective',
  '2. Required Input Data',
  '2.1 Sample PO Input',
  '3. Core Processing Logic',
  '3.1 Date Handling',
  '3.2 Proration Example',
  '3.3 Invoice Matching',
  '3.4 Matching Output',
  '4. Output & JE Format',
  '4.1 Sample JE',
  '5. Validation',
  '6. Exception Handling',
  '7. Approval & Posting',
  '8. Period-End Checklist',
]

// Splits a document HTML string at every <h1> or <h2> boundary so we can
// inject React control callout strips between the rendered heading and its body prose.
function parseDocSections(html: string): Array<{ heading: string; html: string }> {
  const parts = html.split(/(?=<h[12][^>]*>)/i)
  return parts.map(chunk => {
    const match = chunk.match(/^<h[12][^>]*>(.*?)<\/h[12]>/i)
    const heading = match ? match[1].replace(/<[^>]+>/g, '').trim() : ''
    return { heading, html: chunk }
  })
}

export function PlaybookViewer({ playbook, onBack, onStatusChange, initialPanel }: PlaybookViewerProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(initialPanel ?? null)
  const [viewerRole, setViewerRole] = useState<ViewerRole>('creator')
  const [hasApprovedTest, setHasApprovedTest] = useState(false)
  const [localStatus, setLocalStatus] = useState<'Draft' | 'Pending Approval' | 'Approved' | 'Live'>(
    (playbook?.status as 'Draft' | 'Pending Approval' | 'Approved' | 'Live') ?? 'Draft'
  )
  const [approvalState, setApprovalState] = useState<'pending' | 'approved' | 'live'>('pending')
  const [hasReviewedTestRun, setHasReviewedTestRun] = useState(false)
  const [testRunRecord, setTestRunRecord] = useState<TestRunRecord | null>(null)

  const id = playbook?.id ?? ''
  const isDraft = localStatus === 'Draft'

  useEffect(() => {
    if (id && onStatusChange) onStatusChange(id, localStatus)
  }, [localStatus])
  const isPendingApproval = localStatus === 'Pending Approval'
  const version = playbook?.version ?? 'V2'

  const handleSubmitForReview = () => {
    setLocalStatus('Pending Approval')
    setActivePanel(null)
    setViewerRole('creator')
  }

  const tocSections = PLAYBOOK_TOC[id] ?? DEFAULT_TOC
  const [activeToc, setActiveToc] = useState(tocSections[0])
  const content = PLAYBOOK_CONTENT[id] ?? COUPA_PLAYBOOK_CONTENT
  const approvalMeta = PENDING_APPROVAL_NOTES[id]
  const testRunData = PLAYBOOK_TEST_RUN[id]

  const folderName = 'Accounts Payable'
  const playbookName = playbook?.name ?? 'Coupa PO Accrual'

  const togglePanel = (panel: NonNullable<ActivePanel>) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', borderBottom: '1px solid #E4E9F2',
        padding: '0 20px', flexShrink: 0, gap: 16,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          <button
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <span style={{ fontSize: 13, color: '#6B7A99', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={onBack}>
            {folderName}
          </span>
          <ChevronRight size={13} strokeWidth={1.75} color="#C2CDE0" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {playbook?.type ?? 'Playbook'}: {playbookName}
          </span>
        </div>

        {/* Role tabs — Pending Approval only */}
        {isPendingApproval && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E4E9F2', borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
            <RoleTab label="Creator" icon={<Pen size={12} strokeWidth={2} />} active={viewerRole === 'creator'} onClick={() => setViewerRole('creator')} />
            <RoleTab label="Approver" icon={<Check size={12} strokeWidth={2.5} />} active={viewerRole === 'approver'} onClick={() => setViewerRole('approver')} />
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Panel toggles — version, properties, activity always; test only for non-draft */}
          <PanelToggleBtn active={activePanel === 'version'} onClick={() => togglePanel('version')} title="Version History">
            <Layers size={14} strokeWidth={1.75} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{version}</span>
            {(() => {
              const chip = STATUS_CHIP[localStatus] ?? STATUS_CHIP['Draft']
              return (
                <span style={{
                  fontSize: 10, fontWeight: 600, lineHeight: '14px',
                  padding: '1px 6px', borderRadius: 3, marginLeft: 2,
                  background: chip.bg, color: chip.color,
                  border: `1px solid ${chip.border}`,
                  whiteSpace: 'nowrap',
                }}>
                  {localStatus}
                </span>
              )
            })()}
          </PanelToggleBtn>
          <PanelToggleBtn active={activePanel === 'properties'} onClick={() => togglePanel('properties')} title="Properties">
            <Settings size={14} strokeWidth={1.75} />
          </PanelToggleBtn>
          <PanelToggleBtn active={activePanel === 'activity'} onClick={() => togglePanel('activity')} title="Activity Log">
            <Clock size={14} strokeWidth={1.75} />
          </PanelToggleBtn>

          <div style={{ width: 1, height: 20, background: '#E4E9F2', margin: '0 2px' }} />

          {isDraft ? (
            <>
              <button
                onClick={() => togglePanel('test')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 32, borderRadius: 6,
                  border: '1px solid #D0D9E8',
                  background: activePanel === 'test' ? '#EEF2F8' : '#fff',
                  color: '#4A556A',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                Test Agent
              </button>
              <button
                disabled={!hasApprovedTest}
                onClick={handleSubmitForReview}
                title={hasApprovedTest ? undefined : 'Approve a test run before submitting'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 32, borderRadius: 6,
                  border: 'none',
                  background: hasApprovedTest ? '#1FAC76' : '#E4E9F2',
                  color: hasApprovedTest ? '#fff' : '#8896B0',
                  fontSize: 13, fontWeight: 500,
                  cursor: hasApprovedTest ? 'pointer' : 'not-allowed',
                  fontFamily: 'Inter, sans-serif', transition: 'all 150ms',
                }}
              >
                Submit for Review
              </button>
            </>
          ) : isPendingApproval && viewerRole === 'creator' ? (
            <>
              <button
                onClick={() => togglePanel('test')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 32, borderRadius: 6,
                  border: 'none', background: '#1FAC76', color: '#fff',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                <Play size={12} strokeWidth={2} fill="currentColor" />
                Test Run Agent
              </button>
            </>
          ) : isPendingApproval && viewerRole === 'approver' ? (
            <>
              <button
                disabled
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 14px', height: 32, borderRadius: 6,
                  border: 'none', background: '#E4E9F2', color: '#8896B0',
                  fontSize: 13, fontWeight: 500, cursor: 'not-allowed', fontFamily: 'Inter, sans-serif',
                }}
              >
                <Play size={12} strokeWidth={2} fill="currentColor" />
                Run Agent
              </button>
            </>
          ) : (
            <button
              onClick={() => togglePanel('run')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: 32, borderRadius: 6,
                border: 'none',
                background: activePanel === 'run' ? '#186749' : '#1FAC76',
                color: '#fff',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
              <Play size={12} strokeWidth={2} fill="currentColor" />
              Run Agent
            </button>
          )}
        </div>
      </div>

      {/* Pending banner */}
      {isPendingApproval && approvalState === 'pending' && (
        <div style={{
          background: '#FFFBEB', borderBottom: '1px solid #FDE68A',
          padding: '10px 20px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {viewerRole === 'creator' ? (
            <span style={{ fontSize: 12, color: '#92400E' }}>
              <strong>Submitted for approval</strong> · {approvalMeta?.submittedDate ?? 'May 6'} · Awaiting review by {approvalMeta?.reviewerName ?? 'Sarah Chen'}
            </span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 12, color: '#92400E' }}>
                <strong>Review requested</strong> by {approvalMeta?.submittedBy ?? 'Joseph Vu'} · {approvalMeta?.submittedDate ?? 'May 6'}
              </span>
              {approvalMeta?.note && (
                <span style={{ fontSize: 12, color: '#78350F', fontStyle: 'italic' }}>
                  "{approvalMeta.note}"
                </span>
              )}
            </div>
          )}
          {viewerRole === 'approver' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => { setHasReviewedTestRun(true); setActivePanel('test-review') }}
                style={{
                  padding: '6px 14px', borderRadius: 6, border: '1px solid #D0D9E8',
                  background: '#fff', fontSize: 12, fontWeight: 500,
                  color: '#4A556A', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
              >
                Review Test Run
              </button>
              <button
                disabled={!hasReviewedTestRun}
                onClick={() => { setApprovalState('approved'); setLocalStatus('Approved') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 14px', borderRadius: 6, border: 'none',
                  background: hasReviewedTestRun ? '#1FAC76' : '#E4E9F2',
                  color: hasReviewedTestRun ? '#fff' : '#8896B0',
                  fontSize: 12, fontWeight: 500,
                  cursor: hasReviewedTestRun ? 'pointer' : 'not-allowed',
                  fontFamily: 'Inter, sans-serif', transition: 'all 150ms',
                }}
              >
                <Check size={13} strokeWidth={2.5} />
                Approve
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success banner — after approval */}
      {approvalState === 'approved' && localStatus !== 'Live' && (
        <div style={{
          background: '#F0FDF4', borderBottom: '1px solid #BBF7D0',
          padding: '10px 20px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#1FAC76',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Check size={12} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 500 }}>
              Agent approved by {approvalMeta?.reviewerName ?? 'Sarah Chen'}
            </span>
          </div>
          <button
            onClick={() => { setApprovalState('live'); setLocalStatus('Live') }}
            style={{
              padding: '6px 14px', borderRadius: 6, border: '1px solid #1FAC76',
              background: '#fff', fontSize: 12, fontWeight: 500,
              color: '#1FAC76', cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0,
            }}
          >
            Set agent to Live mode
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {playbook?.type === 'Workflow' ? (
          <>
            {/* Workflow icon sidebar */}
            <aside style={{
              width: 48, background: '#fff', borderRight: '1px solid #E4E9F2',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 0', gap: 2, flexShrink: 0,
            }}>
              {([
                { Icon: FolderOpen, title: 'Content', active: false },
                { Icon: LayoutGrid, title: 'Components', active: false },
                { Icon: Network,    title: 'Structure',  active: true  },
              ] as const).map(({ Icon, title, active }) => (
                <button key={title} title={title} style={{
                  width: 34, height: 34, borderRadius: 6, border: 'none',
                  background: active ? '#EEF2F8' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: active ? '#1D2433' : '#8896B0',
                }}>
                  <Icon size={16} strokeWidth={1.75} />
                </button>
              ))}
            </aside>

            {/* Canvas */}
            <WorkflowCanvas data={WORKFLOW_DATA[id]} />
          </>
        ) : (
          <>
            {/* TOC sidebar */}
            <aside style={{
              width: 200, background: '#fff', borderRight: '1px solid #E4E9F2',
              overflow: 'auto', padding: '16px 0', flexShrink: 0,
            }}>
              <div style={{
                fontSize: 10, color: '#8896B0', fontWeight: 600,
                padding: '0 16px 8px', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                CONTENT
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column' }}>
                {tocSections.map((section) => {
                  const isActive = section === activeToc
                  const isSub = /^\d+\.\d+/.test(section)
                  return (
                    <button
                      key={section}
                      onClick={() => setActiveToc(section)}
                      style={{
                        textAlign: 'left', background: 'transparent', border: 'none',
                        borderLeft: isActive ? '2px solid #1FAC76' : '2px solid transparent',
                        padding: `4px 16px 4px ${isSub ? '28px' : '20px'}`,
                        fontSize: 12, color: isActive ? '#1FAC76' : '#4A556A',
                        fontWeight: isActive ? 500 : 400, cursor: 'pointer',
                        lineHeight: '18px', fontFamily: 'Inter, sans-serif', width: '100%',
                      }}
                    >
                      {section}
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Document area */}
            <div style={{ flex: 1, overflow: 'auto', background: '#F8FAFC', padding: '24px' }}>
              <div style={{
                background: '#fff', border: '1px solid #E4E9F2', borderRadius: 8,
                maxWidth: 800, margin: '0 auto',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 24px', borderBottom: '1px solid #E4E9F2',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#6B7A99',
                      background: '#F3F4F6', borderRadius: 3, padding: '2px 6px',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>
                      {playbook?.type ?? 'Playbook'}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#1D2433' }}>{playbookName}</span>
                  </div>
                  <button style={{
                    padding: '5px 12px', borderRadius: 5, border: '1px solid #D0D9E8',
                    background: '#fff', fontSize: 12, color: '#4A556A', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Edit
                  </button>
                </div>
                {(() => {
                  const sections = parseDocSections(content)
                  const sectionControls = PLAYBOOK_DOC_CONTROLS[id] ?? {}
                  return sections.map((sec, i) => (
                    <div key={i}>
                      <div
                        className="playbook-content"
                        dangerouslySetInnerHTML={{ __html: sec.html }}
                        style={{
                          fontSize: 13, lineHeight: '20px', color: '#1D2433',
                          paddingLeft: 24, paddingRight: 24,
                          paddingTop: i === 0 ? 24 : 0,
                          paddingBottom: i === sections.length - 1 ? 24 : 0,
                        }}
                      />
                      {sectionControls[sec.heading] && (
                        <DocControlsStrip controls={sectionControls[sec.heading]} />
                      )}
                    </div>
                  ))
                })()}
              </div>
            </div>
          </>
        )}

        {/* Right drawers */}
        {activePanel === 'version' && <VersionPanel onClose={() => setActivePanel(null)} version={version} />}
        {activePanel === 'properties' && <PropertiesPanel onClose={() => setActivePanel(null)} playbook={playbook} />}
        {activePanel === 'activity' && <ActivityPanel onClose={() => setActivePanel(null)} testRunRecord={testRunRecord} />}
        {activePanel === 'test' && (
          <TestRunPanel
            onClose={() => setActivePanel(null)}
            playbookName={playbookName}
            testRunData={testRunData}
            onTestApprove={() => {
              setHasApprovedTest(true)
              setTestRunRecord({
                runBy: 'Joseph Vu',
                timestamp: 'May 6, 2026 · 2:14 PM',
                modelVersion: 'claude-sonnet-4-6',
                configVersion: '1.0.0',
                dataSources: [
                  { name: 'pending_invoices.csv', source: 'Coupa → Pending Approval' },
                  { name: 'po_lines.csv', source: 'Coupa → PO Lines' },
                  { name: 'receipts.csv', source: 'ERP → Receiving' },
                ],
                vendorDrift: 'None detected',
                confidencePassRate: '44 of 47 matches (94%)',
              })
            }}
            onSubmitForReview={handleSubmitForReview}
          />
        )}
        {activePanel === 'test-review' && (
          <TestReviewPanel
            onClose={() => setActivePanel(null)}
            testRunData={testRunData}
            onApprove={() => { setApprovalState('approved'); setLocalStatus('Approved'); setActivePanel(null) }}
          />
        )}
        {activePanel === 'run' && (
          <RunAgentPanel
            playbookId={id}
            playbookName={playbookName}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>
    </div>
  )
}

/* ── Role tab ── */
function RoleTab({ label, icon, active, onClick }: {
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '0 12px', height: 32, border: 'none', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: active ? 600 : 400,
        background: active ? '#F0FDF4' : '#fff',
        color: active ? '#1FAC76' : '#6B7A99',
        borderRight: '1px solid #E4E9F2',
        transition: 'all 120ms',
      }}
    >
      {icon}{label}
    </button>
  )
}

/* ── Panel toggle button ── */
function PanelToggleBtn({ active, onClick, title, children }: {
  active: boolean; onClick: () => void; title: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        height: 32, padding: '0 10px', borderRadius: 6,
        border: '1px solid', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        background: active ? '#EEF2F8' : '#fff',
        borderColor: active ? '#C2CDE0' : '#D0D9E8',
        color: active ? '#1D2433' : '#6B7A99',
        transition: 'all 120ms',
      }}
    >
      {children}
    </button>
  )
}

/* ── Drawer shell ── */
function DrawerShell({ title, width = 320, onClose, children }: {
  title: string; width?: number; onClose: () => void; children: React.ReactNode
}) {
  return (
    <aside style={{
      width, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: '#fff', borderLeft: '1px solid #E4E9F2', overflow: 'hidden',
    }}>
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: '1px solid #E4E9F2', flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{title}</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex', alignItems: 'center', padding: 2, borderRadius: 4 }}>
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </aside>
  )
}

/* ── Drawer tabs ── */
function DrawerTabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #E4E9F2', padding: '0 16px' }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '8px 12px 10px', border: 'none', background: 'transparent',
            fontSize: 12, fontWeight: active === tab ? 600 : 400,
            color: active === tab ? '#1D2433' : '#6B7A99',
            borderBottom: active === tab ? '2px solid #1D2433' : '2px solid transparent',
            cursor: 'pointer', marginBottom: -1, fontFamily: 'Inter, sans-serif',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

/* ── Version History panel ── */
function VersionPanel({ onClose, version }: { onClose: () => void; version: string }) {
  const isV1 = version === 'V1'
  const [expandedVersion, setExpandedVersion] = useState<string | null>(isV1 ? 'v1' : 'v2')

  return (
    <DrawerShell title="Version History" onClose={onClose}>
      <div style={{ padding: '12px 0' }}>
        {!isV1 && (
          <>
            <VersionRow label="Draft V3" badge={{ text: 'DRAFT', color: '#F4A429' }} expanded={false} onClick={() => {}} />
            <VersionRow
              label="Version 2"
              badge={{ text: 'CURRENT', color: '#1FAC76' }}
              expanded={expandedVersion === 'v2'}
              onClick={() => setExpandedVersion(expandedVersion === 'v2' ? null : 'v2')}
            />
            {expandedVersion === 'v2' && (
              <SubVersionList entries={[
                { sub: '2.0.3', date: 'Mar 10, 2026', author: 'SC' },
                { sub: '2.0.2', date: 'Feb 28, 2026', author: 'SJ' },
                { sub: '2.0.1', date: 'Feb 14, 2026', author: 'SC' },
                { sub: '2.0.0', date: 'Jan 31, 2026', author: 'MK' },
              ]} />
            )}
          </>
        )}
        <VersionRow
          label="Version 1"
          badge={isV1 ? { text: 'CURRENT', color: '#1FAC76' } : undefined}
          expanded={expandedVersion === 'v1'}
          onClick={() => setExpandedVersion(expandedVersion === 'v1' ? null : 'v1')}
        />
        {expandedVersion === 'v1' && (
          <SubVersionList entries={[
            { sub: '1.0.0', date: 'May 6, 2026', author: 'JV', active: true },
          ]} />
        )}
      </div>
    </DrawerShell>
  )
}

function SubVersionList({ entries }: { entries: { sub: string; date: string; author: string; active?: boolean }[] }) {
  return (
    <div style={{ paddingLeft: 32, paddingBottom: 8 }}>
      {entries.map(({ sub, date, author, active }, i) => (
        <div key={sub} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 16px 7px 0', borderLeft: '2px solid #E4E9F2',
          marginLeft: 8, position: 'relative',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: active || i === 0 ? '#1FAC76' : '#D0D9E8',
            position: 'absolute', left: -5, flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, color: '#1D2433', fontWeight: 500, paddingLeft: 12 }}>{sub}</span>
          <span style={{ fontSize: 11, color: '#8896B0', flex: 1 }}>{date}</span>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: ['#1FAC76', '#3B5BDB', '#E5534B', '#F4A429'][i % 4],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: '#fff',
          }}>
            {author}
          </div>
        </div>
      ))}
    </div>
  )
}

function VersionRow({ label, badge, expanded, onClick }: {
  label: string; badge?: { text: string; color: string }; expanded: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        padding: '9px 16px', background: 'transparent', border: 'none',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', borderBottom: '1px solid #F3F4F6',
      }}
    >
      {expanded
        ? <ChevronDown size={14} strokeWidth={1.75} color="#6B7A99" />
        : <ChevronRight size={14} strokeWidth={1.75} color="#6B7A99" />
      }
      <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#1D2433' }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
          background: badge.color + '22', color: badge.color, letterSpacing: '0.04em',
        }}>
          {badge.text}
        </span>
      )}
    </button>
  )
}

/* ── Properties panel ── */
function PropertiesPanel({ onClose, playbook }: { onClose: () => void; playbook: Playbook | null }) {
  const [activeTab, setActiveTab] = useState('Summary')
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [workflowOpen, setWorkflowOpen] = useState(false)
  const isDraft = playbook?.status === 'Draft'

  return (
    <DrawerShell title="Properties" onClose={onClose}>
      <DrawerTabs tabs={['Summary', 'Permissions']} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'Summary' && (
        <div style={{ padding: '16px' }}>
          <SectionHeader label="Info" />
          <PropField label="Title" value={playbook?.name ?? 'Coupa PO Accrual'} />
          <PropField label="Description" value="Automates identification and calculation of month-end accruals from open Coupa POs." multiline />
          <div style={{ marginBottom: 10 }}>
            <span style={labelStyle}>Owner</span>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 8px', border: '1px solid #D0D9E8', borderRadius: 5,
              background: '#fff', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar initials="JV" color="#F4A429" />
                <span style={{ fontSize: 12, color: '#1D2433' }}>Joseph Vu</span>
              </div>
              <ChevronDown size={12} strokeWidth={1.75} color="#6B7A99" />
            </div>
          </div>
          <PropField label="Created by" value="Joseph Vu  ·  May 6, 2026" />
          <PropField label="Last Edited" value="May 6, 2026" />
          {!isDraft && <PropField label="Approved by" value="Steven James" />}
          <div style={{ marginBottom: 10 }}>
            <span style={labelStyle}>Status</span>
            <StatusChipStatic status={playbook?.status ?? 'Live'} />
          </div>
          {!isDraft && playbook?.lastRun && <PropField label="Last Run" value={playbook.lastRun} />}
          <Divider />
          <button
            onClick={() => setScheduleOpen(!scheduleOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0 8px', fontFamily: 'Inter, sans-serif' }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>Schedule</span>
            {scheduleOpen ? <ChevronDown size={13} strokeWidth={1.75} color="#6B7A99" /> : <ChevronRight size={13} strokeWidth={1.75} color="#6B7A99" />}
          </button>
          {scheduleOpen && (
            <div style={{ padding: '4px 0 8px' }}>
              <PropField label="Frequency" value="Not scheduled" />
            </div>
          )}
          <Divider />
          <button
            onClick={() => setWorkflowOpen(!workflowOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0 8px', fontFamily: 'Inter, sans-serif' }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>Workflow</span>
            {workflowOpen ? <ChevronDown size={13} strokeWidth={1.75} color="#6B7A99" /> : <ChevronRight size={13} strokeWidth={1.75} color="#6B7A99" />}
          </button>
          {workflowOpen && (
            <div style={{ padding: '4px 0', fontSize: 12, color: '#8896B0' }}>No workflows yet.</div>
          )}
        </div>
      )}
      {activeTab === 'Permissions' && (
        <div style={{ padding: '16px' }}>
          {[
            { name: 'Joseph Vu', initials: 'JV', color: '#F4A429', role: 'Owner' },
            { name: 'Sarah Chen', initials: 'SC', color: '#1FAC76', role: 'View' },
          ].map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Avatar initials={p.initials} color={p.color} />
              <span style={{ flex: 1, fontSize: 12, color: '#1D2433' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: '#6B7A99' }}>{p.role}</span>
            </div>
          ))}
          <button style={{ background: 'transparent', border: 'none', fontSize: 12, color: '#1FAC76', cursor: 'pointer', padding: '4px 0', fontFamily: 'Inter, sans-serif' }}>
            + Add member
          </button>
        </div>
      )}
    </DrawerShell>
  )
}

/* ── Activity Log panel ── */
function ActivityPanel({ onClose, testRunRecord }: { onClose: () => void; testRunRecord: TestRunRecord | null }) {
  const [activeTab, setActiveTab] = useState('Run History')
  const [bomExpanded, setBomExpanded] = useState(false)

  return (
    <DrawerShell title="Activity Log" onClose={onClose}>
      <DrawerTabs tabs={['Run History', 'Edit History']} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'Run History' && (
        <div>
          {!testRunRecord ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#8896B0', lineHeight: '18px' }}>
                No completed runs yet.
              </div>
              <div style={{ fontSize: 12, color: '#8896B0', lineHeight: '18px', marginTop: 2 }}>
                Approve a test run to log the first entry.
              </div>
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {/* Run entry row */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials="JV" color="#F4A429" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#1D2433', fontWeight: 500 }}>{testRunRecord.runBy}</div>
                    <RunStatusChip status="Completed" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <Clock size={11} strokeWidth={1.75} color="#8896B0" />
                    <div>
                      <div style={{ fontSize: 11, color: '#6B7A99' }}>May 6, 2026</div>
                      <div style={{ fontSize: 10, color: '#8896B0' }}>2:14 PM</div>
                    </div>
                  </div>
                </div>

                {/* Bill of materials toggle */}
                <button
                  onClick={() => setBomExpanded(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    marginTop: 8, background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: 0, fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <ChevronDown
                    size={12} strokeWidth={1.75} color="#6B7A99"
                    style={{ transform: bomExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                  />
                  <span style={{ fontSize: 11, color: '#6B7A99', fontWeight: 500 }}>Bill of Materials</span>
                </button>

                {bomExpanded && (
                  <div style={{
                    marginTop: 8, background: '#F8FAFC', border: '1px solid #E4E9F2',
                    borderRadius: 6, padding: '10px 12px',
                  }}>
                    <BomRow label="Model" value={testRunRecord.modelVersion} />
                    <BomRow label="Config version" value={testRunRecord.configVersion} />
                    <BomRow label="Confidence pass rate" value={testRunRecord.confidencePassRate} />
                    <BomRow label="Vendor drift" value={testRunRecord.vendorDrift} />
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 10, color: '#8896B0', display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Data Sources</span>
                      {testRunRecord.dataSources.map((ds, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: '#1D2433', fontWeight: 500 }}>{ds.name}</span>
                          <span style={{ fontSize: 11, color: '#6B7A99' }}>{ds.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'Edit History' && (
        <div style={{ padding: '16px', fontSize: 12, color: '#8896B0' }}>No edit history to display.</div>
      )}
    </DrawerShell>
  )
}

function BomRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
      <span style={{ fontSize: 11, color: '#8896B0' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#1D2433', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function RunStatusChip({ status }: { status: 'Completed' | 'In Progress' | 'Error' }) {
  const map = {
    Completed: { bg: '#E6F9F1', color: '#1FAC76', icon: <Check size={10} strokeWidth={2.5} /> },
    'In Progress': { bg: '#EBF4FF', color: '#3B82F6', icon: <Loader size={10} strokeWidth={2.5} /> },
    Error: { bg: '#FEF3E2', color: '#E5534B', icon: <AlertCircle size={10} strokeWidth={2.5} /> },
  }
  const { bg, color, icon } = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10, fontWeight: 500, padding: '1px 5px', borderRadius: 3,
      background: bg, color, marginTop: 2,
    }}>
      {icon}{status}
    </span>
  )
}

function StatusChipStatic({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Live: { bg: '#E6F9F1', color: '#1FAC76' },
    Draft: { bg: '#F3F4F6', color: '#6B7A99' },
    'Pending Approval': { bg: '#FEF3E2', color: '#B07D00' },
  }
  const { bg, color } = map[status] ?? { bg: '#F3F4F6', color: '#6B7A99' }
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 3, background: bg, color }}>
      {status}
    </span>
  )
}

/* ── Test Run panel ── */
function TestRunPanel({ onClose, playbookName, testRunData, onTestApprove, onSubmitForReview }: {
  onClose: () => void
  playbookName: string
  testRunData: TestRunData | undefined
  onTestApprove: () => void
  onSubmitForReview: () => void
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [confirmedDialogs, setConfirmedDialogs] = useState<Set<string>>(new Set())
  const [rejectedDialogs, setRejectedDialogs] = useState<Set<string>>(new Set())
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null)
  const [testApproved, setTestApproved] = useState(false)
  const [notes, setNotes] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [visibleCount, setVisibleCount] = useState(0)
  const [loadingStep, setLoadingStep] = useState<number | null>(null)
  const [dotPhase, setDotPhase] = useState(0)
  const [runComplete, setRunComplete] = useState(false)
  const [runKey, setRunKey] = useState(0)

  const steps = testRunData?.steps ?? []
  const summary = testRunData?.summary

  const evidenceDialogIds = steps
    .map(s => s.evidenceDialogId)
    .filter((id): id is string => !!id)
  const allDialogsConfirmed =
    evidenceDialogIds.length === 0 || evidenceDialogIds.every(id => confirmedDialogs.has(id))
  const pendingDialogs = evidenceDialogIds.filter(id => !confirmedDialogs.has(id)).length

  const STEP_DURATION = 1200

  // Sequential step animation
  useEffect(() => {
    setVisibleCount(0)
    setLoadingStep(null)
    setExpandedSteps(new Set())
    setRunComplete(false)
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleCount(i + 1)
        setLoadingStep(i)
      }, i * STEP_DURATION))
      timers.push(setTimeout(() => {
        setExpandedSteps(prev => new Set([...prev, i]))
        setLoadingStep(i === steps.length - 1 ? null : i + 1)
        if (i === steps.length - 1) setRunComplete(true)
      }, i * STEP_DURATION + STEP_DURATION - 300))
    })
    return () => timers.forEach(clearTimeout)
  }, [steps.length, runKey])

  // Dot animation while a step is loading
  useEffect(() => {
    if (loadingStep === null) return
    const interval = setInterval(() => setDotPhase(p => (p + 1) % 3), 400)
    return () => clearInterval(interval)
  }, [loadingStep])

  const toggleStep = (i: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const restartRun = () => {
    setTestApproved(false)
    setConfirmedDialogs(new Set())
    setRejectedDialogs(new Set())
    setRunKey(k => k + 1)
  }

  return (
    <aside style={{
      width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: '#fff', borderLeft: '1px solid #E4E9F2', overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: '1px solid #E4E9F2', flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>Test Run</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={ghostBtn} title="New test" onClick={restartRun}><Plus size={15} strokeWidth={1.75} /></button>
          <button style={ghostBtn} title="Minimize"><Square size={13} strokeWidth={1.75} /></button>
          <button onClick={onClose} style={ghostBtn} title="Close"><X size={15} strokeWidth={1.75} /></button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Blue info banner */}
        <div style={{
          margin: '12px 12px 0',
          background: '#EBF4FF', border: '1px solid #BFDBFE', borderRadius: 6,
          padding: '7px 10px', fontSize: 11, color: '#1D4ED8', lineHeight: '16px',
          display: 'flex', gap: 6, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>ⓘ</span>
          <span>Test mode — nothing will be saved or posted to the ERP.</span>
        </div>

        <div style={{ padding: '12px' }}>
            {/* Steps accordion */}
            {steps.slice(0, visibleCount).map((step, i) => {
              const isExpanded = expandedSteps.has(i)
              const isLoading = i === loadingStep
              const isLast = i === steps.length - 1
              const dots = ['·', '··', '···'][dotPhase]
              return (
                <div key={i} style={{ marginBottom: 4 }}>
                  {isLoading ? (
                    /* Loading state — pulsing dots, not interactive */
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 0', gap: 8,
                    }}>
                      <span style={{
                        fontSize: 12, color: '#1FAC76', fontWeight: 500,
                        textAlign: 'left', lineHeight: '16px',
                      }}>
                        {step.title}
                      </span>
                      <span style={{
                        fontSize: 13, color: '#1FAC76', fontWeight: 700,
                        flexShrink: 0, minWidth: 16, textAlign: 'right', letterSpacing: 1,
                      }}>
                        {dots}
                      </span>
                    </div>
                  ) : (
                    /* Completed state — expandable */
                    <button
                      onClick={() => toggleStep(i)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', background: 'transparent', border: 'none',
                        cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif',
                        gap: 8,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: 12, color: isLast ? '#1FAC76' : '#4A556A',
                          fontWeight: isLast ? 600 : 400, textAlign: 'left', lineHeight: '16px',
                        }}>
                          {step.title}
                        </span>
                        {step.type === 'manual-check' && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                            background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A',
                            padding: '1px 5px', borderRadius: 3, flexShrink: 0,
                          }}>
                            Manual
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        size={14} strokeWidth={1.75} color="#8896B0"
                        style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                      />
                    </button>
                  )}

                  {/* Expanded content */}
                  {!isLoading && isExpanded && (
                    <div style={{
                      background: '#F8FAFC', border: '1px solid #E4E9F2', borderRadius: 6,
                      padding: '10px 12px', marginBottom: 4,
                    }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 4,
                          background: step.type === 'manual-check' ? '#FFFBEB' : '#E6F9F1',
                          border: `1px solid ${step.type === 'manual-check' ? '#FDE68A' : '#BBF7D0'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                        }}>
                          {step.type === 'manual-check'
                            ? <UserCheck size={12} strokeWidth={1.75} color="#92400E" />
                            : <Sparkles size={12} strokeWidth={1.75} color="#1FAC76" />
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, color: '#1D2433', margin: '0 0 4px', lineHeight: '18px' }}>
                            {step.detail}
                          </p>
                          {step.link && (
                            <a href="#" style={{ fontSize: 12, color: '#1FAC76', textDecoration: 'none', fontWeight: 500 }}>
                              {step.link}
                            </a>
                          )}
                          {step.evidenceDialogId && (
                            <p style={{ fontSize: 11, color: '#92400E', margin: '8px 0 0', fontStyle: 'italic' }}>
                              Review required — see Match Summary below
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Summary card */}
            {runComplete && summary && (
              <div style={{
                border: '1px solid #E4E9F2', borderRadius: 8, overflow: 'hidden', marginTop: 8,
              }}>
                {/* Card header */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #E4E9F2', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#E6F9F1', border: '2px solid #1FAC76',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Bot size={14} strokeWidth={1.75} color="#1FAC76" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{summary.title}</span>
                </div>

                <div style={{ padding: '12px 14px' }}>
                  {/* Bullet list */}
                  <ul style={{ margin: '0 0 12px', padding: '0 0 0 16px' }}>
                    {summary.bullets.map((b, i) => (
                      <li key={i} style={{ fontSize: 12, color: '#1D2433', lineHeight: '20px' }}>{b}</li>
                    ))}
                  </ul>

                  {/* Detail button */}
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                    padding: '8px 12px', borderRadius: 6, border: 'none',
                    background: '#1D2433', color: '#fff',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', justifyContent: 'center', marginBottom: 10,
                  }}>
                    ↗ {summary.detailLabel}
                  </button>

                  {/* Simulated approval note */}
                  <div style={{
                    background: '#EBF4FF', border: '1px solid #BFDBFE', borderRadius: 5,
                    padding: '7px 10px', fontSize: 11, color: '#1D4ED8',
                    lineHeight: '16px', display: 'flex', gap: 5, marginBottom: 10,
                  }}>
                    <span style={{ flexShrink: 0 }}>ⓘ</span>
                    <span>Test run — this approval is simulated. No journal entries will be posted to the ERP.</span>
                  </div>

                  {/* Required Evidence Reviews */}
                  {evidenceDialogIds.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{
                        fontSize: 10, fontWeight: 700, color: '#8896B0',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        margin: '0 0 7px',
                      }}>
                        Required Reviews
                      </p>
                      {steps.filter(s => s.evidenceDialogId).map(step => {
                        const dialogId = step.evidenceDialogId!
                        const confirmed = confirmedDialogs.has(dialogId)
                        const rejected = rejectedDialogs.has(dialogId)
                        const bg = confirmed ? '#F0FDF4' : rejected ? '#FEF2F2' : '#FFFBEB'
                        const border = confirmed ? '#BBF7D0' : rejected ? '#FECACA' : '#FDE68A'
                        const textColor = confirmed ? '#15803D' : rejected ? '#B91C1C' : '#92400E'
                        return (
                          <div key={dialogId} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 10px', borderRadius: 6, marginBottom: 5,
                            background: bg, border: `1px solid ${border}`,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              {confirmed
                                ? <Check size={13} strokeWidth={2.5} color="#16A34A" />
                                : rejected
                                ? <AlertCircle size={13} strokeWidth={1.75} color="#B91C1C" />
                                : <UserCheck size={13} strokeWidth={1.75} color="#92400E" />
                              }
                              <span style={{ fontSize: 12, color: textColor, fontWeight: 500, lineHeight: '15px' }}>
                                {step.title}
                              </span>
                            </div>
                            {!confirmed && (
                              <button
                                onClick={() => setActiveDialogId(dialogId)}
                                style={{
                                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 4,
                                  border: 'none',
                                  background: rejected ? '#B91C1C' : '#92400E',
                                  color: '#fff',
                                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0, marginLeft: 8,
                                }}
                              >
                                {rejected ? 'Re-review' : 'Review'}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Notes */}
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add Notes (required to reject)"
                    rows={2}
                    style={{
                      width: '100%', border: '1px solid #D0D9E8', borderRadius: 5,
                      padding: '7px 8px', fontSize: 12, color: '#1D2433',
                      fontFamily: 'Inter, sans-serif', resize: 'vertical',
                      outline: 'none', marginBottom: 10, boxSizing: 'border-box',
                      background: '#FAFBFD',
                    }}
                  />

                  {/* Approve Test / Reject Test */}
                  {!testApproved ? (
                    <>
                      {!allDialogsConfirmed && (
                        <p style={{
                          fontSize: 11, color: '#92400E', textAlign: 'center',
                          marginBottom: 8, lineHeight: '15px',
                        }}>
                          {pendingDialogs} required {pendingDialogs === 1 ? 'review' : 'reviews'} above must be completed
                        </p>
                      )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        disabled={!allDialogsConfirmed}
                        onClick={() => { setTestApproved(true); onTestApprove() }}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          padding: '8px', borderRadius: 6, border: 'none',
                          background: allDialogsConfirmed ? '#1FAC76' : '#D0D9E8',
                          color: allDialogsConfirmed ? '#fff' : '#8896B0',
                          fontSize: 12, fontWeight: 500,
                          cursor: allDialogsConfirmed ? 'pointer' : 'not-allowed',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                        <Check size={13} strokeWidth={2.5} /> Approve Test
                      </button>
                      <button style={{
                        flex: 1, padding: '8px', borderRadius: 6,
                        border: '1px solid #E5534B', background: '#fff',
                        color: '#E5534B', fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>
                        Reject Test
                      </button>
                    </div>
                    </>
                  ) : (
                    <button
                      onClick={onSubmitForReview}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '9px', borderRadius: 6, border: 'none',
                        background: '#1FAC76', color: '#fff',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>
                      Submit Agent for Review
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
      </div>

      {/* Evidence dialog overlay */}
      {activeDialogId && testRunData?.evidenceDialogs?.[activeDialogId] && (
        <EvidenceDialogOverlay
          dialogId={activeDialogId}
          data={testRunData.evidenceDialogs[activeDialogId]}
          onConfirm={(id) => setConfirmedDialogs(prev => new Set([...prev, id]))}
          onReject={(id) => setRejectedDialogs(prev => new Set([...prev, id]))}
          onClose={() => setActiveDialogId(null)}
        />
      )}

      {/* Context + chat input */}
      <div style={{ borderTop: '1px solid #E4E9F2', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderBottom: '1px solid #F3F4F6',
          fontSize: 11, color: '#6B7A99',
        }}>
          <span style={{ fontWeight: 500 }}>Context:</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#E6F9F1', borderRadius: 4, padding: '2px 6px',
          }}>
            <Sparkles size={10} strokeWidth={1.75} color="#1FAC76" />
            <span style={{ fontSize: 11, color: '#1FAC76', fontWeight: 500 }}>{playbookName}</span>
          </div>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #D0D9E8', borderRadius: 8, padding: '6px 10px', background: '#FAFBFD',
          }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask a question or edit your Playbook"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 12, color: '#1D2433', fontFamily: 'Inter, sans-serif', outline: 'none' }}
            />
            <button style={{
              background: chatInput ? '#1FAC76' : 'transparent', border: 'none',
              cursor: chatInput ? 'pointer' : 'default',
              color: chatInput ? '#fff' : '#C2CDE0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            }}>
              <Send size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ── Run Agent panel (extracted to RunAgentPanel.tsx) ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _RunAgentPanelPlaceholder({ onClose, playbookName, runData }: {
  onClose: () => void
  playbookName: string
  runData: TestRunData | undefined
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [visibleCount, setVisibleCount] = useState(0)
  const [loadingStep, setLoadingStep] = useState<number | null>(null)
  const [dotPhase, setDotPhase] = useState(0)
  const [runComplete, setRunComplete] = useState(false)
  const [runKey, setRunKey] = useState(0)

  const steps = runData?.steps ?? []
  const summary = runData?.summary

  const STEP_DURATION = 1300

  useEffect(() => {
    setVisibleCount(0)
    setLoadingStep(null)
    setExpandedSteps(new Set())
    setRunComplete(false)
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleCount(i + 1)
        setLoadingStep(i)
      }, i * STEP_DURATION))
      timers.push(setTimeout(() => {
        setExpandedSteps(prev => new Set([...prev, i]))
        setLoadingStep(i === steps.length - 1 ? null : i + 1)
        if (i === steps.length - 1) setRunComplete(true)
      }, i * STEP_DURATION + STEP_DURATION - 300))
    })
    return () => timers.forEach(clearTimeout)
  }, [steps.length, runKey])

  useEffect(() => {
    if (loadingStep === null) return
    const interval = setInterval(() => setDotPhase(p => (p + 1) % 3), 400)
    return () => clearInterval(interval)
  }, [loadingStep])

  const toggleStep = (i: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const restartRun = () => {
    setApproved(false)
    setRejected(false)
    setRunKey(k => k + 1)
  }

  return (
    <aside style={{
      width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: '#fff', borderLeft: '1px solid #E4E9F2', overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: '1px solid #E4E9F2', flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>Run Agent</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={ghostBtn} title="New run" onClick={restartRun}><Plus size={15} strokeWidth={1.75} /></button>
          <button style={ghostBtn} title="Minimize"><Square size={13} strokeWidth={1.75} /></button>
          <button onClick={onClose} style={ghostBtn} title="Close"><X size={15} strokeWidth={1.75} /></button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px' }}>
          {/* Steps accordion */}
          {steps.slice(0, visibleCount).map((step, i) => {
            const isExpanded = expandedSteps.has(i)
            const isLoading = i === loadingStep
            const isLast = i === steps.length - 1
            const dots = ['·', '··', '···'][dotPhase]
            return (
              <div key={i} style={{ marginBottom: 4 }}>
                {isLoading ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 0', gap: 8,
                  }}>
                    <span style={{ fontSize: 12, color: '#1FAC76', fontWeight: 500, textAlign: 'left', lineHeight: '16px' }}>
                      {step.title}
                    </span>
                    <span style={{
                      fontSize: 13, color: '#1FAC76', fontWeight: 700,
                      flexShrink: 0, minWidth: 16, textAlign: 'right', letterSpacing: 1,
                    }}>
                      {dots}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleStep(i)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', background: 'transparent', border: 'none',
                      cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif', gap: 8,
                    }}
                  >
                    <span style={{
                      fontSize: 12, color: isLast ? '#1FAC76' : '#4A556A',
                      fontWeight: isLast ? 600 : 400, textAlign: 'left', lineHeight: '16px',
                    }}>
                      {step.title}
                    </span>
                    <ChevronDown
                      size={14} strokeWidth={1.75} color="#8896B0"
                      style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                    />
                  </button>
                )}

                {/* Expanded content */}
                {!isLoading && isExpanded && (
                  <div style={{
                    background: '#F8FAFC', border: '1px solid #E4E9F2', borderRadius: 6,
                    padding: '10px 12px', marginBottom: 4,
                  }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 4,
                        background: '#E6F9F1', border: '1px solid #BBF7D0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                      }}>
                        <Sparkles size={12} strokeWidth={1.75} color="#1FAC76" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {step.detail.split('\n\n').map((para, pi) => (
                          <p key={pi} style={{ fontSize: 12, color: '#1D2433', margin: pi === 0 ? '0 0 4px' : '8px 0 4px', lineHeight: '18px' }}>
                            {para}
                          </p>
                        ))}
                        {step.link && (
                          <a href="#" style={{ fontSize: 12, color: '#1FAC76', textDecoration: 'none', fontWeight: 500 }}>
                            {step.link}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Summary card */}
          {runComplete && summary && (
            <div style={{
              border: '1px solid #E4E9F2', borderRadius: 8, overflow: 'hidden', marginTop: 8,
            }}>
              {/* Card header */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #E4E9F2', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#E6F9F1', border: '2px solid #1FAC76',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot size={14} strokeWidth={1.75} color="#1FAC76" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{summary.title}</span>
              </div>

              <div style={{ padding: '12px 14px' }}>
                {/* Bullet list */}
                <ul style={{ margin: '0 0 12px', padding: '0 0 0 16px' }}>
                  {summary.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#1D2433', lineHeight: '20px' }}>{b}</li>
                  ))}
                </ul>

                {/* Detail button */}
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  background: '#1D2433', color: '#fff',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', justifyContent: 'center', marginBottom: 12,
                }}>
                  ↗ {summary.detailLabel}
                </button>

                {/* Approve / Reject */}
                {!approved && !rejected ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setApproved(true)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        padding: '8px', borderRadius: 6, border: 'none',
                        background: '#1FAC76', color: '#fff',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                      <Check size={13} strokeWidth={2.5} /> Approve
                    </button>
                    <button
                      onClick={() => setRejected(true)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: 6,
                        border: '1px solid #E5534B', background: '#fff',
                        color: '#E5534B', fontSize: 12, fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>
                      Reject
                    </button>
                  </div>
                ) : approved ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 6,
                    background: '#F0FDF4', border: '1px solid #BBF7D0',
                  }}>
                    <Check size={15} strokeWidth={2.5} color="#16A34A" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#15803D' }}>Run approved</span>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 6,
                    background: '#FEF2F2', border: '1px solid #FECACA',
                  }}>
                    <AlertCircle size={15} strokeWidth={1.75} color="#B91C1C" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#B91C1C' }}>Run rejected</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context + chat input */}
      <div style={{ borderTop: '1px solid #E4E9F2', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderBottom: '1px solid #F3F4F6',
          fontSize: 11, color: '#6B7A99',
        }}>
          <span style={{ fontWeight: 500 }}>Context:</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#E6F9F1', borderRadius: 4, padding: '2px 6px',
          }}>
            <Sparkles size={10} strokeWidth={1.75} color="#1FAC76" />
            <span style={{ fontSize: 11, color: '#1FAC76', fontWeight: 500 }}>{playbookName}</span>
          </div>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #D0D9E8', borderRadius: 8, padding: '6px 10px', background: '#FAFBFD',
          }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask a question about this run"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 12, color: '#1D2433', fontFamily: 'Inter, sans-serif', outline: 'none' }}
            />
            <button style={{
              background: chatInput ? '#1FAC76' : 'transparent', border: 'none',
              cursor: chatInput ? 'pointer' : 'default',
              color: chatInput ? '#fff' : '#C2CDE0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            }}>
              <Send size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ── Evidence dialog overlay ── */
function EvidenceDialogOverlay({ dialogId, data, onConfirm, onReject, onClose }: {
  dialogId: string
  data: EvidenceDialogData
  onConfirm: (id: string) => void
  onReject: (id: string) => void
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 10, width: 540, maxHeight: '80vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid #E4E9F2',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1D2433' }}>{data.title}</div>
            <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 3, lineHeight: '17px' }}>{data.intro}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8896B0', padding: 2, flexShrink: 0 }}
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 18px 12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E4E9F2' }}>
                {data.tableHeaders.map((h, i) => (
                  <th key={i} style={{
                    textAlign: 'left', padding: '10px 8px 8px',
                    fontSize: 10, fontWeight: 700, color: '#6B7A99',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.tableRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 8px', color: '#1D2433', lineHeight: '16px' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.tableFootnote && (
            <p style={{ fontSize: 11, color: '#8896B0', margin: '8px 0 0', fontStyle: 'italic' }}>
              {data.tableFootnote}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid #E4E9F2', display: 'flex', gap: 8 }}>
          <button
            onClick={() => { onReject(dialogId); onClose() }}
            style={{
              flex: '0 0 auto', padding: '10px 16px', borderRadius: 6,
              border: '1px solid #FECACA', background: '#FEF2F2',
              color: '#B91C1C', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Reject
          </button>
          <button
            onClick={() => { onConfirm(dialogId); onClose() }}
            style={{
              flex: 1, padding: '10px', borderRadius: 6, border: 'none',
              background: '#1FAC76', color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Check size={14} strokeWidth={2.5} />
            {data.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Test Review panel (approver) ── */
function TestReviewPanel({ onClose, testRunData, onApprove }: {
  onClose: () => void
  testRunData: TestRunData | undefined
  onApprove: () => void
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const steps = testRunData?.steps ?? []
  const summary = testRunData?.summary

  const toggleStep = (i: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <DrawerShell title="Test Run Review" width={380} onClose={onClose}>
      <div style={{ padding: '12px' }}>
        {/* Steps accordion */}
        {steps.map((step, i) => {
          const isExpanded = expandedSteps.has(i)
          const isLast = i === steps.length - 1
          return (
            <div key={i} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggleStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif', gap: 8,
                }}
              >
                <span style={{
                  fontSize: 12, color: isLast ? '#1FAC76' : '#4A556A',
                  fontWeight: isLast ? 600 : 400, textAlign: 'left', lineHeight: '16px',
                }}>
                  {step.title}
                </span>
                <ChevronDown
                  size={14} strokeWidth={1.75} color="#8896B0"
                  style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                />
              </button>
              {isExpanded && (
                <div style={{
                  background: '#F8FAFC', border: '1px solid #E4E9F2', borderRadius: 6,
                  padding: '10px 12px', marginBottom: 4,
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 4,
                      background: '#E6F9F1', border: '1px solid #BBF7D0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>
                      <Sparkles size={12} strokeWidth={1.75} color="#1FAC76" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: '#1D2433', margin: '0 0 4px', lineHeight: '18px' }}>
                        {step.detail}
                      </p>
                      {step.link && (
                        <a href="#" style={{ fontSize: 12, color: '#1FAC76', textDecoration: 'none', fontWeight: 500 }}>
                          {step.link}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Summary card */}
        {summary && (
          <div style={{ border: '1px solid #E4E9F2', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #E4E9F2', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#E6F9F1', border: '2px solid #1FAC76',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={14} strokeWidth={1.75} color="#1FAC76" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{summary.title}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <ul style={{ margin: '0 0 14px', padding: '0 0 0 16px' }}>
                {summary.bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#1D2433', lineHeight: '20px' }}>{b}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  disabled
                  style={{
                    flex: 1, padding: '9px', borderRadius: 6,
                    border: '1px solid #D0D9E8', background: '#F8FAFC',
                    color: '#8896B0', fontSize: 12, fontWeight: 500,
                    cursor: 'not-allowed', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Request Changes
                </button>
                <button
                  onClick={onApprove}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '9px', borderRadius: 6, border: 'none',
                    background: '#1FAC76', color: '#fff',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <Check size={14} strokeWidth={2.5} /> Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DrawerShell>
  )
}

/* ── Shared helpers ── */
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#8896B0', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
      {label}
    </div>
  )
}

function PropField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={labelStyle}>{label}</span>
      {multiline
        ? <p style={{ fontSize: 12, color: '#1D2433', margin: 0, lineHeight: '18px' }}>{value}</p>
        : <span style={{ fontSize: 12, color: '#1D2433', display: 'block' }}>{value}</span>
      }
    </div>
  )
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 600, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#E4E9F2', margin: '14px 0' }} />
}

const labelStyle: React.CSSProperties = { fontSize: 11, color: '#8896B0', display: 'block', marginBottom: 3 }

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7A99',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 4,
}

// ─── Document control callout strips ────────────────────────────────────────

function DocControlsStrip({ controls }: { controls: WorkflowControl[] }) {
  return (
    <div style={{
      margin: '0 24px 16px',
      padding: '8px 12px',
      background: '#F8FAFC',
      border: '1px solid #E4E9F2',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#8896B0',
        textTransform: 'uppercase', letterSpacing: '0.5px',
        marginRight: 2, whiteSpace: 'nowrap',
        fontFamily: 'Inter, sans-serif',
      }}>
        Controls
      </span>
      {controls.map(ctrl => (
        <DocControlChip key={ctrl.id} control={ctrl} />
      ))}
    </div>
  )
}

function DocControlChip({ control }: { control: WorkflowControl }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 8px', borderRadius: 4,
        border: '1px solid #BFDBFE', background: '#EBF4FF',
        cursor: 'default',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1557A0', fontFamily: 'Inter, sans-serif' }}>
          {control.id}
        </span>
        <span style={{ fontSize: 11, color: '#1D2433', fontFamily: 'Inter, sans-serif' }}>
          {control.title}
        </span>
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          zIndex: 200, background: '#fff',
          border: '1px solid #E4E9F2', borderRadius: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          padding: '8px 10px', width: 220,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1D2433', marginBottom: 5, fontFamily: 'Inter, sans-serif' }}>
            {control.title}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, color: '#6B7A99', background: '#F3F4F6', borderRadius: 3, padding: '2px 6px', fontFamily: 'Inter, sans-serif' }}>
              {control.frequency}
            </span>
            <span style={{ fontSize: 9, color: '#6B7A99', background: '#F3F4F6', borderRadius: 3, padding: '2px 6px', fontFamily: 'Inter, sans-serif' }}>
              {control.enforcement}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
