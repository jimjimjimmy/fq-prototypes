/**
 * BuildProgressScreen — replaces the upload surface once the guided
 * questionnaire is answered. A centered card on a dotted background steps
 * through the entity-build tasks: done (filled check) → in progress (green
 * spinner) → pending (gray ring), advancing one step at a time.
 *
 * Tokens: #1d2433 done circle + body, brand green #1FAC76 spinner, #e1e6ef
 * rings/borders, #9ca3af pending text.
 */
import { useEffect, useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Check from '@floqastinc/flow-ui_icons/material/Check'

const STEPS = [
  'Reading your trial balance and chart of accounts',
  'Setting up entities and their reporting structure',
  'Mapping accounts to folders',
  'Applying checklists, frequencies, deadlines, and assignees',
  'Building your mapping document',
  'Running import validation checks',
]

function DoneCircle() {
  return (
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1d2433] shrink-0">
      <Check size={13} color="#ffffff" />
    </span>
  )
}

function ActiveSpinner() {
  return (
    <span className="w-5 h-5 rounded-full border-2 border-[#e1e6ef] border-t-[#1FAC76] animate-spin shrink-0" />
  )
}

function PendingCircle() {
  return <span className="w-5 h-5 rounded-full border-2 border-[#e1e6ef] shrink-0" />
}

export function BuildProgressScreen({ onComplete }: { onComplete?: () => void }) {
  // Number of completed steps; the step at `doneCount` is the active one.
  const [doneCount, setDoneCount] = useState(0)

  useEffect(() => {
    if (doneCount < STEPS.length) {
      const t = window.setTimeout(() => setDoneCount((c) => c + 1), 1500)
      return () => window.clearTimeout(t)
    }
    // All steps done — brief beat on the completed list, then reveal the mapping.
    const t = window.setTimeout(() => onComplete?.(), 900)
    return () => window.clearTimeout(t)
  }, [doneCount])

  return (
    <div
      className="h-full w-full flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(#e1e6ef 1.2px, transparent 1.2px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="bg-white rounded-[12px] border border-[#e1e6ef] shadow-sm px-9 py-7 w-full max-w-[560px]">
        <div className="flex flex-col gap-4">
          {STEPS.map((label, i) => {
            const status = i < doneCount ? 'done' : i === doneCount ? 'active' : 'pending'
            return (
              <div key={label} className="flex items-center gap-3">
                {status === 'done' ? <DoneCircle /> : status === 'active' ? <ActiveSpinner /> : <PendingCircle />}
                <span
                  className={`text-[14px] leading-5 ${
                    status === 'pending' ? 'text-[#9ca3af]' : 'text-[#1d2433]'
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
