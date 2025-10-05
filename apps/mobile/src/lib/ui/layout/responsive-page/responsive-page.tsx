import { ReactNode } from 'react';
import { View } from 'react-native';

export function PageContainer({
  children,
  maxWidth = 1100,
  paddingH = 16,
}: {
  children: ReactNode;
  maxWidth?: number;
  paddingH?: number;
}) {
  return (
    <View
      style={{
        width: '100%',
        maxWidth,
        paddingHorizontal: paddingH,
        alignSelf: 'center',
      }}
    >
      {children}
    </View>
  );
}

// ui/layout/TwoCol.tsx
import { Children } from 'react';
import { useWindowDimensions } from 'react-native';

type Props = {
  children: ReactNode | ReactNode[];
  columns?: number; // default 2
  gap?: number; // px gap between columns
  stackGap?: number; // px gap when stacked
  breakpoint?: number; // min width to switch to multi-column
  widths?: number[]; // optional fractions, e.g. [0.4, 0.6]
};

export function TwoCol({
  children,
  columns = 2,
  gap = 8,
  stackGap = 8,
  breakpoint = 1024,
  widths,
}: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoint;

  const items = Children.toArray(children);

  if (!isWide || columns <= 1) {
    return (
      <View style={{ marginTop: 8 }}>
        {/* stack all children with vertical gap */}
        {items.map((child, i) => (
          <View
            key={i}
            style={{ marginBottom: i < items.length - 1 ? stackGap : 0 }}
          >
            {child}
          </View>
        ))}
      </View>
    );
  }

  const cols: ReactNode[][] = Array.from({ length: columns }, () => []);
  // sequential distribution: 0,1,0,1,... for 2 columns (or mod N)
  items.forEach((child, i) => cols[i % columns].push(child));

  const colWidths =
    widths && widths.length === columns
      ? widths
      : Array.from({ length: columns }, () => 1 / columns);

  return (
    <View
      style={{ flexDirection: 'row', marginHorizontal: -gap / 2, marginTop: 8 }}
    >
      {cols.map((colChildren, ci) => (
        <View
          key={ci}
          style={{
            width: `${colWidths[ci] * 100}%`,
            paddingHorizontal: gap / 2,
          }}
        >
          {colChildren.map((child, ri) => (
            <View
              key={ri}
              style={{ marginBottom: ri < colChildren.length - 1 ? gap : 0 }}
            >
              {child}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
