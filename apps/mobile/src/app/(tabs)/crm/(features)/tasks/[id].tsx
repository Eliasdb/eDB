// app/(tabs)/crm/(features)/tasks/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Screen } from '@ui/layout';
import { Pill } from '@ui/primitives';
import { DateField } from '@ui/widgets';

// 🆕 data-access imports
import type { Task } from '@data-access/crm/tasks';
import { useDeleteTask, usePatchTask } from '@data-access/crm/tasks';
import { useTask } from '@data-access/crm/tasks/queries';

export default function TaskEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // fetch a single task
  const { data: task } = useTask(id);

  // If item vanished (deleted / invalid id), close the sheet
  useEffect(() => {
    if (!task && id) {
      const t = setTimeout(() => router.back(), 0);
      return () => clearTimeout(t);
    }
  }, [task, id, router]);

  if (!task) return null;

  // mutations bound to this task
  const del = useDeleteTask();
  const patch = usePatchTask(task.id);

  return (
    <Screen center={false} padding={0}>
      <View style={{ padding: 16 }}>
        <EditBody
          initial={task}
          onClose={() => router.back()}
          onSave={(patchBody) => {
            patch.mutate(patchBody, { onSuccess: () => router.back() });
          }}
          onDelete={() => {
            del.mutate(task.id, { onSuccess: () => router.back() });
          }}
        />
      </View>
    </Screen>
  );
}

function EditBody({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial: Task;
  onClose: () => void;
  onSave: (patch: Partial<Task>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [due, setDue] = useState(initial.due ?? '');

  // reset form when the task changes (e.g., navigating between tasks)
  useEffect(() => {
    setTitle(initial.title ?? '');
    setDue(initial.due ?? '');
  }, [initial.id, initial.title, initial.due]);

  const canSave = title.trim().length > 0;
  const handleSave = () =>
    onSave({
      title: title.trim(),
      due: due.trim() || undefined,
    });

  return (
    <View>
      {/* Header */}
      <View className="px-4 pt-2 pb-2 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-text dark:text-text-dark">
          Taak bewerken
        </Text>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={22} color="#98a2b3" />
        </Pressable>
      </View>

      {/* Body */}
      <View className="p-4 gap-4">
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

        <DateField
          label="Vervaldatum"
          value={due}
          onChange={(next) => setDue(next ?? '')}
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
        </View>
      </View>
    </View>
  );
}
