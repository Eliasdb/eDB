// import { Tree, formatFiles, joinPathFragments, names } from '@nx/devkit';
// import { parseFields, type ParsedField } from '../workbench-api-feature/utils';

// type Schema = {
//   name: string; // plural, e.g. "albums"
//   fields: string; // e.g. "title:string,authorId:uuid,status:enum(draft|published|archived),publishedYear?:number"
// };

// const snake = (s: string) =>
//   s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
// const singularize = (s: string) => (s.endsWith('s') ? s.slice(0, -1) : s);

// // ─────────────────────────────────────────────
// // Column helpers
// // ─────────────────────────────────────────────

// function drizzleColLine(_entity: string, f: ParsedField) {
//   const col = snake(f.fieldName);
//   const nn = f.required ? '.notNull()' : '';
//   if (f.zodBase.includes('.datetime()'))
//     return `${col}: timestamp('${col}', { withTimezone: true })${nn},`;
//   if (f.tsType === 'boolean') return `${col}: boolean('${col}')${nn},`;
//   if (f.tsType === 'number') return `${col}: integer('${col}')${nn},`;
//   if (f.tsType === 'string' && f.fieldName.endsWith('Id'))
//     return `${col}: uuid('${col}')${nn},`;
//   if (f.tsType === 'string') return `${col}: text('${col}')${nn},`;
//   if (f.tsType.includes("'"))
//     return `// enum column wired below\n${col}: ${col}Enum('${col}')${nn},`;
//   return `${col}: text('${col}')${nn},`;
// }

// function enumBlock(f: ParsedField) {
//   if (!f.tsType.includes("'")) return '';
//   const col = snake(f.fieldName);
//   const variants = f.tsType.split('|').map((v) => v.trim().replace(/'/g, ''));
//   return `const ${col}Enum = pgEnum('${col}_enum', [${variants
//     .map((v) => `'${v}'`)
//     .join(', ')}]);`;
// }

// // ─────────────────────────────────────────────
// // Repo helpers (search/filter/sort like Books)
// // ─────────────────────────────────────────────

// function buildWhereHelper(plural: string, fields: ParsedField[]) {
//   const table = `${plural}Table`;
//   const searchable = fields.filter(
//     (f) =>
//       f.tsType === 'string' ||
//       f.tsType.includes("'") || // enums
//       f.zodBase.includes('.datetime()'),
//   );

//   const lines: string[] = [];
//   lines.push(
//     `function buildWhere({ search, mergedFilters }: { search?: string; mergedFilters: Record<string, string>; }): SQL | undefined {`,
//   );
//   lines.push(`  const parts: SQL[] = [];`);

//   if (searchable.length > 0) {
//     lines.push(`  if (search && search.trim() !== '') {`);
//     lines.push(`    const q = '%' + search.toLowerCase() + '%';`);
//     lines.push(`    const ors: SQL[] = [];`);
//     for (const f of searchable) {
//       const col = `${table}.${snake(f.fieldName)}`;
//       // Datetimes, enums, and UUIDs must cast to text for lower()/like
//       if (f.zodBase.includes('.datetime()')) {
//         lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
//       } else if (f.tsType.includes("'")) {
//         lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
//       } else if (f.tsType === 'string' && f.fieldName.endsWith('Id')) {
//         lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
//       } else {
//         lines.push(`    ors.push(like(sql\`lower(\${${col}})\`, q));`);
//       }
//     }
//     lines.push(`    if (ors.length === 1) {`);
//     lines.push(`      parts.push(ors[0]);`);
//     lines.push(`    } else if (ors.length > 1) {`);
//     // IMPORTANT: fold with sql-template, not drizzle or(), to keep type SQL
//     lines.push(
//       `      const disj = ors.slice(1).reduce<SQL>((acc, cur) => sql\`(\${acc}) OR (\${cur})\`, ors[0]);`,
//     );
//     lines.push(`      parts.push(disj);`);
//     lines.push(`    }`);
//     lines.push(`  }`);
//   }

//   // exact filters
//   lines.push(`  for (const [key, val] of Object.entries(mergedFilters)) {`);
//   for (const f of fields) {
//     const col = `${table}.${snake(f.fieldName)}`;
//     const k = f.fieldName;
//     lines.push(`    if (key === '${k}') {`);
//     if (f.tsType === 'number') {
//       lines.push(
//         `      const n = Number(val); if (!Number.isNaN(n)) parts.push(eq(${col}, n));`,
//       );
//     } else if (f.tsType === 'boolean') {
//       lines.push(`      parts.push(eq(${col}, val === 'true'));`);
//     } else if (f.zodBase.includes('.datetime()')) {
//       lines.push(
//         `      const d = new Date(val); if (!Number.isNaN(d.getTime())) parts.push(eq(${col}, d));`,
//       );
//     } else if (f.tsType.includes("'")) {
//       // enum: cast to any so it compiles even with pgEnum
//       lines.push(`      parts.push(eq(${col} as any, val as any));`);
//     } else if (f.tsType === 'string' && f.fieldName.endsWith('Id')) {
//       // UUID exact match still compares UUID → no cast
//       lines.push(`      parts.push(eq(${col}, val));`);
//     } else {
//       lines.push(`      parts.push(eq(${col}, val));`);
//     }
//     lines.push(`    }`);
//   }
//   lines.push(`  }`);
//   lines.push(`  return parts.length ? and(...parts) : undefined;`);
//   lines.push(`}`);
//   return lines.join('\n');
// }

// function buildOrderHelper(plural: string, fields: ParsedField[]) {
//   const table = `${plural}Table`;
//   const lines: string[] = [];
//   lines.push(
//     `function buildOrder(plan: PaginationPlan): { orderByExpr: AnyColumn; orderDir: 'asc' | 'desc' } {`,
//   );
//   lines.push(`  let orderByExpr: AnyColumn = ${table}.created_at;`);
//   lines.push(`  let orderDir: 'asc' | 'desc' = 'asc';`);
//   lines.push(`  if (plan.sorters.length > 0) {`);
//   lines.push(`    const { field, dir } = plan.sorters[0];`);
//   lines.push(`    orderDir = dir;`);
//   lines.push(
//     `    if (field === 'createdAt') orderByExpr = ${table}.created_at;`,
//   );
//   lines.push(
//     `    if (field === 'updatedAt') orderByExpr = ${table}.updated_at;`,
//   );
//   for (const f of fields) {
//     lines.push(
//       `    if (field === '${f.fieldName}') orderByExpr = ${table}.${snake(f.fieldName)};`,
//     );
//   }
//   lines.push(`  }`);
//   lines.push(`  return { orderByExpr, orderDir };`);
//   lines.push(`}`);
//   return lines.join('\n');
// }

// function rowTypeDef(Cap: string, fields: ParsedField[]) {
//   const mapDbTs = (f: ParsedField): string => {
//     if (f.zodBase.includes('.datetime()'))
//       return f.required ? 'Date' : 'Date | null';
//     if (f.tsType === 'number') return f.required ? 'number' : 'number | null';
//     if (f.tsType === 'boolean')
//       return f.required ? 'boolean' : 'boolean | null';
//     if (f.tsType.includes("'")) return 'string'; // enums materialize as string
//     return f.required ? 'string' : 'string | null'; // strings & uuids
//   };

//   const fieldLines = fields
//     .map((f) => `  ${snake(f.fieldName)}: ${mapDbTs(f)};`)
//     .join('\n');

//   return `type ${Cap}Row = {
//   id: string;
// ${fieldLines}
//   created_at: Date;
//   updated_at: Date;
// };`;
// }

// function rowToModelFn(Cap: string, _plural: string, fields: ParsedField[]) {
//   const body = [
//     `id: row.id,`,
//     ...fields.map((f) => {
//       const src = `row.${snake(f.fieldName)}`;
//       if (f.zodBase.includes('.datetime()')) {
//         return `    ${f.fieldName}: ${src} ? ${src}.toISOString() : undefined,`;
//       }
//       if (f.tsType === 'number' || f.tsType === 'boolean') {
//         return f.required
//           ? `    ${f.fieldName}: ${src},`
//           : `    ${f.fieldName}: ${src} ?? undefined,`;
//       }
//       if (f.tsType.includes("'")) {
//         return f.required
//           ? `    ${f.fieldName}: ${src} as ${Cap}['${f.fieldName}'],`
//           : `    ${f.fieldName}: (${src} ?? undefined) as ${Cap}['${f.fieldName}'] | undefined,`;
//       }
//       return f.required
//         ? `    ${f.fieldName}: ${src},`
//         : `    ${f.fieldName}: ${src} ?? undefined,`;
//     }),
//     `createdAt: row.created_at.toISOString(),`,
//     `updatedAt: row.updated_at.toISOString(),`,
//   ].join('\n');

//   return `function rowTo${Cap}(row: ${Cap}Row): ${Cap} {
//   return {
//     ${body}
//   };
// }`;
// }

// function loadFieldsFromContract(tree: Tree, singular: string): ParsedField[] {
//   const p = `libs/server/workbench-api/models/src/contracts/${singular}.contract.json`;
//   if (!tree.exists(p)) {
//     throw new Error(
//       `No contract found for "${singular}". Either pass --fields or generate the model first. Missing: ${p}`,
//     );
//   }
//   const json = JSON.parse(tree.read(p, 'utf-8')!);
//   return json.fields as ParsedField[];
// }

// // ─────────────────────────────────────────────
// // Safe patching of drizzle.ts and resources-pg
// // ─────────────────────────────────────────────

// function addImportOnce(txt: string, importLine: string): string {
//   if (txt.includes(importLine)) return txt;
//   const lines = txt.split('\n');
//   let last = -1;
//   for (let i = 0; i < lines.length; i++) {
//     if (/from '\.\/schema\.[a-z]+';/.test(lines[i])) last = i;
//   }
//   lines.splice(last + 1, 0, importLine);
//   return lines.join('\n');
// }

// function insertIdentInObjectBlock(
//   src: string,
//   startMarker: string,
//   identToAdd: string,
// ): string {
//   const idx = src.indexOf(startMarker);
//   if (idx === -1) return src;
//   const braceStart = src.indexOf('{', idx);
//   if (braceStart === -1) return src;

//   let i = braceStart + 1;
//   let depth = 1;
//   while (i < src.length && depth > 0) {
//     if (src[i] === '{') depth++;
//     else if (src[i] === '}') depth--;
//     i++;
//   }
//   const braceEnd = i - 1;
//   if (braceEnd <= braceStart) return src;

//   const inner = src.slice(braceStart + 1, braceEnd);
//   const items: string[] = inner
//     .split(',')
//     .map((s: string) => s.trim())
//     .filter((s: string) => s.length > 0);

//   if (!items.includes(identToAdd)) items.push(identToAdd);

//   const pretty = '\n    ' + items.join(',\n    ') + ',\n  ';
//   return src.slice(0, braceStart + 1) + pretty + src.slice(braceEnd);
// }

// function patchDrizzle(tree: Tree, plural: string) {
//   const p = 'libs/server/workbench-api/infra/src/lib/db/drizzle.ts';
//   if (!tree.exists(p)) return;
//   let txt = tree.read(p, 'utf-8') ?? '';

//   txt = addImportOnce(
//     txt,
//     `import { ${plural}Table } from './schema.${plural}';`,
//   );
//   txt = insertIdentInObjectBlock(txt, 'schema:', `${plural}Table`);
//   txt = insertIdentInObjectBlock(
//     txt,
//     'export const schema =',
//     `${plural}Table`,
//   );
//   txt = txt.replace(/,,/g, ',');

//   tree.write(p, txt);
// }

// function patchResourcesPgRegistry(tree: Tree, singular: string, Cap: string) {
//   const p = 'libs/server/workbench-api/resources-pg/src/lib/index.ts';
//   if (!tree.exists(p)) return;
//   let txt = tree.read(p, 'utf-8') ?? '';

//   const importRe =
//     /import\s+\{\s*([^}]+)\s*\}\s+from '@edb-workbench\/api\/infra';/;
//   if (importRe.test(txt)) {
//     txt = txt.replace(importRe, (_m, names: string) => {
//       const parts = names
//         .split(',')
//         .map((s: string) => s.trim())
//         .filter((s: string) => s.length > 0);
//       const want = `${Cap}RepoPg`;
//       if (!parts.includes(want)) parts.push(want);
//       return `import { ${parts.join(', ')} } from '@edb-workbench/api/infra';`;
//     });
//   } else {
//     txt = `import { ${Cap}RepoPg } from '@edb-workbench/api/infra';\n` + txt;
//   }

//   const makeRe = /makeRouteRegistry\s*\(\s*\{\s*([\s\S]*?)\}\s*\)/m;
//   if (makeRe.test(txt)) {
//     txt = txt.replace(makeRe, (_m, inner: string) => {
//       const lines = inner
//         .split('\n')
//         .map((s: string) => s.trim())
//         .filter((s: string) => s.length > 0);
//       const entry = `${singular}: ${Cap}RepoPg,`;
//       if (!lines.some((l) => l.startsWith(`${singular}:`))) lines.push(entry);
//       const pretty = '\n    ' + lines.join('\n    ') + '\n  ';
//       return `makeRouteRegistry({${pretty}})`;
//     });
//   }

//   tree.write(p, txt);
// }

// // ─────────────────────────────────────────────
// // MAIN
// // ─────────────────────────────────────────────

// export default async function generator(tree: Tree, schema: Schema) {
//   if (!schema.name?.trim()) throw new Error('--name is required');
//   if (!schema.fields?.trim()) throw new Error('--fields is required');

//   const n = names(schema.name.trim());
//   const plural = n.fileName; // albums
//   const singular = singularize(plural); // album
//   const Cap = names(singular).className; // Album
//   // const fields = parseFields(schema.fields);

//   const fields: ParsedField[] = schema.fields?.trim()
//     ? parseFields(schema.fields)
//     : loadFieldsFromContract(tree, singular);

//   const infraRoot = 'libs/server/workbench-api/infra';
//   const dbDir = joinPathFragments(infraRoot, 'src/lib/db');
//   const repoDir = joinPathFragments(infraRoot, 'src/lib/repos');
//   const schemaFile = joinPathFragments(dbDir, `schema.${plural}.ts`);
//   const repoFile = joinPathFragments(repoDir, `${singular}.repo.pg.ts`);
//   const infraIndexPath = joinPathFragments(infraRoot, 'src/index.ts');

//   if (!tree.exists(dbDir)) tree.write(joinPathFragments(dbDir, '.gitkeep'), '');
//   if (!tree.exists(repoDir))
//     tree.write(joinPathFragments(repoDir, '.gitkeep'), '');

//   // 1) Drizzle schema
//   if (!tree.exists(schemaFile)) {
//     const enumDefs = fields.map(enumBlock).filter(Boolean).join('\n');
//     const cols = [
//       `id: uuid('id').primaryKey().defaultRandom(),`,
//       ...fields.map((f) => drizzleColLine(singular, f)),
//       `created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),`,
//       `updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),`,
//     ].join('\n  ');

//     const content = `import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
// ${enumDefs ? '\n' + enumDefs + '\n' : ''}
// export const ${plural}Table = pgTable('${plural}', {
//   ${cols}
// });
// `;
//     tree.write(schemaFile, content);
//   }

//   // 2) PG repo (Books-style) with safe where + typed row mapping
//   if (!tree.exists(repoFile)) {
//     const selectBlock = `{
//         id: ${plural}Table.id,
// ${fields.map((f) => `        ${snake(f.fieldName)}: ${plural}Table.${snake(f.fieldName)},`).join('\n')}
//         created_at: ${plural}Table.created_at,
//         updated_at: ${plural}Table.updated_at
//       }`;

//     const repo = `import {
//   and, asc, desc, eq, like, sql,
//   type AnyColumn, type SQL
// } from 'drizzle-orm';

// import { db } from '../db/drizzle';
// import { ${plural}Table } from '../db/schema.${plural}';

// import type { ${Cap}, ${Cap}Repo } from '@edb-workbench/api/models';
// import type { PaginationPlan } from '@edb-workbench/api/shared';

// ${rowTypeDef(Cap, fields)}

// ${rowToModelFn(Cap, plural, fields)}

// ${buildWhereHelper(plural, fields)}

// ${buildOrderHelper(plural, fields)}

// export const ${Cap}RepoPg: ${Cap}Repo = {
//   async list(args) {
//     const { plan, search, filter } = args;
//     const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
//     const whereExpr = buildWhere({ search, mergedFilters });
//     const whereSql = whereExpr ?? sql\`true\`;
//     const { orderByExpr, orderDir } = buildOrder(plan);

//     const totalResult = await db
//       .select({ cnt: sql<number>\`count(*)::int\` })
//       .from(${plural}Table)
//       .where(whereSql);
//     const total = totalResult[0]?.cnt ?? 0;

//     const rows = await db
//       .select(${selectBlock})
//       .from(${plural}Table)
//       .where(whereSql)
//       .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
//       .limit(plan.limit)
//       .offset(plan.offset);

//     return { rows: rows.map(rowTo${Cap}), total };
//   },

//   async getById(id) {
//     const rows = await db
//       .select(${selectBlock})
//       .from(${plural}Table)
//       .where(eq(${plural}Table.id, id))
//       .limit(1);
//     return rows[0] ? rowTo${Cap}(rows[0] as ${Cap}Row) : undefined;
//   },

//   async create(data) {
//     const inserted = await db
//       .insert(${plural}Table)
//       .values({
// ${fields
//   .map((f) => {
//     const c = snake(f.fieldName);
//     if (f.zodBase.includes('.datetime()'))
//       return `        ${c}: data.${f.fieldName} ? new Date(data.${f.fieldName}) : null,`;
//     return `        ${c}: ${f.required ? `data.${f.fieldName}` : `data.${f.fieldName} ?? null`},`;
//   })
//   .join('\n')}
//         created_at: sql\`now()\`,
//         updated_at: sql\`now()\`,
//       })
//       .returning();
//     return rowTo${Cap}(inserted[0] as ${Cap}Row);
//   },

//   async update(id, patch) {
//     const updated = await db
//       .update(${plural}Table)
//       .set({
// ${fields
//   .map((f) => {
//     const c = snake(f.fieldName);
//     const v = f.zodBase.includes('.datetime()')
//       ? `(patch.${f.fieldName} ? new Date(patch.${f.fieldName}) : undefined)`
//       : `patch.${f.fieldName}`;
//     return `        ...(patch.${f.fieldName} !== undefined ? { ${c}: ${v} } : {}),`;
//   })
//   .join('\n')}
//         updated_at: sql\`now()\`,
//       })
//       .where(eq(${plural}Table.id, id))
//       .returning();
//     return updated[0] ? rowTo${Cap}(updated[0] as ${Cap}Row) : undefined;
//   },

//   async delete(id) {
//     const del = await db
//       .delete(${plural}Table)
//       .where(eq(${plural}Table.id, id))
//       .returning({ id: ${plural}Table.id });
//     return !!del[0];
//   },
// };
// `;
//     tree.write(repoFile, repo);
//   }

//   emitRepoSpec(tree, {
//     infraRoot,
//     plural,
//     singular,
//     Cap,
//     fields,
//   });

//   // 3) ensure infra exports
//   let idx = tree.exists(infraIndexPath)
//     ? tree.read(infraIndexPath, 'utf-8')!
//     : '';
//   const exSchema = `export * from './lib/db/schema.${plural}';`;
//   const exRepo = `export * from './lib/repos/${singular}.repo.pg';`;
//   if (!idx.includes(exSchema))
//     idx += (idx.endsWith('\n') ? '' : '\n') + exSchema + '\n';
//   if (!idx.includes(exRepo)) idx += exRepo + '\n';
//   tree.write(infraIndexPath, idx);

//   // 4) patch drizzle + resources-pg registry
//   patchDrizzle(tree, plural);
//   patchResourcesPgRegistry(tree, singular, Cap);

//   await formatFiles(tree);
//   console.info(`[workbench-api-infra] OK → ${plural}`);
// }

// function emitRepoSpec(
//   tree: import('@nx/devkit').Tree,
//   opts: {
//     infraRoot: string;
//     plural: string; // e.g. "albums"
//     singular: string; // e.g. "album"
//     Cap: string; // e.g. "Album"
//     fields: ParsedField[];
//   },
// ) {
//   const { infraRoot, plural, singular, Cap, fields } = opts;

//   // tests folder directly under repos/
//   const testDir = `${infraRoot}/src/lib/repos/tests`;
//   const specPath = `${testDir}/${singular}.repo.pg.spec.ts`;

//   if (tree.exists(specPath)) return; // don't overwrite

//   const stringField = fields.find((f) => f.tsType === 'string')?.fieldName;
//   const enumField = fields.find((f) => f.tsType.includes("'"))?.fieldName;
//   const numberField = fields.find((f) => f.tsType === 'number')?.fieldName;

//   const searchBlock = stringField
//     ? `
//     // SEARCH: should match only "${stringField}" containing 'zz'
//     {
//       const { rows, total } = await ${Cap}RepoPg.list({
//         plan: plan(),
//         search: 'zz',
//       });
//       expect(total).toBeGreaterThanOrEqual(1);
//       expect(rows.some(r => r.${stringField}.toLowerCase().includes('zz'))).toBe(true);
//     }
//   `
//     : `// (no string field → search test skipped)`;

//   const filterBlock =
//     enumField || stringField || numberField
//       ? `
//     // FILTER: by 1 field
//     {
//       const { rows, total } = await ${Cap}RepoPg.list({
//         plan: plan({ filters: {
//           ${
//             enumField
//               ? `${enumField}: row1.${enumField}`
//               : stringField
//                 ? `${stringField}: row1.${stringField}`
//                 : `${numberField}: String(row1.${numberField})`
//           }
//         }}),
//       });
//       expect(total).toBeGreaterThanOrEqual(1);
//       expect(rows.some(r => r.id === row1.id)).toBe(true);
//     }
//   `
//       : `// (no filterable field → filter test skipped)`;

//   const sortField = stringField ?? numberField ?? 'createdAt';
//   const sortBlock = `
//     // SORT: by ${sortField} desc, check consistent desc order
//     {
//       const { rows } = await ${Cap}RepoPg.list({
//         plan: plan({ sorters: [{ field: '${sortField}', dir: 'desc' }], limit: 10, offset: 0 }),
//       });
//       const proj = rows.map(r => r.${sortField});
//       const copy = [...proj].sort((a,b) => (a > b ? -1 : a < b ? 1 : 0));
//       expect(proj).toEqual(copy);
//     }
//   `;

//   const makeCreate = (idx: number) => {
//     const lines: string[] = [];
//     for (const f of fields) {
//       const k = f.fieldName;
//       if (f.zodBase.includes('.datetime()')) {
//         lines.push(
//           `${k}: ${f.required ? `new Date().toISOString()` : `undefined`},`,
//         );
//       } else if (f.tsType === 'string') {
//         const val =
//           k.toLowerCase().includes('title') || k.toLowerCase().includes('name')
//             ? `'name-${idx}-zz'`
//             : `'str-${k}-${idx}'`;
//         lines.push(`${k}: ${f.required ? val : `undefined`},`);
//       } else if (f.tsType === 'number') {
//         lines.push(`${k}: ${f.required ? idx : `undefined`},`);
//       } else if (f.tsType === 'boolean') {
//         lines.push(
//           `${k}: ${f.required ? (idx % 2 === 0 ? 'true' : 'false') : `undefined`},`,
//         );
//       } else if (f.tsType.includes("'")) {
//         const variant = f.tsType.split('|')[0]!.trim().replace(/'/g, '');
//         lines.push(`${k}: ${f.required ? `'${variant}'` : `undefined`},`);
//       }
//     }
//     return lines.join('\n      ');
//   };

//   const content = `import { sql } from 'drizzle-orm';
// import { beforeEach, describe, expect, it } from 'vitest';

// import { db } from '../../db/drizzle';
// import { ${Cap}RepoPg } from '../../repos/${singular}.repo.pg';

// import type { PaginationPlan } from '@edb-workbench/api/shared';

// function plan(overrides: Partial<PaginationPlan> = {}): PaginationPlan {
//   return { page: 1, pageSize: 10, offset: 0, limit: 10, sorters: [], filters: {}, ...overrides };
// }

// describe.sequential('${Cap}RepoPg (infra ↔ db)', () => {
//   beforeEach(async () => {
//     await db.execute(sql\`DELETE FROM "${plural}";\`);
//   });

//   it('create/get/update/delete basic flow', async () => {
//     const row1 = await ${Cap}RepoPg.create({
//       ${makeCreate(1)}
//     });
//     expect(row1.id).toBeTruthy();

//     const fetched = await ${Cap}RepoPg.getById(row1.id);
//     expect(fetched?.id).toBe(row1.id);

//     const patched = await ${Cap}RepoPg.update(row1.id, {});
//     expect(patched?.id).toBe(row1.id);

//     const ok = await ${Cap}RepoPg.delete(row1.id);
//     expect(ok).toBe(true);

//     const missing = await ${Cap}RepoPg.getById(row1.id);
//     expect(missing).toBeUndefined();
//   });

//   it('list(): pagination + search/filter/sort (when applicable)', async () => {
//     const row1 = await ${Cap}RepoPg.create({ ${makeCreate(1)} });
//     const row2 = await ${Cap}RepoPg.create({ ${makeCreate(2)} });
//     const row3 = await ${Cap}RepoPg.create({ ${makeCreate(3)} });

//     // PAGINATION smoke
//     {
//       const { rows, total } = await ${Cap}RepoPg.list({ plan: plan({ limit: 1, pageSize: 1 }) });
//       expect(rows.length).toBe(1);
//       expect(total).toBeGreaterThanOrEqual(3);
//     }

//     ${searchBlock}

//     ${filterBlock}

//     ${sortBlock}
//   });
// });
// `;

//   tree.write(specPath, content);
// }

import { Tree, formatFiles, joinPathFragments, names } from '@nx/devkit';
import { parseFields, type ParsedField } from '../_workbench-api-feature/utils';

type Schema = {
  name: string; // plural, e.g. "albums"
  fields?: string; // optional; if omitted we'll read the model contract JSON
  revert?: boolean; // NEW: undo what this generator created
};

const snake = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
const singularize = (s: string) => (s.endsWith('s') ? s.slice(0, -1) : s);
const pascal = (s: string) =>
  s
    .replace(/[_-]/g, ' ')
    .replace(/(?:^|\s)([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/\s+/g, '');
const enumConstName = (plural: string, fieldName: string) =>
  `${pascal(plural)}${pascal(fieldName)}Enum`;

/* ─────────────────────────────────────────────
   Contract loader
────────────────────────────────────────────── */
function loadFieldsStringFromContract(
  tree: Tree,
  singular: string,
): string | undefined {
  const contractPath = `libs/server/workbench-api/models/src/contracts/${singular}.contract.json`;
  if (!tree.exists(contractPath)) return undefined;

  try {
    const raw = tree.read(contractPath, 'utf-8');
    if (!raw) return undefined;
    const json = JSON.parse(raw) as {
      fieldsString?: string;
      fields?: Array<{
        fieldName: string;
        required: boolean;
        tsType: string;
        zodBase: string;
      }>;
    };

    if (json.fieldsString && json.fieldsString.trim().length > 0) {
      return json.fieldsString.trim();
    }

    if (Array.isArray(json.fields) && json.fields.length > 0) {
      const pieces = json.fields.map((f) => {
        const name = f.fieldName;
        const isOptional = !f.required;
        const z = f.zodBase || '';
        let typeToken = 'string';

        if (z.includes('.uuid()')) typeToken = 'uuid';
        else if (z.startsWith('z.enum(')) {
          const inside = z.match(/z\.enum\(\s*\[([^\]]+)\]\s*\)/);
          if (inside?.[1]) {
            const variants = inside[1]
              .split(',')
              .map((s) => s.trim().replace(/^'|'$/g, ''))
              .join('|');
            typeToken = `enum(${variants})`;
          }
        } else if (z.startsWith('z.number()')) typeToken = 'number';
        else if (z.startsWith('z.boolean()')) typeToken = 'boolean';
        else if (z.includes('.datetime()')) typeToken = 'date';

        return `${name}${isOptional ? '?' : ''}:${typeToken}`;
      });

      return pieces.join(',');
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/* ─────────────────────────────────────────────
   Column helpers
────────────────────────────────────────────── */
function drizzleColLine(plural: string, f: ParsedField) {
  const col = snake(f.fieldName);
  const nn = f.required ? '.notNull()' : '';
  if (f.zodBase.includes('.datetime()'))
    return `${col}: timestamp('${col}', { withTimezone: true })${nn},`;
  if (f.tsType === 'boolean') return `${col}: boolean('${col}')${nn},`;
  if (f.tsType === 'number') return `${col}: integer('${col}')${nn},`;
  if (f.tsType === 'string' && f.fieldName.endsWith('Id'))
    return `${col}: uuid('${col}')${nn},`;
  if (f.tsType === 'string') return `${col}: text('${col}')${nn},`;
  if (f.tsType.includes("'")) {
    const constName = enumConstName(plural, f.fieldName);
    return `// enum column wired below
${col}: ${constName}('${col}')${nn},`;
  }
  return `${col}: text('${col}')${nn},`;
}

function enumBlock(plural: string, f: ParsedField) {
  if (!f.tsType.includes("'")) return '';
  const colSnake = snake(f.fieldName);
  const constName = enumConstName(plural, f.fieldName);
  const variants = f.tsType.split('|').map((v) => v.trim().replace(/'/g, ''));
  const sqlTypeName = `${plural}_${colSnake}_enum`;
  return `export const ${constName} = pgEnum('${sqlTypeName}', [${variants
    .map((v) => `'${v}'`)
    .join(', ')}]);`;
}

/* ─────────────────────────────────────────────
   Repo helpers (search/filter/sort like Books)
────────────────────────────────────────────── */
function buildWhereHelper(plural: string, fields: ParsedField[]) {
  const table = `${plural}Table`;
  const searchable = fields.filter(
    (f) =>
      f.tsType === 'string' ||
      f.tsType.includes("'") ||
      f.zodBase.includes('.datetime()'),
  );

  const lines: string[] = [];
  lines.push(
    `function buildWhere({ search, mergedFilters }: { search?: string; mergedFilters: Record<string, string>; }): SQL | undefined {`,
  );
  lines.push(`  const parts: SQL[] = [];`);

  if (searchable.length > 0) {
    lines.push(`  if (search && search.trim() !== '') {`);
    lines.push(`    const q = '%' + search.toLowerCase() + '%';`);
    lines.push(`    const ors: SQL[] = [];`);
    for (const f of searchable) {
      const col = `${table}.${snake(f.fieldName)}`;
      if (f.zodBase.includes('.datetime()')) {
        lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
      } else if (f.tsType.includes("'")) {
        lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
      } else if (f.tsType === 'string' && f.fieldName.endsWith('Id')) {
        lines.push(`    ors.push(like(sql\`lower(\${${col}}::text)\`, q));`);
      } else {
        lines.push(`    ors.push(like(sql\`lower(\${${col}})\`, q));`);
      }
    }
    lines.push(`    if (ors.length === 1) {`);
    lines.push(`      parts.push(ors[0]);`);
    lines.push(`    } else if (ors.length > 1) {`);
    lines.push(
      `      const disj = ors.slice(1).reduce<SQL>((acc, cur) => sql\`(\${acc}) OR (\${cur})\`, ors[0]);`,
    );
    lines.push(`      parts.push(disj);`);
    lines.push(`    }`);
    lines.push(`  }`);
  }

  lines.push(`  for (const [key, val] of Object.entries(mergedFilters)) {`);
  for (const f of fields) {
    const col = `${table}.${snake(f.fieldName)}`;
    const k = f.fieldName;
    lines.push(`    if (key === '${k}') {`);
    if (f.tsType === 'number') {
      lines.push(
        `      const n = Number(val); if (!Number.isNaN(n)) parts.push(eq(${col}, n));`,
      );
    } else if (f.tsType === 'boolean') {
      lines.push(`      parts.push(eq(${col}, val === 'true'));`);
    } else if (f.zodBase.includes('.datetime()')) {
      lines.push(
        `      const d = new Date(val); if (!Number.isNaN(d.getTime())) parts.push(eq(${col}, d));`,
      );
    } else if (f.tsType.includes("'")) {
      lines.push(`      parts.push(eq(${col} as any, val as any));`);
    } else if (f.tsType === 'string' && f.fieldName.endsWith('Id')) {
      lines.push(`      parts.push(eq(${col}, val));`);
    } else {
      lines.push(`      parts.push(eq(${col}, val));`);
    }
    lines.push(`    }`);
  }
  lines.push(`  }`);
  lines.push(`  return parts.length ? and(...parts) : undefined;`);
  lines.push(`}`);
  return lines.join('\n');
}

function buildOrderHelper(plural: string, fields: ParsedField[]) {
  const table = `${plural}Table`;
  const lines: string[] = [];
  lines.push(
    `function buildOrder(plan: PaginationPlan): { orderByExpr: AnyColumn; orderDir: 'asc' | 'desc' } {`,
  );
  lines.push(`  let orderByExpr: AnyColumn = ${table}.created_at;`);
  lines.push(`  let orderDir: 'asc' | 'desc' = 'asc';`);
  lines.push(`  if (plan.sorters.length > 0) {`);
  lines.push(`    const { field, dir } = plan.sorters[0];`);
  lines.push(`    orderDir = dir;`);
  lines.push(
    `    if (field === 'createdAt') orderByExpr = ${table}.created_at;`,
  );
  lines.push(
    `    if (field === 'updatedAt') orderByExpr = ${table}.updated_at;`,
  );
  for (const f of fields) {
    lines.push(
      `    if (field === '${f.fieldName}') orderByExpr = ${table}.${snake(f.fieldName)};`,
    );
  }
  lines.push(`  }`);
  lines.push(`  return { orderByExpr, orderDir };`);
  lines.push(`}`);
  return lines.join('\n');
}

function rowTypeDef(Cap: string, fields: ParsedField[]) {
  const mapDbTs = (f: ParsedField): string => {
    if (f.zodBase.includes('.datetime()'))
      return f.required ? 'Date' : 'Date | null';
    if (f.tsType === 'number') return f.required ? 'number' : 'number | null';
    if (f.tsType === 'boolean')
      return f.required ? 'boolean' : 'boolean | null';
    if (f.tsType.includes("'")) return 'string';
    return f.required ? 'string' : 'string | null';
  };

  const fieldLines = fields
    .map((f) => `  ${snake(f.fieldName)}: ${mapDbTs(f)};`)
    .join('\n');

  return `type ${Cap}Row = {
  id: string;
${fieldLines}
  created_at: Date;
  updated_at: Date;
};`;
}

function rowToModelFn(Cap: string, _plural: string, fields: ParsedField[]) {
  const body = [
    `id: row.id,`,
    ...fields.map((f) => {
      const src = `row.${snake(f.fieldName)}`;
      if (f.zodBase.includes('.datetime()')) {
        return `    ${f.fieldName}: ${src} ? ${src}.toISOString() : undefined,`;
      }
      if (f.tsType === 'number' || f.tsType === 'boolean') {
        return f.required
          ? `    ${f.fieldName}: ${src},`
          : `    ${f.fieldName}: ${src} ?? undefined,`;
      }
      if (f.tsType.includes("'")) {
        return f.required
          ? `    ${f.fieldName}: ${src} as ${Cap}['${f.fieldName}'],`
          : `    ${f.fieldName}: (${src} ?? undefined) as ${Cap}['${f.fieldName}'] | undefined,`;
      }
      return f.required
        ? `    ${f.fieldName}: ${src},`
        : `    ${f.fieldName}: ${src} ?? undefined,`;
    }),
    `createdAt: row.created_at.toISOString(),`,
    `updatedAt: row.updated_at.toISOString(),`,
  ].join('\n');

  return `function rowTo${Cap}(row: ${Cap}Row): ${Cap} {
  return {
    ${body}
  };
}`;
}

/* ─────────────────────────────────────────────
   drizzle.ts & resources-pg patch helpers
────────────────────────────────────────────── */
function addImportOnce(txt: string, importLine: string): string {
  if (txt.includes(importLine)) return txt;
  const lines = txt.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/from '\.\/schema\.[a-z]+';/.test(lines[i])) last = i;
  }
  lines.splice(last + 1, 0, importLine);
  return lines.join('\n');
}

function removeExactImportLine(txt: string, importLine: string): string {
  const re = new RegExp(
    '^' + importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\n?',
    'm',
  );
  return txt.replace(re, '');
}

function insertIdentInObjectBlock(
  src: string,
  startMarker: string,
  identToAdd: string,
): string {
  const idx = src.indexOf(startMarker);
  if (idx === -1) return src;
  const braceStart = src.indexOf('{', idx);
  if (braceStart === -1) return src;

  let i = braceStart + 1;
  let depth = 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  const braceEnd = i - 1;
  if (braceEnd <= braceStart) return src;

  const inner = src.slice(braceStart + 1, braceEnd);
  const items = inner
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (!items.includes(identToAdd)) items.push(identToAdd);

  const pretty =
    items.length > 0 ? '\n    ' + items.join(',\n    ') + ',\n  ' : ' ';
  return src.slice(0, braceStart + 1) + pretty + src.slice(braceEnd);
}

function removeIdentFromObjectBlock(
  src: string,
  startMarker: string,
  identToRemove: string,
): string {
  const idx = src.indexOf(startMarker);
  if (idx === -1) return src;
  const braceStart = src.indexOf('{', idx);
  if (braceStart === -1) return src;

  let i = braceStart + 1;
  let depth = 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  const braceEnd = i - 1;
  if (braceEnd <= braceStart) return src;

  const inner = src.slice(braceStart + 1, braceEnd);
  const items = inner
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== identToRemove);

  const pretty =
    items.length > 0 ? '\n    ' + items.join(',\n    ') + ',\n  ' : ' ';
  let out = src.slice(0, braceStart + 1) + pretty + src.slice(braceEnd);
  out = out.replace(/,,/g, ',');
  return out;
}

function patchDrizzle(tree: Tree, plural: string) {
  const p = 'libs/server/workbench-api/infra/src/lib/db/drizzle.ts';
  if (!tree.exists(p)) return;
  let txt = tree.read(p, 'utf-8') ?? '';

  txt = addImportOnce(
    txt,
    `import { ${plural}Table } from './schema.${plural}';`,
  );
  txt = insertIdentInObjectBlock(txt, 'schema:', `${plural}Table`);
  txt = insertIdentInObjectBlock(
    txt,
    'export const schema =',
    `${plural}Table`,
  );
  txt = txt.replace(/,,/g, ',');

  tree.write(p, txt);
}

function patchDrizzleRevert(tree: Tree, plural: string) {
  const p = 'libs/server/workbench-api/infra/src/lib/db/drizzle.ts';
  if (!tree.exists(p)) return;
  let txt = tree.read(p, 'utf-8') ?? '';

  const importLine = `import { ${plural}Table } from './schema.${plural}';`;
  txt = removeExactImportLine(txt, importLine);
  txt = removeIdentFromObjectBlock(txt, 'schema:', `${plural}Table`);
  txt = removeIdentFromObjectBlock(
    txt,
    'export const schema =',
    `${plural}Table`,
  );
  txt = txt.replace(/,,/g, ',');

  tree.write(p, txt);
}

function patchResourcesPgRegistry(tree: Tree, singular: string, Cap: string) {
  const p = 'libs/server/workbench-api/resources-pg/src/lib/index.ts';
  if (!tree.exists(p)) return;
  let txt = tree.read(p, 'utf-8') ?? '';

  // add CapRepoPg to import { ... } from '@edb-workbench/api/infra'
  const importRe =
    /import\s+\{\s*([^}]+)\s*\}\s+from '@edb-workbench\/api\/infra';/;
  if (importRe.test(txt)) {
    txt = txt.replace(importRe, (_m, names: string) => {
      const parts = names
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      const want = `${Cap}RepoPg`;
      if (!parts.includes(want)) parts.push(want);
      return `import { ${parts.join(', ')} } from '@edb-workbench/api/infra';`;
    });
  } else {
    txt = `import { ${Cap}RepoPg } from '@edb-workbench/api/infra';\n` + txt;
  }

  // ensure { singular: CapRepoPg } is passed to makeRouteRegistry({...})
  const callIdx = txt.indexOf('makeRouteRegistry(');
  if (callIdx !== -1) {
    const objStart = txt.indexOf('{', callIdx);
    if (objStart !== -1) {
      let k = objStart + 1;
      let depth = 1;
      let inStr: '"' | "'" | '`' | null = null;
      let esc = false;
      while (k < txt.length && depth > 0) {
        const ch = txt[k];
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
      const objEnd = k - 1;
      const inner = txt.slice(objStart + 1, objEnd);
      const lines = inner
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const entry = `${singular}: ${Cap}RepoPg,`;
      if (!lines.some((l) => l.startsWith(`${singular}:`))) lines.push(entry);
      const pretty = '\n    ' + lines.join('\n    ') + '\n  ';
      txt = txt.slice(0, objStart + 1) + pretty + txt.slice(objEnd);
    }
  }

  tree.write(p, txt);
}

function patchResourcesPgRegistryRevert(
  tree: Tree,
  singular: string,
  Cap: string,
) {
  const p = 'libs/server/workbench-api/resources-pg/src/lib/index.ts';
  if (!tree.exists(p)) return;
  let txt = tree.read(p, 'utf-8') ?? '';

  // 1) remove named import CapRepoPg from '@edb-workbench/api/infra'
  const impRe =
    /import\s+\{\s*([^}]+)\s*\}\s+from '@edb-workbench\/api\/infra';/m;
  if (impRe.test(txt)) {
    txt = txt.replace(impRe, (_m, names: string) => {
      const parts = names
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && s !== `${Cap}RepoPg`);
      return parts.length > 0
        ? `import { ${parts.join(', ')} } from '@edb-workbench/api/infra';`
        : ''; // drop entire line if empty
    });
  }
  // also handle standalone import line
  txt = txt.replace(
    new RegExp(
      String.raw`^\s*import\s+\{\s*${Cap}RepoPg\s*\}\s+from\s+'@edb-workbench/api/infra';\s*\n?`,
      'm',
    ),
    '',
  );

  // 2) remove mapping "singular: CapRepoPg," from makeRouteRegistry({...})
  const callIdx = txt.indexOf('makeRouteRegistry(');
  if (callIdx !== -1) {
    const objStart = txt.indexOf('{', callIdx);
    if (objStart !== -1) {
      let k = objStart + 1;
      let depth = 1;
      let inStr: '"' | "'" | '`' | null = null;
      let esc = false;
      while (k < txt.length && depth > 0) {
        const ch = txt[k];
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
      const objEnd = k - 1;
      const inner = txt.slice(objStart + 1, objEnd);
      const lines = inner
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith(`${singular}:`));
      const pretty =
        lines.length > 0 ? '\n    ' + lines.join('\n    ') + '\n  ' : ' ';
      txt = txt.slice(0, objStart + 1) + pretty + txt.slice(objEnd);
    }
  }

  // tidy multiple blank lines
  txt = txt.replace(/\n{3,}/g, '\n\n');
  tree.write(p, txt);
}

/* ─────────────────────────────────────────────
   Repo spec emitter
────────────────────────────────────────────── */
function emitRepoSpec(
  tree: Tree,
  opts: {
    infraRoot: string;
    plural: string;
    singular: string;
    Cap: string;
    fields: ParsedField[];
  },
) {
  const { infraRoot, plural, singular, Cap, fields } = opts;

  const testDir = `${infraRoot}/src/lib/repos/tests`;
  const specPath = `${testDir}/${singular}.repo.pg.spec.ts`;

  if (!tree.exists(testDir)) {
    tree.write(`${testDir}/.gitkeep`, '');
  }
  if (tree.exists(specPath)) return;

  const stringField = fields.find((f) => f.tsType === 'string')?.fieldName;
  const enumField = fields.find((f) => f.tsType.includes("'"))?.fieldName;
  const numberField = fields.find((f) => f.tsType === 'number')?.fieldName;

  const searchBlock = stringField
    ? `
    // SEARCH: should match only "${stringField}" containing 'zz'
    {
      const { rows, total } = await ${Cap}RepoPg.list({
        plan: plan(),
        search: 'zz',
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some(r => r.${stringField}.toLowerCase().includes('zz'))).toBe(true);
    }
  `
    : `// (no string field → search test skipped)`;

  const filterBlock =
    enumField || stringField || numberField
      ? `
    // FILTER: by 1 field
    {
      const { rows, total } = await ${Cap}RepoPg.list({
        plan: plan({ filters: {
          ${
            enumField
              ? `${enumField}: row1.${enumField}`
              : stringField
                ? `${stringField}: row1.${stringField}`
                : `${numberField}: String(row1.${numberField})`
          }
        }}),
      });
      expect(total).toBeGreaterThanOrEqual(1);
      expect(rows.some(r => r.id === row1.id)).toBe(true);
    }
  `
      : `// (no filterable field → filter test skipped)`;

  const sortField = stringField ?? numberField ?? 'createdAt';
  const sortBlock = `
    // SORT: by ${sortField} desc, check consistent desc order
    {
      const { rows } = await ${Cap}RepoPg.list({
        plan: plan({ sorters: [{ field: '${sortField}', dir: 'desc' }], limit: 10, offset: 0 }),
      });
      const proj = rows.map(r => r.${sortField});
      const copy = [...proj].sort((a,b) => (a > b ? -1 : a < b ? 1 : 0));
      expect(proj).toEqual(copy);
    }
  `;

  const makeCreate = (idx: number) => {
    const lines: string[] = [];
    for (const f of fields) {
      const k = f.fieldName;
      if (f.zodBase.includes('.datetime()')) {
        lines.push(
          `${k}: ${f.required ? `new Date().toISOString()` : `undefined`},`,
        );
      } else if (f.tsType === 'string' && /Id$/.test(k)) {
        lines.push(`${k}: randomUUID(),`);
      } else if (f.tsType === 'string') {
        const val =
          k.toLowerCase().includes('title') || k.toLowerCase().includes('name')
            ? `'name-${idx}-zz'`
            : `'str-${k}-${idx}'`;
        lines.push(`${k}: ${f.required ? val : `undefined`},`);
      } else if (f.tsType === 'number') {
        lines.push(`${k}: ${f.required ? idx : `undefined`},`);
      } else if (f.tsType === 'boolean') {
        lines.push(
          `${k}: ${f.required ? (idx % 2 === 0 ? 'true' : 'false') : `undefined`},`,
        );
      } else if (f.tsType.includes("'")) {
        const variant = f.tsType.split('|')[0]!.trim().replace(/'/g, '');
        lines.push(`${k}: ${f.required ? `'${variant}'` : `undefined`},`);
      }
    }
    return lines.join('\n      ');
  };

  const content = `import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '../../db/drizzle';
import { ${Cap}RepoPg } from '../../repos/${singular}.repo.pg';
import { randomUUID } from 'node:crypto';

import type { PaginationPlan } from '@edb-workbench/api/shared';

function plan(overrides: Partial<PaginationPlan> = {}): PaginationPlan {
  return { page: 1, pageSize: 10, offset: 0, limit: 10, sorters: [], filters: {}, ...overrides };
}

describe.sequential('${Cap}RepoPg (infra ↔ db)', () => {
  beforeEach(async () => {
    await db.execute(sql\`DELETE FROM "${plural}";\`);
  });

  it('create/get/update/delete basic flow', async () => {
    const row1 = await ${Cap}RepoPg.create({
      ${makeCreate(1)}
    });
    expect(row1.id).toBeTruthy();

    const fetched = await ${Cap}RepoPg.getById(row1.id);
    expect(fetched?.id).toBe(row1.id);

    const patched = await ${Cap}RepoPg.update(row1.id, {});
    expect(patched?.id).toBe(row1.id);

    const ok = await ${Cap}RepoPg.delete(row1.id);
    expect(ok).toBe(true);

    const missing = await ${Cap}RepoPg.getById(row1.id);
    expect(missing).toBeUndefined();
  });

  it('list(): pagination + search/filter/sort (when applicable)', async () => {
    const row1 = await ${Cap}RepoPg.create({ ${makeCreate(1)} });
    const row2 = await ${Cap}RepoPg.create({ ${makeCreate(2)} });
    const row3 = await ${Cap}RepoPg.create({ ${makeCreate(3)} });

    // PAGINATION smoke
    {
      const { rows, total } = await ${Cap}RepoPg.list({ plan: plan({ limit: 1, pageSize: 1 }) });
      expect(rows.length).toBe(1);
      expect(total).toBeGreaterThanOrEqual(3);
    }

    ${searchBlock}

    ${filterBlock}

    ${sortBlock}
  });
});
`;
  tree.write(specPath, content);
}

/* ─────────────────────────────────────────────
   MAIN (create & revert)
────────────────────────────────────────────── */
export default async function generator(tree: Tree, schema: Schema) {
  if (!schema.name?.trim()) throw new Error('--name is required');

  const n = names(schema.name.trim());
  const plural = n.fileName; // e.g., "albums"
  const singular = singularize(plural); // e.g., "album"
  const Cap = names(singular).className; // e.g., "Album"

  const infraRoot = 'libs/server/workbench-api/infra';
  const dbDir = joinPathFragments(infraRoot, 'src/lib/db');
  const repoDir = joinPathFragments(infraRoot, 'src/lib/repos');
  const schemaFile = joinPathFragments(dbDir, `schema.${plural}.ts`);
  const repoFile = joinPathFragments(repoDir, `${singular}.repo.pg.ts`);
  const infraIndexPath = joinPathFragments(infraRoot, 'src/index.ts');
  const specPath = `${infraRoot}/src/lib/repos/tests/${singular}.repo.pg.spec.ts`;

  /* ─────────────── REVERT ─────────────── */
  if (schema.revert) {
    // 1) delete files if present
    if (tree.exists(schemaFile)) tree.delete(schemaFile);
    if (tree.exists(repoFile)) tree.delete(repoFile);
    if (tree.exists(specPath)) tree.delete(specPath);

    // 2) infra index: remove exports we added
    if (tree.exists(infraIndexPath)) {
      let idx = tree.read(infraIndexPath, 'utf-8') ?? '';
      const exSchema = `export * from './lib/db/schema.${plural}';`;
      const exRepo = `export * from './lib/repos/${singular}.repo.pg';`;
      idx = idx
        .replace(
          new RegExp(
            '^' + exSchema.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\n?',
            'm',
          ),
          '',
        )
        .replace(
          new RegExp(
            '^' + exRepo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\n?',
            'm',
          ),
          '',
        )
        .replace(/\n{3,}/g, '\n\n');
      tree.write(infraIndexPath, idx);
    }

    // 3) drizzle.ts: remove import + identifiers in schema objects
    patchDrizzleRevert(tree, plural);

    // 4) resources-pg registry: remove CapRepoPg import + mapping
    patchResourcesPgRegistryRevert(tree, singular, Cap);

    await formatFiles(tree);
    console.info(`[workbench-api-infra] Reverted → ${plural}`);
    return;
  }

  /* ─────────────── CREATE ─────────────── */

  // Resolve fields from CLI or contract file
  let fieldsString = schema.fields?.trim();
  if (!fieldsString) {
    fieldsString = loadFieldsStringFromContract(tree, singular);
  }
  if (!fieldsString) {
    throw new Error(
      `No --fields provided and no contract found for "${singular}". ` +
        `Either pass --fields="..." or generate the model first so we can read libs/server/workbench-api/models/src/contracts/${singular}.contract.json`,
    );
  }

  const fields = parseFields(fieldsString);

  if (!tree.exists(dbDir)) tree.write(joinPathFragments(dbDir, '.gitkeep'), '');
  if (!tree.exists(repoDir))
    tree.write(joinPathFragments(repoDir, '.gitkeep'), '');

  // 1) Drizzle schema
  if (!tree.exists(schemaFile)) {
    const enumDefs = fields
      .map((f) => enumBlock(plural, f))
      .filter(Boolean)
      .join('\n');
    const cols = [
      `id: uuid('id').primaryKey().defaultRandom(),`,
      ...fields.map((f) => drizzleColLine(plural, f)),
      `created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),`,
      `updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),`,
    ].join('\n  ');

    const content = `import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
${enumDefs ? '\n' + enumDefs + '\n' : ''}
export const ${plural}Table = pgTable('${plural}', {
  ${cols}
});
`;
    tree.write(schemaFile, content);
  }

  // 2) PG repo
  if (!tree.exists(repoFile)) {
    const selectBlock = `{
        id: ${plural}Table.id,
${fields.map((f) => `        ${snake(f.fieldName)}: ${plural}Table.${snake(f.fieldName)},`).join('\n')}
        created_at: ${plural}Table.created_at,
        updated_at: ${plural}Table.updated_at
      }`;

    const repo = `import {
  and, asc, desc, eq, like, sql,
  type AnyColumn, type SQL
} from 'drizzle-orm';

import { db } from '../db/drizzle';
import { ${plural}Table } from '../db/schema.${plural}';

import type { ${Cap}, ${Cap}Repo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

${rowTypeDef(Cap, fields)}

${rowToModelFn(Cap, plural, fields)}

${buildWhereHelper(plural, fields)}

${buildOrderHelper(plural, fields)}

export const ${Cap}RepoPg: ${Cap}Repo = {
  async list(args) {
    const { plan, search, filter } = args;
    const mergedFilters = { ...(plan.filters ?? {}), ...(filter ?? {}) };
    const whereExpr = buildWhere({ search, mergedFilters });
    const whereSql = whereExpr ?? sql\`true\`;
    const { orderByExpr, orderDir } = buildOrder(plan);

    const totalResult = await db
      .select({ cnt: sql<number>\`count(*)::int\` })
      .from(${plural}Table)
      .where(whereSql);
    const total = totalResult[0]?.cnt ?? 0;

    const rows = await db
      .select(${selectBlock})
      .from(${plural}Table)
      .where(whereSql)
      .orderBy(orderDir === 'asc' ? asc(orderByExpr) : desc(orderByExpr))
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowTo${Cap}), total };
  },

  async getById(id) {
    const rows = await db
      .select(${selectBlock})
      .from(${plural}Table)
      .where(eq(${plural}Table.id, id))
      .limit(1);
    return rows[0] ? rowTo${Cap}(rows[0] as ${Cap}Row) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(${plural}Table)
      .values({
${fields
  .map((f) => {
    const c = snake(f.fieldName);
    if (f.zodBase.includes('.datetime()'))
      return `        ${c}: data.${f.fieldName} ? new Date(data.${f.fieldName}) : null,`;
    return `        ${c}: ${f.required ? `data.${f.fieldName}` : `data.${f.fieldName} ?? null`},`;
  })
  .join('\n')}
        created_at: sql\`now()\`,
        updated_at: sql\`now()\`,
      })
      .returning();
    return rowTo${Cap}(inserted[0] as ${Cap}Row);
  },

  async update(id, patch) {
    const updated = await db
      .update(${plural}Table)
      .set({
${fields
  .map((f) => {
    const c = snake(f.fieldName);
    const v = f.zodBase.includes('.datetime()')
      ? `(patch.${f.fieldName} ? new Date(patch.${f.fieldName}) : undefined)`
      : `patch.${f.fieldName}`;
    return `        ...(patch.${f.fieldName} !== undefined ? { ${c}: ${v} } : {}),`;
  })
  .join('\n')}
        updated_at: sql\`now()\`,
      })
      .where(eq(${plural}Table.id, id))
      .returning();
    return updated[0] ? rowTo${Cap}(updated[0] as ${Cap}Row) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(${plural}Table)
      .where(eq(${plural}Table.id, id))
      .returning({ id: ${plural}Table.id });
    return !!del[0];
  },
};
`;
    tree.write(repoFile, repo);
  }

  // 3) Emit repo tests
  emitRepoSpec(tree, { infraRoot, plural, singular, Cap, fields });

  // 4) ensure infra exports
  let idx = tree.exists(infraIndexPath)
    ? tree.read(infraIndexPath, 'utf-8')!
    : '';
  const exSchema = `export * from './lib/db/schema.${plural}';`;
  const exRepo = `export * from './lib/repos/${singular}.repo.pg';`;
  if (!idx.includes(exSchema))
    idx += (idx.endsWith('\n') ? '' : '\n') + exSchema + '\n';
  if (!idx.includes(exRepo)) idx += exRepo + '\n';
  tree.write(infraIndexPath, idx);

  // 5) patch drizzle + resources-pg registry
  patchDrizzle(tree, plural);
  patchResourcesPgRegistry(tree, singular, Cap);

  await formatFiles(tree);
  console.info(`[workbench-api-infra] OK → ${plural}`);
}
