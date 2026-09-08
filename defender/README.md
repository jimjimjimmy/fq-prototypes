# Defender

> Anomaly Detection Dashboard prototype for FloQast

## What This Is

Defender explores UX patterns for detecting financial anomalies within FloQast. It features a multi-panel dashboard with rule building, real-time anomaly evaluation, and transaction management — all with mocked data.

Originally built by Gaurav in Bolt, then refactored into a component architecture with FlowUI alignment. This is a functional prototype, not production code.

## Quick Start

**Prerequisites:** Node.js

```bash
cd projects/defender/prototype
npm install
npm run dev:full
```

This runs Vite + json-server concurrently. The app opens at `localhost:5173`, mock API at `localhost:3001`.

Other scripts:
- `npm run dev` — Vite only (no mock API)
- `npm run server` — json-server only
- `npm run build` — Production build

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| flexlayout-react | Multi-panel tabbed layout |
| AG Grid Community | Transaction tables |
| Tailwind v4 + FlowUI tokens | Styling (semantic CSS variables) |
| Vite 8 | Dev server + bundler |
| json-server | Mock REST API |
| concurrently | Parallel dev/server |

## Features

- **Multi-panel dashboard** — 8 draggable/resizable tabs with 3 preset layout views (FloQast Default, Transactions Focused, Rules Editor)
- **Rule builder** — Create rules with nested AND/OR condition groups, natural language input, severity slider, preparer/reviewer assignment
- **Real-time anomaly detection** — Rules evaluate against transactions immediately; risk scores calculated per-transaction
- **Transaction detail** — Side drawer with status management, threaded comments, linked rules, preparer/reviewer signoff
- **Suggested rules** — Prebuilt rule recommendations users can apply with one click
- **KPI metrics** — Anomaly counts broken down by status with click-to-filter
- **Field settings** — Toggle column visibility in the transaction grid
- **AG Grid theming** — Custom theme using FlowUI design tokens
- **Chat panel** — Conversational AI interface for anomaly exploration

## Architecture

```
src/
├── App.tsx                          # State management, layout model, component factories
├── types/index.ts                   # Domain types (Rule, Anomaly, Condition, Group, Comment)
├── data/
│   ├── constants.ts                 # MONTH_MAP, ALL_FRAMES, PRESET_VIEWS, USERS, FIELD_OPTIONS
│   ├── mock-rules.ts                # Initial rules array
│   └── suggested-rules.ts           # 6 prebuilt suggested rules
├── utils/
│   ├── rule-engine.ts               # evaluateCondition, evaluateGroup, evaluateRule, applyRulesToAnomalies
│   ├── rule-parser.ts               # parseNaturalLanguageRule()
│   └── risk-score.ts                # calculateRiskScore, getRiskScoreColor, getRiskScoreBreakdown
├── components/
│   ├── RuleBuilder/                 # Rule creation
│   │   ├── ConditionBuilder.tsx     # Single condition row
│   │   ├── GroupBuilder.tsx         # AND/OR condition group
│   │   ├── RuleBuilderContent.tsx   # Shared form + state
│   │   ├── RuleBuilderPanel.tsx     # SideDrawer wrapper
│   │   └── RuleBuilderInline.tsx    # Inline wrapper
│   ├── RuleDetail/                  # Rule inspection
│   │   ├── RuleDetailPanelContent.tsx
│   │   └── RuleDetailPanel.tsx      # SideDrawer wrapper
│   ├── TransactionGrid.tsx          # AG Grid wrapper + defenderGridTheme
│   ├── DetailPanel.tsx              # Transaction detail drawer
│   ├── KPICard.tsx                  # Metrics display
│   ├── SuggestedRules.tsx           # variant="inline" | "modal"
│   ├── AllRulesView.tsx             # Full rules list panel
│   ├── AllTransactionsView.tsx      # Full transactions panel
│   ├── ChatPanel.tsx                # Chatbot UI
│   ├── ActivityLogPanel.tsx         # Activity feed
│   ├── FieldSettingsPanel.tsx       # Column visibility toggles
│   ├── StatusBadge.tsx              # Status pill component
│   ├── AssigneeDisplay.tsx          # User avatar + name
│   ├── RuleSummaryItem.tsx          # Compact rule display
│   ├── DeleteRuleModal.tsx          # Confirmation modal
│   └── RemoveSignoffModal.tsx       # Confirmation modal
├── dev-tools/                       # Figma match overlay + Vite plugin
server/
└── db.json                          # Mock transaction/anomaly data
```

## Key Data Flow

```
Rules → RuleEngine evaluates against transactions → generates anomalies with risk scores → UI displays across panels
```

- `App.tsx` owns all state and callbacks; components receive props
- flexlayout-react manages panel arrangement — the `factory` function maps tab types to components
- Transaction data loads from json-server (`localhost:3001`); rules are client-side state
- Risk scores are calculated by combining rule severity, match count, and transaction attributes

## Design System

FlowUI is partially integrated:

- **Semantic color tokens** — CSS variables for all colors (no hardcoded hex)
- **FlowUI components** — Button, Modal, SideDrawer, Toggle, Checkbox, Avatar, Tooltip, Accordion, StatusBadge, Input, TextArea, SectionHeader, Divider, DropdownButton, IconButton, CloseButton, Toast
- **AG Grid theme** — `defenderGridTheme` built on FlowUI tokens
- **Tailwind v4** — Layout utilities, opacity syntax (e.g. `bg-black/50`)
- **Lucide icons** — Decorative rule-type indicators (not FlowUI)

## Project Info

| | |
|---|---|
| **Status** | Prototyping |
| **Started** | 2026-03-19 |
| **Team** | Benjamin Ellis (Product Design Manager), Gaurav (Original prototype) |
| **Project CLAUDE.md** | [`projects/defender/CLAUDE.md`](CLAUDE.md) |
| **Knowledge docs** | [`projects/defender/knowledge/`](knowledge/) |
| **Figma** | TBD |
| **Jira** | TBD |
