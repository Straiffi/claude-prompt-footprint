#!/bin/bash
# Reads Stop hook event JSON from stdin
# Extracts token usage from transcript and updates cumulative storage

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path')

# Get model from Stop hook (may not have usage data)
MODEL=$(echo "$INPUT" | jq -r '.model // "unknown"')

# Extract token usage from the last line of the transcript
# The transcript is a JSONL file where each line is a JSON object
if [ -f "$TRANSCRIPT_PATH" ] && [ -s "$TRANSCRIPT_PATH" ]; then
    # Find the last assistant entry with usage data
    LAST_ENTRY=$(grep '"role":"assistant"' "$TRANSCRIPT_PATH" | tail -n 1)
    # Usage is at .message.usage; sum non-cached + cache_creation tokens + 10% of cache reads
    # (cache reads consume real compute at ~10% of full recomputation cost)
    INPUT_TOKENS=$(echo "$LAST_ENTRY" | jq -r '
      (.message.usage.input_tokens // 0) +
      (.message.usage.cache_creation_input_tokens // 0) +
      ((.message.usage.cache_read_input_tokens // 0) * 0.1)
      | round')
    OUTPUT_TOKENS=$(echo "$LAST_ENTRY" | jq -r '.message.usage.output_tokens // 0')

    # If model is unknown in hook, try to get it from transcript
    if [ "$MODEL" = "unknown" ]; then
        MODEL=$(echo "$LAST_ENTRY" | jq -r '.message.model // "unknown"')
    fi
else
    # Fallback to hook data if transcript unavailable
    INPUT_TOKENS=0
    OUTPUT_TOKENS=0
fi

STORAGE_FILE="/tmp/claude-env-tracker-${SESSION_ID##*-}.json"

# Call TypeScript calculator to compute impact
# Append to cumulative totals in temp file
node "$SCRIPT_DIR/../dist/update-storage.js" "$STORAGE_FILE" "$MODEL" "$INPUT_TOKENS" "$OUTPUT_TOKENS"

cp "$STORAGE_FILE" /tmp/claude-env-tracker-latest.json

exit 0
