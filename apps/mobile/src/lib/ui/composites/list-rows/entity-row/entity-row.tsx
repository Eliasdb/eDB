// @ui/composites/entity-row/entity-row.tsx
import { Pill } from '@ui/primitives';
import { Image, Text, View, type ViewProps } from 'react-native';
import { ListRow } from '../../../primitives';

type Chip = {
  left?: React.ReactNode;
  text: string;
  tone?: 'neutral' | 'success' | 'danger' | 'info' | 'primary';
};

type Props = ViewProps & {
  name: string;
  avatarUrl?: string;
  initials?: string;
  avatarShape?: 'circle' | 'rounded';
  chips?: Chip[];
  right?: React.ReactNode;
  compact?: boolean;
  showDividerTop?: boolean;
};

export function EntityRow({
  name,
  avatarUrl,
  initials,
  avatarShape = 'circle',
  chips,
  right,
  compact,
  showDividerTop,
  style,
  ...rest
}: Props) {
  const shapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-md';

  const left = (
    <View className="items-center pt-0.5">
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className={`w-8 h-8 ${shapeClass}`}
        />
      ) : (
        <View
          className={`w-8 h-8 ${shapeClass} bg-muted dark:bg-muted-dark items-center justify-center`}
        >
          <Text className="font-bold text-[12px] text-text dark:text-text-dark">
            {initials ?? ''}
          </Text>
        </View>
      )}
    </View>
  );

  const body = (
    <View>
      <Text className="text-[16px] text-text dark:text-text-dark">{name}</Text>
      {chips?.length ? (
        <View className="flex-row flex-wrap gap-2 mt-1">
          {chips.map((c, i) => (
            <Pill key={i} left={c.left} text={c.text} tone={c.tone} />
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <ListRow
      left={left}
      body={body}
      right={right}
      compact={compact}
      showDividerTop={showDividerTop}
      style={style}
      {...rest}
    />
  );
}
