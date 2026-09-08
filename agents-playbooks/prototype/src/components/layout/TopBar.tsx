import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, Sparkles, X, ArrowRight, BookOpen, Play, Clock } from 'lucide-react'

export function TopBar() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="sticky top-0 z-20 h-12 bg-gray-50/95 backdrop-blur border-b border-gray-200 flex items-center justify-center px-6 shrink-0">
      <div className="relative w-[530px] max-w-full">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          placeholder="Search playbooks, agents, folders…"
          className="w-full h-[34px] pl-9 pr-12 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
        />
        <button
          onClick={() => setAiOpen(true)}
          title="Ask FQ AI"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-[27px] w-[35px] rounded flex items-center justify-center transition-colors"
          style={{ background: '#dff5e9', color: '#1a7b4b' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#c4ecd5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#dff5e9')}
        >
          <Sparkles size={14} />
        </button>
      </div>
      <AIAssistantDialog open={aiOpen} onOpenChange={setAiOpen} />
    </div>
  )
}

// ---- AI assistant ----

type BulletIcon = 'playbook' | 'run' | 'recent'

type Result = {
  intro: string
  bullets: { icon: BulletIcon; primary: string; secondary?: string }[]
  followups: string[]
}

const SUGGESTED_PROMPTS: { label: string; result: Result }[] = [
  {
    label: 'Which playbooks ran last week?',
    result: {
      intro: 'Three playbooks ran successfully last week:',
      bullets: [
        { icon: 'run', primary: 'AP Accruals — Month-End Close', secondary: 'Ran Mon & Thu · 100% success · Owner: Sue Wong' },
        { icon: 'run', primary: 'Lease Schedule Reconciliation', secondary: 'Ran Wed · Completed with 1 review flag' },
        { icon: 'run', primary: 'Revenue Recognition Review', secondary: 'Ran Fri · Awaiting sign-off' },
      ],
      followups: [
        'Show me the review flag on the lease playbook',
        'Which playbooks are scheduled for this week?',
      ],
    },
  },
  {
    label: 'Show me drafts in the AP folder',
    result: {
      intro: '2 draft playbooks are in the AP folder:',
      bullets: [
        { icon: 'playbook', primary: 'AP Variance Analysis v2', secondary: 'Draft · Last edited 2 days ago · Owner: Jamie L.' },
        { icon: 'playbook', primary: 'Vendor Invoice Matching — New Logic', secondary: 'Draft · Last edited 5 days ago · Owner: Sue Wong' },
      ],
      followups: [
        'Compare AP Variance v1 vs v2',
        'Who last reviewed these drafts?',
      ],
    },
  },
  {
    label: 'What playbooks need my review?',
    result: {
      intro: 'You have 2 playbooks waiting for your review:',
      bullets: [
        { icon: 'recent', primary: 'Revenue Recognition Review', secondary: 'Submitted for review Fri · High priority' },
        { icon: 'recent', primary: 'Corporate Close Checklist — Q2', secondary: 'Submitted for review 3 days ago' },
      ],
      followups: [
        'Open Revenue Recognition Review',
        'Remind me tomorrow about the Q2 checklist',
      ],
    },
  },
]

const GENERIC_RESULT: Result = {
  intro: "Here's a snapshot of your agent library:",
  bullets: [
    { icon: 'playbook', primary: '14 live playbooks across 6 folders', secondary: 'AP, AR, Corporate, Revenue, Tax, Lease' },
    { icon: 'run', primary: '3 playbooks ran this week', secondary: 'All completed · 1 has an open review flag' },
    { icon: 'recent', primary: '2 drafts awaiting your review', secondary: 'Revenue Recognition Review · Corporate Close Q2' },
  ],
  followups: [
    'Show me all drafts',
    'Which playbooks ran last week?',
  ],
}

const bulletIcon: Record<BulletIcon, React.ReactNode> = {
  playbook: <BookOpen size={14} className="text-indigo-600" />,
  run: <Play size={14} className="text-emerald-600" />,
  recent: <Clock size={14} className="text-amber-500" />,
}

function AIAssistantDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  function reset() {
    setQuery('')
    setResult(null)
  }

  function ask(prompt: string, preset?: Result) {
    setQuery(prompt)
    setResult(preset ?? GENERIC_RESULT)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const matched = SUGGESTED_PROMPTS.find(p => p.label.toLowerCase() === query.trim().toLowerCase())
    ask(query.trim(), matched?.result)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-[12%] left-[50%] -translate-x-1/2 w-[640px] max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-2xl z-50 focus:outline-none">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: '#dff5e9', color: '#1a7b4b' }}
                >
                  <Sparkles size={14} />
                </span>
                Ask FQ AI
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                Ask anything about your playbooks, agents, or library.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-700 p-1 rounded">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="relative">
              <Sparkles size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/70 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. which playbooks ran last week?"
                className="w-full h-11 pl-10 pr-24 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1a7b4b' }}
              >
                Ask
              </button>
            </div>

            {!result && (
              <div className="mt-6">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Try asking</div>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => ask(p.label, p.result)}
                      className="group text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
                    >
                      <span className="text-sm text-gray-800">{p.label}</span>
                      <ArrowRight size={14} className="text-gray-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="mt-6">
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-4">
                  <p className="text-sm text-gray-800">{result.intro}</p>
                  <ul className="mt-3 space-y-2">
                    {result.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0">{bulletIcon[b.icon]}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{b.primary}</div>
                          {b.secondary && <div className="text-xs text-gray-600 mt-0.5">{b.secondary}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.followups.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Follow up</div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.followups.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => ask(f, GENERIC_RESULT)}
                          className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Ask something else
                  </button>
                  <span className="text-[11px] text-gray-400">FQ AI may make mistakes — verify important answers</span>
                </div>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
