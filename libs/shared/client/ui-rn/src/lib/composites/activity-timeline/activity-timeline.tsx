import type { Activity } from '@edb-clara/client-crm';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Card, EmptyLine, List } from '../../primitives';
import { TwoLineRow } from '../list-rows';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/* Layout constants */
const GROUP_PAD_X = 10;
const RAIL_LEFT = 16;
const DOT_SIZE = 8;
const DOT_GAP_FROM_RAIL = 8;

const TEXT_OFFSET_FROM_RAIL = DOT_GAP_FROM_RAIL + DOT_SIZE + 16;

/* Defaults */
const defaultIconForType = (t: Activity['type']): IconName => {
  switch (t) {
    case 'note':
      return 'document-text-outline';
    case 'call':
      return 'call-outline';
    case 'email':
      return 'mail-outline';
    case 'meeting':
      return 'people-outline';
    case 'status':
      return 'flag-outline';
    case 'system':
    default:
      return 'chatbubble-ellipses-outline';
  }
};
const colorFor = (t: Activity['type']) => {
  switch (t) {
    case 'meeting':
      return '#EAB308';
    case 'call':
      return '#10B981';
    case 'note':
      return '#8B5CF6';
    case 'email':
      return '#60A5FA';
    case 'status':
      return '#F59E0B';
    case 'system':
    default:
      return '#94A3B8';
  }
};
const withAlpha = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function dayKey(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const start = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(d) - start(now)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
function groupByDay(rows: Activity[]) {
  const m = new Map<string, Activity[]>();
  rows.forEach((a) => {
    const k = dayKey(a.at);
    const arr = m.get(k) ?? [];
    arr.push(a);
    m.set(k, arr);
  });
  return Array.from(m.entries());
}

/* Props */
export type ActivityTimelineProps = {
  title?: string;
  activities?: Activity[];
  loading?: boolean;
  headerActions?: React.ReactNode;
  iconForType?: (t: Activity['type']) => IconName;
  onPressItem?: (a: Activity) => void;
  renderSecondary?: (a: Activity) => React.ReactNode;
  emptyText?: string;
};

export function ActivityTimeline({
  title = 'Timeline',
  activities = [],
  loading,
  headerActions,
  iconForType = defaultIconForType,
  onPressItem,
  renderSecondary,
  emptyText = 'No activity yet',
}: ActivityTimelineProps) {
  return (
    <View className="px-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark ml-[4px] uppercase tracking-wide">
          {title}
        </Text>
        {headerActions ?? null}
      </View>

      {activities.length === 0 ? (
        <Card inset={false} bodyClassName="p-0 overflow-hidden">
          <EmptyLine text={loading ? 'Loading …' : emptyText} />
        </Card>
      ) : (
        groupByDay(activities).map(([label, rows], gi) => (
          <View key={label} style={{ marginTop: gi === 0 ? 10 : 18 }}>
            <Text
              className="text-text-dim dark:text-text-dimDark"
              style={{ fontSize: 13, marginBottom: 10, marginLeft: 6 }}
            >
              {label}
            </Text>

            <View
              style={{
                position: 'relative',
                borderRadius: 16,
                backgroundColor: 'transparent',
                paddingVertical: 6,
                paddingHorizontal: GROUP_PAD_X,
              }}
            >
              {/* shared vertical rail */}
              <View
                style={{
                  position: 'absolute',
                  left: GROUP_PAD_X + RAIL_LEFT,
                  top: 10,
                  bottom: 10,
                  width: 1,
                  backgroundColor: 'rgba(148,163,184,0.28)',
                  borderRadius: 1,
                }}
              />

              {/* align List’s dividers with the rail */}
              <View style={{ paddingLeft: RAIL_LEFT }}>
                <List>
                  {rows.map((a, idx) => (
                    <List.Item key={a.id} first={idx === 0}>
                      <Row
                        icon={iconForType(a.type)}
                        color={colorFor(a.type)}
                        primary={a.summary}
                        secondary={
                          renderSecondary
                            ? renderSecondary(a)
                            : `${a.type} • ${formatTime(a.at)}`
                        }
                        onPress={onPressItem ? () => onPressItem(a) : undefined}
                      />
                    </List.Item>
                  ))}
                </List>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// layout constants
const CHIP_RIGHT = 10;
const CHIP_TOP = 8; // (kept if you use it elsewhere)
const CHIP_BOTTOM = 8; // NEW
const CHIP_SIZE = 28;

// …

/* Row (assumes wrapper paddingLeft: RAIL_LEFT) */
function Row({
  icon,
  color,
  primary,
  secondary,
  onPress,
}: {
  icon: IconName;
  color: string;
  primary: string;
  secondary: string | React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <View
      style={{
        position: 'relative',
        paddingTop: 12,
        // bump bottom padding so the bottom-right chip has room
        paddingBottom: Math.max(14, CHIP_BOTTOM + 10),
        paddingRight: CHIP_RIGHT + 10,
        paddingLeft: TEXT_OFFSET_FROM_RAIL,
      }}
    >
      {/* dot anchored to rail */}
      <View
        style={{
          position: 'absolute',
          left: DOT_GAP_FROM_RAIL,
          top: 20,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: color,
        }}
      />

      {/* bottom-right chip (moved from top-right) */}
      <View
        style={{
          position: 'absolute',
          right: CHIP_RIGHT,
          bottom: CHIP_BOTTOM, // ← was top: CHIP_TOP
          width: CHIP_SIZE,
          height: CHIP_SIZE,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: withAlpha(color, 0.12),
          borderWidth: 1,
          borderColor: withAlpha(color, 0.28),
        }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>

      {onPress ? (
        <Pressable onPress={onPress}>
          <TwoLineRow
            primary={primary}
            secondary={secondary}
            icon={undefined as any}
          />
        </Pressable>
      ) : (
        <TwoLineRow
          primary={primary}
          secondary={secondary}
          icon={undefined as any}
        />
      )}
    </View>
  );
}
