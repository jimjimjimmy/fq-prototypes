# Session 005 — ATC Connector Setup: CDC Connection Flow

## Session Details

| Field | Value |
|---|---|
| Session ID | 005 |
| Date | 2026-05-15 |
| Study | Connector Setup — CDC Connection Flow |
| Prototype | Figma prototype (low-fidelity) |
| Participant | Mallory Turrubiartes (FloQast ATC II) |
| Facilitator | Kristin Johnson |
| Observer(s) | Natasha Clark, Alex Kearns (PM) |
| Duration | ~48 min |
| Recording | https://drive.google.com/file/d/15ZMglzBC5yk0V030TZM3-s7pyuKNnQ0R/view?usp=drive_link |

## Task Given

> Using the provided prototype, walk through setting up a NetSuite data connection in Data Studio as if you were a customer configuring it for the first time.

## Completion

- [x] Completed primary task

Notes: Mallory completed the flow and provided extensive design feedback throughout. She applied both an ATC lens (internal team perspective) and a customer proxy lens throughout the session.

## Key Observations

- "Pre-built vs. Custom" terminology is misleading — "direct integration" is the language used in sales/kickoff calls and better reflects what customers already understand; suggested using that framing instead
- Enhanced vs. Basic: customers will default to Enhanced assuming it's always better ("I'm gonna go with enhanced, because it sounds more fun"); no guidance on which tier matches their contract or modules — risk of misselection at scale
- Suite Analytics Connect — many customers don't know what it is; needs an info icon or tooltip; the conversation typically happens in the sales cycle, not self-service
- Suggested showing only essential ERPs in the initial setup phase, then unlocking supplemental data sources later — mirrors how ATC teams currently introduce new connectors over time as customers expand usage
- Refresh frequency (hourly for CDC) was a surprise — she assumed direct integrations were more real-time than SFTP; no strong friction, but surfaces an expectation gap worth addressing
- "In Process" / "Authenticated" state was well-understood; grayed-out table editing while in process was correctly interpreted — no friction there
- Raised a real sequencing question: first-time customers must already have an ERP connection before reaching this screen — she's curious how that initial flow is handled and whether this replaces or sits alongside the current setup link
- Overall: "from a setup standpoint, going to be easier than what it is today...very cool. I like it."

## Notable Quotes

> "The pre-built versus custom titles can be a little bit, maybe, misleading...the pre-built versus the custom could be misleading for a customer that maybe doesn't have one of these specific direct integrations." — Mallory Turrubiartes, ~06:03

> "I'm gonna go with enhanced, because it sounds more fun." — Mallory Turrubiartes, ~08:07

> "Most customers, probably by default, would prefer an enhanced connection, because...it's kind of like, oh yeah, I want to get the most value out of FloQast." — Mallory Turrubiartes, ~09:02

> "I would say, I guess let me back up and ask. When, I guess, realistically, would a client come through this step? Would this kind of replace the current setup link that we send to them?" — Mallory Turrubiartes, ~11:18

> "From a setup standpoint, going to be easier than what it is today, because today you have to go through the process of actually creating the entity, so I think this will be better from the client's perspective." — Mallory Turrubiartes, ~47:20

> "So, very cool. I like it." — Mallory Turrubiartes, ~47:35

## Issues Observed

| # | Step | Description | Severity |
|---|---|---|---|
| 1 | Connector type picker | "Pre-built vs. Custom" terminology misleading; "direct integration" is the recognized term | Medium |
| 2 | Connection tier | Enhanced vs. Basic — customers default to Enhanced without understanding contract implications | Medium |
| 3 | Connection config | Suite Analytics Connect — technical term with no in-context explanation | Medium |
| 4 | Flow positioning | Unclear where this step fits in the broader first-time customer setup journey | Low |
