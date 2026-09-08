#!/bin/bash
# Start both dev servers for the agents-playbooks + COSO AI RCM cross-prototype integration.
# Run from anywhere — the script resolves its own location.
#
# Usage:
#   bash projects/agents-playbooks/start.sh
#   npm run dev:all   (from projects/agents-playbooks/prototype/)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
AGENTS_PROTOTYPE="$REPO_ROOT/projects/agents-playbooks/prototype"
RCM_WORKTREE="$HOME/tmp/coso-ai-rcm"

# ── 1. coso-ai-rcm worktree ──────────────────────────────────────────────────
# If project/coso-ai-rcm already has a worktree somewhere, use that path.
# Otherwise create one at ~/tmp/coso-ai-rcm.
# Find an existing healthy worktree for project/coso-ai-rcm (has a .git file)
EXISTING_RCM=$(git -C "$REPO_ROOT" worktree list --porcelain 2>/dev/null \
  | awk '/^worktree /{wt=$2} /^branch refs\/heads\/project\/coso-ai-rcm$/{print wt}')
if [ -n "$EXISTING_RCM" ] && [ -f "$EXISTING_RCM/.git" ]; then
  RCM_WORKTREE="$EXISTING_RCM"
elif [ ! -d "$RCM_WORKTREE" ] || [ ! -f "$RCM_WORKTREE/.git" ]; then
  # Prune any stale worktree entries and recreate
  git -C "$REPO_ROOT" worktree prune 2>/dev/null || true
  rm -rf "$RCM_WORKTREE"
  echo "Setting up coso-ai-rcm worktree (first run)..."
  git -C "$REPO_ROOT" worktree add "$RCM_WORKTREE" project/coso-ai-rcm
  echo "Done."
fi
RCM_PROTOTYPE="$RCM_WORKTREE/projects/coso-ai-rcm/prototype"

# ── 2. Install dependencies ──────────────────────────────────────────────────
if [ ! -d "$AGENTS_PROTOTYPE/node_modules" ]; then
  echo "Installing agents-playbooks dependencies..."
  npm install --prefix "$AGENTS_PROTOTYPE"
fi

if [ ! -d "$RCM_PROTOTYPE/node_modules" ]; then
  echo "Installing coso-ai-rcm dependencies..."
  npm install --prefix "$RCM_PROTOTYPE"
fi

# ── 3. Start both servers ────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "Stopping dev servers..."
  kill %1 %2 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

echo ""
echo "Starting dev servers..."
echo ""

npm run dev --prefix "$AGENTS_PROTOTYPE" -- --port 5180 &
npm run dev --prefix "$RCM_PROTOTYPE" -- --port 5179 &

echo "  agents-playbooks  →  http://localhost:5180"
echo "  coso-ai-rcm       →  http://localhost:5179"
echo ""
echo "  Press Ctrl+C to stop both"
echo ""

wait
