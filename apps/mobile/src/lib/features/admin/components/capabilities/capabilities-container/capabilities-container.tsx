// apps/mobile/src/app/(tabs)/admin/capabilities/ClaraCapabilitiesContainer.tsx
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

// UI
import { Segmented } from '@ui/primitives';
import { ToolGrid } from '../../capabilities';
import { CapabilitiesHeader } from '../../capabilities/capabilities-header/capabilities-header';
import { InstructionsCard } from '../../capabilities/instructions-card/instructions-card';

// Registry
import type { ToolScope } from '../../../types';
import {
  CAPABILITY_ITEMS_ALL,
  CAPABILITY_TABS,
  getCapabilities,
} from '../modules/registry';

import { CLARA_HINTS, CLARA_INSTRUCTIONS } from '../../../config';

const SCOPE_INTROS: Record<ToolScope, string> = {
  internal:
    'Built-in Clara tools for your demo hub (tasks, contacts, companies). Great for prototyping end-to-end flows.',
  hubspot:
    'Actions that talk to HubSpot — create contacts/companies and move deals between stages.',
  salesforce:
    'Salesforce operations such as creating or updating objects and syncing records.',
  all: 'Everything Clara can do in this workspace — internal demo tools and connected CRMs.',
};

export function ClaraCapabilitiesContainer() {
  // Build segmented options **with icons** (only used here)
  const SCOPE_OPTIONS = useMemo(
    () =>
      CAPABILITY_TABS.map((t) => {
        // pick a tasteful Ionicon per vendor
        const iconName =
          t.key === 'internal'
            ? ('cube-outline' as const)
            : t.key === 'hubspot'
              ? ('briefcase-outline' as const)
              : t.key === 'salesforce'
                ? ('cloud-outline' as const)
                : ('grid-outline' as const); // default
        return { value: t.key as ToolScope, label: t.label, iconName };
      }),
    [],
  );

  const [scope, setScope] = useState<ToolScope>(
    (CAPABILITY_TABS[0]?.key as ToolScope) ?? 'internal',
  );

  const items = useMemo(() => getCapabilities(scope), [scope]);
  const total = CAPABILITY_ITEMS_ALL.length;

  const activeTabLabel =
    CAPABILITY_TABS.find((t) => t.key === scope)?.label ?? 'this scope';
  const emptyLabel = `No ${activeTabLabel} tools.`;

  // dynamic blurb per scope (falls back to 'all' if missing)
  const intro =
    SCOPE_INTROS[scope] ??
    SCOPE_INTROS.all ??
    'Browse the available tools for this workspace.';

  return (
    <>
      <CapabilitiesHeader total={total} />

      <InstructionsCard instructions={CLARA_INSTRUCTIONS} hints={CLARA_HINTS} />

      {/* New: section intro for the tools area */}

      <View className="mt-2 mb-8 px-1">
        <Text className="text-[16px] font-extrabold  text-text dark:text-text-dark">
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

      {/* Scope intro */}
      <View className="mb-3 px-1">
        <Text className="text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
          {intro}
        </Text>
      </View>

      {items.length > 0 ? (
        <ToolGrid items={items} twoUp={false} />
      ) : (
        <Text className="text-text-dim dark:text-text-dimDark">
          {emptyLabel}
        </Text>
      )}
    </>
  );
}
