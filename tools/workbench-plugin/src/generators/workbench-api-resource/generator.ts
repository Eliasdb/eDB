import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import * as path from 'node:path';
import { applyReplacementsToFiles } from '../workbench-api-feature/utils';

type Schema = {
  name: string; // plural-ish, e.g. "painters"
};

function singularize(s: string) {
  return s.endsWith('s') ? s.slice(0, -1) : s;
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

  if (!tree.exists(outDir)) {
    // ensure dir
    tree.write(joinPathFragments(outDir, '.gitkeep'), '');
  }

  // 1) copy templates
  const templateDir = path.join(__dirname, 'files');
  generateFiles(tree, templateDir, outDir, {
    tmpl: '',
    plural,
    singular,
    Cap,
    routeBase,
  });

  // 2) placeholder replacement (supports both legacy and new placeholders)
  const replacements: Record<string, string> = {
    __plural__: plural,
    __singular__: singular,
    __namePlural__: plural,
    __nameSingular__: singular,
    __Cap__: Cap,
    __NameSingular__: Cap,
    __routeBase__: routeBase,
    // file names may also contain these (handled by generateFiles if present)
  };

  applyReplacementsToFiles(
    tree,
    [
      joinPathFragments(outDir, `${singular}.controller.ts`),
      joinPathFragments(outDir, `${singular}.service.ts`),
      joinPathFragments(outDir, `index.ts`),
    ],
    replacements,
  );

  // 3) ensure RepoAdapters is an interface and augment with "<singular>: <Cap>Repo"
  const registerPath =
    'libs/server/workbench-api/resources/src/lib/register.ts';
  if (!tree.exists(registerPath)) {
    throw new Error(`Missing registry file: ${registerPath}`);
  }

  let reg = tree.read(registerPath, 'utf-8') ?? '';

  // 3.a) Switch "export type RepoAdapters = { ... }" -> "export interface RepoAdapters { ... }"
  //     Keep the body intact.
  if (/export\s+type\s+RepoAdapters\s*=\s*\{/.test(reg)) {
    reg = reg.replace(
      /export\s+type\s+RepoAdapters\s*=\s*\{/,
      'export interface RepoAdapters {',
    );
  }

  // 3.b) import <Cap>Repo from models (once)
  const repoImport = `import type { ${Cap}Repo } from '@edb-workbench/api/models';`;
  if (!reg.includes(repoImport)) {
    // place after first existing import from models, or at top
    const lines = reg.split('\n');
    let insertAt = 0;
    const idx = lines.findIndex((l) =>
      l.includes(`from '@edb-workbench/api/models'`),
    );
    insertAt = idx >= 0 ? idx + 1 : 0;
    lines.splice(insertAt, 0, repoImport);
    reg = lines.join('\n');
  }

  // 3.c) add property to RepoAdapters interface
  if (!new RegExp(`\\b${singular}\\s*:\\s*${Cap}Repo\\s*;`).test(reg)) {
    reg = reg.replace(
      /export\s+interface\s+RepoAdapters\s*\{([\s\S]*?)\}/m,
      (m, body) =>
        `export interface RepoAdapters {\n${body.trimEnd()}\n  ${singular}: ${Cap}Repo;\n}`,
    );
  }

  // 4) add controller/service imports
  const ctrlImport = `import { register${Cap}Routes } from './${plural}/${singular}.controller';`;
  const svcImport = `import { ${Cap}Service } from './${plural}/${singular}.service';`;

  if (!reg.includes(ctrlImport)) {
    // insert near other local imports
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

  // 5) register inside registerAll()
  const callLine = `      await register${Cap}Routes(app, new ${Cap}Service(adapters.${singular}));`;
  if (!reg.includes(callLine)) {
    reg = reg.replace(
      /async\s+registerAll\s*\(\s*app\s*:\s*FastifyInstance\s*\)\s*\{\s*([\s\S]*?)\n\s*\}\s*,?/m,
      (m, body) => {
        // insert before closing brace of the method
        const bodyWithCall = body.includes(callLine)
          ? body
          : body + `\n${callLine}\n`;
        return m.replace(body, bodyWithCall);
      },
    );
  }

  tree.write(registerPath, reg);

  await formatFiles(tree);
  console.log(`[workbench-api-resource] OK -> ${plural}`);
}
