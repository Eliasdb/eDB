import { Tree, formatFiles, joinPathFragments, names } from '@nx/devkit';
import { parseFields, type ParsedField } from '../workbench-api-feature/utils';

type Schema = {
  name: string; // typically plural in CLI (e.g., 'books')
  fields: string; // "title:string,status:enum(draft|published|archived),publishedYear?:number"
};

function singularize(s: string) {
  return s.endsWith('s') ? s.slice(0, -1) : s;
}

function zodLine(f: ParsedField, mode: 'model' | 'create' | 'update') {
  const base = f.zodBase;
  if (mode === 'update') return `${f.fieldName}: ${base}.optional(),`;
  if (mode === 'create')
    return f.required
      ? `${f.fieldName}: ${base},`
      : `${f.fieldName}: ${base}.optional(),`;
  // model
  return f.required
    ? `${f.fieldName}: ${base},`
    : `${f.fieldName}: ${base}.optional(),`;
}

function tsLine(f: ParsedField, mode: 'model' | 'create' | 'update') {
  const opt =
    mode === 'update' || (!f.required && mode !== 'model')
      ? '?'
      : mode === 'model' && !f.required
        ? '?'
        : f.required
          ? ''
          : '?';
  return `${f.fieldName}${opt}: ${f.tsType};`;
}

export default async function workbenchApiModelGenerator(
  tree: Tree,
  schema: Schema,
) {
  if (!schema.name?.trim()) throw new Error('--name is required');
  if (!schema.fields?.trim()) throw new Error('--fields is required');

  const raw = schema.name.trim();
  const n = names(raw); // plural-ish based on input
  const singular = singularize(n.fileName);
  const Cap = names(singular).className; // e.g., Book

  const modelsRoot = 'libs/server/workbench-api/models';
  const modelLibDir = joinPathFragments(modelsRoot, 'src', 'lib');
  const modelFile = joinPathFragments(modelLibDir, `${singular}.model.ts`);
  const indexFile = joinPathFragments(modelsRoot, 'src', 'index.ts');

  if (tree.exists(modelFile)) {
    throw new Error(`Model file already exists: ${modelFile}`);
  }

  const parsed: ParsedField[] = parseFields(schema.fields);

  // Build code fragments
  const modelFieldLines = [
    `id: z.string().uuid(),`,
    ...parsed.map((f) => zodLine(f, 'model')),
    `createdAt: z.string().datetime(),`,
    `updatedAt: z.string().datetime(),`,
  ].join('\n  ');

  const createBodyLines = parsed.map((f) => zodLine(f, 'create')).join('\n  ');
  const updateBodyLines = parsed.map((f) => zodLine(f, 'update')).join('\n  ');

  const tsModelFieldLines = [
    `id: string;`,
    ...parsed.map((f) => tsLine(f, 'model')),
    `createdAt: string;`,
    `updatedAt: string;`,
  ].join('\n  ');

  const tsCreateLines = parsed.map((f) => tsLine(f, 'create')).join('\n  ');
  const tsUpdateLines = parsed.map((f) => tsLine(f, 'update')).join('\n  ');

  // Create the model file
  const content = `import type { PaginationPlan } from '@edb-workbench/api/shared';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

export const ${singular}Schema = z.object({
  ${modelFieldLines}
});
export type ${Cap} = z.infer<typeof ${singular}Schema>;

export const create${Cap}BodySchema = z.object({
  ${createBodyLines}
});
export type Create${Cap}Body = z.infer<typeof create${Cap}BodySchema>;

export const update${Cap}BodySchema = z.object({
  ${updateBodyLines}
});
export type Update${Cap}Body = z.infer<typeof update${Cap}BodySchema>;

export const ${singular}IdParamSchema = z.object({
  id: z.string().uuid(),
});
export type ${Cap}IdParam = z.infer<typeof ${singular}IdParamSchema>;

// ─────────────────────────────────────────────
// Repo interface (no relationships here)
// ─────────────────────────────────────────────

export interface ${Cap}Repo {
  list(args: {
    plan: PaginationPlan;
    search?: string;
    filter?: Record<string, string>;
  }): Promise<{ rows: ${Cap}[]; total: number }>;

  getById(id: string): Promise<${Cap} | undefined>;
  create(data: Create${Cap}Body): Promise<${Cap}>;
  update(id: string, patch: Update${Cap}Body): Promise<${Cap} | undefined>;
  delete(id: string): Promise<boolean>;
}
`;

  // ensure folder
  if (!tree.exists(modelLibDir)) {
    tree.write(modelLibDir + '/.gitkeep', '');
  }
  tree.write(modelFile, content);

  // append export in index.ts
  let index = tree.exists(indexFile) ? tree.read(indexFile, 'utf-8')! : '';
  const exportLine = `export * from './lib/${singular}.model';`;
  if (!index.includes(exportLine)) {
    index = (index ? index + '\n' : '') + exportLine + '\n';
    tree.write(indexFile, index);
  }

  // write a machine-readable contract so other generators can consume it
  const contractDir = joinPathFragments(modelsRoot, 'src/contracts');

  const contractPath = joinPathFragments(
    contractDir,
    `${singular}.contract.json`,
  );
  const contractJson = {
    name: singular,
    plural: n.fileName,
    fieldsString: schema.fields.trim(),
    // reuse your ParsedField shape so infra can plug in directly
    fields: parsed, // array<ParsedField> from parseFields()
  };
  tree.write(contractPath, JSON.stringify(contractJson, null, 2));

  await formatFiles(tree);
  console.log(
    `[workbench-api-model] Created ${modelFile} and updated index.ts`,
  );
}
