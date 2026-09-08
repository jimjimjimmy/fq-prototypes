# Transition Mapping: Current State → Target State

**Purpose:** Map every current data entity to its target state equivalent, providing a concrete migration guide for the data transformation.

---

## Entity Mapping Table

| Current Entity | Current Collection | Target Entity | Target Location | Migration Strategy |
|---------------|-------------------|---------------|-----------------|-------------------|
| Top-Level Client | `toplevelclients` | `Tenant` | Task Service DB | Rename + simplify; preserve `tlcId` as `tenantId` |
| Company | `companies` | `Entity` | Task Service DB | Rename; move ERP config to `ERPConnection` |
| Folder | `folders` | **Eliminated** | N/A | Split into 3: Process Group, Role, Document |
| Procedure (Checklist Item) | `procedures` | `SuperTask` | Task Service DB | Enrich with sub-tasks, process group, account link |
| Reconciliation | `reconciliations` | `SuperTask` (type: rec) + `ReconciliationData` | Task Service DB | Merge into unified task; balance via FloLake |
| Template | `templates` | `Template` + `TemplateTask` + `TemplateSubTask` | Task Service DB | Hierarchical restructure; remove folder-name matching |
| Review Note | `reviewnotes` | `ReviewNote` | Task Service DB | Enhance with threading, types, sub-task scope |
| Signature | embedded in `procedures` | `Signature` | Task Service DB | Extract to first-class entity with balance snapshot |
| Tag | `tags` | `Tag` | Task Service DB | Expand: add types, colors, workflow trigger rules |
| Storage Metadata | `storagemetadatas` | `Document` | Document Service DB | Decouple from folders; attach to tasks directly |
| Workflow | `workflows` | `WorkflowRule` | Workflow Engine DB | Convert static rules to event-driven rules |
| Task (Ad-hoc) | `tasks` | `SuperTask` (type: ad_hoc) | Task Service DB | Absorb into unified task model |
| Adhoc Project | `adhoc-projects` | `SuperTask` group (via tags) | Task Service DB | Replace with tag-based grouping |
| Procedure JEs | `procedurejournalentries` | `JournalEntry` (embedded in SuperTask) | Task Service DB | Move to task composition |
| Bulk Edit Job | `bulkeditjobs` | Event-driven batch processing | Workflow Engine | Replace with workflow rules |
| WF Analytics Export | `workflow-analytics-export-information` | Analytics export job | Analytics Service | Minimal change |
| Users | `users` | `User` | Auth Service (GAuth) | Align with GAuth migration |
| — | N/A (new) | `SubTask` | Task Service DB | New entity |
| — | N/A (new) | `ProcessGroup` | Task Service DB | New entity (replaces folder org) |
| — | N/A (new) | `Role` + `RolePermission` | Permission Service | New entity (replaces folder perms) |
| — | N/A (new) | `TransactionLink` | Task Service DB | New entity (FloLake bridge) |
| — | N/A (new) | `Delegation` | Task Service DB | New entity |
| — | N/A (new) | `AgentExecution` | Task Service DB | New entity |
| — | N/A (new) | `AIInsight` | AI Orchestration DB | New entity |
| — | N/A (new) | `SavedView` | Task Service DB | New entity |
| — | N/A (new) | `StatusTransition` | Task Service DB | New entity |

---

## Field-Level Mapping: `procedures` → `SuperTask`

| Current Field (`procedures`) | Target Field (`SuperTask`) | Transformation |
|------------------------------|---------------------------|----------------|
| `_id` | `id` | Direct map |
| `tlcId` (via company) | `tenantId` | Resolve from company chain |
| `companyId` (via folder) | `entityId` | Resolve from folder → company |
| — (derived from period context) | `periodId` | Extract YYYY-MM from period |
| `folderId` | `processGroup` | Map folder.name → processGroup.name |
| — | `accountId` | Map from rec account or template config |
| `name` | (sub-task title or task title) | Preserve |
| `status` | `status` | Map: incomplete→not_started, complete→completed, redo→redo |
| `preparer` | `preparer.userId` | Direct map |
| `reviewer` | `reviewer.userId` | Direct map |
| `dueDate` | `dueDate` | Direct map |
| `dependencies` | `dependencies[]` | Map procedure IDs → SuperTask IDs |
| `tags` | `tags[]` | Direct map (Tag entities preserved) |
| — (from `reconciliations`) | `reconciliation` | Merge rec data for rec-type tasks |
| — (new) | `subTasks[]` | Generate from task type template |
| — (new) | `agentHistory[]` | Empty (populated going forward) |

## Field-Level Mapping: `folders` → Decomposed Entities

| Current Field (`folders`) | Target Entity | Target Field | Notes |
|--------------------------|---------------|-------------|-------|
| `name` | `ProcessGroup` | `name` | "Accounts Payable" → process group |
| `parentFolderId` | `ProcessGroup` | `category` | Hierarchy flattened |
| `permissions` | `Role` + `RolePermission` | `action`, `scopeType`, `scopeValue` | Decompose per-user grants into roles |
| `storageProviderId` | `Document` | `storageProvider` | Per-document, not per-folder |
| `isLocked` | `Period` | `status: 'locked'` | Move to period-level |
| `companyId` | `ProcessGroup` | `tenantId` | Scope changes from company to tenant |

## Field-Level Mapping: `reconciliations` → `SuperTask` (type: rec) + `ReconciliationData`

| Current Field (`reconciliations`) | Target Location | Transformation |
|----------------------------------|-----------------|----------------|
| `_id` | `SuperTask.id` | Generate new unified ID; maintain mapping table |
| `folderId` | `SuperTask.processGroup` | Map folder → process group |
| `procedureId` | `SuperTask.id` | Merge into single task |
| `glBalance` | `ReconciliationData.glBalance` | Source shifts from ERP pull to FloLake |
| `reconciledBalance` | `ReconciliationData.reconciledBalance` | Source shifts from #FQ anchor to computed |
| `materialityThreshold` | `ReconciliationData.materialityThreshold` | Direct map |
| `signatures` | `SuperTask.signatures[]` | Extract to first-class entities |
| `anchorPoints` | **Eliminated** | Replaced by FloLake TransactionLink |
| `storageFileId` | `SuperTask.documents[]` | Move to Document entity |

---

## Migration Phases

### Phase 0: Preparation (Non-Breaking)
- Create new database schemas alongside existing
- Build ID mapping tables (old ID → new ID)
- Deploy new services in read-only shadow mode
- Set up dual-write infrastructure

### Phase 1: Data Copy + Enrichment
```
1. Copy `toplevelclients` → `Tenant` (1:1 mapping)
2. Copy `companies` → `Entity` (extract ERP config → `ERPConnection`)
3. Analyze `folders` → create `ProcessGroup` entities (deduplicate names)
4. Analyze `folders.permissions` → create `Role` + `RolePermission` entities
5. For each `procedure`:
   a. Create `SuperTask` with mapped fields
   b. Generate default `SubTask` list from task type template
   c. Copy `signatures` → `Signature` entities
   d. Copy linked `reviewnotes` → `ReviewNote` entities
   e. Copy linked `storagemetadatas` → `Document` entities
   f. If procedure has linked `reconciliation`:
      - Merge rec data into `SuperTask.reconciliation`
      - Create `TransactionLink` stubs (populated when FloLake data available)
6. Copy `tags` → `Tag` (with expanded type/color attributes)
7. Convert `templates` → hierarchical `Template` + `TemplateTask` + `TemplateSubTask`
8. Convert `workflows.rules` → `WorkflowRule` (event-driven format)
```

### Phase 2: Dual-Write Mode
```
All writes go to BOTH old and new databases:
- checklist-client writes to procedures AND SuperTask
- Feature flag controls which database the UI reads from
- Validation: compare old and new states for consistency
- Duration: 2-4 weeks per service
```

### Phase 3: Read Cutover
```
Feature-flagged per entity (SMM first, enterprise last):
- UI reads from new SuperTask model
- Writes still dual-write to both
- Rollback: flip flag to read from old model
```

### Phase 4: Write Cutover + Old Decommission
```
Once stable:
- Stop dual-write
- New model is sole source of truth
- Old collections enter read-only archive mode
- Decommission after audit/compliance retention period
```

---

## ID Mapping Strategy

Every migration must maintain backward compatibility for:
- Deep links (URLs containing old IDs)
- API consumers (external integrations referencing old IDs)
- Audit trail (old signatures reference old procedure IDs)
- Analytics (Gold Layer references old IDs)

```typescript
interface IDMapping {
  oldCollection: string;    // "procedures"
  oldId: string;           // MongoDB ObjectId
  newEntity: string;       // "SuperTask"
  newId: string;           // New globally unique ID
  createdAt: Date;
}

// All APIs accept BOTH old and new IDs during transition
// Old IDs resolve via mapping table → new entity
// New IDs are the canonical reference going forward
```

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Data loss during migration | Shadow-mode validation before cutover; old data archived, not deleted |
| Permission regression | Automated comparison: for every user-task pair, verify new ReBAC grants same access as old folder permissions |
| Template breakage | Templates migrated from folder-name matching to processGroup matching; validation suite tests all entities |
| Performance degradation | New model indexes designed for common query patterns; load testing before cutover |
| Rollback needed | Feature flags enable instant rollback per entity; dual-write means old data is always current |
| FloLake dependency | TransactionLink is additive; tasks work without it. FloLake integration is progressive enhancement. |
