# Session Learnings — Defender Backend Overhaul (2026-03-24)

Lessons from building the v2 backend, fixing rule-transaction linkage, and aligning the prototype to the Figma design.

---

## 1. Race Conditions in React Data Loading

**Problem**: Two `useEffect` hooks with `[]` deps — one fetching data, one applying rules — created a race condition. The rule engine ran against an empty array before the fetch completed, and never re-ran.

**Lesson**: When a computation depends on fetched data, run it *inside* the fetch callback, not in a separate effect. Separate effects with `[]` deps have no guaranteed ordering and no dependency relationship.

**Pattern to follow**:
```ts
// WRONG — race condition
useEffect(() => { fetch(...).then(data => setData(data)); }, []);
useEffect(() => { const result = process(data); setData(result); }, []);

// RIGHT — process after fetch
useEffect(() => {
  fetch(...).then(data => {
    const result = process(data);
    setData(result);
  });
}, []);
```

---

## 2. FlowUI Component Default Styles vs Figma Intent

**Problem**: The FlowUI `Accordion.Item` ships with its own border (dark/black). When we wrapped it in a container that already had the correct Figma border (`1px solid #e1e6ef`), both borders rendered — creating a visible double-border that didn't match the design.

**Lesson for figma-match skill**: After recommending a FlowUI component, add a **"Default style audit"** step:
- Check what border, background, shadow, and padding the FlowUI component renders by default
- Compare against the Figma spec on the wrapper/container
- If the wrapper already provides these styles, flag that the FlowUI component's defaults need suppression (e.g., `style={{ border: 'none' }}`)

**Most affected components**: Container-type components — Accordion, Modal, Card, SideDrawer — where both wrapper and component may render borders/shadows.

---

## 3. AG Grid Table Container Padding

**Problem**: The AG Grid table rendered edge-to-edge within its flexlayout panel, while the Figma design showed 24px horizontal padding and a rounded border container around the table.

**Lesson for AG Grid creation**: When building an AG Grid table from Figma, always check the **container hierarchy** (not just the table node):
- The Figma table is typically nested 2-3 layers inside a padded container
- Extract padding from the container's x-offset relative to its parent (e.g., table at x=24 in a 1384px container = 24px padding)
- The table container often has its own border + border-radius that wraps the grouping panel, grid, and footer as a single visual unit
- Don't forget bottom margin — the table container needs spacing from the panel's bottom edge

**Checklist for AG Grid layout**:
- [ ] Horizontal padding between panel edge and table
- [ ] Rounded border container wrapping grouping panel + grid + footer
- [ ] Bottom margin so footer doesn't touch panel edge
- [ ] Footer inside the border container (not outside)

---

## 4. json-server Middleware Approach

**Problem**: json-server 0.17 uses CommonJS and `res.jsonp()`, not `res.json()`. A middleware that intercepts `res.json` never fires.

**Lesson**: For json-server 0.17, use `router.render` to intercept and enrich responses:
```js
router.render = (req, res) => {
  let data = res.locals.data;
  // enrich data here
  res.jsonp(data);
};
```

Also: when `package.json` has `"type": "module"`, server files must use `.cjs` extension for CommonJS compatibility with json-server 0.17.

---

## 5. Computed Fields — Server vs Client

**Problem**: Rules that check `Vendor Age`, `Is Round Number`, `Day Of Week` depend on fields computed by the server middleware. If the rule engine runs before the fetch (race condition), these fields don't exist yet.

**Lesson**: Clearly separate the data pipeline:
1. **Server computes** derived fields (vendorAgeAtTransaction, isRoundNumber, etc.) via `router.render`
2. **Client fetches** enriched data with all computed fields present
3. **Client evaluates** rules against the enriched data
4. Never run rule evaluation until the fetch is confirmed complete

---

## 6. ID Format Changes Break Nothing (But Check Joins)

**Problem**: Changed transaction IDs from numeric strings ("1", "2") to descriptive strings ("BILL-44200", "JE-22910"). json-server handles both fine.

**Lesson**: When changing ID formats, audit all join points:
- `comments.filter(c => c.transactionId === t.id)` — comments must reference the new IDs
- `signoffs.filter(s => s.transactionId === t.id)` — same
- AG Grid doesn't require a `getRowId` prop — it auto-generates row IDs

---

## 7. Month Selector Must Match Data Range

**Problem**: The `availableMonths` array only went up to "February 2026" while the data now spans through March 2026. Default `selectedMonths` was also wrong.

**Lesson**: When expanding the data range, always update:
- [ ] `availableMonths` array to include all periods in the data
- [ ] Default `selectedMonths` to the current/latest period
- [ ] Any hardcoded period references in the UI

---

## 8. Figma Match — Read the Container, Not Just the Component

**Problem**: The figma-match skill focused on the Accordion component's internal styling but missed the container's border treatment and the table's padding from panel edges.

**Lesson for figma-match skill improvement**: When matching a component:
1. Always call `get_metadata` on the **parent container** (1-2 levels up) to understand padding, margin, and border context
2. Check x/y offsets of the component relative to its parent — these reveal padding values
3. Look for wrapper elements in Figma that create visual boundaries (borders, shadows, rounded corners) that aren't part of the component itself
4. The Figma component tree is often: Panel → Padded Container → Border Container → Component. All three layers matter for the final output.
