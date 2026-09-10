import { useState } from 'react'
import { ActionableBadge, Avatar, Button, CloseButton, IconButton, SideDrawer, TableStatusBadge, TextArea } from '@floqastinc/flow-ui_core'
import Add from '@floqastinc/flow-ui_icons/material/Add'
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft'
import ChevronRight from '@floqastinc/flow-ui_icons/material/ChevronRight'
import EditOutlined from '@floqastinc/flow-ui_icons/material/EditOutlined'
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert'
import { FormDropdownField } from '../FormDropdownField'
import { SlideScreen, SLIDE_MS } from './SlideScreen'
import {
  AVATAR_SRC_BY_NAME,
  INITIAL_TAG_OPTIONS,
  NOTE_ASSIGNEE_OPTIONS,
  type ReconciliationHeaderData,
  type ReviewNote,
} from './addGroupTypes'

let noteIdCounter = 0
function nextNoteId() {
  noteIdCounter += 1
  return `note-${noteIdCounter}`
}
let replyIdCounter = 0
function nextReplyId() {
  replyIdCounter += 1
  return `reply-${replyIdCounter}`
}

const CURRENT_USER_NAME = 'You'

// This prototype has no real clock-driven date math (see MOCK_UPLOAD_DATE in
// DocumentsDrawer) - every note/reply created during a session shows this
// same illustrative date.
const MOCK_ACTION_DATE = '09/10/2026'

type ReviewNotesView = 'list' | 'compose' | 'detail'

// Shown identically at the top of every view per Figma (list, compose, and
// detail all repeat the same Description + tags block). Description's
// layout/formatting is a deliberate deviation from Figma's own run-on
// sentence - see MOCK_RECONCILIATION_HEADER's comment in addGroupTypes.ts.
function ReconciliationDescription({ header }: { header: ReconciliationHeaderData }) {
  return (
    <div className="flex flex-col gap-[16px] w-full shrink-0">
      <div className="flex flex-col gap-[4px] w-full">
        <p className="text-[11px] text-[#6b7280]">Description</p>
        <div className="flex flex-col gap-[2px] w-full">
          <p className="text-[11px] font-semibold text-[#1d2433] leading-[16px]">{header.title}</p>
          {header.descriptionFields.map((field) => (
            <p key={field.label} className="text-[11px] leading-[16px]">
              <span className="font-semibold text-[#1d2433]">{field.label}: </span>
              <span className="text-[#1d2433]">{field.value}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-[8px] w-full">
        {header.tagIds.map((tagId) => {
          const tag = INITIAL_TAG_OPTIONS.find((o) => o.value === tagId)
          if (!tag) return null
          return (
            <ActionableBadge key={tagId} size="small" hideX onClick={() => {}}>
              {tag.label}
            </ActionableBadge>
          )
        })}
      </div>
    </div>
  )
}

function ReconciliationTitle({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-[4px] min-w-0">
      <p className="text-[11px] text-[#6b7280]">Reconciliation</p>
      <p className="font-[family-name:'Museo_Sans',sans-serif] font-bold text-[16px] leading-[20px] text-black truncate">
        {title}
      </p>
    </div>
  )
}

function AssigneeRow({ label, name }: { label: string; name: string | null }) {
  return (
    <div className="flex flex-col gap-[8px] w-full">
      <p className="text-[11px] text-[#6b7280]">{label}</p>
      {name ? (
        <div className="flex items-center gap-[8px]">
          <Avatar size="sm" fallback={name} src={AVATAR_SRC_BY_NAME[name]} />
          <span className="text-[12px] font-semibold text-[#1d2433]">{name}</span>
        </div>
      ) : (
        <p className="text-[12px] text-[#adb2bb]">Unassigned</p>
      )}
    </div>
  )
}

interface ReviewNotesDrawerProps {
  show: boolean
  onCancel: () => void
  header: ReconciliationHeaderData
  initialNotes: ReviewNote[]
  onSave: (notes: ReviewNote[]) => void
}

// Every note/reply/status change commits immediately via `onSave` - unlike
// DocumentsDrawer's batched local-draft, this list has no per-item form to
// stage (per Figma, the empty-state frame has no footer at all), so there's
// nothing to "unsave" and Close/Back just exit directly, matching Figma's
// literal absence of a Cancel/Save bar.
export function ReviewNotesDrawer({ show, onCancel, header, initialNotes, onSave }: ReviewNotesDrawerProps) {
  const [notes, setNotes] = useState<ReviewNote[]>(initialNotes)
  const [view, setView] = useState<ReviewNotesView>('list')
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isClosingDrillIn, setIsClosingDrillIn] = useState(false)
  const [openingDrillIn, setOpeningDrillIn] = useState<Exclude<ReviewNotesView, 'list'> | null>(null)
  const [hasReturnedFromDrillIn, setHasReturnedFromDrillIn] = useState(false)

  const [draftAssignee, setDraftAssignee] = useState<string | null>(null)
  const [draftBody, setDraftBody] = useState('')

  const [replyDraft, setReplyDraft] = useState('')
  const [isEditingBody, setIsEditingBody] = useState(false)
  const [editBodyDraft, setEditBodyDraft] = useState('')

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null

  const updateNotes = (updater: (prev: ReviewNote[]) => ReviewNote[]) => {
    setNotes((prev) => {
      const next = updater(prev)
      onSave(next)
      return next
    })
  }

  const openDrillIn = (target: Exclude<ReviewNotesView, 'list'>) => {
    setOpeningDrillIn(target)
    window.setTimeout(() => {
      setView(target)
      setOpeningDrillIn(null)
    }, SLIDE_MS)
  }

  const closeDrillIn = (after: () => void) => {
    setIsClosingDrillIn(true)
    window.setTimeout(() => {
      after()
      setIsClosingDrillIn(false)
      setHasReturnedFromDrillIn(true)
    }, SLIDE_MS)
  }

  const openCompose = () => {
    setDraftAssignee(null)
    setDraftBody('')
    openDrillIn('compose')
  }

  const backToList = () => closeDrillIn(() => setView('list'))

  const openDetail = (noteId: string) => {
    setActiveNoteId(noteId)
    setReplyDraft('')
    setIsEditingBody(false)
    openDrillIn('detail')
  }

  const handleComposeDone = () => {
    const id = nextNoteId()
    const note: ReviewNote = {
      id,
      authorName: CURRENT_USER_NAME,
      date: MOCK_ACTION_DATE,
      status: draftAssignee ? 'unresolved' : 'closed',
      assignedTo: draftAssignee,
      body: draftBody,
      replies: [],
    }
    updateNotes((prev) => [note, ...prev])
    setActiveNoteId(id)
    setReplyDraft('')
    setIsEditingBody(false)
    closeDrillIn(() => setView('detail'))
  }

  const toggleStatus = (noteId: string) => {
    updateNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, status: n.status === 'unresolved' ? 'closed' : 'unresolved' } : n)),
    )
  }

  const startEditBody = () => {
    if (!activeNote) return
    setEditBodyDraft(activeNote.body)
    setIsEditingBody(true)
  }

  const saveEditBody = () => {
    if (!activeNote) return
    updateNotes((prev) => prev.map((n) => (n.id === activeNote.id ? { ...n, body: editBodyDraft } : n)))
    setIsEditingBody(false)
  }

  const saveReply = () => {
    if (!activeNote || !replyDraft.trim()) return
    const reply = { id: nextReplyId(), authorName: CURRENT_USER_NAME, date: MOCK_ACTION_DATE, body: replyDraft }
    updateNotes((prev) => prev.map((n) => (n.id === activeNote.id ? { ...n, replies: [...n.replies, reply] } : n)))
    setReplyDraft('')
  }

  if (view === 'compose') {
    return (
      <SideDrawer show={show} onCancel={onCancel}>
        <SlideScreen key="compose" exiting={isClosingDrillIn}>
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-col gap-[16px] px-[24px] pt-[24px] pb-[16px] w-full shrink-0">
              <div className="flex gap-[16px] items-start w-full">
                <div className="flex-1 min-w-0">
                  <button type="button" className="flex gap-[4px] items-center mb-[12px]" onClick={backToList}>
                    <ChevronLeft className="size-[16px]" color="black" />
                    <span className="text-[11px] font-semibold text-black underline">Back</span>
                  </button>
                  <ReconciliationTitle title={header.title} />
                </div>
                <CloseButton onClick={onCancel} color="dark" size="md" />
              </div>
            </div>
            <div className="flex-1 overflow-auto px-[24px]">
              <div className="flex flex-col gap-[24px] items-start w-full pb-[24px]">
                <ReconciliationDescription header={header} />

                <div className="flex flex-col gap-[16px] w-full">
                  <div className="w-full">
                    <FormDropdownField
                      label="Assignee(s)"
                      placeholder="Select assignee"
                      options={NOTE_ASSIGNEE_OPTIONS}
                      value={draftAssignee}
                      onChange={setDraftAssignee}
                      icon={
                        <Avatar size="sm" fallback={draftAssignee ?? undefined} src={draftAssignee ? AVATAR_SRC_BY_NAME[draftAssignee] : undefined} />
                      }
                    />
                  </div>
                  <p className="text-[11px] text-[#adb2bb]">*Unassigned notes will default to closed status.</p>

                  <div className="w-full">
                    <TextArea
                      label="Note"
                      isRequired
                      placeholder="Add a note..."
                      value={draftBody}
                      onChange={setDraftBody}
                      styleOverrides={{ root: { width: '100%' }, textarea: { width: '100%', boxSizing: 'border-box' } }}
                    />
                  </div>
                </div>

                <div className="flex gap-[16px] items-center justify-end w-full">
                  <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={backToList}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!draftBody.trim()}
                    className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize hover:!border-[#6b7280] disabled:opacity-50 disabled:hover:!border-[#cbd2e1]"
                    onClick={handleComposeDone}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SlideScreen>
      </SideDrawer>
    )
  }

  if (view === 'detail' && activeNote) {
    return (
      <SideDrawer show={show} onCancel={onCancel}>
        <SlideScreen key="detail" exiting={isClosingDrillIn}>
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-col gap-[16px] px-[24px] pt-[24px] pb-[16px] w-full shrink-0">
              <div className="flex gap-[16px] items-start w-full">
                <div className="flex-1 min-w-0">
                  <button type="button" className="flex gap-[4px] items-center mb-[12px]" onClick={backToList}>
                    <ChevronLeft className="size-[16px]" color="black" />
                    <span className="text-[11px] font-semibold text-black underline">Back</span>
                  </button>
                  <ReconciliationTitle title={header.title} />
                </div>
                <IconButton size="md" onClick={() => {}}>
                  <MoreVert className="size-[20px]" />
                </IconButton>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-[24px]">
              <div className="flex flex-col gap-[16px] items-start w-full pb-[24px]">
                <ReconciliationDescription header={header} />

                <button
                  type="button"
                  className="rounded-[4px] hover:shadow-[inset_0_0_0_1px_#6b7280]"
                  onClick={() => toggleStatus(activeNote.id)}
                >
                  <TableStatusBadge color={activeNote.status === 'unresolved' ? 'warning' : 'success'} hasIcon={false}>
                    <span className="flex items-center gap-[2px]">
                      {activeNote.status === 'unresolved' ? 'Unresolved' : 'Closed'}
                      <ExpandMore className="size-[14px]" />
                    </span>
                  </TableStatusBadge>
                </button>

                <AssigneeRow label="Assigned to:" name={activeNote.assignedTo} />

                <div className="h-px w-full bg-[#e1e6ef]" />

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="text-[11px] text-[#6b7280]">Created by:</p>
                  <div className="flex items-start gap-[8px] w-full">
                    <Avatar size="sm" fallback={activeNote.authorName} src={AVATAR_SRC_BY_NAME[activeNote.authorName]} />
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[12px] font-semibold text-[#1d2433]">{activeNote.authorName}</span>
                        <span className="text-[11px] text-[#adb2bb]">{activeNote.date}</span>
                      </div>
                      {isEditingBody ? (
                        <div className="flex flex-col gap-[8px] w-full">
                          <TextArea
                            value={editBodyDraft}
                            onChange={setEditBodyDraft}
                            styleOverrides={{ root: { width: '100%' }, textarea: { width: '100%', boxSizing: 'border-box' } }}
                          />
                          <div className="flex gap-[12px] items-center justify-end w-full">
                            <button type="button" className="text-[12px] font-bold text-[#6b7280]" onClick={() => setIsEditingBody(false)}>
                              Cancel
                            </button>
                            <button type="button" className="text-[12px] font-bold text-[#1d2433]" onClick={saveEditBody}>
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[12px] text-[#1d2433]">{activeNote.body}</p>
                      )}
                    </div>
                    {!isEditingBody && (
                      <IconButton size="sm" onClick={startEditBody}>
                        <EditOutlined className="size-[16px]" />
                      </IconButton>
                    )}
                  </div>

                  {activeNote.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-[8px] w-full pl-[40px]">
                      <Avatar size="sm" fallback={reply.authorName} src={AVATAR_SRC_BY_NAME[reply.authorName]} />
                      <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[12px] font-semibold text-[#1d2433]">{reply.authorName}</span>
                          <span className="text-[11px] text-[#adb2bb]">{reply.date}</span>
                        </div>
                        <p className="text-[12px] text-[#1d2433]">{reply.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full">
                  <TextArea
                    placeholder="Leave a reply"
                    value={replyDraft}
                    onChange={setReplyDraft}
                    styleOverrides={{ root: { width: '100%' }, textarea: { width: '100%', boxSizing: 'border-box' } }}
                  />
                </div>
              </div>
            </div>
            {replyDraft.trim() && (
              <SideDrawer.Footer>
                <div className="flex-1" />
                <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={() => setReplyDraft('')}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize hover:!border-[#6b7280]"
                  onClick={saveReply}
                >
                  Save
                </button>
              </SideDrawer.Footer>
            )}
          </div>
        </SlideScreen>
      </SideDrawer>
    )
  }

  return (
    <SideDrawer show={show} onCancel={onCancel}>
      <SlideScreen key="list" exiting={openingDrillIn !== null} from="left" animateEnter={hasReturnedFromDrillIn}>
        <SideDrawer.Header>
          <ReconciliationTitle title={header.title} />
          <SideDrawer.TopRight>
            <CloseButton onClick={onCancel} color="dark" size="md" />
          </SideDrawer.TopRight>
        </SideDrawer.Header>
        <SideDrawer.Body>
          <div className="flex flex-col gap-[24px] w-full">
            <ReconciliationDescription header={header} />

            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex flex-col gap-[8px] w-full border-b border-solid border-[#e1e6ef] pb-[8px]">
                <div className="flex items-center gap-[8px] w-fit pb-[8px] border-b-2 border-solid border-[#186749]">
                  <span className="text-[12px] font-medium text-[#424867]">Review Notes</span>
                  {notes.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#1d2433] px-[4px] text-[10px] font-semibold text-white">
                      {notes.length}
                    </span>
                  )}
                </div>
              </div>

              {notes.length === 0 ? (
                <div className="flex flex-col gap-[16px] items-center py-[48px] w-full">
                  <p className="text-[12px] text-[#6b7280]">There are no review notes associated with this item.</p>
                  <Button color="primary" variant="filled" size="md" onClick={openCompose}>
                    Add Review Note
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  {notes.map((note) => (
                    <button
                      type="button"
                      key={note.id}
                      className="flex flex-col gap-[8px] items-start p-[12px] w-full text-left hover:bg-[#f8fafc] [border-bottom:1px_solid_#e1e6ef]"
                      onClick={() => openDetail(note.id)}
                    >
                      <div className="flex items-center gap-[8px] w-full">
                        <Avatar size="sm" fallback={note.authorName} src={AVATAR_SRC_BY_NAME[note.authorName]} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-semibold text-[#1d2433]">{note.authorName}</span>
                          <span className="text-[11px] text-[#adb2bb]">{note.date}</span>
                        </div>
                        <div className="flex-1" />
                        <TableStatusBadge color={note.status === 'unresolved' ? 'warning' : 'success'} hasIcon={false}>
                          {note.status === 'unresolved' ? 'Unresolved' : 'Closed'}
                        </TableStatusBadge>
                        <ChevronRight className="size-[16px]" color="#6b7280" />
                      </div>
                      <p className="text-[12px] text-[#1d2433] pl-[32px]">{note.body}</p>
                      {note.assignedTo && (
                        <div className="pl-[32px]">
                          <span className="text-[11px] text-[#6b7280] mr-[4px]">Assigned to:</span>
                          <Avatar size="sm" fallback={note.assignedTo} src={AVATAR_SRC_BY_NAME[note.assignedTo]} />
                        </div>
                      )}
                    </button>
                  ))}
                  <Button variant="ghost" color="dark" size="md" className="!w-full !justify-start" onClick={openCompose}>
                    <span className="flex items-center gap-[8px]">
                      <Add className="size-[20px]" color="#6b7280" />
                      Add Review Note
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SideDrawer.Body>
        {notes.length > 0 && (
          <SideDrawer.Footer>
            <div className="flex-1" />
            <Button variant="filled" color="primary" size="md" onClick={onCancel}>
              Close
            </Button>
          </SideDrawer.Footer>
        )}
      </SlideScreen>
    </SideDrawer>
  )
}
