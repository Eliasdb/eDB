import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Card } from '@ui/primitives';
import { Badge } from '@ui/primitives/primitives';

type JSONSchema = any;

type ToolMeta = {
  type: 'function';
  name: string;
  description: string;
  parameters?: JSONSchema;
};

type MetaResponse = {
  instructions: string;
  tools: ToolMeta[];
};

export function ClaraCapabilities() {
  const [data, setData] = useState<MetaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // accordion state
  const [expanded, setExpanded] = useState(false);
  const [showFullIntro, setShowFullIntro] = useState(false);

  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  // equal-height for wide screens (only when expanded)
  const heightsRef = useRef<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    heightsRef.current = [];
    setMaxHeight(undefined);
  }, [isWide, expanded, data?.tools?.length]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const apiBase = process.env.EXPO_PUBLIC_API_BASE!;
        const res = await fetch(`${apiBase}/realtime/tools`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: MetaResponse = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load capabilities');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tools = data?.tools ?? [];

  const summarized = useMemo(() => {
    if (!tools.length) return [];
    return tools.map((t) => {
      const friendly = toTitle(t.name);
      const action = actionFromName(t.name);
      return {
        icon: pickIcon(t.name),
        name: t.name,
        title: friendly,
        action,
        description: friendlyHints(t.name, t.description),
        summary: summarizeParams(t.parameters),
      };
    });
  }, [tools]);

  const onCardLayout = (index: number) => (e: LayoutChangeEvent) => {
    if (!isWide || !expanded) return;
    const h = e.nativeEvent.layout.height;
    heightsRef.current[index] = h;
    const currentMax = Math.max(...heightsRef.current.filter(Boolean));
    if (!Number.isNaN(currentMax) && currentMax !== maxHeight) {
      setMaxHeight(currentMax);
    }
  };

  const headerRight = (
    <View className="flex-row items-center gap-2">
      {summarized.length ? (
        <View className="px-2 py-1 rounded-full bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
          <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
            {summarized.length} tools
          </Text>
        </View>
      ) : null}
      <Ionicons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={18}
        className="text-text dark:text-text-dark"
      />
    </View>
  );

  return (
    <Card className="mb-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl">
      {/* Accordion header (clickable) */}
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        className="px-4 pt-4 pb-3 active:opacity-90"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="sparkles-outline"
              size={18}
              className="text-text dark:text-text-dark"
            />
            <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
              Clara capabilities
            </Text>
          </View>
          {headerRight}
        </View>

        {/* Intro / collapsed summary */}
        <View className="mt-2">
          {loading ? (
            <View className="py-2">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <Text className="text-danger font-semibold">{error}</Text>
          ) : data ? (
            <>
              <Text
                className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark"
                numberOfLines={expanded ? (showFullIntro ? undefined : 3) : 2}
              >
                {data.instructions}
              </Text>

              {/* When collapsed, show a quick glance of tool names */}
              {!expanded && summarized.length ? (
                <View className="mt-2 flex-row flex-wrap -m-1">
                  {summarized.slice(0, 4).map((t) => (
                    <Chip key={t.name} text={t.name} />
                  ))}
                  {summarized.length > 4 ? (
                    <Chip text={`+${summarized.length - 4} more`} />
                  ) : null}
                </View>
              ) : null}

              {expanded ? (
                <Text
                  onPress={() => setShowFullIntro((v) => !v)}
                  className="text-[12px] font-semibold text-primary mt-1.5"
                >
                  {showFullIntro ? 'Show less' : 'Show more'}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>
      </Pressable>

      {/* Body (only when expanded) */}
      {expanded && summarized.length > 0 ? (
        <View className="px-3 pb-4">
          <View className="-m-2 flex-row flex-wrap">
            {summarized.map((t, i) => (
              <View
                key={t.name}
                style={{ width: isWide ? '50%' : '100%' }}
                className="p-2"
              >
                <ToolCard
                  icon={t.icon}
                  title={t.title}
                  name={t.name}
                  action={t.action}
                  description={t.description}
                  summary={t.summary}
                  onLayout={onCardLayout(i)}
                  height={isWide && maxHeight ? maxHeight : undefined}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

/* -------------------- Tool Card -------------------- */

function ToolCard({
  icon,
  title,
  name,
  action,
  description,
  summary,
  onLayout,
  height,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  name: string;
  action: CrudAction;
  description: string;
  summary?: Summarized;
  onLayout?: (e: LayoutChangeEvent) => void;
  height?: number;
}) {
  const badge = crudBadge(action);

  return (
    <View
      onLayout={onLayout}
      style={height ? { height } : undefined}
      className={`
        rounded-xl border border-border dark:border-border-dark
        bg-muted/60 dark:bg-muted-dark/60
        px-4 py-3
      `}
    >
      {/* Title row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <IconBadge icon={icon} />
          <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
            {title}
          </Text>
        </View>
        <Badge label={badge.label} tint={badge.tint} />
      </View>

      {/* Short description */}
      <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
        {description}
      </Text>

      {/* Summary */}
      <View className="mt-3 gap-2">
        {summary?.kinds?.length ? (
          <Row label="Kinds" items={summary.kinds} />
        ) : null}
        {summary?.required?.length ? (
          <Row label="Required" items={summary.required} />
        ) : null}
        {summary?.variants?.length ? (
          <Row label="Variants" items={summary.variants} />
        ) : null}
        {summary?.fields?.length ? (
          <Row label="Fields" items={summary.fields} muted />
        ) : null}
        <RowMini label="Tool" value={name} />
      </View>
    </View>
  );
}

function IconBadge({
  icon,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View className="w-7 h-7 rounded-full items-center justify-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
      <Ionicons
        name={icon}
        size={15}
        className="text-text dark:text-text-dark"
      />
    </View>
  );
}

function Row({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <View>
      <Text
        className={`text-[11px] uppercase tracking-wide mb-1 ${
          muted
            ? 'text-text-dim/70 dark:text-text-dimDark/70'
            : 'text-text-dim dark:text-text-dimDark'
        }`}
      >
        {label}
      </Text>
      <View className="flex-row flex-wrap -m-1">
        {items.map((v) => (
          <Tag key={label + v} text={v} />
        ))}
      </View>
    </View>
  );
}

function RowMini({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-1.5 flex-row items-center">
      <Text className="text-[11px] uppercase tracking-wide mr-2 text-text-dim/70 dark:text-text-dimDark/70">
        {label}
      </Text>
      <View className="px-2 py-0.5 rounded bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
        <Text
          selectable
          className="text-[12px] text-text-dim dark:text-text-dimDark"
          style={{
            ...(Platform.select({
              ios: { fontFamily: 'Menlo' },
              android: { fontFamily: 'monospace' },
              web: { fontFamily: 'monospace' },
            }) as any),
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View className="m-1 px-2 py-1 rounded-md bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
      <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
        {text}
      </Text>
    </View>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <View className="m-1 px-2 py-1 rounded-md bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
      <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
        {text}
      </Text>
    </View>
  );
}

/* -------------------- Summarizer -------------------- */

type Summarized = {
  kinds?: string[];
  required?: string[];
  fields?: string[];
  variants?: string[];
};

function summarizeParams(schema?: JSONSchema): Summarized | undefined {
  if (!schema || typeof schema !== 'object') return;

  const out: Summarized = {};

  const kindEnum = schema?.properties?.kind?.enum as string[] | undefined;
  if (Array.isArray(kindEnum) && kindEnum.length) out.kinds = kindEnum;

  const req = schema?.required as string[] | undefined;
  if (Array.isArray(req) && req.length) out.required = req;

  const props = schema?.properties as Record<string, any> | undefined;
  if (props && typeof props === 'object') {
    const keys = Object.keys(props).filter((k) => k !== 'kind');
    if (keys.length) out.fields = keys;
  }

  // data.oneOf variants (e.g., create)
  const oneOf = schema?.properties?.data?.oneOf as JSONSchema[] | undefined;
  if (Array.isArray(oneOf) && oneOf.length) {
    out.variants = oneOf.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
  }

  // root oneOf
  const rootOne = Array.isArray(schema?.oneOf) ? (schema.oneOf as any[]) : [];
  if (rootOne.length) {
    const rootVariants = rootOne.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
    out.variants = [...(out.variants ?? []), ...rootVariants];
  }

  if (!out.kinds && !out.required && !out.fields && !out.variants) return;
  return out;
}

/* -------------------- Titles & Actions -------------------- */

// apps/mobile/src/app/(features)/admin/logs/ClaraCapabilities.tsx
// …keep the rest of your file unchanged…

/* -------------------- Titles & Actions -------------------- */
function toTitle(name: string) {
  // hub_list_kind -> "List kind" | hub_create -> "Create"
  const human = name.replace(/^hub_/, '').replace(/_/g, ' ');
  return human
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

function actionFromName(name: string): CrudAction {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'create';
  if (n.includes('update')) return 'update';
  if (n.includes('delete')) return 'delete';
  if (n.includes('list') || n.includes('read')) return 'read';
  return 'other';
}

function crudBadge(action: CrudAction): { label: string; tint: string } {
  switch (action) {
    case 'create':
      return { label: 'CREATE', tint: '#16a34a' };
    case 'read':
      return { label: 'READ', tint: '#2563eb' };
    case 'update':
      return { label: 'UPDATE', tint: '#7c3aed' };
    case 'delete':
      return { label: 'DELETE', tint: '#ef4444' };
    default:
      return { label: 'TOOL', tint: '#6b7280' };
  }
}

function friendlyHints(name: string, original: string) {
  const n = name.toLowerCase();
  if (n.includes('list_kind')) return 'List all items for a specific kind.';
  if (n.includes('update')) return 'Update fields of an item (id required).';
  if (n.includes('create')) return 'Create a new item for a given kind.';
  if (n.includes('delete')) return 'Delete an item by id for a given kind.';
  if (n.includes('list')) return 'Fetch a snapshot of items.';
  return original;
}

/* -------------------- Utils -------------------- */

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickIcon(name: string): React.ComponentProps<typeof Ionicons>['name'] {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'add-circle-outline';
  if (n.includes('update')) return 'build-outline';
  if (n.includes('delete')) return 'trash-outline';
  if (n.includes('list') && n.includes('kind')) return 'list-circle-outline';
  if (n.includes('list')) return 'reorder-four-outline';
  if (n.includes('read')) return 'document-text-outline';
  if (n.includes('hub')) return 'grid-outline';
  return 'construct-outline';
}
