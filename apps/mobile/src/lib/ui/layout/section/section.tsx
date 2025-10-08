import { Card } from '@ui/primitives';
import { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

export type SectionProps = ViewProps & {
  title: string;
  children: ReactNode;
};

export function Section({ title, children, style, ...rest }: SectionProps) {
  return (
    <View className="mt-8" style={style} {...rest}>
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark mb-xs ml-[4px] uppercase tracking-wide">
        {title}
      </Text>
      <Card inset={false}>{children}</Card>
    </View>
  );
}

export default Section;
