// apps/mobile/src/lib/ui/admin/components/ToolCard.tsx
import { Ionicons } from '@expo/vector-icons';
import { Collapsible } from '@ui/layout';
import { Badge, Card } from '@ui/primitives';
import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

export type Summarized = {
  kinds?: string[];
  required?: string[];
  fields?: string[];
  variants?: string[];
};

export type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

export function ToolCard({
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
  const { text, dim, icon: iconColor, iconDim, border } = useThemeColors();
  const [open, setOpen] = useState(false);
  const badge = crudBadge(action);

  return (
    <View onLayout={onLayout} style={height ? { height } : undefined}>
      <Card className="rounded-2xl">
        {/* Title row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{ borderColor: border, borderWidth: 1 }}
            >
              <Ionicons name={icon} size={15} color={iconColor} />
            </View>
            <Text
              className="text-[16px] font-extrabold"
              style={{ color: text }}
            >
              {title}
            </Text>
          </View>
          <Badge label={badge.label} tint={badge.tint} />
        </View>

        {/* Description */}
        <Text className="mt-3 text-[13px] leading-5" style={{ color: dim }}>
          {description}
        </Text>

        {/* Details */}
        {summary ? (
          <>
            <View className="mt-2 h-px bg-border/70 dark:bg-border-dark/70" />
            <Pressable
              onPress={() => setOpen((v) => !v)}
              className="flex-row items-center justify-between active:opacity-90 py-2"
            >
              <Text
                className="text-[12px] font-extrabold"
                style={{ color: text }}
              >
                {open ? 'Hide details' : 'Show details'}
              </Text>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={iconDim}
              />
            </Pressable>

            <Collapsible open={open}>
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
      </Card>
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
