// apps/mobile/src/app/(dev)/SkeletonPlayground.tsx
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutChangeEvent,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';

import { Contact } from '@data-access/crm/contacts';
import {
  CompanyItemSkeleton,
  ContactItemSkeleton,
  contactToEntityRowProps,
  TaskItemSkeleton,
} from '@edb-clara/feature-crm';
import { Card, EntityRow, List, Screen, TaskRow } from '@edb/shared-ui-rn';

type Mode = 'companies' | 'contacts' | 'tasks';

export default function SkeletonPlayground() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('companies');
  const [rows, setRows] = useState(6);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // For debug readout only...
  const [measuredRowHeight, setMeasuredRowHeight] = useState<number | null>(
    null,
  );
  const measuredOnceRef = useRef(false);
  const onMeasureRow = (e: LayoutChangeEvent) => {
    if (measuredOnceRef.current) return;
    setMeasuredRowHeight(Math.round(e.nativeEvent.layout.height));
    measuredOnceRef.current = true;
  };

  // ---- Mock data ----
  const companies = useMemo(
    () =>
      Array.from({ length: rows }).map((_, i) => ({
        id: `co-${i}`,
        title: `Linear Systems ${i + 1}`,
        subtitle: i % 2 ? 'hello@linear.dev' : 'support@linear.dev',
        initials: 'LS',
        tags: i % 2 ? [{ text: 'Customer', tone: 'primary' as const }] : [],
        meta: [
          { label: 'Deals', value: `${3 + (i % 5)}` },
          {
            label: 'Owner',
            value: 'Elias De Bock',
            pill: true,
            icon: 'person' as const,
          },
        ],
      })),
    [rows],
  );

  // ✅ Contacts use the actual Contact model (email + phone)
  const contacts: Contact[] = useMemo(
    () =>
      Array.from({ length: rows }).map((_, i) => ({
        id: `ct-${i}`,
        name: `Juan Pérez ${i + 1}`,
        email:
          i % 2 ? `juan${i + 1}.perez@example.com` : 'juan.perez@example.com',
        phone: i % 3 === 0 ? '555-123-4567' : undefined,
        avatarUrl: undefined,
        source: i % 2 ? 'Disney' : undefined,
      })),
    [rows],
  );

  // ✅ Tasks use TaskRow shape (matches @api Task)
  const tasks = useMemo(
    () =>
      Array.from({ length: rows }).map((_, i) => ({
        id: `tk-${i}`,
        title: `Follow-up call #${i + 1}`,
        done: i % 4 === 0,
        due: i % 3 === 0 ? 'Today' : i % 3 === 1 ? 'Tomorrow' : undefined,
        source: i % 5 === 0 ? 'Clara' : undefined,
      })),
    [rows],
  );

  const data =
    mode === 'companies' ? companies : mode === 'contacts' ? contacts : tasks;

  const renderActualRow = (item: any, index: number) => {
    if (mode === 'tasks') {
      return (
        <View onLayout={index === 0 ? onMeasureRow : undefined}>
          <TaskRow
            task={item}
            onToggle={() => {}}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        </View>
      );
    }

    if (mode === 'contacts') {
      // 🔌 Map Contact -> EntityRow props (email as subtitle, phone as pill)
      return (
        <EntityRow
          {...contactToEntityRowProps(item as Contact)}
          onLayout={index === 0 ? onMeasureRow : undefined}
        />
      );
    }

    // companies (playground entity row shape)
    return (
      <EntityRow
        title={item.title}
        subtitle={item.subtitle}
        initials={item.initials}
        tags={item.tags}
        meta={item.meta}
        onLayout={index === 0 ? onMeasureRow : undefined}
      />
    );
  };

  const renderSkeletonRow = () => {
    if (mode === 'tasks') return <TaskItemSkeleton />;
    if (mode === 'contacts') return <ContactItemSkeleton />;
    return <CompanyItemSkeleton />;
  };

  const Controls = () => (
    <Card tone="flat" inset bodyClassName="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold">Skeleton Playground</Text>
        <View className="flex-row items-center gap-3">
          <Text>Skeleton</Text>
          <Switch value={showSkeleton} onValueChange={setShowSkeleton} />
        </View>
      </View>

      <View className="flex-row gap-6 pt-1">
        {(['companies', 'contacts', 'tasks'] as Mode[]).map((m) => {
          const on = mode === m;
          return (
            <Text
              key={m}
              onPress={() => {
                setMode(m);
                setMeasuredRowHeight(null);
                measuredOnceRef.current = false;
              }}
              className={`px-3 py-1.5 rounded-md ${on ? 'bg-surface dark:bg-surface-dark' : ''}`}
              style={{ fontWeight: on ? ('800' as const) : ('600' as const) }}
            >
              {m}
            </Text>
          );
        })}
      </View>

      <View className="flex-row items-center gap-3 pt-1">
        <Text>Rows:</Text>
        <Text
          onPress={() => setRows(Math.max(1, rows - 1))}
          className="px-3 py-1.5 rounded-md bg-surface dark:bg-surface-dark"
        >
          −
        </Text>
        <Text className="min-w-[24px] text-center">{rows}</Text>
        <Text
          onPress={() => setRows(rows + 1)}
          className="px-3 py-1.5 rounded-md bg-surface dark:bg-surface-dark"
        >
          +
        </Text>
      </View>

      <View className="pt-1">
        <Text className="text-xs opacity-60">
          Measured row height: {measuredRowHeight ?? '…'} px
        </Text>
      </View>
    </Card>
  );

  return (
    <Screen center={false} padding={16}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Controls />

        {/* Actual list */}
        <Card tone="flat" inset bodyClassName="gap-2 mt-4">
          <Text className="text-sm font-semibold opacity-70 mb-2">Actual</Text>
          <List inset>
            {Array.isArray(data) &&
              data.map((item: any, i: number) => (
                <List.Item key={item.id ?? i} first={i === 0}>
                  {renderActualRow(item, i)}
                </List.Item>
              ))}
          </List>
        </Card>

        {/* Skeleton list */}
        <Card tone="flat" inset bodyClassName="gap-2 mt-4">
          <Text className="text-sm font-semibold opacity-70 mb-2">
            Skeleton
          </Text>
          <List inset>
            {Array.from({ length: rows }).map((_, i) => (
              <List.Item key={i} first={i === 0}>
                <View pointerEvents="none">
                  {showSkeleton
                    ? renderSkeletonRow()
                    : renderActualRow(
                        (mode === 'contacts'
                          ? contacts
                          : mode === 'companies'
                            ? companies
                            : tasks)[i],
                        i,
                      )}
                </View>
              </List.Item>
            ))}
          </List>
        </Card>
      </ScrollView>
    </Screen>
  );
}
