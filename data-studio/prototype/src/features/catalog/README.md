# Catalog

**Owner:** Natasha Clark
**Status:** stub — pre-seeded Step 4 of the v2 rebuild
**Figma:** TBD — Catalog L1 view (see Data Studio Scaffold file + lineage Figma)
**Last touched:** 2026-05-22

## What's in here

The L1 catalog view — the table of models. Top-level route at
`/data-studio/catalog` (the index route for Data Studio).

Currently `CatalogPage.tsx` is a stub showing the scaffold + a placeholder
content area. Step 7+ will land the real model-list table + filter / search
behavior.

## Files

- `CatalogPage.tsx` — wraps content in L1Frame, passes the search + Create
  Model right-slot
- `routes.tsx` — exports `catalogRoutes` (`<Route path="catalog" />`)
- `README.md` — this file
