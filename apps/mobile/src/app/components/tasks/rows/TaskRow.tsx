import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Task } from '../../../../lib/api/types';
import Pill from '../Pill';

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
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle} style={styles.rowIcon}>
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

      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <Ionicons name="trash-outline" size={18} color="#c23" />
      </TouchableOpacity>
    </View>
  );
}

export const rowStyles = StyleSheet.create({
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
});
const styles = rowStyles;
