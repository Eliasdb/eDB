// apps/mobile/src/app/components/MicButton.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  onPress?: () => void;
  loading?: boolean;
  active?: boolean;
  style?: ViewStyle;
};

export default function MicButton({ onPress, loading, active, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        active && styles.active,
        pressed && styles.pressed,
        style,
      ]}
    >
      <MaterialIcons name="mic" size={28} color="white" />
      <Text style={styles.text}>
        {loading ? 'Connecting…' : active ? 'Stop' : 'Talk'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  active: {
    backgroundColor: '#FF4D4F',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
