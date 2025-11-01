import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import * as path from 'node:path';
import { applyReplacementsToFiles } from '../_workbench-api-feature/utils';

type Schema = {
  name: string; // plural-ish, e.g. "painters"
  revert?: boolean;
};

function singularize(s: string) {
  return s.endsWith('s') ? s.slice(0, -1) : s;
}

function removeLines(src: string, regex: RegExp): string {
  return src.replace(regex, '');
}

/** Remove ALL callsites of register<Cap>Routes(...) robustly (no regex):
 * - handles optional "await"
 * - handles any whitespace / multiline
 * - handles 2 or 3 args (with/without adapters)
 * - removes stray calls even outside registerAll()
 */
function stripRegisterCalls(src: string, Cap: string): string {
  const token = `register${Cap}Routes(`;
  let out = src;
  // Keep scanning until none remain
  for (;;) {
    const iTok = out.indexOf(token);
    if (iTok === -1) break;

    // extend start left to the beginning of the line, including optional "await" + indentation
    let start = iTok;
    let j = iTok - 1;
    while (j >= 0 && (out[j] === ' ' || out[j] === '\t')) j--;
    const maybeAwaitEnd = j + 1;
    const maybeAwaitStart = maybeAwaitEnd - 5; // 'await'
    const isAwait =
      maybeAwaitStart >= 0 &&
      out.slice(maybeAwaitStart, maybeAwaitEnd) === 'await';
    if (isAwait) start = maybeAwaitStart;
    else start = j + 1;

    const lastNL = out.lastIndexOf('\n', start - 1);
    const lineStart = lastNL === -1 ? 0 : lastNL + 1;
    start = lineStart;

    // find matching ')' from '(' after token
    const openParen = iTok + token.length - 1;
    let depth = 0;
    let k = openParen;
    let inStr: '"' | "'" | '`' | null = null;
    let esc = false;

    while (k < out.length) {
      const ch = out[k];

      if (inStr) {
        if (!esc && ch === inStr) inStr = null;
        esc = !esc && ch === '\\';
        k++;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch as '"' | "'" | '`';
        esc = false;
        k++;
        continue;
      }

      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          k++;
          break;
        }
      }
      k++;
    }

    // move forward to next semicolon (tolerate missing ;)
    while (k < out.length && out[k] !== ';') k++;
    if (k < out.length && out[k] === ';') k++;

    // consume trailing spaces + one newline if present
    while (k < out.length && (out[k] === ' ' || out[k] === '\t')) k++;
    if (k < out.length && out[k] === '\n') k++;

    out = out.slice(0, start) + out.slice(k);
  }

  // collapse 3+ newlines
  out = out.replace(/\n{3,}/g, '\n\n');
  return out;
}

/** Insert "await register<Cap>Routes(app, new <Cap>Service(adapters.<singular>));"
 *  Strategy:
 *    1) Prefer inserting right after the "@gen:calls" anchor if present.
 *    2) Else parse the body of async registerAll(...) { ... } and insert
 *       before its closing brace.
 *  Idempotent: does nothing if the call already exists.
 */
function insertRegisterCall(
  reg: string,
  Cap: string,
  singular: string,
): string {
  const callLine = `      await register${Cap}Routes(app, new ${Cap}Service(adapters.${singular}));`;

  if (reg.includes(callLine)) return reg; // already present

  // 1) Anchor path
  const anchorNeedle = '@gen:calls';
  const idx = reg.indexOf(anchorNeedle);
  if (idx !== -1) {
    // insert on the next line after the anchor line end
    const nl = reg.indexOf('\n', idx);
    const insertAt = nl === -1 ? reg.length : nl + 1;
    return reg.slice(0, insertAt) + callLine + '\n' + reg.slice(insertAt);
  }

  // 2) Fallback: parse async registerAll(...) { ... }
  const sig =
    /async\s+registerAll\s*$begin:math:text$\\s*app\\s*:\\s*FastifyInstance\\s*$end:math:text$\s*\{\s*/m;
  const m = sig.exec(reg);
  if (!m) {
    // last resort: append near end (shouldn't happen in your file)
    return reg.endsWith('\n')
      ? reg + callLine + '\n'
      : reg + '\n' + callLine + '\n';
  }

  // find the method's closing brace by tracking depth (ignore strings)
  let k = m.index + m[0].length;
  let depth = 1;
  let inStr: '"' | "'" | '`' | null = null;
  let esc = false;

  while (k < reg.length && depth > 0) {
    const ch = reg[k];
    if (inStr) {
      if (!esc && ch === inStr) inStr = null;
      esc = !esc && ch === '\\';
      k++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch as '"' | "'" | '`';
      esc = false;
      k++;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    k++;
  }

  const methodEnd = k - 1; // position of closing '}'
  const body = reg.slice(m.index, methodEnd);
  if (body.includes(callLine)) return reg; // extra safety

  const injected =
    reg.slice(0, methodEnd) + '\n' + callLine + '\n' + reg.slice(methodEnd);
  return injected;
}

export default async function workbenchApiResourceGenerator(
  tree: Tree,
  schema: Schema,
) {
  if (!schema.name?.trim()) throw new Error('--name is required');

  const raw = schema.name.trim();
  const n = names(raw); // fileName: "painters"
  const plural = n.fileName; // painters
  const singular = singularize(plural); // painter
  const Cap = names(singular).className; // Painter
  const routeBase = plural; // /painters

  const outDir = joinPathFragments(
    'libs/server/workbench-api/resources/src/lib',
    plural,
  );

  const ctrlPath = joinPathFragments(outDir, `${singular}.controller.ts`);
  const svcPath = joinPathFragments(outDir, `${singular}.service.ts`);
  const barrelPath = joinPathFragments(outDir, `index.ts`);

  const registerPath =
    'libs/server/workbench-api/resources/src/lib/register.ts';

  if (!tree.exists(registerPath)) {
    throw new Error(`Missing registry file: ${registerPath}`);
  }

  // ─────────────────────────────────────────────
  // REVERT mode
  // ─────────────────────────────────────────────
  if (schema.revert) {
    let reg = tree.read(registerPath, 'utf-8') ?? '';

    // Remove `import type { CapRepo } from '@edb-workbench/api/models';`
    reg = removeLines(
      reg,
      new RegExp(
        String.raw`^\s*import\s+type\s+\{\s*${Cap}Repo\s*\}\s+from\s+'@edb-workbench/api/models';\s*\n?`,
        'm',
      ),
    );

    // Remove property from RepoAdapters interface: "<singular>: CapRepo;"
    reg = reg.replace(
      new RegExp(
        String.raw`(export\s+interface\s+RepoAdapters\s*\{[\s\S]*?)\n\s*${singular}\s*:\s*${Cap}Repo\s*;\s*`,
        'm',
      ),
      (_m, head) => head + '\n',
    );

    // Remove controller/service imports
    reg = removeLines(
      reg,
      new RegExp(
        String.raw`^\s*import\s+\{\s*register${Cap}Routes\s*\}\s+from\s+'\.\/${plural}\/${singular}\.controller';\s*\n?`,
        'm',
      ),
    );
    reg = removeLines(
      reg,
      new RegExp(
        String.raw`^\s*import\s+\{\s*${Cap}Service\s*\}\s+from\s+'\.\/${plural}\/${singular}\.service';\s*\n?`,
        'm',
      ),
    );

    // Remove ALL callsites (robust)
    reg = stripRegisterCalls(reg, Cap);

    // Tidy
    reg = reg.replace(/\n{3,}/g, '\n\n');
    tree.write(registerPath, reg);

    // Remove generated files
    if (tree.exists(ctrlPath)) tree.delete(ctrlPath);
    if (tree.exists(svcPath)) tree.delete(svcPath);
    if (tree.exists(barrelPath)) tree.delete(barrelPath);

    await formatFiles(tree);
    console.log(`[workbench-api-resource] Reverted -> ${plural}`);
    return;
  }

  // ─────────────────────────────────────────────
  // CREATE mode
  // ─────────────────────────────────────────────

  // 1) copy templates
  const templateDir = path.join(__dirname, 'files');
  generateFiles(tree, templateDir, outDir, {
    tmpl: '',
    plural,
    singular,
    Cap,
    routeBase,
  });

  // 2) placeholder replacement
  const replacements: Record<string, string> = {
    __plural__: plural,
    __singular__: singular,
    __namePlural__: plural,
    __nameSingular__: singular,
    __Cap__: Cap,
    __NameSingular__: Cap,
    __routeBase__: routeBase,
  };
  applyReplacementsToFiles(tree, [ctrlPath, svcPath, barrelPath], replacements);

  // 3) ensure RepoAdapters is an interface and augment with "<singular>: <Cap>Repo"
  let reg = tree.read(registerPath, 'utf-8') ?? '';

  if (/export\s+type\s+RepoAdapters\s*=\s*\{/.test(reg)) {
    reg = reg.replace(
      /export\s+type\s+RepoAdapters\s*=\s*\{/,
      'export interface RepoAdapters {',
    );
  }

  const repoImport = `import type { ${Cap}Repo } from '@edb-workbench/api/models';`;
  if (!reg.includes(repoImport)) {
    const lines = reg.split('\n');
    let insertAt = 0;
    const idx = lines.findIndex((l) =>
      l.includes(`from '@edb-workbench/api/models'`),
    );
    insertAt = idx >= 0 ? idx + 1 : 0;
    lines.splice(insertAt, 0, repoImport);
    reg = lines.join('\n');
  }

  if (!new RegExp(`\\b${singular}\\s*:\\s*${Cap}Repo\\s*;`).test(reg)) {
    reg = reg.replace(
      /export\s+interface\s+RepoAdapters\s*\{([\s\S]*?)\}/m,
      (m, body) =>
        `export interface RepoAdapters {\n${body.trimEnd()}\n  ${singular}: ${Cap}Repo;\n}`,
    );
  }

  const ctrlImport = `import { register${Cap}Routes } from './${plural}/${singular}.controller';`;
  const svcImport = `import { ${Cap}Service } from './${plural}/${singular}.service';`;

  if (!reg.includes(ctrlImport)) {
    const lines = reg.split('\n');
    let lastLocalImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') && lines[i].includes('./'))
        lastLocalImport = i;
    }
    lines.splice(lastLocalImport + 1, 0, ctrlImport);
    reg = lines.join('\n');
  }
  if (!reg.includes(svcImport)) {
    const lines = reg.split('\n');
    let lastLocalImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') && lines[i].includes('./'))
        lastLocalImport = i;
    }
    lines.splice(lastLocalImport + 1, 0, svcImport);
    reg = lines.join('\n');
  }

  // 4) insert call (anchor-first, parser fallback), idempotent
  reg = insertRegisterCall(reg, Cap, singular);

  tree.write(registerPath, reg);

  await formatFiles(tree);
  console.log(`[workbench-api-resource] OK -> ${plural}`);
}
