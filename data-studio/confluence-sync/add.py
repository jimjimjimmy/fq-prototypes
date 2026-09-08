#!/usr/bin/env python3
"""
add.py — Add new Confluence pages to PRD tracking and NotebookLM.

Usage (from repo root):
  python3 projects/data-studio/confluence-sync/add.py <page_id> [<page_id> ...]

Fetches each page from Confluence, writes a local snapshot, adds it as a
source to the NotebookLM notebook, and updates config.json.

Outputs JSON to stdout:
  {
    "added": [{"id": "...", "title": "...", "nlm_source_id": "...", "content_length": N}],
    "skipped": [{"id": "...", "title": "...", "reason": "empty_page|already_tracked"}],
    "errors": [{"id": "...", "error": "..."}],
    "total_tracked": 115
  }
"""
import json, re, subprocess, sys
from pathlib import Path

BASE = Path(__file__).parent
SNAPSHOTS = BASE / "snapshots"
CONFIG_PATH = BASE / "config.json"

EMPTY_THRESHOLD = 50  # chars — pages shorter than this are tracked but skipped for NLM


def load_config():
    return json.loads(CONFIG_PATH.read_text())


def save_config(config):
    CONFIG_PATH.write_text(json.dumps(config, indent=2) + "\n")


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
        raise RuntimeError(f"TWG page get failed:\n{r.stderr.strip()}")
    # TWG outputs YAML to stdout with paths to the actual JSON files
    for pattern in (r'  stdout: "([^"]+)"', r'  compact: "([^"]+)"'):
        m = re.search(pattern, r.stdout)
        if m:
            return json.loads(Path(m.group(1)).read_text())
    raise RuntimeError("Could not locate page content in TWG output")


def nlm_add_source(notebook_id, file_path, title):
    r = subprocess.run(
        ["nlm", "source", "add", notebook_id, "--file", str(file_path), "--title", title, "--wait"],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        raise RuntimeError(f"nlm source add failed:\n{r.stderr.strip()}\n{r.stdout}")
    for line in r.stdout.splitlines():
        if line.startswith("Source ID:"):
            return line.split(":", 1)[1].strip()
    raise RuntimeError(f"Could not parse source ID from:\n{r.stdout}")


def main():
    page_ids = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not page_ids:
        print("Usage: python3 add.py <page_id> [<page_id> ...]", file=sys.stderr)
        sys.exit(1)

    config = load_config()
    site = config["confluence"]["site"]
    notebook_id = config["notebooks"]["data_studio_prds"]["id"]
    tracked_ids = {p["page_id"] for p in config["notebooks"]["data_studio_prds"]["pages"]}

    added, skipped, errors = [], [], []

    for page_id in page_ids:
        if page_id in tracked_ids:
            skipped.append({"id": page_id, "reason": "already_tracked"})
            continue

        # Fetch from Confluence
        try:
            page_data = twg_fetch_page(page_id, site)
        except RuntimeError as e:
            errors.append({"id": page_id, "error": str(e)})
            continue

        data = page_data.get("data", {})
        title = data.get("title", f"Page {page_id}")
        content = data.get("body", {}).get("markdown", {}).get("value", "")

        # Always write snapshot (baseline for future change detection)
        snap_path = SNAPSHOTS / f"page-{page_id}.md"
        snap_path.write_text(content)

        # Skip NLM for empty pages, but still add to config
        if len(content) < EMPTY_THRESHOLD:
            skipped.append({"id": page_id, "title": title, "reason": "empty_page", "content_length": len(content)})
            config["notebooks"]["data_studio_prds"]["pages"].append({"page_id": page_id, "title": title})
            tracked_ids.add(page_id)
            continue

        # Add to NLM
        try:
            source_id = nlm_add_source(notebook_id, snap_path, title)
        except RuntimeError as e:
            errors.append({"id": page_id, "title": title, "error": str(e)})
            # Still update config and snapshot — can re-add to NLM later
            config["notebooks"]["data_studio_prds"]["pages"].append({"page_id": page_id, "title": title})
            tracked_ids.add(page_id)
            continue

        config["notebooks"]["data_studio_prds"]["pages"].append({"page_id": page_id, "title": title})
        tracked_ids.add(page_id)
        added.append({"id": page_id, "title": title, "nlm_source_id": source_id, "content_length": len(content)})

    save_config(config)

    print(json.dumps({
        "added": added,
        "skipped": skipped,
        "errors": errors,
        "total_tracked": len(config["notebooks"]["data_studio_prds"]["pages"])
    }, indent=2))


if __name__ == "__main__":
    main()
