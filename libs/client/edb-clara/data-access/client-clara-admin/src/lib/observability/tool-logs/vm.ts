// apps/mobile/src/lib/viewmodels/toolLogs.ts
import type { ToolLogEntry } from './types';

export type VMVerb = 'create' | 'update' | 'delete' | 'list' | 'read' | 'run';
export type VMKind = 'tasks' | 'contacts' | 'companies';

export type LogVM = {
  id: string;
  ok: boolean;
  verb: VMVerb;
  kind?: VMKind;
  subject: string;
  subtitle: string;
  durationMs: number;
  ts: number;
  name: string; // tool name (dot form)
  args: unknown;
  result?: unknown;
  error?: string;
};

export function entryToVM(e: ToolLogEntry): LogVM {
  const name = (e.name ?? '').replace(/_/g, '.');
  const args = toRecord(e.args);
  const res = toRecord(e.result);

  const kind: VMKind | undefined =
    parseKind(args['kind']) || guessKindFromResult(res) || undefined;

  const vm: LogVM = {
    id: e.id,
    ok: !e.error,
    verb: 'run',
    kind,
    subject: '—',
    subtitle: `tool: ${name}`,
    durationMs: e.durationMs,
    ts: e.ts,
    name,
    args: e.args,
    result: e.result,
    error: e.error,
  };

  if (name === 'hub.create') {
    vm.verb = 'create';
    const data = toRecord(args['data']);
    vm.subject =
      stringish(data['title']) ||
      stringish(data['name']) ||
      stringish(res['title']) ||
      stringish(res['name']) ||
      '(unnamed)';
    vm.subtitle = `new ${kindToNoun(kind)}`;
  } else if (name === 'hub.update') {
    vm.verb = 'update';
    vm.subject =
      stringish(res['title']) ||
      stringish(res['name']) ||
      stringish(args['id']) ||
      '(unknown)';
    const patch = toRecord(args['patch']);
    const changed = Object.keys(patch);
    vm.subtitle = changed.length
      ? `changed: ${changed.join(', ')}`
      : 'changed details';
  } else if (name === 'hub.delete') {
    vm.verb = 'delete';
    vm.subject = stringish(args['id']) || '(unknown)';
    vm.subtitle = `deleted ${kindToNoun(kind)}`;
  } else if (name === 'hub.list_kind') {
    vm.verb = 'list';
    const count = Array.isArray(res) ? res.length : 0;
    vm.subject = `${count} ${nounPlural(kindToNoun(kind))}`;
    vm.subtitle = `listed ${kindToNoun(kind)}s`;
  } else if (name === 'hub.list') {
    vm.verb = 'read';
    vm.subject = 'Hub snapshot';
    const tasksCount = Array.isArray(res['tasks']) ? res['tasks'].length : 0;
    const contactsCount = Array.isArray(res['contacts'])
      ? res['contacts'].length
      : 0;
    const companiesCount = Array.isArray(res['companies'])
      ? res['companies'].length
      : 0;
    vm.subtitle = `${tasksCount} tasks • ${contactsCount} contacts • ${companiesCount} companies`;
  }

  return vm;
}

export function buildSummaryRows(e: ToolLogEntry) {
  const name = (e.name ?? '').replace(/_/g, '.');
  const args = toRecord(e.args);
  const res = toRecord(e.result);

  const rows: { label: string; value: string }[] = [
    { label: 'Tool', value: name },
    { label: 'When', value: new Date(e.ts).toLocaleString() },
    { label: 'Duration', value: `${Math.max(0, Math.round(e.durationMs))}ms` },
  ];

  if (e.error) {
    rows.push({ label: 'Error', value: String(e.error) });
    return rows;
  }

  if (name === 'hub.create') {
    rows.push({ label: 'Kind', value: String(args['kind'] ?? '') });
    Object.entries(toRecord(args['data'])).forEach(([k, v]) =>
      rows.push({ label: cap(k), value: String(v) }),
    );
  } else if (name === 'hub.update') {
    rows.push({ label: 'Kind', value: String(args['kind'] ?? '') });
    rows.push({ label: 'ID', value: String(args['id'] ?? '') });
    const patch = toRecord(args['patch']);
    const changed = Object.keys(patch);
    rows.push({
      label: 'Changed fields',
      value: changed.length ? changed.join(', ') : '(none)',
    });
  } else if (name === 'hub.delete') {
    rows.push({ label: 'Kind', value: String(args['kind'] ?? '') });
    rows.push({ label: 'ID', value: String(args['id'] ?? '') });
  } else if (name === 'hub.list_kind') {
    rows.push({ label: 'Kind', value: String(args['kind'] ?? '') });
    rows.push({
      label: 'Count',
      value: String(Array.isArray(res) ? res.length : 0),
    });
  } else if (name === 'hub.list') {
    rows.push({ label: 'Tasks', value: String(arrayLen(res['tasks'])) });
    rows.push({ label: 'Contacts', value: String(arrayLen(res['contacts'])) });
    rows.push({
      label: 'Companies',
      value: String(arrayLen(res['companies'])),
    });
  }
  return rows;
}

/* helpers */
const stringish = (v: unknown) =>
  typeof v === 'string' && v.trim() ? v : undefined;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const toRecord = (v: unknown): Record<string, unknown> =>
  isRecord(v) ? v : {};

const parseKind = (val: unknown): VMKind | undefined => {
  const k = typeof val === 'string' ? val : undefined;
  return k === 'tasks' || k === 'contacts' || k === 'companies' ? k : undefined;
};

const hasFlag = (obj: Record<string, unknown>, key: string) =>
  obj[key] !== undefined;

function guessKindFromResult(res: unknown): LogVM['kind'] | undefined {
  if (!res) return;
  if (Array.isArray(res) && res[0]) return guessKindFromResult(res[0]);
  if (!isRecord(res)) return undefined;
  const r = res;
  if (
    hasFlag(r, 'title') ||
    hasFlag(r, 'due') ||
    typeof r['done'] === 'boolean'
  )
    return 'tasks';
  if (hasFlag(r, 'email') || hasFlag(r, 'phone')) return 'contacts';
  if (hasFlag(r, 'industry') || hasFlag(r, 'domain')) return 'companies';
  return undefined;
}
const kindToNoun = (k?: LogVM['kind']) =>
  k === 'tasks'
    ? 'task'
    : k === 'contacts'
      ? 'contact'
      : k === 'companies'
        ? 'company'
        : 'item';
const nounPlural = (n: string) => (n === 'company' ? 'companies' : `${n}s`);
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const arrayLen = (v: unknown) => (Array.isArray(v) ? v.length : 0);
