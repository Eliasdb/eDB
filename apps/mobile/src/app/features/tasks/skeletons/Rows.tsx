import { Skeleton } from '@ui';
import { View } from 'react-native';

export function TaskSkeletonRow() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
      }}
    >
      <Skeleton width={20} height={20} radius={4} />
      <View style={{ flex: 1 }}>
        <Skeleton width="70%" height={16} radius={4} />
        <Skeleton width="40%" height={12} radius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function ContactSkeletonRow() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
      }}
    >
      <Skeleton width={34} height={34} radius={17} />
      <View style={{ flex: 1 }}>
        <Skeleton width="60%" height={16} radius={4} />
        <Skeleton width="40%" height={12} radius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function CompanySkeletonRow() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
      }}
    >
      <Skeleton width={28} height={28} radius={6} />
      <View style={{ flex: 1 }}>
        <Skeleton width="50%" height={16} radius={4} />
        <Skeleton width="30%" height={12} radius={4} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}
