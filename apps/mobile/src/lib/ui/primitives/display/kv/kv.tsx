// apps/mobile/src/lib/ui/primitives/display/kv.tsx
import { Text, View } from 'react-native';
import { MonoText } from './mono-text';

export function MonoKV({ label, value }: { label: string; value: any }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <MonoText>{pretty(value)}</MonoText>
    </View>
  );
}

export function KV({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <Text
        className="text-[14px] text-text dark:text-text-dark"
        numberOfLines={4}
      >
        {value}
      </Text>
    </View>
  );
}

function pretty(v: any) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}
