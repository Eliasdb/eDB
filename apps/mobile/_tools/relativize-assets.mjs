// tools/relativize-assets.mjs
import fs from 'fs';
import path from 'path';

/**
 * Rewrite absolute /assets/... to relative ./assets/... in HTML/JS/CSS.
 * - "…src='/assets/...'"  -> "…src='./assets/...'"
 * - url(/assets/...)      -> url(./assets/...)
 */
const exts = new Set(['.html', '.js', '.mjs', '.cjs', '.css']);

function rewrite(s) {
  // HTML/JS string quotes
  s = s.replace(/(["'])\/assets\//g, '$1./assets/');
  // CSS url() with or without quotes
  s = s.replace(/url\(\s*(['"]?)\/assets\//g, 'url($1./assets/');
  return s;
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (exts.has(path.extname(name))) {
      const before = fs.readFileSync(p, 'utf8');
      const after = rewrite(before);
      if (after !== before) fs.writeFileSync(p, after, 'utf8');
    }
  }
}

const root = process.argv[2];
if (!root) {
  console.error('Usage: node tools/relativize-assets.mjs <exportDir>');
  process.exit(1);
}
walk(root);
console.log(`Rewrote asset URLs under ${root}`);
