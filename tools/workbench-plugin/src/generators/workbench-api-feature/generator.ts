import {
  Tree,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import * as path from 'node:path';

interface Schema {
  name: string;
}

export default async function workbenchApiFeatureGenerator(
  tree: Tree,
  schema: Schema,
) {
  // 1. normalize names
  const rawName = schema.name.trim(); // e.g. "notes"
  const nameUtils = names(rawName); // { fileName: 'notes', className: 'Notes', propertyName: 'notes', constantName: 'NOTES' }

  const featureLibName = `feature-${nameUtils.fileName}`; // "feature-notes"
  const projectRoot = joinPathFragments(
    'libs/server/workbench-api/features',
    featureLibName,
  );

  // Safety: don't clobber an existing feature
  if (tree.exists(projectRoot)) {
    throw new Error(
      `Feature lib ${featureLibName} already exists at ${projectRoot}`,
    );
  }

  // 2. scaffold source files into libs/server/workbench-api/features/feature-<name>
  //
  // The /files dir should now include:
  //   README.md__tmpl__
  //   eslint.config.mjs__tmpl__
  //   package.json__tmpl__
  //   vitest.config.cjs__tmpl__          <-- updated, not .ts
  //   tsconfig.json__tmpl__
  //   tsconfig.lib.json__tmpl__
  //   tsconfig.spec.json__tmpl__
  //   project.json__tmpl__               <-- updated to use run-commands executor
  //   src/index.ts__tmpl__
  //   src/controller.ts__tmpl__
  //   src/controller.spec.ts__tmpl__     <-- NEW starter test
  //   src/service.ts__tmpl__
  //   src/repo.ts__tmpl__
  //   src/types.ts__tmpl__
  //   src/register-routes.ts__tmpl__
  //
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    tmpl: '',
    // template vars:
    featureLibName, // "feature-notes"
    domainFileName: nameUtils.fileName, // "notes"
    DomainClassName: nameUtils.className, // "Notes"
    domainPropName: nameUtils.propertyName, // "notes"
    DOMAIN_CONST: nameUtils.constantName, // "NOTES"
  });

  // 3. register this library in Nx
  //
  // We still want Nx to know about build + test targets on this new project.
  // BUT: we are *not* using @nx/vite:test because that tries to pull Vite/ESM.
  // Instead we’ll wire "test" ourselves to vitest via run-commands.
  //
  addProjectConfiguration(tree, featureLibName, {
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
        executor: '@nx/run-commands:run-commands',
        options: {
          cwd: projectRoot,
          command: 'vitest run --reporter=verbose',
        },
      },
      'test-watch': {
        executor: '@nx/run-commands:run-commands',
        options: {
          cwd: projectRoot,
          command: 'vitest watch --reporter=verbose',
        },
      },
    },
    tags: ['scope:server', 'context:workbench-api', 'type:feature'],
  });

  // 4. auto-wire this feature's routes into the main API's route registry
  wireRoutesIntoWorkbenchApi(tree, {
    featureLibName, // "feature-notes"
    domainFileName: nameUtils.fileName, // "notes"
  });

  // 5. Prettify / organize imports in modified files
  await formatFiles(tree);
}

/**
 * Injects:
 *
 *   import { registerNotesRoutes } from '@edb-workbench/api/feature-notes';
 *
 * and inside registerAllRoutes(app):
 *
 *   await registerNotesRoutes(app);
 *
 * into apps/server/workbench-api/src/routes/index.ts
 */
function wireRoutesIntoWorkbenchApi(
  tree: Tree,
  opts: { featureLibName: string; domainFileName: string },
) {
  const routesFile = 'apps/server/workbench-api/src/routes/index.ts';

  if (!tree.exists(routesFile)) {
    console.warn(`⚠️ Could not find ${routesFile}; skipping automatic wiring.`);
    return;
  }

  let current = tree.read(routesFile, 'utf-8') ?? '';

  const RouteRegistrarName = `register${capitalize(opts.domainFileName)}Routes`;

  // import { registerNotesRoutes } from '@edb-workbench/api/feature-notes';
  const importLine = `import { ${RouteRegistrarName} } from '@edb-workbench/api/${opts.featureLibName}';`;

  // 1. inject the import if missing
  if (!current.includes(importLine)) {
    const lines = current.split('\n');

    // find last import
    const lastImportIdx = lines
      .map((l, i) => (l.startsWith('import ') ? i : -1))
      .filter((i) => i >= 0)
      .pop();

    if (lastImportIdx !== undefined && lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importLine);
      current = lines.join('\n');
    } else {
      current = importLine + '\n' + current;
    }
  }

  // 2. inject the call in registerAllRoutes(app)
  //
  // We assume you have something like:
  //
  // export async function registerAllRoutes(app: FastifyInstance) {
  //   ...
  // }
  //
  // We want to insert:
  //   await registerNotesRoutes(app);
  //
  const callLine = `  await ${RouteRegistrarName}(app);`;

  const fnStartRegex =
    /export\s+async\s+function\s+registerAllRoutes\s*\(\s*app\s*:\s*FastifyInstance\s*\)\s*\{\s*/m;

  if (fnStartRegex.test(current) && !current.includes(callLine)) {
    current = current.replace(fnStartRegex, (match) => {
      return match + '\n' + callLine + '\n';
    });
  }

  tree.write(routesFile, current);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
