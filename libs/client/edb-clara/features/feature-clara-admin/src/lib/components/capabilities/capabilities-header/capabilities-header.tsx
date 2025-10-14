// apps/mobile/src/lib/ui/admin/components/CapabilitiesHeader.tsx
import { Avatar } from '@edb/shared-ui-rn';
import { Text, View } from 'react-native';

export function CapabilitiesHeader({ total }: { total: number }) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <Avatar size={40} />
        <View>
          <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
            Clara
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            Realtime assistant • Capabilities overview
          </Text>
        </View>
      </View>

      {total ? (
        <View className="px-2 py-1 rounded-full bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
          <Text className="text-[12px] font-semibold text-text dark:text-text-dark">
            {total} tools
          </Text>
        </View>
      ) : null}
    </View>
  );
}
