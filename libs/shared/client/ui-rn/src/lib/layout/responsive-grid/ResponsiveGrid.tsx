// ui/layout/ResponsiveGrid.tsx
import { Children, ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';

export function ResponsiveGrid({
  children,
  columns = 2,
  gap = 12,
  breakpoint = 900,
}: {
  children: ReactNode;
  columns?: number;
  gap?: number;
  breakpoint?: number;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoint;
  const items = Children.toArray(children);

  if (!isWide || columns <= 1) {
    return (
      <View className="mt-2">
        {items.map((c, i) => (
          <View key={i} style={{ marginBottom: gap }}>
            {c}
          </View>
        ))}
      </View>
    );
  }

  // simple column split by index
  const cols: ReactNode[][] = Array.from({ length: columns }, () => []);
  items.forEach((child, i) => cols[i % columns].push(child));

  return (
    <View
      style={{ flexDirection: 'row', marginHorizontal: -gap / 2 }}
      className="mt-2"
    >
      {cols.map((col, ci) => (
        <View
          key={ci}
          style={{ width: `${100 / columns}%`, paddingHorizontal: gap / 2 }}
        >
          {col.map((c, i) => (
            <View key={i} style={{ marginBottom: gap }}>
              {c}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
