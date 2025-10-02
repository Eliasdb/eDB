// Usage: node patch-index.mjs <indexHtmlPath> <basePath> [apiBase]
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [, , indexPath, basePath = '/assets/clara', apiBase] = process.argv;
if (!indexPath) {
  console.error('patch-index: missing index.html path');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf8');

// --- keep your existing rewrites here ---

// Inject <base> + URL rewrite (keep your current INJECT)…
const BASE_INJECT = `
<script id="clara-base-script">
(function () {
  var BASE = '${basePath}';
  if (location.pathname.startsWith(BASE)) {
    var rest = location.pathname.slice(BASE.length);
    if (!rest || rest === '/index.html') rest = '/';
    if (rest !== location.pathname) {
      history.replaceState(null, '', rest + location.search + location.hash);
    }
  }
  var base = document.createElement('base');
  base.href = BASE.replace(/\\/$/, '') + '/';
  document.head.prepend(base);
})();
</script>`.trim();

if (!html.includes('id="clara-base-script"')) {
  const firstScriptIdx = html.indexOf('<script');
  html =
    firstScriptIdx !== -1
      ? html.slice(0, firstScriptIdx) +
        BASE_INJECT +
        '\n' +
        html.slice(firstScriptIdx)
      : html.replace('</head>', `${BASE_INJECT}\n</head>`);
}

// NEW: inject window.CLARA_API_BASE if provided
if (apiBase && !html.includes('id="clara-api-base"')) {
  const API_INJECT = `<script id="clara-api-base">window.CLARA_API_BASE=${JSON.stringify(apiBase)};</script>`;
  // put it after the base script (or before first script)
  const insertAt =
    html.indexOf('<script', html.indexOf('id="clara-base-script"')) ||
    html.indexOf('<script');
  html =
    insertAt !== -1
      ? html.slice(0, insertAt) + API_INJECT + '\n' + html.slice(insertAt)
      : html.replace('</head>', `${API_INJECT}\n</head>`);
}

writeFileSync(indexPath, html, 'utf8');
console.log(
  `Patched ${path.relative(process.cwd(), indexPath)} (base=${basePath}${apiBase ? `, api=${apiBase}` : ''})`,
);
