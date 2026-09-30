#!/bin/bash
# .claude/hooks/qa-postcheck.sh — PostToolUse: lints the edited test file and reports errors back to Claude.
# Optional machine-specific setup (e.g. loading a Node version manager); see env.local.sh.example. Not committed.
[ -f .claude/hooks/env.local.sh ] && . .claude/hooks/env.local.sh
command -v node >/dev/null 2>&1 || { echo "QA hook skipped: node not on PATH. See .claude/hooks/env.local.sh.example." >&2; exit 1; }
INPUT=$(cat)

FILE_PATH=$(printf '%s' "$INPUT" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path??'')}catch{}})")

# Only lint test files
if [[ "$FILE_PATH" != *test* && "$FILE_PATH" != *spec* ]]; then
  exit 0
fi

# Run ESLint on the changed file
OUTPUT=$(npx --no-install eslint "$FILE_PATH" --quiet 2>&1)
if [ $? -ne 0 ]; then
  echo "WARNING: Lint errors in $FILE_PATH" >&2
  echo "$OUTPUT" >&2
  # In PostToolUse, exit 2 does not undo the edit; it is the only exit code whose stderr reaches Claude.
  exit 2
fi
exit 0
