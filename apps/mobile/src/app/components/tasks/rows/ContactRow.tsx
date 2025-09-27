import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Pill from '../Pill';

export default function ContactRow({
  c,
}: {
  c: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    source?: string;
  };
}) {
  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        {c.avatarUrl ? (
          <Image source={{ uri: c.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>{initials(c.name)}</Text>
          </View>
        )}
      </View>
      <View style={styles.rowMain}>
        <Text style={styles.title}>{c.name}</Text>
        <View style={styles.metaLine}>
          {c.email && <Pill icon="mail-outline" text={c.email} />}
          {c.phone && <Pill icon="call-outline" text={c.phone} />}
          {c.source && (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${c.source}`}
              muted
            />
          )}
        </View>
      </View>
    </View>
  );
}

function initials(name?: string) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  rowMain: { flex: 1 },
  title: { fontSize: 16, color: '#1f2328' },
  metaLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  avatarWrap: { width: 46, alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  avatarFallback: {
    backgroundColor: '#e8ebf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontWeight: '700', color: '#3a3f55' },
});
