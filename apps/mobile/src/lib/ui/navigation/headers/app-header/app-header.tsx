import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderUserMenu } from '../../headers/header-user-menu/header-user-menu';
import { HeaderIconKey, headerIconRegistry } from './icon-registry';

type Props = {
  title: string;
  subtitle?: string;

  /** Choose which registry icon to show on the left */
  leadingKey?: HeaderIconKey;

  /** If you need a one-off element instead of a registry key, pass it here */
  leading?: React.ReactNode;

  /** Called when the leading button is pressed (optional) */
  onLeadingPress?: () => void;

  /** Optional extra actions on the right (besides the user menu) */
  rightActions?: React.ReactNode;

  /** Navigate helper for the user menu */
  onNavigate?: (path: string, opts?: { replace?: boolean }) => void;
};

export function AppHeader({
  title,
  subtitle,
  leadingKey,
  leading,
  onLeadingPress,
  rightActions,
  onNavigate,
}: Props) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const isDark = useColorScheme() === 'dark';

  const TOOLBAR_H = 56;

  // palette
  const bg = isDark ? 'rgba(2, 3, 4, 0.95)' : 'rgba(255,255,255,0.85)';
  const border = isDark ? '#374151' : '#E5E7EB';
  const text = isDark ? '#E5E7EB' : '#111827';
  const dim = isDark ? '#9CA3AF' : '#6B7280';
  const primary = '#6C63FF';

  // icon chroma (for Ionicons variant)
  const iconNeutral = isDark ? '#E5E7EB' : '#111827';

  // pick the icon from the registry if a key is provided
  const leadingIconName = leadingKey
    ? headerIconRegistry[leadingKey]
    : undefined;

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: bg,
        ...(Platform.OS !== 'web'
          ? {
              shadowColor: '#000',
              shadowOpacity: 0.03,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }
          : {}),
        ...(Platform.OS === 'android' ? { elevation: 1 } : {}),
        borderBottomWidth: isWeb ? 1 : 0.5,
        borderBottomColor: `${border}66`,
      }}
    >
      <View
        style={{
          height: TOOLBAR_H,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 8,
          gap: 12,
        }}
      >
        {/* Left block: square leading + title */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flexShrink: 1,
          }}
        >
          <HeaderIconButton onPress={onLeadingPress}>
            {leading ? (
              leading
            ) : leadingIconName ? (
              <Ionicons
                name={leadingIconName as any}
                size={18}
                color={iconNeutral}
              />
            ) : null}
          </HeaderIconButton>

          <View style={{ flexShrink: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                color: text,
                fontSize: 20,
                fontWeight: '800',
                letterSpacing: 0.2,
              }}
            >
              {title}
            </Text>

            {subtitle ? (
              <Text
                numberOfLines={1}
                style={{ color: dim, fontSize: 12, marginTop: 2 }}
              >
                {subtitle}
              </Text>
            ) : null}

            {/* small accent underline aligned with title */}
            <View
              style={{
                marginTop: 6,
                height: 3,
                width: 28,
                borderRadius: 3,
                backgroundColor: primary,
              }}
            />
          </View>
        </View>

        {/* Right block: optional actions + user menu */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {rightActions}
          <HeaderUserMenu toolbarHeight={TOOLBAR_H} onNavigate={onNavigate} />
        </View>
      </View>
    </View>
  );
}

/** Square, slightly-angular header button container */
function HeaderIconButton({
  onPress,
  children,
}: {
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? '#0F172A' : '#F3F4F6';
  const border = isDark ? '#334155' : '#E5E7EB';

  if (!children) return <View style={{ width: 36 }} />; // keep layout if no icon

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Section icon"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
