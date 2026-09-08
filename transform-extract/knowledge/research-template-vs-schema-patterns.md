# Template-vs-Schema Patterns: Research Findings

Research date: 2026-05-13
Scope: Quick scan of 10+ comparable products to validate the template-vs-schema terminology, UI patterns for seeding/replacing, destructive-confirm copy, and the IA decision to not allow template swap on the output form.

## TL;DR

- The split we made (template = one-shot seed, schema = the live thing) closely matches **Airtable's** model (template → base) and **Rossum's** `Create queue from template` API. Our terminology is defensible.
- "Schema" is the dominant term for the live, editable field definition in document-extraction tools (Rossum, Sensible's schema, Google Document AI, Nanonets). "Template" is more often used in horizontal/no-code tools (Airtable, Notion, Linear, Docparser).
- **Sensible is the most useful counter-pattern**: it uses "template" for the *live* per-vendor config, and "schema" for the output contract — almost the inverse of our model. Worth a one-line glossary note so users coming from Sensible aren't confused.
- Template selection at *creation time only* is the dominant IA pattern (Docparser, Airtable, Linear, Notion db templates, Google Doc AI). **None of the products checked let you swap a template on the output/results view.**
- Verbatim destructive-change copy in this space is thin — most products warn at the **field** level ("deleting this field will remove extracted data"), not at the **template-replace** level. A clear, specific "replace schema" confirm with named counts is genuinely uncommon.

## Terminology landscape

| Product | Term for "template" (seed) | Term for "schema" (live, editable) | One-shot? |
|---|---|---|---|
| Rossum | "template" (API: `Create queue from template`) | **Extraction schema** (per queue, edited in Schema Editor) | One-shot; schema lives on the queue |
| Sensible | **"Template"** = per-vendor config | **Schema** = output contract | **Inverted** — templates are live |
| Nanonets | "Pre-built model" / "Instant learning model" | **Schema** (visual builder) / **Fields & Table Headers** | Model is live; schema generated inside |
| Docparser | **"Template"** (selected when creating a parser; includes "Blank Template", "Docparser AI") | **Parser** + **parsing rules** | One-shot |
| Mindee (API Builder) | n/a (no template gallery) | **Custom API** with **fields** | Live; no seeding concept |
| Google Document AI | n/a — start from blank or "Foundation" model | **Processor schema** with **fields** | Live |
| Hyperscience | **"Supervision template"** + **versions** of it | The template *is* the schema | Live and versioned |
| Klippa | Pre-built **"templates"** (Financial, EU Passport, ID, etc.) | "Custom data fields" defined on top | Mixed |
| Airtable | **Template** | **Base** | One-shot — closest match to our model |
| Notion | **Database template** / **page template** | Database + properties | One-shot per new row |
| Linear | **Issue template** / **form template** | Issue (with fields) | One-shot at create time |

**Matches our model precisely:** Airtable, Docparser, Rossum API, Linear, Notion.

**Inverted / confusing:** Sensible.

Sources:
- [Rossum schema editor](https://knowledge-base.rossum.ai/docs/extraction-schema-editor-in-rossum)
- [Rossum Create queue from template](https://elis.rossum.ai/api/docs/)
- [Sensible document types](https://docs.sensible.so/docs/document-type-settings)
- [Sensible SenseML intro](https://docs.sensible.so/docs/senseml-reference-introduction)
- [Docparser create parser](https://help.docparser.com/hc/en-us/articles/41795272268820-How-to-Create-a-Parser)
- [Docparser template library](https://help.docparser.com/hc/en-us/articles/16255089899796-Template-Library)
- [Nanonets pre-built model](https://docs.nanonets.com/docs/setup-pre-built-model)
- [Mindee API Builder](https://www.mindee.com/blog/document-parsing)
- [Google Doc AI custom extractor](https://docs.cloud.google.com/document-ai/docs/custom-extractor-overview)
- [Hyperscience Custom Supervision](https://flows-sdk.hyperscience.ai/pages/custom_supervision.html)
- [Klippa custom data fields](https://www.klippa.com/en/dochorizon/custom-data-field-extraction/)
- [Airtable templates](https://support.airtable.com/docs/using-airtable-templates)
- [Linear issue templates](https://linear.app/docs/issue-templates)
- [Notion database templates](https://www.notion.com/help/database-templates)

## UI patterns: seeding & replacing

**Docparser** — At parser creation, the user lands in a **Template Library** (gallery of cards). Clicking a card opens a modal with a "Use Template" button. Selecting "Blank Template" produces an empty parser. There is no documented in-editor "swap template" — once the parser exists, you edit rules; you do not re-pick a template. ([Create your first parser](https://help.docparser.com/hc/en-us/articles/16254843719828-Create-your-first-document-parser), [Template Library help](https://help.docparser.com/hc/en-us/articles/16255089899796-Template-Library))

**Airtable** — Templates are selected from a gallery (airtable.com/templates) or from the homepage "Use template" button. The flow opens a "choose a workspace" dialog and clicks "Add base". Templates are explicitly one-shot. There is **no in-base "apply a different template"** action — the community thread "Using a template in an existing base" confirms this is a known limitation; the workaround is to duplicate the template base and then sync. ([Using templates](https://support.airtable.com/docs/using-airtable-templates), [Community: using template in existing base](https://community.airtable.com/base-design-9/using-a-template-in-an-existing-base-28530))

**Linear** — Inside the new-issue modal, there is a **"Template" affordance next to the team name**. Keyboard shortcut `Option+C` creates from template. There is no documented mid-draft "change template" UI — template selection happens at the moment of creation only. ([Issue templates](https://linear.app/docs/issue-templates))

**Notion** — In a database, a `New` split button shows a dropdown of available templates; choosing one stamps that template into a new row. Each template definition has a three-dot menu with "Duplicate" and "Duplicate without content" — i.e., the template entity itself is duplicated, not re-applied. ([Database templates](https://www.notion.com/help/database-templates))

**Rossum** — Schema is edited per-queue in the **Schema Editor** (Queue Settings > Fields tab) — visual fields list plus a JSON code editor for power users. Seeding from a template is API-only (`Create queue from template` endpoint); there is no documented in-app "duplicate from queue" picker. Once a queue's schema exists, you edit fields directly — there is no "replace schema with template X" affordance. ([Schema editor](https://knowledge-base.rossum.ai/docs/extraction-schema-editor-in-rossum), [Manage Queues](https://knowledge-base.rossum.ai/docs/manage-queues-in-rossum))

**Sensible** — Templates and schemas are file-based (SenseML configs live in your repo), edited in a visual card UI or as code. Replacement is a git operation, not a modal action. ([Visual Document Extraction](https://www.sensible.so/blog/introducing-visual-document-extraction-build-configurations-with-cards-and-natural-language))

**Nanonets** — Schema builder is in-model: left-nav `AI Training` > `Manage Labels` > `Fields` / `Table Headers`. A natural-language "schema generation" button generates JSON which is then editable. No template gallery; no replace flow. ([Pre-built model](https://docs.nanonets.com/docs/setup-pre-built-model), [docstrange changelog](https://docstrange.nanonets.com/docs/changelog))

## Confirm copy in the wild

Verbatim copy specifically about *replacing a template* on a live schema is rare. What was found is mostly at the **field level**:

**Covidence** — Documented behavior (verbatim wording not exposed in their help center): *"If you have started data extraction for any study and you delete a field, then you'll see a warning … to ensure that you don't accidentally delete data that has been extracted."* When deleting all template items, *"a warning message will confirm that all template items and extracted data will be deleted."* ([How to update a data extraction template](https://support.covidence.org/help/how-to-update-a-data-extraction-template))

**Laserfiche** — Field-type change pattern, paraphrased from forum: *"Whenever you change a field type, the system will prompt you to let you know that there could be potential data loss."* ([Existing field values when changing template field type](https://answers.laserfiche.com/questions/50027/Existing-field-values-when-changing-a-template-fields-type-from-List-to-Text))

**Chief Architect (template files)** — On reset: *"any changes that you may have made to these files will be lost"*. Simple but explicit. ([Resetting Template Files](https://www.chiefarchitect.com/support/article/KB-01866/resetting-template-files.html))

**Sitefinity Form Builder** — Counter-philosophy worth noting: their form-builder does *not* destroy historical data when fields are removed; orphan columns persist invisibly. ([What happens to Form Builder data when forms are modified](https://www.progress.com/blogs/what_happens_to_form_builder_data_when_forms_are_modified))

**Typeform** — Community thread shows the *absence* of a confirm causes anger: deleting a Section instantly nuked every question with no warning. Cautionary tale. ([Help! Accidentally deleted Section](https://community.typeform.com/build-your-typeform-7/help-accidentally-deleted-section-which-then-deleted-all-of-my-questions-242/index2.html))

**Patterns observed across all examples:**
1. Warnings are usually scoped to the field, not the whole template.
2. Specific counts ("X extracted values across Y documents") are essentially absent in public docs — under-served, credible differentiator.
3. The strongest verbatim copy uses concrete verbs: *"will be lost"*, *"will be deleted"*, *"potential data loss"* — not soft hedges.
4. None of the products surveyed offer a single-action recovery ("undo replace") in the confirm.

## Where template selection lives

| Product | Landing / new-doc | Editor | Settings / admin | Output / results view |
|---|---|---|---|---|
| Docparser | Yes (Template Library on parser creation) | No | No | No |
| Airtable | Yes (template gallery, homepage) | No | No | No |
| Linear | Yes (in new-issue modal) | n/a | Yes (manage templates) | No |
| Notion | Yes (database `New` dropdown) | Yes (`...` on template → Duplicate) | n/a | No |
| Rossum | API only (`Create queue from template`) | Yes (edits live schema) | Yes (queue settings) | No |
| Sensible | n/a — code repo | n/a — code repo | Document Type page | No |
| Nanonets | Yes (model creation) | Yes (schema builder in model) | n/a | No |
| Google Doc AI | Yes (processor creation) | Yes (schema fields editor) | n/a | No |
| Hyperscience | Yes (per Custom Supervision block) | Yes (template versions) | n/a | No |

## Counter-examples

**No product surveyed lets users swap templates on the output/results view.** Every product either:
1. Selects template at creation time (landing / new-doc), or
2. Edits the live schema directly inside an editor — never by re-selecting a template from a dropdown on the results view.

The closest thing to a counter-example is **Rossum's annotation behavior**: if a document is *moved* to a different queue, "the annotation in the new queue will still be associated with the old schema" ([API discussion](https://developers.rossum.ai/discuss/63dba2002c54bc007358239f)). This is a deliberate design choice — even when the doc moves, the schema doesn't retroactively swap on already-processed records. This validates our IA decision strongly.

## Recommendations for Extract

1. **Keep "template" and "schema" as our terms.** Both are well-established. Our usage matches Airtable, Docparser, Rossum's API, Linear, and Notion. Add a one-line tooltip on first encounter for users coming from Sensible: *"A template is a reusable starting point. Once applied, it creates a schema you can edit."*

2. **Lean into one-shot-seed language in the UI.** Verbs like "Start from template", "Create schema from template", or "Use template" (Airtable's wording) reinforce the one-shot model. Avoid "Apply template", "Link template", or "Attach template" — those imply a live reference.

3. **For the in-editor seed picker, consider mirroring Docparser's modal gallery pattern** instead of our current inline dropdown — a dropdown implies low-cost, non-destructive selection, but seeding when a schema exists is destructive. A modal with template cards + "Start from blank" sets the right expectation. Lower-priority refinement.

4. **Write a specific, count-aware confirm for the schema-replace flow.** Public docs in this space show this is rare, so we can lead:
   - **Title:** "Replace schema with [Template Name]?"
   - **Body:** "This will replace the current schema's fields. Extracted values from [N] processed documents will be cleared and re-extraction will be required."
   - **Buttons:** "Cancel" / "Replace schema" (destructive styling)
   - Optional recovery hint: "Duplicate the current schema first to keep a copy."

5. **Validate our IA decision in the PRD.** No comparable product allows template swap on the output view, and Rossum explicitly avoids retro-applying schema changes to processed annotations. Worth citing as prior-art validation when this lands in PRD form.
