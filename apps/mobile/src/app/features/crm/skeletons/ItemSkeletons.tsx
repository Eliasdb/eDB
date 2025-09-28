// apps/mobile/src/features/crm/skeletons/ItemSkeletons.tsx
import Skeleton from '@ui/Skeleton';
import React from 'react';
import { View } from 'react-native';

/** Container that matches your List rounding/borders */
export function ListSkeleton({
  rows,
  renderRow,
  rowHeight = 56,
}: {
  rows: number;
  renderRow: (index: number) => React.ReactNode;
  rowHeight?: number;
}) {
  return (
    <View className="rounded-xl overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={i}
          className={
            i > 0 ? 'border-t border-border dark:border-border-dark' : ''
          }
          style={{ height: rowHeight }}
        >
          {renderRow(i)}
        </View>
      ))}
    </View>
  );
}

/** Tasks: checkbox • title line • (chip) • action pills */
export function TaskItemSkeleton() {
  return (
    <View className="flex-row items-center px-3 py-2">
      {/* checkbox */}
      <View className="w-8 items-center">
        <Skeleton width={18} height={18} radius={4} />
      </View>

      {/* title + optional chip */}
      <View className="flex-1 pr-2">
        <Skeleton width="80%" height={14} radius={6} />
        <View className="mt-2">
          <Skeleton width={120} height={20} radius={12} />
        </View>
      </View>

      {/* actions */}
      <View className="flex-row items-center gap-2">
        <Skeleton width={32} height={32} radius={16} />
        <Skeleton width={32} height={32} radius={16} />
      </View>
    </View>
  );
}

/** Contacts: avatar • name line • chip row */
export function ContactItemSkeleton() {
  return (
    <View className="flex-row items-center px-2 py-2.5">
      <View className="w-10 items-center">
        <Skeleton width={34} height={34} radius={17} />
      </View>
      <View className="flex-1 pr-2">
        <Skeleton width="60%" height={16} radius={6} />
        <View className="flex-row gap-2 mt-2">
          <Skeleton width={140} height={22} radius={12} />
          <Skeleton width={90} height={22} radius={12} />
        </View>
      </View>
    </View>
  );
}

/** Companies: square logo • name line • chip row */
export function CompanyItemSkeleton() {
  return (
    <View className="flex-row items-center px-2 py-2.5">
      <View className="w-10 items-center">
        <Skeleton width={32} height={32} radius={8} />
      </View>
      <View className="flex-1 pr-2">
        <Skeleton width="55%" height={16} radius={6} />
        <View className="flex-row gap-2 mt-2">
          <Skeleton width={110} height={22} radius={12} />
          <Skeleton width={90} height={22} radius={12} />
        </View>
      </View>
    </View>
  );
}
