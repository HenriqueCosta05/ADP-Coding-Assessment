export default {
  '*.{ts,tsx,js,jsx,mjs}': 'node scripts/check-comments.mjs --fix',
  '*.{ts,tsx}': 'eslint --fix',
  'src/**/*.{test,spec}.{ts,tsx}': 'node scripts/qa-audit.mjs',
  'src/**/*.{ts,tsx}': [() => 'tsc -b', 'vitest related --run --passWithNoTests'],
}
