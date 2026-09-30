/** For a better and more consistent codebase, we enforce a few comment policies, making sure the codebase is not polluted with
 * decorative comments, separators, or comments that restate the code. */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const MAX_LINES = 2
const ROOT = process.cwd()
const EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs)$/
const DEFAULT_TARGETS = ['src', 'scripts', '.claude/hooks', 'vite.config.ts', 'eslint.config.js', 'lint-staged.config.js']
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', 'skills'])
const DIRECTIVE = /^(\/\/\/\s*<reference|\/\/\s*@ts-|\/[/*]\s*(eslint|prettier-ignore|istanbul|c8|v8|vite-ignore|@vite-ignore)|\/\*!)/
const SEPARATOR = /^[\s\-=*#_~/.+]*$/

const args = process.argv.slice(2)
const fix = args.includes('--fix')
const hook = args.includes('--hook')
const fileArgs = args.filter((a) => !a.startsWith('--'))

const toRelative = (file) => {
  const native = process.platform === 'win32' ? file.replace(/^\/([a-zA-Z])\//, '$1:/') : file
  return path.relative(ROOT, path.resolve(ROOT, native)).split(path.sep).join('/')
}

const collectFiles = (target) => {
  if (!existsSync(target)) return []
  const entries = readdirSync(target, { withFileTypes: true, recursive: false })
  return entries.flatMap((entry) => {
    const full = path.join(target, entry.name)
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : collectFiles(full)
    return EXTENSIONS.test(entry.name) ? [full] : []
  })
}

const scriptKind = (file) =>
  file.endsWith('.tsx') ? ts.ScriptKind.TSX : file.endsWith('.jsx') ? ts.ScriptKind.JSX : file.match(/\.[cm]?js$/) ? ts.ScriptKind.JS : ts.ScriptKind.TS

// Uses the real parser so `//` inside strings, templates and JSX text is never mistaken for a comment.
const findComments = (file, text) => {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file))
  const seen = new Map()
  const add = (ranges) => ranges?.forEach((r) => seen.set(r.pos, r))
  const visit = (node) => {
    add(ts.getLeadingCommentRanges(text, node.pos))
    add(ts.getTrailingCommentRanges(text, node.end))
    node.getChildren(source).forEach(visit)
  }
  visit(source)
  return [...seen.values()].sort((a, b) => a.pos - b.pos)
}

const lineOf = (text, pos) => text.slice(0, pos).split('\n').length

// Groups adjacent `//` comments on consecutive lines into one block; `/* */` comments are blocks on their own.
const groupBlocks = (text, comments) => {
  const blocks = []
  for (const c of comments) {
    const raw = text.slice(c.pos, c.end)
    if (DIRECTIVE.test(raw)) continue
    const isLine = c.kind === ts.SyntaxKind.SingleLineCommentTrivia
    const prev = blocks.at(-1)
    const between = prev ? text.slice(prev.end, c.pos) : ''
    if (prev && isLine && prev.isLine && /^\s*\n\s*$/.test(between)) {
      prev.end = c.end
      prev.parts.push(raw)
      continue
    }
    blocks.push({ pos: c.pos, end: c.end, isLine, parts: [raw] })
  }
  return blocks.map((b) => ({
    ...b,
    startLine: lineOf(text, b.pos),
    lines: lineOf(text, b.end) - lineOf(text, b.pos) + 1,
    content: b.parts
      .flatMap((p) => (b.isLine ? [p.replace(/^\/\/\s?/, '')] : p.replace(/^\/\*+|\*\/$/g, '').split('\n')))
      .map((l) => l.replace(/^\s*\*\s?/, '').trim())
      .filter((l) => !SEPARATOR.test(l)),
  }))
}

const rewrite = (block, indent) => {
  const kept = block.content.slice(0, MAX_LINES)
  if (!kept.length) return ''
  if (block.isLine) return kept.map((l) => `// ${l}`).join(`\n${indent}`)
  const opener = block.parts[0].startsWith('/**') ? '/**' : '/*'
  return kept.length === 1 ? `${opener} ${kept[0]} */` : `${opener} ${kept[0]}\n${indent} * ${kept[1]} */`
}

const checkFile = (file) => {
  const text = readFileSync(file, 'utf8')
  const blocks = groupBlocks(text, findComments(file, text))
  const violations = blocks.filter((b) => b.lines > MAX_LINES || !b.content.length)
  if (!violations.length) return []

  if (fix) {
    let output = text
    for (const b of [...violations].reverse()) {
      const lineStart = output.lastIndexOf('\n', b.pos - 1) + 1
      const indent = output.slice(lineStart, b.pos).match(/^\s*/)[0]
      const replacement = rewrite(b, indent)
      const lineEnd = output.indexOf('\n', b.end)
      const ownsLine = output.slice(lineStart, b.pos).trim() === '' && output.slice(b.end, lineEnd === -1 ? undefined : lineEnd).trim() === ''
      output = !replacement && ownsLine
        ? output.slice(0, lineStart) + output.slice(lineEnd === -1 ? output.length : lineEnd + 1)
        : output.slice(0, b.pos) + replacement + output.slice(b.end)
    }
    writeFileSync(file, output)
  }

  return violations.map((b) =>
    b.content.length
      ? `${toRelative(file)}:${b.startLine} comment block is ${b.lines} lines (max ${MAX_LINES})`
      : `${toRelative(file)}:${b.startLine} decorative/empty comment`,
  )
}

const readHookFile = () => {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
    return input.tool_response?.filePath ?? input.tool_input?.file_path
  } catch {
    return undefined
  }
}

const files = hook
  ? [readHookFile()].filter(Boolean).map(toRelative)
  : fileArgs.length
    ? fileArgs.map(toRelative)
    : DEFAULT_TARGETS.flatMap((t) => (EXTENSIONS.test(t) ? [t] : collectFiles(t)))

const problems = files
  .filter((f) => EXTENSIONS.test(f) && existsSync(f) && !f.split('/').some((p) => SKIP_DIRS.has(p)))
  .flatMap(checkFile)

if (hook) {
  // PostToolUse: let Claude rewrite the comments with judgment instead of truncating them mechanically.
  if (problems.length) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          `Comment policy violations:\n- ${problems.join('\n- ')}\n` +
          'Rewrite each to at most 2 lines, and only keep comments that explain a non-obvious why. ' +
          'Delete comments that restate the code, narrate changes, or act as separators.',
      },
    }))
  }
  process.exit(0)
}

if (problems.length) {
  const verb = fix ? 'Trimmed' : 'Found'
  console.log(`${verb} ${problems.length} comment policy violation(s):\n- ${problems.join('\n- ')}`)
  if (!fix) {
    console.log('\nRun `npm run comments:fix` to trim automatically, or rewrite them by hand.')
    process.exit(1)
  }
}
