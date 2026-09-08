# Session 004 — ATC Connector Setup: CDC Connection Flow

## Session Details

| Field | Value |
|---|---|
| Session ID | 004 |
| Date | 2026-05-15 |
| Study | Connector Setup — CDC Connection Flow |
| Prototype | Figma prototype (low-fidelity) |
| Participant | Jake Hickey (FloQast Sr. ATC) |
| Facilitator | Kristin Johnson, Natasha Clark |
| Observer(s) | Alex Kearns (PM), Rebecca Beasley-Cockroft (Sr. Product Manager) |
| Duration | ~33 min |
| Recording | https://drive.google.com/file/d/1mndxcAroAU22ajd0E5zSWtlUAw93XUSU/view?usp=drive_link |

## Task Given

> Using the provided prototype, walk through setting up a NetSuite data connection in Data Studio as if you were a customer configuring it for the first time.

## Completion

- [x] Completed primary task

Notes: Jake completed the full flow independently. The prototype was introduced as low-fidelity ("like PowerPoint slides") with specific clickable interactions.

## Key Observations

- Confidently selected pre-built over custom; chose Enhanced over Basic with clear reasoning — transaction-level data is needed for variance analysis and AI matching; suggested adding a module-specific blurb so customers can match their choice to their contract
- Token/token secret fields caused confusion — Jake doesn't know what NetSuite tokens are or how to retrieve them if he's not the NetSuite admin; requested a direct link to the setup guide in the UI
- Pause vs. Active status was the biggest friction point in the session — he had no mental model for what "Paused" means as a connection state and didn't understand what outcome each option produces
- Grayed-out Edit button on the Select Tables review screen created ambiguity — he wasn't sure if there was an action item or if the review page was just informational
- Save Only vs. Save and Set Active button labels were ambiguous; suggested renaming to "Save (Paused)" to communicate what "Save Only" actually does
- Active vs. Connected status labels on the connectors table were both green — he questioned the difference
- Suggested the Select Tables screen order should be optimized for accountants: accounts first, then transactions, then GL lines (currently GL lines appears first)
- Brought up dual audience throughout: accounting teams vs. IT admins have very different needs for this screen
- Overall: "pretty straightforward...pretty easy to follow along with"

## Notable Quotes

> "I feel pretty confident here. I'm sure that's gonna change, but I'll go ahead and select Add a Connector." — Jake Hickey, ~04:00

> "In case I'm not the NetSuite admin, I don't really know what tokens are in NetSuite. I haven't gone through that process. I probably wouldn't know where to go next." — Jake Hickey, on token fields

> "I think this whole section here is…pretty confusing as a customer playing around with this. I would have no idea what the difference between these two are, and ultimately what either of the end points are, by choosing one or the other." — Jake Hickey, on Pause vs. Active

> "A link to the setup guide would probably be helpful...a blurb just saying, like, for help getting the token and token secret. Here's a link to our NetSuite setup guide." — Jake Hickey, ~17:00

> "Maybe just, save in parentheses, pause, or, you know, something like that." — Jake Hickey, on Save Only button label, ~28:00

> "I think overall what we walked through today was pretty straightforward in terms of what I was able to understand and get through." — Jake Hickey, closing

## Issues Observed

| # | Step | Description | Severity |
|---|---|---|---|
| 1 | Credentials | Token/token secret — no context for non-NetSuite admins; no link to setup guide | Medium |
| 2 | Connection config | Pause vs. Active status — unclear what each state means and what it produces | High |
| 3 | Review screen | Grayed-out Edit on Select Tables — unclear if action is required | Medium |
| 4 | Review screen | Save Only vs. Save and Set Active — ambiguous; "Save Only" doesn't communicate paused state | Medium |
| 5 | Connectors table | Active vs. Connected — both green, distinction unclear | Low |
| 6 | Select Tables | Table order (GL lines first) not optimized for accounting users | Low |
