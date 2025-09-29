import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

export type TabKey = string;
export type TabDef<K extends TabKey> = { key: K; label: string };

type Props<K extends TabKey> = {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
  /** Width (px) at which we switch to a sidebar (default 820) */
  sidebarBreakpoint?: number;
  /** Optional sidebar title (shown above the nav on wide screens) */
  sidebarTitle?: string;
  /** Optional footer content for the sidebar (e.g., a hint) */
  sidebarFooter?: React.ReactNode;
  /** Page content (renders right of the sidebar or under the top tabs) */
  children: React.ReactNode;
};

export default function ResponsiveTabsLayout<K extends TabKey>({
  tabs,
  value,
  onChange,
  sidebarBreakpoint = 820,
  sidebarTitle,
  sidebarFooter,
  children,
}: Props<K>) {
  const { width } = useWindowDimensions();
  const isWide = width >= sidebarBreakpoint;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <View style={{ flex: 1, flexDirection: isWide ? 'row' : 'column' }}>
        {isWide ? (
          <Sidebar
            tabs={tabs}
            value={value}
            onChange={onChange}
            title={sidebarTitle}
            footer={sidebarFooter}
          />
        ) : (
          <TopTabs tabs={tabs} value={value} onChange={onChange} />
        )}

        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </View>
  );
}

/* ------------ internal UI pieces ------------ */

function Sidebar<K extends TabKey>({
  tabs,
  value,
  onChange,
  title,
  footer,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
  title?: string;
  footer?: React.ReactNode;
}) {
  return (
    <View className="w-[240px] border-r border-border dark:border-border-dark pt-6">
      {title ? (
        <Text className="px-4 mb-3 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
          {title}
        </Text>
      ) : null}

      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            className={`mx-2 my-1 rounded-xl overflow-hidden ${
              active ? 'bg-muted dark:bg-muted-dark' : ''
            }`}
            style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
          >
            <View className="flex-row items-center">
              <View
                className={`w-1 self-stretch ${
                  active ? 'bg-primary' : 'bg-transparent'
                }`}
              />
              <View className="flex-1 px-3 py-2.5">
                <Text
                  className={`text-[15px] font-semibold ${
                    active
                      ? 'text-text dark:text-text-dark'
                      : 'text-text-dim dark:text-text-dimDark'
                  }`}
                >
                  {t.label}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}

      {footer ? (
        <View className="mt-auto px-4 py-4 opacity-80">{footer}</View>
      ) : null}
    </View>
  );
}

function TopTabs<K extends TabKey>({
  tabs,
  value,
  onChange,
}: {
  tabs: TabDef<K>[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <View
      className="w-full border-b border-border dark:border-border-dark px-4 py-4"
      style={{ flexShrink: 0 }}
    >
      <View className="flex-row items-center bg-muted/70 dark:bg-muted-dark/70 rounded-xl p-1">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              className={`flex-1 items-center py-2 rounded-lg ${
                active ? 'bg-white dark:bg-surface-dark shadow-card' : ''
              }`}
              style={({ pressed }) => (pressed ? { opacity: 0.95 } : undefined)}
            >
              <Text
                className={`text-[14px] font-semibold ${
                  active
                    ? 'text-text dark:text-text-dark'
                    : 'text-text-dim dark:text-text-dimDark'
                }`}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
