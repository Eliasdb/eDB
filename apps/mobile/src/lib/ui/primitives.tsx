// apps/mobile/src/lib/ui/primitives.tsx
import { Platform, StyleSheet, Text, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from './theme';
// apps/mobile/src/lib/ui/primitives.tsx
import { Ionicons } from '@expo/vector-icons';
import { Switch, TouchableOpacity } from 'react-native';

export function Card(props: ViewProps & { inset?: boolean }) {
  const { style, inset, ...rest } = props;
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          padding: inset ? spacing.md : spacing.sm,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 1,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function Divider() {
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
      }}
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
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.md,
        backgroundColor: '#eef2ff',
      }}
    >
      <Text style={{ fontSize: 11, color: '#374151', fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

export function Badge({ label, tint }: { label: string; tint: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.md,
        backgroundColor: withAlpha(tint, 0.12),
      }}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: '900',
          color: tint,
          letterSpacing: 0.4,
        }}
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
      style={{
        fontSize: 12,
        color: '#1f2937',
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: radius.md,
        padding: 10,
        lineHeight: 16,
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

// ...existing imports/exports above

export function Dot({ ok }: { ok: boolean }) {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: ok ? '#10b981' : '#ef4444',
      }}
    />
  );
}

export function MonoKV({ label, value }: { label: string; value: any }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={{
          fontSize: 12,
          color: '#6b7280',
          fontWeight: '800',
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <MonoText>{pretty(value)}</MonoText>
    </View>
  );
}

export function KV({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={{
          fontSize: 12,
          color: '#6b7280',
          fontWeight: '800',
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 14, color: '#111827' }} numberOfLines={4}>
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
    <View style={{ marginTop: spacing.lg }}>
      <Text
        style={{
          fontSize: 14,
          color: colors.dim,
          marginBottom: spacing.xs,
          marginLeft: 4,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
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
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      <Row center gap={12}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <Text style={{ fontSize: 16, color: colors.text }}>{label}</Text>
      </Row>
      <Row center gap={8}>
        {value ? (
          <Text style={{ fontSize: 14, color: colors.dim }}>{value}</Text>
        ) : null}
        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.dim} />
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
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
      }}
    >
      <Row center gap={12}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <Text style={{ fontSize: 16, color: colors.text }}>{label}</Text>
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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
        height: 44,
        paddingHorizontal: spacing.md,
      }}
    >
      <Ionicons name={icon} size={18} color={colors.white} />
      <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>
        {label}
      </Text>
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
    <View style={[styles.pill, muted && { backgroundColor: '#f2f3f7' }]}>
      <Ionicons name={icon} size={12} color="#6c6f7b" />
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#eef1ff',
  },
  pillText: { fontSize: 12, color: '#6c6f7b' },
});
