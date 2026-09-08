// FlowUI packages don't ship TypeScript declarations. Declare the modules we
// use as ambient so the app typechecks cleanly. Props are exercised at runtime
// against the live components; the dev server (Vite/esbuild) never type-checks
// these imports, so this only affects `tsc -b` / `npm run build`.
declare module '@floqastinc/flow-ui_core'
declare module '@floqastinc/flow-ui_core/Theme'
// Each icon is a separate entry point (e.g. .../material/Add). Wildcard so any
// icon import resolves without adding a line per icon.
declare module '@floqastinc/flow-ui_icons/material/*'
