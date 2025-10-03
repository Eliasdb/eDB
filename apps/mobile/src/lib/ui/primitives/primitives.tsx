import React from 'react';
import { Platform, StyleSheet, Text, View, ViewProps } from 'react-native';
import { Card } from './display';

export function Divider() {
  return (
    <View
      className="bg-border dark:bg-border-dark"
      style={{ height: StyleSheet.hairlineWidth }}
    />
  );
}

export function Row(props: ViewProps & { gap?: number; center?: boolean }) {
  const { style, gap = 8, center, ...rest } = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: center ? 'center' : 'flex-start',
          gap,
        },
        style,
      ]}
      {...rest}
    />
  );
}

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

export function MonoKV({ label, value }: { label: string; value: any }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <MonoText>{pretty(value)}</MonoText>
    </View>
  );
}

export function KV({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-[10px]">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark font-extrabold mb-[2px]">
        {label}
      </Text>
      <Text
        className="text-[14px] text-text dark:text-text-dark"
        numberOfLines={4}
      >
        {value}
      </Text>
    </View>
  );
}

function pretty(v: any) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-8">
      <Text className="text-[12px] text-text-dim dark:text-text-dimDark mb-xs ml-[4px]  uppercase tracking-wide">
        {title}
      </Text>
      <Card inset={false}>{children}</Card>
    </View>
  );
}

export function EmptyLine({ text }: { text: string }) {
  return (
    <View className="min-h-[56px] justify-center py-3 px-4">
      <Text className="text-[15px] text-text-dim dark:text-text-dimDark">
        {text}
      </Text>
    </View>
  );
}
