# Data Studio User Research Library

This folder stores session materials from user research conducted on Data Studio prototypes. Transcripts and metadata are committed to git so the full team can access them. Recordings are hosted externally (Google Drive) — each session's `metadata.md` includes a link.

## What's Here

```
research/
  sessions/
    _template/      — copy these when adding a new session
    {study-name}/   — one folder per study (e.g. api-setup-may-2026)
      session-NNN-{participant-name}/  — metadata + transcript per session
  analysis/         — cross-session synthesis and findings
  notebook-config.json — NotebookLM notebook ID and per-session source tracking
  changelog.md      — log of sessions added or updated
```

## NotebookLM Notebook

Sessions are loaded into a shared NotebookLM notebook for AI-assisted analysis across the full corpus.

**Notebook:** Data Studio User Research Sessions
See `notebook-config.json` for the notebook ID and per-session source IDs.

Example queries:
- "What tasks did participants struggle with most?"
- "Which sessions had participants who couldn't find the endpoint configuration?"
- "What were the most common points of confusion?"

## How to Add a New Session

1. If this is a new study, create a study folder under `sessions/` (e.g. `sessions/api-setup-june-2026/`)
2. Create a session folder inside the study folder: `session-NNN-{participant-name}/` (increment from the last session number across all studies)
3. Copy `sessions/_template/metadata.md` into it and fill in all fields
4. Copy `sessions/_template/transcript.md` into it and paste the Zoom transcript
5. Add the session as a source in the NotebookLM notebook (upload the transcript file)
6. Record the `notebooklm_source_id` in `notebook-config.json`
7. Add an entry to `changelog.md`
8. Commit on the project branch

## Studies

| Study | Sessions | Prototype | Dates |
|---|---|---|---|
| Connector Setup — API Connection Flow | 001–003 | connector-setup-prototype | 2026-05 |
| Connector Setup — CDC Connection Flow | 004–005 | Figma prototype (low-fidelity) | 2026-05 |
