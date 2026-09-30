// Runs every test file through .claude/hooks/qa-precheck.sh so CI and pre-commit enforce the same rules as Claude.
// Usage: node scripts/qa-audit.mjs [files...]  (no files = all tests under src)
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx)$/

const listTests = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listTests(full)
    return TEST_FILE.test(entry.name) ? [full] : []
  })

const args = process.argv.slice(2)
const files = (args.length ? args : listTests('src')).filter((f) => TEST_FILE.test(f))

const failures = files.flatMap((file) => {
  const input = JSON.stringify({
    tool_name: 'Write',
    tool_input: { file_path: path.resolve(file), content: readFileSync(file, 'utf8') },
  })
  const result = spawnSync('bash', ['.claude/hooks/qa-precheck.sh'], { input, encoding: 'utf8' })
  return result.status === 0 ? [] : [`${file}: ${(result.stderr || `exit ${result.status}`).trim()}`]
})

if (failures.length) {
  console.log(`QA audit failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(`QA audit passed (${files.length} test file(s)).`)
