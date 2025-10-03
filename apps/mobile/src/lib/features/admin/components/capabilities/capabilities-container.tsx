// apps/mobile/src/lib/ui/admin/ClaraCapabilities.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Segmented } from '@ui/primitives';
import { CLARA_HINTS, CLARA_INSTRUCTIONS } from '../../config/constants';
import { useToolsMeta } from '../../hooks/useToolsMeta';
import { CapabilitiesHeader } from './capabilities-header';
import { InstructionsCard } from './instructions-card';
import { ToolGrid } from './tool-grid';

/* ----------------------------------------------------------------------------
 * Types & helpers (kept here for self-containment)
 * --------------------------------------------------------------------------*/
type ToolScope = 'all' | 'internal' | 'external';
type JSONSchema = any;

export type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

export type Summarized = {
  kinds?: string[];
  required?: string[];
  fields?: string[];
  variants?: string[];
};

function toTitle(name: string) {
  const human = name.replace(/^hub_/, '').replace(/_/g, ' ');
  return human
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
function actionFromName(name: string): CrudAction {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'create';
  if (n.includes('update')) return 'update';
  if (n.includes('delete')) return 'delete';
  if (n.includes('list') || n.includes('read')) return 'read';
  return 'other';
}
function friendlyHints(name: string, original: string) {
  const n = name.toLowerCase();
  if (n.includes('list_kind')) return 'List all items for a specific kind.';
  if (n.includes('update')) return 'Update fields of an item (id required).';
  if (n.includes('create')) return 'Create a new item for a given kind.';
  if (n.includes('delete')) return 'Delete an item by id for a given kind.';
  if (n.includes('list')) return 'Fetch a snapshot of items.';
  return original;
}
function pickIcon(
  name: string,
):
  | 'add-circle-outline'
  | 'build-outline'
  | 'trash-outline'
  | 'list-circle-outline'
  | 'reorder-four-outline'
  | 'document-text-outline'
  | 'grid-outline'
  | 'construct-outline' {
  const n = name.toLowerCase();
  if (n.includes('create')) return 'add-circle-outline';
  if (n.includes('update')) return 'build-outline';
  if (n.includes('delete')) return 'trash-outline';
  if (n.includes('list') && n.includes('kind')) return 'list-circle-outline';
  if (n.includes('list')) return 'reorder-four-outline';
  if (n.includes('read')) return 'document-text-outline';
  if (n.includes('hub')) return 'grid-outline';
  return 'construct-outline';
}
function summarizeParams(schema?: JSONSchema): Summarized | undefined {
  if (!schema || typeof schema !== 'object') return;

  const out: Summarized = {};

  const kindEnum = schema?.properties?.kind?.enum as string[] | undefined;
  if (Array.isArray(kindEnum) && kindEnum.length) out.kinds = kindEnum;

  const req = schema?.required as string[] | undefined;
  if (Array.isArray(req) && req.length) out.required = req;

  const props = schema?.properties as Record<string, any> | undefined;
  if (props && typeof props === 'object') {
    const keys = Object.keys(props).filter((k) => k !== 'kind');
    if (keys.length) out.fields = keys;
  }

  const oneOf = schema?.properties?.data?.oneOf as JSONSchema[] | undefined;
  if (Array.isArray(oneOf) && oneOf.length) {
    out.variants = oneOf.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
  }

  const rootOne = Array.isArray(schema?.oneOf) ? (schema.oneOf as any[]) : [];
  if (rootOne.length) {
    const rootVariants = rootOne.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
    out.variants = [...(out.variants ?? []), ...rootVariants];
  }

  if (!out.kinds && !out.required && !out.fields && !out.variants) return;
  return out;
}
function isInternalTool(name: string) {
  return name.startsWith('hub_');
}

/* ----------------------------------------------------------------------------
 * Component
 * --------------------------------------------------------------------------*/

const SCOPE_OPTIONS: { value: ToolScope; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

export default function ClaraCapabilities() {
  const { data } = useToolsMeta();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  const tools = data?.tools ?? [];

  // Map tools → view models
  const summarized = useMemo(() => {
    if (!tools.length) return [];
    return tools.map((t) => ({
      icon: pickIcon(t.name),
      name: t.name,
      title: toTitle(t.name),
      action: actionFromName(t.name),
      description: friendlyHints(t.name, t.description),
      summary: summarizeParams(t.parameters),
    }));
  }, [tools]);

  // Segmented state
  const [scope, setScope] = useState<ToolScope>('all');

  // Filtered list per scope
  const filtered = useMemo(() => {
    if (scope === 'all') return summarized;
    if (scope === 'internal')
      return summarized.filter((t) => isInternalTool(t.name));
    return summarized.filter((t) => !isInternalTool(t.name));
  }, [summarized, scope]);

  // Equal-height for 2-up grid (only if you pass twoUp=true)
  const heightsRef = useRef<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  React.useEffect(() => {
    heightsRef.current = [];
    setMaxHeight(undefined);
  }, [isWide, filtered.length]);

  const onCardLayoutAt = (i: number) => (e: LayoutChangeEvent) => {
    if (!isWide) return;
    const h = e.nativeEvent.layout.height;
    heightsRef.current[i] = h;
    const currentMax = Math.max(...heightsRef.current.filter(Boolean));
    if (!Number.isNaN(currentMax) && currentMax !== maxHeight) {
      setMaxHeight(currentMax);
    }
  };

  // ------------------- Explicit conditional returns (like AdminLogList) -------------------

  if (scope === 'all') {
    return (
      <View>
        <CapabilitiesHeader total={summarized.length} />
        <InstructionsCard
          instructions={CLARA_INSTRUCTIONS}
          hints={CLARA_HINTS}
        />

        <View className="mb-3">
          <Segmented<ToolScope>
            value={scope}
            options={SCOPE_OPTIONS}
            onChange={setScope}
          />
        </View>

        {summarized.length > 0 ? (
          <ToolGrid
            items={summarized}
            twoUp={false}
            onCardLayoutAt={onCardLayoutAt}
            equalHeight={isWide ? maxHeight : undefined}
          />
        ) : (
          <Text className="text-text-dim dark:text-text-dimDark">
            No tools found.
          </Text>
        )}
      </View>
    );
  }

  if (scope === 'internal') {
    const items = filtered;
    return (
      <View>
        <CapabilitiesHeader total={summarized.length} />
        <InstructionsCard
          instructions={CLARA_INSTRUCTIONS}
          hints={CLARA_HINTS}
        />

        <View className="mb-3">
          <Segmented<ToolScope>
            value={scope}
            options={SCOPE_OPTIONS}
            onChange={setScope}
          />
        </View>

        {items.length > 0 ? (
          <ToolGrid
            items={items}
            twoUp={false}
            onCardLayoutAt={onCardLayoutAt}
            equalHeight={isWide ? maxHeight : undefined}
          />
        ) : (
          <Text className="text-text-dim dark:text-text-dimDark">
            No internal tools.
          </Text>
        )}
      </View>
    );
  }

  // scope === 'external'
  const items = filtered;
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
        <ToolGrid
          items={items}
          twoUp={false}
          onCardLayoutAt={onCardLayoutAt}
          equalHeight={isWide ? maxHeight : undefined}
        />
      ) : (
        <Text className="text-text-dim dark:text-text-dimDark">
          No external tools.
        </Text>
      )}
    </View>
  );
}
