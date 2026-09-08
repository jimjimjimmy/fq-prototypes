#!/bin/bash
# Double-click this file (Finder) to open the built FDM Rollup prototype in Chrome.
# Resolves the repo-relative path so it works regardless of where the repo lives.
DIR="$(cd "$(dirname "$0")" && pwd)"
open -a "Google Chrome" "$DIR/../../docs/projects/fdm-rollup/index.html"
