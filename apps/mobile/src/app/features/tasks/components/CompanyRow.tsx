import { Pill } from '@ui';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function CompanyRow({
  co,
}: {
  co: {
    id: string;
    name: string;
    industry?: string;
    domain?: string;
    logoUrl?: string;
    source?: string;
  };
}) {
  return (
    <View style={styles.row}>
      <View style={styles.logoWrap}>
        {co.logoUrl ? (
          <Image source={{ uri: co.logoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoInitials}>{initials(co.name)}</Text>
          </View>
        )}
      </View>
      <View style={styles.rowMain}>
        <Text style={styles.title}>{co.name}</Text>
        <View style={styles.metaLine}>
          {co.industry && <Pill icon="briefcase-outline" text={co.industry} />}
          {co.domain && <Pill icon="globe-outline" text={co.domain} />}
          {co.source && (
            <Pill
              icon="sparkles-outline"
              text={`Added by Clara • ${co.source}`}
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
  logoWrap: { width: 46, alignItems: 'center' },
  logo: { width: 28, height: 28, borderRadius: 6 },
  logoFallback: {
    backgroundColor: '#e8ebf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitials: { fontWeight: '700', color: '#3a3f55', fontSize: 12 },
});
