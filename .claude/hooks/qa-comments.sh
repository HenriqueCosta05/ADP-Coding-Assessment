#!/bin/bash
# .claude/hooks/qa-comments.sh — PostToolUse: asks Claude to condense comment blocks longer than 2 lines.
# Optional machine-specific setup (e.g. loading a Node version manager); see env.local.sh.example. Not committed.
[ -f .claude/hooks/env.local.sh ] && . .claude/hooks/env.local.sh
command -v node >/dev/null 2>&1 || { echo "QA hook skipped: node not on PATH. See .claude/hooks/env.local.sh.example." >&2; exit 1; }
exec node scripts/check-comments.mjs --hook
