import { Children, ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import type { TabDef, TabKey } from '../../navigation';
import { SidebarTabs, TabBarTop } from '../../navigation';

export function ResponsiveTabsLayout<K extends TabKey>({
  tabs,
  value,
  onChange,
  sidebarBreakpoint = 820,
  sidebarTitle,
  sidebarFooter,
  children,
  tabIdPrefix, // 👈 NEW
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
  sidebarBreakpoint?: number;
  sidebarTitle?: string;
  sidebarFooter?: ReactNode;
  children: ReactNode;
  tabIdPrefix?: string; // 👈 NEW
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= sidebarBreakpoint;

  const normalizedChildren = Children.toArray(children).filter(
    (c) => typeof c !== 'string' && typeof c !== 'number',
  );

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <View style={{ flex: 1, flexDirection: isWide ? 'row' : 'column' }}>
        {isWide ? (
          <SidebarTabs
            tabs={tabs}
            value={value}
            onChange={onChange}
            title={sidebarTitle}
            footer={sidebarFooter}
            idPrefix={tabIdPrefix} // 👈 add this prop and wire it in SidebarTabs too
          />
        ) : (
          <TabBarTop
            tabs={tabs}
            value={value}
            onChange={onChange}
            idPrefix={tabIdPrefix} // 👈 pass through
          />
        )}
        <View style={{ flex: 1 }}>{normalizedChildren}</View>
      </View>
    </View>
  );
}
