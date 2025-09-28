// apps/mobile/src/features/crm/components/TaskRow.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pill } from '@ui';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import type { Task } from '../../../../lib/api/types';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export default function TaskRow({ task, onToggle, onDelete, onEdit }: Props) {
  // Animate only the checkbox (tiny pop when toggled)
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // pop → settle
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    // rerun whenever done state flips
  }, [task.done, scale]);

  const iconColor = useMemo(
    () => (task.done ? '#27ae60' : '#6C63FF'),
    [task.done],
  );

  return (
    <View className="flex-row items-start px-3 py-2">
      {/* Checkbox (left) */}
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={task.done ? 'Mark as not done' : 'Mark as done'}
        hitSlop={8}
        className="w-8 items-center pt-[2px]"
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={task.done ? 'checkbox' : 'square-outline'}
            size={20}
            color={iconColor}
          />
        </Animated.View>
      </Pressable>

      {/* Main content */}
      <View className="flex-1 pr-2">
        <Text
          className={`text-[15px] leading-[20px] text-text dark:text-text-dark ${
            task.done ? 'line-through opacity-70' : ''
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {/* Meta line */}
        {(task.due || task.source) && (
          <View className="flex-row flex-wrap gap-2 mt-1">
            {task.due ? <Pill icon="time-outline" text={task.due} /> : null}
            {task.source ? (
              <Pill
                icon="sparkles-outline"
                text={`Added by Clara • ${task.source}`}
                muted
              />
            ) : null}
          </View>
        )}
      </View>

      {/* Actions (right) */}
      <View className="flex-row items-center gap-2">
        <GhostIcon
          name="create-outline"
          onPress={onEdit}
          accessibilityLabel="Edit task"
        />
        <GhostIcon
          name="trash-outline"
          onPress={onDelete}
          danger
          accessibilityLabel="Delete task"
        />
      </View>
    </View>
  );
}

/* ---------- Small, sleek icon pill ---------- */
function GhostIcon({
  name,
  onPress,
  danger,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  danger?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className="
        w-8 h-8 rounded-full items-center justify-center
        bg-muted/80 dark:bg-muted-dark/80
        focus:outline-none focus:ring-1 focus:ring-primary/40
      "
      style={({ pressed }) =>
        pressed ? { opacity: 0.9, transform: [{ scale: 0.98 }] } : undefined
      }
    >
      <Ionicons name={name} size={18} color={danger ? '#ef4444' : '#6C63FF'} />
    </Pressable>
  );
}
