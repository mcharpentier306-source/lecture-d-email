#!/usr/bin/env bash
# Repo-local skill sync — the entry point the SessionStart hook calls.
#
# Two stages:
#   1. Delegate to shared/scripts/sync-skill.sh, which is propagated from
#      gen-ai-core and does the actual copying of skills/ and shared/skills/
#      into .claude/skills/ and .cursor/skills/.
#   2. Enforce .skills-disabled afterwards, removing any disabled skill that
#      stage 1 registered.
#
# Stage 2 is the point of this file. shared/ is overwritten by upstream
# propagation, so the copy of this logic living there cannot be relied on —
# a propagation would silently bring disabled skills back. This script is
# repo-local and never propagated, so enforcement survives regardless of
# which version of the shared script is in place.
#
# Sources under skills/ and shared/skills/ are never touched by either stage.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_FILE="$ROOT/.skills-disabled"

bash "$ROOT/shared/scripts/sync-skill.sh" "$@"

[[ -f "$DISABLED_FILE" ]] || exit 0

while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%%#*}"                            # strip trailing comment
  line="${line#"${line%%[![:space:]]*}"}"       # ltrim
  line="${line%"${line##*[![:space:]]}"}"       # rtrim
  [[ -z "$line" ]] && continue
  # Guard against a stray path separator turning this into a wider rm.
  if [[ "$line" == */* || "$line" == "." || "$line" == ".." ]]; then
    echo "Ignored invalid entry in .skills-disabled: $line" >&2
    continue
  fi
  removed=0
  for dest in "$ROOT/.claude/skills/$line" "$ROOT/.cursor/skills/$line"; do
    if [[ -d "$dest" ]]; then
      rm -rf "$dest"
      removed=1
    fi
  done
  # `if` rather than `(( removed )) && echo`: the latter returns 1 when nothing
  # was removed, which becomes the script's exit status and fails the hook.
  if (( removed )); then
    echo "Unregistered $line skill (listed in .skills-disabled)"
  fi
done < "$DISABLED_FILE"
