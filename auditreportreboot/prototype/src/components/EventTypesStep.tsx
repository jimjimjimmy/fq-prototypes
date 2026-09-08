import { Checkbox, Heading } from '@floqastinc/flow-ui_core'

// Step 1 — Event Types: Configurational / Operational / Login.
//
// Login Events lives here (not in Scope) because it's an event *type*, not a
// scope. Per Gaurav's 5.27 sync, selecting only Login Events skips the Scope
// step entirely.

export interface EventTypeState {
  config: boolean
  operational: boolean
  login: boolean
}

interface EventTypesStepProps {
  eventTypes: EventTypeState
  onChange: (next: EventTypeState) => void
}

const CONFIG_SUB =
  'An action that can typically only be performed by an Admin, Sys Admin, or Manager. Most configurational events occur within Admin Settings and represent changes to system setup, user permissions, or TLC-wide configuration.'

const OPERATIONAL_SUB =
  'An action performed by an Advanced User or above during the normal use of the application. These events capture the day-to-day work performed within a product (e.g., signing off a checklist item, leaving/responding to review notes, uploading supporting documentation).'

const LOGIN_SUB =
  "Sign-in and sign-out activity across FloQast. Login events aren't tied to any single product. Selecting only this option skips the Scope step and produces a login-only report."

export function EventTypesStep({ eventTypes, onChange }: EventTypesStepProps) {
  const allChecked = eventTypes.config && eventTypes.operational && eventTypes.login

  return (
    <section className="rb-step" id="step-1">
      <header className="rb-step-header">
        <Heading variant="body-base">Select Event Types</Heading>
      </header>

      <div className="rb-step-body rb-stack">
        <Checkbox
          checked={allChecked}
          onCheckedChange={() =>
            onChange({ config: !allChecked, operational: !allChecked, login: !allChecked })
          }
          label="Select All"
        />

        <Checkbox
          checked={eventTypes.config}
          onCheckedChange={(checked) => onChange({ ...eventTypes, config: checked === true })}
          label="Configurational Events"
          sublabel={CONFIG_SUB}
        />

        <Checkbox
          checked={eventTypes.operational}
          onCheckedChange={(checked) => onChange({ ...eventTypes, operational: checked === true })}
          label="Operational Events"
          sublabel={OPERATIONAL_SUB}
        />

        <Checkbox
          checked={eventTypes.login}
          onCheckedChange={(checked) => onChange({ ...eventTypes, login: checked === true })}
          label="Login Events"
          sublabel={LOGIN_SUB}
        />
      </div>
    </section>
  )
}
