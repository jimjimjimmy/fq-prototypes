# Persona: James Torres — System Administrator

**Role:** System Administrator / FloQast Champion
**Archetype:** The Architect — "Give me reliable building blocks that don't break when I rearrange them."

---

## Demographics & Context

| Attribute | Detail |
|-----------|--------|
| Title | Sr. Accountant (Admin), Accounting Systems Admin, FloQast Champion |
| Experience | 5-12 years in accounting; often the longest-tenured FloQast user |
| Reports to | Controller or Director of Accounting |
| Team size | Serves 10-50+ users as the internal FloQast expert |
| Entity scope | All entities — full system access |
| Daily FloQast time | 1-3 hours (heavy during setup/close setup weeks) |
| Technical comfort | High; comfortable with configuration, integrations, some scripting |
| CPA status | Often CPA; may have IT systems exposure |

## Key Responsibilities

1. **Entity and period management** — Create new entities, configure periods, manage entity-level settings (fiscal year, currencies, holidays)
2. **Template management** — Create, maintain, and push checklist templates across entities and periods
3. **Permission management** — Assign user roles, manage entity access, configure approval workflows
4. **Integration management** — Configure ERP connections, storage integrations, manage data refresh schedules
5. **Agent/automation setup** — Configure Transform agents, AI matching rules, and automated workflows
6. **User support and training** — Serve as internal help desk for FloQast issues, onboard new users
7. **Platform optimization** — Identify opportunities for automation, customize workflows, manage feature flag rollouts

## Goals & Motivations

- **Reliable, predictable configuration** — When James sets up a template, configures a permission, or creates an entity, he needs it to work correctly every time, without unexpected side effects. (Source: Doc 01 Sec 1.1)
- **Scale without fragility** — James manages a growing organization. Adding an entity, pushing a template update, or modifying a permission shouldn't risk breaking existing configurations. (Source: Doc 01 Sec 4.4)
- **Self-service for the team** — Wants to reduce the number of admin requests by enabling users to self-serve on common tasks: PTO delegation, view customization, basic report generation. (Source: Doc 02 Sec 2.3)
- **Efficient bulk operations** — When adding 5 new entities from an acquisition, James needs to replicate the folder structure, templates, permissions, and integrations efficiently — not one entity at a time. (Source: Doc 01 Sec 4.4)
- **Visibility into system health** — Wants to know: Are all ERP connections healthy? Are data refreshes completing on time? Are any agents failing? (Source: Doc 03 Sec 2.8)

## Pain Points (Current State)

### Critical
1. **Template fragility** — Templates are "timeless" — they don't correspond to a specific period. When applied, they match by folder name. If James renames or merges a folder, applying the template to an older period can inadvertently delete items or create orphaned tasks. The UConn Health incident (Doc 01 Sec 1.1) is a known example. (Source: Doc 01 Sec 1.1)
2. **Entity creation failures** — The tight coupling of entities to folder structures in the database leads to "broken entity" errors when folder creation fails. This requires James to escalate to FloQast support for manual database intervention — he can't fix it himself. (Source: Doc 01 Sec 1.1)
3. **Permissions tied to folders, not roles** — James must manage permissions at the folder level. When the organization restructures (merging departments, acquiring entities), he must manually rebuild folder permissions. There's no way to say "David can review anything in AP across all entities" — instead, James must grant David access to the AP folder in each entity individually. (Source: Doc 01 Sec 1.1, Doc 03 Sec 8)

### Significant
4. **No global template push** — When James improves a close process template, he cannot push that update to all entities at once. He must manually update each entity's template individually. For 15 entities, this takes hours and is error-prone. (Source: Doc 02 Sec 2.3)
5. **570+ feature flags** — The legacy feature flag accumulation means James's users may have different feature availability depending on their account's flag state. He has no visibility into which flags are active or what they affect. (Source: Doc 01 Sec 4.4)
6. **PTO delegation requires admin action** — When a preparer goes on PTO, they can't reassign their own tasks. James must manually update assignments, then remember to switch them back. (Source: Doc 02 Sec 2.3)

### Moderate
7. **Integration monitoring is opaque** — James configures ERP connections and data refresh schedules, but when a refresh fails, the error messages are cryptic. He often has to escalate to FloQast support. (Source: Doc 01 Sec 1.4)
8. **Agent configuration complexity** — Transform agents require training-by-example, which can take 36 hours for complex use cases. When organizational changes invalidate an agent's rules, James must rebuild from scratch. (Source: Doc 02 Sec 2.5)
9. **No audit of admin actions** — James makes hundreds of configuration changes. There's no admin audit log showing what he changed, when, and why — making it hard to troubleshoot issues or demonstrate compliance. (Source: Doc 03 Sec 7.2)

## Aspirational Experience (Future State)

### The Configuration Studio: "Template → Apply → Verify → Scale"
James needs to onboard 3 new entities from a recent acquisition. He opens the **Admin Console** and selects "Create Entities from Template." He chooses the organization's master close template (the "gold standard" configuration) and provides the entity details: names, ERP connections, fiscal year settings, and team assignments.

The system creates all 3 entities simultaneously with: correct folder-free organizational structure (tags and process groups instead of folders), appropriate permission grants based on role definitions (not folder assignments), agent configurations cloned from the most similar existing entity, and ERP connections validated during setup. James sees a progress indicator and a validation summary: *"3 entities created. 45 tasks configured. 12 agents deployed. 3 ERP connections validated. 0 errors."*

Later, James improves the AP accrual process: adding a new sub-task for PO matching and assigning an AI agent. He opens **Template Management**, selects the AP Accrual template, makes his changes, and clicks "Push to All Entities." A preview shows: *"This update will affect 15 entities, 15 active periods. 3 entities have custom overrides that will be preserved. Estimated impact: 15 new sub-tasks, 15 new agent assignments."* James confirms, and the update propagates globally in seconds.

### Permission Management: Role-Based, Not Folder-Based
Instead of granting David access to the "AP" folder in 6 entities, James defines a role: "AP Reviewer — can review any task tagged with AP across all assigned entities." He assigns David the role once. When new entities are added, David automatically has the correct access — no manual folder-level grants needed.

### Key Principle Manifestations
- **Principle 2 (No Folders):** Entity creation no longer depends on folder structure creation — eliminating the class of "broken entity" errors
- **Principle 5 (ReBAC):** Permissions are role-based and relationship-based, not folder-based — dramatically reducing the combinatorial explosion of permission grants
- **Principle 4 (Universal Ingestion):** ERP connections use a standardized integration layer — new entities connect through configuration, not custom pipeline development
- **Principle 6 (Event-Driven):** Template pushes trigger event-driven propagation — changes flow through the system automatically, with validation at each step

## Technology & Tools

| Tool | Usage |
|------|-------|
| FloQast Admin Console | Entity/template/permission/integration management |
| FloQast Transform | Agent configuration and monitoring |
| ERP Admin | Connection credentials, data mapping |
| Cloud storage admin | Folder structure, permissions sync |
| Slack/email | Support requests, user communication |
| Jira/support portal | FloQast support escalation |

## Quotes (Synthesized from Research)

> "I dread acquisition season. Each new entity takes me a full day to set up — folders, templates, permissions, integrations. And if one thing breaks, I might not know for a month." — Reflecting Doc 01 Sec 1.1, Doc 01 Sec 4.4

> "I should be able to say 'David can review AP tasks' and have that work everywhere. Instead, I'm managing permissions folder by folder, entity by entity." — Reflecting Doc 01 Sec 1.1, Doc 03 Sec 8

> "I changed one folder name and it broke the template for that entire entity. I didn't even know until someone reported missing checklist items. That's terrifying." — Reflecting the UConn Health incident, Doc 01 Sec 1.1

## Metrics That Matter to James

- **Entity setup time** — Hours to fully configure a new entity (target: under 1 hour)
- **Template propagation success rate** — Percentage of pushes completing without errors
- **Permission change turnaround** — Time from request to implementation
- **Integration health** — Percentage of data connections operating normally
- **Support ticket volume** — Indicator of platform friction
- **Agent uptime** — Percentage of automated agents completing without failure
- **Admin action audit trail** — Complete log of all configuration changes
