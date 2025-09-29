import { ScrollView, type ScrollViewProps } from 'react-native';

type Props = ScrollViewProps & {
  center?: boolean;
  padding?: number; // default 32
};
export function Screen({
  center = true,
  padding = 32,
  contentContainerStyle,
  ...rest
}: Props) {
  return (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        minHeight: '100%',
        padding,
        ...(center ? { alignItems: 'center', justifyContent: 'center' } : null),
        ...(contentContainerStyle as any),
      }}
      {...rest}
    />
  );
}
