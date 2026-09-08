# Data Studio: Programmatic Run Log Access (Future)

| Field             | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Target release    | Post-Q3 — future iteration                                   |
| Epic              | IDEA-2488 — Data Studio: Platform Features                   |
| Document status   | FUTURE DRAFT — not scoped for Q3                             |
| Document owner    | Alex Kearns                                                  |
| Depends on        | Logging & Audit Q3 (core run log schema must ship first)     |
| Related sub-PRDs  | [Logging & Audit Q3](prd-logging-audit-q3.md)                |

---

## 🎯 Objective

Enable enterprise customers to integrate FloQast run log data with their own monitoring and alerting stacks, either by polling an API or by receiving event-driven webhook notifications when a run completes or fails.

This is a post-Q3 feature. It depends on the core run log infrastructure shipping first (see Logging & Audit Q3 PRD — LA1, LA10).

---

## 🏅 Why This Is Important

Enterprise customers cannot currently answer "how do we know when an integration fails?" without an accountant noticing stale data. This is a recurring question in enterprise security reviews and has been flagged as critical by Support Engineering (Jason Smith, May 2026). The core logging UI (Logs tab, run history) addresses the in-product visibility gap, but does not help customers who need to integrate failure signals into their existing alerting and ticketing workflows (e.g., PagerDuty, ServiceNow, Slack).

---

## 💡 What Customers Need

From Support Engineering (Jason Smith, May 2026):
- Ability to query run log data programmatically on a polling basis (e.g., every 15–30 minutes) or receive event-driven notifications at the moment a failure occurs
- Enough information in the payload to trigger their own alerting and ticket workflows — minimum: run status, error_type (transient vs. permanent), connector, model, timestamp
- Ability to build branching logic based on transient (self-healing) vs. permanent (remediation required) failures

---

## 🗺️ Scope to Size

| Surface | What | Notes |
|---|---|---|
| REST API — run log query | `GET /runs` endpoint with filter params: connector_id, model_id, status, error_type, since (ISO timestamp) | Supports polling pattern. Pagination required. Auth via existing customer API credentials. |
| REST API — single run detail | `GET /runs/{run_id}` | Returns full job log schema for one run including error_type, retry_count, error_message |
| Webhook / event push | POST to customer-configured URL on run completion (success or failure) | Supports event-driven pattern. Payload = run log schema. Customer configures endpoint + optional filter (failures only). |
| Notification settings UI | In-product UI for admins to configure webhook endpoint, filter (all runs / failures only / permanent failures only), and test the connection | Lightweight; not a full notification center |

**Out of scope:** Change log API (manual CSV export is sufficient for audit use case per Jason). CAS entity-level data segregation in exports (convenience only, not a security requirement per Jason).

---

## ❓ Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-1 | Should the webhook payload schema exactly mirror the internal job log schema, or be a curated customer-facing subset? | Alex K / Engineering | Open |
| OQ-2 | What auth mechanism for webhooks — shared secret / HMAC signature, or customer API key? | Engineering | Open |
| OQ-3 | Should the API support tenant-level filtering (all connectors/models) or require connector_id / model_id scoping? | Alex K / Engineering | Open |

---

## 📚 References

- [Logging & Audit Q3](prd-logging-audit-q3.md) — core run log schema and internal monitoring emission (LA1, LA10)
- Source: Support Engineering conversation, Jason Smith, May 2026
