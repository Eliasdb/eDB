// apps/mobile/src/lib/ui/ThemePicker.tsx
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './primitives';
import { useThemePreference } from './themePreference';

type ThemeOption = 'system' | 'light' | 'dark';
const OPTIONS: ThemeOption[] = ['system', 'light', 'dark'];

export function ThemePicker() {
  const { t } = useTranslation();
  const { override, setOverride } = useThemePreference();

  return (
    <View className="border-t border-border dark:border-border-dark">
      {/* Title with icon */}
      <View className="flex-row items-center gap-2 px-md pt-md mb-sm">
        <Icon
          name="color-palette-outline"
          className="text-text dark:text-text-dark"
        />
        <Text className="text-[16px] font-semibold text-text dark:text-text-dark">
          {t('theme.title')}
        </Text>
      </View>

      {OPTIONS.map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => setOverride(value)}
          className="flex-row items-center justify-between px-md py-md border-t border-border dark:border-border-dark"
          activeOpacity={0.7}
        >
          <Text className="text-[15px] text-text dark:text-text-dark">
            {t(`theme.${value}`)}
          </Text>
          <View
            className={`w-5 h-5 rounded-full border-2 ${
              override === value
                ? 'border-primary bg-primary'
                : 'border-border dark:border-border-dark'
            }`}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
