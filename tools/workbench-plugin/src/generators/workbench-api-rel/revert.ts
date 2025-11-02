import { formatFiles, names, Tree } from '@nx/devkit';
import {
  ContractJSON,
  findPgTableBlock,
  read,
  Schema,
  singularize,
  snake,
  splitTopLevelProps,
  writeIfChanged,
} from './utils';

function reEscape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ───────────── helpers ───────────── */
function splitTopLevelArgs(str: string): string[] {
  const out: string[] = [];
  let buf = '',
    dp = 0,
    db = 0,
    dc = 0,
    sc: string | null = null,
    esc = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (sc) {
      if (ch === '\\' && !esc) {
        esc = true;
        buf += ch;
        continue;
      }
      if (ch === sc && !esc) {
        sc = null;
        buf += ch;
        continue;
      }
      esc = false;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      sc = ch;
      buf += ch;
      continue;
    }
    if (ch === '(') dp++;
    else if (ch === ')') dp--;
    else if (ch === '[') db++;
    else if (ch === ']') db--;
    else if (ch === '{') dc++;
    else if (ch === '}') dc--;
    if (ch === ',' && dp === 0 && db === 0 && dc === 0) {
      out.push(buf.trim());
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function findMatchingParen(src: string, openIdx: number): number {
  let i = openIdx + 1,
    depth = 1;
  let sc: string | null = null,
    esc = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (sc) {
      if (ch === '\\' && !esc) {
        esc = true;
        continue;
      }
      if (ch === sc && !esc) {
        sc = null;
        continue;
      }
      esc = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      sc = ch;
      continue;
    }
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0) return i;
  }
  return -1;
}

function findMatchingBrace(src: string, openIdx: number): number {
  let i = openIdx + 1,
    depth = 1;
  let sc: string | null = null,
    esc = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (sc) {
      if (ch === '\\' && !esc) {
        esc = true;
        continue;
      }
      if (ch === sc && !esc) {
        sc = null;
        continue;
      }
      esc = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      sc = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (depth === 0) return i;
  }
  return -1;
}

/** Remove a named property from a JS object literal body (string between the braces). */
function removePropFromObjectBody(
  body: string,
  propName: string,
): { next: string; changed: boolean } {
  const parts: string[] = [];
  let buf = '';
  let dp = 0,
    db = 0,
    dc = 0;
  let sc: string | null = null,
    esc = false;

  const flush = () => {
    if (buf.trim().length) parts.push(buf);
    buf = '';
  };

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (sc) {
      buf += ch;
      if (ch === '\\' && !esc) {
        esc = true;
        continue;
      }
      if (ch === sc && !esc) {
        sc = null;
        continue;
      }
      esc = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      sc = ch;
      buf += ch;
      continue;
    }
    if (ch === '(') dp++;
    else if (ch === ')') dp--;
    else if (ch === '[') db++;
    else if (ch === ']') db--;
    else if (ch === '{') dc++;
    else if (ch === '}') dc--;
    if (ch === ',' && dp === 0 && db === 0 && dc === 0) {
      flush();
      continue;
    }
    buf += ch;
  }
  flush();

  const keep: string[] = [];
  let changed = false;
  const nameRe = new RegExp(
    String.raw`^\s*(?:` +
      reEscape(propName) +
      String.raw`|['"]` +
      reEscape(propName) +
      String.raw`['"])\s*:`,
  );

  for (const part of parts) {
    if (nameRe.test(part)) {
      changed = true;
      continue; // drop this prop
    }
    keep.push(part);
  }

  let next = keep.join(',').replace(/,\s*,/g, ',').trim();
  if (next.startsWith(',')) next = next.slice(1);
  if (next.endsWith(',')) next = next.slice(0, -1);
  if (next.length && !/^\s*\n/.test(next)) next = '\n' + next + '\n';
  return { next, changed };
}

/** Removes `propName` from `export const <exportName> = z.object({ ... })` */
function removePropFromZodExport(
  src: string,
  exportName: string,
  propName: string,
): { next: string; changed: boolean } {
  let changed = false;
  const needle = new RegExp(
    String.raw`export\s+const\s+` +
      reEscape(exportName) +
      String.raw`\s*=\s*z\.object\s*\(`,
  );
  const m = src.match(needle);
  if (!m || m.index === undefined) return { next: src, changed };

  const start = m.index + m[0].length; // after 'z.object('
  const openBrace = src.indexOf('{', start);
  if (openBrace < 0) return { next: src, changed };
  const closeBrace = findMatchingBrace(src, openBrace);
  if (closeBrace < 0) return { next: src, changed };

  const before = src.slice(0, openBrace + 1);
  const body = src.slice(openBrace + 1, closeBrace);
  const after = src.slice(closeBrace);

  const { next: bodyNext, changed: bodyChanged } = removePropFromObjectBody(
    body,
    propName,
  );
  if (!bodyChanged) return { next: src, changed };

  changed = true;
  let next = before + bodyNext + after;
  next = next
    .replace(/\{\s*,/g, '{')
    .replace(/,\s*\}/g, '}')
    .replace(/\n{3,}/g, '\n\n');
  return { next, changed };
}

/* ───────────── Contract ───────────── */
function revertFkInContract(
  tree: Tree,
  childSingular: string,
  parentPlural: string,
  fk: string,
  includeAlias: string,
): boolean {
  const contractPath = `libs/server/workbench-api/models/src/contracts/${childSingular}.contract.json`;
  if (!tree.exists(contractPath)) return false;
  const json = JSON.parse(read(tree, contractPath)) as ContractJSON;
  let changed = false;

  if (json.relationships?.belongsTo?.length) {
    const before = JSON.stringify(json.relationships.belongsTo);
    json.relationships.belongsTo = json.relationships.belongsTo.filter(
      (r) => !(r.fk === fk && r.to === parentPlural) && r.name !== includeAlias,
    );
    if (JSON.stringify(json.relationships.belongsTo) !== before) changed = true;
  }

  const beforeLen = json.fields.length;
  json.fields = json.fields.filter((f) => f.fieldName !== fk);
  if (json.fields.length !== beforeLen) changed = true;

  if (json.fieldsString) {
    const parts = json.fieldsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = parts
      .filter(
        (frag) => !frag.startsWith(`${fk}:`) && !frag.startsWith(`${fk}?`),
      )
      .join(',');
    if (next !== json.fieldsString) {
      json.fieldsString = next;
      changed = true;
    }
  }

  return (
    writeIfChanged(tree, contractPath, JSON.stringify(json, null, 2)) || changed
  );
}

/* ───────────── Model (ZOD) ───────────── */
function revertModelZod(
  tree: Tree,
  childSingular: string,
  CapChild: string,
  fk: string,
): boolean {
  const modelPath = `libs/server/workbench-api/models/src/lib/${childSingular}.model.ts`;
  if (!tree.exists(modelPath)) return false;
  let src = read(tree, modelPath);
  let changed = false;

  const entityExport = `${childSingular}Schema`;
  const createExport = `create${CapChild}BodySchema`;
  const updateExport = `update${CapChild}BodySchema`;

  const a = removePropFromZodExport(src, entityExport, fk);
  src = a.next;
  changed = changed || a.changed;

  const b = removePropFromZodExport(src, createExport, fk);
  src = b.next;
  changed = changed || b.changed;

  const c = removePropFromZodExport(src, updateExport, fk);
  src = c.next;
  changed = changed || c.changed;

  if (!changed) return false;

  src = src
    .replace(/,\s*\}/g, '}')
    .replace(/\{\s*,/g, '{')
    .replace(/\n{3,}/g, '\n\n');

  return writeIfChanged(tree, modelPath, src) || changed;
}

/* ───────────── Drizzle schema ─────────────
   (create added field in libs/.../db/schemas/<child>.ts and may add
   `import { <parent>Table } from './<parent>';`) */
function revertDrizzleSchema(
  tree: Tree,
  childPlural: string,
  parentPlural: string,
  fk: string,
): boolean {
  const schemaPath = `libs/server/workbench-api/infra/src/lib/db/schemas/${childPlural}.ts`;
  if (!tree.exists(schemaPath)) return false;

  let src = read(tree, schemaPath);

  const tb = findPgTableBlock(src, childPlural);
  if (!tb) return false;

  const fkSnake = snake(fk);
  const props = splitTopLevelProps(tb.block);
  const idxFk = props.findIndex((p) => p.name === fkSnake);
  let blockNext = tb.block;
  let changed = false;

  if (idxFk >= 0) {
    blockNext =
      tb.block.slice(0, props[idxFk].start) + tb.block.slice(props[idxFk].end);
    changed = true;
  }

  blockNext = blockNext.replace(/\n{3,}/g, '\n\n');
  let out = tb.before + blockNext + tb.after;

  // If parent import is now unused, drop it.
  const importLine = new RegExp(
    String.raw`^\s*import\s+\{\s*${reEscape(parentPlural)}Table\s*\}\s+from\s+['"]\./${reEscape(
      parentPlural,
    )}['"]\s*;\s*$`,
    'm',
  );
  if (importLine.test(out)) {
    const stillUsesParent = new RegExp(
      String.raw`\b${reEscape(parentPlural)}Table\b`,
    ).test(out);
    if (!stillUsesParent) {
      out = out.replace(importLine, '').replace(/\n{3,}/g, '\n\n');
      changed = true;
    }
  }

  return changed ? !!writeIfChanged(tree, schemaPath, out) || changed : false;
}

/* ───────────── Repo ─────────────
   (create touched libs/.../repos/<child>/repo.pg.ts) */
function revertRepoPg(
  tree: Tree,
  childSingular: string,
  childPlural: string,
  fk: string,
): boolean {
  const file = `libs/server/workbench-api/infra/src/lib/repos/${childSingular}/repo.pg.ts`;
  if (!tree.exists(file)) return false;
  let src = read(tree, file);
  let changed = false;

  const fkSnake = snake(fk);
  const Cap = names(childSingular).className;

  // Catch-all: strip no-op spreads related to FK
  const spreadNoopAny = new RegExp(
    String.raw`\.\.\.\s*(?:\(\s*)?patch\.` +
      reEscape(fk) +
      String.raw`\s*!={1,2}\s*undefined\s*\?\s*\{\s*\}\s*:\s*\{\s*\}\s*(?:\)\s*)?,?`,
    'g',
  );
  if (spreadNoopAny.test(src)) {
    src = src.replace(spreadNoopAny, '');
    changed = true;
  }

  // Remove fk from Row type
  src = src.replace(
    new RegExp(
      String.raw`(type\s+${reEscape(Cap)}Row\s*=\s*\{[\s\S]*?)\n\s*${reEscape(
        fkSnake,
      )}\s*:\s*string\s*;\s*`,
      'm',
    ),
    (_m, head) => {
      changed = true;
      return head + '\n';
    },
  );

  // Remove mapping in rowToX(...)
  src = src.replace(
    new RegExp(
      String.raw`(\breturn\s*\{\s*[\s\S]*?\bid\s*:\s*[^\n]+?\n)\s*${reEscape(
        fk,
      )}\s*:\s*row\.${reEscape(fkSnake)}\s*,?\s*\n`,
      'm',
    ),
    (_m, prefix) => {
      changed = true;
      return prefix;
    },
  );

  // Remove fk from .select({ ... })
  src = src.replace(
    /(\.select\s*\(\s*\{)([\s\S]*?)(\}\s*\))/g,
    (m, head, body, tail) => {
      const next = body
        .replace(
          new RegExp(
            String.raw`\s*${reEscape(fkSnake)}\s*:\s*${reEscape(
              childPlural,
            )}Table\.${reEscape(fkSnake)}\s*,?`,
            'g',
          ),
          '',
        )
        .replace(/,\s*,/g, ',')
        .replace(/\{\s*,/g, '{')
        .replace(/,\s*\}/g, '}');
      if (next !== body) changed = true;
      return `${head}${next}${tail}`;
    },
  );

  // Remove fk from .values({ ... })
  src = src.replace(
    /(\.values\s*\(\s*\{)([\s\S]*?)(\}\s*\))/m,
    (m, head, body, tail) => {
      let next = body
        .replace(
          new RegExp(
            String.raw`\s*${reEscape(fkSnake)}\s*:\s*data\.${reEscape(
              fk,
            )}\s*,?`,
            'g',
          ),
          '',
        )
        .replace(
          new RegExp(String.raw`\s*${reEscape(fkSnake)}\s*:\s*[^,}]+,\s*`, 'g'),
          '',
        );
      if (next !== body) changed = true;
      return `${head}${next}${tail}`;
    },
  );

  // Remove fk from .set({ ... })
  src = src.replace(
    /(\.set\s*\(\s*\{)([\s\S]*?)(\}\s*\))/m,
    (m, head, body, tail) => {
      const assign = new RegExp(
        String.raw`\s*` +
          reEscape(fkSnake) +
          String.raw`\s*:\s*patch\.` +
          reEscape(fk) +
          String.raw`,?\s*`,
        'g',
      );
      let next = body.replace(assign, '');

      const spreadAssign = new RegExp(
        String.raw`\.\.\.\(\s*patch\.` +
          reEscape(fk) +
          String.raw`\s*!={1,2}\s*undefined\s*\?\s*\{\s*` +
          reEscape(fkSnake) +
          String.raw`\s*:\s*patch\.` +
          reEscape(fk) +
          String.raw`\s*\}\s*:\s*\{\s*\}\s*\)\s*,?\s*`,
        'g',
      );
      next = next.replace(spreadAssign, '');

      const spreadNoop = new RegExp(
        String.raw`\.\.\.\(\s*patch\.` +
          reEscape(fk) +
          String.raw`\s*!={1,2}\s*undefined\s*\?\s*\{\s*\}\s*:\s*\{\s*\}\s*\)\s*,?\s*`,
        'g',
      );
      next = next.replace(spreadNoop, '');

      next = next
        .replace(/,\s*,/g, ',')
        .replace(/\{\s*,/g, '{')
        .replace(/,\s*\}/g, '}');

      if (next !== body) {
        changed = true;
        return `${head}${next}${tail}`;
      }
      return m;
    },
  );

  // Remove filters branch: if (key === '<fk>') {...}
  src = src.replace(
    new RegExp(
      String.raw`\n\s*if\s*\(\s*key\s*===\s*['"]` +
        reEscape(fk) +
        String.raw`['"]\s*\)\s*\{\s*[\s\S]*?\}\s*`,
      'm',
    ),
    () => {
      changed = true;
      return '\n';
    },
  );

  src = src.replace(/\n{3,}/g, '\n\n');
  return writeIfChanged(tree, file, src) || changed;
}

/* ───────────── Repo SPEC ─────────────
   (create touched one of these possible paths) */
function revertRepoSpecForFk(
  tree: Tree,
  childSingular: string,
  parentPlural: string,
  fk: string,
): boolean {
  const candidates = [
    // same folder layout as create flow
    `libs/server/workbench-api/infra/src/lib/repos/${childSingular}/repo.pg.spec.ts`,
    `libs/server/workbench-api/infra/src/lib/repos/tests/${childSingular}.repo.pg.spec.ts`,
    `libs/server/workbench-api/infra/src/lib/repos/__tests__/${childSingular}.repo.pg.spec.ts`,
  ];
  const file = candidates.find((p) => tree.exists(p));
  if (!file) return false;

  let src = read(tree, file);
  let changed = false;

  // drop tagged seed block (if any)
  src = src.replace(
    /^\s*\/\/\s*@edb begin:seed-parent[\s\S]*?^\s*\/\/\s*@edb end:seed-parent\s*$/gm,
    () => {
      changed = true;
      return '';
    },
  );
  src = src.replace(
    /\/\*?\s*@edb begin:seed-parent[\s\S]*?@edb end:seed-parent\s*\*?\//m,
    () => {
      changed = true;
      return '';
    },
  );

  // remove let <parentSingular>Id: string;
  const parentSingular = singularize(parentPlural);
  const parentIdVar = `${parentSingular}Id`;
  src = src.replace(
    new RegExp(
      String.raw`^\s*let\s+${reEscape(parentIdVar)}\s*:\s*string\s*;\s*$`,
      'm',
    ),
    () => {
      changed = true;
      return '';
    },
  );

  // strip "<fk>: ..." inside this repo's create({ ... }) calls
  {
    const repoName = `${names(childSingular).className}RepoPg`.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    // Correct regex for: <RepoName>.create({ ... })
    src = src.replace(
      new RegExp(
        String.raw`(${repoName})\s*\.create\s*$begin:math:text$\\s*\\{([\\s\\S]*?)\\}\\s*$end:math:text$`,
        'g',
      ),
      (_m, _head, body) => {
        const inner = body
          .replace(
            new RegExp(
              String.raw`\s*` + reEscape(fk) + String.raw`\s*:\s*[^,}]+,\s*`,
              'g',
            ),
            '',
          )
          .replace(
            new RegExp(
              String.raw`\s*,?\s*` +
                reEscape(fk) +
                String.raw`\s*:\s*[^,}]+\s*(?=\})`,
              'g',
            ),
            '',
          );
        if (inner !== body) changed = true;
        return `${_head}.create({${inner}})`;
      },
    );
  }

  // Fallback: ANY .create({ ... }) call
  src = src.replace(
    /(\.create\s*\(\s*\{)([\s\S]*?)(\}\s*\))/g,
    (_m, head, body, tail) => {
      const inner = body
        .replace(
          new RegExp(
            String.raw`\s*` + reEscape(fk) + String.raw`\s*:\s*[^,}]+,\s*`,
            'g',
          ),
          '',
        )
        .replace(
          new RegExp(
            String.raw`\s*,?\s*` +
              reEscape(fk) +
              String.raw`\s*:\s*[^,}]+\s*(?=\})`,
            'g',
          ),
          '',
        );
      if (inner !== body) changed = true;
      return `${head}${inner}${tail}`;
    },
  );

  // clean randomUUID import if now unused
  if (!/\brandomUUID\b/.test(src)) {
    src = src.replace(
      /^\s*import\s+\{\s*randomUUID\s*\}\s+from\s+['"]node:crypto['"]\s*;\s*$/m,
      () => {
        changed = true;
        return '';
      },
    );
    src = src.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]node:crypto['"]\s*;/m,
      (_m, namesStr) => {
        const parts = namesStr
          .split(',')
          .map((s: string) => s.trim())
          .filter((n: string) => n && n !== 'randomUUID');
        if (parts.length === namesStr.split(',').length) return _m;
        changed = true;
        return parts.length
          ? `import { ${parts.join(', ')} } from 'node:crypto';`
          : ``;
      },
    );
  }

  src = src.replace(/\n{3,}/g, '\n\n');
  return writeIfChanged(tree, file, src) || changed;
}

/* ───────────── Controller + register ───────────── */
function revertControllerIncludes(
  tree: Tree,
  childPlural: string,
  childSingular: string,
  capChild: string,
  includeAlias: string,
): boolean {
  const ctrlPath = `libs/server/workbench-api/resources/src/lib/${childPlural}/${childSingular}.controller.ts`;
  if (!tree.exists(ctrlPath)) return false;

  let ctrl = read(tree, ctrlPath);
  let changed = false;

  // Remove apply...Includes import
  ctrl = ctrl.replace(
    new RegExp(
      String.raw`^\s*import\s+\{\s*apply${reEscape(
        capChild,
      )}Includes\s*\}\s+from\s+'\.\/_includes\.${reEscape(includeAlias)}';\s*\n?`,
      'm',
    ),
    () => {
      changed = true;
      return '';
    },
  );

  // Remove RepoAdapters import (with or without 'type')
  ctrl = ctrl.replace(
    /^\s*import\s+(?:type\s+)?\{\s*RepoAdapters\s*\}\s+from\s+'\.{1,2}\/register';\s*\n?/m,
    () => {
      changed = true;
      return '';
    },
  );

  // Unwrap return lines
  function unwrap(kind: 'list' | 'one') {
    const needle = `return apply${capChild}Includes.${kind}`;
    let from = 0;
    while (true) {
      const idx = ctrl.indexOf(needle, from);
      if (idx === -1) break;

      const paren = ctrl.indexOf('(', idx + needle.length);
      if (paren === -1) break;
      const close = findMatchingParen(ctrl, paren);
      if (close === -1) break;

      let end = close;
      if (ctrl[close + 1] === ';') end = close + 1;

      const args = ctrl.slice(paren + 1, close);
      const parts = splitTopLevelArgs(args);
      const payload = parts[1] ?? 'undefined';
      const payloadClean = payload.replace(/^\s*await\s+/, '');

      const replacement = `return ${payloadClean};`;
      ctrl = ctrl.slice(0, idx) + replacement + ctrl.slice(end + 1);
      changed = true;

      from = idx + replacement.length;
    }
  }

  unwrap('list');
  unwrap('one');

  // Drop 'adapters' param in the function signature
  {
    const strictSig = new RegExp(
      String.raw`export\s+async\s+function\s+register${reEscape(
        capChild,
      )}Routes\s*$begin:math:text$\\s*app:\\s*FastifyInstance\\s*,\\s*svc:\\s*${reEscape(
        capChild,
      )}Service\\s*,\\s*adapters\\??:\\s*RepoAdapters\\s*$end:math:text$\s*:\s*Promise<void>\s*\{`,
      'm',
    );
    let next = ctrl.replace(
      strictSig,
      `export async function register${capChild}Routes(
  app: FastifyInstance,
  svc: ${capChild}Service,
): Promise<void> {`,
    );

    if (next === ctrl) {
      const looser = new RegExp(
        String.raw`(export\s+async\s+function\s+register${reEscape(
          capChild,
        )}Routes\s*\(\s*[^)]*?)\s*,\s*adapters\??:\s*RepoAdapters\s*`,
        'm',
      );
      next = ctrl.replace(looser, `$1`);
    }
    if (next !== ctrl) {
      ctrl = next;
      changed = true;
    }
  }

  ctrl = ctrl
    .replace(/,\s*\)/g, ')')
    .replace(/\(\s*,/g, '(')
    .replace(/\n{3,}/g, '\n\n');

  return writeIfChanged(tree, ctrlPath, ctrl) || changed;
}

function revertRegisterCallAdaptersArg(tree: Tree, capChild: string): boolean {
  const regPath = 'libs/server/workbench-api/resources/src/lib/register.ts';
  if (!tree.exists(regPath)) return false;

  let src = read(tree, regPath);
  let changed = false;

  const callName = `register${capChild}Routes`;
  let from = 0;

  while (true) {
    const m = src.slice(from).match(new RegExp(callName + String.raw`\s*\(`));
    if (!m || m.index === undefined) break;

    const start = from + m.index;
    const open = start + m[0].length - 1; // '(' index
    const close = findMatchingParen(src, open);
    if (close === -1) break;

    const args = src.slice(open + 1, close);
    const parts = splitTopLevelArgs(args).filter((p) => p !== 'adapters');
    const nextArgs = parts.join(', ');

    if (nextArgs !== args.trim()) {
      src = src.slice(0, open + 1) + nextArgs + src.slice(close);
      changed = true;
      from = open + 1 + nextArgs.length + 1; // after ')'
    } else {
      from = close + 1;
    }
  }

  if (!changed) return false;

  src = src
    .replace(/,\s*\)/g, ')')
    .replace(/\(\s*,/g, '(')
    .replace(/\n{3,}/g, '\n\n');

  const wrote = !!writeIfChanged(tree, regPath, src);
  return wrote || changed;
}

/* ───────────── Main (REVERT flow) ───────────── */
export default async function revertFlow(
  tree: Tree,
  schema: Schema,
  nameset: {
    child: string;
    parent: string;
    childSingular: string;
    parentSingular: string;
    CapChild: string;
  },
) {
  const { child, parent, childSingular, parentSingular, CapChild } = nameset;

  const fk = schema.fk?.trim() || `${parentSingular}Id`;
  const includeAlias = schema.include?.trim() || parentSingular;

  let anyChanged = false;

  anyChanged =
    revertFkInContract(tree, childSingular, parent, fk, includeAlias) ||
    anyChanged;
  anyChanged = revertModelZod(tree, childSingular, CapChild, fk) || anyChanged;
  anyChanged = revertDrizzleSchema(tree, child, parent, fk) || anyChanged; // NOTE: parent added here
  anyChanged = revertRepoPg(tree, childSingular, child, fk) || anyChanged;
  anyChanged =
    revertRepoSpecForFk(tree, childSingular, parent, fk) || anyChanged;

  anyChanged =
    revertControllerIncludes(
      tree,
      child,
      childSingular,
      CapChild,
      includeAlias,
    ) || anyChanged;

  const incPath = `libs/server/workbench-api/resources/src/lib/${child}/_includes.${includeAlias}.ts`;
  if (tree.exists(incPath)) {
    tree.delete(incPath);
    anyChanged = true;
  }

  anyChanged = revertRegisterCallAdaptersArg(tree, CapChild) || anyChanged;

  if (anyChanged) await formatFiles(tree);

  console.info(
    `[workbench-api-rel] Reverted → ${child} belongsTo ${parent} (fk=${fk})`,
  );
  if (!anyChanged)
    console.info(`[workbench-api-rel] Nothing to revert (already clean).`);
}
