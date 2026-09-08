/**
 * DrilldownPage — the subpage a CTA drills into.
 *
 * Layout: breadcrumb top-left, impacted-records AG Grid as the main body, and
 * the host-agent chat (prepopulated from the CTA) docked on the right.
 */
import { useState, useMemo } from 'react'
import { ImpactedRecordsGrid } from './ImpactedRecordsGrid'
import { UploadDocsScreen } from './UploadDocsScreen'
import { CreateUsersScreen } from './CreateUsersScreen'
import { CreateEntityScreen } from './CreateEntityScreen'
import { BuildProgressScreen } from './BuildProgressScreen'
import { MappingScreen } from './MappingScreen'
import { SuccessScreen } from './SuccessScreen'
import { AssistChat, type ChatSeed, type AnalysisResult } from './AssistChat'
import {
  makeEntityCandidate,
  submitEntities,
  EXISTING_GL_CONNECTIONS,
  type EntityCandidate,
  type EntityResult,
} from '../data/entityWorkflow'
import {
  buildEntityCaptureFlow,
  applyEntityAnswer,
  initialCapture,
  buildClarifyQuestions,
  ENTITY_CAPTURE_COMPLETE_MESSAGE,
  type EntityCapture,
} from './entityChatFlow'
import { ConnectProviderScreen, ERP_CONFIG } from './ConnectProviderScreen'
import { EntityProgressTracker } from './EntityProgressTracker'
import type { QuestionDef } from './AssistChat'

export function DrilldownPage({
  seed,
  onBack,
  onNavigate,
}: {
  seed: ChatSeed
  onBack: () => void
  /** Navigate to a different CTA's drilldown (e.g. a remaining setup step). */
  onNavigate?: (seed: ChatSeed) => void
}) {
  // Result of the upload screen's analysis, surfaced in the docked chat.
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  // Upload flow stages: questionnaire done → build progress → mapping → finalized success.
  const [building, setBuilding] = useState(false)
  const [mappingReady, setMappingReady] = useState(false)
  const [finalized, setFinalized] = useState(false)

  // Configured entities, derived from the analysis, for the mapping tabs.
  const entityNames =
    analysis?.groups
      .find((g) => /^Entities/.test(g.label))
      ?.items.map((it) => it.split(' — ')[0]) ?? []

  // Create Entities journey state (gated to view:'create-entity'). Shared by the
  // left panel and the right chat so both converge on one candidate list.
  const isCreateEntity = seed.view === 'create-entity'
  const [capture, setCapture] = useState<EntityCapture>(() => initialCapture())
  const [entityCandidates, setEntityCandidates] = useState<EntityCandidate[]>(() => [makeEntityCandidate()])
  const [configConfirmed, setConfigConfirmed] = useState(false)
  const [docsAnalyzed, setDocsAnalyzed] = useState(false)
  const [clarifyQuestions, setClarifyQuestions] = useState<QuestionDef[]>([])
  const [clarifyDone, setClarifyDone] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [mappingFinalized, setMappingFinalized] = useState(false)
  const [glConfirmed, setGlConfirmed] = useState(false)
  const [glConnectFor, setGlConnectFor] = useState<number | null>(null)
  const [entityResult, setEntityResult] = useState<EntityResult | null>(null)
  const entityFlow = useMemo(() => buildEntityCaptureFlow(), [])

  // Re-sequenced (restructure 4): gathering → config → docs → build → mapping → gl.
  // Stage is DERIVED from captured inputs + step completions (no desync flag).
  const gathered = capture.count > 0 && capture.decidedCount >= capture.count
  const entityStage: 'gathering' | 'config' | 'docs' | 'clarify' | 'build' | 'mapping' | 'gl' | 'users' = !gathered
    ? 'gathering'
    : !configConfirmed
      ? 'config'
      : !docsAnalyzed
        ? 'docs'
        : !clarifyDone
          ? 'clarify'
          : !buildComplete
            ? 'build'
            : !mappingFinalized
              ? 'mapping'
              : !glConfirmed
                ? 'gl'
                : 'users'
  const onEntityAnswer = (id: string, value: string | string[]) => {
    const r = applyEntityAnswer({ capture, candidates: entityCandidates }, id, value)
    setCapture(r.capture)
    setEntityCandidates(r.candidates)
    return r.next // AssistChat enqueues the per-entity follow-ups
  }

  // Back-one-step: reset the flag that gated entry to the current stage, landing on
  // the previous user-facing screen. Transient stages (gathering/clarify/build) and
  // the first step (config) have no back. mapping→docs keeps clarify/build done so
  // re-progressing skips straight back to mapping.
  const onStepBack: (() => void) | undefined =
    entityStage === 'docs'
      ? () => setConfigConfirmed(false)
      : entityStage === 'mapping'
        ? () => setDocsAnalyzed(false)
        : entityStage === 'gl'
          ? () => setMappingFinalized(false)
          : entityStage === 'users'
            ? () => setGlConfirmed(false)
            : undefined

  return (
    <div className="flex h-full min-h-0 bg-white">
      {/* Main: breadcrumb + stage content (or the reused Connect ERP picker). */}
      <div className="flex-1 min-w-0 flex flex-col">
        {isCreateEntity && glConnectFor !== null ? (
          // "Select new GL" embeds the reused Connect ERP picker here WITHOUT its
          // own chat — the entity chat on the right stays mounted, so the
          // conversation survives the round-trip. Tracker persists above it.
          <>
            <EntityProgressTracker stage={entityStage} done={!!entityResult} />
            <ConnectProviderScreen
              config={ERP_CONFIG}
              hideChat
              onBack={() => setGlConnectFor(null)}
              onContinue={() => setGlConnectFor(null)}
              onConnect={(provider) => {
                setEntityCandidates((prev) => prev.map((c, i) => (i === glConnectFor ? { ...c, glTarget: provider } : c)))
                setGlConnectFor(null)
              }}
            />
          </>
        ) : (
          <>
            <div className="shrink-0 px-6 py-3 border-b border-[#e1e6ef]">
              <nav className="flex items-center gap-1.5 text-[13px]" aria-label="Breadcrumb">
                <button onClick={onBack} className="font-medium text-[#1e8ae9] hover:underline">
                  Admin Agent
                </button>
                <span className="text-[#9ca3af]">›</span>
                <span className="font-semibold text-[#1d2433]">{seed.title}</span>
              </nav>
            </div>

            {isCreateEntity && <EntityProgressTracker stage={entityStage} done={!!entityResult} />}

            <div className="flex-1 min-h-0 flex flex-col p-6">
              {seed.view === 'create-entity' ? (
                <CreateEntityScreen
                  stage={entityStage}
                  candidates={entityCandidates}
                  onChange={setEntityCandidates}
                  existingConnections={EXISTING_GL_CONNECTIONS}
                  onConfigContinue={() => setConfigConfirmed(true)}
                  onDocsAnalyzed={() => {
                    setDocsAnalyzed(true)
                    // Build the clarifying set once — re-entering docs via Back must not re-inject.
                    setClarifyQuestions((prev) => (prev.length ? prev : buildClarifyQuestions(entityCandidates)))
                  }}
                  onBuildComplete={() => setBuildComplete(true)}
                  onMappingFinalize={() => setMappingFinalized(true)}
                  onSelectNewGl={(i) => setGlConnectFor(i)}
                  onGlContinue={() => setGlConfirmed(true)}
                  onStepBack={onStepBack}
                  result={entityResult}
                  onSubmit={(payload) => setEntityResult(submitEntities(payload))}
                />
              ) : seed.view === 'upload' ? (
                seed.uploadVariant === 'users' ? (
                  <CreateUsersScreen />
                ) : finalized ? (
                  <SuccessScreen onNavigate={(s) => onNavigate?.(s)} />
                ) : mappingReady ? (
                  <MappingScreen entities={entityNames} onFinalize={() => setFinalized(true)} />
                ) : building ? (
                  <BuildProgressScreen onComplete={() => setMappingReady(true)} />
                ) : (
                  <UploadDocsScreen onAnalyzed={setAnalysis} />
                )
              ) : (
                <>
                  <h2 className="shrink-0 text-[16px] font-semibold text-[#1d2433] mb-3">Impacted records</h2>
                  <div className="flex-1 min-h-0">
                    <ImpactedRecordsGrid recordSet={seed.recordSet} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: prepopulated host-agent chat */}
      <div className="w-[420px] shrink-0 border-l border-[#e1e6ef]">
        <AssistChat
          seed={seed}
          onClose={onBack}
          injectedAnalysis={isCreateEntity ? null : analysis}
          onFlowComplete={
            isCreateEntity
              ? () => {
                  // Fires after the capture loop (clarifyQuestions empty → no-op) and
                  // again after the injected clarifying batch → advance to build.
                  if (clarifyQuestions.length > 0 && !clarifyDone) setClarifyDone(true)
                }
              : () => setBuilding(true)
          }
          flow={isCreateEntity ? entityFlow : undefined}
          onAnswer={isCreateEntity ? onEntityAnswer : undefined}
          completeMessage={isCreateEntity ? ENTITY_CAPTURE_COMPLETE_MESSAGE : undefined}
          injectQuestions={isCreateEntity ? clarifyQuestions : undefined}
        />
      </div>
    </div>
  )
}
