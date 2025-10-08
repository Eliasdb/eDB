import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  LayoutAnimation as RNLayoutAnimation,
  View,
  type LayoutAnimationConfig,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

type Props = ViewProps & {
  open: boolean;
  duration?: number; // default 260ms
  keepMounted?: boolean; // keep children mounted when closed
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function Collapsible({
  open,
  duration = 260,
  keepMounted = true,
  style,
  contentContainerStyle,
  children,
  ...rest
}: Props) {
  const fade = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    // You can also do: const config: Parameters<typeof RNLayoutAnimation.configureNext>[0] = { ... }
    const config: LayoutAnimationConfig = {
      duration,
      create: {
        type: RNLayoutAnimation.Types.easeInEaseOut,
        property: RNLayoutAnimation.Properties.opacity,
        duration,
      },
      update:
        Platform.OS === 'ios'
          ? { type: RNLayoutAnimation.Types.spring, springDamping: 0.85 }
          : { type: RNLayoutAnimation.Types.easeInEaseOut, duration },
      delete: {
        type: RNLayoutAnimation.Types.easeInEaseOut,
        property: RNLayoutAnimation.Properties.opacity,
        duration: Math.min(200, duration),
      },
    };

    RNLayoutAnimation.configureNext(config);

    Animated.timing(fade, {
      toValue: open ? 1 : 0,
      duration: Math.min(220, duration),
      useNativeDriver: true,
    }).start();
  }, [open, duration, fade]);

  return (
    <View style={[{ overflow: 'hidden' }, style]} {...rest}>
      {open || keepMounted ? (
        <Animated.View
          style={[
            { opacity: fade },
            // when closed but mounted, collapse vertical space
            !open && keepMounted
              ? { height: 0, paddingTop: 0, paddingBottom: 0 }
              : null,
            contentContainerStyle,
          ]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
}
