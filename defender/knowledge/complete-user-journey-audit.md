# Data Defender: Complete User Journey Audit

## Purpose
Map every end-to-end user journey, identify every interaction point, and assess whether the prototype can support each one for usability testing.

---

## Journey 1: Manager — First-Time Setup (Day 1)

### Steps
1. **Land on Data Defender tab** → see empty state (no rules, no anomalies)
2. **Review Suggested Rules** → browse AI-suggested rules based on transaction patterns
3. **Adopt a suggested rule** → click "Adopt" → Rule Creator opens pre-filled
4. **Configure the rule** → adjust name, description, parameters, severity
5. **Set assignees** → choose Dynamic Assignment or specific users
6. **Save the rule** → Save modal with period scope → confirm
7. **See the rule appear in Rules Grid** → active, version 1
8. **Create a second rule from scratch** → click "Add Rule" → empty form
9. **Use natural language AI** → type description → click Generate → dropdowns populate
10. **Save with historical periods** → select past months → confirm
11. **Configure the default layout** → arrange panels for team
12. **Save layout as public** → gear menu → Save as New → name it → toggle public

### Prototype Readiness

| Step | Can Test? | Blocker |
|------|-----------|---------|
| 1 | ✅ | Empty state exists for Rules Grid |
| 2 | ✅ | Suggested Rules tab exists with 6 items |
| 3 | ⚠️ | Adopt calls handleConvertInsightToRule → opens SideDrawer (blocks layout) |
| 4 | ✅ | Rule Creator form has all fields |
| 5 | ✅ | Preparer/Reviewer dropdowns with Dynamic Assignment |
| 6 | ✅ | Save modal with historical period checkbox exists |
| 7 | ⚠️ | Rule appears in state but grid may not auto-refresh (needs verify) |
| 8 | ⚠️ | "Add Rule" opens SideDrawer (blocks layout — same issue as #3) |
| 9 | ✅ | AI accordion with Generate button exists |
| 10 | ✅ | Historical period date picker in save modal |
| 11 | ✅ | Flex layout drag/resize works |
| 12 | ✅ | Save View modal with public toggle exists |

**Critical blocker:** Steps 3 and 8 use SideDrawer which blocks the flex layout. This is the Bolt architecture mismatch — rule creation should happen inline, not in a blocking overlay.

---

## Journey 2: Manager — Rule Lifecycle Management

### Steps
1. **View an existing rule** → click rule row → Rule Details panel opens
2. **Edit the rule** → kebab menu → "Edit Rule" → in-place edit mode
3. **Change a condition** → modify Amount threshold from 1M to 2M
4. **Save the edit** → Save modal → "This will create Version 2"
5. **View the version history** → click version badge dropdown → see V1 and V2
6. **View old version (read-only)** → click V1 → see "read-only" banner
7. **Return to current version** → click "View Current Version"
8. **Duplicate the rule** → kebab → "Duplicate Rule" → pre-filled "Copy of..." form
9. **Modify the copy** → change name, adjust parameters
10. **Save the duplicate** → now two similar rules in the grid
11. **Deactivate a rule** → kebab → "Deactivate Rule" → modal with period scope
12. **Confirm deactivation** → rule moves to bottom of grid, status changes
13. **Reactivate later** → kebab on deactivated rule → "Reactivate Rule"
14. **Delete a rule** → kebab → "Delete Rule" → confirmation modal

### Prototype Readiness

| Step | Can Test? | Blocker |
|------|-----------|---------|
| 1 | ✅ | selectRule works via harness |
| 2 | ✅ | editRule works → in-place edit mode |
| 3 | ⚠️ | Condition dropdowns exist but don't update the actual rule logic (visual only) |
| 4 | ❌ | **Save in edit mode doesn't show the period scope modal** — it uses handleRulePanelSave which skips the modal |
| 5 | ✅ | Version dropdown opens (for rules with version > 1) |
| 6 | ✅ | Read-only banner shows |
| 7 | ✅ | "View Current Version" button works |
| 8 | ⚠️ | Opens SideDrawer (blocks layout) |
| 9 | ✅ | Form is pre-filled with "Copy of..." |
| 10 | ✅ | Save adds rule to state |
| 11 | ✅ | Deactivation modal works |
| 12 | ✅ | Rule moves to bottom, status updates |
| 13 | ✅ | Reactivate option in kebab |
| 14 | ✅ | Delete confirmation modal exists |

**Critical gap:** Step 4 — editing a rule and saving should show the Save Rule modal (with period scope and versioning info). Currently the edit mode save just calls handleRulePanelSave directly without the modal.

---

## Journey 3: Preparer — Daily Anomaly Resolution

### Steps
1. **Log in** → see "Transactions Focused" layout (grid + details)
2. **Scan the grid** → look for rows with anomaly counts > 0 and "Open" status
3. **Click a flagged transaction** → Transaction Details panel populates
4. **Review the transaction fields** → check amount, vendor, account, memo
5. **Read the anomaly cards** → understand which rules triggered
6. **Change status to "Investigating"** → dropdown in header
7. **Add a comment** → type investigation notes in comments section
8. **Check the assignees** → verify Dynamic Assignment found the right people
9. **Open the source rule** → kebab on anomaly card → "View Rule"
10. **Return to the transaction** → back navigation
11. **Compare with another transaction** → hover → "Open in New Panel"
12. **Sign off on the anomaly** → toggle the sign-off switch
13. **See the sign-off recorded** → avatar + timestamp appears
14. **Change status to "Resolved"** → dropdown when all sign-offs complete

### Prototype Readiness

| Step | Can Test? | Blocker |
|------|-----------|---------|
| 1 | ✅ | "Transactions Focused" preset exists |
| 2 | ✅ | Grid shows anomaly counts and status badges |
| 3 | ✅ | selectTransaction works |
| 4 | ✅ | Field grid with 20+ fields, configurable |
| 5 | ✅ | Anomaly cards show matched rule names |
| 6 | ✅ | Status dropdown works (Open → Investigating) |
| 7 | ✅ | Comment textarea + send button works |
| 8 | ⚠️ | Dynamic Assignment shown with sparkle icon, now has purple container — but **no tooltip explaining assignment source on the assignee row** |
| 9 | ✅ | Clicking rule name navigates to Rule Details |
| 10 | ✅ | Back navigation via previousAnomaly state |
| 11 | ⚠️ | "Open in New Panel" icon exists on selected rows but **opens in the same Transaction Details tab, doesn't create a new independent panel** |
| 12 | ✅ | Sign-off toggle works |
| 13 | ✅ | Avatar + timestamp displays on sign-off |
| 14 | ✅ | Status dropdown includes Resolved |

**Gap:** Step 11 — "Open in New Panel" should create a genuinely separate flex panel for the new transaction so users can compare two transactions side-by-side. Current behavior replaces the existing detail view.

---

## Journey 4: Reviewer — Quality Gate

### Steps
1. **Log in** → see transactions with sign-offs from preparers
2. **Filter to "Investigating"** → click metric card or use grid filter
3. **Open a transaction** → see preparer's sign-off + comments
4. **Review the work** → check preparer's comments and sign-off timestamp
5. **Add a reviewer comment** → document the review decision
6. **Sign off as reviewer** → toggle the reviewer sign-off
7. **Change status to "Resolved"** → final resolution
8. **See metrics update** → Open count decreases, Resolved increases

### Prototype Readiness

| Step | Can Test? | Blocker |
|------|-----------|---------|
| 1 | ✅ | Grid shows sign-off state |
| 2 | ✅ | Filter pill + metric card filtering works |
| 3 | ✅ | Transaction details show all data |
| 4 | ✅ | Comments and sign-off timestamps visible |
| 5 | ✅ | Comment input works |
| 6 | ✅ | Reviewer sign-off toggle works |
| 7 | ✅ | Status dropdown works |
| 8 | ⚠️ | **KPI/metric cards are only in the Metrics tab, not in the main Transaction List view** — the metric cards that show Open/Investigating/Resolved counts are in a separate tab, not visible when viewing transactions |

---

## Journey 5: Edge Cases & Error Paths

### 5a. Deleted Transaction from ERP
1. A transaction appears in the grid with "Deleted" status
2. Red banner in detail panel explains it's deleted from ERP
3. User can still view historical data but can't interact meaningfully
4. If sign-offs existed, they're preserved
5. If no sign-offs, anomaly cards are removed but comments stay

**Prototype status:** ✅ Mostly testable — banner exists, mock data has one deleted transaction. Missing: the differentiation between "with sign-offs" and "without sign-offs" variants.

### 5b. False Positive / Dismissed
1. User investigates a flagged transaction
2. Determines it's a false positive (legitimate transaction)
3. Changes status to "Dismissed" instead of "Resolved"
4. This data feeds back into rule tuning signals

**Prototype status:** ✅ Dismissed status exists in dropdown. Missing: any visual differentiation in metrics or grid between Dismissed and Resolved.

### 5c. Assignee Override
1. Original assignee is "David" (preparer)
2. "Sarah" signs off on behalf of David
3. System shows Sarah's avatar + "signed off on behalf of David"

**Prototype status:** ✅ Override display exists in DetailPanel.

### 5d. Remove a Sign-off
1. User accidentally signs off
2. Clicks toggle again to remove
3. Warning modal: "Removing the sign-off will remove the completed date"
4. Confirms → sign-off removed

**Prototype status:** ✅ RemoveSignoffModal is wired and functional.

---

## Backend / Data Gaps for Testing

### Missing Mock Data Scenarios

| Scenario | Current State | Needed |
|----------|--------------|--------|
| Transaction with 3+ anomalies from different rules | ⚠️ Max 2 in current data | Add a transaction triggering 3+ rules |
| Transaction with mix of signed-off and unsigned anomalies | ⚠️ Not explicitly in data | Add mock signoffs for partial completion |
| Transaction with "Dismissed" status | ❌ No mock data | Add at least one Dismissed transaction |
| Deactivated rule with existing anomalies that have user activity | ⚠️ Deactivated rule has 0 anomalies | Set up a deactivated rule that previously had anomalies |
| Rule with 3+ versions | ❌ Max version is 2 | Add a rule with V1→V2→V3 history |
| Multiple Dynamic Assignment outcomes (success + failure) | ❌ Not differentiated | Mock data should include both success and fallback scenarios |

### Backend API Gaps

| Endpoint | Status | Impact |
|----------|--------|--------|
| Rule CRUD (create/read/update/delete) | ✅ json-server supports full CRUD | Can test full lifecycle |
| Transaction data refresh | ⚠️ Static data | Can't test "new transactions flowing in" |
| Signoff persistence | ⚠️ In-memory only (resets on reload) | Sign-offs don't persist between sessions |
| Comment persistence | ⚠️ In-memory only | Same as signoffs |
| Status changes | ⚠️ In-memory only | Same |
| Rule versioning | ❌ No backend support | Version history is mocked in frontend state only |
| Period-scoped rule application | ❌ No backend | Period selection in save modal is visual only |
| Dynamic Assignment resolution | ❌ No backend | Assignment is a frontend simulation |

### Recommendations for Test Readiness

**High priority (blocks realistic testing):**
1. Fix SideDrawer blocking issue for rule creation — make it inline in the flex panel
2. Add Save Rule modal to the edit mode save flow (currently skips it)
3. Add "Open in New Panel" creating a genuinely independent flex panel
4. Add mock data for 3+ anomaly transactions and dismissed/multi-version scenarios

**Medium priority (improves test fidelity):**
5. Persist state changes to json-server (signoffs, comments, status changes)
6. Add KPI metric summary to the Transaction List view (not just separate tab)
7. Add Dynamic Assignment success/failure mock scenarios

**Lower priority (nice to have):**
8. Simulate transaction data refresh (new transactions appearing)
9. Add period-scoped rule application to the backend
10. Multi-user simulation (switch between preparer/reviewer personas)
