# Migration Strategy: Strangler Fig Pattern

**Purpose:** Define the phased approach to migrating from the current folder-centric architecture to the target task-centric architecture, ensuring zero downtime and backward compatibility for 3,500+ customers.

---

## Strategy: Strangler Fig

The strangler fig pattern is already proven at FloQast — the ECS migration (Doc 03 Sec 3) uses this exact approach: new services stand up alongside existing ones, traffic migrates via feature flags (Harness), old services are decommissioned after validation.

```
┌────────────────────────────────────────────────────────────────────┐
│                      STRANGLER FIG PATTERN                         │
│                                                                    │
│  Phase 1        Phase 2         Phase 3         Phase 4            │
│  ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐          │
│  │████████│     │████░░░░│     │██░░░░░░│     │░░░░░░░░│          │
│  │OLD     │     │OLD  NEW│     │OLD  NEW│     │    NEW │          │
│  │████████│     │████████│     │████████│     │████████│          │
│  └────────┘     └────────┘     └────────┘     └────────┘          │
│  All traffic    Traffic split    Most traffic   All traffic         │
│  to old         via feature      to new; old    to new; old        │
│  system         flags            in fallback    decommissioned     │
└────────────────────────────────────────────────────────────────────┘
```

## Migration Phases

### Phase 0: Foundations (Months 1-2)

**Goal:** Infrastructure prerequisites that all subsequent phases depend on.

| Workstream | Deliverable | Dependency |
|-----------|------------|------------|
| Event Bus | SNS/SQS topic infrastructure deployed | None |
| GAuth alignment | New services use GAuth tokens; legacy token bridge in place | GAuth Phase A |
| Feature flag framework | Harness flag naming convention + per-entity rollout tooling | None |
| Data migration tooling | ID mapping tables, dual-write library, validation framework | None |
| Monitoring | Distributed tracing, service dashboards, alerting | None |

### Phase 1: Permission Service + Search Service (Months 2-4)

**Goal:** Stand up the two services that are prerequisites for everything else.

**Permission Service (ReBAC):**
```
1. Deploy Permission Service alongside existing folder-permission checks
2. Run one-time migration: analyze folder permissions → create Roles + RolePermissions
3. Shadow mode: every permission check runs against BOTH old and new
   - Log discrepancies; fix until zero mismatches
4. Feature flag: switch read path from folder permissions to ReBAC
   - Per entity, SMM customers first
5. Validation: automated test suite confirms access parity
6. After 100% rollout: remove folder-permission read path
```

**Search Service:**
```
1. Deploy OpenSearch cluster + Search Service
2. Backfill index from existing procedures, reconciliations, tags
3. Feature flag: show search bar in UI (alongside existing navigation)
   - Search results link to existing pages initially
4. Iterate on ranking, relevance, facets based on usage data
5. Search becomes primary navigation (Catalyst integration)
```

### Phase 2: Task Service Core (Months 3-6)

**Goal:** Deploy the Super Task model as the new source of truth for task data.

```
Phase 2a: Schema + Dual-Write (Month 3-4)
──────────────────────────────────────────
1. Create super_tasks collection alongside procedures
2. Deploy dual-write middleware:
   - Every write to procedures also writes to super_tasks
   - Transformation: procedure fields → SuperTask fields
   - Process group assigned from folder name mapping
3. Backfill: migrate all historical procedures → super_tasks
4. Validation: nightly comparison job, zero-discrepancy target

Phase 2b: Read Cutover (Month 4-5)
───────────────────────────────────
1. New API endpoints: GET /v2/tasks, GET /v2/tasks/:id
2. Feature flag: UI reads from super_tasks instead of procedures
   - Per entity rollout
   - A/B testing: verify identical user experience
3. Search Service re-indexes from super_tasks

Phase 2c: Write Cutover (Month 5-6)
────────────────────────────────────
1. New write endpoints: POST/PUT/DELETE /v2/tasks
2. Feature flag: UI writes to Task Service directly
3. Dual-write reversed: Task Service writes to procedures (backward compat)
4. After validation: stop backward write to procedures
5. procedures collection enters read-only archive mode
```

**Sub-Task Generation:**
```
During migration, Super Tasks get default sub-tasks based on task type:
- Checklist items: [Prepare → Attach Evidence → Sign Off → Review]
- Reconciliations: [Import Data → Match → Review Exceptions → Verify Balance → Sign Off → Review]
- Compliance: [Evidence Collection → Control Testing → Sign Off → Review]

These are refinable by admins after migration.
```

### Phase 3: Workflow Engine + Document Service (Months 5-8)

**Workflow Engine:**
```
1. Deploy Workflow Engine service
2. Translate existing static workflow rules → event-driven WorkflowRules
3. Replace Step Functions:
   a. Replication → period_opened event chain
   b. Bulk Edit → batch_update event with parallel workers
   c. Adhoc Projects → ad_hoc task creation events
4. Feature flag: new event-driven orchestration vs. old Step Functions
5. Validate: same outcomes, same audit trail
6. Decommission Step Functions after validation
```

**Document Service:**
```
1. Deploy Document Service
2. Migrate storagemetadatas → Document entities
3. Storage provider integrations (Box, GDrive, OneDrive, etc.) move to Document Service
4. Feature flag: document operations go through Document Service
5. Documents now attached to tasks, not folders
```

### Phase 4: AI Orchestration + FloLake Integration (Months 7-10)

**AI Orchestration:**
```
1. Deploy unified AI Orchestration Service
2. Migrate services one at a time (lowest risk first):
   a. Remind Language Processor (simplest, lowest traffic)
   b. Checkmate API (low traffic, function calling)
   c. FloQL Backend (Bedrock, analytics)
   d. AI Matching (highest complexity, hardened sandbox)
   e. Monitors Agent (Bedrock Agent, multi-step)
3. Each migration: deploy behind Orchestration Service → validate → cut traffic → decommission
4. Agent Registry populated with all active agents + ROI tracking enabled
```

**FloLake Integration (Transaction-Task Bridge):**
```
1. Task Service subscribes to FloLake SNS events
2. For entities with FloLake: create TransactionLinks from Silver Layer data
3. Reconciliation tasks: compute balances from FloLake transactions
   - Parallel with existing #FQ anchor balance for validation
4. Feature flag: UI shows FloLake-computed balance vs. anchor balance
5. When parity confirmed: decommission #FQ anchor balance path
6. Per-entity rollout based on ERP integration availability in FloLake
```

### Phase 5: Analytics + Cleanup (Months 9-12)

```
1. Analytics Service reads from super_tasks + event stream (not procedures)
2. Gold Layer schema updated: dim_folder → dim_process_group
3. Executive dashboard, ROI metrics, cross-entity benchmarking go live
4. Cleanup:
   - Remove dual-write code
   - Remove feature flags (per Harness migration cadence)
   - Archive old collections
   - Decommission legacy Lambda functions
   - Update API documentation
```

---

## Feature Flag Strategy

```
Naming Convention:
  close-rearch-{phase}-{service}-{capability}-{scope}

Examples:
  close-rearch-p1-rebac-permission-check-entity-a
  close-rearch-p2-task-service-read-smm
  close-rearch-p2-task-service-write-enterprise
  close-rearch-p3-workflow-engine-replication-all

Rollout Order:
  1. Internal (FloQast dogfood accounts)
  2. Beta customers (opted-in)
  3. SMM customers (< 5 entities)
  4. Mid-market customers (5-20 entities)
  5. Enterprise customers (20+ entities)
  6. Global (100%)

Rollback:
  Every flag has a documented rollback procedure.
  Dual-write ensures old system data is current during transition.
  Rollback = flip flag + resume reading from old system.
```

## Data Migration Safeguards

| Safeguard | Implementation |
|-----------|---------------|
| **No data deletion** | Old collections archived, never deleted, for compliance retention |
| **ID mapping** | Bidirectional mapping table; all APIs accept old AND new IDs |
| **Validation jobs** | Nightly comparison between old and new data stores |
| **Shadow mode** | New services run in parallel, results compared, before any cutover |
| **Audit trail continuity** | Old signatures/transitions preserved with mapping to new entity IDs |
| **Rollback capability** | Every phase is rollback-safe via feature flags + dual-write |
| **Customer communication** | No visible changes until read cutover; then opt-in beta first |

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Dual-write performance overhead | Medium | Medium | Write-through cache; async secondary writes; monitor latency |
| Permission regression during ReBAC cutover | High | Critical | Automated parity testing; shadow mode validation; per-entity rollout |
| FloLake data not available for all ERPs | High | Medium | TransactionLink is additive; #FQ anchor remains fallback |
| Search index inconsistency | Medium | Low | Periodic full re-index job; event replay capability |
| Enterprise customer resistance | Medium | High | Opt-in beta; customer success outreach; extended parallel-run period |
| GAuth dependency delays | Medium | High | New services support both legacy and GAuth tokens (bridge mode) |
| MongoDB connection pool exhaustion | Medium | Medium | Per-service connection limits; pool monitoring; circuit breakers |

## Timeline Summary

```
Month:  1   2   3   4   5   6   7   8   9   10  11  12
        ├───┤
        Phase 0: Foundations
            ├───────────┤
            Phase 1: ReBAC + Search
                ├───────────────┤
                Phase 2: Task Service
                        ├───────────────┤
                        Phase 3: Workflow + Docs
                                ├───────────────┤
                                Phase 4: AI + FloLake
                                        ├───────────┤
                                        Phase 5: Analytics + Cleanup
```

**Total duration: ~12 months** for full architecture cutover, with incremental value delivery starting at Month 3 (search) and Month 4 (unified task views).
