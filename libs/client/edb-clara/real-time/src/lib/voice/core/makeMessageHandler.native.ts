import type { RealtimeOptions } from './types';
import { safeParseJSON } from './utils';

type Buffers = Map<string, { name: string; argsText: string }>;

/**
 * Native version of makeMessageHandler.
 * Uses react-native-webrtc RTCDataChannel, which exposes `.onmessage = fn`.
 */
export function makeMessageHandler(
  _dc: any, // RTCDataChannel from react-native-webrtc
  executeOnce: (call_id: string, name: string, args: any) => Promise<void>,
  opts?: RealtimeOptions,
) {
  const argBuffers: Buffers = new Map();

  return async function onMessage(e: MessageEvent) {
    // RN WebRTC passes an event like { type: "message", data: string }
    const evt = safeParseJSON<any>(e?.data);
    if (!evt?.type) return;

    if (
      evt.type !== 'response.audio.delta' &&
      evt.type !== 'input_audio_buffer.speech_started' &&
      evt.type !== 'input_audio_buffer.speech_stopped'
    ) {
      console.log('[RT evt:native]', evt.type, evt);
    }

    switch (evt.type) {
      case 'response.function_call_arguments.delta': {
        const { call_id, name, delta } = evt;
        const cur = argBuffers.get(call_id) ?? { name, argsText: '' };
        cur.argsText += delta ?? '';
        argBuffers.set(call_id, cur);
        break;
      }

      case 'response.function_call_arguments.done': {
        const { call_id } = evt;
        const buf = argBuffers.get(call_id);
        if (!buf) break;
        argBuffers.delete(call_id);

        const args = safeParseJSON(buf.argsText || '{}');
        try {
          opts?.onToolEffect?.(buf.name, args, undefined);
        } catch {}
        await executeOnce(call_id, buf.name, args);
        break;
      }

      case 'response.output_item.added': {
        const item = evt.item;
        if (item?.type !== 'function_call') break;
        const { call_id, name } = item;
        if (!argBuffers.has(call_id)) {
          argBuffers.set(call_id, { name, argsText: '' });
        }
        break;
      }

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
