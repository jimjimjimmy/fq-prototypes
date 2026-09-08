# Unmapped Entity Identification (DRAFT)

| Field                 | Value                                                                                                                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Status**            | DRAFT                                                                                                                                                                                                                                                                              |
| **Last updated**      | 2026-06-02                                                                                                                                                                                                                                                                         |
| **Owner**             | Alex Kearns                                                                                                                                                                                                                                                                        |
| **Target release**    | 2026-09-30                                                                                                                                                                                                                                                                         |
| **Epic**              | *(link to epic)*                                                                                                                                                                                                                                                                   |
| **Idea Link**         | [IDEA-2618](https://floqast.atlassian.net/browse/IDEA-2618)                                                                                                                                                                                                                        |
| **Document status**   | DRAFT                                                                                                                                                                                                                                                                              |
| **Document owner**    | @Alex Kearns                                                                                                                                                                                                                                                                       |
| **Designer**          | Natasha Clark · Kristin Johnson                                                                                                                                                                                                                                                    |
| **Tech lead**         | *(assign)*                                                                                                                                                                                                                                                                         |
| **Technical writers** | *(assign)*                                                                                                                                                                                                                                                                         |
| **QA**                | *(assign)*                                                                                                                                                                                                                                                                         |
| **Depends on**        | **Entity Mapping v2** — owns config-time pattern setup + source-value→FQ-entity mapping *and* the runtime handling of unmapped values (AC-EM4-06/07), which this PRD builds on. This PRD is the run-time lifecycle that sits on top of it. Run-side detection hook from the ingestion pipeline. |
| **Related sub-PRDs**  | [Entity Mapping v2](prd-entity-mapping.md) · [Logging & Audit](prd-logging-audit.md) · [Notifications](prd-notifications.md) · [Entity Configuration](prd-entity-configuration.md)                                                                                                 |

---

## Objective

Give admins a reliable, low-noise way to **discover and review unmapped entities over time** — once a connector is live and ingesting — so they don't silently slip through and the entity mapping stays trustworthy without constant manual auditing. The signal arrives from two directions:

- **Data-driven** — a *value* appears in run data with no existing mapping: an **unmapped entity** (UEI1).
- **Config-driven** — a new *entity is added to the TLC's entity list*, which connectors that previously **covered every entity** won't pick up on their own (there's no "all entities" flag — "select all" is just a snapshot). UEI7 highlights those connectors for review; the trigger is Entity Mapping v2's AC-EM4-09.

In both cases the core V1 value is **proactively telling the admin an entity is unmapped** — so data arriving without an entity mapping (effectively missing for that entity) gets noticed and resolved, instead of slipping by until a downstream consumer comes up short. The current system doesn't surface unmapped entities proactively, and that gap is a recurring customer painpoint.

This PRD owns the **post-publish lifecycle** of entities: detecting unmapped entities at *run* time, letting values flow through on the connector's configured default (never blocking ingestion), surfacing them for **post-hoc review** (confirm / label, merge, or suppress), and highlighting when a newly-created TLC entity should be considered for existing complete-coverage connectors. It is deliberately distinct from **Entity Mapping v2**, which owns config-time pattern setup and source-value mapping. The two hand off to each other but are sized as separate items. *(A more advanced **coverage / drop-off** signal — flagging when an entity that normally has data goes dark — is a valuable post-Q3 extension; see Future Considerations.)*

---

## Background

### The lifecycle split

| Phase | Owner | What it covers |
|---|---|---|
| **Config time** | Entity Mapping v2 | How a source encodes entity (the ten patterns), source-value → FQ-entity mapping, the connector-level default + per-source override |
| **Run time (this PRD)** | Unmapped Entity Identification | What happens when an entity value appears in a run with no existing mapping, after a connector is live — detect, let it flow through, surface for review |

### Today's gap

Once a model is live, there is no proactive run-time surface for entity values that arrive without a mapping. They either land `NULL` (invisible until a downstream consumer breaks) or are buried in run logs that nobody reviews — so an admin can be **missing data for an entity without realizing it's unmapped**. There is also no way to say "this value is known-and-intentional, stop telling me about it," so any signal we do surface becomes noise. Proactively flagging unmapped entities is the core gap this PRD closes.

### Framing shift (2026-05-15, AK + RBC dim decisions)

The 2026-05-15 discussion changed this item's model from **"detect → gate → user maps or suppresses"** to **"flow through → post-hoc review."** A new value flows through immediately on the connector's configured default (per Entity Mapping v2 AC-EM4-06 — which may be Shared/Global `[]` or NULL); the admin reviews what arrived *after the fact* rather than data being held until they act. This PRD is written on the flow-through framing; the original gate-first framing in the brainstorm is superseded. *(The dimensions discussion explored a stronger never-NULL auto-insert; for entity, this PRD defers to Entity Mapping v2's NULL-allowed default — see UEI2.)* See `q3/dimensions/brainstorm.md`.

---

## Definitions

- **TLC (Top Level Client)** — the tenant / top-level customer; the scope the FQ entity list belongs to (an entity is a member of the TLC's entity list).
- **Unmapped entity** — an entity value observed in a run (a value in the entity column, or an extracted substring per the Entity Mapping v2 patterns) that has **no existing mapping** in the connector's entity config (or its source-dataset override). *(Distinct from a genuinely **new TLC entity** — one added to the TLC's entity list — which is the config-driven case in UEI7.)*
- **Flow-through** — an unmapped value does **not** block ingestion: the record takes the connector's configured default for unmapped values (Shared/Global `[]` or NULL, per Entity Mapping v2 AC-EM4-06), and the value is captured for review in Unmapped Entities. This PRD does not introduce a new `fq_entity` state; it builds on Entity Mapping v2's runtime default behavior.
- **Post-hoc review** — review that happens *after* data has flowed through, not as a gate before it. The admin confirms / labels, merges, or suppresses each unmapped entity.
- **Unmapped Entities** — the proactive surface listing the unmapped entities detected over recent runs, framed as "here's what we found — review it," not "act before data moves." 
- **Suppression list** — a list of specific values the admin has marked as known-and-intentional (test records, legacy codes, placeholders) so they are **not re-surfaced** in Unmapped Entities. Held at the **connector level by default, with per-source-dataset override** — mirroring where the entity mapping config lives (Entity Mapping v2), so the admin sets it once and overrides only where a source dataset differs. Re-fires only on genuinely new values.

---

## Why This Is Important

- **Trust in entity tagging** — entity is foundational to Close reconciliation scoping and Reporting; silently dropping unmapped entities erodes that trust.
- **Ingestion never blocks** — an unmapped value flows through on the connector's configured default and is surfaced for review, rather than halting the run or being lost.
- **Noise control is the gating factor** — proactive surfacing is only useful if the admin can tune it. Per-value suppression is what makes the alert actionable rather than ignorable; that's why it moves into Q3 from its original post-Q3 slot.

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **Unmapped entities are discoverable, not invisible** | Values that arrive post-launch surface in **Unmapped Entities** instead of landing NULL or hiding in run logs |
| **Data keeps flowing** | An unmapped value never blocks ingestion — it flows through on the connector's configured default (per Entity Mapping v2) and is surfaced for review |
| **Tunable signal** | Per-value suppression lets admins silence known-and-intentional values so Unmapped Entities stays trustworthy |
| **Starts from a confident default** | The surface leads with "we found N unmapped entities — confirm these" rather than a blank "review unmapped values" prompt (per the AI starting-point principle) |
| **Know when an entity is unmapped** | Proactively tells the admin when data is arriving unmapped — so they realize an entity is effectively missing its data, instead of finding out when a Close recon or report comes up short. Not surfaced proactively in the current system; a recurring customer painpoint |

---

## Use Cases

| #   | Persona              | Scenario                                                                                                                                                     | Expected outcome                                                                                                                                                    |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UC1 | Admin                | A run brings in a new entity code that was never mapped                                                                                                      | The record flows through on the connector's configured default (ingestion isn't blocked), and the value appears in **Unmapped Entities** with a proactive indicator |
| UC2 | Admin                | Reviews Unmapped Entities and confirms the new value is a real entity                                                                                        | One click deep-links into the Entity Mapping v2 config with the value pre-surfaced; admin maps it to an FQ entity                                                   |
| UC3 | Admin                | Reviews Unmapped Entities and recognizes the value as a variant/alias of an existing entity                                                                  | Admin merges the candidate into the existing entity; future occurrences map there automatically                                                                     |
| UC4 | Admin                | A test record / placeholder value keeps appearing and isn't a real entity                                                                                    | Admin suppresses the value; it stops appearing in Unmapped Entities and stops firing the proactive indicator; genuinely new values still surface                    |
| UC5 | Controller / Auditor | Wants to know what unmapped entity values appeared on a connector or source dataset and when                                                                 | Unmapped Entities + the audit log show each detected value, its first-seen run, and the disposition (confirmed / merged / suppressed / still pending)               |
| UC6 | Admin / Controller   | A live model is quietly ingesting rows whose entity value isn't mapped — the admin isn't actively auditing and doesn't realize an entity is missing its data | The proactive surface flags "N unmapped entity values" without the admin going looking; they review and map them before Close or Reporting comes up short           |

---

## Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Unmapped entities don't go unnoticed | % of unmapped entities reviewed (confirmed / merged / suppressed) within N days of first appearance | N/A | 80%+ |
| Signal stays low-noise | Median # of unresolved items in Unmapped Entities per active connector | N/A | < 5 |
| No silent NULLs | % of runs that produce a NULL entity tag for a *mappable* row | (today: unknown) | ~0% |
| Unmapped entities surfaced proactively | % of unmapped-entity situations the admin acts on *before* a downstream consumer reports a gap | (today: 0% — not surfaced) | 80%+ |

---

## Assumptions

- **Entity Mapping v2 is the config surface.** This PRD assumes the entity column / pattern is already configured in Entity Mapping v2; "unmapped entity" is defined relative to that config.
- **Flow-through + post-hoc review is the resolved direction** (per the 2026-05-15 reframe) — unmapped values are not gated; they flow through on Entity Mapping v2's configured default (AC-EM4-06/07) and are reviewed after the fact. This PRD does not re-litigate the gate-first model, and defers to Entity Mapping v2 on whether the default is `[]` or NULL.
- **The ingestion pipeline can emit a run-side "new candidate" signal** — i.e., per run, the set of entity-column values with no existing mapping. *(Feasibility / hook ownership — see Gaps.)*
- **Suppression and review state follow the entity-mapping config granularity** — connector level by default, with per-source-dataset override (per Entity Mapping v2). **Not per-model** — entities aren't mapped at the model.
- **Creating / renaming / archiving TLC entities is out of scope** (TLC-level admin function, per Entity Mapping v2). This PRD surfaces candidates and hands off; it does not mint entities — unmapped values take Entity Mapping v2's configured default until the admin maps them (see UEI2).

---

## Scope

### In scope (V1)

- **Run-time detection of unmapped entities** — per run, identify entity values with no existing mapping (**UEI1**).
- **Flow-through + capture** — unmapped values take Entity Mapping v2's configured default (never blocking ingestion) and are captured for review (**UEI2**).
- **Unmapped Entities surface** — post-hoc surface to confirm/label, merge, or suppress (**UEI3**).
- **Per-value suppression list** — silence known-and-intentional values, at connector / source-dataset level (**UEI4**).
- **Proactive surface** — a counter / badge / CTA so the admin notices (placement per OQ-UE1) (**UEI5**).
- **Handoff to Entity Mapping config** — "map / label this value" deep-links into Entity Mapping v2 with the value pre-surfaced (**UEI6**).
- **New-TLC-entity highlight** — when a new entity is added to the TLC, highlight connectors that previously had complete entity coverage so the admin can decide whether to include it (**UEI7**; derived rule, no flag; coordinates with AC-EM4-09).

### Out of scope (post-Q3)

- Full **Gap Insights** resolution-path picker
- **"Suppress all"** global off-switch
- **Cross-model** suppression-list reuse
- **AI-assisted mapping suggestions** for unmapped entity values (overlaps the AI-assisted mapping item)
- **TLC entity creation / management** (owned elsewhere; this PRD hands off)
- **Coverage / missing-data detection** — proactively flagging that an entity *should* have data but doesn't. Three signals, all post-Q3 (see Future Considerations): (a) **drop-off** (an entity that had data in prior runs but none in the latest), (b) **mapped-but-never-arrived**, (c) **zero-coverage entities**. All require an explicit notion of "expected" (run history, mapping state, or TLC coverage) and careful cadence handling, which is why V1 ships only the simpler "notify of unmapped entities" and defers coverage detection.

---

## Requirements Quick Reference

| ID      | Requirement                                                                                                                       | Priority | Status             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------ |
| UEI1-LC | Run-time detection of new (unmapped) entity candidates per run                                                                    | High     | Drafted 2026-06-02 |
| UEI2-LC | Flow-through + capture: unmapped values take the configured default (never block ingestion) and are captured for review            | High     | Drafted 2026-06-02 |
| UEI3-LC | Unmapped Entities surface — confirm/label · merge · suppress                                                                      | High     | Drafted 2026-06-02 |
| UEI4-LC | Per-value suppression list (connector / source-dataset level), re-fires only on genuinely new values                              | High     | Drafted 2026-06-02 |
| UEI5-LC | Proactive surface (counter / badge / CTA) — placement TBD (OQ-UE1)                                                                | Medium   | Drafted 2026-06-02 |
| UEI6-LC | Handoff to Entity Mapping v2 config with the value pre-surfaced                                                                   | Medium   | Drafted 2026-06-02 |
| UEI7-LC | New TLC entity → highlight connectors with prior complete coverage for review (derived rule, no flag; coordinates with AC-EM4-09) | Medium   | Drafted 2026-06-02 |

---

## Detailed Requirements

### UEI1-LC — Run-time detection of unmapped entities

**User Story:** As an admin, I want the system to notice entity values that arrive in a run with no existing mapping, so unmapped entities are caught when they appear rather than discovered when something downstream breaks.

**Importance:** High

**Details:** Detection is at **run time**, not config time. For each run, the system compares the entity values produced by the source (entity-column values, or substrings extracted per the Entity Mapping v2 patterns) against the connector's existing entity mapping (or its source-dataset override), and outputs the set of values with no mapping — the "new candidates" for that run.

**Acceptance Criteria:**

- **AC-UEI1-01** — Given a live model whose source connector has an entity mapping configured (per Entity Mapping v2), when a run produces an entity value that has no existing mapping, then that value is recorded as an unmapped entity for that run.
- **AC-UEI1-02** — Given a value already mapped, on the suppression list, or already a known candidate, when it appears in a run, then it is **not** re-flagged as new.
- **AC-UEI1-03** — Given detection runs, when candidates are found, then each carries: the raw value, the source dataset / column it came from, the first-seen run, and a count of affected records.

---

### UEI2-LC — Flow-through and capture

**User Story:** As an admin, I don't want an unmapped entity value to block ingestion while I catch up on review — I want the data to flow through and the value captured so I can resolve it after the fact.

**Importance:** High

**Details:** An unmapped value does **not** block ingestion. The record takes the connector's **configured default for unmapped values** — Shared/Global `[]` or NULL, per Entity Mapping v2 (AC-EM4-06/07) — and the value is **captured for post-hoc review** in Unmapped Entities (UEI3). This PRD introduces **no new `fq_entity` state**; it builds on Entity Mapping v2's runtime default behavior and adds the dedicated review surface, suppression list, and proactive indicator on top. *(Whether records that took the default get re-tagged once the value is mapped is the reconciliation question — see OQ-UE5.)*

**Acceptance Criteria:**

- **AC-UEI2-01** — Given an unmapped value in a run, when the record is ingested, then ingestion is not blocked and the record takes the connector's configured default for unmapped values (`[]` or NULL, per Entity Mapping v2 AC-EM4-06).
- **AC-UEI2-02** — Given an unmapped value is detected in a run, when the run completes, then the value is captured in Unmapped Entities (UEI3) for review — regardless of which default its records took.
- **AC-UEI2-03** — Given a value is later confirmed or merged (UEI3 → UEI6), when the new mapping is saved, then records ingested on the default are re-tagged per Entity Mapping v2's `entity_start_time` / backfill model (see OQ-UE5).

---

### UEI3-LC — Unmapped Entities surface

**User Story:** As an admin, I want a single place that shows the unmapped entity values detected in recent runs and lets me resolve each one, so I can keep the mapping clean without auditing every run by hand.

**Importance:** High

**Details:** **Unmapped Entities** is a post-hoc surface listing the unmapped entities detected over recent runs. Per the AI starting-point principle, it leads with a confident framing ("We found 7 unmapped entities — confirm these are entities to map") rather than a blank prompt. Each item offers three dispositions:

- **Confirm / label** — it's a real new entity → hand off to Entity Mapping config (UEI6) to map it
- **Merge** — it's a variant / alias of an existing entity → fold it in; future occurrences map there
- **Suppress** — it's not a real entity (test record, placeholder, legacy code) → add to the suppression list (UEI4)

**Acceptance Criteria:**

- **AC-UEI3-01** — Given unmapped entities exist, when I open the review surface, then I see each candidate with its raw value, source, first-seen run, and affected-record count, ordered most-recent-first.
- **AC-UEI3-02** — Given a candidate, when I choose Confirm / label, then I'm taken into the Entity Mapping config (UEI6) with the value pre-surfaced.
- **AC-UEI3-03** — Given a candidate, when I choose Merge, then I pick an existing entity and the candidate's records are reconciled to it (per OQ-UE5).
- **AC-UEI3-04** — Given a candidate, when I choose Suppress, then it is added to the suppression list (UEI4) and removed from Unmapped Entities.
- **AC-UEI3-05** — Given I resolve a candidate, when the disposition is saved, then it is recorded in the audit log (value, disposition, admin, timestamp) — coordinates with Logging & Audit.

---

### UEI4-LC — Per-value suppression list

**User Story:** As an admin, I want to mark specific values as known-and-intentional so they stop showing up in Unmapped Entities, so it only ever shows things genuinely worth my attention.

**Importance:** High

**Details:** A list of values the admin has chosen not to be surfaced (test records, legacy codes, placeholders), held at the **connector level by default with per-source-dataset override** — the same granularity as the entity-mapping config it relates to (per Entity Mapping v2), so the admin manages it once at the connector and only drills into a source dataset where that source differs. Suppressed values still flow through (they still take the configured default); they just don't appear in Unmapped Entities or fire the proactive indicator. The list re-fires only on **genuinely new** values, never on already-suppressed ones.

**Acceptance Criteria:**

- **AC-UEI4-01** — Given a candidate, when I suppress it, then it is added to the suppression list at the connector level (or the source-dataset override, matching where that source's entity config lives) and no longer appears in Unmapped Entities.
- **AC-UEI4-02** — Given a suppressed value, when it appears in future runs, then it does not re-fire the proactive surface or re-enter Unmapped Entities.
- **AC-UEI4-03** — Given a suppression list, when I view it, then I can see and **un-suppress** entries (a suppressed value should be recoverable).
- **AC-UEI4-04** — Suppression granularity **mirrors the entity-mapping config: connector level by default, with per-source-dataset override** (consistent with Entity Mapping v2 — resolves OQ-UE2). It is **not** per-model.

---

### UEI5-LC — Proactive surface

**User Story:** As an admin, I want a visible signal that there are unmapped entities to review, so I notice them without having to go looking in run logs.

**Importance:** Medium

**Details:** A proactive indicator — a counter / badge on the Entity Mapping surface, a CTA on the run summary, a notification, or some combination (placement is **OQ-UE1**, to resolve with Benjamin Ellis). Complements the passive run-summary expansion owned by Logging (e.g., "33 records skipped — missing vendor ID"); this is the *active* surface. May include a Notifications trigger — coordinate with the Notifications PRD.

**Acceptance Criteria:**

- **AC-UEI5-01** — Given unresolved unmapped entities exist for a model, when the admin is in the relevant surface (placement per OQ-UE1), then a proactive indicator shows the count of unresolved candidates.
- **AC-UEI5-02** — Given the indicator, when the admin acts on it, then they are taken to Unmapped Entities (UEI3).
- **AC-UEI5-03** — Fire behavior (every run that produces new members vs only when the count changes; visible alert vs running tally) is resolved in **OQ-UE3**.

---

### UEI6-LC — Handoff to Entity Mapping config

**User Story:** As an admin mapping an unmapped entity, I want to be dropped into the mapping config with the value already in front of me, so I don't have to re-find it.

**Importance:** Medium

**Details:** "Map / label this value" deep-links into the Entity Mapping v2 config surface with the candidate value pre-surfaced in the source-value → FQ-entity mapping step. This is the seam between run-time discovery (this PRD) and config-time mapping (Entity Mapping v2).

**Acceptance Criteria:**

- **AC-UEI6-01** — Given a candidate I choose to map, when I trigger the handoff, then the Entity Mapping config opens with the value pre-populated in the source-value mapping step.
- **AC-UEI6-02** — Given I complete the mapping in Entity Mapping v2 and save, when I return, then the candidate is resolved in Unmapped Entities and records ingested on the default are re-tagged to the new mapping (per OQ-UE5).

---

### UEI7-LC — New TLC entity → highlight affected "all entities" connectors

**User Story:** As an admin, when a new entity is added to the TLC's entity list, I want to see which existing connectors are set to "all entities" so I can decide whether the new entity belongs in their scope — instead of it silently never being picked up.

**Importance:** Medium *(coordinate ownership with Entity Mapping v2 AC-EM4-09 — see OQ-UE7)*

**Details:** This is the **config-driven** counterpart to UEI1's data-driven detection. There is **no stored "all entities" flag** — Entity Mapping v2 decided that "select all" is simply a snapshot of the then-current entities, not a persisted flag. So UEI7 identifies the affected connectors by a **derived rule: connectors whose entity scope covered *every* entity that existed before the new one was added** ("complete coverage"). When a new entity is created, those connectors are now complete-minus-one — exactly the ones whose intent was "everything." UEI7 highlights the event: *"A new entity ([name]) was added — N connectors previously covered all entities. Review whether to include it."* The admin adds the new entity to a connector's scope (handoff to Entity Mapping v2 config per UEI6) or dismisses.

The **notification trigger** for "new TLC entity added" is defined in Entity Mapping v2 (AC-EM4-09, which uses the same complete-coverage rule); UEI7 owns the **surface + review** in the lifecycle. The ownership split is OQ-UE7 — the two PRDs must not duplicate the mechanism.

**Acceptance Criteria:**

- **AC-UEI7-01** — Given a new entity is added to the TLC, when one or more connectors had **complete coverage** of the entity list before the addition (derived by set comparison against the full list — no stored flag), then the admin is surfaced those connectors with a prompt to review whether to include the new entity.
- **AC-UEI7-02** — Given the prompt, when I choose to include the new entity for a connector, then I'm handed off to that connector's Entity Mapping config (per UEI6) with the new entity pre-surfaced for addition to scope.
- **AC-UEI7-03** — Given the prompt, when I dismiss it for a connector, then that connector's snapshot is unchanged and the prompt does not re-fire for that entity / connector pair.
- **AC-UEI7-04** — CAS TLCs are exempt — a new entity is a new end-client / new connector, so existing connectors are unaffected (consistent with AC-EM4-09).

---

## User Flow Reference

*Illustrative; authoritative behavior is in the requirements above.*

1. **Run completes** → detection (UEI1) finds entity values with no mapping.
2. **Flow-through (UEI2)** → records take the connector's configured default (per Entity Mapping v2); ingestion isn't blocked, and the value is captured for review.
3. **Proactive surface (UEI5)** → the admin sees "N unmapped entities to review."
4. **Unmapped Entities (UEI3)** → for each candidate, the admin chooses:
   - **Confirm / label** → handoff to Entity Mapping v2 config (UEI6) → map → records on the default get re-tagged (per EM v2 backfill).
   - **Merge** → fold into an existing entity → records reconcile.
   - **Suppress (UEI4)** → added to the connector / source-dataset suppression list → removed from Unmapped Entities, won't re-fire.
5. **Genuinely new values** in later runs re-enter at step 1; suppressed / mapped values do not.

**Config-driven path (UEI7):**

1. A **new entity is added to the TLC** (trigger per AC-EM4-09).
2. The system identifies connectors that **previously covered every entity** (derived "complete coverage" — no stored flag).
3. **Proactive surface** highlights: "A new entity ([name]) was added — N connectors previously covered all entities. Review."
4. Per connector, the admin either **includes** the new entity (handoff to Entity Mapping v2 config, UEI6) or **dismisses** (snapshot unchanged, no re-fire). CAS TLCs are exempt.

---

## User Interaction & Design

Design tier: **Light.** Most surfaces this item touches are already designed in sibling items (Entity Mapping v2 config, Logging & Audit run-summary, Notifications). The net-new pieces are the **Unmapped Entities surface**, the **per-value suppression list**, and the **proactive surface placement**.

Key design questions for Natasha + Kristin:

1. **Proactive surface placement** (OQ-UE1) — counter on the Entity Mapping nav item, banner on the Catalog, run-summary CTA, notification, or a combination?
2. **Confident-default framing** — lead with "We found N unmapped entities — confirm these are entities to map," not a blank "review unmapped values" prompt (per the AI starting-point principle).
3. **Review-state visualization** — how is an unresolved unmapped value shown (it's sitting in Unmapped Entities while its records carry the configured default) vs a confirmed mapping? The "needs review" state lives in the Unmapped Entities surface, not in `fq_entity` itself.
4. **Unmapped Entities actions** — how do Confirm / Merge / Suppress read as three clear choices without feeling like a heavy resolution-path picker (which is post-Q3)?
5. **Suppression list management** — where the list lives and how un-suppress works.

---

## Future Considerations (post-Q3)

- **Full Gap Insights** — resolution-path picker, richer analytics on mapping gaps.
- **Suppress-all** global off-switch.
- **Cross-model suppression reuse** — share a suppression list across models that draw on the same source.
- **AI-assisted suggestions** — propose a mapping or merge target for a new candidate (overlaps the AI-assisted mapping item).
- **Coverage / missing-data detection** — the inverse of V1's "notify of unmapped entities": proactively flag when an entity that *should* have data doesn't. Three signals, increasing in ambition/noise: **(a) drop-off** (an entity that had data in prior runs but none in the latest — the highest-value, lowest-config version, since run history *is* the expectation), **(b) mapped-but-never-arrived** (a value mapped to an entity that never appears), **(c) zero-coverage entities** (a TLC entity no connector/source feeds). Open design problems to resolve when this lands: **cadence** (monthly/quarterly entities mean "absent this run" ≠ "missing" — needs a period-aware or N-runs-absent rule); **severity** (use prior volume so it doesn't cry wolf); **surface framing** (whether *new* and *missing* share one consolidated "Entity Coverage" surface — two views — or stay separate, which would broaden the "Unmapped Entities" name); and a new **eng dependency** (per-run, per-connector entity-presence history + volume). Strong candidate for the next iteration — AK flagged it as a real customer painpoint.

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-UE1 | Where does the proactive surface live — counter on Entity Mapping, banner on Catalog, run-summary CTA, notification, or a combination? | AK + Benjamin Ellis |
| OQ-UE2 | ~~Is the suppression list per-model, per-dataset, or per-entity-column?~~ **Resolved 2026-06-02 — mirrors the entity-mapping config granularity: connector level by default, with per-source-dataset override (per Entity Mapping v2). Not per-model** — entities aren't mapped at the model. Remaining detail: whether a source-dataset override can go finer (per-entity-column). | AK + Eng |
| OQ-UE3 | Does the proactive surface fire on every run that produces new members, or only when the *count* changes? Visible alert vs running tally? | AK + Eng |
| OQ-UE5 | **Reconciliation when a value is later mapped** — how do records that were ingested on the connector's configured default get re-tagged once the admin maps the value? Reuse Entity Mapping v2's `entity_start_time` / backfill mechanism, or a lighter run-forward-only reconcile? | AK + Eng |
| OQ-UE6 | Notification trigger — does UEI5 include a Notifications trigger ("new unmapped entity candidates detected"), or in-app only for V1? | AK + Notifications owner |
| OQ-UE7 | **Config-driven trigger (UEI7) coordination.** Detection uses the derived **"complete coverage"** rule — no stored "all entities" flag (agreed 2026-06-02; Entity Mapping v2 AC-EM4-09 updated to match). Still open: the ownership split (AC-EM4-09 owns the *trigger/notification*, UEI7 owns the *surface + review* — don't duplicate); whether UEI7 is V1 or deferred; and whether the highlight shares the Unmapped Entities surface (UEI3) or sits beside it (different object — a connector to expand, not a value to map). | AK + Entity Mapping v2 owner + Benjamin Ellis |

---

## Gaps

- **Run-side detection hook** — UEI1 presumes the ingestion pipeline can emit, per run, the set of entity values with no existing mapping. Confirm this hook exists or is buildable in Q3. **Owner: Eng.**
- **Reconciliation mechanism** — once a value is mapped, records that were ingested on the configured default must be re-tagged; depends on OQ-UE5 and the Entity Mapping v2 backfill model. **Owner: Eng + Entity Mapping v2.**
- **Suppression-list storage** — connector- / source-dataset-scoped list persisted and queryable at detection time (alongside the entity-mapping config). **Owner: Eng.**

---

## References

- `q3/new-entity-identification/brainstorm.md` — this item's brainstorm (incl. the 2026-05-15 flow-through / post-hoc-review reframe)
- [Entity Mapping v2](prd-entity-mapping.md) — config-time entity work
- `q3/dimensions/brainstorm.md` — dimensions auto-insert / NULL-prevention decision
- [Logging & Audit](prd-logging-audit.md) — passive run-summary surface this complements
- [Notifications](prd-notifications.md) — trigger coordination
- Memory: Dimensions NULL-prevention principle · AI starting-point principle
