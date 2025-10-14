import { Card } from '@edb/shared-ui-rn';
import { Text, View } from 'react-native';

type Props = {
  firstName: string;
  lastName: string;
  role?: string;
  company?: string;
  className?: string;
};

export function ProfileSummaryCard({
  firstName,
  lastName,
  role,
  company,
  className,
}: Props) {
  const fi = firstName?.[0] ?? '';
  const li = lastName?.[0] ?? '';

  return (
    <Card
      className={`mb-4 rounded-2xl border border-border dark:border-border-dark bg-muted/50 dark:bg-muted-dark/40 overflow-hidden ${className ?? ''}`}
    >
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full bg-primary/12 border border-primary/20 items-center justify-center ">
          <Text className="text-[16px] font-extrabold text-primary ">
            {fi}
            {li}
          </Text>
        </View>
        <View>
          <Text className="text-[18px] font-extrabold text-text dark:text-text-dark leading-6 max-w-[12rem]">
            {firstName} {lastName}
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            {role || '—'} · {company || '—'}
          </Text>
        </View>
      </View>
    </Card>
  );
}
