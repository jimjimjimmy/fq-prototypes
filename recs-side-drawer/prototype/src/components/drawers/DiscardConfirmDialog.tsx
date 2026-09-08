import { Dialog } from '@floqastinc/flow-ui_core'

interface DiscardConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
}

// Shared across every drawer view - the main form AND every drill-in screen
// (Assignees, Dependency, Account Balance Filters) - so clicking the
// backdrop overlay while on a drill-in gets the same unsaved-changes guard
// as the main view, instead of silently discarding or doing nothing.
export function DiscardConfirmDialog({ open, onOpenChange, onDiscard }: DiscardConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="sm" type="warning">
      <Dialog.Header>Discard unsaved changes?</Dialog.Header>
      <Dialog.Body>You have unsaved changes that will be lost if you close this panel.</Dialog.Body>
      <Dialog.Footer>
        <Dialog.FooterCancelBtn onClick={() => onOpenChange(false)}>Keep Editing</Dialog.FooterCancelBtn>
        <Dialog.FooterActionBtn
          onClick={() => {
            onOpenChange(false)
            onDiscard()
          }}
        >
          Discard Changes
        </Dialog.FooterActionBtn>
      </Dialog.Footer>
    </Dialog>
  )
}
