// apps/mobile/src/lib/ui/admin/ClaraCapabilities.tsx
import { Segmented } from '@ui/primitives';
import React, { useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useToolsMeta } from '../../hooks/useToolsMeta';
import { CapabilitiesHeader } from './capabilities-header';
import { InstructionsCard } from './instructions-card';
import type { Summarized } from './tool-card';
import { ToolGrid } from './tool-grid';

type ToolScope = 'all' | 'internal' | 'external';

const SCOPE_OPTIONS: { value: ToolScope; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

/* -------------------- helpers (mapping/summarizing) -------------------- */
type JSONSchema = any;

function toTitle(name: string) {
  const human = name.replace(/^hub_/, '').replace(/_/g, ' ');
  return human
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

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

/* ------------------------------- container ------------------------------ */

export function ClaraCapabilities() {
  const { data, loading, error } = useToolsMeta();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  const tools = data?.tools ?? [];

  const summarized = useMemo(() => {
    if (!tools.length) return [];
    return tools.map((t) => {
      const friendly = toTitle(t.name);
      const action = actionFromName(t.name);
      return {
        icon: pickIcon(t.name),
        name: t.name,
        title: friendly,
        action,
        description: friendlyHints(t.name, t.description),
        summary: summarizeParams(t.parameters),
      };
    });
  }, [tools]);

  const [scope, setScope] = useState<ToolScope>('all');
  const filtered = useMemo(() => {
    if (scope === 'all') return summarized;
    if (scope === 'internal')
      return summarized.filter((t) => isInternalTool(t.name));
    return summarized.filter((t) => !isInternalTool(t.name));
  }, [summarized, scope]);

  // Equal height management for 2-up grid
  const heightsRef = useRef<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  React.useEffect(() => {
    heightsRef.current = [];
    setMaxHeight(undefined);
  }, [isWide, data?.tools?.length]);

  const onCardLayoutAt = (i: number) => (e: LayoutChangeEvent) => {
    if (!isWide) return;
    const h = e.nativeEvent.layout.height;
    heightsRef.current[i] = h;
    const currentMax = Math.max(...heightsRef.current.filter(Boolean));
    if (!Number.isNaN(currentMax) && currentMax !== maxHeight) {
      setMaxHeight(currentMax);
    }
  };

  return (
    <View>
      <CapabilitiesHeader total={summarized.length} />

      <InstructionsCard
        loading={loading}
        error={error}
        instructions={data?.instructions}
      />

      <View className="mb-3">
        <Segmented<ToolScope>
          value={scope}
          options={SCOPE_OPTIONS}
          onChange={setScope}
        />
      </View>

      {filtered.length > 0 ? (
        <ToolGrid
          items={filtered}
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

export default ClaraCapabilities;
