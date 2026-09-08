import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Checkbox } from '@floqastinc/flow-ui_core'
import { UCheckbox } from './UCheckbox'

// A parent checkbox with a chevron toggle. Children are hidden by default
// and revealed when the chevron is clicked.
//
// Modes:
//   - Uncontrolled parent (default): UCheckbox manages its own state.
//   - Controlled parent: pass parentChecked + onParentChange.
//   - Disabled: the parent checkbox + chevron + indent children are all
//     dimmed and non-interactive. Use this when a workspace's required
//     product isn't selected.

interface ExpandableGroupProps {
  label: ReactNode
  defaultChecked?: boolean
  parentChecked?: boolean
  onParentChange?: (checked: boolean) => void
  defaultOpen?: boolean
  disabled?: boolean
  // When true, the group is rendered as expanded regardless of the internal
  // toggle state. Used by search filtering to surface matching children.
  forceOpen?: boolean
  children: ReactNode
}

export function ExpandableGroup({
  label,
  defaultChecked = false,
  parentChecked,
  onParentChange,
  defaultOpen = false,
  disabled = false,
  forceOpen = false,
  children,
}: ExpandableGroupProps) {
  const [open, setOpen] = useState(defaultOpen)
  const controlled = parentChecked !== undefined && onParentChange !== undefined
  const isOpen = open || forceOpen

  return (
    <div>
      <div className="rb-expandable-row">
        <button
          type="button"
          className="rb-chevron"
          onClick={() => setOpen((o) => !o)}
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {controlled ? (
          <Checkbox
            checked={parentChecked}
            onCheckedChange={(c) => onParentChange!(c === true)}
            label={label}
            disabled={disabled}
          />
        ) : (
          <UCheckbox label={label} defaultChecked={defaultChecked} disabled={disabled} />
        )}
      </div>
      {isOpen && <div className="rb-indent">{children}</div>}
    </div>
  )
}
