import { usePathname, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function FloatingMic() {
  const router = useRouter();
  const path = usePathname();
  const onPress = () => {
    if (path?.endsWith('/conversation')) {
      // Later: toggle live mic here
    } else {
      router.push('/(tabs)/conversation');
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: '#6C63FF',
          paddingHorizontal: 28,
          paddingVertical: 16,
          borderRadius: 28,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>🎤 Talk</Text>
      </Pressable>
    </View>
  );
}
