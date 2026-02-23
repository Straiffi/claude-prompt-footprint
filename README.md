# claude-prompt-footprint

Shows the environmental impact of your Claude Code session in the status line at the bottom of the UI.

```
🌱 267g (≈ 1.8km drive) | ⚡ 534Wh | 💧 1.0L
```

Tracks CO₂ emissions, electricity consumption, and water usage for cooling — cumulative across the current session.

## How it works

After each prompt, a [Stop hook](https://docs.anthropic.com/en/docs/claude-code/hooks) reads the session transcript, extracts token counts, and calculates environmental impact using published emission factors:

- **Electricity:** ~10mWh per token (standard models), ~20mWh (Sonnet with extended thinking), ~30mWh (Opus)
- **CO₂:** 0.5 kg per kWh (IEA global grid average)
- **Water:** 1.8L per kWh (datacenter cooling, Google Cloud figures)

> **Note on accuracy:** AI labs do not publish per-token energy figures. All values are estimates derived from third-party research (EcoLogits, academic papers) and should be treated as order-of-magnitude signals, not precise measurements. Actual consumption varies by datacenter, hardware generation, and inference optimisations that are not publicly disclosed.

The results are written to `/tmp/claude-env-tracker-<session>.json` and copied to `/tmp/claude-env-tracker-latest.json`. The status line command reads this file and formats it for display.

### Limitations

- Plan mode responses are not tracked — Claude Code does not fire the Stop hook during plan mode.
- The final response before quitting Claude Code may be missed if the async hook doesn't complete before exit.

## Installation

```bash
git clone <repo-url> ~/claude-prompt-footprint
cd ~/claude-prompt-footprint
bash install.sh
```

Then in Claude Code:

```
/plugin install ~/claude-prompt-footprint
```

`install.sh` does two things:
1. Patches `hooks/hooks.json` with the actual clone path (the hook command must be an absolute path)
2. Adds the `statusLine` command to `~/.claude/settings.json`

After installing the plugin, restart Claude Code. The status line will appear after your first prompt completes.

> **Note:** `hooks/hooks.json` is modified in place by `install.sh`. Don't commit this change — the patched path is machine-specific.

## Project structure

```
scripts/
  track-usage.sh      # Stop hook — reads transcript, calls update-storage.js, writes latest.json
  statusline.sh       # Status line command — reads latest.json, formats output
src/
  update-storage.ts   # Accumulates token counts and computes impact
  format-statusline.ts# Formats the status line string
  calculator.ts       # Emission factor math
  storage.ts          # Read/write session JSON files
  constants.ts        # Emission factors
  model-detector.ts   # Classifies model as reasoning vs non-reasoning
dist/                 # Compiled JS (committed, no build step needed)
hooks/
  hooks.json          # Plugin hook configuration
install.sh            # One-time setup script
```

## Emission factors

| Factor | Value | Source |
|---|---|---|
| Electricity (standard) | 10 mWh/token | EcoLogits — standard inference |
| Electricity (light reasoning) | 20 mWh/token | Estimate for smaller models with extended thinking (e.g. Sonnet 4.6) |
| Electricity (reasoning) | 30 mWh/token | Estimate for large reasoning models (e.g. Opus) |
| Carbon intensity | 0.5 kg CO₂/kWh | IEA Global Energy Review 2024 |
| Water usage | 1.8 L/kWh | Google Cloud sustainability reports |

All figures are estimates. AI providers do not publish per-token energy data.
