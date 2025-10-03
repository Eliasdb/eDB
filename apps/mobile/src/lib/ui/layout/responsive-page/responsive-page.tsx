import React, { ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';

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

/**
 * Responsive 2-column container.
 * First child goes left, second child goes right.
 */
export function TwoCol({
  children,
  gap = 8,
  breakpoint = 1024,
  leftWidth = 0.5,
  rightWidth = 0.5,
}: {
  children: ReactNode[];
  gap?: number;
  breakpoint?: number;
  leftWidth?: number;
  rightWidth?: number;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoint;

  // Ensure children is always an array
  const [left, right] = React.Children.toArray(children);

  if (!isWide) {
    return (
      <View style={{ marginTop: 8 }}>
        {left}
        <View style={{ height: gap }} />
        {right}
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: -gap / 2,
        marginTop: 8,
      }}
    >
      <View
        style={{ width: `${leftWidth * 100}%`, paddingHorizontal: gap / 2 }}
      >
        {left}
      </View>
      <View
        style={{ width: `${rightWidth * 100}%`, paddingHorizontal: gap / 2 }}
      >
        {right}
      </View>
    </View>
  );
}
