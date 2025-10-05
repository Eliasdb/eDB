// apps/mobile/src/lib/ui/composites/entity-row/EntityRow.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  ViewProps,
} from 'react-native';

export type EntityTag = {
  text: string;
  tone?: 'neutral' | 'success' | 'danger' | 'info' | 'primary';
  leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
};

export type EntityMetaItem = {
  label?: string;
  value: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  pill?: boolean;
};

type Props = ViewProps & {
  title: string;
  subtitle?: string; // e.g., primary email
  avatarUrl?: string;
  initials?: string;
  avatarShape?: 'circle' | 'rounded';
  tags?: EntityTag[]; // small badges below the title line (optional)
  meta?: EntityMetaItem[]; // goes in the details strip below header (not duplicated with subtitle)
  trailing?: React.ReactNode; // custom right content; defaults to chevron
  onPress?: () => void;
};

const tones: Record<
  NonNullable<EntityTag['tone']>,
  { bg: string; text: string; border: string }
> = {
  neutral: {
    bg: 'rgba(148,163,184,0.15)',
    text: '#94A3B8',
    border: 'rgba(148,163,184,0.25)',
  },
  success: {
    bg: 'rgba(34,197,94,0.12)',
    text: '#22C55E',
    border: 'rgba(34,197,94,0.25)',
  },
  danger: {
    bg: 'rgba(239,68,68,0.12)',
    text: '#EF4444',
    border: 'rgba(239,68,68,0.25)',
  },
  info: {
    bg: 'rgba(59,130,246,0.12)',
    text: '#3B82F6',
    border: 'rgba(59,130,246,0.25)',
  },
  primary: {
    bg: 'rgba(108,99,255,0.12)',
    text: '#6C63FF',
    border: 'rgba(108,99,255,0.26)',
  },
};

export function EntityRow({
  title,
  subtitle,
  avatarUrl,
  initials,
  avatarShape = 'circle',
  tags = [],
  meta = [],
  trailing,
  onPress,
  style,
  ...rest
}: Props) {
  const shapeStyle =
    avatarShape === 'circle' ? { borderRadius: 24 } : { borderRadius: 8 };

  // Safety: don’t re-show subtitle value in meta (e.g., email)
  const filteredMeta = meta.filter((m) => m.value !== subtitle);

  return (
    <Pressable
      onPress={onPress}
      className="p-8"
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        {
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 16,
          backgroundColor: 'transparent',
          opacity: pressed && Platform.OS !== 'web' ? 0.96 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {/* Header row: avatar + name + subtitle + trailing */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(148,163,184,0.18)',
            ...shapeStyle,
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 48, height: 48, ...shapeStyle }}
            />
          ) : (
            <Text
              style={{
                fontWeight: '800',
                color: '#111827',
                fontSize: 14,
              }}
            >
              {initials || ''}
            </Text>
          )}
        </View>

        {/* Title + subtitle + tags */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              color: '#E5E7EB',
              fontSize: 18,
              fontWeight: '800',
            }}
            className="text-text dark:text-text-dark"
          >
            {title}
          </Text>

          {!!subtitle && (
            <Text
              numberOfLines={1}
              style={{
                marginTop: 2,
                color: '#9CA3AF',
                fontSize: 13,
              }}
              className="text-text-dim dark:text-text-dimDark"
            >
              {subtitle}
            </Text>
          )}

          {!!tags.length && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 6,
              }}
            >
              {tags.map((t, idx) => {
                const tone = tones[t.tone ?? 'neutral'];
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: tone.bg,
                      borderWidth: 1,
                      borderColor: tone.border,
                    }}
                  >
                    {t.leftIcon ? (
                      <Ionicons name={t.leftIcon} size={14} color={tone.text} />
                    ) : null}
                    <Text
                      style={{
                        color: tone.text,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {t.text}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Trailing */}
        <View style={{ marginLeft: 8 }}>
          {trailing ?? (
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          )}
        </View>
      </View>

      {/* Details strip: always reserve some height so layout doesn’t jump */}
      <View style={{ marginTop: 10, minHeight: filteredMeta.length ? 0 : 6 }}>
        {filteredMeta.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {filteredMeta.map((m, i) =>
              m.pill ? (
                <View
                  key={`${m.value}-${i}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(100,116,139,0.15)',
                    borderWidth: 1,
                    borderColor: 'rgba(100,116,139,0.25)',
                  }}
                >
                  {m.icon ? (
                    <Ionicons name={m.icon} size={14} color="#A1A1AA" />
                  ) : null}
                  {m.label ? (
                    <Text style={{ color: '#A1A1AA', fontSize: 12 }}>
                      {m.label}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      color: '#E5E7EB',
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  >
                    {m.value}
                  </Text>
                </View>
              ) : (
                <View
                  key={`${m.value}-${i}`}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  {m.icon ? (
                    <Ionicons name={m.icon} size={14} color="#A1A1AA" />
                  ) : null}
                  {m.label ? (
                    <Text style={{ color: '#A1A1AA', fontSize: 12 }}>
                      {m.label}:
                    </Text>
                  ) : null}
                  <Text style={{ color: '#E5E7EB', fontSize: 13 }}>
                    {m.value}
                  </Text>
                </View>
              ),
            )}
          </View>
        ) : (
          // invisible spacer: keeps the card height steady when details appear later
          <View style={{ height: 6 }} />
        )}
      </View>
    </Pressable>
  );
}
