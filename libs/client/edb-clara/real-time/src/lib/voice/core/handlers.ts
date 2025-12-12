import type { RealtimeOptions } from './types';
import { safeParseJSON } from './utils';

type Buffers = Map<string, { name: string; argsText: string }>;

/**
 * Create a DataChannel "message" handler for the Realtime protocol.
 *
 * Responsibilities:
 * - Buffer streamed tool-call arguments that arrive in **delta** chunks.
 * - Detect when the model has finished sending arguments (**.done**) and then
 *   execute the tool exactly once (via the provided `executeOnce`).
 * - Provide a fallback execution path when arguments are only provided in the
 *   final `response.output_item.done` event (no deltas).
 * - Optionally fire a pre-server optimistic UI hook (`opts.onToolEffect`)
 *   as soon as args are complete, before hitting your `/execute-tool` endpoint.
 *
 * Event handling overview:
 * - `response.function_call_arguments.delta` → accumulate JSON text by `call_id`
 * - `response.function_call_arguments.done` → parse JSON, (optional optimistic),
 *   then call `executeOnce(call_id, name, args)`
 * - `response.output_item.added` → notice a function_call item; initialize buffer
 * - `response.output_item.done` → fallback: parse full args (or buffered) and execute
 *
 * Note: We purposely **do not** execute in `.added`; execution happens when args
 * are complete (`.done`) or in the fallback (`output_item.done`).
 */
export function makeMessageHandler(
  dc: RTCDataChannel,
  executeOnce: (call_id: string, name: string, args: any) => Promise<void>,
  opts?: RealtimeOptions,
) {
  // Buffers partial JSON argument text per function call_id until complete.
  const argBuffers: Buffers = new Map();

  return async function onMessage(e: MessageEvent<any>) {
    // All protocol frames are JSON; ignore anything that doesn't have a `type`.
    const evt = safeParseJSON<any>(e.data);
    if (!evt?.type) return;

    // Keep console noise low but still show interesting control messages
    if (
      evt.type !== 'response.audio.delta' &&
      evt.type !== 'input_audio_buffer.speech_started' &&
      evt.type !== 'input_audio_buffer.speech_stopped'
    ) {
      console.log('[RT evt]', evt.type, evt);
    }

    switch (evt.type) {
      /**
       * Arguments are streaming in small deltas of JSON text.
       * We append to the buffer for this specific call_id.
       */
      case 'response.function_call_arguments.delta': {
        const { call_id, name, delta } = evt;
        const cur = argBuffers.get(call_id) ?? { name, argsText: '' };
        cur.argsText += delta ?? '';
        argBuffers.set(call_id, cur);
        break;
      }

      /**
       * The model finished streaming arguments for this function call.
       * Parse the accumulated JSON, optionally do a pre-server optimistic UI update,
       * then execute the tool once (server roundtrip).
       */
      case 'response.function_call_arguments.done': {
        const { call_id } = evt;
        const buf = argBuffers.get(call_id);
        if (!buf) break;
        argBuffers.delete(call_id);

        const args = safeParseJSON(buf.argsText || '{}');

        // Optional: immediate optimistic UI update before server execution
        try {
          opts?.onToolEffect?.(buf.name, args, undefined);
        } catch {}

        await executeOnce(call_id, buf.name, args);
        break;
      }

      /**
       * A new output item has been added. If it's a `function_call`, we prepare
       * a buffer for its arguments (which may or may not stream later).
       * We do NOT execute here.
       */
      case 'response.output_item.added': {
        const item = evt.item;
        if (item?.type !== 'function_call') break;
        const { call_id, name } = item;
        if (!argBuffers.has(call_id)) {
          argBuffers.set(call_id, { name, argsText: '' });
        }
        break;
      }

      /**
       * Fallback: some providers send the full arguments only in the final item.
       * If we didn't receive deltas, parse the full `arguments` field; otherwise
       * prefer what we buffered. Then execute once.
       */
      case 'response.output_item.done': {
        const item = evt.item;
        if (item?.type !== 'function_call') break;

        const { call_id, name, arguments: fullArgs } = item;
        const buffered = argBuffers.get(call_id);
        const args = buffered
          ? safeParseJSON(buffered.argsText || '{}')
          : safeParseJSON(fullArgs || '{}');

        argBuffers.delete(call_id);
        await executeOnce(call_id, name, args);
        break;
      }
    }
  };
}
