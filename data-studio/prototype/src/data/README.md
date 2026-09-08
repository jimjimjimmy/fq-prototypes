# Mock data

Self-contained mock data for the Data Studio v2 prototype. Ported
verbatim from v1
(`legacy-prototype-work/prototype-legacy/src/data/`) in Step 7a of the
v2 rebuild. Each file exports its own types alongside the mock arrays
so features can `import { Foo, type FooType } from '../../data/foo'`.

## Files

| File | Exports | Used by |
|---|---|---|
| `models.ts` | `Model`, `RunStatus`, `MODELS` | Catalog, Model View |
| `connections.ts` | `SourceType`, `ConnectionStatus`, `ErrorType`, etc. | Connectors list |
| `connectors.ts` | `Connector`, `CONNECTORS` | Connector setup, connectors list |
| `dimensions.ts` | `DimensionStatus`, `DimensionSource`, etc. | Dimensions |
| `field-mappings.ts` | `DataType`, `SourceField`, etc. | Field Mapping |
| `entity-mappings.ts` | `EntityMapping`, `ENTITY_MAPPINGS` | Entity Mapping (pending IA) |

## Conventions

- **No external imports.** Mock data files are leaf nodes — they don't
  import from features, scaffold, or anywhere else. This keeps them
  reusable and prevents accidental coupling.
- **Types live alongside data.** Each file exports both the type(s) and
  the mock arrays they describe. Consumers import what they need.
- **Mock-only.** None of these connect to real APIs. When real data
  comes online, swap individual files behind a wrapper (e.g. a
  `useModels()` hook) — feature code shouldn't have to change.

## Adding new mock data

Drop a new file in this folder following the same pattern: types at the
top, arrays at the bottom, no external imports. Update the table above.
