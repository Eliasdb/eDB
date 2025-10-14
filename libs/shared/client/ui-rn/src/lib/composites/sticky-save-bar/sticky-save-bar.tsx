// ui/composites/sticky-save-bar/StickySaveBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../primitives';

type Props = {
  dirty: boolean;
  onSave: () => void;

  /** Button label (i18n upstream) */
  label: string;

  /** Left status text */
  unsavedText?: string; // e.g. "You have unsaved changes"
  upToDateText?: string; // e.g. "Up to date"

  /** Extra padding inside bar (both top & bottom). Default 12 */
  pad?: number;

  /** Add safe-area bottom padding inside the bar. Default true */
  safeBottom?: boolean;

  /** Shadow/elevation override if you want to tweak */
  style?: StyleProp<ViewStyle>;

  /** Extra className (tailwind) */
  className?: string;
};

export function StickySaveBar({
  dirty,
  onSave,
  label,
  unsavedText = 'You have unsaved changes',
  upToDateText = 'Up to date',
  pad = 2,
  safeBottom = true,
  style,
  className,
}: Props) {
  const insets = useSafeAreaInsets();
  const pb = pad + (safeBottom ? insets.bottom : 0);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View
        className={[
          'bg-surface/95 dark:bg-surface-dark/95',
          'border-t border-border dark:border-border-dark',
          'px-4',
          className ?? '',
        ].join(' ')}
        style={[
          {
            paddingTop: pad,
            paddingBottom: pb,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -2 },
            // Android
            elevation: 6,
          },
          style,
        ]}
      >
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            {dirty ? unsavedText : upToDateText}
          </Text>
          {!dirty ? (
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          ) : null}
        </View>

        <Button
          label={label}
          iconLeft="save-outline"
          variant="solid"
          tint="primary"
          size="md"
          fullWidth
          disabled={!dirty}
          onPress={onSave}
        />
      </View>
    </View>
  );
}
