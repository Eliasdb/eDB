import { Tree, formatFiles, joinPathFragments, names } from '@nx/devkit';

// reuse existing helpers
import { parseFields, type ParsedField } from '../workbench-api-feature/utils';

// call the existing sub-gens directly (they’re default exports)
import modelGen from '../workbench-api-model/generator';
import resourceGen from '../workbench-api-resource/generator';

type Schema = {
  name: string; // plural (route base), e.g. "books"
  fields: string; // "title:string,status:enum(draft|published|archived),publishedYear?:number"
  api?: boolean; // generate contracts/models
  resource?: boolean; // controller + service + registry wiring
  db?: boolean; // drizzle schema + repo + infra exports
};

const camelToSnake = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

const singularize = (s: string) => (s.endsWith('s') ? s.slice(0, -1) : s);

// map ParsedField -> drizzle column line
function drizzleColLine(entity: string, f: ParsedField) {
  const col = camelToSnake(f.fieldName);
  const nn = f.required ? '.notNull()' : '';
  if (f.tsType === 'string') return `${col}: text('${col}')${nn},`;
  if (f.tsType === 'number') return `${col}: integer('${col}')${nn},`;
  if (f.tsType === 'boolean') return `${col}: boolean('${col}')${nn},`;
  if (f.zodBase.includes('.datetime()'))
    return `${col}: timestamp('${col}', { withTimezone: true })${nn},`;
  if (f.tsType === 'string' && f.fieldName.endsWith('Id'))
    return `${col}: uuid('${col}')${nn},`;

  // enum union -> pgEnum
  if (f.tsType.includes("'")) {
    const enumName = `${entity}_${col}_enum`;
    const enumId = `${col}Enum`;
    return `// ${col} uses ${enumId} below
${col}: ${enumId}('${col}')${nn},`;
  }

  // fallback to text
  return `${col}: text('${col}')${nn},`;
}

function pgEnumBlocks(entity: string, fields: ParsedField[]) {
  const blocks: string[] = [];
  for (const f of fields) {
    if (f.tsType.includes("'")) {
      const col = camelToSnake(f.fieldName);
      const enumName = `${entity}_${col}_enum`;
      const enumId = `${col}Enum`;
      const variants = f.tsType
        .split('|')
        .map((v) => v.trim().replace(/'/g, ''));
      blocks.push(
        `const ${enumId} = pgEnum('${enumName}', [${variants.map((v) => `'${v}'`).join(', ')}]);`,
      );
    }
  }
  return blocks.join('\n');
}

export default async function workbenchApiEntityGenerator(
  tree: Tree,
  schema: Schema,
) {
  if (!schema.name?.trim()) throw new Error('--name is required');
  if (!schema.fields?.trim()) throw new Error('--fields is required');

  const raw = schema.name.trim();
  const n = names(raw); // e.g. { fileName: "books", className: "Books" }
  const plural = n.fileName;
  const singular = singularize(plural); // "book"
  const Cap = names(singular).className; // "Book"
  const parsed = parseFields(schema.fields);

  // 1) API contracts/models (your existing generator)
  if (schema.api !== false) {
    await modelGen(tree, { name: plural, fields: schema.fields });
  }

  // 2) Resources (controller + service + registry wiring)
  if (schema.resource !== false) {
    await resourceGen(tree, { name: plural });
  }

  // 3) PG infra (drizzle schema + repo + infra exports)
  if (schema.db !== false) {
    const infraRoot = 'libs/server/workbench-api/infra';
    const dbDir = joinPathFragments(infraRoot, 'src/lib/db');
    const repoDir = joinPathFragments(infraRoot, 'src/lib/repos');
    const schemaFile = joinPathFragments(dbDir, `schema.${plural}.ts`);
    const repoFile = joinPathFragments(repoDir, `${singular}.repo.pg.ts`);
    const infraIndex = joinPathFragments(infraRoot, 'src/index.ts');

    // ensure dirs
    if (!tree.exists(dbDir))
      tree.write(joinPathFragments(dbDir, '.gitkeep'), '');
    if (!tree.exists(repoDir))
      tree.write(joinPathFragments(repoDir, '.gitkeep'), '');

    // drizzle schema
    if (!tree.exists(schemaFile)) {
      const enumDefs = pgEnumBlocks(singular, parsed);
      const cols = [
        `id: uuid('id').primaryKey().defaultRandom(),`,
        ...parsed.map((f) => drizzleColLine(singular, f)),
        `created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),`,
        `updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),`,
      ].join('\n  ');

      const content = `import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

${enumDefs ? enumDefs + '\n\n' : ''}export const ${plural}Table = pgTable('${plural}', {
  ${cols}
});
`;
      tree.write(schemaFile, content);
    }

    // repo (basic CRUD + pagination, no "search" logic; keep it predictable)
    if (!tree.exists(repoFile)) {
      const colsSelect = `{
        id: ${plural}Table.id,
${parsed.map((f) => `        ${f.fieldName}: ${plural}Table.${camelToSnake(f.fieldName)},`).join('\n')}
        created_at: ${plural}Table.created_at,
        updated_at: ${plural}Table.updated_at
      }`;

      const rowToModel = `function rowTo${Cap}(row: any): import('@edb-workbench/api/models').${Cap} {
  return {
    id: row.id,
${parsed
  .map((f) => {
    const n = f.fieldName;
    if (f.zodBase.includes('.datetime()'))
      return `    ${n}: row.${camelToSnake(n)}?.toISOString(),`;
    return `    ${n}: row.${camelToSnake(n)}${f.required ? '' : ' ?? undefined'},`;
  })
  .join('\n')}
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}`;

      const repo = `import { asc, desc, sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { ${plural}Table } from '../db/schema.${plural}';
import type { ${Cap}Repo } from '@edb-workbench/api/models';
import type { PaginationPlan } from '@edb-workbench/api/shared';

${rowToModel}

export const ${Cap}RepoPg: ${Cap}Repo = {
  async list({ plan }) {
    // count
    const totalResult = await db
      .select({ cnt: sql<number>\`count(*)::int\` })
      .from(${plural}Table);
    const total = totalResult[0]?.cnt ?? 0;

    // order: created_at unless provided
    const sorter = plan.sorters[0];
    const byCreated = asc(${plural}Table.created_at);
    const orderExpr = sorter?.dir === 'desc' ? desc(${plural}Table.created_at) : byCreated;

    const rows = await db
      .select(${colsSelect})
      .from(${plural}Table)
      .orderBy(orderExpr)
      .limit(plan.limit)
      .offset(plan.offset);

    return { rows: rows.map(rowTo${Cap}), total };
  },

  async getById(id) {
    const rows = await db
      .select(${colsSelect})
      .from(${plural}Table)
      .where(${plural}Table.id.eq(id))
      .limit(1);
    return rows[0] ? rowTo${Cap}(rows[0]) : undefined;
  },

  async create(data) {
    const inserted = await db
      .insert(${plural}Table)
      .values({
${parsed
  .map((f) => {
    const n = f.fieldName;
    const c = camelToSnake(n);
    if (f.zodBase.includes('.datetime()'))
      return `        ${c}: new Date(data.${n}),`;
    return `        ${c}: data.${n}${f.required ? '' : ' ?? null'},`;
  })
  .join('\n')}
        created_at: sql\`now()\`,
        updated_at: sql\`now()\`,
      })
      .returning();
    return rowTo${Cap}(inserted[0]);
  },

  async update(id, patch) {
    const updated = await db
      .update(${plural}Table)
      .set({
${parsed
  .map((f) => {
    const n = f.fieldName;
    const c = camelToSnake(n);
    const val = f.zodBase.includes('.datetime()')
      ? `patch.${n} ? new Date(patch.${n}) : undefined`
      : `patch.${n}`;
    return `        ...(patch.${n} !== undefined ? { ${c}: ${val} } : {}),`;
  })
  .join('\n')}
        updated_at: sql\`now()\`,
      })
      .where(${plural}Table.id.eq(id))
      .returning();
    return updated[0] ? rowTo${Cap}(updated[0]) : undefined;
  },

  async delete(id) {
    const del = await db
      .delete(${plural}Table)
      .where(${plural}Table.id.eq(id))
      .returning({ id: ${plural}Table.id });
    return !!del[0];
  }
};
`;
      tree.write(repoFile, repo);
    }

    // ensure infra exports
    let idx = tree.exists(infraIndex) ? tree.read(infraIndex, 'utf-8')! : '';
    const exSchema = `export * from './lib/db/schema.${plural}';`;
    const exRepo = `export * from './lib/repos/${singular}.repo.pg';`;
    if (!idx.includes(exSchema))
      idx += (idx.endsWith('\n') ? '' : '\n') + exSchema + '\n';
    if (!idx.includes(exRepo)) idx += exRepo + '\n';
    tree.write(infraIndex, idx);
  }

  await formatFiles(tree);
  console.log(`[workbench-api-entity] Done → ${plural}`);
}
