import type { ScenarioStepId } from '../types'

type KeywordPattern = {
  /** Regex matched against lowercased user input */
  match: RegExp
  /** Scenario step to advance to when matched */
  advanceTo: ScenarioStepId
}

/**
 * Lightweight keyword matching for free-text input. The scaffold doesn't
 * call an LLM — we just route common intents to existing scripted steps.
 * Unmatched input falls through to a generic helper response.
 */
export const KEYWORD_PATTERNS: KeywordPattern[] = [
  { match: /\b(connector|connection|sftp|source)\b/i, advanceTo: 'offer-create-connector' },
  { match: /\b(model|catalog|lineage)\b/i, advanceTo: 'offer-create-model' },
  { match: /\b(entity|entities|mapping)\b/i, advanceTo: 'offer-entity-mapping' },
  { match: /\b(field|transformation|transform)\b/i, advanceTo: 'offer-field-mapping' },
  { match: /\b(help|start|begin|how|what)\b/i, advanceTo: 'generic-help' },
]

export function matchKeyword(input: string): ScenarioStepId | null {
  const normalized = input.toLowerCase()
  for (const p of KEYWORD_PATTERNS) {
    if (p.match.test(normalized)) return p.advanceTo
  }
  return null
}
