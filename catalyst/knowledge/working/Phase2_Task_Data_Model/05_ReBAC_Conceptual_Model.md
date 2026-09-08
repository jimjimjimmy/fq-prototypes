# ReBAC Conceptual Model: Permissions Decoupled from Folders

**Purpose:** Define a Relationship-Based Access Control (ReBAC) model that replaces folder-level permissions with role-based, relationship-based access control scoped by entity, process group, and tag.

---

## The Problem

Today, permissions are granted at the folder level:
- User A has "preparer" access to the "AP" folder in Entity 1
- To grant access across 6 entities, you need 6 separate grants per folder
- 15 folders × 6 entities × 10 users = **900 individual permission assignments**
- Reorganizing folders risks breaking permission grants
- No way to express "can review anything tagged high-risk" or "can prepare any Cash task across all entities"

## The Model

### Core Concepts

```
┌─────────────────────────────────────────────────────────┐
│                     ReBAC MODEL                          │
│                                                          │
│  USER ──has──► ROLE ──grants──► PERMISSION               │
│                                    │                     │
│                              ┌─────┼─────┐               │
│                              ▼     ▼     ▼               │
│                           ACTION  SCOPE  SCOPE           │
│                                   TYPE   VALUE           │
│                                                          │
│  "David has the AP Reviewer role, which grants           │
│   review permission scoped to process_group:AP           │
│   across all his assigned entities."                     │
└─────────────────────────────────────────────────────────┘
```

### Entity Definitions

```typescript
// Roles are named permission bundles
interface Role {
  id: string;
  tenantId: string;
  name: string;                        // "AP Reviewer"
  description: string;
  isSystemRole: boolean;               // true for predefined roles
  permissions: Permission[];
}

// Permissions define what actions are allowed on what scope
interface Permission {
  id: string;
  roleId: string;
  action: Action;
  scopeType: ScopeType;
  scopeValue: string;                  // The specific scope target
}

// Actions a user can take
type Action =
  | 'prepare'          // Can be assigned as preparer; can sign off
  | 'review'           // Can be assigned as reviewer; can approve/reject
  | 'view'             // Can see tasks and their details (read-only)
  | 'delegate'         // Can delegate tasks to others
  | 'reassign'         // Can reassign tasks (manager action)
  | 'configure'        // Can modify templates, agents, settings
  | 'admin';           // Full administrative access

// Scope types define what dimension the permission applies to
type ScopeType =
  | 'all'              // Access to everything in assigned entities
  | 'process_group'    // Access to specific process group(s)
  | 'tag'              // Access to tasks with specific tag(s)
  | 'entity'           // Access to specific entity/entities
  | 'task_type';       // Access to specific task types

// User-Role assignment (scoped to entities)
interface UserRole {
  userId: string;
  roleId: string;
  entityScope: EntityScope;
}

type EntityScope =
  | { type: 'all' }                    // All entities user is assigned to
  | { type: 'specific'; entityIds: string[] };
```

### System-Defined Roles

| Role | Permissions | Typical User |
|------|------------|--------------|
| **Staff Preparer** | `prepare: all`, `view: all` | Sarah (Staff Accountant) |
| **Senior Reviewer** | `review: all`, `prepare: all`, `view: all`, `delegate: all` | David (Senior Accountant) |
| **Controller** | `review: all`, `reassign: all`, `view: all`, `delegate: all` | Maria (Controller) |
| **Executive Viewer** | `view: all` | Robert (VP Finance) |
| **System Admin** | `admin: all`, `configure: all` | James (Admin) |
| **AP Specialist** | `prepare: process_group:AP`, `view: process_group:AP` | Scoped preparer |
| **High-Risk Reviewer** | `review: tag:high-risk`, `view: all` | Additional reviewer |
| **Agent Operator** | `configure: task_type:agent_task`, `view: all` | AI ops role |

### Custom Role Examples

```
Role: "EMEA AP Reviewer"
  Permissions:
    - review: process_group:Accounts Payable
    - view: process_group:Accounts Payable
  Entity Scope: specific [Entity F, Entity G, Entity H]

Role: "Quarter-End Auditor"
  Permissions:
    - view: tag:audit-focus
    - view: tag:high-risk
  Entity Scope: all

Role: "Intercompany Manager"
  Permissions:
    - review: process_group:Intercompany
    - reassign: process_group:Intercompany
    - view: all
  Entity Scope: all
```

## Permission Resolution Algorithm

When a user attempts an action on a task, the system evaluates:

```
CAN user U perform action A on task T?

1. Get user U's roles (via USER_ROLE)
2. For each role R:
   a. Check entity scope: Is T.entityId within R.entityScope?
   b. If yes, check permissions:
      For each permission P in R:
        - Does P.action match A?
        - Does P.scope match T?
          - scope: all → yes
          - scope: process_group → T.processGroup matches P.scopeValue?
          - scope: tag → T.tags includes P.scopeValue?
          - scope: entity → T.entityId matches P.scopeValue?
          - scope: task_type → T.taskType matches P.scopeValue?
3. If ANY permission grants access → ALLOW
4. If NO permission grants access → DENY
```

```
Example: Can David review "AP Accrual - Entity C"?

David's roles:
  - "Senior Reviewer" (entity scope: all)
    - Permissions: review:all, prepare:all, view:all

Task: AP Accrual - Entity C
  - processGroup: Accounts Payable
  - entityId: Entity C
  - tags: [monthly]

Evaluation:
  1. "Senior Reviewer" role
  2. Entity scope: "all" → Entity C is within David's assigned entities ✓
  3. Permission "review:all" → action matches, scope "all" matches ✓
  → ALLOW
```

## SOX Segregation of Duties

The model enforces separation between preparer and reviewer:

```typescript
// Constraint: A user cannot both prepare AND review the same task
function canReview(userId: string, task: SuperTask): boolean {
  // Basic permission check
  if (!hasPermission(userId, 'review', task)) return false;

  // SOX constraint: reviewer ≠ preparer
  if (task.preparerId === userId) return false;

  // SOX constraint: check signatures
  const preparerSignature = task.signatures
    .find(s => s.type === 'preparer' && s.userId === userId);
  if (preparerSignature) return false;

  return true;
}
```

## Delegation & Permission Inheritance

```
Sarah delegates to Lisa during PTO:

1. System checks: Does Lisa have sufficient permissions to act on Sarah's tasks?
   - If Lisa has the same role scope → delegation allowed
   - If Lisa lacks scope (e.g., missing entity access) → delegation blocked with explanation

2. During delegation period:
   - Lisa can prepare/sign-off on Sarah's tasks
   - Audit trail shows: "Signed by Lisa Wong (delegated from Sarah Chen)"
   - Sarah retains underlying assignment; delegation is an overlay

3. After delegation period:
   - Tasks auto-reassign back to Sarah
   - Lisa's access to Sarah's tasks reverts
```

## Migration from Folder Permissions

### Step 1: Analyze Current Permissions
```
For each user, for each folder they have access to:
  - Map folder.name → processGroup
  - Map access level → action (preparer → prepare, reviewer → review)
  - Map folder.entityId → entityScope
```

### Step 2: Create Roles
```
Identify common permission patterns:
  - Users with prepare access to ALL folders → "Staff Preparer" role
  - Users with review access to ALL folders → "Senior Reviewer" role
  - Users with access to SPECIFIC folders → create scoped role
```

### Step 3: Assign Roles
```
For each user:
  - Assign the most appropriate role(s)
  - Validate: does the role grant equivalent access to current folder permissions?
  - If not: create a custom role to fill gaps
```

### Step 4: Validate
```
For every user-task permission that exists today:
  - Verify the new role-based model grants the same access
  - Flag any discrepancies for admin review
```

## Advantages Over Current Model

| Dimension | Folder Permissions | ReBAC |
|-----------|-------------------|-------|
| Grant count (15 folders × 6 entities × 10 users) | 900 individual grants | 10 role assignments |
| New entity onboarding | Manual per-folder grants | Auto-inherit from role |
| Folder reorganization risk | Permissions break | No folders → no risk |
| Cross-entity access patterns | Not expressible | Natural (role scoped to entity set) |
| Tag-based access | Not possible | Native (scope: tag) |
| Audit trail | Implicit | Explicit (role changes logged) |
| SOX compliance | Manual enforcement | Automated SoD checks |
| Self-service delegation | Not possible | Built into model |
