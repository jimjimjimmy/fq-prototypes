# Figma Make Reference

This document explains what [Figma Make](https://www.figma.com/make/) generates and how its output maps to standard React/Vite conventions. Understanding these patterns is essential before attempting the [migration](./migration-guide.md).

## What Is Figma Make?

Figma Make is a Figma feature that converts design files into functional React + Tailwind CSS code. It generates complete component trees, SVG icon data, image asset references, and pre-configured shadcn/ui components — all runnable inside Figma's built-in preview environment.

The generated code is **real React** (not a proprietary framework), but it uses several Figma-specific conventions that don't work in a standard Vite/Node.js build without modification.

## Figma-Specific Patterns

### 1. `figma:asset/` Protocol

Figma Make references raster images (photos, avatars) using a custom import protocol:

```typescript
import imgCritical from "figma:asset/9101b7a6c872a9387b2a936b8d4b8e8e54543c96.png";
import imgReady1 from "figma:asset/0538d2de337167b74362235cc8fdf8b17e5cecb3.png";
```

The hash is a content-addressable identifier for images stored in Figma's CDN. These imports resolve inside Figma Make's preview but are unrecognizable to Vite.

**10 unique asset hashes in this project:**

| Hash | Used In |
|------|---------|
| `0538d2de337167b74362235cc8fdf8b17e5cecb3` | Dashboard, imports/ |
| `31677994587b348e73ed437b4e7fd1fd6bbb42d4` | Dashboard, imports/ |
| `686138a21986a605bceeb1b981bba9824a6b502d` | TaskDrilldown, MyPriorities, imports/ |
| `69b2e754692aa2f551cd3716bfb04dec0ca551e1` | imports/ |
| `77b62b998b242b8dd363292a29959054fede168a` | Dashboard, imports/ |
| `84a29a22df822157b52fa5347c1b10889cb4d065` | MyPriorities, imports/ |
| `9101b7a6c872a9387b2a936b8d4b8d8e54543c96` | imports/ (variant hash) |
| `9101b7a6c872a9387b2a936b8d4b8e8e54543c96` | Dashboard |
| `9724374cd35a638f74f1fa0ae6194ce965c83281` | imports/ |
| `9a75ee2c58b733aceebffa284a58ef40771654b4` | imports/ |

> Note: Two nearly identical hashes exist (`...4b8d8e...` vs `...4b8e8e...`), likely a Figma versioning artifact.

### 2. Versioned Import Specifiers

shadcn/ui components import dependencies with pinned version numbers appended to the package name:

```typescript
// Figma Make generates this:
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";
import { CheckIcon } from "lucide-react@0.487.0";

// Standard npm expects this:
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon } from "lucide-react";
```

Figma Make uses these versioned specifiers to pin exact dependency versions within its sandboxed environment. Node.js module resolution does not understand this syntax — the `@version` suffix must be stripped.

**All versioned packages in this project (38 unique specifiers):**

| Package | Pinned Version |
|---------|---------------|
| `@radix-ui/react-accordion` | 1.2.3 |
| `@radix-ui/react-alert-dialog` | 1.1.6 |
| `@radix-ui/react-aspect-ratio` | 1.1.2 |
| `@radix-ui/react-avatar` | 1.1.3 |
| `@radix-ui/react-checkbox` | 1.1.4 |
| `@radix-ui/react-collapsible` | 1.1.3 |
| `@radix-ui/react-context-menu` | 2.2.6 |
| `@radix-ui/react-dialog` | 1.1.6 |
| `@radix-ui/react-dropdown-menu` | 2.1.6 |
| `@radix-ui/react-hover-card` | 1.1.6 |
| `@radix-ui/react-label` | 2.1.2 |
| `@radix-ui/react-menubar` | 1.1.6 |
| `@radix-ui/react-navigation-menu` | 1.2.5 |
| `@radix-ui/react-popover` | 1.1.6 |
| `@radix-ui/react-progress` | 1.1.2 |
| `@radix-ui/react-radio-group` | 1.2.3 |
| `@radix-ui/react-scroll-area` | 1.2.3 |
| `@radix-ui/react-select` | 2.1.6 |
| `@radix-ui/react-separator` | 1.1.2 |
| `@radix-ui/react-slider` | 1.2.3 |
| `@radix-ui/react-slot` | 1.1.2 |
| `@radix-ui/react-switch` | 1.1.3 |
| `@radix-ui/react-tabs` | 1.1.3 |
| `@radix-ui/react-toggle` | 1.1.2 |
| `@radix-ui/react-toggle-group` | 1.1.2 |
| `@radix-ui/react-tooltip` | 1.1.8 |
| `class-variance-authority` | 0.7.1 |
| `cmdk` | 1.1.1 |
| `embla-carousel-react` | 8.6.0 |
| `input-otp` | 1.4.2 |
| `lucide-react` | 0.487.0 |
| `next-themes` | 0.4.6 |
| `react-day-picker` | 8.10.1 |
| `react-hook-form` | 7.55.0 |
| `react-resizable-panels` | 2.1.7 |
| `recharts` | 2.15.2 |
| `sonner` | 2.0.3 |
| `vaul` | 1.1.2 |

### 3. UUID-Based File Naming

Figma Make names component files using Figma's internal node IDs:

```
Container-4085-7805.tsx    → Container component, node 4085, variant 7805
Badges-4330-2009.tsx       → Badges component, node 4330, variant 2009
Frame1000001524-4079-12222.tsx → Auto-named frame with node/variant IDs
```

These names are machine-generated and not meaningful to developers. The numeric suffixes correspond to Figma's internal node graph.

### 4. SVG Path Data Objects

Instead of inline SVG or `.svg` files, Figma Make extracts SVG path data into TypeScript objects:

```typescript
// imports/svg-0gmqjynf3e.ts
export default {
  p3eeed600: "M9.93366 2.9335H2.93366C2.28932...",
  p4a2bc100: "M4.5 6.5L7.5 3.5L10.5 6.5",
};
```

Components reference these paths by key:

```tsx
import svgPaths from "../imports/svg-ni0ebo43wn";

<svg viewBox="0 0 20 20">
  <path d={svgPaths.p2acb5480} fill="#01392F" />
</svg>
```

The hash-based filenames (`svg-[12char].ts`) and hex-prefixed keys (`p[hex]`) are Figma-generated identifiers.

### 5. SVG Data URI Exports

Two files use URL-encoded SVG data URIs instead of path objects:

```typescript
// imports/svg-r73ml.tsx
export const imgVector = "data:image/svg+xml,%3Csvg%20preserveAspectRatio...";
```

These are used as `src` values for `<img>` elements.

### 6. ImageWithFallback Component

Figma Make includes a utility component at `components/figma/ImageWithFallback.tsx` that wraps `<img>` elements with error handling. When an image fails to load (as `figma:asset/` URLs will outside Figma), it displays a placeholder SVG.

### 7. Figma Font Syntax

Figma Make generates font-family declarations using a colon-separated weight syntax:

```html
<p className="font-['Inter:Semi_Bold',sans-serif] font-semibold ...">
<p className="font-['Inter:Medium',sans-serif] font-medium ...">
```

Standard CSS expects `font-family: 'Inter', sans-serif` with weight controlled separately via `font-weight`. The `Inter:Semi_Bold` syntax is Figma-specific.

## File Inventory

### By Directory

| Directory | File Count | Description |
|-----------|-----------|-------------|
| `imports/` | 118 total | Figma-generated support files |
| `imports/` (SVG path) | 50 | `.ts` files with SVG path data objects |
| `imports/` (SVG data URI) | 2 | `.tsx` files with encoded SVG data URIs |
| `imports/` (components) | 66 | `.tsx` Figma component wrappers |
| `components/` | 20 | Custom application components |
| `components/figma/` | 1 | ImageWithFallback utility |
| `components/ui/` | 48 | shadcn/ui components (46 `.tsx` + 2 utility) |
| `styles/` | 1 | `globals.css` |

### Active vs. Orphaned Files

**Active files** — imported by at least one custom component in `components/`:
- `App.tsx` — root component
- All 20 files in `components/*.tsx`
- `components/figma/ImageWithFallback.tsx`
- `styles/globals.css`
- ~12 SVG path files referenced by custom components
- 48 shadcn/ui files (used selectively)

**Orphaned files** — exist in `imports/` but are not imported by any active component:
- ~54 component wrapper files in `imports/` (original Figma-generated views, superseded by hand-written components)
- ~40 SVG path files only referenced by orphaned import files

The 66 component wrappers in `imports/` represent Figma Make's initial code generation. The 20 custom components in `components/` were written on top of this foundation, directly importing only the SVG path data they need.

## Migration Mapping

| Figma Make Pattern | Standard React/Vite Equivalent |
|--------------------|-------------------------------|
| `figma:asset/[hash].png` | Local file in `public/images/` or CDN URL |
| `"@radix-ui/react-slot@1.1.2"` | `"@radix-ui/react-slot"` (version in `package.json`) |
| `svg-[hash].ts` path objects | Keep as-is (valid TypeScript) |
| `Container-4085-7805.tsx` | Rename or keep (cosmetic) |
| `font-['Inter:Semi_Bold',sans-serif]` | `font-['Inter',sans-serif]` + `font-semibold` |
| `ImageWithFallback` | Keep or replace with standard `<img>` + error boundary |
| `data-name="Component"` attributes | Remove (Figma debugging metadata) |

See the [Migration Guide](./migration-guide.md) for step-by-step instructions.
