import { useState, useRef, useEffect } from 'react'
import { COUPA_PLAYBOOK_CONTENT } from '../data/playbookContent'

type FlowStep =
  | 'blank'
  | 'processing'
  | 'question-single'
  | 'question-multi'
  | 'question-upload'
  | 'split'

interface Message {
  role: 'user' | 'assistant'
  content: string | React.ReactNode
  type?: 'name-select' | 'processing' | 'answered' | 'text'
}

interface NewAgentFlowProps {
  onBack: () => void
  onFinish: () => void
}

const SUGGESTIONS = [
  {
    title: 'Accrual Preparer Playbook',
    desc: 'Automates calculations and entry preparation.',
  },
  {
    title: 'Month-End Reviewer Playbook:',
    desc: 'Validates accuracy before final closing.',
  },
  {
    title: 'Intercompany Matching Playbook',
    desc: 'Reconciles balances across different entities.',
  },
]

export function NewAgentFlow({ onBack, onFinish }: NewAgentFlowProps) {
  const [step, setStep] = useState<FlowStep>('blank')
  const [inputValue, setInputValue] = useState('')
  const [agentName, setAgentName] = useState('Coupa PO Accrual Agent')
  const [selectedName, setSelectedName] = useState<string>('Coupa PO Accrual Agent')
  const [messages, setMessages] = useState<Message[]>([])
  const [singleAnswer, setSingleAnswer] = useState<string | null>('Daily Proration (Inclusive)')
  const [multiAnswers, setMultiAnswers] = useState<Set<string>>(new Set(['Approved (Recommended)']))
  const [processingText, setProcessingText] = useState('Computing daily proration for eligible POs using inclusive start and end dates...')
  const [isProcessing, setIsProcessing] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, step])

  const handleSendMessage = (text?: string) => {
    const content = text ?? inputValue
    if (!content.trim()) return
    setInputValue('')

    if (step === 'blank') {
      setMessages([{ role: 'user', content, type: 'text' }])
      setStep('processing')
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            type: 'name-select',
            content: 'Before we get into the details, let\'s name this Agent. Here are a few options based on what you described:',
          },
        ])
      }, 1400)
    }
  }

  const handleNameConfirm = () => {
    setAgentName(selectedName)
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        type: 'answered',
        content: `Got it. I can build a Playbook for that. I'll need to configure your proration logic and how we map your BILLING codes. Let's start with the math.`,
      },
    ])
    setStep('question-single')
  }

  const handleSingleAnswerConfirm = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        type: 'answered',
        content: `How should we calculate the accrual amount? ${singleAnswer}`,
      },
    ])
    setStep('question-multi')
  }

  const handleMultiAnswerConfirm = () => {
    const answers = Array.from(multiAnswers).join(', ')
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        type: 'answered',
        content: `Which invoice statuses should be subtracted from the accrual? ${answers}`,
      },
    ])
    setStep('question-upload')
  }

  const handleUploadSkip = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        type: 'answered',
        content: '',
      },
    ])
    setStep('split')
  }

  const handleUploadDone = () => {
    setStep('split')
  }

  const toggleMulti = (option: string) => {
    setMultiAnswers((prev) => {
      const next = new Set(prev)
      next.has(option) ? next.delete(option) : next.add(option)
      return next
    })
  }

  const isSplit = step === 'split'

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #E4E9F2',
          padding: '0 24px',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            fontSize: 13,
            color: '#6B7A99',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ← Back
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1D2433' }}>
          {step === 'blank' ? 'New Agent' : agentName}
        </span>
        <button
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #D0D9E8',
            background: '#fff',
            fontSize: 13,
            color: '#6B7A99',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Save Draft
        </button>
        <button
          onClick={isSplit ? onFinish : undefined}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: isSplit ? '#1FAC76' : '#E4E9F2',
            color: isSplit ? '#fff' : '#8896B0',
            fontSize: 13,
            fontWeight: 500,
            cursor: isSplit ? 'pointer' : 'default',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Finish Setup
        </button>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Chat column */}
        <div
          style={{
            flex: isSplit ? '0 0 420px' : 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRight: isSplit ? '1px solid #E4E9F2' : 'none',
          }}
        >
          {step === 'blank' ? (
            <BlankState
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSendMessage}
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Scrollable chat */}
              <div
                ref={chatRef}
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Render past messages */}
                {messages.map((msg, i) => (
                  <ChatBubble key={i} message={msg} />
                ))}

                {/* Processing indicator */}
                {isProcessing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#8896B0', fontStyle: 'italic' }}>
                      {processingText}
                    </span>
                  </div>
                )}

                {/* Name select card */}
                {step === 'processing' && !isProcessing && (
                  <NameSelectCard
                    selectedName={selectedName}
                    onSelect={setSelectedName}
                    onConfirm={handleNameConfirm}
                  />
                )}

                {/* Processing reasoning badge */}
                {(step === 'question-single' || step === 'question-multi' || step === 'question-upload' || step === 'split') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#8896B0' }}>Reasoning ▾</span>
                  </div>
                )}

                {/* Inline question cards */}
                {step === 'question-single' && (
                  <SingleSelectCard
                    question="How should we calculate the accrual amount?"
                    options={[
                      'Daily Proration (Inclusive): Calculate based on (Total / total_days) * days_elapsed',
                      'Full Amount: Accrue 100% of the PO total immediately.',
                    ]}
                    selected={singleAnswer}
                    onSelect={setSingleAnswer}
                    pagination={{ current: 1, total: 2 }}
                    onConfirm={handleSingleAnswerConfirm}
                    onSkip={handleSingleAnswerConfirm}
                  />
                )}

                {step === 'question-multi' && (
                  <MultiSelectCard
                    question="Which invoice statuses should be subtracted from the accrual?"
                    options={['Approved (Recommended)', 'Pending Approval', 'Pending Receipt', 'Voided']}
                    selected={multiAnswers}
                    onToggle={toggleMulti}
                    pagination={{ current: 2, total: 2 }}
                    onConfirm={handleMultiAnswerConfirm}
                    onSkip={handleMultiAnswerConfirm}
                  />
                )}

                {step === 'question-upload' && (
                  <UploadCard
                    title="Upload your open PO report"
                    subtitle="This is the PO report you'd pull for month-end close."
                    onUpload={handleUploadDone}
                    onSkip={handleUploadSkip}
                  />
                )}

                {step === 'split' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <AssistantMessage>
                      Which invoice statuses should be subtracted from the accrual?
                    </AssistantMessage>
                    <UserMessage>
                      For invoice reductions, only subtract those with an 'approved' status.
                    </UserMessage>
                    <AssistantMessage>
                      Where should the Playbook pull the Account number from in the BILLING code?
                    </AssistantMessage>
                    <UserMessage>
                      Parse the BILLING code by mapping Segment 2 to the GL Account.
                    </UserMessage>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                      }}
                    >
                      <FqAiAvatar />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13,
                            color: '#1D2433',
                            lineHeight: '20px',
                            margin: '0 0 8px',
                            background: '#F1F8F5',
                            border: '1px solid #C8E6D8',
                            borderRadius: 8,
                            padding: '10px 12px',
                          }}
                        >
                          I've finished drafting the Coupa PO Accrual Playbook. I've configured the inclusive daily proration logic, restricted invoice processing to 'approved' status only, and mapped your BILLING segments to the correct GL accounts. The playbook is now ready for a final look.
                        </p>
                        <p style={{ fontSize: 13, color: '#4A556A', margin: '8px 0 0', lineHeight: '20px' }}>
                          The Playbook is ready. How would you like to proceed?
                        </p>
                        <button
                          onClick={onFinish}
                          style={{
                            marginTop: 8,
                            padding: '7px 14px',
                            borderRadius: 6,
                            border: '1px solid #D0D9E8',
                            background: '#fff',
                            fontSize: 13,
                            color: '#1D2433',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          Review the final Playbook
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar — rendered at every non-blank step (we're already past 'blank' here) */}
              <ChatInputBar
                value={inputValue}
                onChange={setInputValue}
                onSend={() => {}}
                placeholder="Type Command"
              />
            </div>
          )}
        </div>

        {/* Playbook document panel */}
        {isSplit && (
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              background: '#fff',
              padding: '16px 24px',
            }}
          >
            <PlaybookDocument />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function BlankState({
  inputValue,
  onInputChange,
  onSend,
}: {
  inputValue: string
  onInputChange: (v: string) => void
  onSend: (text?: string) => void
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <FqAiLogo size={40} />
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1D2433', margin: 0 }}>
          FloQast Agents
        </h2>
      </div>

      {/* Textarea */}
      <div style={{ width: '100%', maxWidth: 560, position: 'relative' }}>
        <textarea
          placeholder="Tell us what you want automated and we'll build your Playbook"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          style={{
            width: '100%',
            minHeight: 100,
            padding: '14px 50px 40px 14px',
            border: '1px solid #D0D9E8',
            borderRadius: 8,
            fontSize: 14,
            color: '#1D2433',
            fontFamily: 'Inter, sans-serif',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fff',
          }}
        />
        {/* Attach icon */}
        <button
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 18,
            color: '#8896B0',
          }}
        >
          📎
        </button>
        {/* Send button */}
        <button
          onClick={() => onSend()}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 34,
            height: 34,
            borderRadius: 6,
            border: 'none',
            background: inputValue.trim() ? '#1FAC76' : '#E4E9F2',
            color: inputValue.trim() ? '#fff' : '#8896B0',
            cursor: inputValue.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          ↑
        </button>
      </div>

      {/* Suggestion cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 560 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onSend(s.title)}
            style={{
              padding: '10px 14px',
              border: '1px solid #E4E9F2',
              borderRadius: 8,
              background: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              width: 170,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1D2433', marginBottom: 4 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 12, color: '#6B7A99', lineHeight: '16px' }}>{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: Message }) {
  if (message.role === 'user') {
    return <UserMessage>{message.content as string}</UserMessage>
  }
  return null
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          maxWidth: '80%',
          background: '#F0F4FA',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#1D2433',
          lineHeight: '20px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function AssistantMessage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <FqAiAvatar />
      <div
        style={{
          flex: 1,
          background: '#F8FBF9',
          border: '1px solid #D5EDE4',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#1D2433',
          lineHeight: '20px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function NameSelectCard({
  selectedName,
  onSelect,
  onConfirm,
}: {
  selectedName: string
  onSelect: (n: string) => void
  onConfirm: () => void
}) {
  const names = ['Coupa PO Accrual Agent', 'Month-End Accrual Agent']
  return (
    <AssistantCardWrapper>
      <p style={{ fontSize: 13, color: '#1D2433', margin: '0 0 12px', lineHeight: '20px' }}>
        Before we get into the details, let's name this Agent. Here are a few options based on what you described:
      </p>
      {names.map((name) => (
        <label
          key={name}
          onClick={() => onSelect(name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 4px',
            cursor: 'pointer',
            fontSize: 13,
            color: '#1D2433',
          }}
        >
          <RadioDot checked={selectedName === name} />
          {name}
        </label>
      ))}
      <button
        onClick={onConfirm}
        style={{
          marginTop: 8,
          padding: '7px 14px',
          borderRadius: 6,
          border: 'none',
          background: '#1FAC76',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          alignSelf: 'flex-start',
        }}
      >
        Confirm Name
      </button>
    </AssistantCardWrapper>
  )
}

function SingleSelectCard({
  question,
  options,
  selected,
  onSelect,
  pagination,
  onConfirm,
  onSkip,
}: {
  question: string
  options: string[]
  selected: string | null
  onSelect: (o: string) => void
  pagination: { current: number; total: number }
  onConfirm: () => void
  onSkip: () => void
}) {
  return (
    <div
      style={{
        border: '1px solid #E4E9F2',
        borderRadius: 8,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #E4E9F2',
          background: '#F8FAFC',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{question}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#8896B0' }}>
            {pagination.current} of {pagination.total}
          </span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#8896B0',
              fontSize: 16,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div style={{ padding: '8px 0' }}>
        {options.map((opt) => {
          const label = opt.split(':')[0]
          const desc = opt.includes(':') ? opt.split(':')[1].trim() : ''
          const isSelected = selected === label
          return (
            <div
              key={opt}
              onClick={() => { onSelect(label); onConfirm(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                cursor: 'pointer',
                background: isSelected ? '#F0FDF8' : 'transparent',
                borderBottom: '1px solid #F0F2F5',
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: '#1D2433', fontWeight: isSelected ? 500 : 400 }}>
                  {label}{desc ? ': ' + desc : ''}
                </div>
              </div>
              {isSelected && (
                <span style={{ fontSize: 16, color: '#1FAC76' }}>→</span>
              )}
            </div>
          )
        })}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#6B7A99' }}>✏ Something else. Let's chat about it.</span>
          <button
            onClick={onSkip}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              border: '1px solid #D0D9E8',
              borderRadius: 4,
              background: '#fff',
              fontSize: 12,
              color: '#6B7A99',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}

function MultiSelectCard({
  question,
  options,
  selected,
  onToggle,
  pagination,
  onConfirm,
  onSkip,
}: {
  question: string
  options: string[]
  selected: Set<string>
  onToggle: (o: string) => void
  pagination: { current: number; total: number }
  onConfirm: () => void
  onSkip: () => void
}) {
  return (
    <div
      style={{
        border: '1px solid #E4E9F2',
        borderRadius: 8,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #E4E9F2',
          background: '#F8FAFC',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433', maxWidth: '80%' }}>
          {question}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#8896B0' }}>
            {pagination.current} of {pagination.total}
          </span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#8896B0',
              fontSize: 16,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div style={{ padding: '4px 0' }}>
        {options.map((opt) => {
          const isChecked = selected.has(opt)
          return (
            <div
              key={opt}
              onClick={() => onToggle(opt)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                cursor: 'pointer',
                background: isChecked ? '#F0FDF8' : 'transparent',
                borderBottom: '1px solid #F0F2F5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Checkbox checked={isChecked} />
                <span style={{ fontSize: 13, color: '#1D2433', fontWeight: isChecked ? 500 : 400 }}>
                  {opt}
                </span>
              </div>
              {isChecked && <span style={{ fontSize: 14, color: '#1FAC76' }}>→</span>}
            </div>
          )
        })}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            placeholder="Something else"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 12,
              color: '#6B7A99',
              background: 'transparent',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            onClick={onSkip}
            style={{
              padding: '4px 12px',
              border: '1px solid #D0D9E8',
              borderRadius: 4,
              background: '#fff',
              fontSize: 12,
              color: '#6B7A99',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Skip
          </button>
          <button
            onClick={onConfirm}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              background: '#1FAC76',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

function UploadCard({
  title,
  subtitle,
  onUpload,
  onSkip,
}: {
  title: string
  subtitle: string
  onUpload: () => void
  onSkip: () => void
}) {
  return (
    <div
      style={{
        border: '1px solid #E4E9F2',
        borderRadius: 8,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #E4E9F2',
          background: '#F8FAFC',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D2433' }}>{title}</span>
        <button
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#8896B0',
            fontSize: 16,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <p style={{ fontSize: 12, color: '#6B7A99', margin: 0 }}>{subtitle}</p>
        <button
          onClick={onUpload}
          style={{
            padding: '10px 24px',
            borderRadius: 6,
            border: 'none',
            background: '#1D2433',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Upload Files
        </button>
        <p style={{ fontSize: 11, color: '#8896B0', margin: 0 }}>Or drop file here to upload</p>
        <p style={{ fontSize: 11, color: '#8896B0', margin: 0 }}>CSV, XLSX, or PDF less than 10MB</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="Something else. Let's chat about it."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 12,
              color: '#6B7A99',
              background: 'transparent',
              fontFamily: 'Inter, sans-serif',
              minWidth: 200,
            }}
          />
          <button
            onClick={onSkip}
            style={{
              padding: '4px 12px',
              border: '1px solid #D0D9E8',
              borderRadius: 4,
              background: '#fff',
              fontSize: 12,
              color: '#6B7A99',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatInputBar({
  value,
  onChange,
  onSend,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  placeholder: string
}) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #E4E9F2',
        background: '#fff',
        position: 'relative',
      }}
    >
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minHeight: 56,
          padding: '10px 50px 10px 14px',
          border: '1px solid #D0D9E8',
          borderRadius: 8,
          fontSize: 13,
          color: '#1D2433',
          fontFamily: 'Inter, sans-serif',
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          left: 24,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          color: '#8896B0',
        }}
      >
        📎
      </button>
      <button
        onClick={onSend}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 24,
          width: 32,
          height: 32,
          borderRadius: 6,
          border: 'none',
          background: value.trim() ? '#1FAC76' : '#E4E9F2',
          color: value.trim() ? '#fff' : '#8896B0',
          cursor: value.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
        }}
      >
        ↑
      </button>
    </div>
  )
}

function PlaybookDocument() {
  const sections = [
    '1. Role and Objective',
    '2. Required Input Data',
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

  return (
    <div style={{ display: 'flex', gap: 16, overflow: 'hidden' }}>
      {/* TOC */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: '#6B7A99', fontSize: 12 }}>
          ☰ Playbook
        </div>
        <div style={{ fontSize: 11, color: '#6B7A99', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          CONTENT
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sections.map((s) => (
            <a
              key={s}
              href="#"
              style={{
                fontSize: 12,
                color: '#4A556A',
                textDecoration: 'none',
                padding: '3px 0 3px 8px',
                borderLeft: s.startsWith('1') ? '2px solid #1FAC76' : '2px solid transparent',
                lineHeight: '18px',
              }}
            >
              {s}
            </a>
          ))}
        </nav>
      </div>

      {/* Doc content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          fontSize: 13,
          color: '#1D2433',
          lineHeight: '20px',
        }}
        dangerouslySetInnerHTML={{ __html: COUPA_PLAYBOOK_CONTENT }}
      />
    </div>
  )
}

// ── Utility components ─────────────────────────────────────────────────────────

function AssistantCardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <FqAiAvatar />
      <div
        style={{
          flex: 1,
          background: '#F8FBF9',
          border: '1px solid #D5EDE4',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function FqAiAvatar() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#E6F9F1',
        border: '1.5px solid #1FAC76',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <FqAiLogo size={14} />
    </div>
  )
}

function FqAiLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5L9.8 6.5H15L10.6 9.5L12.4 14.5L8 11.5L3.6 14.5L5.4 9.5L1 6.5H6.2L8 1.5Z"
        fill="#1FAC76"
      />
    </svg>
  )
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: `2px solid ${checked ? '#1FAC76' : '#C2CDE0'}`,
        background: checked ? '#1FAC76' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fff',
          }}
        />
      )}
    </div>
  )
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 3,
        border: `2px solid ${checked ? '#1FAC76' : '#C2CDE0'}`,
        background: checked ? '#1FAC76' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
