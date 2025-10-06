// apps/mobile/src/lib/ui/ThemePicker.tsx
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

// ⬇️ Use the new hook (export type ThemeOverride from your hook file)
import { useThemeOverride } from './uset';
export type ThemeOption = 'system' | 'light' | 'dark';

const OPTIONS: ThemeOption[] = ['system', 'light', 'dark'];

export function ThemePicker() {
  const { t } = useTranslation();
  const { override, setOverride } = useThemeOverride(); // { override: 'system'|'light'|'dark' }

  return (
    <View>
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
            className={`w-4 h-4 rounded-full border-2 ${
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
