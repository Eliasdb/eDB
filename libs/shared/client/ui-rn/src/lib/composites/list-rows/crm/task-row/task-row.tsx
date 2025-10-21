// apps/mobile/src/ui/composites/TaskRow.tsx
import { Text, View } from 'react-native';
import { Checkbox, IconButton, ListRow } from '../../../../primitives';

// Minimal, UI-focused shape (allows extra fields some callers use)
export type TaskLike = {
  title: string;
  done?: boolean;
  id?: string; // optional so stories / lists can pass it without errors
  due?: string;
  source?: string;
};

type Props<T extends TaskLike = TaskLike> = {
  task: T;
  onToggle: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  compact?: boolean;
  showDividerTop?: boolean;
};

export function TaskRow<T extends TaskLike>({
  task,
  onToggle,
  onDelete,
  onEdit,
  compact,
  showDividerTop,
}: Props<T>) {
  const left = (
    <Checkbox
      checked={!!task.done}
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
      {/* If you ever want to show due/source subtly, uncomment:
      {(task.due || task.source) && (
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark mt-0.5">
          {[task.due, task.source].filter(Boolean).join(' • ')}
        </Text>
      )}
      */}
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
