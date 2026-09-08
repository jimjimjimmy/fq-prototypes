# Figma Match Session — 2026-03-25

## Presence (Transaction Details Field Grid) — 16:00

**Target node:** 76:22060 (Container frame, 1279×158)
**File:** DetailPanel.tsx:399

### Figma Design Values

**Container:**
- `flex flex-wrap gap-[16px_24px]` (gap-y: 16px, gap-x: 24px)
- No padding on the container itself

**Field wrapper (Atomic helpers / Text):**
- `w-[236px]` (some columns 235px)
- Inner: `flex flex-col gap-[2px]`

**Label text (Label/Medium):**
- Font: Inter Medium, 12px, weight 500, line-height 16px
- Color: `#424867` via `var(--text-colors/body-secondary-text)`
- Truncation: `overflow-hidden text-ellipsis whitespace-nowrap`

**Value text (Body Small/Semibold):**
- Font: Inter Semi Bold, 12px, weight 600, line-height 18px
- Color: `#1d2433` via `var(--text-colors/body-text)`
- Transaction ID value has `underline` decoration

**Fields (15 total, 5×3 grid):**
Row 1: Transaction ID, Transaction Date, Posting Period, Amount, Currency
Row 2: Type, Subsidiary, Account, Name, Memo
Row 3: Department, Class, Location, Created Date, Created By

### Differences Found

1. **Labels missing truncation** — Figma specifies `overflow-hidden text-ellipsis whitespace-nowrap` on all labels; code has none
2. **"Created" vs "Created Date"** — Figma label reads "Created Date" (node 76:22074), code says "Created" (line 514)
