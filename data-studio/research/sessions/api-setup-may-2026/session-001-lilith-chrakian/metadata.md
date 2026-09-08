# Session 001 — ATC Connector Setup: API Connection Flow

## Session Details

| Field | Value |
|---|---|
| Session ID | 001 |
| Date | 2026-05-07 |
| Study | Connector Setup — API Connection Flow |
| Prototype | connector-setup-prototype |
| Participant | Lilith Chrakian (FloQast Senior ATC) |
| Facilitator | Kristin Johnson, Natasha Clark |
| Observer(s) | Alex Kearns (PM), Rebecca Beasley-Cockroft (Sr. Product Manager) |
| Duration | ~48 min |
| Recording | https://drive.google.com/file/d/1wnJH3RVWyhsQXavpw2WFx0xPs5cjWgfA/view?usp=drive_link |

## Task Given

> Using the provided API documentation, set up an API connection with endpoints in the connector setup prototype.

## Completion

- [x] Completed primary task (with facilitator as "hands" — see notes)
- [ ] Completed all endpoints independently

Notes: Copy-paste between the reference doc and prototype fields failed early in the session (Google Doc was shared view-only; Zoom remote control also blocked paste from local clipboard). Kristin took back screen control and acted as Lilith's hands for the remainder — Lilith directed verbally. Only 2 of 5 endpoints completed due to time constraints.

## Key Observations

- Copy-paste friction was an immediate and significant blocker — the participant could not paste values from the reference doc into prototype fields and grew visibly frustrated before the facilitator intervened
- "Health check URL" was not understood — participant skipped it and said "I don't know what that means, but I'm gonna continue"
- "API version" was unfamiliar; participant didn't know what to enter
- Sync mode / data refresh terminology ("frequent," "incremental") was opaque — participant selected options but stated she didn't know what they meant
- "ISO 8601" date format label was unfamiliar; participant eventually inferred the correct choice from the reference doc
- The Environment field (sandbox/production) caused confusion — participant wasn't clear whether it referred to the source API's environment or FloQast's environment; she reasoned it out but needed Kristin to confirm
- Participant had a strong mental model of the goal (connect data to FloQast) but struggled with technical field labeling throughout
- Post-session: suggested uploading the reference doc so the system could auto-fill fields; requested a plain-language confirmation summary before submitting

## Notable Quotes

> "Health check URL. What the heck does that mean?" — Lilith Chrakian, ~12:35

> "I don't know what that means, but I'm gonna continue." — Lilith Chrakian (on "Health check URL"), ~12:57

> "Sync mode. Nobody, nobody knows, right?" — Kristin Johnson (reflecting participant's confusion), ~44:13

> "If you were to do something like that, and then having a summary that explains that, like a before-you-confirm... so that I understand what I'm agreeing to before I click, like, finish." — Lilith Chrakian, ~44:25

## Issues Observed

| # | Step | Description | Severity |
|---|---|---|---|
| 1 | Connection setup | Copy-paste from reference doc to prototype fields broken (view-only doc + Zoom remote clipboard issue) — blocked independent task completion | High |
| 2 | Connection setup | "Health check URL" label not understood; no in-context explanation; participant skipped | Medium |
| 3 | Connection setup | "API version" field — participant didn't know what to enter | Medium |
| 4 | Endpoint setup | "Sync mode" / refresh frequency options ("frequent," "occasional") — meaning not clear without definitions | Medium |
| 5 | Endpoint setup | "Incremental" sync terminology unfamiliar | Medium |
| 6 | Endpoint setup | "ISO 8601" date format label not recognized (eventually resolved via reference doc) | Low |
| 7 | Connection setup | Environment field (sandbox/production) — unclear whether it refers to source API or FloQast environment | Medium |
