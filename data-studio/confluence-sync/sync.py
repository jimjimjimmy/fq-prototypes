#!/usr/bin/env python3
"""
sync.py — Sync changed Confluence PRD pages to NotebookLM.

Usage (from repo root):
  python3 projects/data-studio/confluence-sync/sync.py [--dry-run]

--dry-run: fetch content and detect issues, report what would happen — no NLM changes.

Outputs JSON to stdout:
  Normal:   {"mode": "sync",     "synced": [...], "skipped": [...], "errors": [...]}
  Dry-run:  {"mode": "dry-run",  "pages":  [...]}

Each synced entry: {id, title, old_source_id, new_source_id, content_length}
Each dry-run page: {id, title, content_length, warnings, action}
  warnings may include "possible_tombstone" if content is very short or redirect-like
"""
import json, re, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).parent
SNAPSHOTS = BASE / "snapshots"

TOMBSTONE_PHRASES = [
    "this page has moved", "this page has been replaced",
    "this page is a redirect", "please refer to", "has been deprecated",
]


def load_config():
    return json.loads((BASE / "config.json").read_text())


def twg_fetch_page(page_id, site):
    r = subprocess.run(
        ["twg", "confluence", "page", "get",
         "--page", page_id, "--site", site,
         "--body-format", "markdown", "--body", "full",
         "--comments", "none", "--skip-ancestors",
         "--output", "json", "--output-summary", "auto", "--agent-fields", "@evidence"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"TWG page get failed for {page_id}:\n{r.stderr.strip()}")
    # TWG outputs YAML to stdout with paths to the actual JSON files
    for pattern in (r'  stdout: "([^"]+)"', r'  compact: "([^"]+)"'):
        m = re.search(pattern, r.stdout)
        if m:
            return json.loads(Path(m.group(1)).read_text())
    raise RuntimeError(f"Could not locate page content for {page_id}")


def nlm_list_sources(notebook_id):
    r = subprocess.run(
        ["nlm", "source", "list", notebook_id, "--json"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"nlm source list failed:\n{r.stderr.strip()}")
    return json.loads(r.stdout)


def nlm_delete_source(source_id):
    r = subprocess.run(
        ["nlm", "source", "delete", source_id, "-y"],
        capture_output=True, text=True
    )
    return r.returncode == 0


def nlm_add_source(notebook_id, file_path, title):
    r = subprocess.run(
        ["nlm", "source", "add", notebook_id, "--file", str(file_path), "--title", title, "--wait"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"nlm source add failed for '{title}':\n{r.stderr.strip()}")
    # Parse "Source ID: <id>" from output
    for line in r.stdout.splitlines():
        if line.startswith("Source ID:"):
            return line.split(":", 1)[1].strip()
    raise RuntimeError(f"Could not parse source ID from nlm output:\n{r.stdout}")


def detect_tombstone_warnings(content):
    if not content:
        return ["empty_page: no content"]
    if len(content) < 500:
        warnings = [f"possible_tombstone: only {len(content)} chars"]
        lower = content.lower()
        for phrase in TOMBSTONE_PHRASES:
            if phrase in lower:
                warnings.append(f"redirect_phrase: '{phrase}'")
        return warnings
    lower = content.lower()
    return [f"redirect_phrase: '{p}'" for p in TOMBSTONE_PHRASES if p in lower]


def main():
    dry_run = "--dry-run" in sys.argv
    config = load_config()
    site = config["confluence"]["site"]
    notebook_id = config["notebooks"]["data_studio_prds"]["id"]
    tracked = {p["page_id"]: p["title"] for p in config["notebooks"]["data_studio_prds"]["pages"]}

    # Find changed pages using check.py logic (inline to avoid import issues)
    # Reuse check.py by importing it if available, else duplicate the logic
    try:
        sys.path.insert(0, str(BASE))
        from check import oldest_snapshot_date, snapshot_mtime, twg_search as _search
        start_date = oldest_snapshot_date()
        cql = f'space = "Data" AND type = "page" AND lastModified >= "{start_date}"'
        results = _search(cql, 200, site)
        if isinstance(results, dict):
            results = results.get("results", [])
        ignored_ids = {p["page_id"] for p in config.get("ignored_page_ids", [])}
        changed_ids = []
        for page in results:
            # Search compact JSON nests id under "content"; fall back to top-level for other formats
            content = page.get("content", {}) if isinstance(page.get("content"), dict) else {}
            page_id = str(content.get("id", "") or page.get("id", ""))
            if not page_id or page_id in ignored_ids or page_id not in tracked:
                continue
            lm_str = page.get("lastModified", "")
            mtime = snapshot_mtime(page_id)
            if mtime is None:
                changed_ids.append(page_id)
                continue
            try:
                if datetime.fromisoformat(lm_str.replace("Z", "+00:00")) > mtime:
                    changed_ids.append(page_id)
            except ValueError:
                pass
    except ImportError:
        print(json.dumps({"error": "Could not import check.py — run from repo root"}))
        sys.exit(1)

    if not changed_ids:
        print(json.dumps({"mode": "dry-run" if dry_run else "sync",
                          "changed_count": 0, "synced": [], "skipped": [], "errors": []}))
        return

    # Fetch content for all changed pages
    pages_content = {}
    for page_id in changed_ids:
        try:
            page_data = twg_fetch_page(page_id, site)
            content = page_data.get("data", {}).get("body", {}).get("markdown", {}).get("value", "")
            title = page_data.get("data", {}).get("title", tracked.get(page_id, page_id))
            pages_content[page_id] = {"title": title, "content": content}
        except RuntimeError as e:
            pages_content[page_id] = {"title": tracked.get(page_id, page_id), "content": None, "error": str(e)}

    if dry_run:
        output_pages = []
        for page_id in changed_ids:
            info = pages_content[page_id]
            content = info.get("content") or ""
            warnings = detect_tombstone_warnings(content)
            if info.get("error"):
                warnings.append(f"fetch_error: {info['error']}")
            output_pages.append({
                "id": page_id,
                "title": info["title"],
                "content_length": len(content),
                "warnings": warnings,
                "action": "would_sync"
            })
        print(json.dumps({"mode": "dry-run", "pages": output_pages}, indent=2))
        return

    # Live sync — load NLM sources once
    try:
        sources = nlm_list_sources(notebook_id)
        title_to_source_id = {s["title"]: s["id"] for s in sources}
    except RuntimeError as e:
        print(json.dumps({"error": f"Could not list NLM sources: {e}"}))
        sys.exit(1)

    synced, skipped, errors = [], [], []

    for page_id in changed_ids:
        info = pages_content[page_id]
        title = info["title"]
        content = info.get("content")

        if info.get("error"):
            errors.append({"id": page_id, "title": title, "error": info["error"]})
            continue

        if not content:
            skipped.append({"id": page_id, "title": title, "reason": "empty_content"})
            continue

        # Write to a temp path — only commit to snapshot after NLM add succeeds
        snap_path = SNAPSHOTS / f"page-{page_id}.md"
        tmp_path = SNAPSHOTS / f"page-{page_id}.tmp.md"
        tmp_path.write_text(content)

        # Add new source first — if this fails, old source and snapshot are untouched
        try:
            new_source_id = nlm_add_source(notebook_id, tmp_path, title)
        except RuntimeError as e:
            tmp_path.unlink(missing_ok=True)
            errors.append({"id": page_id, "title": title, "error": str(e)})
            continue

        # Add succeeded — delete old source and commit the snapshot
        old_source_id = title_to_source_id.get(title)
        if old_source_id:
            nlm_delete_source(old_source_id)
        tmp_path.rename(snap_path)
        synced.append({
            "id": page_id, "title": title,
            "old_source_id": old_source_id, "new_source_id": new_source_id,
            "content_length": len(content)
        })

    print(json.dumps({
        "mode": "sync",
        "synced": synced,
        "skipped": skipped,
        "errors": errors
    }, indent=2))


if __name__ == "__main__":
    main()
