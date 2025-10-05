import { View } from 'react-native';
import { ToolCard } from '../tool-card/tool-card';

import { ComponentProps } from 'react';
import { CrudAction, Summarized } from '../../../types';

export function ToolGrid({
  items,
  twoUp,
}: {
  items: Array<{
    icon: ComponentProps<typeof ToolCard>['icon'];
    title: string;
    name: string;
    action: CrudAction;
    description: string;
    summary?: Summarized;
  }>;
  twoUp: boolean;
}) {
  return (
    <View className="-m-2 flex-row flex-wrap">
      {items.map((t) => (
        <View
          key={t.name}
          style={{ width: twoUp ? '50%' : '100%' }}
          className="p-2"
        >
          <ToolCard
            icon={t.icon}
            title={t.title}
            name={t.name}
            action={t.action}
            description={t.description}
            summary={t.summary}
          />
        </View>
      ))}
    </View>
  );
}
