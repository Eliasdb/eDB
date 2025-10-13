// apps/mobile/src/app/(tabs)/admin/capabilities/ClaraCapabilitiesContainer.tsx
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Segmented } from '@ui/navigation';
import { ToolGrid } from '../../capabilities/tool-grid/tool-grid';
import { CapabilitiesHeader } from '../capabilities-header/capabilities-header';
import { InstructionsCard } from '../instructions-card/instructions-card';

import type { ToolScope } from '../../../types';
import {
  CAPABILITY_ITEMS_ALL, // <— use data
  CAPABILITY_TABS,
  getCapabilities, // <— use data
  SCOPE_INTRO_BY_SCOPE,
  SCOPE_OPTIONS, // <— use data
} from '../modules/registry';

import { CLARA_HINTS, CLARA_INSTRUCTIONS } from '../../../config';

export function ClaraCapabilitiesContainer() {
  const [scope, setScope] = useState<ToolScope>(
    (CAPABILITY_TABS[0]?.key as ToolScope) ?? 'internal',
  );

  const items = useMemo(() => getCapabilities(scope), [scope]);
  const total = CAPABILITY_ITEMS_ALL.length;

  const activeTabLabel =
    CAPABILITY_TABS.find((t) => t.key === scope)?.label ?? 'this scope';
  const emptyLabel = `No ${activeTabLabel} tools.`;

  // Pull intro from data; fall back to 'all' then generic
  const intro =
    SCOPE_INTRO_BY_SCOPE[scope] ??
    SCOPE_INTRO_BY_SCOPE.all ??
    'Browse the available tools for this workspace.';

  return (
    <>
      <CapabilitiesHeader total={total} />
      <InstructionsCard instructions={CLARA_INSTRUCTIONS} hints={CLARA_HINTS} />

      <View className="mt-4 mb-8 px-1">
        <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
          Tools
        </Text>
        <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
          Browse Clara’s capabilities by integration. Pick a tab to filter, then
          open a card to see inputs and examples.
        </Text>
      </View>

      <View className="mb-3">
        <Segmented<ToolScope>
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={setScope}
        />
      </View>

      <View className="mb-3 px-1">
        <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
          {intro}
        </Text>
      </View>

      {items.length ? (
        <ToolGrid items={items} twoUp={false} />
      ) : (
        <Text className="text-text-dim dark:text-text-dimDark">
          {emptyLabel}
        </Text>
      )}
    </>
  );
}
