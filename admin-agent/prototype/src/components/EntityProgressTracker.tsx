/**
 * EntityProgressTracker — sequential progress for the Create Entities journey,
 * a VIEW DERIVED from DrilldownPage's stage machine (no second source of truth).
 * Reuses FlowUI ProgressSteps (the ordered stepper). Four sections:
 * Entity > Mapping > Integrations > Users.
 */
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import ProgressSteps from '@floqastinc/flow-ui_core/ProgressSteps'

const SECTIONS = ['Entity', 'Mapping', 'Integrations', 'Users']

/** Internal stage → display-section index. Update HERE if stages change. */
const STAGE_SECTION: Record<string, number> = {
  gathering: 0,
  config: 0,
  docs: 1,
  clarify: 1,
  build: 1,
  mapping: 1,
  gl: 2,
  users: 3,
}

export function EntityProgressTracker({ stage, done }: { stage: string; done: boolean }) {
  const active = done ? SECTIONS.length : STAGE_SECTION[stage] ?? 0
  return (
    <div className="shrink-0 px-6 py-3 border-b border-[#e1e6ef]">
      <ProgressSteps activeStep={active} onStepChange={() => {}} orientation="horizontal">
        {SECTIONS.map((label, i) => (
          <ProgressSteps.Step key={label} status={i < active ? 'completed' : 'incomplete'}>
            <ProgressSteps.StepTitle>{label}</ProgressSteps.StepTitle>
          </ProgressSteps.Step>
        ))}
      </ProgressSteps>
    </div>
  )
}
