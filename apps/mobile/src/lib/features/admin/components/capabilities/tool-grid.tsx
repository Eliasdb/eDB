// apps/mobile/src/lib/ui/admin/components/ToolGrid.tsx
import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { ToolCard, type CrudAction, type Summarized } from './tool-card';

export function ToolGrid({
  items,
  twoUp,
  onCardLayoutAt,
  equalHeight,
}: {
  items: Array<{
    icon: React.ComponentProps<typeof ToolCard>['icon'];
    title: string;
    name: string;
    action: CrudAction;
    description: string;
    summary?: Summarized;
  }>;
  twoUp: boolean;
  onCardLayoutAt?: (index: number) => (e: LayoutChangeEvent) => void;
  equalHeight?: number;
}) {
  return (
    <View className="-m-2 flex-row flex-wrap">
      {items.map((t, i) => (
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
            onLayout={onCardLayoutAt?.(i)}
            height={twoUp && equalHeight ? equalHeight : undefined}
          />
        </View>
      ))}
    </View>
  );
}
