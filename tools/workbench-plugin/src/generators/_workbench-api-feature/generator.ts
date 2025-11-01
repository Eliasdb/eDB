import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'node:path';
import { WorkbenchApiFeatureSchema } from './schema';

import {
  ParsedField,
  addApiBuildDependency,
  addTsPathAlias,
  applyReplacementsToFiles,
  buildCreatePayloadLines,
  capitalize,
  computeSearchFieldExpr,
  defaultForField,
  flippedValueForPatch,
  joinPathFragments,
  parseFields,
  pickPatchField,
  wireRoutesIntoWorkbenchApi,
} from './utils';

// main generator
export default async function workbenchApiFeatureGenerator(
  tree: Tree,
  schema: WorkbenchApiFeatureSchema,
) {
  // 1. validate inputs
  if (!schema.name?.trim()) throw new Error('--name is required');
  if (!schema.fields?.trim()) throw new Error('--fields is required');

  console.log('[workbench-api-feature] schema from CLI:', schema);

  // 2. derive naming
  const rawName = schema.name.trim();
  const n = names(rawName); // { fileName, className, propertyName, etc. }

  const featureLibName = `feature-${n.fileName}`;
  const projectRoot = joinPathFragments(
    'libs/server/workbench-api/features',
    featureLibName,
  );

  if (tree.exists(projectRoot)) {
    throw new Error(`Feature ${featureLibName} already exists`);
  }

  // singular-ish Domain class name
  const DomainClassName = n.className.endsWith('s')
    ? n.className.slice(0, -1)
    : n.className;

  const domainPropName =
    DomainClassName.charAt(0).toLowerCase() + DomainClassName.slice(1);

  const RouteRegistrarName = `register${capitalize(n.fileName)}Routes`;

  // 3. parse fields from CLI
  const parsedFields: ParsedField[] = parseFields(schema.fields);

  // 4. build code snippets for contracts.ts

  // zod lines -----------------
  function zodLineForModel(f: ParsedField): string {
    return f.required
      ? `${f.fieldName}: ${f.zodBase},`
      : `${f.fieldName}: ${f.zodBase}.optional(),`;
  }

  function zodLineForCreate(f: ParsedField): string {
    return f.required
      ? `${f.fieldName}: ${f.zodBase},`
      : `${f.fieldName}: ${f.zodBase}.optional(),`;
  }

  function zodLineForUpdate(f: ParsedField): string {
    return `${f.fieldName}: ${f.zodBase}.optional(),`;
  }

  const modelFieldLines = [
    `id: z.string().uuid(),`,
    ...parsedFields.map(zodLineForModel),
    `ownerId: z.string().uuid(),`,
    `createdAt: z.string().datetime(),`,
    `updatedAt: z.string().datetime(),`,
  ];

  const createBodyLines = parsedFields.map(zodLineForCreate);
  const updateBodyLines = parsedFields.map(zodLineForUpdate);

  // ts lines -------------------
  function tsLineForModel(f: ParsedField): string {
    return f.required
      ? `${f.fieldName}: ${f.tsType};`
      : `${f.fieldName}?: ${f.tsType};`;
  }

  function tsLineForCreate(f: ParsedField): string {
    return f.required
      ? `${f.fieldName}: ${f.tsType};`
      : `${f.fieldName}?: ${f.tsType};`;
  }

  function tsLineForUpdate(f: ParsedField): string {
    return `${f.fieldName}?: ${f.tsType};`;
  }

  const tsModelFieldLines = [
    `id: string;`,
    ...parsedFields.map(tsLineForModel),
    `ownerId: string;`,
    `createdAt: string;`,
    `updatedAt: string;`,
  ];

  const tsCreateFieldLines = parsedFields.map(tsLineForCreate);
  const tsUpdateFieldLines = parsedFields.map(tsLineForUpdate);

  // search fields --------------
  const searchFieldExpr = computeSearchFieldExpr(parsedFields);

  // 5. test payload seeds

  // POST payload lines (all required fields so POST passes validation)
  const createPayloadLines = buildCreatePayloadLines(parsedFields);

  // PATCH: pick one field + choose flipped value
  const patchField = pickPatchField(parsedFields);
  const patchKey = patchField ? patchField.fieldName : 'status';
  const baseVal = patchField ? defaultForField(patchField) : "'active'";
  const patchVal = patchField
    ? flippedValueForPatch(patchField, baseVal)
    : "'archived'";

  // 6. scaffold files from templates
  const templateDir = path.join(__dirname, 'files');

  generateFiles(tree, templateDir, projectRoot, {
    tmpl: '',

    // identifiers
    featureLibName,
    routeBase: n.fileName,
    DomainClassName,
    domainPropName,
    domainFileName: n.fileName,
    DOMAIN_CONST: n.constantName,
    RouteRegistrarName,

    // contracts.ts snippets
    modelFieldLines: modelFieldLines.join('\n  '),
    createBodyLines: createBodyLines.join('\n  '),
    updateBodyLines: updateBodyLines.join('\n  '),
    tsModelFieldLines: tsModelFieldLines.join('\n  '),
    tsCreateFieldLines: tsCreateFieldLines.join('\n  '),
    tsUpdateFieldLines: tsUpdateFieldLines.join('\n  '),
    searchFieldExpr,

    // tests
    createPayloadLines,
    patchKey,
    patchVal,
  });

  // 7. placeholder substitution after generateFiles
  const replacementMap: Record<string, string> = {
    DomainClassName,
    domainPropName,
    modelFieldLines: modelFieldLines.join('\n  '),
    createBodyLines: createBodyLines.join('\n  '),
    updateBodyLines: updateBodyLines.join('\n  '),
    tsModelFieldLines: tsModelFieldLines.join('\n  '),
    tsCreateFieldLines: tsCreateFieldLines.join('\n  '),
    tsUpdateFieldLines: tsUpdateFieldLines.join('\n  '),
    searchFieldExpr,
    routeBase: n.fileName,
    RouteRegistrarName,
    featureLibName,
    domainFileName: n.fileName,
    DOMAIN_CONST: n.constantName,
    createPayloadLines,
    patchKey,
    patchVal,
  };

  const filesNeedingSubs = [
    joinPathFragments(projectRoot, 'src/contracts.ts'),
    joinPathFragments(projectRoot, 'src/controller.ts'),
    joinPathFragments(projectRoot, 'src/repo.ts'),
    joinPathFragments(projectRoot, 'src/service.ts'),
    joinPathFragments(projectRoot, 'src/index.ts'),
    joinPathFragments(projectRoot, 'README.md'),
    joinPathFragments(projectRoot, 'vitest.config.mts'),
    joinPathFragments(projectRoot, `src/${n.fileName}.spec.ts`),
  ];

  applyReplacementsToFiles(tree, filesNeedingSubs, replacementMap);

  // 8. register the new project with Nx
  // (build + test + test-watch)
  tree.write(
    joinPathFragments(projectRoot, 'project.json'),
    JSON.stringify(
      {
        name: featureLibName,
        root: projectRoot,
        sourceRoot: `${projectRoot}/src`,
        projectType: 'library',
        targets: {
          build: {
            executor: '@nx/js:tsc',
            outputs: ['{options.outputPath}'],
            options: {
              outputPath: `dist/${projectRoot}`,
              main: `${projectRoot}/src/index.ts`,
              tsConfig: `${projectRoot}/tsconfig.lib.json`,
              assets: [`${projectRoot}/*.md`],
            },
          },
          test: {
            executor: 'nx:run-commands',
            options: {
              cwd: projectRoot,
              command:
                'vitest run --config vitest.config.mts --reporter=verbose',
            },
          },
          'test-watch': {
            executor: 'nx:run-commands',
            options: {
              cwd: projectRoot,
              command:
                'vitest watch --config vitest.config.mts --reporter=verbose',
            },
          },
        },
        tags: ['scope:server', 'context:workbench-api', 'type:feature'],
      },
      null,
      2,
    ),
  );

  // 9. wire up tsconfig paths + route registration + build dependsOn
  addTsPathAlias(tree, {
    importPath: `@edb-workbench/api/${featureLibName}`,
    targetIndexTsPath: `${projectRoot}/src/index.ts`,
  });

  addApiBuildDependency(tree, featureLibName);

  wireRoutesIntoWorkbenchApi(tree, {
    featureLibName,
    RouteRegistrarName,
  });

  // 10. prettify / format
  await formatFiles(tree);

  console.log('[workbench-api-feature] DONE for', featureLibName);
}
