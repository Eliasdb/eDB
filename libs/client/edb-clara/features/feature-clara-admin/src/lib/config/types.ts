// feature-local types shared across capability screens

export type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

export type Summarized = {
  kinds?: string[];
  required?: string[];
  fields?: string[];
  variants?: string[];
};

export type ToolScope = 'internal' | 'hubspot' | 'salesforce';
export type JSONSchema = any;

/* ---------- display types ---------- */
export type CapabilityItem = {
  icon:
    | 'add-circle-outline'
    | 'build-outline'
    | 'trash-outline'
    | 'list-circle-outline'
    | 'reorder-four-outline'
    | 'document-text-outline'
    | 'grid-outline'
    | 'construct-outline';
  title: string;
  name: string;
  action: CrudAction;
  description: string;
  summary?: Summarized;
};

/* ---------- tool meta & module shape ---------- */
export type ToolMeta = {
  type: 'function';
  name: string;
  description: string;
  parameters?: JSONSchema;
};

export type ToolModule = {
  /** unique key used for tabs / scoping */
  key: ToolScope;
  /** human label for the tab */
  label: string;
  /** tab icon */
  tabIcon: 'grid-outline' | 'business-outline' | 'cloud-outline';
  /** raw tool metas for this vendor/scope */
  tools: ToolMeta[];
  /** optional instruction block you may want elsewhere */
  instructions?: string;
};
