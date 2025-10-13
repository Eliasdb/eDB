// libs/ui/composites/record-row.tsx
import React from 'react';
import {
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';

export type RecordRowProps = {
  /** Primary line (bold). Accepts string or custom node. */
  title: string | React.ReactNode;
  /** Secondary line (dim). Omit to hide the line. */
  secondary?: string | React.ReactNode;
  /** Right-side slot (badge, time, etc.). */
  right?: React.ReactNode;
  /** Optional leading slot (avatar, icon). */
  leading?: React.ReactNode;
  /** Optional tap handler (Pressable if provided). */
  onPress?: (e: GestureResponderEvent) => void;
  /** Extra padding / styling hooks */
  paddingV?: number; // default 12
  paddingH?: number; // default 14
};

export default function RecordRow({
  title,
  secondary,
  right,
  leading,
  onPress,
  paddingV = 12,
  paddingH = 14,
}: RecordRowProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{ paddingVertical: paddingV, paddingHorizontal: paddingH }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* left cluster (leading + text) */}
        <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
          {leading ? <View style={{ paddingTop: 2 }}>{leading}</View> : null}

          <View style={{ flex: 1 }}>
            {typeof title === 'string' ? (
              <Text
                className="text-text dark:text-text-dark"
                style={{ fontSize: 15, fontWeight: '700' }}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : (
              title
            )}

            {secondary ? (
              typeof secondary === 'string' ? (
                <Text
                  className="text-text-dim dark:text-text-dimDark"
                  style={{ fontSize: 12, marginTop: 4 }}
                  numberOfLines={2}
                >
                  {secondary}
                </Text>
              ) : (
                <View style={{ marginTop: 4 }}>{secondary}</View>
              )
            ) : null}
          </View>
        </View>

        {/* right meta */}
        {right ? (
          <View style={{ alignItems: 'flex-end', minWidth: 60 }}>{right}</View>
        ) : null}
      </View>
    </Container>
  );
}
