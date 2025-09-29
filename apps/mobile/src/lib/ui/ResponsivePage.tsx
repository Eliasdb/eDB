import React from 'react';
import { useWindowDimensions, View } from 'react-native';

export function PageContainer({
  children,
  maxWidth = 1100,
  paddingH = 16,
}: {
  children: React.ReactNode;
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
 * Responsive 2-column container. On wide screens it renders side-by-side,
 * on mobile it renders stacked.
 */
export function TwoCol({
  left,
  right,
  gap = 8,
  breakpoint = 1024,
  leftWidth = 0.5,
  rightWidth = 0.5,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  gap?: number;
  breakpoint?: number;
  leftWidth?: number; // fraction (0–1)
  rightWidth?: number; // fraction (0–1)
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= breakpoint;

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
      style={{ flexDirection: 'row', marginHorizontal: -gap / 2, marginTop: 8 }}
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
