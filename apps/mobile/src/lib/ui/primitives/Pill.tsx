// apps/mobile/src/lib/ui/primitives/Pill.tsx
import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Tone = 'neutral' | 'success' | 'danger' | 'info' | 'primary';
type Variant = 'soft' | 'solid' | 'outline';
type Size = 'sm' | 'md' | 'lg';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type Preset = 'default' | 'tag';

export type PillProps = {
  text?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;

  // default preset props
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  textWeight?: TextWeight;
  textSize?: number;

  // tag preset props
  preset?: Preset; // 'default' | 'tag'
  muted?: boolean; // only used when preset='tag'

  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
};

// numeric sizes for default preset (native)
const sizeMap: Record<
  Size,
  { px: number; py: number; radius: number; font: number; gap: number }
> = {
  sm: { px: 10, py: 6, radius: 999, font: 13, gap: 8 },
  md: { px: 12, py: 8, radius: 999, font: 14, gap: 10 },
  lg: { px: 14, py: 10, radius: 999, font: 15, gap: 12 },
};

// rem classes for default preset (web)
const webClassBySize: Record<Size, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-3.5 py-2',
  lg: 'px-4 py-2.5',
};

const weightToNumeric: Record<TextWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// ---------- OLD style palette kept for solid/outline fallbacks ----------
function paletteFor(tone: Tone) {
  return {
    neutral: { bg: '#1e2235', text: '#cbd5e1', border: '#312e81' },
    success: { bg: '#064e3b', text: '#d1fae5', border: '#065f46' },
    danger: { bg: '#7f1d1d', text: '#fee2e2', border: '#991b1b' },
    info: { bg: '#1e3a8a', text: '#dbeafe', border: '#1d4ed8' },
    primary: { bg: '#1b1836', text: '#c7c2ff', border: '#4338ca' },
  }[tone];
}

// ---------- NEW: class-based styles for SOFT so light/dark flips ----------
function softClassesFor(tone: Tone) {
  // use your Tailwind tokens so it flips with `dark:`
  switch (tone) {
    case 'neutral':
      return {
        containerClass: 'bg-muted dark:bg-muted-dark',
        textClass: 'text-text dark:text-text-dark',
      };
    case 'primary':
      // soft primary chip (very subtle)
      return {
        containerClass: 'bg-primary/10 dark:bg-primary/20',
        textClass: 'text-text dark:text-text-dark',
      };
    case 'success':
      return {
        containerClass: 'bg-green-100/70 dark:bg-green-900/40',
        textClass: 'text-text dark:text-text-dark',
      };
    case 'danger':
      return {
        containerClass: 'bg-red-100/70 dark:bg-red-900/40',
        textClass: 'text-text dark:text-text-dark',
      };
    case 'info':
      return {
        containerClass: 'bg-blue-100/70 dark:bg-blue-900/40',
        textClass: 'text-text dark:text-text-dark',
      };
  }
}

export function Pill({
  text,
  left,
  right,
  // default preset
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  textWeight = 'medium',
  textSize,
  // tag preset
  preset = 'default',
  muted,
  onPress,
  className,
  style,
  textStyle,
  testID,
}: PillProps) {
  const isWeb = Platform.OS === 'web';
  const Wrapper: any = onPress ? Pressable : View;

  // --- TAG PRESET (theme-driven) ---
  if (preset === 'tag') {
    const webTagClasses = [
      'px-2 py-1 rounded-xl flex-row items-center',
      muted ? 'bg-gray-100 dark:bg-tag-dark' : 'bg-tag dark:bg-tag-dark',
    ].join(' ');

    const nativeTagStyle = !isWeb
      ? { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }
      : undefined;

    const tagFontSize = textSize ?? 12;
    const tagFontWeight = weightToNumeric[textWeight];

    return (
      <Wrapper
        testID={testID}
        onPress={onPress}
        className={[webTagClasses, className ?? ''].join(' ')}
        style={[nativeTagStyle as any, style]}
      >
        {left ? <View style={{ marginRight: 6 }}>{left}</View> : null}
        {text ? (
          <Text
            numberOfLines={1}
            className={
              muted
                ? 'text-text-dim dark:text-tag-textDark'
                : 'text-tag-text dark:text-tag-textDark'
            }
            style={[
              { fontSize: tagFontSize, fontWeight: tagFontWeight },
              textStyle,
            ]}
          >
            {text}
          </Text>
        ) : null}
        {right ? <View style={{ marginLeft: 6 }}>{right}</View> : null}
      </Wrapper>
    );
  }

  // --- DEFAULT PRESET ---
  const S = sizeMap[size];
  const softClasses = variant === 'soft' ? softClassesFor(tone) : undefined;
  const pal = paletteFor(tone);

  const computedFontSize = textSize ?? S.font;
  const computedFontWeight = weightToNumeric[textWeight];

  // Build className + style so soft uses theme classes (flip), others use style fallback
  const containerClassFromTone =
    variant === 'soft' && softClasses ? softClasses.containerClass : '';
  const textClassFromTone =
    variant === 'soft' && softClasses ? softClasses.textClass : '';

  // Style fallbacks (solid/outline) keep your previous behavior
  const containerStyleFromTone =
    variant === 'soft'
      ? undefined
      : variant === 'solid'
        ? { backgroundColor: pal.border }
        : // outline
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: pal.border,
          };

  const textStyleFromTone =
    variant === 'solid'
      ? { color: 'white' }
      : variant === 'outline'
        ? { color: pal.border }
        : // soft → handled by class names
          undefined;

  return (
    <Wrapper
      testID={testID}
      onPress={onPress}
      className={[
        'flex-row items-center rounded-full',
        isWeb ? webClassBySize[size] : '',
        containerClassFromTone, // <- flips with dark mode
        className ?? '',
      ].join(' ')}
      style={[
        !isWeb && {
          paddingHorizontal: S.px,
          paddingVertical: S.py,
          borderRadius: S.radius,
        },
        containerStyleFromTone, // solid/outline fallback
        Platform.OS !== 'android' && variant === 'soft'
          ? {
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
            }
          : null,
        style,
      ]}
    >
      {left ? <View style={{ marginRight: S.gap }}>{left}</View> : null}

      {text ? (
        <Text
          numberOfLines={1}
          className={textClassFromTone} // <- flips with dark mode for soft
          style={[
            { fontSize: computedFontSize, fontWeight: computedFontWeight },
            textStyleFromTone, // solid/outline fallback
            textStyle,
          ]}
        >
          {text}
        </Text>
      ) : null}

      {right ? <View style={{ marginLeft: S.gap }}>{right}</View> : null}
    </Wrapper>
  );
}
