# Migration Guide (Historical Reference)

> **Status: COMPLETE** — The Figma Make → Vite migration was finished in March 2026. This document is preserved as a historical reference for understanding what was done during migration. For current development, see the [Setup Guide](./setup-guide.md).

Step-by-step guide covering how Catalyst was migrated from its Figma Make export state to a locally-runnable Vite + React application. Phases were executed in order.

**Prerequisites at time of migration:** Node.js 18+ and npm (or pnpm). Familiarity with the [Figma Make Reference](./figma-make-reference.md) and [Architecture](./architecture.md) docs.

## Phase 1: Build Configuration

The Figma Make export has no build tooling. Create these files in the project root.

### 1.1 Create `package.json`

Dependencies are extracted from the versioned import specifiers in `components/ui/*.tsx` files (see [full list](./figma-make-reference.md#2-versioned-import-specifiers)).

```json
{
  "name": "project-catalyst",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.0.0",
    "lucide-react": "^0.487.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0",
    "class-variance-authority": "^0.7.1",

    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",

    "cmdk": "^1.1.1",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "next-themes": "^0.4.6",
    "react-day-picker": "^8.10.1",
    "react-hook-form": "^7.55.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.3",
    "vaul": "^1.1.2"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "~5.8.0",
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

> **Note on `next-themes`:** This package is imported by `components/ui/sonner.tsx` but is designed for Next.js. If the Sonner toast component isn't needed, remove both the dependency and the file. Otherwise, stub the `useTheme` import or replace with a Vite-compatible theme provider.

### 1.2 Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

> `noUnusedLocals` and `noUnusedParameters` are set to `false` because the Figma-generated code contains many intentionally unused imports.

### 1.3 Create `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 1.4 Create `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Catalyst</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 1.5 Create `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Phase 2: Fix Import Specifiers

### 2.1 Strip Version Suffixes from shadcn/ui Imports

Every file in `components/ui/` uses versioned import specifiers that npm doesn't understand. The `@version` suffix must be removed from all imports.

**Pattern:** `"package-name@X.Y.Z"` → `"package-name"`

Run this from the project root to fix all versioned imports:

```bash
# macOS/Linux (using sed)
find components/ui -name '*.tsx' -o -name '*.ts' | xargs sed -i '' -E 's/"([^"]+)@[0-9]+\.[0-9]+\.[0-9]+"/"\1"/g'
```

**Verification:** After running, confirm no versioned imports remain:

```bash
grep -r '@[0-9]\+\.[0-9]\+\.[0-9]\+"' components/ui/
# Should return no results
```

**38 unique versioned specifiers to be stripped:**

| Package | Version to Strip |
|---------|-----------------|
| `@radix-ui/react-accordion` | `@1.2.3` |
| `@radix-ui/react-alert-dialog` | `@1.1.6` |
| `@radix-ui/react-aspect-ratio` | `@1.1.2` |
| `@radix-ui/react-avatar` | `@1.1.3` |
| `@radix-ui/react-checkbox` | `@1.1.4` |
| `@radix-ui/react-collapsible` | `@1.1.3` |
| `@radix-ui/react-context-menu` | `@2.2.6` |
| `@radix-ui/react-dialog` | `@1.1.6` |
| `@radix-ui/react-dropdown-menu` | `@2.1.6` |
| `@radix-ui/react-hover-card` | `@1.1.6` |
| `@radix-ui/react-label` | `@2.1.2` |
| `@radix-ui/react-menubar` | `@1.1.6` |
| `@radix-ui/react-navigation-menu` | `@1.2.5` |
| `@radix-ui/react-popover` | `@1.1.6` |
| `@radix-ui/react-progress` | `@1.1.2` |
| `@radix-ui/react-radio-group` | `@1.2.3` |
| `@radix-ui/react-scroll-area` | `@1.2.3` |
| `@radix-ui/react-select` | `@2.1.6` |
| `@radix-ui/react-separator` | `@1.1.2` |
| `@radix-ui/react-slider` | `@1.2.3` |
| `@radix-ui/react-slot` | `@1.1.2` |
| `@radix-ui/react-switch` | `@1.1.3` |
| `@radix-ui/react-tabs` | `@1.1.3` |
| `@radix-ui/react-toggle` | `@1.1.2` |
| `@radix-ui/react-toggle-group` | `@1.1.2` |
| `@radix-ui/react-tooltip` | `@1.1.8` |
| `class-variance-authority` | `@0.7.1` |
| `cmdk` | `@1.1.1` |
| `embla-carousel-react` | `@8.6.0` |
| `input-otp` | `@1.4.2` |
| `lucide-react` | `@0.487.0` |
| `next-themes` | `@0.4.6` |
| `react-day-picker` | `@8.10.1` |
| `react-hook-form` | `@7.55.0` |
| `react-resizable-panels` | `@2.1.7` |
| `recharts` | `@2.15.2` |
| `sonner` | `@2.0.3` |
| `vaul` | `@1.1.2` |

### 2.2 Handle `figma:asset/` Image References

10 unique `figma:asset/[hash].png` references exist across active components. These need to be replaced with actual image files.

**Option A: Download from Figma (recommended)**
1. Open the Figma Make project
2. Export each referenced image asset
3. Save them to `src/assets/images/` with meaningful names
4. Update imports to reference the local files

**Option B: Use placeholder images**
1. Create a placeholder image (e.g., a 400x400 gray PNG)
2. Save as `src/assets/images/placeholder.png`
3. Replace all `figma:asset/` imports with the placeholder

**Option C: Use ImageWithFallback**
The existing `components/figma/ImageWithFallback.tsx` component already handles broken image URLs with a placeholder SVG. Wrap affected `<img>` elements with this component — the images will show fallback placeholders until real files are provided.

**Files requiring changes:**

| File | Asset Count | Hashes |
|------|-------------|--------|
| `components/Dashboard.tsx` | 4 | `9101b7a6...`, `0538d2de...`, `31677994...`, `77b62b99...` |
| `components/MyPriorities.tsx` | 2 | `84a29a22...`, `686138a2...` |
| `components/TaskDrilldown.tsx` | 1 | `686138a2...` |

> Files in `imports/` also reference `figma:asset` but these are orphaned files (not imported by active components). They can be left as-is or cleaned up later.

### 2.3 Fix Figma Font Syntax (Optional)

Some components use Figma's font-family syntax:

```
font-['Inter:Semi_Bold',sans-serif]  →  font-['Inter',sans-serif]
font-['Inter:Medium',sans-serif]     →  font-['Inter',sans-serif]
font-['Inter:Regular',sans-serif]    →  font-['Inter',sans-serif]
```

The weight part (`Semi_Bold`, `Medium`, `Regular`) is already handled by the accompanying Tailwind utility (`font-semibold`, `font-medium`, `font-normal`). This fix is cosmetic — the Figma syntax may cause console warnings but won't break rendering if Inter is loaded.

**Affected files:** `AgentsPanel.tsx`, `DefenderPanel.tsx`, `MyPriorities.tsx`, `TasksNew.tsx`, `Header.tsx`, and several `imports/` files.

```bash
# Fix in active components (macOS)
find components -name '*.tsx' | xargs sed -i '' "s/font-\['Inter:[^']*',sans-serif\]/font-['Inter',sans-serif]/g"
```

## Phase 3: Project Structure

### 3.1 Move Source Files into `src/`

Vite expects source files under `src/`. Create the directory structure and move files:

```bash
mkdir -p src

# Move source files
mv App.tsx src/
mv components/ src/
mv imports/ src/
mv styles/ src/
```

### 3.2 Update Import Paths

After moving files, relative import paths within `App.tsx` need updating if the directory relationships changed. Since `App.tsx` and `components/` are both moved into `src/`, their relative paths should remain the same:

```typescript
// These should still work as-is after moving:
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
```

Verify by checking that all relative imports in `src/App.tsx` still resolve correctly.

### 3.3 Add Tailwind CSS Import

Add the Tailwind CSS import to the top of `src/styles/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));
/* ... rest of existing globals.css ... */
```

### 3.4 Create `.gitignore`

```
node_modules/
dist/
.DS_Store
*.local
```

### 3.5 Post-Migration Directory Structure

```
Catalyst/
├── docs/
│   ├── architecture.md
│   ├── component-reference.md
│   ├── design-decisions.md
│   ├── figma-make-reference.md
│   ├── migration-guide.md         (this file)
│   └── setup-guide.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   ├── ui/                     (48 shadcn/ui files)
│   │   │   ├── button.tsx
│   │   │   ├── utils.ts
│   │   │   └── ...
│   │   ├── AIPanel.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DrilldownTemplate.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TaskManagement.tsx
│   │   ├── WorkflowManagement.tsx
│   │   └── ...                     (13 more components)
│   ├── imports/                    (118 Figma-generated files)
│   │   ├── svg-*.ts               (50 SVG path data files)
│   │   ├── svg-*.tsx              (2 SVG data URI files)
│   │   └── *.tsx                  (66 Figma component wrappers)
│   ├── styles/
│   │   └── globals.css
│   └── assets/
│       └── images/                 (downloaded figma:asset files)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── Attributions.md
└── README.md
```

## Phase 4: Install and Verify

### 4.1 Install Dependencies

```bash
npm install
```

If version conflicts arise, check that the versions in `package.json` match the pinned versions from the [Figma Make Reference](./figma-make-reference.md#2-versioned-import-specifiers).

### 4.2 Start Dev Server

```bash
npm run dev
```

Expected: Vite starts on `http://localhost:5173`.

### 4.3 Verification Checklist

| Check | What to Verify |
|-------|---------------|
| Dev server starts | No build errors, Vite serves the page |
| Dashboard renders | AI insight cards, metrics, My Priorities, progress bar |
| Task Management renders | All 4 views (Board, Table, Timeline, Calendar) switch correctly |
| Workflow Management renders | Table with 20 rows, filters work |
| Sidebar | Expands/collapses, workspace/admin toggle works |
| AI Panel | Slides in from right, content area pushes left |
| Search Modal | Opens, shows tabbed results |
| Notifications | Dropdown opens from bell icon |
| Task Drilldown | Click a task → drilldown page renders with all sections |
| No console errors | Check for unresolved imports or missing dependencies |

### 4.4 Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'figma:asset/...'` | figma:asset imports not resolved | Replace with local file paths (Phase 2.2) |
| `Cannot find module '@radix-ui/react-slot@1.1.2'` | Versioned import not stripped | Re-run Phase 2.1 sed command |
| `Cannot find module 'next-themes'` | sonner.tsx imports next-themes | Install it or remove sonner.tsx |
| `Module not found: '../imports/svg-...'` | File not moved to src/ | Check that imports/ was moved under src/ |
| Tailwind classes not applying | Missing Tailwind import | Add `@import "tailwindcss"` to globals.css (Phase 3.3) |
| `@custom-variant` error | Tailwind v3 installed instead of v4 | Ensure `tailwindcss@^4.0.0` in package.json |

## Known Issues

### Orphaned `imports/` Files

66 component wrapper files and ~40 SVG path files in `imports/` are not referenced by any active component. They represent Figma Make's initial code generation, superseded by the hand-written components in `components/`. These files can be safely deleted to reduce project size, but they're also harmless to keep.

To identify which imports files are actually used:

```bash
# Find all imports referenced by active components
grep -roh '"\.\.\/imports\/[^"]*"' src/components/*.tsx | sort -u
```

### Figma Font Syntax

The `font-['Inter:Medium',sans-serif]` pattern in some components may cause Tailwind warnings. It's cosmetic and doesn't affect functionality. See Phase 2.3 for the fix.

### Hard-Coded Dates

The current "today" date is `new Date(2026, 1, 25)` (February 25, 2026) in `TaskManagement.tsx:27`. All mock data dates are relative to this. To update, change this date and review the mock task `dueDate` values for consistency.

### `"use client"` Directives

Some shadcn/ui files include `"use client"` directives at the top (e.g., `input-otp.tsx`). These are Next.js-specific and are ignored by Vite — they won't cause errors but are unnecessary.

### TypeScript Strictness

The Figma-generated code was not written with strict TypeScript in mind. Expect some type errors if `strict: true` is enabled. The `tsconfig.json` in Phase 1.2 includes `noUnusedLocals: false` and `noUnusedParameters: false` to suppress the most common warnings. Further type cleanup may be needed for a clean `tsc` build.
