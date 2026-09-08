import { useState } from 'react'
import { Accordion, Avatar, Button, CloseButton, FileUpload, IconButton, SideDrawer, Tooltip } from '@floqastinc/flow-ui_core'
import DeleteOutlined from '@floqastinc/flow-ui_icons/material/DeleteOutlined'
import ExpandLess from '@floqastinc/flow-ui_icons/material/ExpandLess'
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import { DiscardConfirmDialog } from './DiscardConfirmDialog'
import { AVATAR_SRC_BY_NAME, type DocumentFile } from './addGroupTypes'

let uploadIdCounter = 0
function nextUploadId() {
  uploadIdCounter += 1
  return `upload-${uploadIdCounter}`
}

// This prototype has no real clock-driven date math (see MOCK_DUE_DATE in
// AssigneesSection) - every file added during a session shows this same
// illustrative date.
const MOCK_UPLOAD_DATE = '09/08/2026'
const CURRENT_USER_NAME = 'You'

interface DocumentGroup {
  addedBy: string
  files: DocumentFile[]
}

function groupByUploader(files: DocumentFile[]): DocumentGroup[] {
  const order: string[] = []
  const byUploader = new Map<string, DocumentFile[]>()
  for (const file of files) {
    if (!byUploader.has(file.addedBy)) {
      order.push(file.addedBy)
      byUploader.set(file.addedBy, [])
    }
    byUploader.get(file.addedBy)!.push(file)
  }
  return order.map((addedBy) => ({ addedBy, files: byUploader.get(addedBy)! }))
}

interface DocumentsDrawerProps {
  show: boolean
  onCancel: () => void
  initialDocuments: DocumentFile[]
  onSave: (documents: DocumentFile[]) => void
}

// Local-draft pattern matching DependencySection/AccountBalanceFiltersSection:
// adding or deleting a file only touches `documents` (this drawer's local
// state) - nothing reaches the caller's saved state until Save. Cancel with
// unsaved changes routes through the same DiscardConfirmDialog every other
// drawer/drill-in uses; delete itself has no confirm step since Cancel is
// already the safety net for the whole draft.
export function DocumentsDrawer({ show, onCancel, initialDocuments, onSave }: DocumentsDrawerProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments)
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    initialDocuments.length > 0 ? [groupByUploader(initialDocuments)[0].addedBy] : [],
  )
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const hasUnsavedChanges = JSON.stringify(documents) !== JSON.stringify(initialDocuments)

  const handleCancelRequest = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true)
    } else {
      onCancel()
    }
  }

  const handleSave = () => {
    onSave(documents)
    onCancel()
  }

  const handleUpload = (files: (File | { name: string; invalidTypeError: string })[]) => {
    const uploaded: DocumentFile[] = files
      .filter((f): f is File => !('invalidTypeError' in f))
      .map((file) => ({ id: nextUploadId(), name: file.name, date: MOCK_UPLOAD_DATE, addedBy: CURRENT_USER_NAME }))
    if (uploaded.length === 0) return
    setDocuments((prev) => [...uploaded, ...prev])
    setOpenGroups((prev) => (prev.includes(CURRENT_USER_NAME) ? prev : [CURRENT_USER_NAME, ...prev]))
  }

  const handleDelete = (fileId: string) => {
    setDocuments((prev) => prev.filter((f) => f.id !== fileId))
  }

  const groups = groupByUploader(documents)

  return (
    <SideDrawer show={show} onCancel={handleCancelRequest}>
      <SideDrawer.Header>
        <SideDrawer.Title>Documents</SideDrawer.Title>
        <SideDrawer.TopRight>
          <CloseButton onClick={handleCancelRequest} color="dark" size="md" />
        </SideDrawer.TopRight>
      </SideDrawer.Header>
      <SideDrawer.Body>
        <div className="flex flex-col gap-[24px] w-full">
          {/* FileUpload.DropZone already applies its own 48px padding + 8px
              gap (see FileUpload/index.styles.js's DropArea) - wrapping
              these in another padded/gapped div double-stacks the spacing
              and renders the dropzone far taller than the Figma spec's
              184px-tall box. Children go directly inside DropZone. */}
          <FileUpload onChange={handleUpload} multiple allowedFileTypes=".csv,.xlsx,.pdf">
            <FileUpload.DropZone>
              <FileUpload.UploadButton>Upload Files</FileUpload.UploadButton>
              <p className="text-[11px] text-[rgba(29,36,51,0.9)] text-center">Or drop file here to upload</p>
              <FileUpload.HelperText className="text-center">CSV, XLSX, or PDF less than 10MB</FileUpload.HelperText>
            </FileUpload.DropZone>
          </FileUpload>

          {/* Figma's "Document" root uses one uniform 24px gap for every
              sibling (dropzone, then each "Added by" group) - Accordion's
              own "standard" variant hardcodes a 12px gap between Items
              (Accordion/index.styles.js's Root), so it needs an explicit
              override here to match. */}
          {groups.length > 0 && (
            <Accordion
              type="multiple"
              value={openGroups}
              onValueChange={(value) => setOpenGroups(Array.isArray(value) ? value : [value])}
              className="!gap-[24px]"
            >
              {groups.map((group) => {
                const isOpen = openGroups.includes(group.addedBy)
                return (
                  // Figma bordered each "Added by" group independently
                  // (border-l/r/t + rounded-[6px], per-group - not one
                  // shared outer border wrapping the whole list), so the
                  // border lives on the item itself, not a wrapper around
                  // <Accordion>.
                  <Accordion.Item
                    key={group.addedBy}
                    value={group.addedBy}
                    className="border-l border-r border-t border-solid border-[#e1e6ef] rounded-[6px] overflow-hidden"
                  >
                    {/* Accordion.Trigger's own built-in arrow is a KeyboardArrowRight
                        that rotates to point down when open - a "drill-down" caret
                        shape this app reserves for navigation (see ChevronRight in
                        AssigneesSection/DependencySection), not expand/collapse.
                        Figma's own spec uses a plain up/down pair instead (assets
                        named chevron-up-expand-less / chevron-down-expand-more) -
                        hidden here via [&>svg]:hidden and replaced with our own. */}
                    <Accordion.Trigger unsetHeight className="[&>svg]:hidden hover:!bg-[#f1f3f9] border-b border-solid border-[#e1e6ef]">
                      {/* Accordion.Trigger's own standard-variant CSS already
                          applies 12px/16px padding (Accordion/index.styles.js's
                          Root -> Trigger override) - no padding added here,
                          same double-padding lesson as the dropzone above. */}
                      <div className="flex items-center justify-between gap-[12px] w-full">
                        <div className="flex items-center gap-[12px]">
                          <Avatar size="lg" fallback={group.addedBy} src={AVATAR_SRC_BY_NAME[group.addedBy]} />
                          <div className="flex flex-col items-start">
                            <span className="text-[11px] text-[#6b7280]">Added by:</span>
                            <span className="text-[12px] font-semibold text-[#1b1f27]">{group.addedBy}</span>
                          </div>
                        </div>
                        {isOpen ? (
                          <ExpandLess className="size-[16px]" color="#6b7280" />
                        ) : (
                          <ExpandMore className="size-[16px]" color="#6b7280" />
                        )}
                      </div>
                    </Accordion.Trigger>
                    <Accordion.Content>
                      {/* Accordion.Content always wraps children in its own
                          ContentInner div, which (at variant="standard", the
                          default) applies a hardcoded 16px padding on every
                          side (Accordion/index.styles.js) - the same
                          double-padding trap as the dropzone/trigger above,
                          this time inflating the row's horizontal padding
                          and insetting its border away from the group's own
                          edges. Cancelled here with a matching -16px margin
                          so the rows - and their divider borders - span the
                          full width of the bordered group above. */}
                      <div className="-m-[16px]">
                        {group.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-[4px] h-[60px] px-[12px] w-full border-b border-solid border-[#e1e6ef]"
                          >
                            {/* Tooltip.Trigger's own internal wrapper is a
                                fixed `width: fit-content` div (Tooltip/
                                index.styles.js) that isn't reachable via
                                props - putting flex-1/min-w-0 on the span
                                INSIDE it has no effect on the row's layout,
                                since that fit-content wrapper (not the span)
                                is the actual flex child. Sizing goes on a
                                wrapper OUTSIDE the Tooltip instead, so the
                                date/delete columns get their space back. */}
                            {/* Widened from Figma's own ~288px spec value,
                                trimming the date/delete columns below to
                                free up the room, per explicit direction to
                                read more of the name without changing the
                                drawer's own width (kept at the default
                                'md', matching every other drawer). */}
                            <div className="w-[300px] shrink-0 overflow-hidden">
                              <Tooltip>
                                <Tooltip.Trigger>
                                  <span className="w-full text-[12px] text-black line-clamp-2 break-all">
                                    {file.name}
                                  </span>
                                </Tooltip.Trigger>
                                <Tooltip.Content side="top">{file.name}</Tooltip.Content>
                              </Tooltip>
                            </div>
                            <div className="flex-1" />
                            <span className="shrink-0 w-[68px] text-right text-[11px] text-[#424867]">{file.date}</span>
                            <div className="shrink-0 w-[40px] flex justify-center">
                              <IconButton size="sm" onClick={() => handleDelete(file.id)}>
                                <DeleteOutlined className="size-[16px]" />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                )
              })}
            </Accordion>
          )}
        </div>
      </SideDrawer.Body>
      <SideDrawer.Footer>
        <div className="flex-1" />
        <Button variant="ghost" color="dark" size="md" onClick={handleCancelRequest}>
          Cancel
        </Button>
        <Button color="primary" variant="filled" size="md" disabled={!hasUnsavedChanges} onClick={handleSave}>
          Save
        </Button>
      </SideDrawer.Footer>
      <DiscardConfirmDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm} onDiscard={onCancel} />
    </SideDrawer>
  )
}
