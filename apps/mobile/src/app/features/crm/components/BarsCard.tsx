import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
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
        axisOptions={{ tickCount: 4 }}
        // @ts-ignore some versions don’t expose domain; ignore if not supported
        domain={{ y: [0, paddedMax] }}
      >
        {({ points, chartBounds }) => (
          <>
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
            />

            {/* value labels above bars */}
            {points.value.map((p: any, i: number) => (
              <Text
                key={`vl-${i}`}
                style={{
                  position: 'absolute',
                  left: p.x - 8,
                  top: Math.min(p.y - 18, chartBounds.top + 6),
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#a0a0a0',
                }}
              >
                {data[i]?.value ?? 0}
              </Text>
            ))}

            {/* weekday labels under bars */}
            {points.value.map((p: any, i: number) => (
              <Text
                key={`xl-${i}`}
                numberOfLines={1}
                style={{
                  position: 'absolute',
                  left: p.x - 12,
                  top: chartBounds.bottom + 6,
                  width: 24,
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#9aa0a6',
                }}
              >
                {data[i]?.label ?? ''}
              </Text>
            ))}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
