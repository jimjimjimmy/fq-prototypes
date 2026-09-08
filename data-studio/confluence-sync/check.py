#!/usr/bin/env python3
"""
check.py — Detect Confluence PRD changes since last snapshot.

Usage (from repo root):
  python3 projects/data-studio/confluence-sync/check.py

Outputs JSON to stdout:
  {
    "checked_at": "2026-06-17T...",
    "cql_start_date": "2026-04-21",
    "changed": [{"id": "...", "title": "...", "last_modified": "..."}],
    "untracked": [{"id": "...", "title": "...", "last_modified": "..."}],
    "unchanged_count": 113
  }
"""
import json, re, subprocess, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE = Path(__file__).parent
SNAPSHOTS = BASE / "snapshots"


def load_config():
    return json.loads((BASE / "config.json").read_text())


def oldest_snapshot_date():
    snaps = list(SNAPSHOTS.glob("page-*.md"))
    if not snaps:
        return (datetime.now(timezone.utc) - timedelta(days=90)).strftime("%Y-%m-%d")
    oldest = min(f.stat().st_mtime for f in snaps)
    return datetime.fromtimestamp(oldest, tz=timezone.utc).strftime("%Y-%m-%d")


def twg_search(cql, limit, site):
    r = subprocess.run(
        ["twg", "confluence", "search", "query",
         "--cql", cql, "--limit", str(limit), "--site", site,
         "--output", "json", "--output-summary", "auto", "--agent-fields", "@compact"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"TWG search failed:\n{r.stderr.strip()}")

    # TWG outputs YAML to stdout with paths to the actual JSON files
    for pattern in (r'  compact: "([^"]+)"', r'  stdout: "([^"]+)"'):
        m = re.search(pattern, r.stdout)
        if m:
            data = json.loads(Path(m.group(1)).read_text())
            return data.get("data", data)

    raise RuntimeError(f"Could not locate TWG search results in output:\n{r.stdout[:400]}")


def snapshot_mtime(page_id):
    p = SNAPSHOTS / f"page-{page_id}.md"
    if not p.exists():
        return None
    return datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc)


def main():
    config = load_config()
    site = config["confluence"]["site"]
    tracked_ids = {p["page_id"] for p in config["notebooks"]["data_studio_prds"]["pages"]}
    ignored_ids = {p["page_id"] for p in config.get("ignored_page_ids", [])}

    start_date = oldest_snapshot_date()
    cql = f'space = "Data" AND type = "page" AND lastModified >= "{start_date}"'

    try:
        results = twg_search(cql, 200, site)
    except RuntimeError as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    # Normalize: results may be a list or a dict with a "results" key
    if isinstance(results, dict):
        results = results.get("results", [])

    changed, untracked = [], []
    unchanged_count = 0

    for page in results:
        # Search compact JSON nests id/title under "content"; fall back to top-level for other formats
        content = page.get("content", {}) if isinstance(page.get("content"), dict) else {}
        page_id = str(content.get("id", "") or page.get("id", ""))
        title = content.get("title", "") or page.get("title", "")
        lm_str = page.get("lastModified", "")

        if not page_id:
            continue
        if page_id in ignored_ids:
            continue

        if page_id in tracked_ids:
            mtime = snapshot_mtime(page_id)
            if mtime is None:
                changed.append({"id": page_id, "title": title, "last_modified": lm_str, "reason": "no_snapshot"})
                continue
            if lm_str:
                try:
                    confluence_lm = datetime.fromisoformat(lm_str.replace("Z", "+00:00"))
                    if confluence_lm > mtime:
                        changed.append({
                            "id": page_id, "title": title, "last_modified": lm_str,
                            "snapshot_mtime": mtime.isoformat()
                        })
                    else:
                        unchanged_count += 1
                except ValueError:
                    unchanged_count += 1
            else:
                unchanged_count += 1
        else:
            untracked.append({"id": page_id, "title": title, "last_modified": lm_str})

    print(json.dumps({
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "cql_start_date": start_date,
        "changed": changed,
        "untracked": untracked,
        "unchanged_count": unchanged_count
    }, indent=2))


if __name__ == "__main__":
    main()
