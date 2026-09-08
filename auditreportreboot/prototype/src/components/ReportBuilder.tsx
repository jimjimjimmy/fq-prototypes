import { useCallback, useState } from 'react'
import Tooltip from '@floqastinc/flow-ui_core/Tooltip'
import { Button, Heading, Text } from '@floqastinc/flow-ui_core'
import { EventTypesStep, type EventTypeState } from './EventTypesStep'
import { DateRangeStep } from './DateRangeStep'
import { ScopeStep } from './ScopeStep'

// Sequential flow:
//   Step 1 (Event Types) is always interactive.
//   Step 2 (Date Range) is visible by default.
//   Step 3 (Scope) appears once any event type is selected, and is hidden
//     in the login-only path.
//   Download is enabled once an event type is selected AND — if the report
//     includes config or operational events — once at least one product and
//     one workspace have been selected. Login alone has no scope requirement,
//     but if login is selected alongside config/operational, the scope
//     requirement still applies (the other types need it). The disabled
//     state surfaces a tooltip explaining the reason on hover.

export function ReportBuilder() {
  const [eventTypes, setEventTypes] = useState<EventTypeState>({
    config: false,
    operational: false,
    login: false,
  })
  // Bubbled up from ScopeStep so the Download button can react to scope
  // completeness, not just event-type presence.
  const [scopeSelection, setScopeSelection] = useState({
    hasProducts: false,
    hasWorkspaces: false,
  })

  // Stable identity so ScopeStep's effect doesn't fire every render.
  const handleScopeSelectionChange = useCallback(
    (state: { hasProducts: boolean; hasWorkspaces: boolean }) => {
      setScopeSelection(state)
    },
    [],
  )

  const hasEventType = eventTypes.config || eventTypes.operational || eventTypes.login
  const loginOnly = eventTypes.login && !eventTypes.config && !eventTypes.operational
  const requiresScope = eventTypes.config || eventTypes.operational
  const scopeIncomplete =
    requiresScope && (!scopeSelection.hasProducts || !scopeSelection.hasWorkspaces)

  const downloadDisabled = !hasEventType || scopeIncomplete
  const disabledReason = !hasEventType
    ? 'Select an event type to download'
    : scopeIncomplete
      ? 'Select at least one product and one workspace to download'
      : undefined

  return (
    <section className="rb-section">
      <div className="rb-page-header">
        <Heading variant="h2">Audit Report</Heading>
        <Text color="subtitle">
          This report provides FloQast Admins with visibility into user activities, tracking who performed them.
        </Text>
      </div>

      <EventTypesStep eventTypes={eventTypes} onChange={setEventTypes} />
      <DateRangeStep />
      {hasEventType && !loginOnly && (
        <ScopeStep onSelectionChange={handleScopeSelectionChange} />
      )}

      <div className="rb-page-footer">
        <DownloadButtons disabled={downloadDisabled} disabledReason={disabledReason} />
      </div>
    </section>
  )
}

interface DownloadButtonsProps {
  disabled?: boolean
  disabledReason?: string
}

function DownloadButtons({ disabled, disabledReason }: DownloadButtonsProps) {
  const handleDownload = (_format: 'excel' | 'pdf') => {
    // Placeholder — wire to real download later.
  }

  // Disabled buttons don't fire hover events reliably across browsers, so when
  // disabled we wrap each Button in a span that the Tooltip can attach to.
  // Both buttons share the same disabled-reason copy.
  const wrap = (button: React.ReactNode, key: string) =>
    disabled && disabledReason ? (
      <Tooltip key={key}>
        <Tooltip.Trigger>
          <span style={{ display: 'inline-block' }}>{button}</span>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" size="sm">
          {disabledReason}
        </Tooltip.Content>
      </Tooltip>
    ) : (
      <span key={key} style={{ display: 'inline-block' }}>{button}</span>
    )

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {wrap(
        <Button
          variant="outlined"
          color="dark"
          onClick={() => handleDownload('pdf')}
          disabled={disabled}
        >
          Download as PDF
        </Button>,
        'pdf',
      )}
      {wrap(
        <Button onClick={() => handleDownload('excel')} disabled={disabled}>
          Download as Excel
        </Button>,
        'excel',
      )}
    </div>
  )
}
