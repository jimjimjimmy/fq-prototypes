# Persona: Sarah Chen — Staff Accountant (Preparer)

**Role:** Staff Accountant / Senior Staff Accountant
**Archetype:** The Executor — "Show me exactly what I need to do today, and let me knock it out."

---

## Demographics & Context

| Attribute | Detail |
|-----------|--------|
| Title | Staff Accountant, GL Accountant, Accounting Associate |
| Experience | 1-5 years in accounting; 6-18 months on FloQast |
| Reports to | Senior Accountant or Controller |
| Team size | Part of a 5-15 person accounting team |
| Entity scope | 1-3 entities (assigned subset) |
| Daily FloQast time | 2-4 hours during close, 30 min outside close |
| Technical comfort | Moderate; fluent in Excel, adapts to SaaS tools |
| CPA status | Working toward or recently obtained |

## Key Responsibilities

1. **Execute close tasks** — Book journal entries, upload workpapers, reconcile accounts per assigned checklist items (typically 10-25 items per close)
2. **Prepare reconciliations** — Import bank/sub-ledger data, match transactions, investigate exceptions, document variances
3. **Attach evidence** — Upload supporting documents, link cloud storage files, take screenshots of ERP reports
4. **Sign off as preparer** — Certify work is complete; pass to reviewer
5. **Respond to review notes** — Address reviewer questions, provide additional documentation, revise and resubmit

## Goals & Motivations

- **"Inbox zero" for close tasks** — Wants to see only her assigned items, prioritized by what's due/late/blocked, and systematically clear them (Tim Gibson: "inbox-zero experience where preparers see only their 10-15 items for today")
- **Minimize context-switching** — Wants to complete a task without navigating to 3-4 different pages (rec view, folder view, review notes, file storage)
- **Know where she stands** — Wants immediate clarity on: what's done, what's due today, what's late, what's waiting on someone else
- **Get through close faster** — Personal goal is reducing her close duration so she can focus on analysis and career growth
- **Avoid rework** — Review note rejections feel personal; wants to get it right the first time

## Pain Points (Current State)

### Critical (Daily friction)
1. **The 5-Second Rule failure** — Landing on the checklist grid, Sarah cannot identify her next action within 5 seconds. She sees a wall of rows spanning all assignees, all statuses, and must filter/scroll to find her items. (Source: Carlos Avila, Doc 02 Sec 3.3)
2. **Context fragmentation** — To complete a single bank reconciliation, Sarah must: open checklist → click into rec → switch to AI matching → check review notes → upload documents → return to sign off. Each step is a different page/product area. (Source: Doc 02 Sec 1.2, Doc 04 Sec 2D)
3. **Folder navigation overhead** — Sarah must know which folder contains which account. For 15+ folders, she develops muscle memory, but any folder restructuring breaks her workflow. (Source: Doc 01 Sec 1.1)

### Significant (Weekly friction)
4. **Period selector confusion** — When switching between preparer and reviewer roles across different entities, Sarah loses track of which period she's viewing. (Source: Tim Gibson, Doc 02 Sec 3.4)
5. **Manual CSV uploads for AI matching** — When matching credit card transactions, Sarah must export from the card portal, format as CSV, and upload to FloQast because no direct connector exists. (Source: Doc 02 Sec 2.4)
6. **Review note response friction** — Review notes open in a separate thread/page. Sarah must context-switch to understand the question, find the supporting data, and respond — then navigate back. (Source: Doc 01 Sec 4.3)

### Moderate (Monthly friction)
7. **PTO delegation is admin-dependent** — Sarah can't self-delegate her tasks when she takes time off. She must email or Slack an admin to reassign. (Source: Doc 02 Sec 2.3)
8. **Template changes affect her retroactively** — When admins push template updates, Sarah's in-progress items can be disrupted. (Source: Doc 01 Sec 1.1)
9. **No visibility into downstream impact** — Sarah doesn't know if her delayed sign-off is blocking other tasks or team members. (Source: Doc 02 Sec 3.4)

## Aspirational Experience (Future State)

### Morning Ritual: "Open → Know → Do → Done"
Sarah opens FloQast at 8:30 AM and sees her **Task Inbox** — not a grid, but a prioritized list of exactly 12 items for today. Three are flagged as late (red), two are ready for her review as secondary reviewer (blue), and seven are on track (default). An AI summary at the top reads: *"2 items moved to Redo overnight after ERP balance changes. Bank Rec - Operating Account has an agent that completed 142/150 transaction matches — 8 exceptions need your review."*

She clicks the bank rec task. Instead of navigating to a separate rec page, the **Super Task Drill-Down** opens with everything in one view: the account balance comparison (GL vs. reconciled), the AI agent's match results with confidence scores, the 8 exception items highlighted, attached documents, and the review thread with her senior. She resolves 6 exceptions, tags 2 as "pending bank confirmation," and signs off as preparer — all without leaving the page.

### Key Principle Manifestations
- **Principle 1 (Master Object):** Each task in her inbox is a rich container — she never needs to "go somewhere else" for related data
- **Principle 2 (No Folders):** Sarah doesn't navigate by folder. She finds her work via the inbox (auto-filtered to her assignments) or by searching "operating account rec"
- **Principle 6 (Event-Driven):** When she signs off, the system automatically notifies her reviewer, updates the dependency chain, and triggers the next agent-eligible task
- **Principle 7 (Search-First):** Sarah uses the global search bar to find any task, account, or entity — "AP accrual Q4" instantly surfaces the right item
- **Principle 8 (Invisible AI):** The AI agent that matched 142 transactions ran overnight with zero input from Sarah. She just reviews the output.

## Technology & Tools

| Tool | Usage |
|------|-------|
| FloQast | Primary close management platform |
| ERP (NetSuite/D365/SAP) | Source of truth for TB and JE posting |
| Excel/Google Sheets | Reconciliation workbooks, schedules |
| Cloud storage (SharePoint/GDrive) | Workpaper storage, synced to FloQast |
| Slack/Teams | Communication, review note replies |

## Quotes (Synthesized from Research)

> "I just want to open FloQast and see MY tasks for TODAY. Not everyone's tasks for the whole month." — Reflecting Tim Gibson's inbox-zero vision

> "Why do I have to go to three different places to finish one reconciliation? It's all the same task." — Reflecting Doc 02 Sec 1.2 context-switching pain

> "When the AI matched 90% of my bank transactions automatically, that was amazing. But the workflow to get there — exporting, uploading, configuring — took me 30 minutes." — Reflecting Doc 02 Sec 2.4 pipeline gaps

## Metrics That Matter to Sarah

- **Tasks remaining today** — Her primary dashboard number
- **Items in "Redo" status** — Anxiety trigger; wants this at zero
- **Average time per task** — Wants to see improvement over time
- **Review note turnaround** — How fast her reviewer responds
- **Agent completion rate** — What percentage of sub-tasks AI handled
