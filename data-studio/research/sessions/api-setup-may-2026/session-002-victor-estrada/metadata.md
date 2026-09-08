# Session 002 — ATC Connector Setup: API Connection Flow

## Session Details

| Field | Value |
|---|---|
| Session ID | 002 |
| Date | 2026-05-08 |
| Study | Connector Setup — API Connection Flow |
| Prototype | connector-setup-prototype |
| Participant | Victor Estrada (FloQast ATC II) |
| Facilitator | Kristin Johnson, Natasha Clark |
| Observer(s) | Alex Kearns (PM), Rebecca Beasley-Cockroft (Sr. Product Manager) |
| Duration | ~36 min |
| Recording | https://drive.google.com/file/d/1347cMvYl17rjacBh_x2DHnbalArXxCn7/view?usp=drive_link |

## Task Given

> Using the provided API documentation, set up an API connection with endpoints in the connector setup prototype.

## Completion

- [x] Completed primary task
- [x] Completed multiple endpoints

Notes: Victor completed the task most independently of the three participants. Copy-paste issue was present but worked around quickly. Facilitator flagged one prototype bug (missing "date from" parameter field) mid-session.

## Key Observations

- Victor has no formal API-building experience but has ATC exposure to APIs through client work — this gave him slightly more conceptual footing than the other participants
- Selected Custom connector type immediately and explained his reasoning clearly (chose API over SFTP because it avoids file transfer dependency) — good mental model of the connector type picker
- Copy-paste issue present but less disruptive — noticed it and adapted quickly by using a split-screen layout
- Environment field (sandbox/production) caused confusion: he initially assumed it referred to a FloQast sandbox vs. the customer's source API; asked for clarification; Rebecca confirmed it meant the source system
- HTTP method (GET/POST/PATCH) — unfamiliar; completed the field but recommended adding inline explanatory blurbs so users understand what each method does
- Response format (JSON/XML/CSV) — uncertain; had to refer back to the reference doc; eventually found the answer but suggested the UI make this easier
- Post-session discussion: was surprised to learn there would be a field mapping step after ingestion; assumed ingestion was the final step
- Perspective on customer readiness: thinks technical teams will succeed; non-technical accounting teams will still need ATC support, but this is a "great step in the right direction" compared to current process

## Notable Quotes

> "I've never built one out, but I think I can work my way around... maybe, like, a 1.5, like, a one and a half to 2." — Victor Estrada (on API knowledge, 1–5 scale), ~05:28

> "It would be nice to have, like, a blurb, like one of those blurbs that we saw in the past, just explaining, like, what GET, POST, and PATCH are, like, what they mean." — Victor Estrada, ~17:01

> "I'm assuming, like, a typical accountant won't know, like, which one is it? Is it JSON, XML, or CSV?" — Victor Estrada, ~19:23

> "I think that this is a great, great step in the right direction." — Victor Estrada, ~35:13

## Issues Observed

| # | Step | Description | Severity |
|---|---|---|---|
| 1 | Connection setup | Copy-paste issue present (same root cause as Session 001) — worked around by Victor independently | Low |
| 2 | Connection setup | Environment field (sandbox/production) — ambiguous whether it refers to source API or FloQast | Medium |
| 3 | Endpoint setup | HTTP method (GET/POST/PATCH) — no in-context explanation; participant needed it | Medium |
| 4 | Endpoint setup | Response format (JSON/XML/CSV) — had to re-read documentation to find the answer | Medium |
| 5 | Endpoint setup | "Date from" parameter missing from prototype (confirmed prototype bug, not design issue) | Low |
| 6 | Post-session | No awareness that a field mapping step would follow — expected ingestion to be the final step | Low |
