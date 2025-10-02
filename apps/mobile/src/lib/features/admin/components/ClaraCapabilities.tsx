// apps/mobile/src/lib/ui/admin/ClaraCapabilities.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Card, Segmented } from '@ui/primitives';
import { Badge } from '@ui/primitives/primitives';
// If you have an Avatar in your primitives, uncomment this and replace the inline avatar below
import { Avatar } from '@ui/primitives';
import { Collapsible } from '../../../../lib/ui/primitives/Collapsible';

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

type ToolScope = 'all' | 'internal' | 'external';

export function ClaraCapabilities() {
  const SCOPE_OPTIONS: { value: ToolScope; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'internal', label: 'Internal' },
    { value: 'external', label: 'External' },
  ];

  const [scope, setScope] = useState<ToolScope>('all');
  const [data, setData] = useState<MetaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  // equal-height for wide screens
  const heightsRef = useRef<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    heightsRef.current = [];
    setMaxHeight(undefined);
  }, [isWide, data?.tools?.length]);

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

  const filtered = useMemo(() => {
    if (scope === 'all') return summarized;
    if (scope === 'internal')
      return summarized.filter((t) => isInternalTool(t.name));
    return summarized.filter((t) => !isInternalTool(t.name));
  }, [summarized, scope]);

  const onCardLayout = (index: number) => (e: LayoutChangeEvent) => {
    if (!isWide) return;
    const h = e.nativeEvent.layout.height;
    heightsRef.current[index] = h;
    const currentMax = Math.max(...heightsRef.current.filter(Boolean));
    if (!Number.isNaN(currentMax) && currentMax !== maxHeight) {
      setMaxHeight(currentMax);
    }
  };

  return (
    <View>
      {/* Header with avatar + title */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          {/* Swap this for <Avatar name="Clara" size="md" imageUrl={...} /> when your primitive lands */}
          <Avatar size={40} />
          <View>
            <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
              Clara
            </Text>
            <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
              Realtime assistant • Capabilities overview
            </Text>
          </View>
        </View>

        {summarized.length ? (
          <View className="px-2 py-1 rounded-full bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
            <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
              {summarized.length} tools
            </Text>
          </View>
        ) : null}
      </View>

      {/* Instructions / “about Clara” */}
      <Card className="mb-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl">
        {loading ? (
          <View className="py-1">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text className="text-danger font-semibold">{error}</Text>
        ) : (
          <View>
            {/* Section title */}
            <Text className="text-[14px] font-extrabold text-text dark:text-text-dark mb-2">
              Instructions
            </Text>

            <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
              {data?.instructions ??
                'You are Clara. When the user asks to create, update, list, or delete tasks, contacts, or companies, call the correct tool immediately, then give a short confirmation. Keep replies concise.'}
            </Text>

            {/* little hint row */}
            <View className="mt-2 flex-row flex-wrap -m-1">
              <HintChip text="Calls tools automatically" />
              <HintChip text="Short confirmations" />
              <HintChip text="Concise replies" />
            </View>
          </View>
        )}
      </Card>

      <View className="mb-3">
        <Segmented<ToolScope>
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={setScope}
        />
      </View>

      {filtered.length > 0 ? (
        <View className="-m-2 flex-row flex-wrap">
          {filtered.map((t, i) => (
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
      ) : null}
    </View>
  );
}

function isInternalTool(name: string) {
  return name.startsWith('hub_'); // tweak your rule here
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
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View
      onLayout={onLayout}
      style={height ? { height } : undefined}
      className="
        rounded-xl border border-border dark:border-border-dark
        bg-muted/60 dark:bg-muted-dark/60
        px-4 py-3
      "
    >
      {/* Title row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <IconBadge icon={icon} />
          <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
            {title}
          </Text>
        </View>
        <Badge label={badge.label} tint={badge.tint} />
      </View>

      {/* Short description (always visible) */}
      <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
        {description}
      </Text>

      {/* Details toggle */}
      {summary ? (
        <>
          <View className="mt-2 h-px bg-border/70 dark:bg-border-dark/70" />
          <Pressable
            onPress={() => setShowDetails((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Toggle tool details"
            className="flex-row items-center justify-between active:opacity-90 py-2"
          >
            <Text className="text-[12px] font-extrabold text-text dark:text-text-dark">
              {showDetails ? 'Hide details' : 'Show details'}
            </Text>
            <Ionicons
              name={showDetails ? 'chevron-up' : 'chevron-down'}
              size={16}
              className="text-text-dim dark:text-text-dimDark"
            />
          </Pressable>

          {/* Collapsible summary */}
          <Collapsible open={showDetails}>
            <View className="pt-2" style={{ rowGap: 8 }}>
              {summary.kinds?.length ? (
                <Row label="Kinds" items={summary.kinds} />
              ) : null}
              {summary.required?.length ? (
                <Row label="Required" items={summary.required} />
              ) : null}
              {summary.variants?.length ? (
                <Row label="Variants" items={summary.variants} />
              ) : null}
              {summary.fields?.length ? (
                <Row label="Fields" items={summary.fields} muted />
              ) : null}
              <RowMini label="Tool" value={name} />
            </View>
          </Collapsible>
        </>
      ) : null}
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

function HintChip({ text }: { text: string }) {
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
function toTitle(name: string) {
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
