// apps/mobile/src/app/(features)/admin/logs/AdminLogsHeader.tsx
import { Segmented } from '@edb/shared-ui-rn';
import { Text, View } from 'react-native';

type ViewMode = 'cards' | 'terminal';

export function AdminLogsHeader({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <View className="px-4 pt-5 pb-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">
          Activity logs
        </Text>
        <View className="mb-4">
          <Segmented<ViewMode>
            value={mode}
            onChange={onChange}
            options={[
              { value: 'cards', label: 'Cards' },
              { value: 'terminal', label: 'Terminal' },
            ]}
          />
        </View>
      </View>
      <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
        Review the actions Clara has taken: creations, updates, deletions and
        snapshots. Switch to the terminal view for a compact, columnar list.
      </Text>
    </View>
  );
}
