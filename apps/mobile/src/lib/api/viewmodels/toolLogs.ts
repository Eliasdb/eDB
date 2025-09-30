// apps/mobile/src/lib/viewmodels/toolLogs.ts
import type { ToolLogEntry } from '../core/types';

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
  const args: any = e.args ?? {};
  const res: any = e.result ?? {};
  const kind: VMKind | undefined =
    args.kind || guessKindFromResult(res) || undefined;

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
    vm.subject =
      args?.data?.title ||
      args?.data?.name ||
      res?.title ||
      res?.name ||
      '(unnamed)';
    vm.subtitle = `new ${kindToNoun(kind)}`;
  } else if (name === 'hub.update') {
    vm.verb = 'update';
    vm.subject = res?.title || res?.name || args?.id || '(unknown)';
    const changed = Object.keys(args?.patch ?? {});
    vm.subtitle = changed.length
      ? `changed: ${changed.join(', ')}`
      : 'changed details';
  } else if (name === 'hub.delete') {
    vm.verb = 'delete';
    vm.subject = args?.id || '(unknown)';
    vm.subtitle = `deleted ${kindToNoun(kind)}`;
  } else if (name === 'hub.list_kind') {
    vm.verb = 'list';
    const count = Array.isArray(res) ? res.length : 0;
    vm.subject = `${count} ${nounPlural(kindToNoun(kind))}`;
    vm.subtitle = `listed ${kindToNoun(kind)}s`;
  } else if (name === 'hub.list') {
    vm.verb = 'read';
    vm.subject = 'Hub snapshot';
    vm.subtitle = `${res?.tasks?.length ?? 0} tasks • ${res?.contacts?.length ?? 0} contacts • ${res?.companies?.length ?? 0} companies`;
  }

  return vm;
}

export function buildSummaryRows(e: ToolLogEntry) {
  const name = (e.name ?? '').replace(/_/g, '.');
  const args: any = e.args ?? {};
  const res: any = e.result ?? {};

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
    rows.push({ label: 'Kind', value: args.kind });
    Object.entries(args.data ?? {}).forEach(([k, v]) =>
      rows.push({ label: cap(k), value: String(v) }),
    );
  } else if (name === 'hub.update') {
    rows.push({ label: 'Kind', value: args.kind });
    rows.push({ label: 'ID', value: args.id });
    const changed = Object.keys(args.patch ?? {});
    rows.push({
      label: 'Changed fields',
      value: changed.length ? changed.join(', ') : '(none)',
    });
  } else if (name === 'hub.delete') {
    rows.push({ label: 'Kind', value: args.kind });
    rows.push({ label: 'ID', value: args.id });
  } else if (name === 'hub.list_kind') {
    rows.push({ label: 'Kind', value: args.kind });
    rows.push({
      label: 'Count',
      value: String(Array.isArray(res) ? res.length : 0),
    });
  } else if (name === 'hub.list') {
    rows.push({ label: 'Tasks', value: String(res?.tasks?.length ?? 0) });
    rows.push({ label: 'Contacts', value: String(res?.contacts?.length ?? 0) });
    rows.push({
      label: 'Companies',
      value: String(res?.companies?.length ?? 0),
    });
  }
  return rows;
}

/* helpers */
function guessKindFromResult(res: any): LogVM['kind'] | undefined {
  if (!res) return;
  if (Array.isArray(res) && res[0]) return guessKindFromResult(res[0]);
  if (res.title || res.due || typeof res.done === 'boolean') return 'tasks';
  if (res.email || res.phone) return 'contacts';
  if (res.industry || res.domain) return 'companies';
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
