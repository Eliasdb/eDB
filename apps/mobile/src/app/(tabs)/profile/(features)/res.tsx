// apps/mobile/src/lib/ui/composites/ResponsiveSaveBar.tsx
import { StickySaveBar } from '@ui/composites';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Variant = 'auto' | 'sticky' | 'floating';

type Props = {
  dirty: boolean;
  onSave: () => void;
  label: string;
  unsavedText?: string;
  upToDateText?: string;
  pad?: number;
  safeBottom?: boolean;
  maxWidth?: number;
  bottomOffset?: number;
  tabBarHeight?: number;
  variant?: Variant;
};

export default function ResponsiveSaveBar({
  dirty,
  onSave,
  label,
  unsavedText = 'You have unsaved changes',
  upToDateText = 'Up to date',
  pad = 12,
  safeBottom = false,
  maxWidth = 1100,
  bottomOffset = 12,
  tabBarHeight = 56,
  variant = 'auto',
}: Props) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isWeb = Platform.OS === 'web';

  const showFloating = useMemo(
    () => variant === 'floating' || (variant === 'auto' && isWeb),
    [variant, isWeb],
  );

  const palette = {
    bg: isDark
      ? 'rgba(17,24,39,0.88)' // dark glass
      : 'rgba(255,255,255,0.9)', // light glass
    border: isDark ? 'rgba(148,163,184,0.22)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#E5E7EB' : '#111827',
    ctaBg: '#6C63FF',
    ctaBgPressed: '#7A73FF',
    ctaText: '#FFFFFF',
  };

  if (!showFloating) {
    return (
      <StickySaveBar
        dirty={dirty}
        onSave={onSave}
        label={label}
        unsavedText={unsavedText}
        upToDateText={upToDateText}
        pad={pad}
        safeBottom={safeBottom}
      />
    );
  }

  const baseBottom = isWeb ? 24 : bottomOffset;

  const translateY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dirty) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 16,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [dirty, translateY, opacity]);

  const [pressed, setPressed] = useState(false);

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.row,
          { bottom: baseBottom, opacity, transform: [{ translateY }] },
        ]}
      >
        <View
          style={[
            styles.pill,
            {
              maxWidth,
              alignSelf: 'center',
              backgroundColor: palette.bg,
              borderColor: palette.border,
            },
            isWeb
              ? ({
                  backdropFilter: 'blur(8px)',
                  boxShadow:
                    '0 10px 28px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.04)',
                } as any)
              : null,
            Platform.select({
              android: { elevation: 8 },
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
              },
              default: {},
            }),
          ]}
        >
          <Text style={[styles.text, { color: palette.text }]}>
            {unsavedText}
          </Text>

          <Pressable
            onPress={onSave}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            hitSlop={8}
            style={({ pressed: isPressed }) =>
              isPressed ? { opacity: 0.98 } : undefined
            }
          >
            <View
              style={[
                styles.cta,
                {
                  backgroundColor: pressed
                    ? palette.ctaBgPressed
                    : palette.ctaBg,
                },
              ]}
            >
              <Text style={[styles.ctaText, { color: palette.ctaText }]}>
                {label}
              </Text>
            </View>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    marginLeft: 6,
    marginRight: 10,
    flexShrink: 1,
  },
  cta: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'transparent', // actual color handled dynamically
  },
  ctaText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
