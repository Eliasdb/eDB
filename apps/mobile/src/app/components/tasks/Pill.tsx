import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Pill({
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

const styles = StyleSheet.create({
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
});
