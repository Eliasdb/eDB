import { formatFiles, names, Tree } from '@nx/devkit';
import {
  addImportAfterImports,
  ContractJSON,
  findPgTableBlock,
  insertImportSafely,
  loadContractJSON,
  normalizeMin,
  read,
  Schema,
  singularize,
  snake,
  splitTopLevelProps,
  writeIfChanged,
} from './utils';

/* ───────────── Step 1: Contract JSON (ensure fk + relationship) ───────────── */
function ensureFkInContract(
  tree: Tree,
  childSingular: string,
  parentPlural: string,
  fk: string,
  includeAlias: string,
  onDelete: Schema['onDelete'],
  selectList: string[],
): { required: boolean; changed: boolean } {
  const contractPath = `libs/server/workbench-api/models/src/contracts/${childSingular}.contract.json`;
  const raw = read(tree, contractPath);
  const json: ContractJSON = JSON.parse(raw);

  let changed = false;

  let fkField = json.fields.find((f) => f.fieldName === fk);
  let required = fkField ? fkField.required : true;

  if (!fkField) {
    fkField = {
      fieldName: fk,
      required,
      tsType: 'string',
      zodBase: 'z.string().uuid()',
    };
    json.fields.push(fkField);
    changed = true;

    const frag = `${fk}${required ? '' : '?'}:uuid`;
    json.fieldsString =
      json.fieldsString && json.fieldsString.trim().length > 0
        ? `${json.fieldsString},${frag}`
        : frag;
  }

  json.relationships ??= {};
  json.relationships.belongsTo ??= [];

  const already = json.relationships.belongsTo.find(
    (r) => r.fk === fk && r.to === parentPlural,
  );
  const effectiveOnDelete = onDelete ?? (required ? 'restrict' : 'setNull');

  if (already) {
    const before = JSON.stringify(already);
    already.name = includeAlias;
    already.required = required;
    already.include = true;
    already.select = selectList;
    already.onDelete = effectiveOnDelete;
    if (JSON.stringify(already) !== before) changed = true;
  } else {
    json.relationships.belongsTo.push({
      name: includeAlias,
      to: parentPlural,
      fk,
      required,
      include: true,
      select: selectList,
      onDelete: effectiveOnDelete,
    });
    changed = true;
  }

  const next = JSON.stringify(json, null, 2);
  return {
    required,
    changed: writeIfChanged(tree, contractPath, next) || changed,
  };
}

/* ───────────── Step 2: Model Zod ───────────── */
function patchModelZod(
  tree: Tree,
  childSingular: string,
  CapChild: string,
  fk: string,
  required: boolean,
): boolean {
  const modelPath = `libs/server/workbench-api/models/src/lib/${childSingular}.model.ts`;
  let src = read(tree, modelPath);
  let changed = false;

  const fkModel = `  ${fk}: z.string().uuid()${required ? '' : '.optional()'},`;
  const fkCreate = `  ${fk}: z.string().uuid()${required ? '' : '.optional()'},`;
  const fkUpdate = `  ${fk}: z.string().uuid().optional(),`;

  src = src.replace(
    new RegExp(
      `(export\\s+const\\s+${childSingular}Schema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*createdAt:)`,
      'm',
    ),
    (m, head, createdAt) =>
      m.includes(`${fk}: z.string().uuid()`)
        ? m
        : ((changed = true), head + `\n${fkModel}\n` + createdAt),
  );
  src = src.replace(
    new RegExp(
      `(export\\s+const\\s+create${CapChild}BodySchema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*\\}\\)\\s*;?)`,
      'm',
    ),
    (m, head, tail) =>
      m.includes(`${fk}: z.string().uuid()`)
        ? m
        : ((changed = true), head + `\n${fkCreate}\n` + tail),
  );
  src = src.replace(
    new RegExp(
      `(export\\s+const\\s+update${CapChild}BodySchema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*\\}\\)\\s*;?)`,
      'm',
    ),
    (m, head, tail) =>
      m.includes(`${fk}: z.string().uuid().optional()`)
        ? m
        : ((changed = true), head + `\n${fkUpdate}\n` + tail),
  );

  return writeIfChanged(tree, modelPath, src) || changed;
}

/* ───────────── Step 3: Drizzle schema ───────────── */
function patchDrizzleSchema(
  tree: Tree,
  childPlural: string,
  parentPlural: string,
  fk: string,
  required: boolean,
  onDelete: 'restrict' | 'setNull' | 'cascade',
): boolean {
  const schemaPath = `libs/server/workbench-api/infra/src/lib/db/schema.${childPlural}.ts`;
  let src = read(tree, schemaPath);
  let changed = false;

  const importLine = `import { ${parentPlural}Table } from './schema.${parentPlural}';`;
  const src0 = insertImportSafely(src, importLine);
  if (src0 !== src) {
    src = src0;
    changed = true;
  }

  const tb = findPgTableBlock(src, childPlural);
  if (!tb)
    throw new Error(
      `Could not find pgTable('${childPlural}', { ... }) in ${schemaPath}`,
    );

  const fkSnake = snake(fk);
  const canonicalCore =
    `${fkSnake}: uuid('${fkSnake}')` +
    (required ? `.notNull()` : ``) +
    `.references(() => ${parentPlural}Table.id, { onDelete: '${onDelete}', onUpdate: 'cascade' }),`;

  const props = splitTopLevelProps(tb.block);
  const idxCreated = props.findIndex((p) => p.name === 'created_at');
  const idxUpdated = props.findIndex((p) => p.name === 'updated_at');
  const idxFk = props.findIndex((p) => p.name === fkSnake);
  const defaultIndent =
    props.find((p) => p.indent.trim().length > 0)?.indent ?? '  ';
  const mk = (indent: string) => `\n${indent}${canonicalCore}\n`;

  let blockNext = tb.block;

  if (idxFk >= 0) {
    const prop = props[idxFk];
    const indent = prop.indent || defaultIndent;
    const canonicalWithIndent = mk(indent);
    const current = prop.text.endsWith('\n') ? prop.text : prop.text + '\n';
    if (normalizeMin(current) !== normalizeMin(canonicalWithIndent)) {
      blockNext =
        blockNext.slice(0, prop.start) +
        canonicalWithIndent +
        blockNext.slice(prop.end);
      changed = true;
    }
  } else {
    const insertIndent =
      (idxCreated >= 0 ? props[idxCreated].indent : null) ??
      (idxUpdated >= 0 ? props[idxUpdated].indent : null) ??
      defaultIndent;

    const anchorStart =
      idxCreated >= 0
        ? props[idxCreated].start
        : idxUpdated >= 0
          ? props[idxUpdated].start
          : tb.block.length;

    const canon = mk(insertIndent);
    blockNext =
      tb.block.slice(0, anchorStart) + canon + tb.block.slice(anchorStart);
    changed = true;
  }

  blockNext = blockNext.replace(/\n{3,}/g, '\n\n');

  if (!changed) return false;
  const out = tb.before + blockNext + tb.after;
  return writeIfChanged(tree, schemaPath, out) || changed;
}

/* ───────────── Step 4: Repo wiring ───────────── */
function patchRepoPg(
  tree: Tree,
  childSingular: string,
  childPlural: string,
  fk: string,
): boolean {
  const file = `libs/server/workbench-api/infra/src/lib/repos/${childSingular}.repo.pg.ts`;
  if (!tree.exists(file)) return false;
  let src = read(tree, file);
  let changed = false;

  const tableImport = `import { ${childPlural}Table } from '../db/schema.${childPlural}';`;
  if (!src.includes(tableImport)) {
    src = addImportAfterImports(src, tableImport);
    changed = true;
  }

  const fkSnake = snake(fk);
  const Cap = names(childSingular).className;

  {
    // Row type
    const startTok = `type ${Cap}Row = {`;
    const si = src.indexOf(startTok);
    if (si !== -1) {
      const ei = src.indexOf('};', si);
      if (ei !== -1) {
        const body = src.slice(si + startTok.length, ei);
        if (!new RegExp(String.raw`\b${fkSnake}\s*:\s*string\b`).test(body)) {
          const patched =
            startTok + body + `\n  ${fkSnake}: string;` + src.slice(ei, ei + 2);
          src = src.slice(0, si) + patched + src.slice(ei + 2);
          changed = true;
        }
      }
    }
  }
  {
    // Mapper
    const fnStart = `function rowTo${Cap}(row: ${Cap}Row): ${Cap} {`;
    const i = src.indexOf(fnStart);
    if (i !== -1) {
      const rs = src.indexOf('return {', i);
      const re = src.indexOf('};', rs);
      if (rs !== -1 && re !== -1) {
        const obj = src.slice(rs + 'return {'.length, re);
        if (
          !new RegExp(String.raw`\b${fk}\s*:\s*row\.${fkSnake}\b`).test(obj)
        ) {
          const withInsert = obj.replace(
            /(\bid\s*:\s*[^\n]+?\n)/,
            `$1    ${fk}: row.${fkSnake},\n`,
          );
          src =
            src.slice(0, rs + 'return {'.length) + withInsert + src.slice(re);
          changed = true;
        }
      }
    }
  }
  // SELECT object
  const selectObjRe = /(\.select\s*\(\s*\{\s*)([\s\S]*?)(\}\s*\))/g;

  src = src.replace(selectObjRe, (m, before, body, after) => {
    const hasTableId = new RegExp(String.raw`\b${childPlural}Table\.id\b`).test(
      body,
    );
    const hasFk = new RegExp(
      String.raw`\b${fkSnake}\s*:\s*${childPlural}Table\.${fkSnake}\b`,
    ).test(body);
    if (!hasTableId || hasFk) return m; // skip non-row selects or already injected
    changed = true;
    return `${before}${fkSnake}: ${childPlural}Table.${fkSnake}, ${body}${after}`;
  });

  // INSERT .values({ ... })
  const valuesRe = /(\.values\s*\(\s*\{)([\s\S]*?)(\}\s*\))/m;

  if (valuesRe.test(src)) {
    src = src.replace(valuesRe, (m, head, body, tail) => {
      if (new RegExp(String.raw`\b${fkSnake}\s*:\s*data\.${fk}\b`).test(body))
        return m;
      changed = true;
      return `${head} ${fkSnake}: data.${fk}, ${body} ${tail}`;
    });
  }

  // UPDATE .set({ ... })
  const setRe = /(\.set\s*\(\s*\{)([\s\S]*?)(\}\s*\))/m;

  if (setRe.test(src)) {
    src = src.replace(setRe, (m, head, body, tail) => {
      if (new RegExp(String.raw`\b${fkSnake}\s*:`).test(body)) return m;
      changed = true;
      const add = ` ...(patch.${fk} !== undefined ? { ${fkSnake}: patch.${fk} } : {}), `;
      return `${head}${add}${body}${tail}`;
    });
  }

  // Filters loop (for mergedFilters)
  const loopStartRe =
    /for\s*\(\s*const\s*\[\s*key\s*,\s*val\s*\]\s*of\s*Object\.entries\(\s*mergedFilters\s*\)\s*\)\s*\{/m;

  if (loopStartRe.test(src)) {
    const fkCase = `
      if (key === '${fk}') {
        parts.push(eq(${childPlural}Table.${fkSnake} as any, val as any));
      }`;
    if (!new RegExp(String.raw`key\s*===\s*['"]${fk}['"]`).test(src)) {
      src = src.replace(loopStartRe, (t) => t + fkCase);
      changed = true;
    }
  }

  return writeIfChanged(tree, file, src) || changed;
}

/* ───────────── Step 4.5: Repo spec ───────────── */
function patchRepoSpecForFk(
  tree: Tree,
  childSingular: string,
  parentPlural: string,
  fk: string,
): boolean {
  const candidates = [
    `libs/server/workbench-api/infra/src/lib/repos/${childSingular}.repo.pg.spec.ts`,
    `libs/server/workbench-api/infra/src/lib/repos/tests/${childSingular}.repo.pg.spec.ts`,
    `libs/server/workbench-api/infra/src/lib/repos/__tests__/${childSingular}.repo.pg.spec.ts`,
  ];
  const file = candidates.find((p) => tree.exists(p));
  if (!file) return false;

  let src = read(tree, file);
  let changed = false;

  // import randomUUID
  if (!/from ['"]node:crypto['"]/.test(src)) {
    src = addImportAfterImports(
      src,
      `import { randomUUID } from 'node:crypto';`,
    );
    changed = true;
  } else if (!/\brandomUUID\b/.test(src)) {
    src = src.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]node:crypto['"]\s*;/,
      (_m, names) => {
        const parts = names
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        if (!parts.includes('randomUUID')) parts.push('randomUUID');
        return `import { ${parts.join(', ')} } from 'node:crypto';`;
      },
    );
    changed = true;
  }

  const parentSingular = singularize(parentPlural);
  const parentIdVar = `${parentSingular}Id`;

  // declare let <parentIdVar>: string;
  if (
    !new RegExp(String.raw`\blet\s+${parentIdVar}\s*:\s*string\s*;`).test(src)
  ) {
    src = src.replace(
      /(\n)(function plan\()/,
      `\nlet ${parentIdVar}: string;\n$1$2`,
    );
    changed = true;
  }

  // seed parent in beforeEach
  if (
    /beforeEach\s*\(\s*async/.test(src) &&
    !src.includes('@edb begin:seed-parent')
  ) {
    const parentContract = loadContractJSON(tree, parentSingular);
    const reqCols = parentContract.fields
      .filter((f) => f.required)
      .map((f) => f.fieldName)
      .filter((n) => n !== 'id' && n !== 'createdAt' && n !== 'updatedAt');

    const colsSQL = [`"id"`, ...reqCols.map((n) => `"${snake(n)}"`)].join(', ');
    const valuesJS = [parentIdVar, ...reqCols.map(() => 'randomUUID()')];
    const tpl = valuesJS.map((e) => `\${${e}}`).join(', ');

    const seed = `
  // @edb begin:seed-parent ${parentPlural}
  ${parentIdVar} = randomUUID();
  await db.execute(sql\`DELETE FROM "${parentPlural}";\`);
  await db.execute(sql\`INSERT INTO "${parentPlural}" (${colsSQL}) VALUES (${tpl})\`);
  // @edb end:seed-parent
`;
    src = src.replace(
      /beforeEach\s*\(\s*async\s*\(\)\s*=>\s*\{\s*/,
      (m) => m + seed,
    );
    changed = true;
  }

  // inject fk into create({...})
  const repoName = `${names(childSingular).className}RepoPg`.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
  src = src.replace(
    new RegExp(`${repoName}\\.create\\s*\\(\\s*\\{([\\s\\S]*?)\\}\\s*\\)`, 'g'),
    (m, obj) => {
      if (new RegExp(String.raw`\b${fk}\s*:`).test(obj)) return m;
      const afterTitle = obj.replace(
        /(title\s*:\s*[^,}]+,?)/,
        `$1\n      ${fk}: ${parentIdVar},`,
      );
      if (afterTitle !== obj) return m.replace(obj, afterTitle);
      return m.replace(obj, `${fk}: ${parentIdVar}, ${obj}`);
    },
  );

  return writeIfChanged(tree, file, src) || changed;
}

/* ───────────── Step 5: Controller includes + register ───────────── */
function ensureControllerSignatureAcceptsAdapters(
  src: string,
  capChild: string,
) {
  let changed = false;
  const withImport = addImportAfterImports(
    src,
    `import type { RepoAdapters } from '../register';`,
  );
  if (withImport !== src) {
    src = withImport;
    changed = true;
  }
  const re = new RegExp(
    String.raw`export\s+async\s+function\s+register${capChild}Routes\s*\(` +
      String.raw`[\s\S]*?\)\s*:\s*Promise<void>\s*\{`,
  );
  if (re.test(src)) {
    const replacement =
      `export async function register${capChild}Routes(` +
      `\n  app: FastifyInstance,` +
      `\n  svc: ${capChild}Service,` +
      `\n  adapters?: RepoAdapters,` +
      `\n): Promise<void> {`;
    const next = src.replace(re, replacement);
    if (next !== src) {
      src = next;
      changed = true;
    }
  }
  return { next: src, changed };
}

function patchControllerForIncludesMinimal(
  src: string,
  childPlural: string,
  childSingular: string,
  capChild: string,
  includeAlias: string,
) {
  let changed = false;
  src = addImportAfterImports(
    src,
    `import type { RepoAdapters } from '../register';`,
  );
  src = addImportAfterImports(
    src,
    `import { apply${capChild}Includes } from './_includes.${includeAlias}';`,
  );
  if (src.includes('return svc.list(ctx, plan);')) {
    src = src.replace(
      'return svc.list(ctx, plan);',
      `return apply${capChild}Includes.list(req, await svc.list(ctx, plan), adapters);`,
    );
    changed = true;
  }
  if (src.includes('return svc.getOne(ctx, id);')) {
    src = src.replace(
      'return svc.getOne(ctx, id);',
      `return apply${capChild}Includes.one(req, await svc.getOne(ctx, id), adapters);`,
    );
    changed = true;
  }
  return { next: src, changed };
}

function writeIncludesHelper(
  tree: Tree,
  childPlural: string,
  childSingular: string,
  parentPlural: string,
  includeAlias: string,
  select: string[],
  capChild: string,
): boolean {
  const p = `libs/server/workbench-api/resources/src/lib/${childPlural}/_includes.${includeAlias}.ts`;
  if (tree.exists(p)) return false;

  const parentSingular = singularize(parentPlural);

  const content = `import type { FastifyRequest } from 'fastify';
import type { RepoAdapters } from '../register';

function pick<T extends Record<string, unknown>>(obj: T, keys: string[]) {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = (obj as any)[k];
  return out;
}
function wants(req: FastifyRequest, key: string) {
  const raw = (req.query as any)?.include;
  if (!raw) return false;
  const set = new Set(String(raw).split(',').map((s) => s.trim()).filter(Boolean));
  return set.has(key);
}
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const idOf = (r: Record<string, unknown>): string | undefined => {
  const v =
    r['${includeAlias}Id'] ??
    r['${parentSingular}Id'] ??
    r['${includeAlias}_id'] ??
    r['${parentSingular}_id'];
  return isNonEmptyString(v) ? v : undefined;
};

export const apply${capChild}Includes = {
  async list(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, '${includeAlias}') || !out?.items?.length) return out;

    const rawIds = (out.items as Array<Record<string, unknown>>).map((r) => idOf(r));
    const ids = Array.from(new Set(rawIds.filter(isNonEmptyString)));
    if (ids.length === 0) return out;

    const map = new Map<string, any>();
    await Promise.all(
      ids.map(async (id) => {
        const p = await (adapters as any)['${parentSingular}'].getById(id);
        if (p) map.set(id, p);
      }),
    );

    out.items = (out.items as Array<Record<string, unknown>>).map((r) => {
      const pid = idOf(r);
      const val = pid ? map.get(pid) : undefined;
      return val ? { ...r, ${includeAlias}: pick(val, ${JSON.stringify(select)}) } : r;
    });
    return out;
  },

  async one(req: FastifyRequest, out: any, adapters?: RepoAdapters) {
    if (!adapters || !wants(req, '${includeAlias}') || !out?.${childSingular}) return out;

    const r = out.${childSingular} as Record<string, unknown>;
    const pid = idOf(r);
    if (!pid) return out;

    const val = await (adapters as any)['${parentSingular}'].getById(pid);
    if (val) out.${childSingular}.${includeAlias} = pick(val, ${JSON.stringify(select)});
    return out;
  },
};`;

  return writeIfChanged(tree, p, content);
}

function splitTopLevelArgs(str: string): string[] {
  const out: string[] = [];
  let buf = '',
    dParen = 0,
    dBrack = 0,
    dBrace = 0;
  let strCh: '"' | "'" | '`' | null = null,
    esc = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (strCh) {
      if (ch === '\\' && !esc) {
        esc = true;
        buf += ch;
        continue;
      }
      if (ch === strCh && !esc) {
        strCh = null;
        buf += ch;
        continue;
      }
      esc = false;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      strCh = ch as any;
      buf += ch;
      continue;
    }
    if (ch === '(') dParen++;
    else if (ch === ')') dParen--;
    else if (ch === '[') dBrack++;
    else if (ch === ']') dBrack--;
    else if (ch === '{') dBrace++;
    else if (ch === '}') dBrace--;
    if (ch === ',' && dParen === 0 && dBrack === 0 && dBrace === 0) {
      out.push(buf.trim());
      buf = '';
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function patchRegisterCallToPassAdapters(
  tree: Tree,
  capChild: string,
): boolean {
  const regPath = 'libs/server/workbench-api/resources/src/lib/register.ts';
  if (!tree.exists(regPath)) return false;

  let src = read(tree, regPath);
  let changed = false;

  const callName = `register${capChild}Routes`;
  let from = 0;

  while (true) {
    const callIdx = src.indexOf(callName, from);
    if (callIdx === -1) break;

    // Ensure it's a call (not an import)
    let j = callIdx + callName.length;
    while (j < src.length && /\s/.test(src[j])) j++;
    if (src[j] !== '(') {
      from = j;
      continue;
    }

    const open = j;
    // find matching ')'
    let i = open + 1,
      depth = 1,
      inStr: string | null = null,
      esc = false;
    while (i < src.length && depth > 0) {
      const ch = src[i++];
      if (inStr) {
        if (ch === '\\' && !esc) {
          esc = true;
          continue;
        }
        if (ch === inStr && !esc) {
          inStr = null;
          continue;
        }
        esc = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
        continue;
      }
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
    }
    if (depth !== 0) break;

    const close = i - 1;
    const args = src.slice(open + 1, close);
    const parts = splitTopLevelArgs(args);
    const hasTopLevelAdapters = parts.some((p) => p === 'adapters');

    if (!hasTopLevelAdapters) {
      const newArgs = args.trim().length ? `${args}, adapters` : `adapters`;
      src = src.slice(0, open + 1) + newArgs + src.slice(close);
      changed = true;
      from = open + 1 + newArgs.length + 1;
    } else {
      from = close + 1;
    }
  }

  return writeIfChanged(tree, regPath, src) || changed;
}

/* ───────────── Main (CREATE flow) ───────────── */
export default async function createFlow(
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
  const select = schema.select
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? ['id', 'name'];
  const onDelete = schema.onDelete ?? 'cascade';

  let anyChanged = false;

  const { required, changed: c1 } = ensureFkInContract(
    tree,
    childSingular,
    parent,
    fk,
    includeAlias,
    onDelete,
    select,
  );
  anyChanged = anyChanged || c1;

  anyChanged =
    patchModelZod(tree, childSingular, CapChild, fk, required) || anyChanged;
  anyChanged =
    patchDrizzleSchema(tree, child, parent, fk, required, onDelete) ||
    anyChanged;
  anyChanged = patchRepoPg(tree, childSingular, child, fk) || anyChanged;
  anyChanged =
    patchRepoSpecForFk(tree, childSingular, parent, fk) || anyChanged;

  const ctrlPath = `libs/server/workbench-api/resources/src/lib/${child}/${childSingular}.controller.ts`;
  let ctrlSrc = read(tree, ctrlPath);
  const s1 = ensureControllerSignatureAcceptsAdapters(ctrlSrc, CapChild);
  ctrlSrc = s1.next;
  anyChanged = anyChanged || s1.changed;

  const s2 = patchControllerForIncludesMinimal(
    ctrlSrc,
    child,
    childSingular,
    CapChild,
    includeAlias,
  );
  ctrlSrc = s2.next;
  anyChanged = anyChanged || s2.changed;

  anyChanged = writeIfChanged(tree, ctrlPath, ctrlSrc) || anyChanged;
  anyChanged =
    writeIncludesHelper(
      tree,
      child,
      childSingular,
      parent,
      includeAlias,
      select,
      CapChild,
    ) || anyChanged;
  anyChanged = patchRegisterCallToPassAdapters(tree, CapChild) || anyChanged;

  if (anyChanged) await formatFiles(tree);

  console.info(
    `[workbench-api-rel] OK → ${child} belongsTo ${parent} via fk=${fk} (onDelete=${onDelete})`,
  );
  if (!anyChanged) {
    console.info(`[workbench-api-rel] No changes: already up-to-date.`);
  } else {
    console.info(`Next:
  pnpm nx run workbench-api-infra:migrations:generate
  pnpm nx run workbench-api-infra:migrate

Try:
  curl -g "$BASE/${child}?page=1&pageSize=5&include=${includeAlias}"
  curl -g "$BASE/${child}/:id?include=${includeAlias}"
`);
  }
}
