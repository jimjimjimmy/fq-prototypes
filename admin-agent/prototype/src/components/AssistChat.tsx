/**
 * AssistChat — the host-agent AI chat panel, opened when a user clicks a
 * "Resolve" or "AI Assisted Action" CTA in the assistants. Modeled on the
 * FlowUI AI chat window: header, host-agent conversation, badge-style
 * getting-started prompts, and a context-aware input footer.
 *
 * The chat auto-starts from the CTA (seed.opening) and surfaces 2–3 starter
 * prompts (seed.prompts) for how to proceed. Responses are canned (prototype).
 *
 * Tokens: brand green #1FAC76/#1C895F (send), #e1e6ef borders, #1d2433 body,
 * #6b7280 muted, #e0f6ce brand-weak (user bubble).
 */
import { useEffect, useRef, useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Menu from '@floqastinc/flow-ui_icons/material/Menu'
// @ts-ignore
import Close from '@floqastinc/flow-ui_icons/material/Close'
// @ts-ignore
import ArrowUpward from '@floqastinc/flow-ui_icons/material/ArrowUpward'
// @ts-ignore
import AttachFile from '@floqastinc/flow-ui_icons/material/AttachFile'
// @ts-ignore
import Help from '@floqastinc/flow-ui_icons/material/Help'
// @ts-ignore
import Search from '@floqastinc/flow-ui_icons/material/Search'
// @ts-ignore
import ChatBubble from '@floqastinc/flow-ui_icons/material/ChatBubble'
// @ts-ignore
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome'
// @ts-ignore
import Check from '@floqastinc/flow-ui_icons/material/Check'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'

import type { RecordSet } from './ImpactedRecordsGrid'
import { AssistedActionButton } from './assistant/AssistedActionButton'
import type { AssistedAction } from './assistant/actions'

/** Optional rich opening message (numbered steps + "what to have ready" + footer). */
export interface ChatIntro {
  paragraph: string
  steps?: { title: string; desc: string }[]
  readyHeading?: string
  readyItems?: string[]
  footer?: string
}

/** A structured agent result (e.g. document-analysis findings) rendered as grouped bullet lists. */
export interface AnalysisResult {
  heading: string
  groups: { label: string; items: string[] }[]
}

/** One step in the guided entity-setup questionnaire: a prompt + options (chips or checkboxes). */
export interface QuestionDef {
  id: string
  prompt: string
  options: string[]
  kind: 'setup' | 'folder' | 'number'
  layout?: 'chips' | 'stack'
  /** Multi-select checkbox list with Submit / Select all (vs. single-select chips). */
  multiSelect?: boolean
  /** Optional gray context card shown above the prompt. */
  contextCard?: { title: string; lines: string[] }
  /** Optional agent text bubble shown just before this question. */
  preludeText?: string
  /** For kind:'number' — minimum value + input placeholder. */
  min?: number
  placeholder?: string
}

/** Folder names extracted from the uploaded document (custom, not the standard reference set). */
const DOCUMENT_FOLDERS = [
  '01 Cash and Cash Equivalents',
  '02 Accounts Receivable',
  '03 Prepaid and Oth Curr Assets',
  '04 Fixed and Intang Assets',
  '05 AP and Credit Cards',
  '06 Accrued and Oth Curr Liab',
  '07 Payroll and Benefits',
  '08 Long Term Liabilities',
  '09 Intercompany',
  '10 Tax',
  '11 Equity',
  '12 General Close Procedures',
]

/**
 * Build the post-analysis questionnaire for the Create Entities flow. Derives the
 * entity list from the analysis "Entities" group; returns [] for other analyses
 * (e.g. the Users variant), so no questionnaire starts there.
 */
function buildEntitySetupFlow(analysis: AnalysisResult): QuestionDef[] {
  const entityGroup = analysis.groups.find((g) => /^Entities/.test(g.label))
  if (!entityGroup) return []
  const entityNames = entityGroup.items.map((it) => it.split(' — ')[0])

  const folderQs: QuestionDef[] = entityNames.map((name, i) => ({
    id: `folders-${i}`,
    kind: 'folder',
    multiSelect: true,
    options: DOCUMENT_FOLDERS,
    prompt: `Which folders should be included for ${name} (Close)?`,
    preludeText:
      i === 0
        ? "Now let me ask about folders for each entity. The document uses custom folder names (not the standard ones from the reference), so I'll present the actual folders found in the document for each entity:"
        : undefined,
    contextCard:
      i === 0
        ? {
            title: 'Batch 3 — Folder Structure',
            lines: [
              'These are the folders found in the document for the Close entities. Select all that apply for each entity.',
            ],
          }
        : undefined,
  }))

  return [
    {
      id: 'year-end',
      kind: 'setup',
      prompt: 'What is the fiscal year-end?',
      options: ['12/31', '06/30', '03/31', '09/30'],
    },
    {
      id: 'start-date',
      kind: 'setup',
      prompt: 'What month should the close start (first active period)?',
      options: ['01/2025', '04/2025', '07/2025', '01/2026'],
    },
    ...folderQs,
    {
      id: 'recon-scope',
      kind: 'setup',
      layout: 'stack',
      prompt: 'How should reconciliations be configured?',
      options: [
        'Entity level — separate reconciliations per entity',
        'Consolidated — one set across all entities',
      ],
    },
  ]
}

const FLOW_COMPLETE_MESSAGE =
  "Perfect — I have everything I need. I'll generate your entities, folders, and reconciliation configuration now."

/** Messages to append when revealing a question: its optional prelude bubble, then the question. */
function questionMessages(q: QuestionDef): Message[] {
  const msgs: Message[] = []
  if (q.preludeText) msgs.push({ role: 'agent', text: q.preludeText })
  msgs.push({ role: 'agent', question: q })
  return msgs
}

export interface ChatSeed {
  /** Which impacted-records set the drilldown shows. */
  recordSet: RecordSet
  /** Main-body view of the drilldown. Defaults to the records grid. */
  view?: 'records' | 'upload' | 'create-entity'
  /** When view is 'upload', which upload screen variant to show. */
  uploadVariant?: 'entities' | 'users'
  /** Short CTA label, shown in the drilldown breadcrumb. */
  title: string
  /** Shown in the "Context:" chip above the input. */
  contextLabel: string
  /** The agent's auto-start opening message, derived from the CTA. */
  opening: string
  /** Optional structured opening that replaces the plain `opening` bubble. */
  intro?: ChatIntro
  /** 2–3 badge-style getting-started prompts. */
  prompts: string[]
}

interface Message {
  role: 'agent' | 'user'
  /** Plain text bubble, or — for a rich agent result — an analysis payload, or a guided question. */
  text?: string
  analysis?: AnalysisResult
  question?: QuestionDef
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V7l-4-4z"
        stroke="#6b7280"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" stroke="#6b7280" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function SidebarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#424867" strokeWidth="1.6" />
      <line x1="14" y1="4" x2="14" y2="20" stroke="#424867" strokeWidth="1.6" />
    </svg>
  )
}

/** A single guided question: optional context card, prompt, and selectable options. */
function QuestionBlock({
  q,
  selected,
  onSelect,
}: {
  q: QuestionDef
  selected?: string | string[]
  onSelect: (value: string | string[]) => void
}) {
  const answered = selected !== undefined
  const stack = q.layout === 'stack'
  // Local checkbox state for multi-select questions, held until Submit.
  const [checked, setChecked] = useState<string[]>([])
  // Local draft for number-input questions, held until Set.
  const [numDraft, setNumDraft] = useState('')
  const toggle = (opt: string) =>
    setChecked((c) => (c.includes(opt) ? c.filter((x) => x !== opt) : [...c, opt]))

  return (
    <div className="self-start flex flex-col gap-2.5 max-w-[92%] w-full">
      {q.contextCard && (
        <div className="rounded-[8px] border border-[#e1e6ef] bg-[#f8fafc] px-3 py-2.5 flex flex-col gap-1">
          <p className="text-[13px] font-semibold text-[#1d2433]">{q.contextCard.title}</p>
          {q.contextCard.lines.map((l) => (
            <p key={l} className="text-[12px] leading-4 text-[#6b7280]">
              {l}
            </p>
          ))}
        </div>
      )}
      <p className="text-[13px] leading-5 text-[#1d2433]">{q.prompt}</p>

      {q.kind === 'number' ? (
        answered ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#1FAC76] bg-[#ECFFF8] px-3 py-1.5 text-[13px] font-semibold text-[#1C895F]">
            {selected}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={q.min ?? 1}
              value={numDraft}
              onChange={(e) => setNumDraft(e.target.value)}
              placeholder={q.placeholder}
              className="h-9 w-24 rounded-[6px] border border-[#cbd2e1] px-2.5 text-[13px] text-[#1d2433] focus:outline-none focus:border-[#1e8ae9]"
            />
            <Button
              color="primary"
              variant="filled"
              disabled={!numDraft || Number(numDraft) < (q.min ?? 1)}
              onClick={() => onSelect(String(Math.max(q.min ?? 1, Math.floor(Number(numDraft)))))}
            >
              Set
            </Button>
          </div>
        )
      ) : q.multiSelect ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            {q.options.map((opt) => {
              const isChecked = checked.includes(opt)
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2 text-[13px] ${
                    answered && !isChecked ? 'text-[#9ca3af]' : 'text-[#1d2433]'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={answered}
                    onChange={() => toggle(opt)}
                    className="w-4 h-4 accent-[#1FAC76]"
                  />
                  {opt}
                </label>
              )
            })}
          </div>
          {!answered && (
            <div className="flex items-center gap-2">
              <Button
                color="primary"
                variant="filled"
                disabled={checked.length === 0}
                onClick={() => checked.length > 0 && onSelect(checked)}
              >
                Submit
              </Button>
              <Button color="primary" variant="outlined" onClick={() => setChecked(q.options)}>
                Select all
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={stack ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}>
          {q.options.map((opt) => {
            const isSel = selected === opt
            const base = stack
              ? 'inline-flex items-center gap-2 rounded-[8px] border px-4 py-2.5 text-[13px] text-left transition-colors'
              : 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors'
            const tone = isSel
              ? 'border-[#1FAC76] bg-[#ECFFF8] text-[#1C895F] font-semibold'
              : answered
                ? 'border-[#e1e6ef] bg-[#f8fafc] text-[#9ca3af] line-through cursor-default'
                : 'border-[#e1e6ef] bg-white text-[#1d2433] hover:bg-[#f8fafc]'
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => onSelect(opt)}
                className={`${base} ${tone}`}
              >
                {isSel && <Check size={14} color="#1C895F" />}
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function AssistChat({
  seed,
  onClose,
  injectedAnalysis,
  onFlowComplete,
  actions,
  onLaunchAction,
  flow,
  onAnswer,
  completeMessage,
  injectQuestions,
}: {
  seed: ChatSeed | null
  onClose?: () => void
  /** When this becomes a new non-null value, it's appended as a rich agent message. */
  injectedAnalysis?: AnalysisResult | null
  /** Fired once the guided questionnaire's final question is answered. */
  onFlowComplete?: () => void
  /** AI Assisted Actions shown as launch chips (only before the conversation starts). */
  actions?: AssistedAction[]
  onLaunchAction?: (action: AssistedAction) => void
  /** A scripted Q&A to run on mount (alternative to injectedAnalysis). Additive;
   *  the onboarding flow doesn't pass it, so its behavior is unchanged. */
  flow?: QuestionDef[]
  /** Emitted for each scripted answer so a parent can assemble structured data.
   *  May RETURN follow-up questions to enqueue (drives dynamic loops). */
  onAnswer?: (questionId: string, value: string | string[]) => void | QuestionDef[]
  /** Agent message shown when the scripted flow completes. */
  completeMessage?: string
  /** Append a batch of questions mid-conversation (e.g. clarifying Qs after a
   *  left-panel step). Appends — never resets — so prior messages are preserved. */
  injectQuestions?: QuestionDef[]
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  // Guided questionnaire state: recorded answers + the questions not yet asked.
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [pendingQueue, setPendingQueue] = useState<QuestionDef[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastInjectedRef = useRef<AnalysisResult | null>(null)

  // Auto-start the conversation whenever a new CTA seeds the chat.
  useEffect(() => {
    if (seed) {
      // The seeded opening (plain or rich intro) renders as a fixed first
      // agent message; `messages` holds only the interaction turns after it.
      setMessages([])
      setDraft('')
      setAnswers({})
      setPendingQueue([])
      lastInjectedRef.current = null
    }
  }, [seed])

  // Append an analysis result (from the upload screen), then kick off the guided
  // entity-setup questionnaire (first question now; the rest wait for answers).
  useEffect(() => {
    if (injectedAnalysis && injectedAnalysis !== lastInjectedRef.current) {
      lastInjectedRef.current = injectedAnalysis
      const flow = buildEntitySetupFlow(injectedAnalysis)
      setMessages((m) => {
        const next: Message[] = [...m, { role: 'agent', analysis: injectedAnalysis }]
        if (flow.length) next.push(...questionMessages(flow[0]))
        return next
      })
      setPendingQueue(flow.slice(1))
    }
  }, [injectedAnalysis])

  // Kick off a parent-supplied scripted flow (e.g. entity change-capture). The
  // seed-change effect above resets messages first, so this seeds the first
  // question. Onboarding leaves `flow` undefined → no effect, behavior unchanged.
  useEffect(() => {
    if (seed && flow && flow.length) {
      setMessages(questionMessages(flow[0]))
      setPendingQueue(flow.slice(1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, flow])

  // Append a parent-pushed question batch (e.g. clarifying Qs after a left-panel
  // step). Appends — never resets — so prior messages persist. Onboarding passes none.
  const lastInjectRef = useRef<QuestionDef[] | null>(null)
  useEffect(() => {
    if (injectQuestions && injectQuestions.length && injectQuestions !== lastInjectRef.current) {
      lastInjectRef.current = injectQuestions
      setMessages((m) => [...m, ...questionMessages(injectQuestions[0])])
      setPendingQueue((qx) => [...qx, ...injectQuestions.slice(1)])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectQuestions])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  if (!seed) return null

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: t },
      { role: 'agent', text: `Sure — let's "${t}". I'll walk you through it. (Prototype response.)` },
    ])
    setDraft('')
  }

  // Record a questionnaire answer, then reveal the next question (or wrap up).
  const answer = (q: QuestionDef, value: string | string[]) => {
    if (answers[q.id] !== undefined) return // already answered
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
    const followUps = onAnswer?.(q.id, value)
    const queue = [...pendingQueue, ...(Array.isArray(followUps) ? followUps : [])]
    const [nextQ, ...rest] = queue
    setMessages((m) => [
      ...m,
      ...(nextQ
        ? questionMessages(nextQ)
        : [{ role: 'agent', text: completeMessage ?? FLOW_COMPLETE_MESSAGE } as Message]),
    ])
    setPendingQueue(rest)
    if (!nextQ) onFlowComplete?.() // last question answered → main panel builds
  }

  const promptIcons = [Help, Search, Help]

  // Bold the leading question of the intro footer ("Ready to start?").
  const footer = seed.intro?.footer ?? ''
  const fIdx = footer.indexOf('?')
  const footerBold = fIdx >= 0 ? footer.slice(0, fIdx + 1) : footer
  const footerRest = fIdx >= 0 ? footer.slice(fIdx + 1) : ''

  return (
    <aside className="h-full w-full bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 shrink-0 border-b border-[#e1e6ef]">
          <button className="p-1 rounded hover:bg-[#f8fafc]" title="Menu" aria-label="Menu">
            <Menu size={20} color="#424867" />
          </button>
          <span className="text-[16px] font-semibold text-[#1d2433]">New Chat</span>
          <div className="ml-auto flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-[#f8fafc]" title="New chat" aria-label="New chat">
              <ChatBubble size={18} color="#424867" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#f8fafc]" title="Toggle panel" aria-label="Toggle panel">
              <SidebarIcon />
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1.5 rounded hover:bg-[#f8fafc]" title="Close" aria-label="Close chat">
                <Close size={20} color="#424867" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-5 flex flex-col gap-4">
          <p className="text-center text-[13px] text-[#6b7280]">Chatting with host-agent</p>

          {/* Seeded opening — rich intro or a plain bubble */}
          {seed.intro ? (
            <div className="self-start flex flex-col gap-2 max-w-[92%]">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ECFFF8] shrink-0">
                <AutoAwesome size={16} color="#1FAC76" />
              </span>
              <div className="flex flex-col gap-3 text-[13px] leading-5 text-[#1d2433]">
                <p>{seed.intro.paragraph}</p>
                {seed.intro.steps && (
                  <ol className="list-decimal pl-5 flex flex-col gap-1.5">
                    {seed.intro.steps.map((s) => (
                      <li key={s.title}>
                        <span className="font-semibold">{s.title}</span> — {s.desc}
                      </li>
                    ))}
                  </ol>
                )}
                {seed.intro.readyItems && (
                  <div className="flex flex-col gap-1.5">
                    <p className="font-semibold">{seed.intro.readyHeading ?? 'What to have ready'}</p>
                    <ul className="list-disc pl-5 flex flex-col gap-1.5">
                      {seed.intro.readyItems.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {seed.intro.footer && (
                  <p>
                    <span className="font-semibold">{footerBold}</span>
                    {footerRest}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="self-start max-w-[85%] rounded-[10px] px-3 py-2 text-[13px] leading-5 bg-[#f8fafc] border border-[#e1e6ef] text-[#1d2433]">
              {seed.opening}
            </div>
          )}

          {messages.map((m, i) =>
            m.analysis ? (
              <div key={i} className="self-start flex flex-col gap-2 max-w-[92%]">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ECFFF8] shrink-0">
                  <AutoAwesome size={16} color="#1FAC76" />
                </span>
                <div className="flex flex-col gap-3 text-[13px] leading-5 text-[#1d2433]">
                  <p className="font-semibold">{m.analysis.heading}</p>
                  {m.analysis.groups.map((g) => (
                    <div key={g.label} className="flex flex-col gap-1.5">
                      <p className="font-semibold">{g.label}</p>
                      <ul className="list-disc pl-5 flex flex-col gap-1.5">
                        {g.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : m.question ? (
              <QuestionBlock
                key={i}
                q={m.question}
                selected={answers[m.question.id]}
                onSelect={(v) => answer(m.question!, v)}
              />
            ) : (
              <div
                key={i}
                className={`max-w-[85%] rounded-[10px] px-3 py-2 text-[13px] leading-5 ${
                  m.role === 'agent'
                    ? 'self-start bg-[#f8fafc] border border-[#e1e6ef] text-[#1d2433]'
                    : 'self-end bg-[#e0f6ce] text-[#1d2433]'
                }`}
              >
                {m.text}
              </div>
            ),
          )}

          {/* Getting-started prompt badges — only before the conversation has turns */}
          {messages.length === 0 && (
            <div className="flex flex-col items-start gap-2 pt-1">
              {actions && actions.length > 0 && (
                <div className="flex flex-col items-start gap-2 w-full pb-1">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6b7280]">
                    <AutoAwesome size={14} color="#9E70FA" />
                    AI Assisted Actions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {actions.map((a) => (
                      <AssistedActionButton key={a.id} action={a} onLaunch={() => onLaunchAction?.(a)} />
                    ))}
                  </div>
                </div>
              )}
              {seed.prompts.map((p, i) => {
                const Icon = promptIcons[i % promptIcons.length]
                return (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e1e6ef] bg-white px-3 py-1.5 text-[13px] text-[#1d2433] hover:bg-[#f8fafc] transition-colors"
                  >
                    <Icon size={16} color="#6b7280" />
                    {p}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e1e6ef] p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-[6px] border border-[#e1e6ef] bg-[#f8fafc] px-3 h-9 text-[13px]">
            <FileIcon />
            <span className="text-[#6b7280]">Context:</span>
            <span className="text-[#1d2433] font-medium">{seed.contextLabel}</span>
          </div>

          <div className="flex items-end gap-2 rounded-[8px] border border-[#e1e6ef] px-3 py-2">
            <button className="pb-1 shrink-0" title="Attach" aria-label="Attach file">
              <AttachFile size={18} color="#6b7280" />
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(draft)
                }
              }}
              rows={1}
              placeholder="How can I help you today?"
              className="flex-1 resize-none outline-none bg-transparent text-[13px] text-[#1d2433] placeholder:text-[#9ca3af] max-h-24 py-1"
            />
            <button
              onClick={() => send(draft)}
              title="Send"
              aria-label="Send message"
              className="flex items-center justify-center w-8 h-8 shrink-0 rounded-[6px] bg-[#1FAC76] hover:bg-[#1C895F] transition-colors"
            >
              <ArrowUpward size={18} color="#ffffff" />
            </button>
          </div>
        </div>
    </aside>
  )
}
