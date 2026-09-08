# Persona: David Park — Finance Transformation Manager (SQL Power User)

## At a Glance

| | |
|---|---|
| **Name** | David Park |
| **Title** | Finance Transformation Manager |
| **Company** | Series B SaaS company (~1,500 employees) |
| **Industry** | SaaS / Technology |
| **Tenure at company** | 3 years |
| **FloQast role** | Technical owner of the data pipeline from ERP to FloQast |
| **Primary tools** | SQL (daily), Excel, dbt, Looker, NetSuite, FloQast |
| **Technical level** | SQL fluent; understands data modeling; knows the domain |

---

## Who He Is

David sits between Finance and Engineering. His title has changed a few times but the job is always the same: make financial data usable. He's the person who gets called when the FP&A team's Looker dashboard breaks, when the close process needs a new data feed, or when the company acquires another entity and suddenly there are two ERP systems producing subtly different formats.

He learned SQL on the job, starting with simple SELECTs and building up to CTEs and window functions over about four years. He's built dbt models, knows what staging vs. final tables mean, and has used `REGEXP_REPLACE` and `REGEXP_EXTRACT` in BigQuery. He does not think of himself as an engineer — but he's technical enough to talk to one. More importantly, he understands *why* FloQast needs the data in a specific format. He's seen what happens downstream when the entity field has 47 variants of the same business unit name.

He's being asked to set up FloQast's Data Studio connection because it was either him or a backend engineer, and the backend engineers don't know the financial domain well enough to get the transformation logic right.

---

## Mental Model: How He Thinks About Transformation

David reasons about data transformation through SQL. He thinks in terms of:

- **String manipulation:** `SUBSTRING()`, `REPLACE()`, `CONCAT()`, `TRIM()`, `SPLIT_PART()`, `REGEXP_EXTRACT()`, `REGEXP_REPLACE()`
- **Date handling:** `CAST(col AS DATE)`, `DATE_FORMAT()`, `EXTRACT(YEAR FROM date_col)`, `FORMAT_DATE()`
- **Conditional logic:** `CASE WHEN ... THEN ... ELSE ... END`, `COALESCE()`, `NULLIF()`, `IFF()`
- **Null handling:** He always thinks about nulls. He'll ask "what happens if this field is null?" before the UI prompts him to.
- **Row-level vs. aggregate:** He knows this step is row-level transformation (not aggregation), which shapes how he thinks about what's possible

He also thinks about his data in terms of **tables and schemas** — he knows what the source schema looks like and he has a mental picture of what the target FloQast schema looks like. He's probably already sketched the mapping in a Notion doc or a SQL comment before opening the UI.

---

## His Source Data Context

David is connecting NetSuite after a recent ERP migration. The entity field in NetSuite uses a composite key format inherited from the old system: `"US-WEST-001"`. FloQast's entity field expects the numeric subsidiary ID: `"001"`.

Common transformation challenges he'll face:
- Extract the trailing segment from a composite key: `REGEXP_EXTRACT(entity, '[0-9]+$')` or `SPLIT_PART(entity, '-', 3)`
- Standardize date format from NetSuite's `MM/DD/YYYY` to ISO `YYYY-MM-DD`
- Coalesce two possible department fields: his NetSuite has both `DEPT_PRIMARY` and `DEPT_OVERRIDE`, and he needs `COALESCE(DEPT_OVERRIDE, DEPT_PRIMARY)`
- Handle a transaction type code that maps to FloQast categories: effectively a `CASE WHEN` lookup
- Trim and uppercase account segment values that occasionally arrive with inconsistent casing or whitespace

---

## Day in the Life: Transformation Functions Flow

**Context:** David is setting up a new FloQast model after the NetSuite migration. He's already mapped the source connection. Now he's in the transformation step.

1. **He arrives at the field mapping screen and scans it fast.** He recognizes the column names, knows what they mean, and immediately starts thinking about which ones need transformation. He's already done this analysis — he probably has notes.

2. **He looks for an expression editor first.** His instinct is to type an expression directly. If there's a formula bar or expression input, he'll click it immediately. If the only interface is a visual builder with dropdowns, he'll use it — but he'll want to verify it's doing what he thinks it's doing.

3. **He hits the entity field and wants regex.** His NetSuite entity values are `"US-WEST-001"`. He wants to write `REGEXP_EXTRACT(entity_field, '[0-9]+$')` or equivalent. If regex is supported, he'll write it confidently. If not, he'll look for a `SPLIT` or `RIGHT`-equivalent. He'll figure out a workaround — but he'll want to know he's not leaving edge cases behind.

4. **He thinks about nulls immediately.** Before he saves any transformation, he'll ask himself: what happens if this field is null on a given row? He'll want to add a `COALESCE` or a fallback value. If the UI doesn't support this, he'll flag it as a gap.

5. **He wants to preview on real data — and he wants to see edge cases.** He'll look at the preview and immediately scan for: rows where the value is null, rows where the format is different from the majority, and rows that might hit the wrong branch of a conditional. A preview that shows him 5 hand-picked "clean" rows won't be enough.

6. **He'll want to understand the execution model.** Is this evaluated row by row? Is it compiled to SQL somewhere? Are there functions he's used in BigQuery that don't exist here? He'll probe the edges of the function library before he commits to a transformation design.

7. **He saves and verifies downstream.** After publishing, he'll check that the output matches what he expects by cross-referencing against his own SQL query run against the same source data. He trusts but verifies.

---

## Key Design Moments (Where the UI Makes or Breaks Him)

| Moment | What he needs | What breaks him |
|---|---|---|
| Arriving at the transformation UI | Quick signal: is there an expression editor or visual-only? | Ambiguity about what the UI is capable of |
| Writing a function | Expression editor with autocomplete and function reference | Dropdown-only UI with no way to type directly |
| Regex support | A regex input option with syntax validation | No regex — forces him to decompose into multiple simpler steps |
| Null handling | COALESCE or IF-NULL function available | A transform that silently passes nulls through |
| Conditional mapping | CASE WHEN equivalent (IF/THEN/ELSE with multiple branches) | Binary IF with no ELSE chain |
| Previewing output | Real data from his file, including nulls and outliers | Clean synthetic preview that hides edge cases |
| Understanding function scope | Clear documentation of what functions are available and their signatures | Discovery only by trial and error |
| Error messages | Precise: "Expected DATE, got STRING '20240131' at row 47" | Vague: "Transformation failed" |

---

## Quotes (Representative)

> "I already know what this needs to look like — I just need to know if the tool can express it."

> "What happens when the field is null? That's always the question."

> "If there's a regex option, I'll use it. If not, I'll figure out a workaround, but I want to know what I'm working with."

> "I want to see the expression, not just the output. I need to know the system is doing what I told it to do."

---

## Design Implications for Transformation Functions

- **Offer both visual builder and expression editor** — David reaches for the expression editor first; Morgan reaches for the visual builder first. The UI needs to serve both without forcing either to use the wrong interface
- **Regex must be supported** — it's the natural tool for this user's most common transformation (composite key extraction)
- **Expose null handling** — COALESCE/IFNULL should be first-class, not an afterthought
- **CASE WHEN / multi-branch conditional** — required for the transaction type mapping use case
- **Show the underlying expression** — even if a visual builder was used to construct a transform, David wants to see what it produced. A "view expression" toggle builds trust
- **Preview with real data, including edge cases** — let the user filter or sort the preview to find nulls and outliers
- **Function reference should be accessible inline** — not buried in docs; a hover tooltip with signature + example is enough
- **Error messages should be precise and row-specific** — include the field name, the offending value, and the row number if possible
