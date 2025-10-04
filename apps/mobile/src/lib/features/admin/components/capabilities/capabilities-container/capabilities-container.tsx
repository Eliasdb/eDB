import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

// Components
import { Segmented } from '@ui/primitives';
import { ToolGrid } from '../../capabilities';
import { CapabilitiesHeader } from '../../capabilities/capabilities-header/capabilities-header';
import { InstructionsCard } from '../../capabilities/instructions-card/instructions-card';

// Config & Types
import {
  CAPABILITY_ITEMS,
  CLARA_HINTS,
  CLARA_INSTRUCTIONS,
} from '../../../config';
import { ToolScope } from '../../../types';

function isInternalTool(name: string) {
  return name.startsWith('hub_');
}

const SCOPE_OPTIONS: { value: ToolScope; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

export function ClaraCapabilitiesContainer() {
  // Full, static list to display
  const summarized = CAPABILITY_ITEMS;

  // Scope state
  const [scope, setScope] = useState<ToolScope>('all');

  // Filter once per scope change
  const items = useMemo(() => {
    switch (scope) {
      case 'internal':
        return summarized.filter((t) => isInternalTool(t.name));
      case 'external':
        return summarized.filter((t) => !isInternalTool(t.name));
      default:
        return summarized;
    }
  }, [scope, summarized]);

  // Empty label based on scope
  const emptyLabel = useMemo(() => {
    switch (scope) {
      case 'internal':
        return 'No internal tools.';
      case 'external':
        return 'No external tools.';
      default:
        return 'No tools found.';
    }
  }, [scope]);

  return (
    <View>
      <CapabilitiesHeader total={summarized.length} />

      <InstructionsCard instructions={CLARA_INSTRUCTIONS} hints={CLARA_HINTS} />

      <View className="mb-3">
        <Segmented<ToolScope>
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={setScope}
        />
      </View>

      {items.length > 0 ? (
        <ToolGrid items={items} twoUp={false} />
      ) : (
        <Text className="text-text-dim dark:text-text-dimDark">
          {emptyLabel}
        </Text>
      )}
    </View>
  );
}
