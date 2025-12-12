// src/utils/journal.ts
import { Tree, joinPathFragments } from '@nx/devkit';
import { createHash } from 'node:crypto';

export type Change = {
  file: string;
  action: 'create' | 'update';
  before?: string; // undefined for create
  after: string;
  beforeHash?: string;
  afterHash: string;
};

export type RunManifest = {
  id: string;
  generator: string; // e.g. "workbench-api-model"
  target: string; // e.g. "mission" (singular)
  when: string;
  changes: Change[];
};

// Always return a string for hashes
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

// Optional variant for beforeHash
const shaOpt = (s?: string) => (typeof s === 'string' ? sha(s) : undefined);

const normalizeWhitespace = (s: string | undefined) =>
  (s ?? '').replace(/\s+/g, ' ').trim();

/** Allow reverts even if `formatFiles` changed whitespace. */
function equivalent(a?: string, b?: string) {
  if (a === b) return true;
  return normalizeWhitespace(a) === normalizeWhitespace(b);
}

export function startRun(generator: string, target: string): RunManifest {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, generator, target, when: new Date().toISOString(), changes: [] };
}

export function recordChange(
  m: RunManifest,
  file: string,
  before: string | undefined,
  after: string,
  action: 'create' | 'update',
) {
  m.changes.push({
    file,
    action,
    before,
    after,
    beforeHash: shaOpt(before),
    afterHash: sha(after), // now always a string
  });
}

export function safeWrite(
  tree: Tree,
  m: RunManifest,
  file: string,
  next: string,
) {
  const existed = tree.exists(file);
  const before = existed ? tree.read(file, 'utf-8')! : undefined;
  if (before === next) return false; // no-op
  tree.write(file, next);
  recordChange(m, file, before, next, existed ? 'update' : 'create');
  return true;
}

export function writeRun(tree: Tree, m: RunManifest) {
  const dir = `.edb/gens/${m.generator}/${m.target}`;
  const path = joinPathFragments(dir, `${m.id}.json`);
  if (!tree.exists(dir)) tree.write(joinPathFragments(dir, '.gitkeep'), '');
  tree.write(path, JSON.stringify(m, null, 2));
  tree.write(joinPathFragments(dir, '_LATEST'), m.id + '\n');
  return path;
}

export function readRun(
  tree: Tree,
  generator: string,
  target: string,
  runId?: string,
): RunManifest {
  const dir = `.edb/gens/${generator}/${target}`;
  const latestPath = joinPathFragments(dir, '_LATEST');
  const id =
    runId ??
    (tree.exists(latestPath)
      ? tree.read(latestPath, 'utf-8')!.trim()
      : undefined);
  if (!id) throw new Error(`No recorded runs for ${generator}/${target}`);
  const path = joinPathFragments(dir, `${id}.json`);
  const raw = tree.read(path, 'utf-8');
  if (!raw) throw new Error(`Run manifest not found: ${path}`);
  return JSON.parse(raw) as RunManifest;
}

/** Update the manifest's "after" snapshots to reflect post-format content. */
export function finalizeRunAfterFormat(
  tree: Tree,
  m: RunManifest,
  manifestPath: string,
) {
  m.changes = m.changes.map((c) => {
    const cur = tree.exists(c.file) ? tree.read(c.file, 'utf-8')! : '';
    return { ...c, after: cur, afterHash: sha(cur) };
    //                     ^ always string
  });
  tree.write(manifestPath, JSON.stringify(m, null, 2));
}

export function revertRun(
  tree: Tree,
  m: RunManifest,
  opts: { force?: boolean } = {},
) {
  for (let i = m.changes.length - 1; i >= 0; i--) {
    const c = m.changes[i];
    const current = tree.exists(c.file)
      ? tree.read(c.file, 'utf-8')!
      : undefined;

    if (!opts.force && !equivalent(current, c.after)) {
      throw new Error(
        `Refusing to revert ${c.file}: current content diverged from recorded state.\n` +
          `Tip: re-run with --force to override.`,
      );
    }
    if (c.action === 'create') {
      if (tree.exists(c.file)) tree.delete(c.file);
    } else {
      tree.write(c.file, c.before ?? '');
    }
  }

  // Optionally prune manifest
  const dir = `.edb/gens/${m.generator}/${m.target}`;
  const manifestPath = joinPathFragments(dir, `${m.id}.json`);
  if (tree.exists(manifestPath)) tree.delete(manifestPath);
}
