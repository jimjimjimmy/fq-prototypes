# Model View (L2)

**Status:** stub — pre-seeded Step 4 of the v2 rebuild
**Figma:** L2 sidebar open `1:21710` · collapsed `1:21766` · fullscreen `1:21849`
**Last touched:** 2026-05-22

## What's in here

The detail view for a single model — accessed at
`/data-studio/model/:modelId/{section}`. Wraps content in `L2Frame`
(breadcrumb + page header + L2 sidebar + fullscreen toggle) and renders
the active section content.

The L2 sidebar has 6 sections, each its own sub-folder with its own
`routes.tsx` + owner README:

| Section | Owner | Status |
|---|---|---|
| `overview/` | Natasha + Alex | stub |
| `source-datasets/` | Natasha + Alex | stub |
| `field-mapping/` | Natasha + Alex | port from v1 in Step 7 |
| `data-preview/` | — | stub |
| `versions/` | — | stub |
| `logs/` | Alex (per-model) | stub |

## Shared files

- `sections.ts` — the canonical sidebar item list (id + label per section).
  Imported by `ModelStubLayout.tsx` and every section's routes file. To
  add a new section: edit this file AND create a folder + routes.tsx.
- `ModelStubLayout.tsx` — wraps `L2Frame` with shared hardcoded placeholder
  values (status, last-updated, breadcrumb). Each section's stub uses this
  so it only has to pass `activeSectionId`, `sectionTitle`, and content.
  Replace the hardcoded data with a real model-lookup hook in Step 7+.
- `routes.tsx` — composes the section routes into `modelViewRoutes` array,
  plus an index redirect (`model/:modelId` → `model/:modelId/overview`).

## Step 7 work

`field-mapping/` gets the AG Grid + AI panels ported from
`legacy-prototype-work/prototype-legacy/src/components/field-mapping/`.

Once the real layout lands, `ModelStubLayout.tsx` likely retires in
favor of a `useModel(modelId)` hook + a thinner shared layout. Treat it
as scaffolding.
