import { Tree, names } from '@nx/devkit';

/* ───────────────────── Common Types ───────────────────── */
export type Schema = {
  belongsTo: string;
  fk?: string;
  include?: string;
  onDelete?: 'restrict' | 'setNull' | 'cascade';
  select?: string;
  revert?: boolean;
};

export type ContractField = {
  fieldName: string;
  required: boolean;
  tsType: string;
  zodBase: string;
};

export type ContractJSON = {
  name: string;
  plural: string;
  fieldsString?: string;
  fields: ContractField[];
  relationships?: {
    belongsTo?: Array<{
      name: string;
      to: string;
      fk: string;
      required: boolean;
      include?: boolean;
      select?: string[];
      onDelete?: 'restrict' | 'setNull' | 'cascade';
    }>;
  };
};

/* ───────────────────── Small utils ───────────────────── */
export const singularize = (s: string) =>
  s.endsWith('s') ? s.slice(0, -1) : s;
export const snake = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

export function read(tree: Tree, p: string) {
  const buf = tree.read(p);
  if (!buf) throw new Error(`Missing file: ${p}`);
  return buf.toString('utf-8');
}
export function writeIfChanged(tree: Tree, p: string, next: string): boolean {
  const prev = tree.exists(p) ? read(tree, p) : undefined;
  if (prev === next) return false;
  tree.write(p, next);
  return true;
}
export function addImportAfterImports(src: string, importLine: string): string {
  const line = importLine.trim();
  if (src.includes(line)) return src;
  const lines = src.split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++)
    if (/^\s*import\s/.test(lines[i])) last = i;
  lines.splice(last >= 0 ? last + 1 : 0, 0, line);
  return lines.join('\n');
}
/** Insert after drizzle pg-core import if present, else after first import block, else at top. */
export function insertImportSafely(src: string, importLine: string): string {
  if (src.includes(importLine)) return src;
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes(`from 'drizzle-orm/pg-core'`) ||
      lines[i].includes(`from "drizzle-orm/pg-core"`)
    ) {
      while (i < lines.length && !lines[i].trim().endsWith(';')) i++;
      lines.splice(i + 1, 0, importLine);
      return lines.join('\n');
    }
  }
  let j = 0;
  while (j < lines.length && lines[j].startsWith('import ')) {
    while (j < lines.length && !lines[j].trim().endsWith(';')) j++;
    j++;
  }
  lines.splice(Math.max(0, j), 0, importLine);
  return lines.join('\n');
}
export const normalizeMin = (s: string) => s.replace(/\s+/g, '');

export function loadContractJSON(
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

/* ─────────────── Find/parse pgTable('x', { ... }) ─────────────── */
export function findPgTableBlock(src: string, tablePlural: string) {
  const varDecl = new RegExp(
    String.raw`export\s+const\s+${tablePlural}Table\s*=\s*pgTable\s*\(\s*['"]${tablePlural}['"]\s*,\s*\{`,
    'm',
  );
  const m = varDecl.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  while (i < src.length) {
    const ch = src[i++];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const end = i - 1;
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

export function splitTopLevelProps(block: string): Array<{
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
  let i = 0,
    segStart = 0;
  let inStr: '"' | "'" | '`' | null = null;
  let esc = false;
  let p = 0,
    b = 0,
    c = 0;
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
      const piece = block.slice(segStart, i + 1);
      const nameMatch = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/.exec(piece);
      const name = nameMatch ? nameMatch[1] : null;
      const indent = ((): string => /^\s*/.exec(piece)?.[0] ?? '')();
      res.push({ name, text: piece, start: segStart, end: i + 1, indent });
      segStart = i + 1;
    }
    i++;
  }
  if (segStart < block.length) {
    const piece = block.slice(segStart);
    const nameMatch = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/.exec(piece);
    const name: string | null = nameMatch?.[1] ?? null;
    const indent = ((): string => /^\s*/.exec(piece)?.[0] ?? '')();
    res.push({ name, text: piece, start: segStart, end: block.length, indent });
  }
  return res.filter((p) => p.name !== null);
}

/* ───────────────────── Convenience ───────────────────── */
export function deriveNames(belongsTo: string) {
  const [childRaw, parentRaw] = belongsTo.split(':').map((s) => s.trim());
  const child = names(childRaw).fileName;
  const parent = names(parentRaw).fileName;
  const childSingular = singularize(child);
  const parentSingular = singularize(parent);
  const CapChild = names(childSingular).className;
  return { child, parent, childSingular, parentSingular, CapChild };
}
