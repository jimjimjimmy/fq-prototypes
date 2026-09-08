# Surface Census — every FloQast table → profile

Source: **Tyler Davis's "Tables Audit 2026"** FigJam board (`sN41bXHuEpEIEx70GiOoy0`), cross-referenced with the repo prototype survey and Design Bar research. This is the concrete instantiation of the tier model — the backbone of `rubric.md` and the Phase 1 sequencing plan.

**Profiles:** P0 Simple (+ FlowUI Table alt) · P1 Filterable · P2 Manipulation · P3a Workflow-complex · P3b Analytical-complex.
**Classification is first-pass** (Claude's best guess) — ⚠️ marks surfaces to resolve together.
**Current impl = PRODUCTION today**, one of: **FQUI** (legacy FloQast UI table), **FlowUI table**, or **AG Grid**. Repo prototypes (`admin-agent`, `reporting-aiv`, `jem-home`, etc.) are design explorations, *not* production — marked "(proto)". Confirmed with Benjamin 2026-07-08.

## Distribution at a glance
- **Most surfaces are P0/P1 system-of-record** (all of Admin Settings, most of Compliance & Projects). The simple tiers carry real product weight — not an afterthought.
- **The loud pain concentrates in P3a/P3b** (Close + Reporting) — a minority of surfaces, majority of the complaints and ARR.
- **The current state spans THREE table technologies** — legacy **FQUI**, **FlowUI**, and **AG Grid**. Checklist/Recs and *all* of Compliance are FlowUI today; Admin Settings is a FlowUI/FQUI mix; Reporting/AI-Matching are AG Grid. Convergence onto one engine is the whole point of the project.
- **Compliance is the FlowUI-alternate-P0 test case** — all FlowUI today, Martin flagged it "may not need AG Grid at all," the Apr 30 Design Bar debated exactly this. Best place to prove the alt-P0 off-ramp (some of it may correctly *stay* FlowUI).

---

## Close Tables
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Checklist | **P3a** | **FlowUI table** | Parity *leader* (has sort arrows, Open Review Notes) — but FlowUI today. Target: AG Grid. |
| Recs | **P3a** | **FlowUI table** → AG Grid (Edson Pass 1) | Laggard. FlowUI→AG Grid migration is IDEA-2641, the 73% / $12.7M slice. |
| JEM Homepage | **P3a** ⚠️ (or P2) | AG Grid (`jem-home` proto) | Minnie: "missing latest views." JE approval workflow → likely P3a; confirm. |
| AI Matching | **P2** ⚠️ (or P1) | AG Grid (Minnie tagged) | Transaction matching (1:1 / many:many, select + act) → manipulation. |
| Amort / Depreciation | **P2** | AG Grid (Minnie tagged) | Schedules + calculated rows. |

_Edith flagged legacy Close surfaces "replaced by JEM?" / "replaced by FDM" — some of this region is mid-consolidation; confirm which are being retired._

## All Workflows
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Dashboard › Entities | **P1** ⚠️ | ? | Entity status overview. P1 filterable, possibly P0. |
| Folders | **P3a** ⚠️ | ? | Folder roll-up math + sub-entity hierarchy (own PRD per recs doc) → hierarchy = workflow-complex. |

## Reporting Tables
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Financials: Balance Sheet | **P3b** | AG Grid | Statement, periods, grouping. |
| Financials: Income Statement | **P3b** | AG Grid | Statement, MoM/YoY. |
| Reporting Entities | **P1** ⚠️ | ? | List; P1 or P0. |
| Adjustment Entries | **P2** | ? | Editable entries. |
| Chart of Accounts | **P1** ⚠️ | ? | Large reference list, possibly account *tree* (grouping). P1 w/ tree. |
| Variance Analysis | **P3b** | AG Grid (`reporting-aiv`, faked Enterprise) | Convert to real Enterprise (early win). |
| AI Variance Analysis | **P3b** | AG Grid (`ai-variance`, `ai-variance-prototype`) | Edith use-cases: collections grouping + team progress; write-explanation + sign-off finalization. |
| Reporting (Report Builder) | **P3b** | AG Grid (`reporting-bu-q3`, target stack) | Optionality PRD (13 toggles, presets, cascading persistence). |
| Intercompany | **P3b** ⚠️ (or P3a) | ? | IC matching + eliminations — analytical *and* workflow. Resolve. |
| FDM: ERP Connections | **P1** ⚠️ | ? | Connections list; P1/P0. |
| FDM: ERP Tables | **P1** ⚠️ (or P2) | ? | Data tables. |
| FDM: Dimension Grouping Mapping | **P2** | AG Grid (`fdm-rollup`, Tyler/Carmen → Will) | Mapping-rule editing. The account-hierarchy/signage table. |

## Projects
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Projects: Dashboard | **P1** ⚠️ | ? | Status overview; P1/P0. |
| Projects: Tasks | **P1** ⚠️ | ? | Task list w/ status/assignment; P1, maybe P3a-lite. |
| Agents | **P0** ⚠️ | ? | List. |

## Transform
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Transform (section) | ⚠️ **unknown** | ? | Board section had no sub-labels captured — confirm what surfaces live here (data transform? compliance transform?). |

## Compliance Tables — _FlowUI-alternate-P0 test bed_
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Programs | **P1** | ? | |
| Scoping | **P1** ⚠️ (or P2) | ? | |
| Risks | **P1** | ? | |
| Controls | **P1** ⚠️ | ? | List simple; but control *testing* has workflow → watch for P3a creep. |
| Key Reports | **P0** | ? | |
| Key Systems | **P0** | ? | |
| Issues | **P1** | ? | |
| Evidence Requests | **P1** ⚠️ (or P3a) | ? | Requests w/ status/workflow. |
| Certifications | **P3a** ⚠️ (or P1) | ? | Sign-off flavor. |
| Policies | **P0** | ? | Document list. |

_**Current impl: all FlowUI tables** (Benjamin, confirmed). Martin: "Compliance may not need AG Grid at all" → the place to prove the alt-P0 off-ramp; some of these may correctly **stay** FlowUI rather than migrate._

## Admin Settings — _all P0 / `adminLite` target; **currently a FlowUI / FQUI mix**_
| Surface | Target | Current impl | Status / notes |
|---|---|---|---|
| Settings: Workflows | **P0** | FlowUI / FQUI | |
| Settings: Entities | **P0** | FlowUI / FQUI | |
| Settings: Team Members (Users) | **P1** ⚠️ | FlowUI / FQUI (prod); AG Grid protos (`admin-agent`, `bulk-invite-user`) | Large + bulk actions → P1, not P0. Protos use `adminLiteGridTheme`. |
| Settings: Roles | **P0** | FlowUI / FQUI (prod); AG Grid proto (`admin-agent`) | Proto uses `adminLiteGridTheme`. |
| Settings: Group | **P0** | FlowUI / FQUI | |
| Settings: Checklist | **P0** | FlowUI / FQUI | |
| Settings: API Keys | **P0** | FlowUI / FQUI | |
| Settings: FDM | **P0** | FlowUI / FQUI | |
| Settings: Connections | **P0** | FlowUI / FQUI | |

_FQUI = the older FloQast UI table system, pre-FlowUI. These are prime migration candidates (two legacy techs to retire here)._

---

## Open questions this census raises
1. **Transform section** — what surfaces? (unlabeled on the board)
2. **Intercompany** — analytical (P3b) or workflow (P3a)? It's arguably both — a test of whether the "treat the branches the same" call holds.
3. **Workflow creep in Compliance** — Controls testing, Evidence Requests, Certifications carry sign-off/status. Do they stay P1 (list) or graduate to P3a? Likely depends on whether the *table* or a *separate flow* owns the workflow.
4. **Current-impl blanks** — most non-Close/Reporting surfaces need a quick "what runs there today" pass (FlowUI? AG Grid? legacy?). Candidate for a short eng/design sync or a repo/prod audit.
