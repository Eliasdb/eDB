// apps/mobile/src/lib/ui/Segmented.tsx
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from './theme';

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
    <View
      style={{
        backgroundColor: '#eef2f7',
        borderRadius: radius.md,
        padding: 4,
        flexDirection: 'row',
        gap: 6,
        alignSelf: 'flex-start',
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            onPress={() => onChange(o.value)}
            activeOpacity={0.9}
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radius.md,
              },
              on && {
                backgroundColor: colors.white,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 1,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: on ? colors.text : '#6b7280',
              }}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
