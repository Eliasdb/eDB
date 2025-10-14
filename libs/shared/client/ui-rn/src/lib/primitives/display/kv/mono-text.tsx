// apps/mobile/src/lib/ui/primitives/display/mono-text.tsx
import { Platform, Text } from 'react-native';

export function MonoText({ children }: { children: string }) {
  return (
    <Text
      selectable
      className="text-[12px] text-text dark:text-text-dark bg-gray-100 dark:bg-gray-800 border border-border dark:border-border-dark rounded-md p-2 leading-4"
      style={{
        fontFamily: Platform.select({
          ios: 'Menlo',
          android: 'monospace',
          web: 'monospace',
        }) as any,
      }}
    >
      {children}
    </Text>
  );
}
