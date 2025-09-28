// apps/mobile/src/lib/components/SkeletonRows.tsx
import { Skeleton } from '@ui';
import { View } from 'react-native';

export function TaskSkeletonRow() {
  return (
    <View className="flex-row items-center gap-2.5 py-2.5">
      <Skeleton width={20} height={20} radius={4} />
      <View className="flex-1">
        <Skeleton width="70%" height={16} radius={4} />
        <Skeleton width="40%" height={12} radius={4} className="mt-1.5" />
      </View>
    </View>
  );
}

export function ContactSkeletonRow() {
  return (
    <View className="flex-row items-center gap-2.5 py-2.5">
      <Skeleton width={34} height={34} radius={17} />
      <View className="flex-1">
        <Skeleton width="60%" height={16} radius={4} />
        <Skeleton width="40%" height={12} radius={4} className="mt-1.5" />
      </View>
    </View>
  );
}

export function CompanySkeletonRow() {
  return (
    <View className="flex-row items-center gap-2.5 py-2.5">
      <Skeleton width={28} height={28} radius={6} />
      <View className="flex-1">
        <Skeleton width="50%" height={16} radius={4} />
        <Skeleton width="30%" height={12} radius={4} className="mt-1.5" />
      </View>
    </View>
  );
}
