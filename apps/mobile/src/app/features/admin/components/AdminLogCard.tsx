// apps/mobile/src/lib/components/AdminLogCard.tsx
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Chip, Dot, KV, MonoKV, Row, Segmented } from '@ui';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LogVM } from '../../../../lib/viewmodels/toolLogs';
import { buildSummaryRows } from '../../../../lib/viewmodels/toolLogs';

type Tab = 'summary' | 'raw';

export default function AdminLogCard({ vm }: { vm: LogVM }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('summary');

  return (
    <Card style={{ marginHorizontal: 12 }}>
      <Row center style={{ justifyContent: 'space-between' }}>
        <Row center style={{ gap: 8, flexShrink: 1 }}>
          <Dot ok={vm.ok} />
          <Badge label={vm.verb.toUpperCase()} tint={verbTint(vm.verb)} />
          {vm.kind ? <Chip label={vm.kind} /> : null}
          <Text style={styles.subject} numberOfLines={1}>
            {vm.subject}
          </Text>
        </Row>
        <Row center style={{ gap: 8 }}>
          <Text style={styles.metaNum}>{formatMs(vm.durationMs)}</Text>
          <Text style={styles.metaDim}>{timeAgo(vm.ts)}</Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#9aa0a6"
            onPress={() => setOpen((v) => !v)}
          />
        </Row>
      </Row>

      <Text style={styles.subline} numberOfLines={2}>
        {vm.subtitle}
        {vm.error ? ` • ❗ ${vm.error}` : ''}
      </Text>

      {open && (
        <View style={{ marginTop: 10, gap: 10 }}>
          <Segmented<'summary' | 'raw'>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'summary', label: 'Summary' },
              { value: 'raw', label: 'Raw' },
            ]}
          />
          {tab === 'summary' ? (
            <Card inset style={styles.innerCard}>
              {buildSummaryRows({
                id: vm.id,
                ts: vm.ts,
                name: vm.name,
                durationMs: vm.durationMs,
                args: vm.args,
                result: vm.result,
                error: vm.error,
              } as any).map((r) => (
                <KV key={r.label} label={r.label} value={r.value} />
              ))}
            </Card>
          ) : (
            <Card inset style={styles.innerCard}>
              <MonoKV label="Args" value={vm.args} />
              {vm.error ? (
                <MonoKV label="Error" value={vm.error} />
              ) : (
                <MonoKV label="Result" value={vm.result} />
              )}
            </Card>
          )}
        </View>
      )}
    </Card>
  );
}

function verbTint(v: LogVM['verb']) {
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
const styles = StyleSheet.create({
  subject: { fontSize: 16, fontWeight: '800', color: '#111827', flexShrink: 1 },
  subline: { marginTop: 2, color: '#667085', fontSize: 12 },
  metaNum: { fontSize: 12, color: '#6b7280', fontVariant: ['tabular-nums'] },
  metaDim: { fontSize: 12, color: '#9aa0a6' },
  innerCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}
const formatMs = (ms: number) => `${Math.max(0, Math.round(ms))}ms`;
