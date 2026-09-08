/**
 * CreateUsersScreen — the Create Users page (both versions). Two on-ramps that
 * converge on ONE validate→submit core (data/inviteWorkflow):
 *   - Inline (default): editable Name / Email / Account role rows, corrected in
 *     place with live per-row validation. No reimport gesture.
 *   - CSV (secondary): download template → upload → read-only validated review,
 *     corrected by re-upload.
 * Both build CandidateRow[] and call the same validateRow / summarize /
 * submitInvites, ending in the same success state. Rendered as the main body of
 * DrilldownPage for the 'users' variant; the docked chat is provided by DrilldownPage.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import FileUpload from '@floqastinc/flow-ui_core/FileUpload'
// @ts-ignore
import Input from '@floqastinc/flow-ui_core/Input'
// @ts-ignore
import Select from '@floqastinc/flow-ui_core/Select'
import {
  makeRow,
  validateRow,
  summarize,
  submitInvites,
  parseInviteCsv,
  downloadInviteTemplate,
  buildInviteTemplateCsv,
  ROLE_OPTIONS,
  type CandidateRow,
  type RowStatus,
  type InviteResult,
} from '../data/inviteWorkflow'

type Mode = 'inline' | 'csv-import' | 'csv-review'

const STATUS_STYLE: Record<Exclude<RowStatus, 'empty'>, { tint: string; fg: string }> = {
  ready: { tint: 'var(--flo-sem-color-surface-success-weakest)', fg: 'var(--flo-sem-color-content-success-strong)' },
  warning: { tint: '#FFF8EB', fg: '#A55503' },
  error: { tint: '#FEF1F2', fg: '#981B25' },
}

function StatusBadge({ status, label }: { status: RowStatus; label: string }) {
  if (status === 'empty') return <span className="text-[12px] text-[#9ca3af]">—</span>
  const s = STATUS_STYLE[status]
  return (
    <span
      className="inline-flex items-center h-6 px-2 rounded-[6px] text-[12px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.tint, color: s.fg }}
    >
      {label}
    </span>
  )
}

const ROW_COLS = '1.1fr 1.4fr 170px 130px 36px'
const REVIEW_COLS = '1.1fr 1.4fr 170px 130px'

/** Account-role options for the FlowUI Select. */
const roleSelectOptions = ROLE_OPTIONS.map((r) => ({ label: r, value: r }))

export function CreateUsersScreen() {
  const [mode, setMode] = useState<Mode>('inline')
  const [rows, setRows] = useState<CandidateRow[]>([makeRow()])
  const [csvRows, setCsvRows] = useState<CandidateRow[]>([])
  const [csvError, setCsvError] = useState<string | null>(null)
  const [result, setResult] = useState<InviteResult | null>(null)

  const update = (id: string, patch: Partial<CandidateRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const addRow = () => setRows((prev) => [...prev, makeRow()])
  const removeRow = (id: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  // BOTH on-ramps converge here.
  const handleSubmit = (source: CandidateRow[]) => {
    const ready = source.filter((r) => validateRow(r, source).status === 'ready')
    setResult(
      submitInvites({
        rows: ready.map((r) => ({ name: r.name.trim(), email: r.email.trim(), role: r.role || '' })),
      }),
    )
  }

  const loadCsv = (text: string) => {
    const parsed = parseInviteCsv(text)
    if (!parsed.length) {
      setCsvError('No rows found in that file. Use the template as a starting point.')
      return
    }
    setCsvRows(parsed.map((p) => makeRow(p.name, p.email, p.role)))
    setCsvError(null)
    setMode('csv-review')
  }
  const handleFiles = async (files: Array<File & { invalidTypeError?: string }>) => {
    const file = files?.[0]
    if (!file || file.invalidTypeError || typeof file.text !== 'function') {
      setCsvError('Please upload a .csv file.')
      return
    }
    loadCsv(await file.text())
  }

  // ---- Shared success ending ----
  if (result) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[680px] flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{ backgroundColor: 'var(--flo-sem-color-surface-success-weakest)', color: 'var(--flo-sem-color-content-success-strong)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold text-[#1d2433]">
                {result.invited} {result.invited === 1 ? 'user' : 'users'} invited
              </h2>
              <p className="text-[13px] text-[#6b7280]">
                Invitations were emailed. They'll show as Pending in Team Members until accepted.
              </p>
            </div>
          </div>
          <div className="rounded-[8px] border border-[#e1e6ef] overflow-hidden">
            {result.rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0 border-[#f1f3f9]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#1d2433]">{r.name || r.email}</span>
                  <span className="text-[12px] text-[#6b7280]">{r.email}</span>
                </div>
                <span className="text-[12px] text-[#6b7280]">{r.role}</span>
              </div>
            ))}
          </div>
          <div>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                setResult(null)
                setRows([makeRow()])
                setCsvRows([])
                setMode('inline')
              }}
            >
              Invite more people
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const activeRows = mode === 'csv-review' ? csvRows : rows
  const summary = summarize(activeRows)
  const summaryParts = [
    summary.ready ? `${summary.ready} ready` : null,
    summary.incomplete ? `${summary.incomplete} incomplete` : null,
    summary.errors ? `${summary.errors} error${summary.errors > 1 ? 's' : ''}` : null,
  ].filter(Boolean)
  const inviteLabel =
    summary.ready > 0 ? `Invite ${summary.ready} ${summary.ready === 1 ? 'user' : 'users'}` : 'Invite users'

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-[28px] leading-tight font-bold text-[#1d2433]">Add your team</h2>
      <p className="mt-2 text-[14px] leading-5 text-[#6b7280] max-w-[820px]">
        Enter the people you want to invite. I'll validate each one — checking for a valid email and flagging
        duplicates — before any invitations go out.
      </p>

      {mode === 'inline' && (
        <div className="mt-6 flex flex-col gap-3 max-w-[920px]">
          <div className="grid items-center gap-3 px-1" style={{ gridTemplateColumns: ROW_COLS }}>
            <span className="text-[12px] font-semibold text-[#6b7280]">Name</span>
            <span className="text-[12px] font-semibold text-[#6b7280]">Email</span>
            <span className="text-[12px] font-semibold text-[#6b7280]">Account role</span>
            <span className="text-[12px] font-semibold text-[#6b7280]">Status</span>
            <span />
          </div>
          {rows.map((row) => {
            const v = validateRow(row, rows)
            return (
              <div key={row.id} className="grid items-center gap-3" style={{ gridTemplateColumns: ROW_COLS }}>
                <Input
                  placeholder="Full name"
                  value={row.name}
                  onChange={(v: string) => update(row.id, { name: v })}
                />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={row.email}
                  onChange={(v: string) => update(row.id, { email: v })}
                />
                <Select
                  className="w-full"
                  selectionMode="single"
                  value={row.role}
                  onChange={(v: string | null) => update(row.id, { role: (v ?? '') as CandidateRow['role'] })}
                  options={roleSelectOptions}
                  buttonLabel={row.role || 'Select role'}
                  disableFilter
                />
                <StatusBadge status={v.status} label={v.label} />
                <button
                  type="button"
                  aria-label="Remove row"
                  disabled={rows.length === 1}
                  onClick={() => removeRow(row.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-[6px] text-[#9ca3af] hover:text-[#d24747] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m-9 0v14a1 1 0 001 1h8a1 1 0 001-1V6" />
                  </svg>
                </button>
              </div>
            )
          })}
          <div>
            <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1e8ae9] hover:underline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add another
            </button>
          </div>

          {/* Secondary CSV on-ramp */}
          <div className="flex items-center gap-2 pt-1 text-[13px] text-[#6b7280]">
            <span>Adding a lot of people?</span>
            <button
              type="button"
              onClick={() => {
                setMode('csv-import')
                setCsvError(null)
              }}
              className="font-semibold text-[#1e8ae9] hover:underline"
            >
              Import from a spreadsheet
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[#e1e6ef] pt-4 mt-1">
            <span className="text-[12px] text-[#6b7280]">{summaryParts.join(' · ') || 'Add at least one person'}</span>
            <Button color="primary" variant="filled" disabled={summary.ready === 0} onClick={() => handleSubmit(rows)}>
              {inviteLabel}
            </Button>
          </div>
        </div>
      )}

      {mode === 'csv-import' && (
        <div className="mt-6 flex flex-col gap-4 max-w-[620px]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#1d2433]">Import users from a spreadsheet</span>
            <button onClick={downloadInviteTemplate} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1C895F] hover:underline">
              Download template
            </button>
          </div>
          <p className="text-[13px] text-[#6b7280]">
            Download the template, fill in one person per row (Name, Email, Role), then upload it. You'll review
            everyone before sending.
          </p>
          <FileUpload onChange={handleFiles} allowedFileTypes=".csv">
            <FileUpload.DropZone>
              <div className="flex flex-col items-center justify-center text-center px-6 py-12 gap-2">
                <p className="text-[14px] font-semibold text-[#1d2433]">Drag and drop your CSV here</p>
                <FileUpload.HelperText>Columns: Name, Email, Role</FileUpload.HelperText>
                <div className="mt-1">
                  <FileUpload.UploadButton variant="outlined">Browse files</FileUpload.UploadButton>
                </div>
              </div>
            </FileUpload.DropZone>
          </FileUpload>
          {csvError && <p className="text-[12px] text-[#d24747]">{csvError}</p>}
          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <button type="button" onClick={() => setMode('inline')} className="font-semibold text-[#1e8ae9] hover:underline">
              Back to entering inline
            </button>
            <span>·</span>
            <button type="button" onClick={() => loadCsv(buildInviteTemplateCsv())} className="font-semibold text-[#1e8ae9] hover:underline">
              Try a sample file
            </button>
          </div>
        </div>
      )}

      {mode === 'csv-review' && (
        <div className="mt-6 flex flex-col gap-4 max-w-[920px]">
          <p className="text-[13px] text-[#6b7280]">
            Review the imported users below.{' '}
            {summary.errors + summary.incomplete > 0
              ? 'Rows with issues won’t be invited — fix them in your file and re-upload.'
              : 'Everyone looks ready to invite.'}
          </p>
          <div className="rounded-[8px] border border-[#e1e6ef] overflow-hidden">
            <div className="grid items-center gap-3 px-4 py-2 bg-[#f8fafc] border-b border-[#e1e6ef]" style={{ gridTemplateColumns: REVIEW_COLS }}>
              <span className="text-[12px] font-semibold text-[#6b7280]">Name</span>
              <span className="text-[12px] font-semibold text-[#6b7280]">Email</span>
              <span className="text-[12px] font-semibold text-[#6b7280]">Account role</span>
              <span className="text-[12px] font-semibold text-[#6b7280]">Status</span>
            </div>
            {csvRows.map((row) => {
              const v = validateRow(row, csvRows)
              return (
                <div key={row.id} className="grid items-center gap-3 px-4 py-2.5 border-b last:border-b-0 border-[#f1f3f9]" style={{ gridTemplateColumns: REVIEW_COLS }}>
                  <span className="text-[13px] text-[#1d2433]">{row.name || <span className="text-[#9ca3af]">—</span>}</span>
                  <span className="text-[13px] text-[#1d2433]">{row.email}</span>
                  <span className="text-[13px] text-[#1d2433]">{row.role || <span className="text-[#9ca3af]">—</span>}</span>
                  <StatusBadge status={v.status} label={v.label} />
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t border-[#e1e6ef] pt-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setMode('csv-import')} className="text-[13px] font-semibold text-[#1e8ae9] hover:underline">
                Re-upload
              </button>
              <span className="text-[12px] text-[#6b7280]">{summaryParts.join(' · ')}</span>
            </div>
            <Button color="primary" variant="filled" disabled={summary.ready === 0} onClick={() => handleSubmit(csvRows)}>
              {inviteLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
