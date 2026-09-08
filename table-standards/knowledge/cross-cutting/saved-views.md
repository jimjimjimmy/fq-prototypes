# Cross-cutting — Saved Views & Presets

**Status:** ⚠️ STUB — demand captured, **not yet designed.** Applies to: P1, P3a, P3b

## The demand (real, from research)
- **Customers request saved / persistent views** — "worth aligning on a consistent pattern" (Minnie, Jul 1).
- **Reporting presets** — "Audit View," "Compact View," "Extended View" cards (AG Grid Optionality PRD).
- **Reporting custom/standard reports** — saved reports selectable from a sidebar tree, with a default landing view (`reporting-aiv`).
- **Recs Phase B** — custom Saved Views (US-018–021) explicitly deferred from Pass 1.

## Why it's a stub (defer the *design*)
We know the need and that presets exist; the actual pattern — scope, persistence, cross-surface behavior — isn't designed and touches product + eng. Capturing requirement + open questions now; solution later.

## Open questions to resolve before designing
- **Scope** — personal view vs. shared/team view vs. org "standard" view? (ties to `settings-governance.md`)
- **Persistence** — URL parameters vs. session-scoped store vs. stored server-side? (recs PRD raises exactly this)
- **Cross-surface consistency** — one saved-views pattern across Recs, Reporting, transactions, or per-surface?
- **Default landing view** — who sets it, can it be overridden?
- **Cascading** — do child reports inherit a parent's saved config? (Reporting says yes)
- **Relationship to presets** — are system presets (Audit/Compact/Extended) the same mechanism as user saved views, or distinct?

## Links
- Reporting Optionality PRD (Confluence 4430209556) · FDM Saved Views IPOD (4432560453)
- `../tiers/P1-filterable.md`, `../tiers/P3b-analytical.md`
