// apps/mobile/src/lib/ui/primitives/SwipeableItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods, // 👈 import the ref type
} from 'react-native-gesture-handler/ReanimatedSwipeable';

type Props = {
  children: React.ReactNode;
  onDelete?: () => void;
  onLongPressMenu?: () => void;
  disableSwipe?: boolean;
};

export default function SwipeableItem({
  children,
  onDelete,
  onLongPressMenu,
  disableSwipe,
}: Props) {
  const ref = useRef<SwipeableMethods | null>(null); // 👈 correct type

  function renderRightActions() {
    if (!onDelete) return null;
    return (
      <View className="flex-row h-full">
        <Pressable
          onPress={() => {
            ref.current?.close(); // 👈 methods are typed now
            onDelete?.();
          }}
          accessibilityLabel="Delete"
          className="items-center justify-center"
          style={{
            paddingHorizontal: 14,
            backgroundColor: 'rgba(239,68,68,0.88)',
            minWidth: 56,
          }}
        >
          <Ionicons name="trash-outline" size={18} color="white" />
        </Pressable>
      </View>
    );
  }

  const content = (
    <Pressable onLongPress={onLongPressMenu} delayLongPress={250}>
      {children}
    </Pressable>
  );

  if (disableSwipe || !onDelete) return content;

  return (
    <ReanimatedSwipeable ref={ref} renderRightActions={renderRightActions}>
      {content}
    </ReanimatedSwipeable>
  );
}
