// apps/mobile/src/lib/ui/ThemePicker.tsx
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from './primitives';
import { useThemePreference } from './themePreference';

const themeOptions: {
  value: 'system' | 'light' | 'dark';
  label: string;
}[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemePicker() {
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
          Theme
        </Text>
      </View>

      {themeOptions.map(({ value, label }) => (
        <TouchableOpacity
          key={value}
          onPress={() => setOverride(value)}
          className="flex-row items-center justify-between px-md py-md border-t border-border dark:border-border-dark"
          activeOpacity={0.7}
        >
          <Text className="text-[15px] text-text dark:text-text-dark">
            {label}
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
