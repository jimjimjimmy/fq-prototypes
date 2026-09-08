# Reference Materials

External artifacts mirrored into the repo so the team has shared access without depending on individual machines.

## `will-prototype.html`

Will's vibe-coded HTML prototype for IDEA-2246 (originally at `~/Downloads/IDEA-2246-prototype 6.html` on Edith's machine). Self-contained single-file React + Tailwind app with a 607-node sample hierarchy embedded as `YEXT_DATA`.

**To view:** open the file directly in a browser:

```bash
open projects/fdm-rollup/knowledge/reference/will-prototype.html
```

**Treat as intent reference, not source of truth.** Will explicitly flagged "Claude code hallucinations" in his version — most notably the per-panel save buttons. Real FDM saves the whole page (see `gong-call-takeaways.md`).

The hierarchy data has already been extracted to `prototype/src/data/sample-rollup.ts` for use in the prototype.
