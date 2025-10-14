// apps/mobile/src/app/(features)/admin/logs/AdminLogTerminal.tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactNode, useCallback, useMemo, useRef } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { LogVM, entryToVM } from '@data-access/observability/tool-logs';

type Page = {
  items: any[];
  total: number;
  offset: number;
  limit: number;
  nextOffset: number | null;
  hasMore: boolean;
};

async function fetchToolLogsPage(offset = 0, limit = 10): Promise<Page> {
  const res = await fetch(
    `https://api.staging.eliasdebock.com/clara/realtime/tool-logs?offset=${offset}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

type Mode = 'standalone' | 'embedded';

export default function AdminLogsTerminal({
  emptyText = 'No logs yet',
  mode = 'embedded',
  pageSize = 10,
}: {
  emptyText?: string;
  mode?: Mode;
  pageSize?: number;
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tool-logs', pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => fetchToolLogsPage(pageParam, pageSize),
    getNextPageParam: (last) => (last.hasMore ? last.nextOffset! : undefined),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 0,
  });

  const flatItems: LogVM[] = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.items).map(entryToVM);
  }, [data]);

  /* ---------- guard onEndReached ---------- */
  const loadingMoreRef = useRef(false);
  const allowEndReachedRef = useRef(false);
  const listLayoutHRef = useRef(0);
  const contentHRef = useRef(0);

  const tryFetchNext = useCallback(() => {
    if (loadingMoreRef.current) return;
    if (!hasNextPage || isFetchingNextPage) return;
    loadingMoreRef.current = true;
    fetchNextPage().finally(() => {
      setTimeout(() => (loadingMoreRef.current = false), 80);
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onEndReachedGuarded = useCallback(() => {
    if (!allowEndReachedRef.current) return;
    if (contentHRef.current <= listLayoutHRef.current) return;
    tryFetchNext();
  }, [tryFetchNext]);

  /* ---------- styles/config ---------- */
  const mono = useMemo(
    () =>
      (Platform.select({
        ios: { fontFamily: 'Menlo' },
        android: { fontFamily: 'monospace' },
        web: { fontFamily: 'monospace' },
      }) as any) || {},
    [],
  );

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
    };
  }, [isNarrow, width]);

  const Divider = () => (
    <View className="h-px bg-border dark:bg-border-dark opacity-60" />
  );

  // ⬇️ This is the *table* header that should stay together with rows
  const TableHeader = () => (
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
  );

  const footer = isFetchingNextPage ? (
    <View className="p-3">
      <ActivityIndicator />
    </View>
  ) : data && !hasNextPage ? (
    <View className="p-3">
      <Text className="text-center text-text-dim dark:text-text-dimDark">
        No more logs
      </Text>
    </View>
  ) : contentHRef.current <= listLayoutHRef.current ? (
    <View className="p-3 items-center">
      <Text
        onPress={tryFetchNext}
        className="text-[13px] font-semibold text-primary"
      >
        Load older
      </Text>
    </View>
  ) : null;

  return (
    <View
      style={{
        minWidth: cfg.containerMinWidth,
        flex: 1,
        marginHorizontal: 16,
        marginTop: 12,
      }}
    >
      <View
        className="overflow-hidden bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark"
        style={{ borderRadius: cfg.radius, flex: 1 }} // ✅ give the card height
      >
        {/* Single FlatList: table header + rows together */}
        <FlatList
          style={{ flex: 1 }} // ✅ let the list fill the card
          data={flatItems}
          keyExtractor={(x) => x.id}
          ListHeaderComponent={TableHeader}
          renderItem={({ item, index }) => (
            <Row
              vm={item}
              monoStyle={mono}
              cfg={cfg}
              showDivider={index < flatItems.length - 1}
            />
          )}
          ListEmptyComponent={
            isLoading ? null : (
              <View className="px-3 py-3">
                <Text className="text-[13px] text-text-dim dark:text-text-dimDark text-center">
                  {emptyText}
                </Text>
              </View>
            )
          }
          ListFooterComponent={footer}
          contentContainerStyle={{ paddingBottom: 24 }}
          onScrollBeginDrag={() => {
            allowEndReachedRef.current = true;
          }}
          onMomentumScrollBegin={() => {
            allowEndReachedRef.current = true;
            loadingMoreRef.current = false;
          }}
          onEndReached={onEndReachedGuarded}
          onEndReachedThreshold={0.2}
          onLayout={(e) => {
            listLayoutHRef.current = e.nativeEvent.layout.height;
          }}
          onContentSizeChange={(_, h) => {
            contentHRef.current = h;
          }}
          refreshing={!!isRefetching && !isLoading}
          onRefresh={() => {
            allowEndReachedRef.current = false;
            refetch();
          }}
          initialNumToRender={10}
          windowSize={10}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

/* -------------------- Row / Cell / utils -------------------- */
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
  children: ReactNode;
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
        className={`${dim ? 'text-text-dim dark:text-text-dimDark' : 'text-text dark:text-text-dark'} ${className || ''}`}
        style={[mono ? style : undefined, { fontSize: fs }]}
      >
        {children}
      </Text>
    </View>
  );
}

/* utils */
function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, Math.max(0, n - 1)) + '…';
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
