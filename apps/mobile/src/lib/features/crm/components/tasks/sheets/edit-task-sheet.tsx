import { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Pill, Sheet } from '@ui/primitives';
import { DateField } from '@ui/widgets';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { Task } from '@data-access/crm/tasks';

type Props = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (patch: Partial<Task>) => void;
  onDelete?: () => void;
};

export function EditTaskSheet({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [due, setDue] = useState(task?.due ?? '');

  // reset when opening / switching item
  useEffect(() => {
    setTitle(task?.title ?? '');
    setDue(task?.due ?? '');
  }, [task?.id, visible]);

  const canSave = title.trim().length > 0;

  const handleSave = () =>
    onSave({
      title: title.trim(),
      due: due.trim() || undefined,
    });

  return (
    <Sheet visible={visible} onClose={onClose}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-text dark:text-text-dark">
          Bewerken
        </Text>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={22} color="#98a2b3" />
        </Pressable>
      </View>

      {/* Body */}
      <View className="p-4 gap-4">
        {/* Title */}
        <View>
          <Text className="text-[13px] mb-1 text-text-dim dark:text-text-dimDark">
            Titel
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Wat moet er gebeuren?"
            placeholderTextColor="#98a2b3"
            className="rounded-lg px-3 py-2 text-[16px]
                       bg-muted dark:bg-muted-dark
                       border border-border dark:border-border-dark
                       text-text dark:text-text-dark"
            returnKeyType="done"
          />
        </View>
        {/* Due date → now uses DateField */}

        <DateField
          label="Vervaldatum"
          value={due}
          onChange={(next) => setDue(next ?? '')} // ← adapter fixes the type mismatch
        />

        {!!due && (
          <View className="mt-2">
            <Pill left="time-outline" text={due} />
          </View>
        )}
        {/* Actions */}
        <View className="flex-row items-center justify-between mt-2">
          <Pressable
            onPress={canSave ? handleSave : undefined}
            disabled={!canSave}
            className={`px-4 h-10 rounded-pill flex-row items-center justify-center
                        ${canSave ? 'bg-primary' : 'bg-muted'}`}
            style={({ pressed }) =>
              pressed && canSave ? { opacity: 0.9 } : undefined
            }
            accessibilityRole="button"
            accessibilityLabel="Opslaan"
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text className="text-white font-semibold text-[15px] ml-2">
              Opslaan
            </Text>
          </Pressable>

          {onDelete ? (
            <Pressable
              onPress={onDelete}
              className="px-4 h-10 rounded-pill flex-row items-center justify-center bg-danger/90"
              style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
              accessibilityRole="button"
              accessibilityLabel="Verwijderen"
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text className="text-white font-semibold text-[15px] ml-2">
                Verwijderen
              </Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>
      </View>
    </Sheet>
  );
}
