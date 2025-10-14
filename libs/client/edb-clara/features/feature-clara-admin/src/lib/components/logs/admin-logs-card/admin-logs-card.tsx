import { useState } from 'react';

import { Badge, Card, Dot, KV, MonoKV, Segmented } from '@edb/shared-ui-rn';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

import type { LogVM } from '@data-access/observability/tool-logs';
import { buildSummaryRows } from '@data-access/observability/tool-logs';

type Tab = 'summary' | 'raw';

export function AdminLogsCard({ vm }: { vm: LogVM }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('summary');

  return (
    <Card className="mx-4 mb-3 rounded-xl border border-border dark:border-border-dark">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-3 shrink">
          <Dot ok={vm.ok} />
          <Badge label={vm.verb.toUpperCase()} tint={verbTint(vm.verb)} />
          {vm.kind ? (
            <View className="px-2 py-1 rounded-full bg-muted dark:bg-muted-dark">
              <Text className="text-xs font-semibold text-text-dim dark:text-text-dimDark">
                {vm.kind}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="text-xs text-text-dim dark:text-text-dimDark tabular-nums">
            {formatMs(vm.durationMs)}
          </Text>
          <Text className="text-xs text-text-dim dark:text-text-dimDark">
            {timeAgo(vm.ts)}
          </Text>
          <TouchableOpacity onPress={() => setOpen((v) => !v)} hitSlop={8}>
            <Text className="text-text-dim dark:text-text-dimDark">
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="currentColor"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full subject inside card */}
      {vm.subject ? (
        <Text className="mt-3 text-[16px] font-extrabold text-text dark:text-text-dark">
          {vm.subject}
        </Text>
      ) : null}

      {/* Subline */}
      {(vm.subtitle || vm.error) && (
        <Text className="mt-1.5 text-sm text-text-dim dark:text-text-dimDark">
          {vm.subtitle}
          {vm.error ? ` • ❗ ${vm.error}` : ''}
        </Text>
      )}

      {/* Details */}
      {open && (
        <View className="mt-4 gap-3">
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
              className="rounded-lg bg-muted dark:bg-muted-dark border border-border dark:border-border-dark p-3"
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
              className="rounded-lg bg-muted dark:bg-muted-dark border border-border dark:border-border-dark p-3 gap-3"
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

function timeAgo(ts: number) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

const formatMs = (ms: number) => `${Math.max(0, Math.round(ms))}ms`;
