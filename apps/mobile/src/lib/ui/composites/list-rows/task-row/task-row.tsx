import { Ionicons } from '@expo/vector-icons';
import { Checkbox, IconButton, ListRow, Pill } from '@ui/primitives';
import { Text, View } from 'react-native';

import type { Task } from '@api';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  compact?: boolean;
  showDividerTop?: boolean;
};

export function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
  compact,
  showDividerTop,
}: Props) {
  const left = (
    <Checkbox
      checked={task.done}
      onChange={onToggle}
      size="sm"
      tintChecked="success"
      tintUnchecked="primary"
      accessibilityLabel={task.done ? 'Mark as not done' : 'Mark as done'}
    />
  );

  const body = (
    <View>
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
              left={<Ionicons name="time-outline" size={14} color="#6B7280" />}
              text={task.due}
              tone="primary"
              preset="tag"
              size="sm"
              textWeight="regular"
              textSize={11.5}
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
  );

  const right = (
    <>
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
    </>
  );

  return (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
    />
  );
}
