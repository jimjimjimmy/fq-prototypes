# Transaction Details Panel — Architecture Reference

**Last verified**: 2026-03-24
**Figma file**: `HkEqjwX3CjTWqinuISZYvV`
**Node**: `26:17929` (Transaction Details component — returns full ~101KB design context)
**Source**: Figma MCP `get_design_context` + `get_metadata` on full screen node `26:17841`

---

## Current Implementation State

- Renders inline via flexlayout factory (component name: `'transaction-details'`)
- `inline={true}` prop passed in App.tsx factory at line ~646
- Row click: `setSelectedAnomaly(data)` + `selectTransactionDetailsTabRef.current()` (tab-switch, NOT drawer open)
- Layout: 50/50 weight split — left tabset (rules/transactions) + right tabset (Transaction Details)
- **The `inline={false}` SideDrawer mode exists at App.tsx line ~819 for a different code path — verify if ever triggered**

---

## Figma Canvas vs. Browser Width

| Context | Width |
|---|---|
| Figma canvas (full screen node) | 2767px |
| Left panel (Transactions table) | 1384px |
| Right panel (Transaction Details) | 1327px (~48%) |
| At 1440px browser | ~691px for Transaction Details |
| At 1920px browser | ~922px for Transaction Details |

**Key implication**: The Figma side-by-side Anomalies + Comments layout (each column ~640px) requires ~1280px total panel width. At typical browser widths, this doesn't fit. Use `flex-col` (Anomalies above Comments) as the default implementation layout.

---

## Correct Section Structure (top to bottom)

```
Transaction Details panel
├── Status badge row
│     "Status" label + colored chip (amber/orange for Open) + ExpandMore inside chip
├── Divider
├── Details section (collapsible)
│     Field grid — currently ~w-[236px] per field, font-semibold values, correct as-is
├── Anomalies + Comments (flex-col at prototype widths, flex-row at 1280px+ panel widths)
│   ├── Anomalies section
│   │     Section header: "Anomalies (N)" — Museo_Sans 16px/700
│   │     One card per triggered rule (N = anomalyCount, driven by triggeredRule array)
│   │     Each card:
│   │       border: 1px solid #e1e6ef
│   │       border-radius: 6px
│   │       box-shadow: 0px 1px 2px rgba(0,0,0,0.05)
│   │       max-width: 460px, padding: 16px
│   │       Header: rule name (12px/700) + ExpandMore + ⋮ MoreVert menu
│   │       Body (collapsible): sign-off rows
│   │         Each row: Avatar(28px) + name(12px semi-bold) + role(10px) + Toggle
│   │         Gap between rows: 24px
│   └── Comments section
│         border-top: 1px solid #e1e6ef (when stacked vertically)
│         Section header: "Comments (N)" — same font as Anomalies
│         Comment list: flex-col, gap: 20px, padding-left: 16px
│         Each comment: Avatar(28px) + name(12px/600) + timestamp(10px) + body(12px) + Edit/Delete icons
│         NO border on individual comment items
│         Reply input at bottom: Avatar + textarea + Send button
└── Activity Log (collapsed by default)
```

---

## Data Model

Transactions have:
- `triggeredRule`: string or string[] — the rule(s) that fired
- `anomalyCount`: number — how many anomalies detected

Each triggered rule = one anomaly accordion card in the panel.

Sign-offs are per-rule-per-assignee, keyed as `${ruleName}:${assigneeName}:${role}`.
The `assigneeToggles` state in DetailPanel manages this.

Comments come from API: `GET /api/comments?transactionId={id}`.
CHK-5621 (id: "12") now has 2 mock comments in db.json (added 2026-03-24).

---

## Known Figma Node Map (verified 2026-03-24)

| Node | ID | Status |
|---|---|---|
| Full screen ("Hover on Different Transaction") | 26:17841 | ✓ Valid |
| Transaction Details container wrapper | 26:17927 | ✓ Valid |
| Transaction Details component | 26:17929 | ✓ Valid — returns full content |
| Subnav | 26:17845 | ✓ Valid |
| Anomalies/Comments sublayer | 26:29851 | ✗ **INVALID** — node no longer exists |

---

## Gaps Still To Fix

| Area | Gap | File |
|---|---|---|
| Anomalies + Comments layout | ✓ Changed to `flex-col` (2026-03-24) | `DetailPanel.tsx` ✓ |
| Section headers | ✓ `font-bold` (700) + Museo_Sans (2026-03-24) | `DetailPanel.tsx` ✓ |
| Anomaly card shadow | Confirm `box-shadow: 0px 1px 2px rgba(0,0,0,0.05)` is applied | `DetailPanel.tsx` |
| Avatar colors | ✓ Custom `ColoredAvatar` component with deterministic color hash (2026-03-24). FlowUI Avatar has no `color` prop. | `DetailPanel.tsx` ✓ |
| Fields button | ✓ Changed from `Button variant="outlined"` to plain `<button>` ghost style (2026-03-24) | `DetailPanel.tsx` ✓ |
| Status row | badge+button implemented (2026-03-24) — verify visually at 5174 | `DetailPanel.tsx` |
| Comments mock data | CHK-5621 now has 2 comments — verify renders | `server/db.json` ✓ |
| Grid row striping | Restored 2026-03-24 after incorrect removal | `TransactionGrid.tsx` ✓ |

---

## Implementation Rules (do not skip)

1. **Pull `get_screenshot` on the Figma node BEFORE making any code change.** Session notes may be stale.
2. **Write Figma findings to this file BEFORE writing code.** Protect against compaction.
3. **Verify node IDs with `get_metadata` at session start.** Node 26:29851 is already gone — others may move too.
4. **Check panel width before implementing side-by-side layouts.** The Figma was designed at 2767px; the prototype browser may be much narrower.
