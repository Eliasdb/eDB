import { useMemo } from 'react';
import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

export type DayStat = { label: string; value: number };

const H = 240;
const R = 12;

type Props = { data: DayStat[] };

export function BarsCard({ data }: Props) {
  const yMax = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);
  const paddedMax = Math.ceil(yMax * 1.25);

  return (
    <View style={{ height: H, borderRadius: R, overflow: 'hidden' }}>
      <CartesianChart<DayStat, 'label', 'value'>
        data={data}
        xKey="label"
        yKeys={['value']}
        axisOptions={{
          tickCount: 4,
          // If your lib supports these axis label styles, they render via Skia:
          // labelColor: '#9aa0a6',
          // fontSize: 11,
        }}
        // Some versions don’t expose domain; ignore if not supported
        // @ts-expect-error victory-native typings may not expose domain prop
        domain={{ y: [0, paddedMax] }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.value}
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
              // Let the chart render value labels via Skia (supported in newer builds)
              // If your version supports a labels prop:
              // @ts-expect-error labels support differs by victory-native version
              labels={{
                position: 'top',
                color: '#a0a0a0',
              }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
