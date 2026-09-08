# Journey Map: Template & Entity Setup

**Primary Persona:** James Torres (System Administrator)
**Flow:** Admin creates entities → configures templates → assigns permissions → manages integrations → handles ongoing maintenance
**Frequency:** Ad-hoc (acquisitions, reorgs) + monthly (template updates, permission changes)

---

## Current-State Journey

### Phase 1: Create New Entity (Acquisition Scenario — 3 New Entities)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Admin >     │───►│  Enter       │───►│  Configure     │───►│  Wait for    │
│  Create      │    │  entity      │    │  fiscal year,  │    │  folder      │
│  Entity      │    │  details     │    │  currency,     │    │  structure   │
│              │    │              │    │  settings      │    │  creation    │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                                             ╔══════╧══════╗
                                                             ║ PAIN POINT  ║
                                                             ║ Entity      ║
                                                             ║ creation    ║
                                                             ║ depends on  ║
                                                             ║ folder      ║
                                                             ║ creation.   ║
                                                             ║ If folders  ║
                                                             ║ fail =      ║
                                                             ║ "broken     ║
                                                             ║ entity"     ║
                                                             ║ requiring   ║
                                                             ║ DB fix.     ║
                                                             ╚═════════════╝
                                                                    │
                                                                    ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Create      │───►│  Mirror      │───►│  Configure     │
│  folder      │    │  folder      │    │  cloud storage │
│  structure   │    │  structure   │    │  sync for each │
│  manually    │    │  in cloud    │    │  folder        │
│  (15-20      │    │  storage     │    │                │
│  folders)    │    │              │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
      │                                       │
╔═════╧═══════╗                        ╔══════╧══════╗
║ PAIN POINT  ║                        ║ PAIN POINT  ║
║ Must create ║                        ║ Storage     ║
║ folders     ║                        ║ folder must ║
║ one by one. ║                        ║ match       ║
║ No "clone   ║                        ║ exactly or  ║
║ from other  ║                        ║ sync breaks.║
║ entity."    ║                        ╚═════════════╝
╚═════════════╝

Repeat entire process for Entity 2 and Entity 3.

╔═══════════════════════╗
║       PAIN POINT      ║
║  3 entities × 30 min  ║
║  each = 1.5+ hours    ║
║  of repetitive setup. ║
║  No batch creation.   ║
╚═══════════════════════╝
```

**Time:** 30-60 minutes per entity

### Phase 2: Configure Templates

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Open        │───►│  Create or   │───►│  Map template  │───►│  Apply to    │
│  Template    │    │  edit        │    │  items to      │    │  entity +    │
│  Manager     │    │  template    │    │  folders       │    │  period      │
│              │    │              │    │  (by name)     │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                              │                      │
                                       ╔══════╧══════╗       ╔══════╧══════╗
                                       ║ PAIN POINT  ║       ║ PAIN POINT  ║
                                       ║ Template    ║       ║ Apply to    ║
                                       ║ matches by  ║       ║ EACH entity ║
                                       ║ FOLDER NAME.║       ║ individually║
                                       ║ Rename a    ║       ║ No "apply   ║
                                       ║ folder →    ║       ║ to all      ║
                                       ║ template    ║       ║ entities."  ║
                                       ║ breaks.     ║       ╚═════════════╝
                                       ╚═════════════╝
```

### Phase 3: Assign Permissions

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  For each    │───►│  For each    │───►│  Grant folder- │
│  new entity  │    │  user who    │    │  level access  │
│              │    │  needs       │    │  (one folder   │
│              │    │  access      │    │  at a time)    │
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ 3 entities  ║
                                       ║ × 10 users  ║
                                       ║ × 15 folders║
                                       ║ = 450       ║
                                       ║ individual  ║
                                       ║ permission  ║
                                       ║ grants. Not ║
                                       ║ role-based. ║
                                       ╚═════════════╝
```

**Time:** 1-3 hours for complex permission setup

### Phase 4: Ongoing Template Maintenance

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Improve a   │───►│  Apply       │───►│  Repeat for    │
│  template    │    │  update to   │    │  each entity   │
│  (add step,  │    │  Entity 1    │    │  (14 more)     │
│  change      │    │              │    │                │
│  assignee)   │    │              │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ 15 entities ║
                                       ║ = 15 manual ║
                                       ║ template    ║
                                       ║ applies.    ║
                                       ║ Hours of    ║
                                       ║ work, error ║
                                       ║ prone.      ║
                                       ╚═════════════╝
```

### Phase 5: Handle PTO Delegation Requests

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Receive     │───►│  Navigate to │───►│  Reassign each │───►│  Set         │
│  "Sarah is   │    │  entity +    │    │  of Sarah's    │    │  reminder to │
│  OOO next    │    │  period      │    │  items to      │    │  switch back │
│  week"       │    │              │    │  backup        │    │  after PTO   │
│  Slack msg   │    │              │    │                │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
      │                                                             │
╔═════╧═══════════╗                                          ╔══════╧══════╗
║   PAIN POINT    ║                                          ║ PAIN POINT  ║
║  Delegation     ║                                          ║ Manual      ║
║  cannot be      ║                                          ║ tracking of ║
║  self-service.  ║                                          ║ when to     ║
║  Users must     ║                                          ║ revert.     ║
║  ask admin.     ║                                          ║ Often       ║
║  James handles  ║                                          ║ forgotten.  ║
║  5-10 of these  ║                                          ╚═════════════╝
║  per month.     ║
╚═════════════════╝
```

---

## Aspirational Journey

### Phase 1: Batch Entity Creation (Principle 2: No Folders, Principle 4: Universal Ingestion)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Admin >     │───►│  CREATE ENTITIES FROM TEMPLATE                      │
│  "Create     │    │                                                     │
│  Entities"   │    │  Template: [Gold Standard Close Process ▼]          │
│              │    │                                                     │
│              │    │  ┌── New Entities ────────────────────────────────┐ │
│              │    │  │ Name           │ ERP       │ Region │ FY End  │ │
│              │    │  │ Acme Corp      │ NetSuite  │ US     │ Dec     │ │
│              │    │  │ Acme Europe    │ SAP       │ EMEA   │ Dec     │ │
│              │    │  │ Acme APAC      │ NetSuite  │ APAC   │ Mar     │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Configuration Preview ──────────────────────┐ │
│              │    │  │ Each entity will receive:                      │ │
│              │    │  │ • 45 task templates (from Gold Standard)       │ │
│              │    │  │ • 12 AI agent configurations (cloned)          │ │
│              │    │  │ • Role-based permissions (inherited)            │ │
│              │    │  │ • ERP connection (validated during setup)       │ │
│              │    │  │ • Process groups: Cash, AR, AP, Revenue,       │ │
│              │    │  │   Payroll, Fixed Assets, IC, Tax               │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  [Validate ERP Connections ▶]  [Create All ▶]      │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Batch creation — 3 entities at once, not sequentially
✅ Template-based — Gold Standard config applied automatically
✅ No folder dependency — entities use process groups and tags
✅ ERP validation inline — catch connection issues before creation
✅ Agent configuration cloned — AI matching rules transfer automatically
```

**Time:** 10-15 minutes for 3 entities (down from 1.5-3 hours)

### Phase 2: Global Template Management (Principle 6: Event-Driven)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Template    │───►│  TEMPLATE MANAGEMENT                                │
│  Manager     │    │                                                     │
│              │    │  Template: AP Accrual Process                       │
│              │    │                                                     │
│              │    │  ┌── Changes ─────────────────────────────────────┐ │
│              │    │  │ + Added sub-task: "PO Matching" (AI agent)     │ │
│              │    │  │ ~ Changed reviewer: Team Lead → AP Manager     │ │
│              │    │  │ + Added dependency: Requires "AP Sub-Ledger"   │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Push Scope ──────────────────────────────────┐ │
│              │    │  │ Apply to: [All Entities ▼]                     │ │
│              │    │  │                                                │ │
│              │    │  │ Impact Preview:                                │ │
│              │    │  │ • 15 entities affected                        │ │
│              │    │  │ • 15 active periods updated                   │ │
│              │    │  │ • 3 entities have local overrides (preserved) │ │
│              │    │  │ • 15 new sub-tasks created                    │ │
│              │    │  │ • 15 new AI agent assignments                 │ │
│              │    │  │ • Estimated time savings: 40 hrs/close cycle  │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  [Preview Changes ▶]  [Push to All Entities ▶]     │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Global push — one action updates all 15 entities
✅ Impact preview — James sees exactly what will change before confirming
✅ Local overrides preserved — entities with customizations aren't broken
✅ Event-driven propagation — changes flow through the system with validation
```

### Phase 3: Role-Based Permissions (Principle: ReBAC)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Permission  │───►│  ROLE MANAGEMENT                                    │
│  Manager     │    │                                                     │
│              │    │  ┌── Roles ───────────────────────────────────────┐ │
│              │    │  │ AP Reviewer                                    │ │
│              │    │  │   Can: Review tasks tagged "AP"                │ │
│              │    │  │   Scope: All assigned entities                 │ │
│              │    │  │   Members: David Park, Lisa Wong               │ │
│              │    │  │                                                │ │
│              │    │  │ Cash Preparer                                  │ │
│              │    │  │   Can: Prepare tasks tagged "Cash & Banking"   │ │
│              │    │  │   Scope: Assigned entities only                │ │
│              │    │  │   Members: Sarah Chen, James Liu               │ │
│              │    │  │                                                │ │
│              │    │  │ Controller                                     │ │
│              │    │  │   Can: View all, reassign, approve overrides   │ │
│              │    │  │   Scope: All entities in business unit         │ │
│              │    │  │   Members: Maria Gonzalez                      │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  When new entities are created, role assignments   │
│              │    │  automatically propagate — no per-entity grants.   │
│              │    │                                                     │
│              │    │  [Create Role]  [Edit Role]  [Audit Log]           │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Role-based — define once, applies everywhere
✅ Tag-based scope — "AP" tasks, not "AP folder"
✅ Auto-propagation — new entities get correct permissions automatically
✅ Audit log — complete history of permission changes with reasons
```

### Phase 4: Self-Service Delegation (Principle 6: Event-Driven)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Sarah (not  │───►│  DELEGATE MY TASKS                                  │
│  James)      │    │                                                     │
│  opens       │    │  I'll be out: [Mar 3] to [Mar 7]                   │
│  delegation  │    │                                                     │
│              │    │  ┌── My Tasks During This Period ─────────────────┐ │
│              │    │  │ 8 tasks due Mar 3-7                            │ │
│              │    │  │                                                │ │
│              │    │  │ Delegate to: [Lisa Wong ▼]                     │ │
│              │    │  │ (System suggests: Lisa has capacity +          │ │
│              │    │  │  correct entity access + similar role)         │ │
│              │    │  │                                                │ │
│              │    │  │ ✅ Auto-reassign back to me on Mar 8           │ │
│              │    │  │ ✅ Notify Lisa and my manager                   │ │
│              │    │  │ ✅ Log delegation for audit trail               │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  [Delegate ▶]                                       │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Self-service — no admin needed
✅ Permission-aware — system validates delegate's access
✅ Auto-revert — tasks automatically return after PTO
✅ Audit trail — delegation logged with dates and reason
✅ James freed from 5-10 delegation requests per month
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Entity creation time | 30-60 min each | 5 min (batch) | 85-92% reduction |
| Template global push | Not available (per-entity) | One-click, all entities | New capability |
| Permission setup (new entity) | 1-3 hours (450 grants) | 5 min (role assignment) | 95%+ reduction |
| PTO delegation | Admin-mediated, hours | Self-service, 2 min | 95% reduction |
| Template breakage risk | High (folder-name coupling) | Zero (tag-based) | Full elimination |
| "Broken entity" errors | Occasional (folder dependency) | Zero (decoupled) | Full elimination |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 2. No Folders | Entity creation decoupled from folder structure |
| 4. Universal Ingestion | Standardized ERP connections validated during entity setup |
| 5. ReBAC | Role-based permissions replace per-folder grants |
| 6. Event-Driven | Template pushes propagate as events; delegation triggers auto-revert |
| 8. Invisible AI | System suggests delegation targets based on workload and access |
