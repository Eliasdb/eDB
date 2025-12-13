// ui/navigation/TabTypes.ts
export type TabKey = string;
export type TabDef<K extends TabKey = TabKey> = { key: K; label: string };
