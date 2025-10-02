// PieCard.tsx
import { View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

// Your data shape
type PieRow = { label: string; value: number; color?: string };

// One-time shim: current XL d.ts is too strict on key generics
const PolarChartAny = PolarChart as unknown as React.ComponentType<any>;

export function PieCard({ data }: { data: PieRow[] }) {
  return (
    <View style={{ height: 220, borderRadius: 12, overflow: 'hidden' }}>
      <PolarChartAny
        data={data}
        valueKey="value" // numeric field for slice size
        labelKey="label" // text field for labels
        colorKey="color" // optional per-slice color
      >
        {/* Valid props: innerRadius, startAngle, circleSweepDegrees, size */}
        <Pie.Chart innerRadius={60} />
        <Pie.Label />
      </PolarChartAny>
    </View>
  );
}

// Example usage:
// <PieCard data={[
//   { label: 'Open', value: 3, color: '#4f46e5' },
//   { label: 'Due Soon', value: 1, color: '#22c55e' },
//   { label: 'Done', value: 4, color: '#f59e0b' },
// ]} />
