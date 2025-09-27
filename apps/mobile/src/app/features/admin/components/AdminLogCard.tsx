// apps/mobile/src/lib/components/AdminLogCard.tsx
import { Ionicons } from '@expo/vector-icons';
import { Badge, Card, Chip, Dot, KV, MonoKV, Row, Segmented } from '@ui';
import { useState } from 'react';
import { Text, View } from 'react-native';
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
          <Text
            className="text-[16px] font-extrabold text-text dark:text-text-dark flex-shrink"
            numberOfLines={1}
          >
            {vm.subject}
          </Text>
        </Row>
        <Row center style={{ gap: 8 }}>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark tabular-nums">
            {formatMs(vm.durationMs)}
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            {timeAgo(vm.ts)}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#9CA3AF" // gray-400, can be replaced with theme
            onPress={() => setOpen((v) => !v)}
          />
        </Row>
      </Row>

      <Text
        className="mt-0.5 text-[12px] text-text-dim dark:text-text-dimDark"
        numberOfLines={2}
      >
        {vm.subtitle}
        {vm.error ? ` • ❗ ${vm.error}` : ''}
      </Text>

      {open && (
        <View className="mt-2.5 gap-2.5">
          <Segmented<'summary' | 'raw'>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'summary', label: 'Summary' },
              { value: 'raw', label: 'Raw' },
            ]}
          />
          {tab === 'summary' ? (
            <Card
              inset
              className="bg-muted dark:bg-muted-dark border border-border dark:border-border-dark"
            >
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
            <Card
              inset
              className="bg-muted dark:bg-muted-dark border border-border dark:border-border-dark"
            >
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
      return '#16a34a'; // success
    case 'update':
      return '#2563eb'; // info
    case 'delete':
      return '#ef4444'; // danger
    case 'list':
    case 'read':
      return '#6b7280'; // dim
    default:
      return '#a855f7'; // violet
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

const formatMs = (ms: number) => `${Math.max(0, Math.round(ms))}ms`;
