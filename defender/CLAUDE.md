# Defender — Anomaly Detection Dashboard

## Overview
Defender is an anomaly detection dashboard prototype, originally built by Gaurav in Bolt and imported into the p&d repo. It features a flexlayout-react panel system with KPI cards, rule builders, and modal-driven workflows — all powered by mocked data.

## Goal
Explore and validate the UX for an anomaly detection dashboard within FloQast.

## Contributors
- @benjamin-ellis (Product Design Manager)

## Status
Phase: prototyping
Started: 2026-03-19

## Design System
Status: partial FlowUI alignment
Notes: FlowUI semantic color tokens used throughout (CSS variables). FlowUI core components used for Button, Modal, SideDrawer, Toggle, Checkbox, Avatar, Tooltip, Accordion, StatusBadge, Input, TextArea, SectionHeader, Divider, DropdownButton, IconButton, CloseButton, Toast. AG Grid themed with FlowUI tokens. Remaining Lucide icons are decorative rule-type indicators.

## Figma Files
TBD

## External Links
- Jira: TBD
- Confluence: TBD

## Running the Prototype
The prototype requires **two processes** — a Vite dev server and a mock API server:

```bash
cd projects/defender/prototype

# Option 1: Start both together (preferred)
npm run dev:full

# Option 2: Start separately
npm run server   # API server on http://localhost:3001
npm run dev      # Vite dev server on http://localhost:5173
```

The API server (`server/server.cjs`) serves transaction data on port 3001. Without it, the transaction grid will be empty.

## Key Knowledge
- `knowledge/` — Research and session notes

## File Structure
```
src/
├── App.tsx                          # State, callbacks, factory map, layout JSX (~920 lines)
├── main.tsx                         # Entry point
├── index.css                        # Tokenized flexlayout overrides
├── types/
│   └── index.ts                     # All interfaces (Rule, Anomaly, Comment, ViewDefinition, etc.)
├── data/
│   ├── mock-rules.ts                # Initial rules array (iconId strings, not JSX)
│   ├── suggested-rules.ts           # 6-item suggested rules (shared, deduplicated)
│   └── constants.ts                 # MONTH_MAP, ALL_FRAMES, PRESET_VIEWS, USERS, FIELD_OPTIONS
├── utils/
│   ├── rule-parser.ts               # parseNaturalLanguageRule()
│   ├── rule-engine.ts               # evaluateCondition, evaluateGroup, evaluateRule, applyRulesToAnomalies
│   └── risk-score.ts                # calculateRiskScore, getRiskScoreColor, getRiskScoreBreakdown
├── components/
│   ├── KPICard.tsx
│   ├── StatusBadge.tsx
│   ├── AssigneeDisplay.tsx
│   ├── TransactionGrid.tsx          # AG Grid wrapper + defenderGridTheme
│   ├── RuleSummaryItem.tsx
│   ├── DeleteRuleModal.tsx
│   ├── RemoveSignoffModal.tsx
│   ├── SuggestedRules.tsx           # Deduplicated: variant="inline" | "modal"
│   ├── ActivityLogPanel.tsx
│   ├── FieldSettingsPanel.tsx
│   ├── AllRulesView.tsx
│   ├── AllTransactionsView.tsx
│   ├── DetailPanel.tsx              # Transaction detail drawer (~840 lines)
│   ├── ChatPanel.tsx                # Chatbot UI + handlers
│   ├── RuleBuilder/
│   │   ├── ConditionBuilder.tsx
│   │   ├── GroupBuilder.tsx
│   │   ├── RuleBuilderContent.tsx   # Deduplicated shared form + state
│   │   ├── RuleBuilderPanel.tsx     # SideDrawer wrapper
│   │   └── RuleBuilderInline.tsx    # Inline wrapper
│   └── RuleDetail/
│       ├── RuleDetailPanelContent.tsx
│       └── RuleDetailPanel.tsx      # SideDrawer wrapper
├── dev-tools/                       # Figma match overlay tools
```

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- Track Figma file links — update this section when new files are added
- The codebase is componentized — edit the relevant component file, not App.tsx, for UI changes
- App.tsx owns state and callbacks; components receive props
- flexlayout-react panels are the core layout mechanism
- Mock data is in `src/data/` — transaction data loads from local API (see `server/`)
- FlowUI semantic tokens are used for colors — avoid hardcoding hex values
- Modal overlays use Tailwind v4 opacity syntax (e.g. `bg-black/50`)
- This is a prototype — optimize for speed and feel, not production robustness
