// ui/layout/Screen.tsx
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Padding =
  | number
  | {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      h?: number;
      v?: number;
    };

type Props = ScrollViewProps & {
  center?: boolean;
  padding?: Padding; // number or object
  safeTop?: boolean; // include safe-area top
  safeBottom?: boolean; // include safe-area bottom
  keyboardAvoid?: boolean; // wrap in KAV on iOS
};

export function Screen({
  center = true,
  padding = 32,
  safeTop = false,
  safeBottom = false,
  keyboardAvoid = true,
  contentContainerStyle,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();

  const p =
    typeof padding === 'number'
      ? { top: padding, bottom: padding, left: padding, right: padding }
      : {
          top: padding.top ?? padding.v ?? 0,
          bottom: padding.bottom ?? padding.v ?? 0,
          left: padding.left ?? padding.h ?? 0,
          right: padding.right ?? padding.h ?? 0,
        };

  const padTop = p.top + (safeTop ? insets.top : 0);
  const padBottom = p.bottom + (safeBottom ? insets.bottom : 0);

  const scroll = (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        minHeight: '100%',
        paddingTop: padTop,
        paddingBottom: padBottom,
        paddingLeft: p.left,
        paddingRight: p.right,
        ...(center ? { alignItems: 'center', justifyContent: 'center' } : null),
        ...(contentContainerStyle as any),
      }}
      {...rest}
    />
  );

  if (!keyboardAvoid) return scroll;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {scroll}
    </KeyboardAvoidingView>
  );
}
