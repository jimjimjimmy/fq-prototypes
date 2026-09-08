import { useState, type ReactNode } from 'react'
import { Checkbox } from '@floqastinc/flow-ui_core'

// Uncontrolled wrapper around FlowUI's Checkbox. FlowUI requires
// onCheckedChange, but in a static prototype most checkboxes don't need
// shared state. This wrapper keeps its own local state so consumers can
// scatter checkboxes around without 30 useState calls.
interface UCheckboxProps {
  label: ReactNode
  sublabel?: ReactNode
  defaultChecked?: boolean
  disabled?: boolean
}

export function UCheckbox({ label, sublabel, defaultChecked = false, disabled }: UCheckboxProps) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(next) => setChecked(next === true)}
      label={label}
      sublabel={sublabel}
      disabled={disabled}
    />
  )
}
