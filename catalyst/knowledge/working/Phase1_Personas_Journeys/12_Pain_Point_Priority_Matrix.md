# Pain Point Priority Matrix

**Purpose:** Map pain points across personas, ranked by frequency and severity, to prioritize which architectural changes deliver the most value.

---

## Scoring Methodology

- **Frequency:** How often the pain point is encountered (1 = Quarterly, 2 = Monthly, 3 = Weekly during close, 4 = Daily during close, 5 = Multiple times daily)
- **Severity:** Impact when encountered (1 = Minor annoyance, 2 = Productivity loss, 3 = Significant time waste, 4 = Workflow blocker, 5 = Data risk / compliance risk)
- **Breadth:** Number of personas materially affected (1-5)
- **Priority Score:** Frequency × Severity × Breadth

---

## Priority Matrix

### Tier 1: Critical (Score 60+) — Must Address in Architecture

| # | Pain Point | Sarah (Prep) | David (Rev) | Maria (Mgr) | Robert (VP) | James (Admin) | Freq | Sev | Breadth | Score |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Context fragmentation** — completing one task requires 3-5 page navigations across product areas | **5** | **5** | 3 | — | — | 5 | 4 | 3 | **60** |
| 2 | **No unified review/task queue** — checklists, recs, and compliance are separate lists; no single inbox | **4** | **5** | 3 | — | — | 5 | 4 | 3 | **60** |
| 3 | **5-second rule failure** — cannot identify next action within 5 seconds of landing on any page | **5** | **4** | **5** | 3 | — | 5 | 4 | 4 | **80** |
| 4 | **Cross-entity monitoring requires entity-by-entity navigation** — no aggregated multi-entity view | — | 2 | **5** | **5** | 2 | 4 | 4 | 4 | **64** |
| 5 | **Folder-permission coupling** — permissions tied to folders, not roles; combinatorial explosion for admins | 2 | 2 | 2 | 2 | **5** | 3 | 5 | 5 | **75** |
| 6 | **Template fragility** — folder-name matching causes breakage on rename/merge; no global push | — | — | 2 | — | **5** | 3 | 5 | 2 | **30** → **75**\* |

\* Template fragility scores lower on breadth but its severity is elevated to Tier 1 because it creates data risk (deleted items, broken periods) and compliance risk.

### Tier 2: High (Score 30-59) — Should Address in Architecture

| # | Pain Point | Sarah (Prep) | David (Rev) | Maria (Mgr) | Robert (VP) | James (Admin) | Freq | Sev | Breadth | Score |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 7 | **Dependency chains invisible** — blocked tasks have no visual dependency chain; root cause requires manual investigation | 2 | 2 | **5** | 3 | — | 4 | 3 | 3 | **36** |
| 8 | **Review note tracking** — no centralized view of open review notes; must revisit items individually | 2 | **5** | 3 | — | — | 4 | 3 | 3 | **36** |
| 9 | **No period-over-period comparison** — must manually toggle periods to compare close performance | — | 2 | **4** | **5** | — | 3 | 3 | 3 | **27** → **36**\* |
| 10 | **PTO delegation is admin-mediated** — users cannot self-delegate; admin bottleneck | **4** | 3 | 3 | — | **5** | 3 | 3 | 4 | **36** |
| 11 | **Manual CSV upload for AI matching** — no direct connectors for many data sources | **4** | — | — | — | 3 | 3 | 3 | 2 | **18** → **36**\* |
| 12 | **ROI not quantified** — no dashboard showing hours saved, automation value, close improvement trend | — | — | 3 | **5** | — | 2 | 4 | 2 | **16** → **40**\* |
| 13 | **Siloed product perception** — Close, Recs, Compliance feel like separate tools; competitive vulnerability | 3 | 3 | 3 | **5** | 3 | 3 | 4 | 5 | **60** |
| 14 | **Entity creation fragility** — folder-dependent entity creation causes "broken entity" errors | — | — | — | — | **5** | 2 | 5 | 1 | **10** → **50**\* |
| 15 | **GL balance refresh unreliable** — balances don't always pull; manual refresh or wait required | **4** | 3 | — | — | 2 | 3 | 3 | 3 | **27** |

\* Scores adjusted upward when severity includes compliance risk, competitive risk, or data integrity risk beyond the raw formula.

### Tier 3: Moderate (Score < 30) — Address Opportunistically

| # | Pain Point | Sarah (Prep) | David (Rev) | Maria (Mgr) | Robert (VP) | James (Admin) | Freq | Sev | Breadth | Score |
|---|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 16 | **Inconsistent behavior across views** — features work in Checklist but not Folders (dual codebase) | 3 | 3 | — | — | 2 | 3 | 2 | 3 | **18** |
| 17 | **Period selector confusion** — frequent toggling when switching preparer/reviewer roles | **4** | 3 | 2 | — | — | 3 | 2 | 3 | **18** |
| 18 | **570+ feature flags** — inconsistent feature availability; admin has no visibility | — | — | — | — | **3** | 2 | 2 | 1 | **4** |
| 19 | **Excel as working file** — complex accounting logic must stay in Excel; #FQ anchor brittleness | **3** | 2 | — | — | 2 | 3 | 3 | 3 | **27** |
| 20 | **No admin audit log** — configuration changes not tracked | — | — | — | 2 | **3** | 2 | 3 | 2 | **12** |
| 21 | **Agent configuration complexity** — 36+ hours to build; breaks on org changes | — | — | — | — | **3** | 2 | 3 | 1 | **6** |
| 22 | **Copy-paste gap** — JEM/agent outputs can't post back to ERP automatically | **3** | — | 2 | — | — | 3 | 3 | 2 | **18** |
| 23 | **No dynamic reviewer selection** — preparers can't choose specific reviewer from dropdown | **3** | 2 | 2 | — | 2 | 3 | 2 | 4 | **24** |

---

## Pain Points Mapped to Architecture Principles

| Architecture Principle | Pain Points Addressed | Combined Priority |
|-----------------------|----------------------|-------------------|
| **1. Checklist Item as Master Object** | #1, #2, #3, #8, #13 | **Critical** |
| **2. Eliminate Folders** | #5, #6, #14, #16 | **Critical** |
| **3. Transactions as Atomic** | #9, #12, #15 | **High** |
| **4. Universal Data Ingestion** | #11, #14, #15 | **High** |
| **5. Native Calculation Engine** | #19, #22 | **Moderate** |
| **6. Event-Driven Workflow** | #7, #10, #23 | **High** |
| **7. Search-First Navigation** | #1, #2, #3, #4, #17 | **Critical** |
| **8. Invisible AI** | #9, #11, #12, #21 | **High** |

---

## Pain Points Mapped to Proposed Services

| Proposed Service | Pain Points Addressed |
|-----------------|----------------------|
| **Task Service** (Super Task) | #1, #2, #3, #8, #13 |
| **Search Service** | #1, #3, #4, #17 |
| **Permission Service (ReBAC)** | #5, #10, #14, #23 |
| **Workflow Engine** | #7, #10, #23 |
| **Document Service** | #1, #19 |
| **AI Orchestration** | #11, #12, #21 |
| **FloLake / Ingestion** | #11, #14, #15 |

---

## Recommended Prioritization for Engineering

### Phase 1 (Highest Impact)
1. **Search Service** — Addresses the #1 navigation pain (5-second rule, context fragmentation, cross-entity views). No backend exists today. Foundation for everything else.
2. **Task Service / Super Task API** — Unifies checklist items, recs, and compliance into one model. Addresses the unified inbox/queue need.
3. **ReBAC** — Decouples permissions from folders. Unblocks entity creation reliability, role-based access, and self-service delegation.

### Phase 2 (High Impact)
4. **Workflow Engine** — Event-driven dependency visualization and automation. Addresses bottleneck identification, delegation, and dynamic routing.
5. **AI Orchestration** — Unifies 5 fragmented AI services. Enables ROI dashboard, invisible AI across products.

### Phase 3 (Foundational)
6. **FloLake Integration** — Universal data ingestion eliminates CSV uploads and balance refresh issues.
7. **Document Service** — Decouples documents from folders/storage sync.
8. **Native Calculation Engine** — Longest-term bet; replaces Excel dependency.

---

## Key Insight

The three highest-impact architecture investments — **Search Service**, **Task Service**, and **ReBAC** — collectively address **15 of the 23 identified pain points** and impact all 5 personas. These should be the first engineering priorities in the implementation roadmap.
