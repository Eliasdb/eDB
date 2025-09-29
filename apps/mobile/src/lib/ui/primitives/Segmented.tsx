// apps/mobile/src/lib/ui/Segmented.tsx
import { Text, TouchableOpacity, View } from 'react-native';

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <View className="bg-muted dark:bg-muted-dark rounded-md p-1 flex-row gap-1.5 self-start">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            onPress={() => onChange(o.value)}
            activeOpacity={0.9}
            className={`px-3 py-1.5 rounded-md ${
              on ? 'bg-surface dark:bg-surface-dark shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-[12px] font-extrabold ${
                on
                  ? 'text-text dark:text-text-dark'
                  : 'text-text-dim dark:text-text-dimDark'
              }`}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
