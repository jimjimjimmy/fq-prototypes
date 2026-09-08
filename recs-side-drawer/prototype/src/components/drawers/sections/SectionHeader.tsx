import { Button } from '@floqastinc/flow-ui_core'
import ChevronRight from '@floqastinc/flow-ui_icons/material/ChevronRight'

interface SectionHeaderProps {
  label: string
  isEditing?: boolean
  // "Edit" (no caret) means the trigger expands the section in place - used
  // for General Settings. "Manage"/"Configure" (with caret) mean it navigates
  // to a separate full-screen drill-in - used for Assignees, Dependency, and
  // Account Balance Filters at 2+ accounts. See side-drawer labeling spec.
  editLabel?: string
  editCaret?: boolean
  // Disables Done until a real edit has been made - prevents saving a no-op
  // when the section was only opened and closed without changing anything.
  doneDisabled?: boolean
  onEdit?: () => void
  onCancel?: () => void
  onDone?: () => void
}

export function SectionHeader({ label, isEditing, editLabel = 'Edit', editCaret, doneDisabled, onEdit, onCancel, onDone }: SectionHeaderProps) {
  return (
    <div className="flex gap-[8px] items-center w-full">
      <p className="flex-1 text-[#424867] text-[12px] leading-[18px] font-medium min-w-0 truncate">{label}</p>
      {isEditing ? (
        <div className="flex gap-[8px] items-center shrink-0">
          <Button
            color="dark"
            variant="ghost"
            size="sm"
            className="hover:!bg-[#f1f3f9] active:!bg-[#e1e6ef]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            color="dark"
            variant="outlined"
            size="sm"
            className="![border-width:1.4px] disabled:opacity-50"
            disabled={doneDisabled}
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      ) : (
        onEdit && (
          <Button
            color="dark"
            variant="ghost"
            size="sm"
            className="hover:!bg-[#f1f3f9] active:!bg-[#e1e6ef]"
            onClick={onEdit}
          >
            <span className="flex items-center gap-[2px]">
              {editLabel}
              {editCaret && <ChevronRight className="size-[16px]" />}
            </span>
          </Button>
        )
      )}
    </div>
  )
}
