// apps/mobile/src/features/crm/skeletons/task-row-skeleton.tsx
import { ListRow, Skeleton } from '@ui/primitives';
import { View } from 'react-native';

type Props = {
  compact?: boolean;
  showDividerTop?: boolean;
};

const CHECKBOX_SIZE = 20; // matches Checkbox size="sm"
const ICON_BTN_SIZE = 32; // matches IconButton size="xs"

export function TaskItemSkeleton({ compact, showDividerTop }: Props) {
  return (
    <ListRow
      compact={compact}
      showDividerTop={showDividerTop}
      left={
        // mimic Checkbox pressable box centered in the slot
        <View
          className="items-center justify-center"
          style={{ width: CHECKBOX_SIZE }}
        >
          <Skeleton width={CHECKBOX_SIZE} height={CHECKBOX_SIZE} radius={4} />
        </View>
      }
      body={
        <View className="flex-1">
          {/* task title line */}
          <Skeleton width="80%" height={14} radius={6} />
        </View>
      }
      right={
        <View className="flex-row items-center gap-2">
          <Skeleton
            width={ICON_BTN_SIZE}
            height={ICON_BTN_SIZE}
            radius={ICON_BTN_SIZE / 2}
          />
          <Skeleton
            width={ICON_BTN_SIZE}
            height={ICON_BTN_SIZE}
            radius={ICON_BTN_SIZE / 2}
          />
        </View>
      }
    />
  );
}
