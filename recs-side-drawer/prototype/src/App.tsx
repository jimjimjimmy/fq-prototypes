import { useState } from 'react'
import { Toaster } from '@floqastinc/flow-ui_core'
import { GlobalNavSidebar } from '@shared/components/GlobalNavSidebar/GlobalNavSidebar'
import { Navbar, TABS } from './components/Navbar'
import { Toolbar } from './components/Toolbar'
import { PageHeader } from './components/PageHeader'
import { WireframeTable } from './components/WireframeTable'
import { ChecklistPageHeader } from './components/ChecklistPageHeader'
import { ChecklistTable } from './components/ChecklistTable'
import { PageTransition } from './components/PageTransition'
import { AddGroupDrawer } from './components/drawers/AddGroupDrawer'
import { AddAccountDrawer } from './components/drawers/AddAccountDrawer'
import { AddTaskDrawer } from './components/drawers/AddTaskDrawer'
import { DocumentsDrawer } from './components/drawers/DocumentsDrawer'
import { ReviewNotesDrawer } from './components/drawers/ReviewNotesDrawer'
import {
  MOCK_GROUP_ROWS,
  MOCK_TASK_SETTINGS,
  MOCK_DOCUMENTS_SEED,
  MOCK_RECONCILIATION_HEADER,
  MOCK_REVIEW_NOTES_SEED,
  type ExistingGroupSettings,
  type DocumentFile,
  type ReviewNote,
} from './components/drawers/addGroupTypes'
import { usePostCreateFeedback } from './hooks/usePostCreateFeedback'

// How long the drawer's own close transition needs before it's safe to
// unmount - matches the drill-in slide's SLIDE_MS elsewhere in this build.
const DRAWER_CLOSE_MS = 300

// Only ever one drawer (hence one SideDrawer) mounted at a time - having two
// mounted simultaneously confuses FlowUI's SideDrawer positioning (observed:
// whichever mounted second rendered ~1700px off-screen, even while its own
// `show` was true and the other's was false). Each mode has its own
// "-closing" state so the drawer stays mounted just long enough to play its
// own close transition before actually unmounting.
type DrawerMode =
  | 'closed'
  | 'add-group'
  | 'add-group-closing'
  | 'view-group'
  | 'view-group-closing'
  | 'add-account'
  | 'add-account-closing'
  | 'add-task'
  | 'add-task-closing'
  | 'view-task'
  | 'view-task-closing'
  | 'documents'
  | 'documents-closing'
  | 'review-notes'
  | 'review-notes-closing'

type Page = 'reconciliations' | 'checklist'

const PAGE_TAB: Record<Page, string> = { reconciliations: 'Reconciliations', checklist: 'Checklist' }

function App() {
  // Only Checklist and Reconciliations have real pages behind them - the
  // other Navbar tabs (Dashboard, Folders, etc.) are decorative, matching
  // the rest of this prototype's wireframe-only scope.
  const [page, setPage] = useState<Page>('reconciliations')
  // Which side the next page should slide in from - derived from its
  // position in the Navbar's own tab order relative to the page being left,
  // so switching to a tab further right always enters from the right and
  // vice versa (see PageTransition).
  const [pageDirection, setPageDirection] = useState<'left' | 'right'>('right')
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('closed')
  const [viewSettings, setViewSettings] = useState<ExistingGroupSettings>(MOCK_GROUP_ROWS[0].settings)
  // Keyed by the row-key each table generates for itself (see WireframeTable/
  // ChecklistTable) - every row starts with zero documents except these 3
  // per table, seeded with MOCK_DOCUMENTS_SEED so the "has documents" badge
  // state is demonstrable without every single row showing it. Row keys
  // must match exactly what each table's own render loop generates.
  const [savedDocumentsByRowKey, setSavedDocumentsByRowKey] = useState<Record<string, DocumentFile[]>>({
    'recs-data-0': MOCK_DOCUMENTS_SEED,
    'recs-data-1': MOCK_DOCUMENTS_SEED,
    'recs-data-3': MOCK_DOCUMENTS_SEED,
    'checklist-data-0': MOCK_DOCUMENTS_SEED,
    'checklist-data-1': MOCK_DOCUMENTS_SEED,
    'checklist-data-2': MOCK_DOCUMENTS_SEED,
  })
  const [documentsRowKey, setDocumentsRowKey] = useState<string | null>(null)
  // Same 3 rows per table as the Documents seed above - these accounts are
  // the demo's "flagged" rows with both documents and review notes.
  const [savedReviewNotesByRowKey, setSavedReviewNotesByRowKey] = useState<Record<string, ReviewNote[]>>({
    'recs-data-0': MOCK_REVIEW_NOTES_SEED,
    'recs-data-1': MOCK_REVIEW_NOTES_SEED,
    'recs-data-3': MOCK_REVIEW_NOTES_SEED,
    'checklist-data-0': MOCK_REVIEW_NOTES_SEED,
    'checklist-data-1': MOCK_REVIEW_NOTES_SEED,
    'checklist-data-2': MOCK_REVIEW_NOTES_SEED,
  })
  const [reviewNotesRowKey, setReviewNotesRowKey] = useState<string | null>(null)

  const goToPage = (next: Page) => {
    if (next === page) return
    setPageDirection(TABS.indexOf(PAGE_TAB[next]) > TABS.indexOf(PAGE_TAB[page]) ? 'right' : 'left')
    setPage(next)
  }

  const recsFeedback = usePostCreateFeedback()
  const checklistFeedback = usePostCreateFeedback()

  const closeAddGroup = () => {
    setDrawerMode('add-group-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const closeViewGroup = () => {
    setDrawerMode('view-group-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const closeAddAccount = () => {
    setDrawerMode('add-account-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const closeAddTask = () => {
    setDrawerMode('add-task-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const closeViewTask = () => {
    setDrawerMode('view-task-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const closeDocuments = () => {
    setDrawerMode('documents-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const openDocuments = (rowKey: string) => {
    setDocumentsRowKey(rowKey)
    setDrawerMode('documents')
  }
  const closeReviewNotes = () => {
    setDrawerMode('review-notes-closing')
    window.setTimeout(() => setDrawerMode('closed'), DRAWER_CLOSE_MS)
  }
  const openReviewNotes = (rowKey: string) => {
    setReviewNotesRowKey(rowKey)
    setDrawerMode('review-notes')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Toaster />
      <GlobalNavSidebar activeApp="close" avatarFallback="U" />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Navbar
          activeTab={page === 'checklist' ? 'Checklist' : 'Reconciliations'}
          onSelectTab={(tab) => {
            if (tab === 'Checklist') goToPage('checklist')
            if (tab === 'Reconciliations') goToPage('reconciliations')
          }}
        />
        <Toolbar />
        <div className="flex-1 overflow-auto flex flex-col pt-[24px]">
          <PageTransition key={page} from={pageDirection}>
            {page === 'reconciliations' ? (
              <>
                <PageHeader
                  title="Reconciliations"
                  onAddGroup={() => setDrawerMode('add-group')}
                  onAddAccount={() => setDrawerMode('add-account')}
                />
                <div className="p-[24px]">
                  <WireframeTable
                    rowCount={8}
                    createdRows={recsFeedback.createdRows}
                    highlightRowId={recsFeedback.highlightRowId}
                    onHighlightDone={recsFeedback.clearHighlight}
                    onOpenSettings={(settings) => {
                      setViewSettings(settings)
                      setDrawerMode('view-group')
                    }}
                    onOpenDocuments={openDocuments}
                    documentCounts={Object.fromEntries(
                      Object.entries(savedDocumentsByRowKey).map(([key, docs]) => [key, docs.length]),
                    )}
                    defaultDocumentCount={0}
                    onOpenReviewNotes={openReviewNotes}
                    reviewNoteCounts={Object.fromEntries(
                      Object.entries(savedReviewNotesByRowKey).map(([key, notes]) => [key, notes.length]),
                    )}
                    defaultReviewNoteCount={0}
                  />
                </div>
              </>
            ) : (
              <>
                <ChecklistPageHeader onAddTask={() => setDrawerMode('add-task')} />
                <div className="p-[24px]">
                  <ChecklistTable
                    rowCount={7}
                    createdRows={checklistFeedback.createdRows}
                    highlightRowId={checklistFeedback.highlightRowId}
                    onHighlightDone={checklistFeedback.clearHighlight}
                    onOpenSettings={() => setDrawerMode('view-task')}
                    onOpenDocuments={openDocuments}
                    documentCounts={Object.fromEntries(
                      Object.entries(savedDocumentsByRowKey).map(([key, docs]) => [key, docs.length]),
                    )}
                    defaultDocumentCount={0}
                    onOpenReviewNotes={openReviewNotes}
                    reviewNoteCounts={Object.fromEntries(
                      Object.entries(savedReviewNotesByRowKey).map(([key, notes]) => [key, notes.length]),
                    )}
                    defaultReviewNoteCount={0}
                  />
                </div>
              </>
            )}
          </PageTransition>
        </div>
      </div>
      {(drawerMode === 'add-group' || drawerMode === 'add-group-closing') && (
        <AddGroupDrawer
          show={drawerMode === 'add-group'}
          onCancel={closeAddGroup}
          onCreated={(label) => recsFeedback.notifyCreated('Group added', label)}
        />
      )}
      {(drawerMode === 'view-group' || drawerMode === 'view-group-closing') && (
        <AddGroupDrawer show={drawerMode === 'view-group'} onCancel={closeViewGroup} initialData={viewSettings} />
      )}
      {(drawerMode === 'add-account' || drawerMode === 'add-account-closing') && (
        <AddAccountDrawer
          show={drawerMode === 'add-account'}
          onCancel={closeAddAccount}
          onCreated={(label) => recsFeedback.notifyCreated('Account added', label)}
        />
      )}
      {(drawerMode === 'add-task' || drawerMode === 'add-task-closing') && (
        <AddTaskDrawer
          show={drawerMode === 'add-task'}
          onCancel={closeAddTask}
          onCreated={(label) => checklistFeedback.notifyCreated('Task created', label)}
        />
      )}
      {(drawerMode === 'view-task' || drawerMode === 'view-task-closing') && (
        <AddTaskDrawer show={drawerMode === 'view-task'} onCancel={closeViewTask} initialData={MOCK_TASK_SETTINGS} />
      )}
      {(drawerMode === 'documents' || drawerMode === 'documents-closing') && documentsRowKey && (
        <DocumentsDrawer
          show={drawerMode === 'documents'}
          onCancel={closeDocuments}
          initialDocuments={savedDocumentsByRowKey[documentsRowKey] ?? []}
          onSave={(documents) =>
            setSavedDocumentsByRowKey((prev) => ({ ...prev, [documentsRowKey]: documents }))
          }
        />
      )}
      {(drawerMode === 'review-notes' || drawerMode === 'review-notes-closing') && reviewNotesRowKey && (
        <ReviewNotesDrawer
          show={drawerMode === 'review-notes'}
          onCancel={closeReviewNotes}
          header={MOCK_RECONCILIATION_HEADER}
          initialNotes={savedReviewNotesByRowKey[reviewNotesRowKey] ?? []}
          onSave={(notes) =>
            setSavedReviewNotesByRowKey((prev) => ({ ...prev, [reviewNotesRowKey]: notes }))
          }
        />
      )}
    </div>
  )
}

export default App
