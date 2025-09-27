// apps/mobile/src/app/(tabs)/admin-logs.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useToolLogs } from '../../lib/api/hooks';
import type { ToolLogEntry } from '../../lib/api/types';

type TabKind = 'summary' | 'raw';

export default function AdminLogsScreen() {
  const { data = [], isLoading, isRefetching, refetch } = useToolLogs();
  return (
    <View style={styles.screen}>
      <FlatList<ToolLogEntry>
        data={data}
        keyExtractor={(x) => x.id}
        refreshControl={
          <RefreshControl
            refreshing={!!isRefetching && !isLoading}
            onRefresh={refetch}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <LogCard entry={item} />}
        ListFooterComponent={<View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#8b9098' }}>
              No tool calls yet — trigger one and this page will update live.
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* ---------------- card ---------------- */

function LogCard({ entry }: { entry: ToolLogEntry }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKind>('summary');

  const view = useMemo(() => toViewModel(entry), [entry]);
  const ok = !entry.error;

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.9}
        style={styles.headerRow}
      >
        <View style={styles.headerLeft}>
          <Dot ok={ok} />
          <Badge label={view.verb.toUpperCase()} tint={verbTint(view.verb)} />
          {view.kind ? <Chip label={view.kind} /> : null}
          <Text style={styles.subject} numberOfLines={1}>
            {view.subject}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.metaNum}>{formatMs(entry.durationMs)}</Text>
          <Text style={styles.metaDim}>{timeAgo(entry.ts)}</Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#9aa0a6"
          />
        </View>
      </TouchableOpacity>

      {/* Subline */}
      <Text style={styles.subline} numberOfLines={2}>
        {view.subtitle}
        {entry.error ? ` • ❗ ${entry.error}` : ''}
      </Text>

      {/* Body */}
      {open ? (
        <View style={{ marginTop: 10, gap: 10 }}>
          <Segmented tab={tab} setTab={setTab} />
          {tab === 'summary' ? (
            <SummaryCard entry={entry} />
          ) : (
            <RawCard entry={entry} />
          )}
        </View>
      ) : null}
    </View>
  );
}

/* ---------------- view model & helpers ---------------- */

type VM = {
  verb: 'create' | 'update' | 'delete' | 'list' | 'read' | 'run';
  kind?: 'tasks' | 'contacts' | 'companies';
  subject: string; // e.g., “Alex Peterson”, “3 companies”, “Hub snapshot”
  subtitle: string; // small context line
};

function toViewModel(entry: ToolLogEntry): VM {
  const name = entry.name?.replace(/_/g, '.') ?? '';
  const args: any = entry.args ?? {};
  const res: any = entry.result ?? {};
  const kind: VM['kind'] = args.kind || guessKindFromResult(res) || undefined;

  const vm: VM = { verb: 'run', kind, subject: '—', subtitle: `tool: ${name}` };

  if (name === 'hub.create') {
    vm.verb = 'create';
    const subject =
      args?.data?.title ||
      args?.data?.name ||
      res?.title ||
      res?.name ||
      '(unnamed)';
    vm.subject = subject;
    vm.subtitle = `new ${kindToNoun(kind)}`;
    return vm;
  }

  if (name === 'hub.update') {
    vm.verb = 'update';
    const target = res?.title || res?.name || args?.id || '(unknown)';
    const changed = Object.keys(args?.patch ?? {});
    vm.subject = target;
    vm.subtitle =
      changed.length > 0 ? `changed: ${changed.join(', ')}` : `changed details`;
    return vm;
  }

  if (name === 'hub.delete') {
    vm.verb = 'delete';
    vm.subject = args?.id || '(unknown)';
    vm.subtitle = `deleted ${kindToNoun(kind)}`;
    return vm;
  }

  if (name === 'hub.list_kind') {
    vm.verb = 'list';
    const count = Array.isArray(res) ? res.length : 0;
    vm.subject = `${count} ${nounPlural(kindToNoun(kind))}`;
    vm.subtitle = `listed ${kindToNoun(kind)}s`;
    return vm;
  }

  if (name === 'hub.list') {
    vm.verb = 'read';
    vm.subject = 'Hub snapshot';
    const t = res?.tasks?.length ?? 0;
    const c = res?.contacts?.length ?? 0;
    const co = res?.companies?.length ?? 0;
    vm.subtitle = `${t} tasks • ${c} contacts • ${co} companies`;
    return vm;
  }

  return vm;
}

function guessKindFromResult(res: any): VM['kind'] | undefined {
  if (!res) return;
  if (Array.isArray(res) && res[0]) return guessKindFromResult(res[0]);
  if (res.title || res.due || typeof res.done === 'boolean') return 'tasks';
  if (res.email || res.phone) return 'contacts';
  if (res.industry || res.domain) return 'companies';
  return;
}
const kindToNoun = (k?: VM['kind']) =>
  k === 'tasks'
    ? 'task'
    : k === 'contacts'
      ? 'contact'
      : k === 'companies'
        ? 'company'
        : 'item';
const nounPlural = (n: string) => (n === 'company' ? 'companies' : `${n}s`);

function verbTint(v: VM['verb']) {
  switch (v) {
    case 'create':
      return '#16a34a';
    case 'update':
      return '#2563eb';
    case 'delete':
      return '#ef4444';
    case 'list':
    case 'read':
      return '#6b7280';
    default:
      return '#a855f7';
  }
}

/* ---------------- body (Summary / Raw) ---------------- */

function SummaryCard({ entry }: { entry: ToolLogEntry }) {
  const rows = buildSummaryRows(entry);
  return (
    <View style={styles.innerCard}>
      {rows.map((r) => (
        <View key={r.label} style={{ marginBottom: 10 }}>
          <Text style={styles.kLabel}>{r.label}</Text>
          <Text style={styles.kValue} numberOfLines={4}>
            {r.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function buildSummaryRows(entry: ToolLogEntry) {
  const name = entry.name?.replace(/_/g, '.') ?? '';
  const args: any = entry.args ?? {};
  const res: any = entry.result ?? {};

  const rows: { label: string; value: string }[] = [
    { label: 'Tool', value: name },
    { label: 'When', value: new Date(entry.ts).toLocaleString() },
    { label: 'Duration', value: formatMs(entry.durationMs) },
  ];

  if (entry.error) {
    rows.push({ label: 'Error', value: String(entry.error) });
    return rows;
  }

  if (name === 'hub.create') {
    rows.push({ label: 'Kind', value: args.kind });
    const d = args.data ?? {};
    Object.entries(d).forEach(([k, v]) =>
      rows.push({ label: k[0].toUpperCase() + k.slice(1), value: String(v) }),
    );
  } else if (name === 'hub.update') {
    rows.push({ label: 'Kind', value: args.kind });
    rows.push({ label: 'ID', value: args.id });
    const patch = args.patch ?? {};
    const changed = Object.keys(patch);
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

function RawCard({ entry }: { entry: ToolLogEntry }) {
  return (
    <View style={styles.innerCard}>
      <MonoKV label="Args" value={entry.args} />
      {entry.error ? (
        <MonoKV label="Error" value={entry.error} />
      ) : (
        <MonoKV label="Result" value={entry.result} />
      )}
    </View>
  );
}

/* ---------------- small UI pieces ---------------- */

function Dot({ ok }: { ok: boolean }) {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: ok ? '#10b981' : '#ef4444',
      }}
    />
  );
}
function Badge({ label, tint }: { label: string; tint: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: withAlpha(tint, 0.12) }]}>
      <Text style={[styles.badgeText, { color: tint }]}>{label}</Text>
    </View>
  );
}
function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}
function Segmented({
  tab,
  setTab,
}: {
  tab: TabKind;
  setTab: (t: TabKind) => void;
}) {
  return (
    <View style={styles.segment}>
      <SegBtn
        label="Summary"
        on={tab === 'summary'}
        onPress={() => setTab('summary')}
      />
      <SegBtn label="Raw" on={tab === 'raw'} onPress={() => setTab('raw')} />
    </View>
  );
}
function SegBtn({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.segBtn, on && styles.segBtnOn]}
    >
      <Text style={[styles.segText, on && styles.segTextOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

function MonoKV({ label, value }: { label: string; value: any }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.kLabel}>{label}</Text>
      <Text style={styles.monoBlock} selectable>
        {pretty(value)}
      </Text>
    </View>
  );
}

/* ---------------- utils ---------------- */

function pretty(v: any) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}
function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}
function formatMs(ms: number) {
  return `${Math.max(0, Math.round(ms))}ms`;
}
function withAlpha(hex: string, a = 0.12) {
  // simple hex alpha -> rgba (for common named hexes)
  const m = /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex);
  if (!m) return hex;
  const [_, r, g, b] = m;
  return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${a})`;
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  subject: { fontSize: 16, fontWeight: '800', color: '#111827', flexShrink: 1 },
  subline: { marginTop: 2, color: '#667085', fontSize: 12 },

  metaNum: { fontSize: 12, color: '#6b7280', fontVariant: ['tabular-nums'] },
  metaDim: { fontSize: 12, color: '#9aa0a6' },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },

  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
  },
  chipText: { fontSize: 11, color: '#374151', fontWeight: '700' },

  segment: {
    backgroundColor: '#eef2f7',
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
  },
  segBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  segBtnOn: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  segText: { fontSize: 12, color: '#6b7280', fontWeight: '700' },
  segTextOn: { color: '#111827' },

  innerCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },

  kLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '800',
    marginBottom: 2,
  },
  kValue: { fontSize: 14, color: '#111827' },

  monoBlock: {
    fontSize: 12,
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: 'monospace',
    }) as any,
  },
});
