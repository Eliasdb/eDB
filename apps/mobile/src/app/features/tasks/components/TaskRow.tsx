// apps/mobile/src/lib/components/TaskRow.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pill } from '@ui';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Task } from '../../../../lib/api/types';

export default function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="flex-row items-center py-2.5 gap-2">
      {/* Toggle checkbox */}
      <TouchableOpacity onPress={onToggle} className="w-[30px] items-center">
        <Ionicons
          name={task.done ? 'checkbox' : 'checkbox-outline'}
          size={18}
          color={task.done ? '#27ae60' : '#6C63FF'}
        />
      </TouchableOpacity>

      {/* Title + meta */}
      <View className="flex-1">
        <Text
          className={`text-[16px] text-text dark:text-text-dark ${
            task.done ? 'line-through opacity-70' : ''
          }`}
        >
          {task.title}
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-1">
          {task.due && <Pill icon="time-outline" text={task.due} />}
          {task.source && (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${task.source}`}
              muted
            />
          )}
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <Ionicons name="trash-outline" size={18} color="#c23" />
      </TouchableOpacity>
    </View>
  );
}
