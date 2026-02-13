import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const limits = [
  { root: 'src/services', max: 150 },
  { root: 'src/server', max: 150 },
  { root: 'client/src/pages', max: 150 },
  { root: 'client/src/components/ui', max: 100 },
  { root: 'src/utils', max: 100 },
];

const extensions = new Set(['.ts', '.tsx']);
const violations = [];

function countLines(path) {
  const text = readFileSync(path, 'utf8');
  if (text.length === 0) return 0;
  return text.split(/\r?\n/).length;
}

function walk(dir, onFile) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, onFile);
      continue;
    }
    onFile(full);
  }
}

for (const { root, max } of limits) {
  walk(root, (file) => {
    if (!extensions.has(extname(file))) return;
    const lines = countLines(file);
    if (lines > max) {
      violations.push({ file, lines, max });
    }
  });
}

if (violations.length === 0) {
  console.log('Module size check passed');
  process.exit(0);
}

console.error('Module size check failed:\n');
for (const v of violations) {
  console.error(`- ${v.file}: ${v.lines} lines (limit ${v.max})`);
}
process.exit(1);
