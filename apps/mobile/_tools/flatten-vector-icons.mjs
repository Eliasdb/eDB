// tools/flatten-vector-icons.mjs
import fs from 'fs';
import path from 'path';

const [, , exportDirArg, destArg] = process.argv;
if (!exportDirArg) {
  console.error('Usage: node flatten-vector-icons.mjs <exportDir> [destDir]');
  process.exit(1);
}

const exportDir = path.resolve(exportDirArg);
const destDir = path.resolve(destArg || path.join(exportDir, 'fonts'));

// ensure dest exists (no double 'fonts/fonts' if caller passed one)
fs.mkdirSync(destDir, { recursive: true });

// collect all .ttf in vector-icons vendor
const ttfMatches = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      // Only descend into vendor dirs or the export dir for speed
      if (p.includes('react-native-vector-icons') || p.startsWith(exportDir)) {
        walk(p);
      }
    } else if (
      name.toLowerCase().endsWith('.ttf') &&
      p.includes('react-native-vector-icons/Fonts')
    ) {
      ttfMatches.push(p);
    }
  }
}
walk(exportDir);

// copy TTFs flat to dest
for (const src of ttfMatches) {
  const base = path
    .basename(src)
    .replace(/^[A-Za-z]+\.?/, (m) => m.split('.')[0] + '.'); // keep existing names
  const out = path.join(destDir, base);
  try {
    fs.copyFileSync(src, out);
  } catch (err) {
    console.warn(`Skipping copy for ${src}:`, err);
  }
}

// rewrite any references to the long pnpm/vendor paths to ./fonts/<basename>.ttf
const exts = new Set(['.html', '.js', '.mjs', '.cjs', '.css']);
function rewrite(s) {
  return s.replace(
    /(["'(])[^"'()]*react-native-vector-icons\/Fonts\/([A-Za-z0-9._-]+\.ttf)/g,
    (_m, q, file) => `${q}./fonts/${file}`,
  );
}
function walkRewrite(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkRewrite(p);
    else if (exts.has(path.extname(name))) {
      const before = fs.readFileSync(p, 'utf8');
      const after = rewrite(before);
      if (after !== before) fs.writeFileSync(p, after, 'utf8');
    }
  }
}
walkRewrite(exportDir);

console.log(
  `Flattened ${ttfMatches.length} vector-icon fonts to ${path.relative(process.cwd(), destDir)}`,
);
