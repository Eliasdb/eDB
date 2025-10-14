// apps/mobile/src/lib/ui/primitives/lists/empty-line.tsx
import { Text, View } from 'react-native';

export function EmptyLine({ text }: { text: string }) {
  return (
    <View className="min-h-[56px] justify-center py-3 px-4">
      <Text className="text-[15px] text-text-dim dark:text-text-dimDark">
        {text}
      </Text>
    </View>
  );
}
