// apps/mobile/src/ui/composites/TaskRow.tsx
import type { Task } from '@api';
import { Checkbox, IconButton, ListRow } from '@ui/primitives';
import { Text, View } from 'react-native';

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
