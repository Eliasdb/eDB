import type { CompanyOverview } from '@api/core/types';
import {
  companyStatsConfig,
  type StatRow,
} from '@features/crm/config/company-stats.config';
import { KeyValueRow } from '@ui/composites';
import { Card, List } from '@ui/primitives';
import * as React from 'react';
import { View } from 'react-native';

export function CompanyQuickStats({
  data,
  loading = false,
  config = companyStatsConfig,
  className,
}: {
  data?: CompanyOverview;
  loading?: boolean;
  /** allow per-screen override */
  config?: readonly StatRow[];
  className?: string;
}) {
  return (
    <View className={['px-4 mt-3', className ?? ''].join(' ')}>
      <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
        <List>
          {config.map((row, idx) => {
            const val = loading ? null : row.getValue(data);
            return (
              <List.Item key={row.label} first={idx === 0}>
                <KeyValueRow
                  icon={row.icon}
                  label={row.label}
                  value={val ?? row.empty ?? '—'}
                />
              </List.Item>
            );
          })}
        </List>
      </Card>
    </View>
  );
}

export default CompanyQuickStats;
