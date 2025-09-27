// apps/mobile/src/app/components/MicButton.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

type Props = {
  onPress?: () => void;
  loading?: boolean;
  active?: boolean;
  style?: any;
};

export default function MicButton({ onPress, loading, active, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`
        flex-row items-center rounded-full mt-6 px-6 py-3.5 shadow-md
        ${active ? 'bg-danger' : 'bg-primary'}
      `}
      style={({ pressed }) => [
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <MaterialIcons name="mic" size={28} color="white" />
      <Text className="text-white font-semibold text-[16px] ml-2">
        {loading ? 'Connecting…' : active ? 'Stop' : 'Talk'}
      </Text>
    </Pressable>
  );
}
