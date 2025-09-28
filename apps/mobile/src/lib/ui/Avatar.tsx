// apps/mobile/src/components/Avatar.tsx
import { Image, View } from 'react-native';

type AvatarProps = {
  size?: number; // optional, default to 160
};

export default function Avatar({ size = 160 }: AvatarProps) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Image
        source={{
          uri: 'https://cdn.eliasdebock.com/2e7b910e-a28c-4c43-a0eb-918d67d22e15.png',
        }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}
