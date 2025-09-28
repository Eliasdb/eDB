import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { cn } from './cn';

// Theme-aware icon wrapper
export function Icon({
  name,
  size = 20,
  className,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  className?: string;
}) {
  return (
    <Text className={className}>
      <Ionicons name={name} size={size} />
    </Text>
  );
}

export function Card(props: ViewProps & { inset?: boolean }) {
  const { style, inset, ...rest } = props;
  return (
    <View
      className={cn(
        'bg-white dark:bg-surface-dark rounded-lg shadow-card',
        inset ? 'p-md' : 'p-0',
      )}
      style={style}
      {...rest}
    />
  );
}

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
    <View className="mt-lg">
      <Text className="text-[14px] text-text-dim dark:text-text-dimDark mb-xs ml-[4px] font-semibold uppercase tracking-[0.6px]">
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
}: {
  label: string;
  value?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="px-md py-md flex-row items-center justify-between border-t border-border dark:border-border-dark"
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
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value?: boolean;
  onValueChange?: (v: boolean) => void;
}) {
  return (
    <View className="px-md py-md flex-row items-center justify-between border-t border-border dark:border-border-dark">
      <Row center gap={12}>
        <Icon name={icon} className="text-text dark:text-text-dark" />
        <Text className="text-[16px] text-text dark:text-text-dark">
          {label}
        </Text>
      </Row>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-xs bg-primary rounded-pill h-[44px] px-md"
    >
      <Icon name={icon} size={18} className="text-white" />
      <Text className="text-white font-semibold text-[15px]">{label}</Text>
    </TouchableOpacity>
  );
}

export function Pill({
  icon,
  text,
  muted,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  muted?: boolean;
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 px-2 py-1 rounded-xl bg-[#eef1ff] dark:bg-[#1b1f3a]',
        muted && 'bg-gray-100 dark:bg-gray-800',
      )}
    >
      <Icon
        name={icon}
        size={12}
        className="text-[#6c6f7b] dark:text-gray-300"
      />
      <Text className="text-[12px] text-[#6c6f7b] dark:text-gray-300">
        {text}
      </Text>
    </View>
  );
}

/* ---------- NEW: shared CRM bits ---------- */

export function IconButton({
  icon,
  onPress,
  tint = '#6C63FF',
  className,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  tint?: string;
  className?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn(
        'w-9 h-9 rounded-full items-center justify-center bg-muted dark:bg-muted-dark',
        className,
      )}
    >
      <Ionicons name={icon} size={18} color={tint} />
    </TouchableOpacity>
  );
}

export function AvatarCircle({
  size = 36,
  text,
}: {
  size?: number;
  text: string;
}) {
  return (
    <View
      className="items-center justify-center bg-muted dark:bg-muted-dark rounded-full"
      style={{ width: size, height: size }}
    >
      <Text className="font-bold text-[13px] text-text dark:text-text-dark">
        {text}
      </Text>
    </View>
  );
}

export function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <View className="mt-lg mb-[8px] px-[2px] flex-row items-center justify-between">
      <Text className="text-[14px] text-text-dim dark:text-text-dimDark font-semibold uppercase tracking-[0.6px]">
        {title}
      </Text>
      {right}
    </View>
  );
}

export function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white dark:bg-surface-dark rounded-2xl shadow-card p-[12px]">
      {children}
    </View>
  );
}

export function ListContainer({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white dark:bg-surface-dark rounded-2xl shadow-card p-[10px]">
      <View className="rounded-xl border border-border dark:border-border-dark bg-muted/30 dark:bg-muted-dark/30 p-[8px]">
        {children}
      </View>
    </View>
  );
}

export function ListItem({
  left,
  title,
  meta,
  right,
  showTopDivider,
}: {
  left?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  right?: React.ReactNode;
  showTopDivider?: boolean;
}) {
  return (
    <View>
      {showTopDivider && (
        <View className="h-px bg-border dark:bg-border-dark mx-[8px]" />
      )}
      <View className="flex-row items-center gap-3 px-[8px] py-[10px]">
        {left ? <View className="w-[40px] items-center">{left}</View> : null}
        <View className="flex-1">
          {typeof title === 'string' ? (
            <Text className="text-[16px] text-text dark:text-text-dark">
              {title}
            </Text>
          ) : (
            title
          )}
          {meta ? <View className="mt-1.5">{meta}</View> : null}
        </View>
        {right}
      </View>
    </View>
  );
}
