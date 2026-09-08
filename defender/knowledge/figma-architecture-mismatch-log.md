# Figma vs Prototype Architecture Mismatch Log

## Purpose
Document cases where the prototype's inherited Bolt architecture diverges from the Figma design's intended user journey. These are not visual bugs — they're **interaction model mismatches** that need structural changes.

---

## Mismatch #1: Rule Edit Mode (Critical)

### Figma Design (node `2055:80726`)
The "Edit Rule" flow operates as an **in-place transformation** of the Rule Details panel:
- Same flexlayout tab ("Rule Details")
- Same panel position — doesn't navigate away
- Title changes to "Rule Details" (not "Edit Rule" or "Rule Creator")
- **The view-only fields transform into editable fields in the same layout:**
  - Name → becomes an editable text input
  - Description → becomes an editable textarea
  - Status → stays as read-only badge ("Active")
  - FQ Rule ID → stays as read-only text
  - Rule Parameters → condition dropdowns become editable, AND/OR toggle active, Add Condition/Add Group buttons appear
  - Natural Language AI input → expandable accordion appears above parameters
  - Severity Level → slider becomes interactive
  - Anomaly Assignees → Rule Owner becomes dropdown, assignees become editable with role dropdowns + delete + "Add Assignee"
  - Activity Log → stays visible (collapsed) at the bottom
- Footer → Cancel / Save buttons appear at the bottom of the same panel
- **Key: No tab switch. No navigation. The panel morphs from read-only to editable.**

### Current Prototype Architecture
The "Edit Rule" flow **navigates to a completely different component:**
- `handleEditRule` → sets `isRulePanelEditMode=true` on the Rule Details panel
- BUT the edit mode in `RuleDetailPanelContent.tsx` renders a **basic form** with plain HTML inputs/selects — NOT the full Rule Builder experience
- Missing from the edit mode: AI accordion, condition builder with AND/OR groups, severity slider, avatar-leading dropdowns
- The **full Rule Builder** (`RuleBuilderContent.tsx`) exists as a separate component rendered in the `rule-creator` tab
- So there are two parallel implementations: a basic edit form in Rule Details, and a full builder in Rule Creator

### Impact
- Users clicking "Edit" from the Rule Details kebab expect to stay in the same panel and see the fields become editable
- Instead, the prototype either: (a) shows a simplified form in the same panel, or (b) could navigate to a different tab entirely
- The full condition builder, AI input, and severity slider are only available in the Rule Creator tab — not in the edit mode

### Required Fix
1. The Rule Details panel's edit mode should render the **full RuleBuilderContent** components (condition builder, AI accordion, severity slider, avatar dropdowns) — not a simplified form
2. The edit mode should stay in the same "Rule Details" tab, not switch to "Rule Creator"
3. The footer Cancel/Save should appear at the bottom of the Rule Details panel
4. When saving, it should show the Save Rule modal (with period scope) just like creation

### Root Cause
Bolt originally built the prototype with a separation between "viewing" (RuleDetailPanelContent) and "editing" (RuleBuilderContent). The Figma design treats these as two states of the same component. The Bolt architecture leaked into the prototype and was never reconciled with the Figma intent.

---

## How to Prevent This in Future Sessions

### For Figma File Organization
1. **Label state transitions explicitly** — If a Figma frame shows "Edit Rule" and it's the same panel as "View Rule", group them in a section called "Rule Details: View → Edit transition" with an arrow connecting them
2. **Use Figma component variants** — The Rule Details component already uses `Property 1=View Only` vs other variants. Make sure the variant names map to user actions: "View Only", "Edit Mode", "Deactivated View"
3. **Include transition annotations** — Add Figma annotations (sticky notes or text blocks) that say "This is the same panel — edit mode transforms the view-only fields"

### For the AI-Assisted Process
1. **Don't trust the prototype architecture** — When Figma shows a behavior, implement it as Figma intended, not as the existing code organizes it. The code architecture is a starting point, not a constraint.
2. **Ask: "Where does this happen?"** — Before implementing any edit/create flow, explicitly check: Does Figma show this in the same panel? A new panel? A modal? A drawer? Don't assume it matches the code.
3. **Compare state machines** — Map the Figma user journey as a state machine (View → Edit → Save → View), then map the code's state machine. Mismatches are architectural issues.
4. **Use the Deep Instance Probe on BOTH the view and edit variants** — Compare the component structures. If they share the same parent frame and component set, they should share the same code component.

### For Figma Structure That Helps AI
1. **Same component, different variants** — The Rule Details component set already has `Property 1=View Only` and `Property 1=Edit`. This is the right pattern. AI tools can detect these as states of the same component.
2. **Section grouping** — The "Edit Rule" Figma section (2113:114691) shows the full flow from Rules table → kebab → edit form → save modal. This sequential layout helps AI understand the journey.
3. **Shared node IDs** — When both states use the same parent frame (Checklist Header > Rule Details), the metadata shows they're the same panel. This is a strong signal.

---

## Mismatch #2: Rule Creator vs Edit Mode (Related)

### Figma Design
- "Create New Rule" opens in the **same panel area** as Rule Details
- The form is nearly identical to Edit Mode (same fields, same layout)
- Only difference: empty fields vs pre-populated, and "Create" vs "Save" button

### Current Prototype
- Rule Creator is a **separate tab** (`rule-creator-tab`) with `RuleBuilderInline` component
- Rule Builder Content is shared but rendered in a different tab
- Navigation: Add Rule → switches to Rule Creator tab

### Impact
- Lower severity than #1 since this is creation (new content) rather than editing (modifying existing content in context)
- But it still means the full builder experience lives in a different tab than where users naturally are

### Required Fix
- Consider: should edit mode use the same `RuleBuilderContent` rendered inside the Rule Details panel?
- Or: should the Rule Creator tab be removed and both create/edit happen in the Rule Details panel?
- This is a bigger architectural decision that needs design input
