# Session 003 — ATC Connector Setup: API Connection Flow

## Session Details

| Field | Value |
|---|---|
| Session ID | 003 |
| Date | 2026-05-08 |
| Study | Connector Setup — API Connection Flow |
| Prototype | connector-setup-prototype |
| Participant | Kiera Armintrout (FloQast ATC II) |
| Facilitator | Natasha Clark, Kristin Johnson |
| Observer(s) | Alex Kearns (PM), Rebecca Beasley-Cockroft (Sr. Product Manager) |
| Duration | ~44 min |
| Recording | https://drive.google.com/file/d/1BjNV_EZTT2yv26LTop5yl3e-i49RSHpm/view?usp=drive_link |

## Task Given

> Using the provided API documentation, set up an API connection with endpoints in the connector setup prototype.

## Completion

- [x] Completed primary task
- [x] Completed multiple endpoints

Notes: Kiera completed the task most smoothly of the three participants, despite having the lowest self-reported API knowledge (1/5). She navigated the endpoint setup largely independently and left the session with a positive impression.

## Key Observations

- Lowest API technical knowledge of the three participants, yet had the most successful independent completion — she used context and reasoning to fill gaps rather than relying on prior technical knowledge
- Pre-built vs. custom distinction caused initial uncertainty: Kiera associated "pre-built" connectors with standard ERP integrations (QBO, NetSuite, Sage Intact) that ATCs typically set up via the admin settings page, and questioned whether this feature would replace that workflow
- HTTP method (GET/POST/PATCH) — didn't know what "patch" is, but correctly reasoned GET vs. POST from first principles: GET = pulling data into FloQast, POST = pushing data back to source; facilitator confirmed
- "Value" field for query parameters — confused about whether to enter the example value from the guide or a generic format placeholder; suggested the label be changed to "example value" to clarify intent
- Value type (string vs. date) — initially defaulted to "string" before noticing "date" was an option; self-corrected once she saw the type in the guide matched the label
- Guide format: noted the IT documentation felt "data-driven rather than instruction-driven" — less prescriptive than ATC-facing setup guides she's used to
- Post-session: thought the experience was "fairly easy" and believes it will be a "big win" for ATC teams; mentioned IT resource availability as a current blocker to API setup with clients; asked where the feature would live (answered: Admin Settings)
- Expressed interest in being involved in future testing rounds

## Notable Quotes

> "Probably a good test subject, because I don't know anything about APIs." — Kiera Armintrout, ~04:03

> "I feel like on the setup side of things, I'm used to guides being extremely detailed with, like, here, open this up, click here, do this." — Kiera Armintrout (on the IT documentation format), ~10:31

> "I don't know what patch is, but... I would assume for those first two, get and post, it would be, like, receiving versus pushing it back to the ERP system." — Kiera Armintrout, ~22:38

> "If it said 'example value,' that would be perfect." — Kiera Armintrout (on the "Value" field label for query parameters), ~26:14

> "Even not really knowing a ton about it, I still feel like that was a fairly easy experience." — Kiera Armintrout, ~40:44

> "I really think this is going to make a big impact in helping our team set up APIs... concern about IT resources is a big blocker right now." — Kiera Armintrout, ~43:33

## Issues Observed

| # | Step | Description | Severity |
|---|---|---|---|
| 1 | Connector type picker | Pre-built vs. custom — unclear how this relates to existing ERP integrations in admin settings | Medium |
| 2 | Endpoint setup | HTTP method "patch" unknown; GET/POST reasoned correctly but required inference, not reading | Low |
| 3 | Endpoint setup | "Value" field label ambiguous — unclear if it wants a format template or the actual example value | Medium |
| 4 | Endpoint setup | Value type defaulted to "string" before participant noticed "date" option; required re-check | Low |
