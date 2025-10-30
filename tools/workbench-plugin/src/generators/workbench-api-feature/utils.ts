import { Tree, joinPathFragments } from '@nx/devkit';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ParsedField = {
  fieldName: string; // "bio"
  required: boolean; // false if user wrote "bio?:string"
  tsType: string; // "string" | "number" | "boolean" | "'active' | 'archived'" | "string" (for date)
  zodBase: string; // "z.string()", "z.number()", "z.enum([...])", etc
};

// ─────────────────────────────────────────────
// Field parsing
// ─────────────────────────────────────────────

function parseOneField(chunk: string): ParsedField {
  // chunk like "firstName:string" or "bio?:string" or "status:enum(active|archived)"
  const [rawNamePart, rawType] = chunk.split(':').map((x) => x.trim());

  if (!rawNamePart || !rawType) {
    throw new Error(
      `Invalid field spec "${chunk}". Expected "fieldName:type".`,
    );
  }

  // detect optional from trailing ?
  const isOptional = rawNamePart.endsWith('?');
  const cleanName = isOptional ? rawNamePart.slice(0, -1) : rawNamePart;

  if (rawType === 'uuid') {
    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: 'string',
      zodBase: 'z.string().uuid()',
    };
  }

  // built-ins
  if (rawType === 'string') {
    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: 'string',
      zodBase: 'z.string()',
    };
  }

  if (rawType === 'number') {
    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: 'number',
      zodBase: 'z.number()',
    };
  }

  if (rawType === 'boolean') {
    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: 'boolean',
      zodBase: 'z.boolean()',
    };
  }

  if (rawType === 'date') {
    // model stores ISO datetime string
    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: 'string',
      zodBase: 'z.string().datetime()',
    };
  }

  // enum(foo|bar|baz)
  if (rawType.startsWith('enum(') && rawType.endsWith(')')) {
    const inside = rawType.slice('enum('.length, -1);
    const variants = inside
      .split('|')
      .map((v) => v.trim())
      .filter(Boolean);

    if (variants.length === 0) {
      throw new Error(`Invalid enum spec in "${chunk}". Expected enum(a|b|c).`);
    }

    return {
      fieldName: cleanName,
      required: !isOptional,
      tsType: variants.map((v) => `'${v}'`).join(' | '),
      zodBase: `z.enum([${variants.map((v) => `'${v}'`).join(', ')}])`,
    };
  }

  throw new Error(
    `Unsupported field type "${rawType}" in "${chunk}". Supported: string,number,boolean,date,uuid,enum(a|b|c)`,
  );
}

export function parseFields(rawFields: string): ParsedField[] {
  return rawFields
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map(parseOneField);
}

// ─────────────────────────────────────────────
// Naming helpers
// ─────────────────────────────────────────────

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─────────────────────────────────────────────
// Template helpers
// ─────────────────────────────────────────────

/**
 * naive placeholder substitution after generateFiles
 * Replaces all __key__ with value in given string.
 */
export function substitutePlaceholders(
  input: string,
  map: Record<string, string>,
): string {
  let out = input;
  for (const [key, value] of Object.entries(map)) {
    const pattern = new RegExp(`__${key}__`, 'g');
    out = out.replace(pattern, value);
  }
  return out;
}

// ─────────────────────────────────────────────
// Repo / API wiring helpers
// (kept here so other generators can reuse them, but these are still "infra-ish")
// ─────────────────────────────────────────────

export function addTsPathAlias(
  tree: Tree,
  options: { importPath: string; targetIndexTsPath: string },
) {
  const tsconfigPath = 'tsconfig.base.json';
  if (!tree.exists(tsconfigPath)) return;

  const raw = tree.read(tsconfigPath, 'utf-8');
  if (!raw) return;

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    console.warn('Invalid tsconfig.base.json; skipping alias.');
    return;
  }

  json.compilerOptions = json.compilerOptions ?? {};
  json.compilerOptions.paths = json.compilerOptions.paths ?? {};

  if (!json.compilerOptions.paths[options.importPath]) {
    json.compilerOptions.paths[options.importPath] = [
      options.targetIndexTsPath,
    ];
  }

  tree.write(tsconfigPath, JSON.stringify(json, null, 2));

  console.log(
    '[workbench-api-feature] added tsconfig path alias:',
    options.importPath,
    '->',
    options.targetIndexTsPath,
  );
}

export function addApiBuildDependency(tree: Tree, featureLibName: string) {
  const apiProjectPath = 'apps/server/workbench-api/project.json';
  if (!tree.exists(apiProjectPath)) return;

  const content = tree.read(apiProjectPath, 'utf-8');
  if (!content) return;

  const json = JSON.parse(content);
  const build = json.targets?.build ?? {};
  build.dependsOn = build.dependsOn ?? ['^build'];

  if (!build.dependsOn.includes(`${featureLibName}:build`)) {
    build.dependsOn.push(`${featureLibName}:build`);
    console.log(
      `[workbench-api-feature] linked ${featureLibName} as build dependency of workbench-api`,
    );
  }

  json.targets.build = build;
  tree.write(apiProjectPath, JSON.stringify(json, null, 2));
}

export function wireRoutesIntoWorkbenchApi(
  tree: Tree,
  opts: {
    featureLibName: string;
    RouteRegistrarName: string;
  },
) {
  const routesFile = 'apps/server/workbench-api/src/routes/index.ts';
  if (!tree.exists(routesFile)) {
    console.log(
      '[workbench-api-feature] routes file missing, skipping wire-in:',
      routesFile,
    );
    return;
  }

  let content = tree.read(routesFile, 'utf-8') ?? '';

  const importLine = `import { ${opts.RouteRegistrarName} } from '@edb-workbench/api/${opts.featureLibName}';`;

  if (!content.includes(importLine)) {
    const lines = content.split('\n');
    // "findLastIndex" polyfill
    let lastImportIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('import ')) {
        lastImportIdx = i;
        break;
      }
    }

    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importLine);
      content = lines.join('\n');
    } else {
      content = importLine + '\n' + content;
    }
  }

  const callLine = `  await ${opts.RouteRegistrarName}(app);`;

  const fnStartRegex =
    /export\s+async\s+function\s+registerAllRoutes\s*\(\s*app\s*:\s*FastifyInstance\s*\)\s*\{\s*/m;

  if (fnStartRegex.test(content) && !content.includes(callLine)) {
    content = content.replace(fnStartRegex, (m) => m + '\n' + callLine + '\n');
  }

  tree.write(routesFile, content);

  console.log(
    '[workbench-api-feature] wired routes into workbench-api:',
    opts.RouteRegistrarName,
  );
}

// ─────────────────────────────────────────────
// Test data helpers
// ─────────────────────────────────────────────

export function defaultForField(f: ParsedField): string {
  // datetime fields first (they are still strings, but with additional .datetime() validation)
  if (f.zodBase.includes('.datetime()')) {
    return `"2025-01-01T00:00:00.000Z"`;
  }

  if (f.tsType === 'string') {
    return `"demo-${f.fieldName}"`;
  }

  if (f.tsType === 'number') {
    return '123';
  }

  if (f.tsType === 'boolean') {
    return 'true';
  }

  // enum union => first literal, e.g. 'active'
  if (f.tsType.includes("'")) {
    const firstLiteral = f.tsType.split('|')[0].trim();
    return firstLiteral;
  }

  // fallback
  return `"2025-01-01T00:00:00.000Z"`;
}

/**
 * For PATCH we want a predictable "field we can change".
 * Priority:
 *  - "status" if it exists
 *  - otherwise first boolean
 *  - otherwise just first field
 */
export function pickPatchField(
  parsedFields: ParsedField[],
): ParsedField | null {
  const byName = parsedFields.find((f) => f.fieldName === 'status');
  if (byName) return byName;

  const boolField = parsedFields.find((f) => f.tsType === 'boolean');
  if (boolField) return boolField;

  return parsedFields.length > 0 ? parsedFields[0] : null;
}

export function flippedValueForPatch(
  f: ParsedField,
  currentValLiteral: string,
): string {
  // flip booleans
  if (f.tsType === 'boolean') {
    return currentValLiteral === 'true' ? 'false' : 'true';
  }

  // enums -> pick second variant if available
  if (f.tsType.includes("'")) {
    const variants = f.tsType.split('|').map((p) => p.trim());
    if (variants.length > 1) {
      return variants[1];
    }
  }

  // fallback: same
  return currentValLiteral;
}

// convenience for tests: which fields are texty and can be searched
export function computeSearchFieldExpr(parsedFields: ParsedField[]): string {
  const stringLikeForSearch = parsedFields
    .filter((f) => f.tsType === 'string' || f.tsType.includes("'"))
    .map((f) => f.fieldName);

  return stringLikeForSearch.length > 0
    ? `[${stringLikeForSearch.map((f) => `'${f}'`).join(', ')}]`
    : `[]`;
}

// handy for callers that need to generate post bodies in tests
export function buildCreatePayloadLines(parsedFields: ParsedField[]): string {
  // include ALL required fields so POST passes validation
  const requiredFields = parsedFields.filter((f) => f.required);
  const fieldsForCreatePayload =
    requiredFields.length > 0 ? requiredFields : parsedFields.slice(0, 1);

  return fieldsForCreatePayload
    .map((f) => `${f.fieldName}: ${defaultForField(f)},`)
    .join('\n        ');
}

// read/write helper for mass placeholder replacement in generated files
export function applyReplacementsToFiles(
  tree: Tree,
  filePaths: string[],
  replacementMap: Record<string, string>,
) {
  for (const abs of filePaths) {
    if (!tree.exists(abs)) continue;
    const before = tree.read(abs, 'utf-8') ?? '';
    const after = substitutePlaceholders(before, replacementMap);
    tree.write(abs, after);
  }
}

// path helper you were already using externally
export { joinPathFragments };
