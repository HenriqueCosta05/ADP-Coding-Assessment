#!/bin/bash
# .claude/hooks/qa-precheck.sh — PreToolUse gate: blocks Vitest anti-patterns before a test file is written.
# Optional machine-specific setup (e.g. loading a Node version manager); see env.local.sh.example. Not committed.
[ -f .claude/hooks/env.local.sh ] && . .claude/hooks/env.local.sh
command -v node >/dev/null 2>&1 || { echo "QA hook skipped: node not on PATH. See .claude/hooks/env.local.sh.example." >&2; exit 1; }
INPUT=$(cat)

field() { printf '%s' "$INPUT" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const v=JSON.parse(s).tool_input?.[process.argv[1]];process.stdout.write(v??'')}catch{}})" "$1"; }

FILE_PATH=$(field file_path)
CONTENT=$(field content)
[ -z "$CONTENT" ] && CONTENT=$(field new_string)

# Only check test files
if [[ "$FILE_PATH" != *test* && "$FILE_PATH" != *spec* ]]; then
  exit 0
fi

# Block hardcoded credentials
if echo "$CONTENT" | grep -qiE "(password|secret|token)\s*[:=]\s*[\"'][^\$]"; then
  echo "BLOCKED: Hardcoded credentials detected in test file. Use fixtures or environment variables (import.meta.env / vi.stubEnv)." >&2
  exit 2
fi

# Block raw CSS/DOM selectors in Testing Library tests
if echo "$CONTENT" | grep -qE "(container|document|baseElement)\.querySelector(All)?\(|getElement(s?By(ClassName|TagName)|ById)\(" ; then
  echo "BLOCKED: Raw CSS selector detected. Use role-based queries: screen.getByRole(), screen.getByText(), screen.getByLabelText(), screen.getByTestId()." >&2
  exit 2
fi

# Block hardcoded waits
if echo "$CONTENT" | grep -qE "waitForTimeout|sleep\(|setTimeout" ; then
  echo "BLOCKED: Hardcoded wait detected. Use findBy* queries, waitFor(), or vi.useFakeTimers() + vi.advanceTimersByTime()." >&2
  exit 2
fi

# Block focused tests, which silently disable the rest of the suite
if echo "$CONTENT" | grep -qE "\b(it|test|describe)\.only\(" ; then
  echo "BLOCKED: Focused test (.only) detected. Remove .only so the whole suite runs." >&2
  exit 2
fi

# Block tests without assertions (full writes only; a partial Edit may not contain the expect)
if [ -n "$(field content)" ] && echo "$CONTENT" | grep -qE "test\(|it\(" && ! echo "$CONTENT" | grep -qE "expect\(|assert" ; then
  echo "BLOCKED: Test has no assertions. Every test must verify expected behavior." >&2
  exit 2
fi

exit 0
