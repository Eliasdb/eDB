import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function GoToSkeletonPlaygroundButton() {
  const router = useRouter();

  return (
    <View className="items-center mt-6">
      <Pressable
        onPress={() => router.push('/(dev)/SkeletonPlayground')}
        className="bg-primary px-6 py-3 rounded-full shadow-md active:opacity-80"
      >
        <Text className="text-white font-semibold text-[16px]">
          Open Skeleton Playground
        </Text>
      </Pressable>
    </View>
  );
}
