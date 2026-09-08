import { useState } from 'react'
import { Toast, showToast } from '@floqastinc/flow-ui_core'
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle'

export interface CreatedRow {
  id: string
  label: string
}

// Post-create feedback for a table's "Add" drawer (create only, never edit):
// the new row always lands at the top of the list and pulses to show where
// it landed (see `row-created-pulse` in index.css - quick flash, holds at
// info-secondary for ~3s, fades back to normal), plus a plain success toast.
// No filter-awareness - simpler than the earlier version, which required
// clearing an active filter to reveal a hidden row.
export function usePostCreateFeedback() {
  const [createdRows, setCreatedRows] = useState<CreatedRow[]>([])
  const [highlightRowId, setHighlightRowId] = useState<string | null>(null)

  const notifyCreated = (toastMessage: string, label: string) => {
    const created: CreatedRow = { id: crypto.randomUUID(), label }
    setCreatedRows((prev) => [created, ...prev])
    setHighlightRowId(created.id)
    showToast(
      <Toast className="toast-slide-fade">
        <Toast.StatusIcon>
          <CheckCircle className="size-[20px]" color="var(--flo-sem-color-content-success-medium)" />
        </Toast.StatusIcon>
        {/* Toast.Title defaults to FlowUI's header font (Museo Sans) - this
            prototype uses Inter everywhere else, so it's overridden here to
            match rather than standing out as a different typeface. */}
        <Toast.Title style={{ fontFamily: "'Inter', sans-serif" }}>{toastMessage}</Toast.Title>
        <Toast.Close />
      </Toast>,
      { duration: 5600 },
    )
  }

  return {
    createdRows,
    highlightRowId,
    clearHighlight: () => setHighlightRowId(null),
    notifyCreated,
  }
}
