// feature-local types that multiple components share

// Feature: capabilities
export type CrudAction = 'create' | 'read' | 'update' | 'delete' | 'other';

export type Summarized = {
  kinds?: string[];
  required?: string[];
  fields?: string[];
  variants?: string[];
};

export type ToolScope = 'all' | 'internal' | 'external';
export type JSONSchema = any;

/* ---------- types ---------- */
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
  summary?: {
    kinds?: string[];
    required?: string[];
    fields?: string[];
    variants?: string[];
  };
};

export type ToolMeta = {
  type: 'function';
  name: string;
  description: string;
  parameters?: JSONSchema;
};
