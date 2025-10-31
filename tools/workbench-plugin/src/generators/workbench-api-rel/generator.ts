import { Tree, formatFiles, names } from '@nx/devkit';

/* ──────────────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────────────── */
type Schema = {
  belongsTo: string; // "albums:artists"
  fk?: string; // e.g. "artistId"
  include?: string; // e.g. "artist"
  onDelete?: 'restrict' | 'setNull' | 'cascade';
  select?: string; // e.g. "id,name,status"
};

type ContractField = {
  fieldName: string;
  required: boolean;
  tsType: string;
  zodBase: string;
};

type ContractJSON = {
  name: string; // child singular
  plural: string; // child plural
  fieldsString?: string;
  fields: ContractField[];
  relationships?: {
    belongsTo?: Array<{
      name: string; // include alias (parent singular)
      to: string; // parent plural
      fk: string; // fk on child
      required: boolean;
      include?: boolean;
      select?: string[];
      onDelete?: 'restrict' | 'setNull' | 'cascade';
    }>;
  };
};

/* ──────────────────────────────────────────────────────────────────────────
   Small utils
────────────────────────────────────────────────────────────────────────── */
const singularize = (s: string) => (s.endsWith('s') ? s.slice(0, -1) : s);
const snake = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

function read(tree: Tree, p: string) {
  const buf = tree.read(p);
  if (!buf) throw new Error(`Missing file: ${p}`);
  return buf.toString('utf-8');
}
function writeIfChanged(tree: Tree, p: string, next: string): boolean {
  const prev = tree.exists(p) ? read(tree, p) : undefined;
  if (prev === next) return false;
  tree.write(p, next);
  return true;
}

function loadContractJSON(
  tree: Tree,
  singular: string,
): { fields: ContractField[]; fieldsString?: string } {
  const p = `libs/server/workbench-api/models/src/contracts/${singular}.contract.json`;
  const raw = read(tree, p);
  const json = JSON.parse(raw) as {
    fields: ContractField[];
    fieldsString?: string;
  };
  return json;
}

function seedExprForField(f: ContractField, varForId?: string): string {
  // Always pass values as SQL params: ${...}
  const name = f.fieldName;
  const isUuid = f.zodBase.includes('.uuid()') || /Id$/.test(name);

  if (name === 'id' && varForId) return varForId; // already like "artistId"

  if (f.tsType.includes("'")) {
    // enum: pick first
    const first = f.tsType.split('|')[0]!.trim().replace(/'/g, '');
    return `'${first}'`;
  }
  if (f.zodBase.includes('.datetime()')) return 'new Date()';
  if (f.tsType === 'number') return '1';
  if (f.tsType === 'boolean') return 'false';
  if (isUuid) return 'randomUUID()';
  // string-ish
  const base = name.toLowerCase().includes('name') ? 'test-name' : 'seed';
  return `'${base}'`;
}

function addImportAfterImports(src: string, importLine: string): string {
  const line = importLine.trim();
  if (src.includes(line)) return src;
  const lines = src.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++)
    if (/^\s*import\s/.test(lines[i])) last = i;
  lines.splice(last >= 0 ? last + 1 : 0, 0, line);
  return lines.join('\n');
}

/** Insert import after the `drizzle-orm/pg-core` semicolon if present,
 *  else after the first import block, else at top. */
function insertImportSafely(src: string, importLine: string): string {
  if (src.includes(importLine)) return src;
  const lines = src.split('\n');

  // Prefer after drizzle pg-core import (single or multi-line)
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes(`from 'drizzle-orm/pg-core'`) ||
      lines[i].includes(`from "drizzle-orm/pg-core"`)
    ) {
      // advance to semicolon end of this import
      while (i < lines.length && !lines[i].trim().endsWith(';')) i++;
      lines.splice(i + 1, 0, importLine);
      return lines.join('\n');
    }
  }

  // Else after leading import block
  let j = 0;
  while (j < lines.length && lines[j].startsWith('import ')) {
    while (j < lines.length && !lines[j].trim().endsWith(';')) j++;
    j++;
  }
  lines.splice(Math.max(0, j), 0, importLine);
  return lines.join('\n');
}

/* ──────────────────────────────────────────────────────────────────────────
   PG table block helpers
────────────────────────────────────────────────────────────────────────── */
function findPgTableBlock(src: string, tablePlural: string) {
  // find "export const <plural>Table = pgTable('plural', { ... })"
  const varDecl = new RegExp(
    String.raw`export\s+const\s+${tablePlural}Table\s*=\s*pgTable\s*\(\s*['"]${tablePlural}['"]\s*,\s*\{`,
    'm',
  );
  const m = varDecl.exec(src);
  if (!m) return null;

  let i = m.index + m[0].length; // position after "{"
  let depth = 1;
  const start = i;
  while (i < src.length) {
    const ch = src[i++];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const end = i - 1; // position of closing "}"
        return {
          start,
          end,
          before: src.slice(0, start),
          block: src.slice(start, end),
          after: src.slice(end),
        };
      }
    }
  }
  return null;
}

/** Split the top-level properties of an object literal block safely.
 * Returns props with their exact text (including trailing comma if present),
 * and absolute offsets inside the `block` string. */
function splitTopLevelProps(block: string): Array<{
  name: string | null;
  text: string;
  start: number;
  end: number;
  indent: string;
}> {
  const res: Array<{
    name: string | null;
    text: string;
    start: number;
    end: number;
    indent: string;
  }> = [];

  let i = 0;
  let segStart = 0;

  // Track nesting + strings
  let inStr: '"' | "'" | '`' | null = null;
  let esc = false;
  let p = 0,
    b = 0,
    c = 0; // (), {}, []
  while (i < block.length) {
    const ch = block[i];

    if (inStr) {
      if (!esc && ch === inStr) inStr = null;
      esc = !esc && ch === '\\';
      i++;
      continue;
    }
    if (ch === '(') p++;
    else if (ch === ')') p = Math.max(0, p - 1);
    else if (ch === '{') b++;
    else if (ch === '}') b = Math.max(0, b - 1);
    else if (ch === '[') c++;
    else if (ch === ']') c = Math.max(0, c - 1);

    const atTop = p === 0 && b === 0 && c === 0;
    if (atTop && ch === ',') {
      const piece = block.slice(segStart, i + 1); // include comma
      const nameMatch = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/.exec(piece);
      const name = nameMatch ? nameMatch[1] : null;
      const indent = (() => {
        const m = /^\s*/.exec(piece);
        return m ? m[0] : '';
      })();
      res.push({
        name,
        text: piece,
        start: segStart,
        end: i + 1,
        indent,
      });
      segStart = i + 1;
    }

    i++;
  }

  // trailing segment (possibly without comma)
  if (segStart < block.length) {
    const piece = block.slice(segStart);
    const nameMatch = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/.exec(piece);
    const name: string | null = nameMatch?.[1] ?? null;
    const indent = (() => {
      const m = /^\s*/.exec(piece);
      return m ? m[0] : '';
    })();
    res.push({
      name,
      text: piece,
      start: segStart,
      end: block.length,
      indent,
    });
  }

  return res.filter((p) => p.name !== null);
}

function normalizeMin(s: string) {
  return s.replace(/\s+/g, '');
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 1: Contract JSON (ensure fk + relationships)
────────────────────────────────────────────────────────────────────────── */
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

  // detect FK field in contract
  let fkField = json.fields.find((f) => f.fieldName === fk);
  let required = fkField ? fkField.required : true; // if absent, assume required

  if (!fkField) {
    fkField = {
      fieldName: fk,
      required,
      tsType: 'string',
      zodBase: 'z.string().uuid()',
    };
    json.fields.push(fkField);
    changed = true;

    // update fieldsString (append)
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

/* ──────────────────────────────────────────────────────────────────────────
   Step 2: Model Zod (add fk to model/create/update)
────────────────────────────────────────────────────────────────────────── */
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

  // in main schema: add before createdAt
  const src1 = src.replace(
    new RegExp(
      `(export\\s+const\\s+${childSingular}Schema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*createdAt:)`,
      'm',
    ),
    (m, head, createdAt) =>
      m.includes(`${fk}: z.string().uuid()`)
        ? m
        : ((changed = true), head + `\n${fkModel}\n` + createdAt),
  );

  // in create schema
  const src2 = src1.replace(
    new RegExp(
      `(export\\s+const\\s+create${CapChild}BodySchema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*\\}\\)\\s*;?)`,
      'm',
    ),
    (m, head, tail) =>
      m.includes(`${fk}: z.string().uuid()`)
        ? m
        : ((changed = true), head + `\n${fkCreate}\n` + tail),
  );

  // in update schema  **FIXED REGEX**
  const src3 = src2.replace(
    new RegExp(
      `(export\\s+const\\s+update${CapChild}BodySchema\\s*=\\s*z\\.object\\s*\\(\\s*\\{[\\s\\S]*?)(\\n\\s*\\}\\)\\s*;?)`,
      'm',
    ),
    (m, head, tail) =>
      m.includes(`${fk}: z.string().uuid().optional()`)
        ? m
        : ((changed = true), head + `\n${fkUpdate}\n` + tail),
  );

  return writeIfChanged(tree, modelPath, src3) || changed;
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 3: Drizzle schema (add/normalize FK column — fully idempotent)
────────────────────────────────────────────────────────────────────────── */
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

  // Ensure parent import (idempotent)
  const importLine = `import { ${parentPlural}Table } from './schema.${parentPlural}';`;
  const src0 = insertImportSafely(src, importLine);
  if (src0 !== src) {
    src = src0;
    changed = true;
  }

  // Find pgTable block
  const tb = findPgTableBlock(src, childPlural);
  if (!tb)
    throw new Error(
      `Could not find pgTable('${childPlural}', { ... }) in ${schemaPath}`,
    );

  const fkSnake = snake(fk);

  // Canonical FK property (indent added later)
  const canonicalCore =
    `${fkSnake}: uuid('${fkSnake}')` +
    (required ? `.notNull()` : ``) +
    `.references(() => ${parentPlural}Table.id, { onDelete: '${onDelete}', onUpdate: 'cascade' }),`;

  // Parse object props safely
  const props = splitTopLevelProps(tb.block);

  const idxCreated = props.findIndex((p) => p.name === 'created_at');
  const idxUpdated = props.findIndex((p) => p.name === 'updated_at');
  const idxFk = props.findIndex((p) => p.name === fkSnake);

  // Determine default indent from any prop or 2 spaces
  const defaultIndent =
    props.find((p) => p.indent.trim().length > 0)?.indent ?? '  ';

  const makeCanonicalWithIndent = (indent: string) =>
    `\n${indent}${canonicalCore}\n`;

  let blockNext = tb.block;

  if (idxFk >= 0) {
    // FK exists → normalize (idempotent comparison)
    const prop = props[idxFk];
    const indent = prop.indent || defaultIndent;
    const canonicalWithIndent = makeCanonicalWithIndent(indent);

    // Current prop text should end with comma or newline; ensure like-for-like for compare
    const current = prop.text.endsWith('\n') ? prop.text : prop.text + '\n';

    if (normalizeMin(current) !== normalizeMin(canonicalWithIndent)) {
      blockNext =
        blockNext.slice(0, prop.start) +
        canonicalWithIndent +
        blockNext.slice(prop.end);
      changed = true;
    }
  } else {
    // Insert a single canonical FK prop before created_at, else before updated_at, else at end.
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

    const canon = makeCanonicalWithIndent(insertIndent);
    blockNext =
      tb.block.slice(0, anchorStart) + canon + tb.block.slice(anchorStart);
    changed = true;
  }

  // Cosmetic: collapse 3+ blank lines
  blockNext = blockNext.replace(/\n{3,}/g, '\n\n');

  if (!changed) return false;
  const out = tb.before + blockNext + tb.after;
  return writeIfChanged(tree, schemaPath, out) || changed;
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 4: Repo patch (row type, mapper, selects, insert, update, filters)
────────────────────────────────────────────────────────────────────────── */
function patchRepoPg(
  tree: Tree,
  childSingular: string,
  childPlural: string,
  _parentPlural: string,
  fk: string,
): boolean {
  const file = `libs/server/workbench-api/infra/src/lib/repos/${childSingular}.repo.pg.ts`;
  let src = read(tree, file);
  let changed = false;

  // Ensure table import
  const tableImport = `import { ${childPlural}Table } from '../db/schema.${childPlural}';`;
  if (!src.includes(tableImport)) {
    src = addImportAfterImports(src, tableImport);
    changed = true;
  }

  const fkSnake = snake(fk);
  const Cap = names(childSingular).className;

  // 1) Row type includes fkSnake
  {
    const startTok = `type ${Cap}Row = {`;
    const si = src.indexOf(startTok);
    if (si !== -1) {
      const ei = src.indexOf('};', si);
      if (ei !== -1) {
        const body = src.slice(si + startTok.length, ei);
        if (
          !new RegExp(String.raw`\\b${fkSnake}\\s*:\\s*string\\b`).test(body)
        ) {
          const patched =
            startTok + body + `\n  ${fkSnake}: string;` + src.slice(ei, ei + 2);
          src = src.slice(0, si) + patched + src.slice(ei + 2);
          changed = true;
        }
      }
    }
  }

  // 2) rowToX maps fk -> camel
  {
    const fnStart = `function rowTo${Cap}(row: ${Cap}Row): ${Cap} {`;
    const i = src.indexOf(fnStart);
    if (i !== -1) {
      const rs = src.indexOf('return {', i);
      const re = src.indexOf('};', rs);
      if (rs !== -1 && re !== -1) {
        const obj = src.slice(rs + 'return {'.length, re);
        if (
          !new RegExp(String.raw`\\b${fk}\\s*:\\s*row\\.${fkSnake}\\b`).test(
            obj,
          )
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

  // 3) SELECT objects: add "<fkSnake>: <table>.<fkSnake>" for row-shaped selects
  {
    const selectObjRe = /(\.select\s*\(\s*\{\s*)([\s\S]*?)(\}\s*\))/g;
    src = src.replace(selectObjRe, (m, before, body, after) => {
      const hasTableId = new RegExp(
        String.raw`\\b${childPlural}Table\\.id\\b`,
      ).test(body);
      const hasFk = new RegExp(
        String.raw`\\b${fkSnake}\\s*:\\s*${childPlural}Table\\.${fkSnake}\\b`,
      ).test(body);
      if (!hasTableId || hasFk) return m; // skip aggregates / already done
      changed = true;
      return `${before}${fkSnake}: ${childPlural}Table.${fkSnake}, ${body}${after}`;
    });
  }

  // 4) INSERT .values({ ... }): add "<fkSnake>: data.<fk>"
  {
    const valuesRe = /(\\.values\\s*\\(\\s*\\{)([\\s\\S]*?)(\\}\\s*\\))/m;
    if (valuesRe.test(src)) {
      src = src.replace(valuesRe, (m, head, body, tail) => {
        if (
          new RegExp(String.raw`\\b${fkSnake}\\s*:\\s*data\\.${fk}\\b`).test(
            body,
          )
        )
          return m;
        changed = true;
        return `${head} ${fkSnake}: data.${fk}, ${body} ${tail}`;
      });
    }
  }

  // 5) UPDATE .set({ ... }): conditionally spread fk
  {
    const setRe = /(\\.set\\s*\\(\\s*\\{)([\\s\\S]*?)(\\}\\s*\\))/m;
    if (setRe.test(src)) {
      src = src.replace(setRe, (m, head, body, tail) => {
        if (new RegExp(String.raw`\\b${fkSnake}\\s*:`).test(body)) return m;
        changed = true;
        const add = ` ...(patch.${fk} !== undefined ? { ${fkSnake}: patch.${fk} } : {}), `;
        return `${head}${add}${body}${tail}`;
      });
    }
  }

  // 6) Filters: add key === '<fk>' inside mergedFilters loop
  {
    const loopStartRe =
      /for\s*\(\s*const\s*\[\s*key\s*,\s*val\s*\]\s*of\s*Object\.entries\(\s*mergedFilters\s*\)\s*\)\s*\{/m;
    if (loopStartRe.test(src)) {
      const fkCase = `
      if (key === '${fk}') {
        parts.push(eq(${childPlural}Table.${fkSnake} as any, val as any));
      }`;
      // Only inject once
      if (!new RegExp(String.raw`key\\s*===\\s*['"]${fk}['"]`).test(src)) {
        src = src.replace(loopStartRe, (t) => t + fkCase);
        changed = true;
      }
    }
  }

  return writeIfChanged(tree, file, src) || changed;
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 4.5: Repo tests (generic, idempotent; seeds parent + injects fk)
────────────────────────────────────────────────────────────────────────── */
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

  const parentSingular = singularize(parentPlural);
  const parentIdVar = `${parentSingular}Id`;
  const Cap = names(childSingular).className;
  const repoName = `${Cap}RepoPg`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const parentContract = loadContractJSON(tree, parentSingular);
  const requiredParentFields = parentContract.fields.filter((f) => f.required);

  // import randomUUID (idempotent)
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

  // declare let <parentIdVar>: string;
  if (
    !new RegExp(String.raw`\\blet\\s+${parentIdVar}\\s*:\\s*string\\s*;`).test(
      src,
    )
  ) {
    src = src.replace(
      /(\n)(function plan\()/,
      `\nlet ${parentIdVar}: string;\n$1$2`,
    );
    changed = true;
  }

  // seed parent in beforeEach
  {
    const beRe = /beforeEach\s*\(\s*async\s*\(\)\s*=>\s*\{\s*/m;
    if (beRe.test(src) && !src.includes('@edb begin:seed-parent')) {
      const reqCols = requiredParentFields
        .map((f) => f.fieldName)
        .filter((n) => n !== 'id' && n !== 'createdAt' && n !== 'updatedAt');
      const colsSQL = [`"id"`, ...reqCols.map((n) => `"${snake(n)}"`)].join(
        ', ',
      );

      const valsJS = [
        parentIdVar,
        ...reqCols.map((n) =>
          seedExprForField(
            requiredParentFields.find((f) => f.fieldName === n)!,
          ),
        ),
      ];
      const valuesTemplate = valsJS.map((e) => `\${${e}}`).join(', ');

      const seedBlock = `
  // @edb begin:seed-parent ${parentPlural}
  ${parentIdVar} = randomUUID();
  await db.execute(sql\`DELETE FROM "${parentPlural}";\`);
  await db.execute(sql\`INSERT INTO "${parentPlural}" (${colsSQL}) VALUES (${valuesTemplate})\`);
  // @edb end:seed-parent
`;

      src = src.replace(beRe, (m) => m + seedBlock);
      changed = true;
    }
  }

  // inject <fk>: <parentIdVar> into Repo.create({...})
  {
    const createCallRe = new RegExp(
      `${repoName}\\.create\$begin:math:text$\\\\s*\\\\{([\\\\s\\\\S]*?)\\\\}\\\\s*\\$end:math:text$`,
      'g',
    );
    src = src.replace(createCallRe, (m, obj) => {
      if (new RegExp(String.raw`\\b${fk}\\s*:`).test(obj)) return m;
      changed = true;

      const tryAfterTitle = obj.replace(
        /(title\s*:\s*[^,}]+,?)/,
        `$1\n      ${fk}: ${parentIdVar},`,
      );
      if (tryAfterTitle !== obj) return `${m.replace(obj, tryAfterTitle)}`;

      return `${m.replace(obj, `${fk}: ${parentIdVar}, ${obj}`)}`;
    });
  }

  return writeIfChanged(tree, file, src) || changed;
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 5: Controller clean patch + _includes helper + register.ts
────────────────────────────────────────────────────────────────────────── */
function ensureControllerSignatureAcceptsAdapters(
  src: string,
  capChild: string,
): { next: string; changed: boolean } {
  let changed = false;

  // Make sure RepoAdapters is imported (idempotent)
  const withImport = addImportAfterImports(
    src,
    `import type { RepoAdapters } from '../register';`,
  );
  if (withImport !== src) {
    src = withImport;
    changed = true;
  }

  // Match `export async function register<Cap>Routes(...) : Promise<void> {`
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
): { next: string; changed: boolean } {
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

// TS-safe guards/helpers
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

/** Append adapters to registerXRoutes(...) callsites in register.ts if not present. */
function patchRegisterCallToPassAdapters(
  tree: Tree,
  capChild: string,
): boolean {
  const regPath = 'libs/server/workbench-api/resources/src/lib/register.ts';
  let src = read(tree, regPath);
  let changed = false;

  const callName = `register${capChild}Routes`;
  let from = 0;

  while (true) {
    const callIdx = src.indexOf(callName, from);
    if (callIdx === -1) break;

    const openParenIdx = src.indexOf('(', callIdx + callName.length);
    if (openParenIdx === -1) break;

    // Walk to the matching ')'
    let i = openParenIdx + 1;
    let depth = 1;
    while (i < src.length && depth > 0) {
      const ch = src[i++];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
    }
    if (depth !== 0) break; // unbalanced—bail safely

    const closeParenIdx = i - 1;
    const args = src.slice(openParenIdx + 1, closeParenIdx);

    // if already includes adapters, skip
    if (/\badapters\b/.test(args)) {
      from = closeParenIdx + 1;
      continue;
    }
    const newArgs = args.trim().length ? `${args}, adapters` : `adapters`;
    src = src.slice(0, openParenIdx + 1) + newArgs + src.slice(closeParenIdx);
    changed = true;
    from = openParenIdx + 1 + newArgs.length + 1;
  }

  return writeIfChanged(tree, regPath, src) || changed;
}

/* ──────────────────────────────────────────────────────────────────────────
   Main generator
────────────────────────────────────────────────────────────────────────── */
export default async function generator(tree: Tree, schema: Schema) {
  if (!schema.belongsTo?.trim())
    throw new Error('--belongsTo is required (child:parent)');

  const [childRaw, parentRaw] = schema.belongsTo
    .split(':')
    .map((s) => s.trim());
  const child = names(childRaw).fileName; // plural
  const parent = names(parentRaw).fileName; // plural

  const childSingular = singularize(child);
  const parentSingular = singularize(parent);
  const CapChild = names(childSingular).className;

  const fk = schema.fk?.trim() || `${parentSingular}Id`;
  const includeAlias = schema.include?.trim() || parentSingular;
  const select = schema.select
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? ['id', 'name'];
  const onDelete = schema.onDelete ?? 'cascade'; // default

  let anyChanged = false;

  // 1) Contract (+ derive required)
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

  // 2) Model Zod
  anyChanged =
    patchModelZod(tree, childSingular, CapChild, fk, required) || anyChanged;

  // 3) Drizzle schema (robust, idempotent)
  anyChanged =
    patchDrizzleSchema(tree, child, parent, fk, required, onDelete) ||
    anyChanged;

  // 4) Repo wiring
  anyChanged =
    patchRepoPg(tree, childSingular, child, parent, fk) || anyChanged;

  // 4.5) Tests (generic/no-op if not safe)
  anyChanged =
    patchRepoSpecForFk(tree, childSingular, parent, fk) || anyChanged;

  // 5) Controller + includes helper + register.ts
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

  if (anyChanged) {
    await formatFiles(tree);
  }

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
