import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { cn } from '../utils/cn';
import { Card } from './Card';
import { Icon } from './Icon';
import { Switch } from './Switch';

export function Divider() {
  return (
    <View
      className="bg-border dark:bg-border-dark"
      style={{ height: StyleSheet.hairlineWidth }}
    />
  );
}

export function Row(props: ViewProps & { gap?: number; center?: boolean }) {
  const { style, gap = 8, center, ...rest } = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: center ? 'center' : 'flex-start',
          gap,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function Chip({ label }: { label: string }) {
  return (
    <View className="px-2 py-1 rounded-md bg-[#eef2ff] dark:bg-[#1b1f3a]">
      <Text className="text-[11px] font-bold text-[#374151] dark:text-[#d1d5db]">
        {label}
      </Text>
    </View>
  );
}

export function Badge({ label, tint }: { label: string; tint: string }) {
  return (
    <View
      className="px-2 py-1 rounded-md"
      style={{ backgroundColor: withAlpha(tint, 0.12) }}
    >
      <Text
        className="text-[10px] font-extrabold tracking-[0.4px]"
        style={{ color: tint }}
      >
        {label}
      </Text>
    </View>
  );
}

export function MonoText({ children }: { children: string }) {
  return (
    <Text
      selectable
      className="text-[12px] text-text dark:text-text-dark bg-gray-100 dark:bg-gray-800 border border-border dark:border-border-dark rounded-md p-2 leading-4"
      style={{
        fontFamily: Platform.select({
          ios: 'Menlo',
          android: 'monospace',
          web: 'monospace',
        }) as any,
      }}
    >
      {children}
    </Text>
  );
}

export function withAlpha(hex: string, a = 0.12) {
  const m = /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex);
  if (!m) return hex;
  const [_, r, g, b] = m;
  return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${a})`;
}

export function Dot({ ok }: { ok: boolean }) {
  return (
    <View
      className={cn(
        'w-[10px] h-[10px] rounded-full',
        ok ? 'bg-success' : 'bg-danger',
      )}
    />
  );
}

export function MonoKV({ label, value }: { label: string; value: any }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <MonoText>{pretty(value)}</MonoText>
    </View>
  );
}

export function KV({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <Text
        className="text-[14px] text-text dark:text-text-dark"
        numberOfLines={4}
      >
        {value}
      </Text>
    </View>
  );
}

function pretty(v: any) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-8">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark mb-xs ml-[4px]  uppercase tracking-wide">
        {title}
      </Text>
      <Card inset={false}>{children}</Card>
    </View>
  );
}

export function Item({
  label,
  value,
  icon,
  onPress,
  border = false, // 👈 new prop
  borderPosition = 'bottom', // 'top' | 'bottom' | 'y' | 'all'
}: {
  label: string;
  value?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
}) {
  const borderCN = border
    ? borderPosition === 'all'
      ? 'border border-border dark:border-border-dark'
      : borderPosition === 'y'
        ? 'border-y border-border dark:border-border-dark'
        : borderPosition === 'top'
          ? 'border-t border-border dark:border-border-dark'
          : 'border-b border-border dark:border-border-dark'
    : '';

  return (
    <TouchableOpacity
      className={`px-md py-md flex-row items-center justify-between ${borderCN}`}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <Row center gap={12}>
        <Icon name={icon} className="text-text dark:text-text-dark" />
        <Text className="text-[16px] text-text dark:text-text-dark">
          {label}
        </Text>
      </Row>
      <Row center gap={8}>
        {value ? (
          <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
            {value}
          </Text>
        ) : null}
        {onPress ? (
          <Icon
            name="chevron-forward"
            size={18}
            className="text-text-dim dark:text-text-dimDark"
          />
        ) : null}
      </Row>
    </TouchableOpacity>
  );
}
export function ItemSwitch({
  label,
  icon,
  value,
  onValueChange,
  border = false,
  borderPosition = 'bottom', // 'top' | 'bottom' | 'y' | 'all'
}: {
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  border?: boolean;
  borderPosition?: 'top' | 'bottom' | 'y' | 'all';
}) {
  const borderCN = border
    ? borderPosition === 'all'
      ? 'border border-border dark:border-border-dark'
      : borderPosition === 'y'
        ? 'border-y border-border dark:border-border-dark'
        : borderPosition === 'top'
          ? 'border-t border-border dark:border-border-dark'
          : 'border-b border-border dark:border-border-dark'
    : '';

  return (
    <View
      className={`px-md py-md flex-row items-center justify-between ${borderCN}`}
    >
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <Icon name={icon} className="text-text dark:text-text-dark" />
        <Text className="text-[16px] text-text dark:text-text-dark">
          {label}
        </Text>
      </View>
      <Switch value={!!value} onValueChange={onValueChange} />
    </View>
  );
}

export function EmptyLine({ text }: { text: string }) {
  return (
    <View className="min-h-[56px] justify-center py-3 px-4">
      <Text className="text-[15px] text-text-dim dark:text-text-dimDark">
        {text}
      </Text>
    </View>
  );
}
