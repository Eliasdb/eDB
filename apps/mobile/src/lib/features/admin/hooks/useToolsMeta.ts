// apps/mobile/src/lib/ui/admin/hooks/useToolsMeta.ts
import { useEffect, useState } from 'react';

type JSONSchema = any;

export type ToolMeta = {
  type: 'function';
  name: string;
  description: string;
  parameters?: JSONSchema;
};

export type MetaResponse = {
  instructions: string;
  tools: ToolMeta[];
};

export function useToolsMeta() {
  const [data, setData] = useState<MetaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const apiBase = process.env.EXPO_PUBLIC_API_BASE!;
        const res = await fetch(`${apiBase}/realtime/tools`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: MetaResponse = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load capabilities');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
