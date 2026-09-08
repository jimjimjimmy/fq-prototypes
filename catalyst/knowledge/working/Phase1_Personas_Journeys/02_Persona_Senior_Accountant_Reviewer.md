# Persona: David Park — Senior Accountant (Reviewer)

**Role:** Senior Accountant / Team Lead
**Archetype:** The Gatekeeper — "I need to review everything quickly, with full context, and know nothing slipped through."

---

## Demographics & Context

| Attribute | Detail |
|-----------|--------|
| Title | Senior Accountant, Accounting Lead, GL Supervisor |
| Experience | 5-10 years in accounting; 1-3 years on FloQast |
| Reports to | Controller or Accounting Manager |
| Team size | Manages/reviews work of 3-8 preparers |
| Entity scope | 2-5 entities (broader than preparers) |
| Daily FloQast time | 3-5 hours during close, 1 hour outside close |
| Technical comfort | High; power user of Excel, experienced with ERP |
| CPA status | Licensed CPA |

## Key Responsibilities

1. **Review and approve prepared work** — Evaluate reconciliations, journal entries, and workpapers for accuracy, completeness, and compliance
2. **Manage review queue** — Process review items across multiple entities, checklists, and reconciliations
3. **Write review notes** — Flag issues, ask clarifying questions, request additional evidence
4. **Cross-product oversight** — Review work spanning Close checklists AND reconciliations, requiring navigation between product areas
5. **Mentor preparers** — Provide coaching through review feedback; identify training needs
6. **Escalate exceptions** — Flag materiality threshold breaches, control deficiencies, or unusual transactions to the controller

## Goals & Motivations

- **Unified review experience** — Wants a single queue showing everything awaiting his review, regardless of whether it's a checklist item, reconciliation, or compliance task (Source: Doc 02 Sec 1.2)
- **Full context without navigation** — Wants to see the complete picture of a task (balances, supporting docs, prior period comparisons, review history) in one view, not across four pages
- **Fast throughput** — During peak close, David reviews 30-50 items. Each context switch costs 30-90 seconds of cognitive reload. Over 40 items, that's 20-60 minutes of lost time
- **Pattern recognition** — Wants to quickly spot anomalies: unusual balances, missing evidence, late items, preparers who consistently need coaching
- **Clean audit trail** — Needs confidence that his sign-off creates an unbreakable audit record

## Pain Points (Current State)

### Critical (Daily friction during close)
1. **Fragmented review queue** — There is no single "review queue." David must check the checklist view for items awaiting review, then separately check reconciliations for rec review items, then check compliance tasks. Each is a different page with different filters. (Source: Doc 02 Sec 1.2)
2. **Context loss on drill-down** — When David clicks into a checklist item to review it, he loses his place in the list. After approving, he must re-navigate and re-apply filters to find the next item. (Source: Doc 01 Sec 4.1, Doc 04 Sec 2D)
3. **Incomplete task context** — The checklist grid shows status and assignment but not the reconciliation balance, linked transactions, or agent execution results. David must click through to separate views to evaluate whether work is actually correct. (Source: Carlos Avila's "aggregated drill-down" priority, Doc 02 Sec 3.3)

### Significant (Weekly friction)
4. **Cross-entity review is manual** — David reviews across 3 entities. Switching entities requires navigation back to entity selector, reapplying filters, and rebuilding mental context. (Source: Doc 01 Sec 4.1)
5. **Review note tracking** — David writes a review note asking for clarification. He has no centralized view of "open review notes I've written" — he must revisit each item individually to check if the preparer responded. (Source: Doc 02 Sec 2.5 Review-Notes service)
6. **Inconsistent status indicators** — Checklist items and reconciliations use different completion indicators (green checkmarks vs. other states), making it harder to assess at a glance. (Source: Doc 01 Sec 4.3)

### Moderate (Monthly friction)
7. **No period-over-period comparison in review** — David can't easily see "this account's rec balance was $X last month and $Y this month" without manually toggling periods. (Source: Doc 04 Sec 2E)
8. **Rec balance refresh delays** — David sometimes reviews a rec only to discover the GL balance hasn't refreshed, making the rec stale. He must wait for a refresh cycle or manually trigger one. (Source: Doc 01 Sec 4.2)
9. **Dual codebase inconsistencies** — Features that work on the Checklist page may not work on the Folders page. David encounters these bugs unpredictably. (Source: Doc 02 Sec 1.2)

## Aspirational Experience (Future State)

### The Review Flow: "Queue → Context → Decide → Next"
David opens his **Review Queue** — a unified, filterable list of every item awaiting his review across all entities and product areas. The queue shows 28 items: 18 checklist tasks, 8 reconciliations, and 2 compliance tasks. Items are sorted by due date, with color-coded urgency. A summary reads: *"3 items have materiality exceptions. 5 items have unresolved review notes from last period that carried forward."*

He clicks the top item — a deferred revenue reconciliation for Entity B. The **Super Task Drill-Down** opens with: the GL balance ($2.4M), the reconciled balance ($2.38M), the variance ($20K — within materiality), the preparer's supporting schedule, linked transactions from FloLake showing the individual deferrals, agent execution log showing the AI matched 95% of line items, and the review history showing this rec took 2 days longer than average last period.

David approves with one click. The system automatically advances to the next review item, preserving his queue position. He doesn't navigate away.

For the materiality exception item, David writes a review note directly in the drill-down: "Variance of $45K exceeds materiality threshold. Please provide documentation for the three largest deferred revenue contracts." The note is threaded, tagged with the exception type, and the preparer receives an instant notification.

### Key Principle Manifestations
- **Principle 1 (Master Object):** The drill-down gives David everything — balances, docs, transactions, agent logs, review history — without leaving the page
- **Principle 3 (Transactions as Atomic):** David can see individual transactions linked to the rec, not just summary balances, enabling faster root-cause analysis
- **Principle 6 (Event-Driven):** David's approval triggers automatic state transitions: preparer notified, dependency chain updated, close progress recalculated, audit log written
- **Principle 7 (Search-First):** David searches "materiality exceptions Entity B" to instantly filter to problem items
- **Principle 8 (Invisible AI):** The system flags items where agent confidence was below threshold, letting David focus review effort where it matters most

## Technology & Tools

| Tool | Usage |
|------|-------|
| FloQast | Primary review and approval platform |
| ERP | Reference for balance verification, JE posting confirmation |
| Excel | Detailed workpaper review, variance analysis |
| Cloud storage | Direct access to supporting files |
| Slack/Teams | Communication with preparers, escalation |
| Email | Formal communication with external auditors |

## Quotes (Synthesized from Research)

> "I review across checklists AND reconciliations. Why are they two separate queues? It's the same thing — I'm verifying someone's work." — Reflecting Doc 02 Sec 1.2

> "I click into an item to review it, then I have to click back, re-filter, and find where I was. Multiply that by 40 items during close week." — Reflecting navigation friction

> "Show me the full picture in one place. The balance, the docs, the transactions, the review notes. Don't make me go on a treasure hunt." — Reflecting Carlos Avila's drill-down priority, Doc 02 Sec 3.3

## Metrics That Matter to David

- **Items awaiting my review** — His primary pressure gauge
- **Open review notes (written by me)** — Outstanding questions he needs answers to
- **Average review turnaround** — Time from "ready for review" to his sign-off
- **Exception rate** — Percentage of items with materiality breaches
- **Preparer quality trend** — Which preparers consistently need fewer review notes
