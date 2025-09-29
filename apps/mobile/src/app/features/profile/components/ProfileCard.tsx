import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button } from '@ui/primitives';
import { Panel } from '@ui/primitives/Panels';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function ProfileCard({
  name,
  email,
  onChangePhoto,
  onManageVoice,
}: {
  name: string;
  email: string;
  onChangePhoto: () => void;
  onManageVoice: () => void;
}) {
  return (
    <Panel className="px-4 py-5">
      <View className="items-center">
        <View className="relative">
          <Avatar size={104} />
          <Pressable
            onPress={onChangePhoto}
            hitSlop={8}
            className="
              absolute right-0 bottom-0 w-9 h-9 rounded-full items-center justify-center
              bg-muted dark:bg-muted-dark border border-border dark:border-border-dark
              active:opacity-90
            "
          >
            <Ionicons name="camera-outline" size={16} color="#6C63FF" />
          </Pressable>
        </View>

        <Text className="text-[20px] font-bold text-text dark:text-text-dark mt-3">
          {name}
        </Text>
        <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
          {email}
        </Text>

        <View className="flex-row gap-3 mt-4">
          <Button
            label="Change photo"
            icon="image-outline"
            onPress={onChangePhoto}
          />
          <Button
            label="Manage voice"
            icon="mic-outline"
            onPress={onManageVoice}
          />
        </View>
      </View>
    </Panel>
  );
}
