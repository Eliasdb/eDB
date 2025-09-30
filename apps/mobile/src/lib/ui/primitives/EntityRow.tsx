import { Image, Text, View, type ViewProps } from 'react-native';
import { Pill } from './Pill';

type Chip = {
  left?: React.ReactNode; // e.g. <Ionicons .../>
  text: string;
  tone?: 'neutral' | 'success' | 'danger' | 'info' | 'primary';
};

type Props = ViewProps & {
  name: string;
  avatarUrl?: string;
  initials?: string; // fallback text if no avatarUrl
  avatarShape?: 'circle' | 'rounded'; // person = circle, company = rounded
  chips?: Chip[];
  right?: React.ReactNode; // optional trailing actions
};

export function EntityRow({
  name,
  avatarUrl,
  initials,
  avatarShape = 'circle',
  chips,
  right,
  style,
  ...rest
}: Props) {
  const shapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <View className="flex-row items-center px-2 py-2.5" style={style} {...rest}>
      {/* avatar/logo */}
      <View className="w-10 items-center pt-0.5">
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

      {/* main */}
      <View className="flex-1 pr-2">
        <Text className="text-[16px] text-text dark:text-text-dark">
          {name}
        </Text>

        {chips && chips.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mt-1">
            {chips.map((c, i) => (
              <Pill key={i} left={c.left} text={c.text} tone={c.tone} />
            ))}
          </View>
        ) : null}
      </View>

      {/* trailing actions (optional) */}
      {right ? (
        <View className="flex-row items-center gap-2">{right}</View>
      ) : (
        <View className="w-0" />
      )}
    </View>
  );
}
