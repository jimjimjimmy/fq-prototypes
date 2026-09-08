# Research — Slack & Design Bar Feedback (captured)

Feedback Benjamin captured from Slack channels + Design Bar sessions, provided 2026-07-08. Two themes: platform strategy, and customer-facing pain.

## Platform / strategy feedback

| Theme | Feedback | Source | Date |
|---|---|---|---|
| No platform-wide design standards | "We'd need to answer a few questions before we have a platform-level AG Grid strategy: Do we want to replace every table in FloQast with AG Grid? Alignment with directors across BUs is needed." | @Tyler.Davis | Jun 23 |
| No rubric for FlowUI vs. AG Grid | "Do we have any rubric for when to use FlowUI vs. AG Grid tables, or is the general plan to move everything into AG Grid eventually?" | @natasha.clark | May 21 |
| Complaints stem from a bad baseline impl | "Our internal complaints are all about the base out-of-the-box implementation of AG Grid, which we know is just a toolkit — we should be coming up with custom containers and visualization for it." | @Benjamin | May 20 |
| Sales feedback skewed by Reporting | "Their feedback around AG Grid is still from the overly complex implementation for reporting where there's more data manipulation. We just need better design principles for how to use it in Close." | @Benjamin | May 11 |
| Recs vs. Checklist parity gap | "Recs is the laggard — no sort arrows, missing Open Review Notes quick filter, missing Frequency global filter. Closing this drift IS Pass 1." | @Minnie Newman | Jun 15 |
| Urgency for reusable components | "The AG Grid strategy is becoming more urgent because Reporting needs to know what to build into reusable components." | @greg.jones | Jun 23 |
| Filter placement inconsistency | "There are areas in FQ that have stacked filters horizontally. Users have to scroll horizontally through the table to find the right column filter." | @Jenny.Chan | Jul 1 |
| Too many filter layers | "The filter situation is too layered — entity/period selector + quick filters + table filters is a lot." | @greg.jones (via @Jenny.Chan) | Jun 25 |
| In-table filters ≠ accountant mental models | "The decision to move away from in-table AG Grid filters came from a mismatch with accountants' mental models — preference is for filters above the table." | @Benjamin (Design Bar – JEM) | Jun 18 |
| AG Grid pattern consistency across Close | "Whatever we do with AG Grid here should be a pattern we use across Close." | @greg.jones | Jun 29 |
| Design paralysis without org-wide decision | "If we're going to have an internal debate about whether to move forward with AG Grid in Data Studio, we need to put a total pause on this until we figure it out as an org." | @kristin.johnson | May 20 |
| Compliance may not need AG Grid at all | "We should assess the gaps we are trying to address rather than just say AG Grid will handle all our needs." | @martin | May 27 |
| Settings inconsistent across AG Grid instances | "Concern about the consistency of a free-floating settings component given AG Grid's widespread use." | @Tyler.Davis (Design Bar – AG Grid QoL) | Mar 18 |
| Define FlowUI vs. AG Grid use cases | "Clearly define the use cases for FlowUI tables (systems of record) vs. AG Grid tables (systems of work), given current usability issues with AG Grid filtering and navigation." | @Benjamin (Design Bar – Compliance Homepage) | Apr 30 |
| Engineering blocked on standardization | "Regarding standardizing the config-based AG Grid table in Flow UI for adoption across applications — do we have an estimated timeline for when design will be ready?" | @abhijit.aghao | Jul 1 |

## Customer-facing feedback

| Theme | Feedback | Source | Date |
|---|---|---|---|
| Out-of-the-box filtering is hard to use | "Customers found the filtering hard to use — Sales and Mike have also called that out." | @Jenny.Chan citing Sales + Mike | Jul 1 |
| ~73% of table-state pain is addressable | "We can address ~73% of customer table-state feedback by bringing column-level sort/filter to headers and closing the Recs/Checklist parity gap." | @Minnie Newman | Jun 15 |
| Demand for saved/persistent views | "We've heard customer requests around saved views — it feels worth aligning on a consistent pattern." | @Minnie Newman | Jul 1 |
| Can't reuse documents across areas | "Customers cannot reuse documents across different application areas — described as an 'absurdity gap' that negatively impacts customer perception." | @U07SGTEXAMPLE (Design Bar – AG Grid QoL) | Mar 18 |
| SCs prefer consolidated filter panel | "SCs commented on the visual pie chart being gone but all prefer the filter panel — think this is a good direction." | @Jenny.Chan | Jul 1 |
| Need multi-tier settings | "Strong customer demand for tiered settings, including global controls for column visibility and standard reports." | Design Bar – AG Grid QoL | Mar 18 |

## Signals this feedback sends the project
- **Org alignment is a precondition** (Tyler, Kristin, Martin, Natasha) → Phase 0 rubric first.
- **The problem is the container, not AG Grid** (Benjamin May 20) → standardize the wrapper.
- **Filtering is the #1 concrete pain** (6+ quotes) → cross-cutting `filtering.md`.
- **Eng is blocked, waiting** (abhijit, greg) → Phase 2 has a real, urgent customer.
- **73% slice + parity** (Minnie) → highest-ROI first slice, lands in P3a.
