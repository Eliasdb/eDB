import { RealtimeOptions } from './types';

// apps/mobile/src/lib/voice/tools.ts
export function createExecuteOnce(
  apiBase: string,
  headers: HeadersInit,
  dc: RTCDataChannel,
  opts?: RealtimeOptions,
) {
  const executedCalls = new Set<string>();

  return async function executeOnce(call_id: string, name: string, args: any) {
    if (executedCalls.has(call_id)) return;
    executedCalls.add(call_id);

    try {
      const exec = await fetch(`${apiBase}/realtime/execute-tool`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, args }),
      }).then((r) => r.json());

      // 👇 unwrap once, everywhere else sees the real object
      const payload = exec?.output ?? exec;

      try {
        opts?.onToolEffect?.(name, args, payload);
      } catch {}

      const outputString =
        typeof payload === 'string'
          ? payload
          : JSON.stringify(payload ?? {}, null, 2);

      dc.send(
        JSON.stringify({
          type: 'conversation.item.create',
          item: { type: 'function_call_output', call_id, output: outputString },
        }),
      );

      dc.send(
        JSON.stringify({
          type: 'response.create',
          response: {
            modalities: ['audio', 'text'],
            instructions:
              'Summarize the tool result in one sentence, then ask exactly ONE short follow-up question under 15 words.',
          },
        }),
      );
    } finally {
      try {
        opts?.onInvalidate?.();
      } catch {}
    }
  };
}
