#!/bin/bash
# Reads cumulative data and formats for status line display

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
STORAGE_FILE="/tmp/claude-env-tracker-${SESSION_ID}.json"

if [ ! -f "$STORAGE_FILE" ]; then
  STORAGE_FILE="/tmp/claude-env-tracker-latest.json"
fi

if [ ! -f "$STORAGE_FILE" ]; then
  echo ""
  exit 0
fi

# Read cumulative totals and format
node "$SCRIPT_DIR/../dist/format-statusline.js" "$STORAGE_FILE"
