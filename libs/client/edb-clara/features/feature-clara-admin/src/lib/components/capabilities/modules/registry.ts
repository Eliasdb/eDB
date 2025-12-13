import type {
  CapabilityItem,
  CrudAction,
  JSONSchema,
  ToolModule,
  ToolScope,
} from '../../../types';

import HubSpot from './hubspot';
import Internal from './internal';
import Salesforce from './salesforce';

/** Statically import modules and register here (Metro-friendly). */
export const MODULES: ToolModule[] = [Internal, HubSpot, Salesforce];

/* ── helpers to transform ToolMeta → CapabilityItem ───────────────────────── */

function toTitle(name: string) {
  const human = name.replace(/^hub_/, '').replace(/_/g, ' ');
  return human
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
function actionFromName(name: string): CrudAction {
  const n = name.toLowerCase();
  if (n.includes('create') || n.includes('upsert')) return 'create';
  if (n.includes('update') || n.includes('move')) return 'update';
  if (n.includes('delete') || n.includes('remove')) return 'delete';
  if (n.includes('list') || n.includes('read')) return 'read';
  return 'other';
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
  if (n.includes('create') || n.includes('upsert')) return 'add-circle-outline';
  if (n.includes('update') || n.includes('move')) return 'build-outline';
  if (n.includes('delete') || n.includes('remove')) return 'trash-outline';
  if (n.includes('list') && n.includes('kind')) return 'list-circle-outline';
  if (n.includes('list')) return 'reorder-four-outline';
  if (n.includes('read')) return 'document-text-outline';
  if (n.includes('hub')) return 'grid-outline';
  return 'construct-outline';
}
function summarizeParams(schema?: JSONSchema): CapabilityItem['summary'] {
  if (!schema || typeof schema !== 'object') return;

  const out: CapabilityItem['summary'] = {};
  const props = schema?.properties as Record<string, unknown> | undefined;

  const kindEnum = props?.kind?.enum as string[] | undefined;
  if (Array.isArray(kindEnum) && kindEnum.length) out.kinds = kindEnum;

  const req = schema?.required as string[] | undefined;
  if (Array.isArray(req) && req.length) out.required = req;

  if (props && typeof props === 'object') {
    const keys = Object.keys(props).filter((k) => k !== 'kind');
    if (keys.length) out.fields = keys;
  }

  const oneOf = props?.data?.oneOf as JSONSchema[] | undefined;
  if (Array.isArray(oneOf) && oneOf.length) {
    out.variants = oneOf.map((v, i) => {
      const vReq = Array.isArray(v?.required) ? v.required : [];
      const vProps = v?.properties ? Object.keys(v.properties) : [];
      if (vReq.length) return `#${i + 1}: req(${vReq.join(', ')})`;
      if (vProps.length) return `#${i + 1}: fields(${vProps.join(', ')})`;
      return `#${i + 1}`;
    });
  }

  const rootOne = Array.isArray((schema as JSONSchema & { oneOf?: unknown })?.oneOf)
    ? (schema as JSONSchema & { oneOf?: JSONSchema[] }).oneOf
    : [];
  if (rootOne.length) {
    const rootVariants = rootOne.map((v: JSONSchema, i: number) => {
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

function toCapabilityItem(t: ToolModule['tools'][number]): CapabilityItem {
  return {
    icon: pickIcon(t.name),
    title: toTitle(t.name),
    name: t.name,
    action: actionFromName(t.name),
    description: t.description,
    summary: summarizeParams(t.parameters),
  };
}

/* ── Public API for screens ───────────────────────────────────────────────── */
/** Segmented control options (ready to render) */
export const SCOPE_OPTIONS = MODULES.map((m) => ({
  value: m.key as ToolScope,
  label: m.label,
  iconName: m.tabIcon,
}));

/** Intros keyed by scope */
export const SCOPE_INTRO_BY_SCOPE = Object.fromEntries(
  MODULES.map((m) => [m.key, m.intro]),
) as Record<ToolScope, string>;

/** Existing exports untouched (tabs/groups/items) */
export const CAPABILITY_TABS = MODULES.map((m) => ({
  key: m.key,
  label: m.label,
  icon: m.tabIcon,
}));

export const CAPABILITY_GROUPS = Object.fromEntries(
  MODULES.map((m) => [m.key, m.tools.map(toCapabilityItem)]),
) as Record<ToolModule['key'], CapabilityItem[]>;

export function getCapabilities(scope: ToolScope): CapabilityItem[] {
  return CAPABILITY_GROUPS[scope];
}

/** If you still want a flat array somewhere */
export const CAPABILITY_ITEMS_ALL: CapabilityItem[] = MODULES.flatMap((m) =>
  m.tools.map(toCapabilityItem),
);

/** Keep raw for agents or advanced views */
export const RAW_CAPABILITIES_META = {
  instructions:
    'You are Clara. Call the right tool immediately based on vendor/scope.',
  modules: MODULES,
};
