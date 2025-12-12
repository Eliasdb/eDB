// libs/ui/layout/Section.tsx
import { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';
import { Card } from '../../primitives';

export type SectionProps = ViewProps & {
  title: string;
  children: ReactNode;
  /** Remove default top margin (mt-8 ≈ 32px). Default: false */
  flushTop?: boolean;
  /** Space (px) between the title and the Card. Default mirrors mb-xs (~6). */
  titleGap?: number;
};

export function Section({
  title,
  children,
  style,
  flushTop = false,
  titleGap = 6, // keep current default look
  ...rest
}: SectionProps) {
  return (
    <View
      style={[{ marginTop: flushTop ? 0 : 32 }, style]}
      {...rest}
      className="px-4"
    >
      <Text
        className="text-[12px] text-text-dim dark:text-text-dimDark ml-[4px] uppercase tracking-wide"
        style={{ marginBottom: titleGap }}
      >
        {title}
      </Text>
      <Card inset={false}>{children}</Card>
    </View>
  );
}

export default Section;
