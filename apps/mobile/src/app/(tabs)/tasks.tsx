import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useCreateTask,
  useDeleteTask,
  useHub,
  useToggleTask,
} from '../../lib/api/hooks';
import type { HubPayload, Task } from '../../lib/api/types';

const webPanY = Platform.OS === 'web' ? ({ touchAction: 'pan-y' } as any) : {};

export default function TasksScreen() {
  const { data, isLoading, isRefetching, refetch, error } = useHub();
  const toggle = useToggleTask();
  const addTask = useCreateTask();
  const delTask = useDeleteTask();

  const hub: HubPayload = data ?? { tasks: [], contacts: [], companies: [] };

  const onRefresh = useCallback(() => refetch(), [refetch]);

  return (
    <ScrollView
      style={[styles.screen, webPanY]}
      contentContainerStyle={[{ padding: 16, paddingBottom: 24 }, webPanY]}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefetching && !isLoading}
          onRefresh={onRefresh}
        />
      }
      keyboardShouldPersistTaps="handled"
    >
      {/* header / status */}
      {isLoading ? (
        <Card>
          <Text style={{ color: '#6c6f7b' }}>Loading Clara Hub…</Text>
        </Card>
      ) : error ? (
        <Card>
          <Text style={{ color: '#d00', fontWeight: '700' }}>
            Couldn’t load hub
          </Text>
          <Text style={{ color: '#8b9098', marginTop: 4 }}>
            {(error as any)?.message ?? 'Unknown error'}
          </Text>
        </Card>
      ) : null}

      {/* ---- Tasks ---- */}
      <Section title="Tasks">
        <AddTaskInline
          onAdd={(title) => addTask.mutate({ title })}
          isSaving={addTask.isPending}
        />

        <FlatList
          data={hub.tasks}
          keyExtractor={(t) => t.id}
          contentContainerStyle={webPanY as any}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <TaskRow
              task={item}
              onToggle={() => toggle.mutate({ id: item.id, next: !item.done })}
              onDelete={() => delTask.mutate(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState text="No tasks yet — Clara will drop them here." />
          }
        />
      </Section>

      {/* ---- Contacts ---- */}
      <Section title="Contacts">
        <FlatList
          data={hub.contacts}
          keyExtractor={(c) => c.id}
          contentContainerStyle={webPanY as any}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatarWrap}>
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarInitials}>
                      {initials(item.name)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.metaLine}>
                  {item.email ? (
                    <Pill icon="mail-outline" text={item.email} />
                  ) : null}
                  {item.phone ? (
                    <Pill icon="call-outline" text={item.phone} />
                  ) : null}
                  {item.source ? (
                    <Pill
                      icon="sparkles-outline"
                      text={`Added by Clara • ${item.source}`}
                      muted
                    />
                  ) : null}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState text="No contacts yet — Clara will place them here." />
          }
        />
      </Section>

      {/* ---- Companies ---- */}
      <Section title="Companies">
        <FlatList
          data={hub.companies}
          keyExtractor={(c) => c.id}
          contentContainerStyle={webPanY as any}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.logoWrap}>
                {item.logoUrl ? (
                  <Image source={{ uri: item.logoUrl }} style={styles.logo} />
                ) : (
                  <View style={[styles.logo, styles.logoFallback]}>
                    <Text style={styles.logoInitials}>
                      {initials(item.name)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.metaLine}>
                  {item.industry ? (
                    <Pill icon="briefcase-outline" text={item.industry} />
                  ) : null}
                  {item.domain ? (
                    <Pill icon="globe-outline" text={item.domain} />
                  ) : null}
                  {item.source ? (
                    <Pill
                      icon="sparkles-outline"
                      text={`Added by Clara • ${item.source}`}
                      muted
                    />
                  ) : null}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState text="No companies yet — Clara will link them here." />
          }
        />
      </Section>
    </ScrollView>
  );
}

/* ---------- Rows & bits ---------- */

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={[styles.row, webPanY]}>
      <TouchableOpacity onPress={onToggle} style={[styles.rowIcon, webPanY]}>
        <Ionicons
          name={task.done ? 'checkbox' : 'checkbox-outline'}
          size={18}
          color={task.done ? '#27ae60' : '#6C63FF'}
        />
      </TouchableOpacity>
      <View style={styles.rowMain}>
        <Text
          style={[
            styles.title,
            task.done && { textDecorationLine: 'line-through', opacity: 0.7 },
          ]}
        >
          {task.title}
        </Text>
        <View style={styles.metaLine}>
          {task.due ? <Pill icon="time-outline" text={task.due} /> : null}
          {task.source ? (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${task.source}`}
              muted
            />
          ) : null}
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <Ionicons name="trash-outline" size={18} color="#c23" />
      </TouchableOpacity>
    </View>
  );
}

function AddTaskInline({
  onAdd,
  isSaving,
}: {
  onAdd: (title: string) => void;
  isSaving: boolean;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText('');
    Keyboard.dismiss();
  };
  return (
    <View style={styles.addRow}>
      <Ionicons name="add-circle-outline" size={22} color="#6C63FF" />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a task…"
        returnKeyType="done"
        onSubmitEditing={submit}
        style={styles.addInput}
      />
      <TouchableOpacity onPress={submit} disabled={!text.trim() || isSaving}>
        <Text
          style={[
            styles.addBtn,
            (!text.trim() || isSaving) && { opacity: 0.5 },
          ]}
        >
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Pill({
  icon,
  text,
  muted,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  muted?: boolean;
}) {
  return (
    <View style={[styles.pill, muted && { backgroundColor: '#f2f3f7' }]}>
      <Ionicons name={icon} size={12} color="#6c6f7b" />
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ color: '#8b9098' }}>{text}</Text>
    </View>
  );
}

function initials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ececf2',
  },
  addBtn: { color: '#6C63FF', fontWeight: '700' },

  sep: { height: 1, backgroundColor: '#f0f1f4', marginLeft: 46 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  rowIcon: { width: 30, alignItems: 'center' },

  rowMain: { flex: 1 },
  title: { fontSize: 16, color: '#1f2328' },
  metaLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#eef1ff',
  },
  pillText: { fontSize: 12, color: '#6c6f7b' },

  avatarWrap: { width: 46, alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  avatarFallback: {
    backgroundColor: '#e8ebf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontWeight: '700', color: '#3a3f55' },

  logoWrap: { width: 46, alignItems: 'center' },
  logo: { width: 28, height: 28, borderRadius: 6 },
  logoFallback: {
    backgroundColor: '#e8ebf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitials: { fontWeight: '700', color: '#3a3f55', fontSize: 12 },
});
