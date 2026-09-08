import { useState, useEffect } from 'react'
import {
  ChevronDown, X, Sparkles, Check, AlertCircle, Plus, Square, Send, Bot,
  Download, ExternalLink,
} from 'lucide-react'
import { PLAYBOOK_RUN_DATA } from '../../data/playbookContent'
import type { TestRunData } from '../../data/playbookContent'

export interface RunAgentPanelProps {
  playbookId: string
  playbookName: string
  onClose: () => void
  /** When true, renders as a position:fixed right-side overlay (library mode).
   *  When false/omitted, renders as a normal flex aside (viewer drawer mode). */
  floating?: boolean
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: '#6B7A99', display: 'flex', alignItems: 'center',
  padding: 4, borderRadius: 4,
}

export function RunAgentPanel({ playbookId, playbookName, onClose, floating }: RunAgentPanelProps) {
  const runData: TestRunData | undefined = PLAYBOOK_RUN_DATA[playbookId]

  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [postExpanded, setPostExpanded] = useState(true)
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
    setConfirming(false)
    setApproved(false)
    setRejected(false)
    setPostExpanded(true)
    setRunKey(k => k + 1)
  }

  const panelStyle: React.CSSProperties = floating
    ? {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 400, zIndex: 200,
        display: 'flex', flexDirection: 'column',
        background: '#fff',
        borderLeft: '1px solid #E4E9F2',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
      }
    : {
        width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: '#fff', borderLeft: '1px solid #E4E9F2', overflow: 'hidden',
      }

  return (
    <aside style={panelStyle}>
      {/* Panel header */}
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', borderBottom: '1px solid #E4E9F2', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>Run Agent</span>
          <span style={{
            fontSize: 11, color: '#6B7A99', fontWeight: 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180,
          }}>
            — {playbookName}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={ghostBtn} title="New run" onClick={restartRun}><Plus size={15} strokeWidth={1.75} /></button>
          <button style={ghostBtn} title="Minimize"><Square size={13} strokeWidth={1.75} /></button>
          <button onClick={onClose} style={ghostBtn} title="Close"><X size={15} strokeWidth={1.75} /></button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '12px' }}>
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
                <ul style={{ margin: '0 0 12px', padding: '0 0 0 16px' }}>
                  {summary.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#1D2433', lineHeight: '20px' }}>{b}</li>
                  ))}
                </ul>

                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                  padding: '8px 12px', borderRadius: 6, border: 'none',
                  background: '#1D2433', color: '#fff',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', justifyContent: 'center', marginBottom: 12,
                }}>
                  ↗ {summary.detailLabel}
                </button>

                {/* Phase 1 — Approve / Reject */}
                {!confirming && !approved && !rejected && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setConfirming(true)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        padding: '8px', borderRadius: 6, border: 'none',
                        background: '#1FAC76', color: '#fff',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                      <ExternalLink size={13} strokeWidth={2} /> Approve
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
                )}

                {/* Phase 2 — Confirmation step */}
                {confirming && !approved && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{
                      fontSize: 12, color: '#4A556A', textAlign: 'center',
                      margin: 0, lineHeight: '18px',
                    }}>
                      {runData?.approvalMessage?.confirmWarning ?? 'Approve this run? This cannot be undone.'}
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setApproved(true); setConfirming(false) }}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          padding: '8px', borderRadius: 6, border: 'none',
                          background: '#1FAC76', color: '#fff',
                          fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                        <Check size={13} strokeWidth={2.5} /> Confirm Approve
                      </button>
                      <button
                        onClick={() => setConfirming(false)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: 6,
                          border: '1px solid #D0D9E8', background: '#fff',
                          color: '#4A556A', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Phase 3 — Approved: decision recorded */}
                {approved && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 6,
                    background: '#F0FDF4', border: '1px solid #BBF7D0',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: '#1FAC76',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Check size={11} strokeWidth={2.5} color="#fff" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#15803D' }}>
                      Approved — decision recorded
                    </span>
                  </div>
                )}

                {/* Rejected state */}
                {rejected && (
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

          {/* Post-approval AI response */}
          {approved && runData?.approvalMessage && (
            <div style={{ marginTop: 8, border: '1px solid #E4E9F2', borderRadius: 8, overflow: 'hidden' }}>
              {/* Collapsible header */}
              <button
                onClick={() => setPostExpanded(p => !p)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: '#F8FAFC', border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', gap: 8,
                }}
              >
                <span style={{ fontSize: 12, color: '#4A556A', fontWeight: 500, textAlign: 'left', lineHeight: '16px' }}>
                  {runData.approvalMessage.headline}
                </span>
                <ChevronDown
                  size={14} strokeWidth={1.75} color="#8896B0"
                  style={{ flexShrink: 0, transform: postExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                />
              </button>

              {postExpanded && (
                <div style={{ padding: '12px 14px', borderTop: '1px solid #E4E9F2' }}>
                  {/* AI avatar + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#E6F9F1', border: '2px solid #1FAC76',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Sparkles size={13} strokeWidth={1.75} color="#1FAC76" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>Approved</span>
                  </div>

                  {/* Body */}
                  <p style={{ fontSize: 12, color: '#4A556A', lineHeight: '18px', margin: '0 0 12px' }}>
                    {runData.approvalMessage.body}
                  </p>

                  {/* Attachment chip */}
                  {runData.approvalMessage.attachment && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 6, border: '1px solid #E4E9F2', background: '#F8FAFC',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>📋</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#1D2433' }}>
                          {runData.approvalMessage.attachment}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ ...ghostBtn, color: '#6B7A99' }}><Download size={14} strokeWidth={1.75} /></button>
                        <button style={{ ...ghostBtn, color: '#6B7A99' }}><ExternalLink size={14} strokeWidth={1.75} /></button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
