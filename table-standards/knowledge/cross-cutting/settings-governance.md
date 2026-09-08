# Cross-cutting — Settings & Governance (Tiered Settings)

**Status:** ⚠️ STUB — the **least-defined** piece; demand captured, **not yet designed.** Applies to: all profiles; P3b is the loudest consumer.

## The demand (real, from research)
- **Steve Raeder** (AG Grid QoL, Mar 18) — per-table column visibility is "not very scalable"; strong demand for **tiers of settings**:
  - org-level **"company standard reports"**;
  - admin ability to **hide columns from exposure** entirely (not a security setting — just not in the menu);
  - **app-level deviations** ("even though it's all ag grid, different experiences demand different settings").
- **Marc Reicher** (Jan 22) — "infinite requests" about column order; users fix it in Excel after every export.
- **Customer demand** for tiered settings incl. global column-visibility controls + standard reports (AG Grid QoL, Mar 18).
- **Tyler Davis** (Mar 18) — consistency concern about a **free-floating settings component** given AG Grid's widespread use.
- **Reporting Optionality PRD** — a Settings drawer of ~13 toggles + presets; settings persist in report config and **cascade to child reports**; `gridDisplay` + `gridData` config objects.

## Why it's a stub (defer the *design*)
This reaches deep into product + engineering (entitlements, admin roles, persistence architecture) and is genuinely undesigned. It's two things that need untangling: (a) the **per-table settings drawer** (a UI pattern) vs. (b) the **governance layer** (who controls settings across users/apps/org, and how it cascades).

## Open questions to resolve before designing
- **Control tiers** — user vs. app-admin vs. org-admin. Who sets what?
- **Cascade model** — how do org-standard settings push down; can users override; how do child reports inherit?
- **Entitlements tie-in** — how does this relate to existing FloQast roles/permissions? (deliberately *not* a security control per Steve, but adjacent)
- **Per-app deviation** — one settings schema with per-surface overrides?
- **The free-floating component concern** (Tyler) — one consistent settings surface across all AG Grid instances, or per-context?
- **Persistence + perf** — settings apply < 200ms (no layout shift); where is state stored?

## Links
- Reporting Optionality PRD (Confluence 4430209556) · Table Settings epic (IDEA-2369 / REPORTING-14185)
- `../tiers/P3b-analytical.md` · `saved-views.md` (closely related)
