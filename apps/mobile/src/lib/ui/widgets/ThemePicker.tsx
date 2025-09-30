// apps/mobile/src/lib/ui/ThemePicker.tsx
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemePreference } from '../providers';

type ThemeOption = 'system' | 'light' | 'dark';
const OPTIONS: ThemeOption[] = ['system', 'light', 'dark'];

export function ThemePicker() {
  const { t } = useTranslation();
  const { override, setOverride } = useThemePreference();

  return (
    // no header/title here anymore
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
