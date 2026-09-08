/**
 * BulkInviteWizard — the "Add in bulk" tab as a 2-step wizard:
 *   Step 1 — Import: CSV upload + downloadable template. Importing is the ONLY
 *     way to add users in bulk (no manual/inline entry).
 *   Step 2 — Review: a read-only validating AG Grid (BulkReviewGrid). Each row
 *     shows its status; rows with issues are flagged and excluded from Send.
 *     To change anyone, fix the CSV and re-import (Back).
 *
 * Editing/adding inline was intentionally dropped — FloQast has no sanctioned
 * inline-edit/add-row grid, and the admin standard is read-only grid + re-import.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Toggle from '@floqastinc/flow-ui_core/Toggle'
// @ts-ignore
import FileUpload from '@floqastinc/flow-ui_core/FileUpload'
import {
  validateInviteRow,
  summarize,
  submitInvites,
  parseInviteCsv,
  downloadInviteTemplate,
  type InviteRow,
} from '../../data/invite'
import { BulkReviewGrid } from './BulkReviewGrid'

let nextId = 0
function makeRow(
  email = '',
  role: InviteRow['role'] = '',
  loginType: InviteRow['loginType'] = '',
  workspaces: string[] = [],
): InviteRow {
  return { id: `r${++nextId}`, email, role, loginType, workspaces }
}
/** Sample data so Review is demoable without a real upload; a real import replaces it. */
function sampleRows(): InviteRow[] {
  return [
    makeRow('alex.wong@acme.com', 'Manager', 'SAML SSO', ['ent-us-east', 'ent-us-west']),
    makeRow('priya.nair@acme.com', '', 'Password', ['ent-eu']),
    makeRow('dan.ortiz@acme.com', 'Advanced User', '', []),
    makeRow('sarah.chen@acme.com', 'Manager', 'SAML SSO', ['ent-eu']),
    makeRow('tom.bradley@acme.com', 'Advanced User', 'Password', ['ent-us-east']),
    makeRow('not-an-email', 'Ops User', 'Password', []),
  ]
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="#186749" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function UploadCloudIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 18a4 4 0 01-.5-7.97A6 6 0 0118 9.5a3.5 3.5 0 01-.5 8.5" stroke="#adb2bb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v6m0-6l-2.5 2.5M12 12l2.5 2.5" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepDots({ step }: { step: 1 | 2 }) {
  const steps = ['Import', 'Review & invite']
  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-[#e1e6ef] shrink-0">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2
        const active = n === step
        const done = n < step
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
                active ? 'bg-[#186749] text-white' : done ? 'bg-[#d6efe4] text-[#186749]' : 'bg-[#f1f3f9] text-[#6b7280]'
              }`}
            >
              {n}
            </span>
            <span className={`text-[12px] ${active ? 'font-semibold text-[#1d2433]' : 'text-[#6b7280]'}`}>{label}</span>
            {i === 0 && <span className="mx-1 text-[#cbd2e1]">→</span>}
          </div>
        )
      })}
    </div>
  )
}

export function BulkInviteWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [rows, setRows] = useState<InviteRow[]>([])
  const [sendWelcome, setSendWelcome] = useState(true)
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const summary = summarize(rows)
  const canSend = summary.ready > 0

  function goToReview() {
    // Prototype convenience: seed sample rows if nothing was imported, so the
    // read-only validation grid is demoable. A real import replaces these.
    setRows((prev) => (prev.length ? prev : sampleRows()))
    setStep(2)
  }

  async function handleFiles(files: Array<File & { invalidTypeError?: string }>) {
    const file = files?.[0]
    if (!file || file.invalidTypeError || typeof file.text !== 'function') {
      setImportMsg({ type: 'error', text: 'Please upload a .csv file.' })
      return
    }
    const parsed = parseInviteCsv(await file.text())
    if (parsed.length === 0) {
      setImportMsg({ type: 'error', text: 'No rows found in that file. Use the template as a starting point.' })
      return
    }
    setRows(parsed.map((p) => makeRow(p.email, p.role, p.loginType, p.workspaces)))
    setImportMsg({ type: 'success', text: `Imported ${parsed.length} ${parsed.length === 1 ? 'user' : 'users'} from ${file.name}` })
    setStep(2)
  }

  function handleSend() {
    const ready = rows.filter((r) => validateInviteRow(r).status === 'ready')
    submitInvites({
      mode: 'bulk',
      sendWelcome,
      rows: ready.map((r) => ({ email: r.email, role: r.role, loginType: r.loginType, workspaces: r.workspaces })),
    })
    onClose()
  }

  const issues = summary.incomplete + summary.errors
  const summaryParts = [
    summary.ready ? `${summary.ready} ready` : null,
    summary.incomplete ? `${summary.incomplete} incomplete` : null,
    summary.errors ? `${summary.errors} error${summary.errors > 1 ? 's' : ''}` : null,
  ].filter(Boolean)

  return (
    <>
      <StepDots step={step} />

      {step === 1 ? (
        /* ---- Step 1: Import ---- */
        <>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
            <div className="max-w-[560px] mx-auto flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#1d2433]">Import users from CSV</span>
                <button onClick={downloadInviteTemplate} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#186749] hover:underline">
                  <DownloadIcon />
                  Download template
                </button>
              </div>
              <p className="text-[12px] text-[#6b7280]">
                Download the template, fill in one user per row, then upload it here. You'll review and
                validate everyone on the next step before sending.
              </p>
              <FileUpload onChange={handleFiles} allowedFileTypes=".csv">
                <FileUpload.DropZone>
                  <UploadCloudIcon />
                  <FileUpload.UploadButton variant="outlined">Browse files</FileUpload.UploadButton>
                  <FileUpload.HelperText>
                    <span>or drag and drop your CSV here</span>
                    <span className="text-[#adb2bb]">Columns: Email, Role, Login Type, Workspaces (semicolon-separated)</span>
                  </FileUpload.HelperText>
                </FileUpload.DropZone>
              </FileUpload>
              {importMsg && (
                <div className="text-[12px]" style={{ color: importMsg.type === 'error' ? '#d24747' : '#186749' }}>
                  {importMsg.text}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e1e6ef] shrink-0">
            <Button color="secondary" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button color="primary" variant="filled" onClick={goToReview}>Continue</Button>
          </div>
        </>
      ) : (
        /* ---- Step 2: Review (read-only validating grid) ---- */
        <>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 flex flex-col gap-3">
            <p className="text-[13px] text-[#6b7280]">
              Review the imported users below.{' '}
              {issues > 0
                ? 'Rows with issues won’t be invited — fix them in your CSV and re-import.'
                : 'Everyone looks ready to invite.'}
            </p>
            <div className="border border-[#e1e6ef] rounded-[6px] overflow-hidden">
              <BulkReviewGrid rows={rows} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-[#e1e6ef] shrink-0">
            <div className="flex items-center gap-4">
              <Button color="secondary" variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <span className="text-[12px] text-[#6b7280]">{summaryParts.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[12px] text-[#6b7280] cursor-pointer">
                <Toggle checked={sendWelcome} onChange={() => setSendWelcome((v) => !v)} />
                Send welcome emails
              </label>
              <Button color="primary" variant="filled" disabled={!canSend} onClick={handleSend}>
                Send {summary.ready > 0 ? `${summary.ready} ` : ''}invitations
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
