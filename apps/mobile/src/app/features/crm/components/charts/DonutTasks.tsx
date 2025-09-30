import React, { useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

type Props = {
  /** raw counts (you can wire these to real data later) */
  done: number;
  notDone: number;
  /** optional title */
  title?: string;
};

const SIZE = 220; // overall square
const RING = 86; // outer radius
const THICK = 18; // ring thickness
const CX = SIZE / 2;
const CY = SIZE / 2;

function useIsDark() {
  if (Platform.OS !== 'web') return false;
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  );
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

/** SVG donut arc helper */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  innerR: number,
) {
  const start = {
    x: cx + r * Math.cos(toRadians(startDeg)),
    y: cy + r * Math.sin(toRadians(startDeg)),
  };
  const end = {
    x: cx + r * Math.cos(toRadians(endDeg)),
    y: cy + r * Math.sin(toRadians(endDeg)),
  };
  const startInner = {
    x: cx + innerR * Math.cos(toRadians(endDeg)),
    y: cy + innerR * Math.sin(toRadians(endDeg)),
  };
  const endInner = {
    x: cx + innerR * Math.cos(toRadians(startDeg)),
    y: cy + innerR * Math.sin(toRadians(startDeg)),
  };

  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
}

export function DonutTasks({ done, notDone, title = 'Tasks Status' }: Props) {
  const isDark = useIsDark();

  const total = Math.max(0, done) + Math.max(0, notDone);
  const pctDone = total ? Math.round((done / total) * 100) : 0;

  const colors = {
    bg: isDark ? '#111417' : '#ffffff',
    ringTrack: isDark ? '#20252b' : '#e9eef5',
    done: isDark ? '#7bd88a' : '#1e8e3e',
    todo: isDark ? '#8ab4f8' : '#1a73e8',
    text: isDark ? '#e6eaef' : '#111315',
    dim: isDark ? '#9aa3ad' : '#5f6368',
    chipBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    chipBorder: isDark ? '#2c323a' : '#dfe5ec',
    tooltipBg: isDark ? '#0f141a' : '#ffffff',
    tooltipBorder: isDark ? '#2b3138' : '#dfe5ec',
  };

  const [tip, setTip] = useState<null | {
    label: string;
    value: number;
    pct: number;
  }>(null);

  const slices = useMemo(() => {
    // angles in degrees, start at -90 so 12 o’clock
    const start = -90;
    const doneAngle = total ? (done / total) * 360 : 0;
    const a1 = start;
    const a2 = start + doneAngle;
    const a3 = start + 360;

    return [
      { key: 'done', start: a1, end: a2, value: done, pct: pctDone },
      { key: 'todo', start: a2, end: a3, value: notDone, pct: 100 - pctDone },
    ];
  }, [done, notDone, pctDone, total]);

  const innerR = RING - THICK;

  return (
    <View
      className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
      style={{ padding: 16 }}
    >
      {/* Title */}
      <Text
        className="text-[16px] font-extrabold"
        style={{ color: colors.text, marginBottom: 8 }}
      >
        {title}
      </Text>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Chart */}
        <View style={{ width: SIZE, height: SIZE, position: 'relative' }}>
          <Svg width={SIZE} height={SIZE}>
            {/* track */}
            <Circle cx={CX} cy={CY} r={RING} fill={colors.ringTrack} />
            <Circle cx={CX} cy={CY} r={innerR} fill={colors.bg} />

            {/* slices */}
            <G>
              {slices.map((s) => {
                const path = arcPath(CX, CY, RING, s.start, s.end, innerR);
                const fill = s.key === 'done' ? colors.done : colors.todo;
                return (
                  <Path
                    key={s.key}
                    d={path}
                    fill={fill}
                    // tap/press to show a quick tooltip
                    onPressIn={() =>
                      setTip({
                        label: s.key === 'done' ? 'Done' : 'Not done',
                        value: s.value,
                        pct: s.pct,
                      })
                    }
                    onPressOut={() => setTip(null)}
                  />
                );
              })}
            </G>
          </Svg>

          {/* center label */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Text
              style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}
            >
              {pctDone}%
            </Text>
            <Text style={{ color: colors.dim, fontSize: 12, marginTop: 2 }}>
              Completed
            </Text>
          </View>

          {/* simple tooltip */}
          {tip && (
            <View
              style={{
                position: 'absolute',
                left: SIZE / 2 - 56,
                top: 16,
                width: 112,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: colors.tooltipBg,
                borderWidth: 1,
                borderColor: colors.tooltipBorder,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: '700',
                  fontSize: 12,
                  marginBottom: 2,
                  textAlign: 'center',
                }}
              >
                {tip.label}
              </Text>
              <Text
                style={{ color: colors.dim, fontSize: 12, textAlign: 'center' }}
              >
                {tip.value} • {tip.pct}%
              </Text>
            </View>
          )}
        </View>

        {/* legend */}
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <LegendChip color={colors.done} label="Done" value={done} />
          <LegendChip color={colors.todo} label="Not done" value={notDone} />
        </View>
      </View>
    </View>
  );
}

function LegendChip({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.25)',
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
        }}
      />
      <Text style={{ fontSize: 12, color: '#9aa3ad' }}>
        {label} • {value}
      </Text>
    </View>
  );
}
