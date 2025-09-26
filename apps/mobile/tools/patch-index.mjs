// Usage: node patch-index.mjs <indexHtmlPath> <basePath>
import { readFileSync, writeFileSync } from 'node:fs';

const [, , indexPath, basePath = '/assets/clara'] = process.argv;
if (!indexPath) {
  console.error('patch-index: missing index.html path');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf8');

// 1) Make asset links relative (affects only leading-slash URLs)
html = html
  .replaceAll(' href="/', ' href="./')
  .replaceAll(' src="/', ' src="./');

// 2) Inject <base> + URL rewrite script once (id guards)
const INJECT = `
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
  // Prefer injecting before the first script tag; otherwise before </head>
  const firstScriptIdx = html.indexOf('<script');
  if (firstScriptIdx !== -1) {
    html =
      html.slice(0, firstScriptIdx) +
      INJECT +
      '\n' +
      html.slice(firstScriptIdx);
  } else {
    html = html.replace('</head>', `${INJECT}\n</head>`);
  }
}

writeFileSync(indexPath, html, 'utf8');
console.log(`Patched ${indexPath} for base ${basePath}`);
