import { View } from 'react-native';

type Props = {
  values: number[]; // 0..1 each
  height?: number; // total bar area height (default 80)
  barWidth?: number; // default 20
  gap?: number; // px gap between bars, default 6
  color?: string; // default Clara primary-ish
  minFill?: number; // px baseline fill, default 10
  width?: number; // optional fixed container width
};

export default function EqualizerBars({
  values,
  height = 80,
  barWidth = 20,
  gap = 6,
  color = 'rgba(108,99,255,0.85)',
  minFill = 10,
  width,
}: Props) {
  const data = values.length ? values : Array(7).fill(0);

  return (
    <View
      style={{
        width: width ?? data.length * barWidth + (data.length - 1) * gap,
        height,
      }}
      className="flex-row items-end justify-between mt-2"
    >
      {data.map((v, i) => {
        const h = minFill + Math.min(1, v) * (height - minFill);
        return (
          <View
            key={i}
            style={{
              width: barWidth,
              height,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                width: barWidth,
                height: h,
                borderRadius: 10,
                backgroundColor: color,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
