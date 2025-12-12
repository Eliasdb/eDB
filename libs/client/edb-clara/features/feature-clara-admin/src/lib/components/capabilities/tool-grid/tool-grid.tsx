import React, { ComponentProps } from 'react';
import {
  Platform,
  View,
  useWindowDimensions,
  type DimensionValue,
} from 'react-native';
import { CrudAction, Summarized } from '../../../types';
import { ToolCard } from '../tool-card/tool-card';

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
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  let cols = 1;
  if (isWeb) {
    if (width >= 1400) cols = 3;
    else if (width >= 1100) cols = 2;
    else if (width >= 800) cols = 1;
    else cols = 1;
  } else {
    cols = twoUp ? 2 : 1;
  }

  // Explicit DimensionValue fixes the TS error
  const itemWidth: DimensionValue = `${100 / cols}%`;

  return (
    <View className="-m-2 pt-6 flex-row flex-wrap">
      {items.map((t) => (
        <View key={t.name} style={{ width: itemWidth }} className="p-2">
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
