// ui/navigation/TabTypes.ts
export type TabKey = string | number | symbol;
export type TabDef<K extends TabKey = TabKey> = { key: K; label: string };
