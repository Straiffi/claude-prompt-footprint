#!/bin/bash
# Run once after cloning to configure paths and wire up the status line.
# After this script completes, run: /plugin install <path-to-this-repo>

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing claude-prompt-footprint from: $DIR"

# Patch hooks/hooks.json with the actual clone path.
# Replaces whatever path currently precedes /scripts/track-usage.sh.
sed -i'' "s|\"command\": \".*scripts/track-usage.sh\"|\"command\": \"$DIR/scripts/track-usage.sh\"|" \
    "$DIR/hooks/hooks.json"
echo "  hooks/hooks.json patched"

# Wire up the status line in ~/.claude/settings.json.
# Merges .statusLine without clobbering other settings.
if [ ! -f ~/.claude/settings.json ]; then
    echo '{}' > ~/.claude/settings.json
fi
jq --arg cmd "$DIR/scripts/statusline.sh" \
    '.statusLine = {"type": "command", "command": $cmd}' \
    ~/.claude/settings.json > /tmp/claude-settings.tmp \
    && mv /tmp/claude-settings.tmp ~/.claude/settings.json
echo "  ~/.claude/settings.json updated"

echo ""
echo "Done. In Claude Code, run:"
echo "  /plugin install $DIR"
