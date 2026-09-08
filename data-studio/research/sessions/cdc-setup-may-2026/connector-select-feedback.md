# Connector Select Screen — Research Feedback & Suggested Changes

**Study:** ATC Connector Setup — CDC Connection Flow
**Sessions reviewed:** 004 (Jake Hickey, Sr. ATC) and 005 (Mallory Turrubiartes, ATC II), both 2026-05-15
**Scope of this document:** The Connector Select picker only — the screen pair where the user chooses (a) Pre-built vs. Custom connector type and (b) Enhanced vs. Basic NetSuite connection tier.

---

## Compiled Feedback

### 1. "Pre-built vs. Custom" terminology is misleading

Jake parsed the labels without trouble — he read "Custom" as "the TBU clients we have" and moved on. Mallory, taking the customer lens, flagged the labels as her first piece of feedback. The terminology the rest of the business uses is "direct integration," and customers hear that term during the sales cycle and kickoff calls, not "pre-built." She also worried the framing nudges everyone toward Pre-built regardless of fit, since it sounds like the easier path.

> "The pre-built versus custom titles can be a little bit, maybe, misleading. So, like, for example, on the setup side, we go with, like, a direct integration versus a… custom, potentially." — Mallory, ~06:03

> "Obviously the default… yeah, I would love to go with pre-built, I don't have to go through as much work." — Mallory, ~06:23

> "Making it more specific to say, like, okay, these are direct integrations that we have with FloQast, or if your ERP isn't listed here, kind of like something more along the lines so that it's clearer." — Mallory, ~06:38

### 2. Customers will default to "Enhanced" without understanding why

Both participants picked Enhanced quickly, and both said customers will too — but for different reasons than we want. Jake's reasoning was sound ("transaction-level detail for variance and AI matching"); Mallory's was telling: "it sounds more fun." Both raised the risk that customers misselect a tier they aren't entitled to or don't need.

> "I'm gonna go with enhanced, because it sounds more fun." — Mallory, ~08:07

> "Most customers, probably by default, would prefer an enhanced connection, because it's kind of, like, 'oh yeah, I want to get the most value out of FloQast.'" — Mallory, ~09:02

> "Would BASIC ever be the better approach? Why wouldn't it always just be enhanced?" — Jake, ~09:05

### 3. The tier descriptions don't connect the choice to modules/contract

Neither tile tells the user what they're getting in terms they recognize. Jake suggested an in-tile blurb listing the modules each tier specifically supports (variance analysis, AI matching, Transform), with an asterisk or callout for further detail. Mallory independently asked for the same thing — language tying each tier to "the added modules that this would feed."

> "Maybe just, like, a direct reference to, like, what Enhanced helps with specifically… helps with variance analysis, AI matching, Transform, etc. — within the enhanced tile, or, like, an asterisk that refers to it somewhere else." — Jake, ~10:32

> "Maybe putting in the language, like, the added modules that this would feed, or something, like, where these specific things would kind of come into play throughout the application to know if it's something that they need or not." — Mallory, ~10:38

Jake noted ideal-state would be pulling in the customer's actual contract entitlements; both agreed this is a longer-term lift.

### 4. The "Suite Analytics Connect" prerequisite is buried

Enhanced requires NetSuite Suite Analytics Connect, but Jake admitted he skipped past the inline blurb on first read. Mallory confirmed many customers don't know what Suite Analytics Connect is — she said the team has to clarify it even in kickoff calls.

> "I wasn't thinking about the Suite Analytics Connect part at first, and I totally skipped over that little blurb… probably helpful, maybe, to make that jump out a little bit more for anybody, because if they don't have Suite Analytics Connect, and they click on this, I'm sure they probably can't get far." — Jake, ~10:45

> "I think you could almost maybe have, like, one of those little info icons where they could hover over and… have, like, a description of NetSuite Analytics Connect." — Mallory, ~12:05

### 5. ERP availability should be staged to the customer's setup phase

Mallory raised this as a sequencing question: in the first-time setup flow, customers should only see ERP connectors. Supplemental sources (Trovata, etc.) should appear later, once the core ERP connection is live — mirroring how ATCs introduce new data sources over time today.

> "Having only the ERPs available at that point would be helpful, and then we could move into, like, Trovata or other setups outside of the ERP after that." — Mallory, ~14:12

### 6. Open question on where the picker sits in the broader flow

Mallory asked whether this screen replaces today's setup link or sits alongside it. This isn't a picker design issue per se, but it surfaced on the picker screen and shapes the first impression for first-time customers. Worth resolving before launch.

> "When, I guess, realistically, would a client come through this step? Would this kind of replace the current setup link that we send to them?" — Mallory, ~11:18

---

## Suggested Changes

Prioritized roughly by severity-of-friction × ease-of-fix.

### High priority

**1. Rename "Pre-built" → "Direct integration."**
Use the language the customer has already heard. Pair it with a clearer counter-label — e.g., "My ERP isn't listed" or "Other / custom connector" — so users self-select correctly. (Source: Mallory, S005)

**2. Add a modules-impacted line to each tier card.**
Each tile should list, in plain language, which FloQast modules the tier enables. Suggested copy direction:

- *Basic* — "Powers core reconciliation."
- *Enhanced* — "Powers reconciliation, variance analysis, AI matching, and Transform. Requires NetSuite Suite Analytics Connect."

This addresses two problems at once: it gives customers a contract-anchored reason to choose Basic, and it pulls the Suite Analytics Connect prerequisite forward. (Sources: Jake S004; Mallory S005)

**3. Elevate the Suite Analytics Connect prerequisite.**
Today it lives in a small inline blurb that Jake admitted he skipped. Two complementary moves:

- Promote it from body text to an explicit requirement line directly under the Enhanced tier title (e.g., a "Requires:" row with the prerequisite called out).
- Add an info icon next to "Suite Analytics Connect" with a short hover definition for customers who don't know what it is.

(Sources: Jake S004; Mallory S005)

### Medium priority

**4. Give the picker a "Help me choose" affordance.**
A small expandable section — "Not sure which to pick?" — that lays out the decision in customer terms: "If you bought variance analysis, AI matching, or Transform, pick Enhanced. If you only need close/reconciliation, Basic is sufficient." This is the cheapest way to capture the contract-aware guidance Jake asked for before we can integrate live entitlement data. (Source: Jake S004)

**5. Stage which connectors appear based on setup phase.**
For first-time setup (when this screen replaces today's setup link), show only ERP connectors. Surface supplemental sources (Trovata, banking, etc.) only after an ERP connection is live, or via a separate "Add additional data source" entry point. (Source: Mallory S005)

### Lower priority / follow-up

**6. Resolve the flow-positioning question explicitly in the UI.**
Above the picker on first entry, set expectations: a one-line orientation telling the customer where they are in the setup journey (e.g., "Step 1 of 3 — connect your ERP"). This addresses Mallory's "where does this fit?" reaction and reduces the cognitive load of a self-service first impression. (Source: Mallory S005)

**7. Long-term: pull contract entitlements into the picker.**
When feasible, gray out or pre-select the tier the customer is actually entitled to, with override allowed. This is the ideal version of suggestions #2 and #4 — both participants explicitly wished for it. (Sources: Jake S004; Mallory S005)

**8. Test the revised labels with a non-FloQast user.**
The two participants are ATCs and read these screens with FloQast context already in their head. The terminology fixes above should be re-tested with a participant who has not seen FloQast's setup process before, ideally someone in a controller or staff-accountant role at a customer org.

---

## Severity Summary

| # | Theme | Severity | Sessions |
|---|---|---|---|
| 1 | "Pre-built vs. Custom" terminology | Medium | 005 |
| 2 | Enhanced default w/o understanding | Medium | 004, 005 |
| 3 | Tier descriptions disconnected from modules/contract | Medium | 004, 005 |
| 4 | Suite Analytics Connect prerequisite buried | Medium | 004, 005 |
| 5 | ERP staging by setup phase | Low | 005 |
| 6 | Flow-positioning ambiguity | Low | 005 |

---

## Sources

- [Session 004 metadata](computer:///sessions/keen-fervent-goodall/mnt/cdc-setup-may-2026/session-004-jake-hickey/metadata.md)
- [Session 004 transcript](computer:///sessions/keen-fervent-goodall/mnt/cdc-setup-may-2026/session-004-jake-hickey/transcript.md)
- [Session 005 metadata](computer:///sessions/keen-fervent-goodall/mnt/cdc-setup-may-2026/session-005-mallory-turrubiartes/metadata.md)
- [Session 005 transcript](computer:///sessions/keen-fervent-goodall/mnt/cdc-setup-may-2026/session-005-mallory-turrubiartes/transcript.md)
