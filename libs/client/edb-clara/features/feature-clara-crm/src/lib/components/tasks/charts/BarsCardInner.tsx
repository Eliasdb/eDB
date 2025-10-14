// apps/mobile/src/features/charts/BarsCardInner.tsx
import { View } from 'react-native';
import { Bar, CartesianChart, Line } from 'victory-native';

export type Row = { label: string; value: number };

export default function BarsCardInner({ data }: { data: Row[] }) {
  return (
    <View style={{ height: 220, borderRadius: 12, overflow: 'hidden' }}>
      <CartesianChart<Row, 'label', 'value'>
        data={data}
        xKey="label"
        yKeys={['value']}
        axisOptions={{ tickCount: 5 }}
      >
        {({ points, chartBounds }) => (
          <>
            <Bar points={points.value} chartBounds={chartBounds} />
            <Line points={points.value} />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
