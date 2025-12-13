// apps/mobile/src/features/crm/components/BarsCard.web.tsx
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import React, { useMemo } from 'react';
import { Platform, Text, View } from 'react-native';
import type { DayStat } from './BarsCard';

const CHART_H = 220; // Skia drawing area
const X_LABEL_ROW_H = 22; // row under the chart
const TITLE_H = 18; // bottom axis title
const WRAP_H = CHART_H + X_LABEL_ROW_H + TITLE_H + 10; // total wrapper height
const R = 12;

function useIsDark() {
  // piggyback on your "dark" class from ThemePreferenceProvider
  if (Platform.OS !== 'web') return false;
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  );
}

export function BarsCard({ data }: { data: DayStat[] }) {
  const isDark = useIsDark();

  const yMax = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);
  const paddedMax = Math.ceil(yMax * 1.2);

  const barColor = isDark ? '#8ab4f8' : '#1a73e8';
  const labelColor = isDark ? '#b6bcc6' : '#5f6368'; // axis labels
  const titleColor = isDark ? '#dde3ea' : '#1f1f1f'; // axis titles

  return (
    <View style={{ height: WRAP_H, position: 'relative' }}>
      {/* Skia chart area */}
      <WithSkiaWeb
        opts={{
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}`,
        }}
        getComponent={async () => {
          const VN = await import('victory-native');
          const Comp = (() => {
            const CartesianChart: any = (VN as any).CartesianChart;
            const Bar: any = (VN as any).Bar;
            type ChartPoint = { x: number; y: number };
            const Chart: React.ComponentType<object> = () => (
              <View
                style={{
                  height: CHART_H,
                  borderRadius: R,
                  overflow: 'hidden',
                }}
              >
                <CartesianChart
                  data={data}
                  xKey="label"
                  yKeys={['value']}
                  axisOptions={{ tickCount: 4 }}
                  domain={{ y: [0, paddedMax] }}
                >
                  {({ points, chartBounds }: any) => (
                    <Bar
                      points={points.value as ChartPoint[]}
                      chartBounds={chartBounds}
                      roundedCorners={{
                        topLeft: 8,
                        topRight: 8,
                        bottomLeft: 2,
                        bottomRight: 2,
                      }}
                      innerPadding={14}
                      barWidth={18}
                      animate={{ type: 'timing', duration: 350 }}
                      // color prop name varies by version; both are handled:
                      {...{ color: barColor, fill: barColor }}
                      labels={{ position: 'top' }}
                    />
                  )}
                </CartesianChart>
              </View>
            );
            return Chart;
          })() as React.ComponentType<object>;
          return { default: Comp };
        }}
        fallback={<View style={{ height: CHART_H, borderRadius: R }} />}
      />

      {/* X-axis labels row (outside Skia, so RN Text works) */}
      <View
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          top: CHART_H, // directly under chart
          height: X_LABEL_ROW_H,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
        }}
      >
        {data.map((d, i) => (
          <Text
            key={`xlab-${i}`}
            numberOfLines={1}
            style={{
              width: `${100 / data.length}%`,
              textAlign: 'center',
              fontSize: 11,
              color: labelColor,
            }}
          >
            {d.label}
          </Text>
        ))}
      </View>

      {/* Axis titles */}
      <Text
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: CHART_H + X_LABEL_ROW_H - 2,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '600',
          color: titleColor,
        }}
      >
        Weekday
      </Text>

      <Text
        style={{
          position: 'absolute',
          left: -4, // tuck toward the left edge
          top: CHART_H / 2 - 10,
          transform: [{ rotate: '-90deg' }],
          fontSize: 12,
          fontWeight: '600',
          color: titleColor,
        }}
      >
        Tasks Due
      </Text>
    </View>
  );
}
