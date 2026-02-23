#!/bin/bash
# Run once after cloning to wire up the plugin, hooks, and status line.

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOW="$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"
PLUGINS_DIR="$HOME/.claude/plugins"

echo "Installing claude-prompt-footprint from: $DIR"

# Patch hooks/hooks.json with the actual clone path.
# Replaces whatever path currently precedes /scripts/track-usage.sh.
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|\"command\": \".*scripts/track-usage.sh\"|\"command\": \"$DIR/scripts/track-usage.sh\"|" \
        "$DIR/hooks/hooks.json"
else
    sed -i "s|\"command\": \".*scripts/track-usage.sh\"|\"command\": \"$DIR/scripts/track-usage.sh\"|" \
        "$DIR/hooks/hooks.json"
fi
echo "  hooks/hooks.json patched"

# Register the local marketplace so Claude Code can resolve the plugin.
mkdir -p "$PLUGINS_DIR"
if [ ! -f "$PLUGINS_DIR/known_marketplaces.json" ]; then
    echo '{}' > "$PLUGINS_DIR/known_marketplaces.json"
fi
jq --arg dir "$DIR" --arg now "$NOW" \
    '."local-environmental-tracker" = {
        "source": {"source": "directory", "path": $dir},
        "installLocation": $dir,
        "lastUpdated": $now
    }' \
    "$PLUGINS_DIR/known_marketplaces.json" > /tmp/known_marketplaces.tmp \
    && mv /tmp/known_marketplaces.tmp "$PLUGINS_DIR/known_marketplaces.json"
echo "  known_marketplaces.json updated"

# Register the installed plugin.
if [ ! -f "$PLUGINS_DIR/installed_plugins.json" ]; then
    echo '{"version": 2, "plugins": {}}' > "$PLUGINS_DIR/installed_plugins.json"
fi
jq --arg dir "$DIR" --arg now "$NOW" \
    '.version = 2
     | .plugins["environmental-tracker@local-environmental-tracker"] = [{
         "scope": "user",
         "installPath": $dir,
         "version": "1.0.0",
         "installedAt": $now,
         "lastUpdated": $now
     }]' \
    "$PLUGINS_DIR/installed_plugins.json" > /tmp/installed_plugins.tmp \
    && mv /tmp/installed_plugins.tmp "$PLUGINS_DIR/installed_plugins.json"
echo "  installed_plugins.json updated"

# Wire up the status line and enable the plugin in ~/.claude/settings.json.
if [ ! -f ~/.claude/settings.json ]; then
    echo '{}' > ~/.claude/settings.json
fi
jq --arg cmd "$DIR/scripts/statusline.sh" \
    '.statusLine = {"type": "command", "command": $cmd}
     | .enabledPlugins["environmental-tracker@local-environmental-tracker"] = true' \
    ~/.claude/settings.json > /tmp/claude-settings.tmp \
    && mv /tmp/claude-settings.tmp ~/.claude/settings.json
echo "  ~/.claude/settings.json updated"

echo ""
echo "Done. Restart Claude Code for changes to take effect."
