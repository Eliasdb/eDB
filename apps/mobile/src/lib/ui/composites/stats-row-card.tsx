import { Text, View } from 'react-native';

export type StatsRowItem = { label: string; value?: string | number | null };

export function StatsRowCard({
  items,
}: {
  // Accept readonly tuples/arrays too
  items: ReadonlyArray<StatsRowItem> | Readonly<[StatsRowItem, StatsRowItem]>;
}) {
  // Normalize to a mutable array for rendering
  const rows = Array.isArray(items) ? Array.from(items) : [items];

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 16,
        alignItems: 'stretch',
      }}
    >
      {rows.map((it, idx) => (
        <View key={idx} style={{ flexDirection: 'row', flex: 1, gap: 16 }}>
          {/* stat */}
          <View style={{ flex: 1 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 12, marginBottom: 2 }}
            >
              {it.label}
            </Text>
            <Text
              className="text-text dark:text-text-dark"
              style={{ fontSize: 16, fontWeight: '700' }}
            >
              {it.value ?? '—'}
            </Text>
          </View>

          {/* divider (skip after last) */}
          {idx < rows.length - 1 ? (
            <View
              style={{
                width: 1,
                backgroundColor: 'rgba(148,163,184,0.28)',
                alignSelf: 'stretch',
              }}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

export default StatsRowCard;
