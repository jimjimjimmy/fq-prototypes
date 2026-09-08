/**
 * UploadDocsScreen — main-body view for the "Create Entities" upload drilldown.
 * Drop accounting documents so the agent can extract workflows, entities, and
 * folders. (The former 'users' variant is gone — Create Users now has its own
 * CreateUsersScreen with a real validate→invite workflow.)
 *
 * Prototype simulation: "Select files" stages sample files; "Upload" runs an
 * uploading → complete sequence, then hands an AnalysisResult to the docked chat.
 */
import { useState } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import FileUpload from '@floqastinc/flow-ui_core/FileUpload'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
import type { AnalysisResult } from './AssistChat'

type StagedFile = { id: string; name: string }
type Phase = 'idle' | 'uploading' | 'done'

function UploadGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="#1FAC76" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#1FAC76" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const COPY = {
  heading: 'Upload your accounting documents',
  body:
    'Add the files FloQast needs to extract your entities, workflows, and folders. Trial ' +
    'Balance and Chart of Accounts are a great place to start, plus a close Checklist if you have one.',
  hint: '.xlsx, .csv, .pdf — up to 25MB',
  allowed: '.xlsx,.csv,.pdf',
}

const SAMPLE_FILES: StagedFile[] = [
  { id: 'tb', name: 'Trial Balance - Q2 2026.xlsx' },
  { id: 'coa', name: 'Chart of Accounts.csv' },
  { id: 'checklist', name: 'Close Checklist.xlsx' },
]

const ANALYSIS: AnalysisResult = {
  heading: 'Document analysis complete. I found the following workflows, entities, and folders:',
  groups: [
    {
      label: 'Workflows (3)',
      items: [
        'Monthly Close — 14 tasks, strict sign-off enabled',
        'Quarterly Review — 9 tasks, dual reviewer',
        'Year-End — 21 tasks, controller approval',
      ],
    },
    {
      label: 'Entities (5)',
      items: [
        'FloQast US, Inc. — USD, December year-end',
        'FloQast EMEA Ltd. — GBP, March year-end',
        'FloQast APAC Pte. Ltd. — SGD, December year-end',
        'FloQast Canada ULC — CAD, December year-end',
        'Consolidated (Parent) — USD, intercompany eliminations',
      ],
    },
    {
      label: 'Folders (4)',
      items: [
        'Cash & Bank — 6 reconciliations',
        'Prepaid & Accruals — 8 reconciliations',
        'Fixed Assets — 4 reconciliations',
        'Intercompany — 5 reconciliations',
      ],
    },
  ],
}

export function UploadDocsScreen({ onAnalyzed }: { onAnalyzed?: (result: AnalysisResult) => void }) {
  const [files, setFiles] = useState<StagedFile[]>([])
  const [phase, setPhase] = useState<Phase>('idle')

  // Stage sample files (deterministic for a walkthrough — no OS file dialog).
  const addSampleFiles = () => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      return [...SAMPLE_FILES.filter((s) => !existing.has(s.name)), ...prev]
    })
  }

  // Real drag-and-drop still works through the FlowUI provider's onChange.
  const handleChange = (e: { target?: { files?: FileList } }) => {
    const picked = e?.target?.files ? Array.from(e.target.files) : []
    if (!picked.length) return
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      const toAdd = picked
        .filter((f) => !existing.has(f.name))
        .map((f, i) => ({ id: `${f.name}-${prev.length + i}`, name: f.name }))
      return [...toAdd, ...prev]
    })
  }

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const startUpload = () => {
    if (!files.length || phase !== 'idle') return
    setPhase('uploading')
    window.setTimeout(() => {
      setPhase('done')
      onAnalyzed?.(ANALYSIS)
    }, 1500)
  }

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-[28px] leading-tight font-bold text-[#1d2433]">{COPY.heading}</h2>
      <p className="mt-2 text-[14px] leading-5 text-[#6b7280] max-w-[900px]">{COPY.body}</p>

      <div className="mt-6">
        <FileUpload multiple allowedFileTypes={COPY.allowed} onChange={handleChange}>
          <FileUpload.DropZone>
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ECFFF8]">
                <UploadGlyph />
              </div>
              <p className="text-[15px] font-semibold text-[#1d2433]">Drag and drop your files here</p>
              <FileUpload.HelperText>{COPY.hint}</FileUpload.HelperText>
              <div className="mt-1">
                <Button color="primary" variant="outlined" onClick={addSampleFiles}>
                  Select files
                </Button>
              </div>
            </div>
          </FileUpload.DropZone>

          {files.length > 0 && (
            <div className="mt-4">
              <FileUpload.FileList>
                {files.map((f) => (
                  <FileUpload.File
                    key={f.id}
                    file={{ name: f.name }}
                    isLoading={phase === 'uploading'}
                    showCompletedStatus={phase === 'done'}
                    onDelete={phase === 'idle' ? () => removeFile(f.id) : undefined}
                  />
                ))}
              </FileUpload.FileList>
            </div>
          )}
        </FileUpload>
      </div>

      {files.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          {phase === 'done' ? (
            <p className="text-[13px] text-[#1C895F] font-semibold">
              Analysis complete — see the results in the chat.
            </p>
          ) : (
            <Button color="primary" variant="filled" onClick={startUpload} disabled={phase === 'uploading'}>
              {phase === 'uploading'
                ? 'Analyzing documents…'
                : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
