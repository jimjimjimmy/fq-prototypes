# Persona: Morgan Chen — Senior Accountant (Excel Power User)

## At a Glance

| | |
|---|---|
| **Name** | Morgan Chen |
| **Title** | Senior Accountant |
| **Company** | Mid-market manufacturing company (~800 employees) |
| **Industry** | Manufacturing / Distribution |
| **Tenure at company** | 6 years |
| **FloQast role** | Preparer and owner of the close process |
| **Primary tools** | Excel (power user), Intacct, FloQast |
| **Technical level** | High with Excel; low with code |

---

## Who She Is

Morgan owns the month-end close at a company that moved from spreadsheet-based reconciliation to FloQast three years ago. She's the person other accountants on her team come to when a formula isn't working. She can write nested IFs, build pivot tables from scratch, and use XLOOKUP without looking it up. She's not a programmer — but she thinks in terms of data: she knows what a column is, what a data type is (even if she calls it "formatting"), and why you can't do math on a cell that looks like a number but is stored as text.

She was tapped to set up a new FloQast model because she's "the Excel person" and her manager figured she could figure it out.

---

## Mental Model: How She Thinks About Transformation

Morgan reasons about data transformation through Excel formulas. She knows:

- **Text manipulation:** `LEFT()`, `RIGHT()`, `MID()`, `FIND()`, `LEN()`, `TRIM()`, `CONCATENATE()` / `&`
- **Date handling:** `TEXT()`, `DATE()`, `YEAR()`, `MONTH()`, `DAY()` — she knows dates are actually numbers in Excel and that formatting is separate from the value
- **Conditional logic:** `IF()`, `IFS()`, `SWITCH()`, `IFERROR()`
- **Lookups:** `XLOOKUP()`, `VLOOKUP()`, `INDEX/MATCH`
- **Numeric formatting:** She knows a GL code like `001` stored as a number loses its leading zeros and how to fix it with `TEXT(A1,"000")`

What she **does not** know:
- **Regex** — she's heard the word, knows it's "some kind of pattern thing programmers use," and has never written one
- **SQL** — she knows it exists but has never touched it
- **The word "normalization"** — but she completely understands the concept of "FloQast expects the data in this format, my export has it in a different format"

---

## Her Source Data Context

Morgan's Intacct exports are CSVs with column names that reflect Intacct's internal naming (`LOCATIONID`, `DEPTID`, `TRTYPE`). She knows what each column means — she's been looking at these exports for years. She also knows what FloQast's model expects because she's been doing reconciliation in FloQast — she's seen the field names on the transaction side.

The gap she needs to bridge: **the data is right, it's just in a different shape.**

Common transformation challenges she'll face:
- Her `LOCATIONID` field contains values like `"LOC-US-001"` — FloQast's entity field wants `"001"` (last 3 characters)
- Her transaction date comes through as `"20240131"` (YYYYMMDD string) — FloQast expects `"2024-01-31"` (ISO date)
- Her account codes are `"40001"` but sometimes Intacct exports them as `40001.0` (decimal artifact) — she needs to strip the `.0`
- She occasionally needs to combine department and location into a single dimension key: `"DEPT001-LOC003"`

---

## Day in the Life: Transformation Functions Flow

**Context:** Morgan has been asked to create a new FloQast model pulling from their Intacct trial balance export. She's already uploaded the file via SFTP. Now she's in the model creation wizard at the transformation step.

1. **She arrives at the field mapping screen.** She recognizes the column names from her Intacct export. She starts matching them to FloQast fields — this part feels familiar, like setting up a VLOOKUP.

2. **She hits the entity field.** Her source value is `"LOC-US-001"` but FloQast's entity field needs `"001"`. She looks for a way to transform it. There's a function picker. She looks for `RIGHT()`. If it's there — great, she knows exactly what to do. If it's not, she's stuck.

3. **She tries to configure the function.** She needs to say "give me the last 3 characters." In Excel that's `=RIGHT(A1, 3)`. She needs the UI to make it equally obvious: *which field am I pulling from* and *what am I doing to it*. If there's a text input that says "Number of characters from the right," she'll figure it out. If there's a formula bar expecting syntax she doesn't know, she'll freeze.

4. **She wants to preview the output before saving.** She's going to look at a few sample rows and verify the output looks right. She won't trust it until she can see it. A preview showing her input value → output value is the moment she decides whether to proceed or go ask for help.

5. **She hits the date field.** Her source has `"20240131"`. She needs a date. She doesn't know what format string `"YYYYMMDD"` means in the system — she knows what it means conceptually, but she'll need either a dropdown of common formats or a live preview that shows her whether she got it right.

6. **She saves and runs a test.** If something is wrong, she needs an error message that says *which field* has a problem and *what the value was* that caused it — not a technical message about types or expressions.

---

## Key Design Moments (Where the UI Makes or Breaks Her)

| Moment | What she needs | What breaks her |
|---|---|---|
| Choosing a transform function | Familiar names (RIGHT, LEFT, TEXT, IF) | Unfamiliar function names or syntax she has to guess |
| Configuring a function | Labeled inputs ("Characters from right: ___") | A formula bar expecting expression syntax |
| Date format selection | Dropdown of common formats with examples | A format string she has to write herself |
| Previewing output | Real values from her file, input → output side by side | No preview, or a preview that uses fake/generic data |
| Handling an error | "The value 'LOC-US-001' in the Entity field returned an error" | Stack trace or generic "transformation failed" |
| Building conditional logic | An IF/THEN builder with dropdowns | Writing a CASE WHEN expression |

---

## Quotes (Representative)

> "I know what the data should look like — I've been cleaning this export in Excel for years. I just need to tell the system what to do with it."

> "I don't know what regex is. Can I just pick from a list?"

> "If I can see what it does to a real row before I save it, I'll know if it's right."

---

## Design Implications for Transformation Functions

- **Match Excel function names** wherever possible — `RIGHT`, `LEFT`, `TEXT`, `IF`, `TRIM`, `CONCATENATE`
- **No regex exposure** — any pattern-matching capability should be abstracted behind a visual builder or constrained UI
- **Live preview is non-negotiable** — she validates by eye, not by reasoning about the expression
- **Labeled inputs over expression editor** — "Characters from right" beats a formula bar
- **Error messages should be field-specific and value-specific** — not system-level
- **Date format selection should offer common formats as a dropdown** with a preview showing her actual date values in the selected format
