import { View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

// Your data shape
type PieRow = { label: string; value: number; color?: string };

// One-time shim: current XL d.ts is too strict on key generics
type PolarChartProps = {
  data: PieRow[];
  valueKey: keyof PieRow;
  labelKey: keyof PieRow;
  colorKey?: keyof PieRow;
  children?: React.ReactNode;
};
const PolarChartShim = PolarChart as unknown as React.ComponentType<PolarChartProps>;

export function PieCard({ data }: { data: PieRow[] }) {
  return (
    <View style={{ height: 220, borderRadius: 12, overflow: 'hidden' }}>
      <PolarChartShim
        data={data}
        valueKey="value" // numeric field for slice size
        labelKey="label" // text field for labels
        colorKey="color" // optional per-slice color
      >
        {/* Valid props: innerRadius, startAngle, circleSweepDegrees, size */}
        <Pie.Chart innerRadius={60} />
        <Pie.Label />
      </PolarChartShim>
    </View>
  );
}
