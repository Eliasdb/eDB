// apps/mobile/src/features/crm/components/TaskRow.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pill } from '@ui/primitives';
import Checkbox from '@ui/primitives/Checkbox';
import IconButton from '@ui/primitives/IconButton';
import React from 'react';
import { Text, View } from 'react-native';
import type { Task } from '../../../../lib/api/types';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export default function TaskRow({ task, onToggle, onDelete, onEdit }: Props) {
  return (
    <View className="flex-row items-center px-3 py-2">
      {/* Checkbox */}
      <View className="w-8 items-center pt-[2px]">
        <Checkbox
          checked={task.done}
          onChange={onToggle}
          size="sm"
          tintChecked="success"
          tintUnchecked="primary"
          accessibilityLabel={task.done ? 'Mark as not done' : 'Mark as done'}
        />
      </View>

      {/* Main */}
      <View className="flex-1 pr-2">
        <Text
          className={`text-[15px] leading-[20px] text-text dark:text-text-dark ${
            task.done ? 'line-through opacity-70' : ''
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {(task.due || task.source) && (
          <View className="flex-row flex-wrap gap-2 mt-1">
            {task.due ? (
              <Pill
                left={
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                }
                text={task.due}
                tone="primary"
                preset="tag"
                size="sm"
                textWeight="regular" // lighter than before
                textSize={11.5} // slightly smaller for crispness
              />
            ) : null}
            {task.source ? (
              <Pill
                left={
                  <Ionicons name="sparkles-outline" size={14} color="#6B7280" />
                }
                text={`Added by Clara • ${task.source}`}
                tone="neutral"
                size="sm"
                preset="tag"
                textWeight="regular"
                textSize={11.5}
              />
            ) : null}
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <IconButton
          name="create-outline"
          variant="ghost"
          tint="primary"
          size="xs"
          accessibilityLabel="Edit task"
          onPress={onEdit}
        />
        <IconButton
          name="trash-outline"
          variant="ghost"
          tint="danger"
          size="xs"
          accessibilityLabel="Delete task"
          onPress={onDelete}
        />
      </View>
    </View>
  );
}
