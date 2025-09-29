// apps/mobile/src/app/(features)/admin/logs/AdminLogTerminal.tsx
import React, { useMemo } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { LogVM } from '../../../../lib/viewmodels/toolLogs';

export default function AdminLogTerminal({
  items,
  refreshing,
  onRefresh,
  emptyText = 'No logs yet',
}: {
  items: LogVM[];
  refreshing: boolean;
  onRefresh: () => void;
  emptyText?: string;
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;

  const mono = useMemo(
    () =>
      (Platform.select({
        ios: { fontFamily: 'Menlo' },
        android: { fontFamily: 'monospace' },
        web: { fontFamily: 'monospace' },
      }) as any) || {},
    [],
  );

  // On web: allow vertical scroll inside a horizontal container
  const webTouch =
    Platform.OS === 'web'
      ? ({ touchAction: isNarrow ? 'pan-y' : 'pan-x pan-y' } as any)
      : {};

  const cfg = useMemo(() => {
    if (isNarrow) {
      return {
        fs: 11,
        fsMeta: 11,
        fsDetails: 11,
        rowPy: 4,
        headerPy: 6,
        radius: 12,
        W: { time: 40, action: undefined as number | undefined, ms: 44 },
        labels: { when: 'TIME', action: 'ACTION', ms: 'MS' },
        twoLine: true,
        containerMinWidth: Math.max(0, Math.floor(width - 32)),
        bodyHeight: undefined as number | undefined, // natural height on mobile
      };
    }
    return {
      fs: 12,
      fsMeta: 12,
      fsDetails: 12,
      rowPy: 8,
      headerPy: 8,
      radius: 16,
      W: { time: 110, action: 96, kind: 120, ms: 70 },
      labels: {
        when: 'WHEN',
        action: 'ACTION',
        kind: 'AREA',
        ms: 'DURATION',
        details: 'DETAILS',
      },
      twoLine: false,
      containerMinWidth: 720,
      bodyHeight: 560, // fixed terminal-like window on desktop
    };
  }, [isNarrow, width]);

  const Divider = () => (
    <View className="h-px bg-border dark:bg-border-dark opacity-60" />
  );

  return (
    <ScrollView
      horizontal={!isNarrow}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 12,
      }}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={!isNarrow}
      directionalLockEnabled
      style={webTouch}
    >
      <View style={{ minWidth: cfg.containerMinWidth, flex: 1 }}>
        <View
          className="overflow-hidden bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark"
          style={{ borderRadius: cfg.radius }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 12, paddingTop: cfg.headerPy }}>
            {isNarrow ? (
              <View
                className="flex-row items-center"
                style={{ paddingVertical: cfg.headerPy }}
              >
                <Cell w={cfg.W.time} mono dim fs={cfg.fs}>
                  {cfg.labels.when}
                </Cell>
                <Cell flex mono dim fs={cfg.fs}>
                  {cfg.labels.action}
                </Cell>
                <Cell w={cfg.W.ms} mono dim fs={cfg.fs} right>
                  {cfg.labels.ms}
                </Cell>
              </View>
            ) : (
              <View
                className="flex-row items-center"
                style={{ paddingVertical: cfg.headerPy }}
              >
                <Cell w={cfg.W.time} mono dim fs={cfg.fs}>
                  {cfg.labels.when}
                </Cell>
                <Cell w={cfg.W.action} mono dim fs={cfg.fs}>
                  {cfg.labels.action}
                </Cell>
                <Cell w={cfg.W.kind} mono dim fs={cfg.fs}>
                  {cfg.labels.kind}
                </Cell>
                <Cell w={cfg.W.ms} mono dim fs={cfg.fs}>
                  {cfg.labels.ms}
                </Cell>
                <Cell mono dim fs={cfg.fs}>
                  {cfg.labels.details}
                </Cell>
              </View>
            )}
            <Divider />
          </View>

          {/* Body */}
          <ScrollView
            nestedScrollEnabled
            directionalLockEnabled
            style={cfg.bodyHeight ? { maxHeight: cfg.bodyHeight } : { flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={true}
          >
            {items.length === 0 ? (
              <View className="px-3 py-3">
                <Text className="text-[13px] text-text-dim dark:text-text-dimDark text-center">
                  {emptyText}
                </Text>
              </View>
            ) : (
              items.map((it, idx) => (
                <Row
                  key={it.id}
                  vm={it}
                  monoStyle={mono}
                  cfg={cfg}
                  showDivider={idx < items.length - 1}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

/* -------------------- pieces -------------------- */

function Row({
  vm,
  monoStyle,
  cfg,
  showDivider,
}: {
  vm: LogVM;
  monoStyle: any;
  cfg: any;
  showDivider: boolean;
}) {
  const ok = vm.ok;
  const details = vm.subject || vm.subtitle || vm.name || '(no subject)';

  // dot style (green/red)
  const Dot = (
    <Text
      style={[
        monoStyle,
        {
          display: 'inline',
          color: ok ? '#16a34a' : '#ef4444',
          marginRight: 6,
        },
      ]}
    >
      •
    </Text>
  );

  if (cfg.twoLine) {
    return (
      <View>
        <View
          className="flex-row items-center"
          style={{ paddingHorizontal: 12, paddingVertical: cfg.rowPy }}
        >
          <Cell w={cfg.W.time} mono style={monoStyle} fs={cfg.fsMeta} dim={!ok}>
            {timeAgo(vm.ts, true)}
          </Cell>
          <Cell flex mono style={monoStyle} fs={cfg.fsMeta}>
            {Dot}
            {vm.verb.toUpperCase()}
          </Cell>
          <Cell
            w={cfg.W.ms}
            mono
            style={monoStyle}
            fs={cfg.fsMeta}
            right
            dim={!vm.durationMs}
          >
            {formatMs(vm.durationMs)}
          </Cell>
        </View>

        <View style={{ paddingHorizontal: 12, paddingBottom: cfg.rowPy - 1 }}>
          <Text
            numberOfLines={1}
            className="text-text-dim dark:text-text-dimDark"
            style={[monoStyle, { fontSize: cfg.fsDetails }]}
          >
            {(vm.kind || '–') + ' · ' + truncate(details, 80)}
          </Text>
        </View>

        {showDivider ? (
          <View className="h-px bg-border dark:bg-border-dark" />
        ) : null}
      </View>
    );
  }

  // DESKTOP / oneLine
  return (
    <View>
      <View
        className="flex-row items-center"
        style={{ paddingHorizontal: 12, paddingVertical: cfg.rowPy }}
      >
        <Cell w={cfg.W.time} mono style={monoStyle} fs={cfg.fs} dim={!ok}>
          {timeAgo(vm.ts)}
        </Cell>
        <Cell w={cfg.W.action} mono style={monoStyle} fs={cfg.fs}>
          {Dot}
          {vm.verb.toUpperCase()}
        </Cell>
        <Cell w={cfg.W.kind} mono style={monoStyle} fs={cfg.fs} dim={!vm.kind}>
          {vm.kind || '-'}
        </Cell>
        <Cell w={cfg.W.ms} mono style={monoStyle} fs={cfg.fs}>
          {formatMs(vm.durationMs)}
        </Cell>
        <Cell mono style={monoStyle} fs={cfg.fs}>
          {truncate(details, 140)}
        </Cell>
      </View>
      {showDivider ? (
        <View className="h-px bg-border dark:bg-border-dark" />
      ) : null}
    </View>
  );
}

function Cell({
  children,
  w,
  flex,
  mono,
  dim,
  right,
  className,
  style,
  fs = 12,
}: {
  children: React.ReactNode;
  w?: number;
  flex?: boolean;
  mono?: boolean;
  dim?: boolean;
  right?: boolean;
  className?: string;
  style?: any;
  fs?: number;
}) {
  return (
    <View
      style={[
        w ? { width: w } : undefined,
        flex ? { flex: 1 } : undefined,
        right ? { alignItems: 'flex-end' } : undefined,
      ]}
    >
      <Text
        numberOfLines={1}
        className={`${
          dim
            ? 'text-text-dim dark:text-text-dimDark'
            : 'text-text dark:text-text-dark'
        } ${className || ''}`}
        style={[mono ? style : undefined, { fontSize: fs }]}
      >
        {children}
      </Text>
    </View>
  );
}

/* -------------------- utils -------------------- */
function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, Math.max(0, n - 1)) + '…';
}

function timeAgo(ts: number, compact = false) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return compact ? `${s}s` : `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return compact ? `${m}m` : `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return compact ? `${h}h` : `${h}h ago`;
  const d = Math.round(h / 24);
  return compact ? `${d}d` : `${d}d ago`;
}
const formatMs = (ms: number) => `${Math.max(0, Math.round(ms))}ms`;
