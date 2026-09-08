# Connectors

**Owner:** Kristin Johnson
**Status:** stub — pre-seeded Step 4 of the v2 rebuild
**Figma:** TBD — Connectors L1 view + setup wizard frames
**Last touched:** 2026-05-22

## What's in here

The L1 Connectors view (list of connector instances) at `/data-studio/connectors`,
plus a `setup/` sub-feature for the connector setup wizard (co-owned by
Kristin + Natasha + Rebecca).

## Files

- `ConnectorsListPage.tsx` — L1Frame stub for the list view
- `routes.tsx` — exports `connectorsRoutes` (just the list for now; Step 7
  adds nested setup routes)
- `setup/README.md` — placeholder for the setup wizard port

## Step 7 work

The connector setup wizard currently runs as a standalone Netlify-deployed
prototype at `prototype/netlify/connector-setup-prototype/`. Step 7 will
port it into `./setup/` so it composes with the v2 scaffold instead of
running standalone.

After the port, `routes.tsx` here will register additional routes for the
setup flow (e.g. `/data-studio/connectors/setup`,
`/data-studio/connectors/setup/:step`).
