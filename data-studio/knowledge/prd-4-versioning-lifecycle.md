# PRD 4: Versioning & Lifecycle

**Source:** [Confluence — 4 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
**Status:** DRAFT (rated "Good" by Natasha)
**Last updated:** Mar 10, 2026
**Owners:** Rebecca Beasley-Cockroft, Alex Kearns
**Target release:** 2026-06-30

---

## Summary

Covers post-publish lifecycle: creating new versions when mappings need to change, discarding drafts, archiving versions, monitoring pipeline execution. Models represent high-stakes financial data mappings — changes need a safe, auditable versioning system.

## Key Requirements (12 stories)

### Version Creation
- **V1:** Manual Draft from Active version (High) — copy config, assign version N+1
- **V2.1:** Draft from Archived version (Medium) — copy archived config as starting point
- **V2.2-V2.6:** Auto-create Draft on structural changes (High):
  - Source dataset added/removed
  - Custom field added/removed
  - Field mapping edited
- **V3:** Block second Draft (High) — one Draft at a time, warning with link to existing

### Version Lifecycle
- **V4:** Discard Draft (High) — confirmation dialog, permanent, Active unchanged
- **V5:** Delete Draft-only Model (Low) — scope TBD
- **V8:** Publish Draft (High) — set Effective Date, past date triggers pipeline re-run, Draft→Active, old Active→Archived
- **V9:** Autosave to Draft (High) — no Save button, "Saved"/"Saving..." indicator
- **V11:** Manual Archive (Low) — blocked if only Active version

### Viewing & Monitoring
- **V6:** Pipeline Run Logs (High) — status, timestamp, duration, error details, version-agnostic
- **V7:** Data Preview from Active (Medium) — read-only, reflects Active only (not Draft)
- **V10:** Version History (High) — all versions with metadata, navigate to any version
- **V12:** View Archived Field Mappings (Medium) — read-only access for audit

## Version States

| State | Description | Transitions |
|-------|-------------|-------------|
| Draft | Editable, not processing data. One per model. | → Active (publish) · → Deleted (discard) |
| Active | Live, processing data. One per model. | → Archived (new version published or manual) |
| Archived | Read-only, preserved for audit. | No further transitions |

## Design Implications

- **Field Mapping screen changes:**
  - Removed bottom buttons ("Create New Version", "Save Changes")
  - "Publish" moved from lower-right to top-right
  - Version dropdown below "Field Mapping" label (upper left)
  - Draft indicator next to version dropdown
  - "Changes will be saved automatically" notice (lower left)
- **Versions tab:** table of all versions with state, effective date, created by/date
- **Logs tab:** reverse-chronological pipeline runs with expandable error details
- **Auto-Draft creation** is implicit — structural changes auto-trigger Draft

## Key Assumptions
- Only one Draft per model at any time
- Only one Active per model at any time
- Opening a Model opens the most recent version (max version number)
- Changes autosaved to Draft; version incremented on creation not on each save
- Archived versions are read-only, cannot be re-activated (create new Draft from them instead)

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Active vs Draft opens by default when both exist? | Open |
| OQ-3 | Publish gated on valid mappings? | Open |
| OQ-4 | Past Effective Date: pipeline re-run behavior? | Open |
| OQ-5 | Autosave: server-side or client-side persistence? | Open |

## Gaps

| # | Gap | Impact |
|---|-----|--------|
| G1 | Discard Draft vs Delete unpublished Model not distinguished | Medium |
| G2 | No RBAC/permissions model defined | High |
| G3 | No error states for auto-trigger paths | High |
| G5 | Data refresh for past Effective Dates unspecified | High |

## References
- [Loom walkthrough from Rebecca](https://www.loom.com/share/82aae4d2abc84e649c33f99e0e5a9736)
- [Figma prototype](https://www.figma.com/make/fAX7tFsW9OKwD2dehgFZGd/Design-Image-Layout)
- [FloQast Help Center — Versioning](https://help.floqast.com/hc/en-us/articles/36159015960219-Versioning)
