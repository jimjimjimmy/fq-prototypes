# Implementation Decisions Without Clear Design Bar / Figma Source

These decisions were made during implementation when neither the Design Bar sessions nor the Figma designs provided clear guidance. They should be reviewed during internal usability testing.

---

## Decision 1: Severity Slider in Edit Mode
**Context:** The Figma edit frame (2055:80726) shows a severity slider, but Design Bar didn't discuss whether edit-mode severity should be interactive or display-only.
**Decision:** Made it interactive with clickable tick marks (1-5 scale). Users can click any tick mark to change severity.
**Rationale:** The view mode shows severity as a visual indicator; edit mode should allow changing it since it affects risk score calculations.
**Risk:** Users might accidentally change severity without realizing the impact on risk scores.

## Decision 2: Role Selector (Preparer↔Reviewer) in Edit Mode
**Context:** Figma shows role dropdowns next to each assignee. Design Bar didn't discuss role switching behavior.
**Decision:** Wired onChange so changing "Preparer" to "Reviewer" moves the assignee from the preparers array to the reviewers array (and vice versa).
**Rationale:** This matches the Figma visual of editable role dropdowns and follows the principle that all form elements in edit mode should be functional.
**Risk:** Role switching might have implications for existing sign-offs that aren't handled.

## Decision 3: Save Rule Modal from Edit Mode
**Context:** Carmen described the Save Rule modal (with versioning + period scope) for rule creation. She didn't explicitly say it should also appear when editing.
**Decision:** Reused the same modal pattern for edits. It shows "Saving will create Version N+1" and allows period scope selection.
**Rationale:** The versioning system (Design Bar: Carmen explained creating new versions on edit) implies the modal should appear on save to inform users about version creation.
**Risk:** Users might find the modal unnecessary for minor edits (e.g., just changing description).

## Decision 4: AI Natural Language in Edit Mode
**Context:** Figma shows the NL accordion in the edit state. Design Bar discussed NL input for creation but not explicitly for editing.
**Decision:** Wired it to the existing `parseNaturalLanguageRule` utility. Users can type a new description and click Generate to replace conditions.
**Rationale:** Figma shows the UI element in edit mode, so it should be functional. The AI sparkle/clear behavior (Design Bar: strict black/white) applies the same way.
**Risk:** Users might not expect AI to replace all existing conditions when generating from NL in edit mode.

## Decision 5: Green Accent Border for Selected Transaction Row
**Context:** Design Bar (Steve) described needing "visual breadcrumbs" and "color signals" for cross-panel interaction. The specific color/style wasn't prescribed.
**Decision:** Used 3px left border in FloQast green (#1fac76) with light green background tint.
**Rationale:** Green is FloQast's primary brand/success color and creates a strong visual signal without being distracting. Left border is a common pattern for selected row indication.
**Risk:** Green might be confused with "success/resolved" status since that also uses green.

## Decision 6: Dynamic Assignment Purple Container
**Context:** Benjamin said to use a "distinct visual container" instead of just an icon. The specific color wasn't prescribed.
**Decision:** Used light purple (#f8f5ff background, #e9dffc border) matching the AI theme colors from Design Bar.
**Rationale:** Purple is established as the AI color in FloQast (AI sparkle, AI background token). Using it for the container maintains the AI association.
**Risk:** Users might not understand why the container is a different color without explicit labeling.

## Decision 7: Backend Persistence Strategy
**Context:** Prototype had no persistence — all state changes lost on reload. Neither Design Bar nor Figma addressed this.
**Decision:** Added fire-and-forget PATCH/POST calls to json-server for status changes and rule edits. Comments persist via transaction updates.
**Rationale:** Internal testing requires state persistence between page loads. json-server supports full CRUD by default.
**Risk:** No error handling — if the server is down, changes silently fail without user notification.
