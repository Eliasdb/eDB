// apps/mobile/src/lib/ui/Sheet.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useThemePreference } from './themePreference'; // ← use your provider

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightPct?: number;
  radius?: number;
  disableBackdropClose?: boolean;
};

export default function Sheet({
  visible,
  onClose,
  children,
  maxHeightPct = 0.85,
  radius = 16,
  disableBackdropClose,
}: SheetProps) {
  const { effective } = useThemePreference();
  const isDark = effective === 'dark'; // ← this flips when you toggle in the app

  const screenH = Dimensions.get('window').height;
  const maxH = Math.round(screenH * Math.min(1, Math.max(0.4, maxHeightPct)));

  const transY = useRef(new Animated.Value(screenH)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(transY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(transY, {
          toValue: screenH,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fade, transY, screenH]);

  const backdropColor = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(15,23,42,0.28)';

  const sheetStyle = useMemo(
    () => ({
      maxHeight: maxH,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      transform: [{ translateY: transY }],
      borderTopWidth: Platform.OS === 'web' ? 1 : 0.5,
      borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      // ✅ correct surface colors
      backgroundColor: isDark ? '#0b0c0f' : '#ffffff',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.18 : 0.22,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    }),
    [maxH, radius, transY, isDark],
  );

  return (
    <View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
    >
      {/* Backdrop */}
      <Pressable
        style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
        onPress={disableBackdropClose ? undefined : onClose}
        accessibilityRole="button"
        accessibilityLabel="Close sheet"
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: backdropColor, opacity: fade },
          ]}
        />
      </Pressable>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.select({
          ios: 'padding',
          android: undefined,
          web: undefined,
        })}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: 'flex-end', zIndex: 2 },
        ]}
        pointerEvents="box-none"
      >
        <Animated.View style={sheetStyle}>
          <View style={{ padding: 16 }}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
