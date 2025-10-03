/**
 * apps/server/clara-api/src/routes/chat.ts
 *
 * Text chat endpoint that:
 *  - Uses the shared tool specs + executeToolRouted()
 *  - Loops through tool calls and feeds outputs back
 */
import type { FastifyPluginAsync } from 'fastify';
import type OpenAI from 'openai';
import { allSpecsForChat, executeToolRouted } from '../../app/services/tools';
import { store } from '../../domain/stores/store';

const route: FastifyPluginAsync = async (app) => {
  app.post<{
    Body: { messages: { role: 'user' | 'assistant'; content: string }[] };
  }>('/chat', async (req, reply) => {
    const openai: OpenAI | undefined = (app as any).openai;
    if (!openai) {
      return reply.send({
        reply: "Clara isn't connected to the model yet.",
        hub: store.all(),
      });
    }

    const system = `
You are Clara, a helpful assistant. You can call tools to manage the user's hub:
- hub.list(), hub.list_kind(kind)
- hub.create(kind, data)
- hub.update(kind, id, patch)
- hub.delete(kind, id)
Call tools when asked or when it's an obvious follow-up. Keep replies concise after tools complete.`;

    const tools = allSpecsForChat();

    let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
      { role: 'system', content: JSON.stringify({ hub: store.all() }) },
      ...req.body.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    for (let step = 0; step < 4; step++) {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools,
        tool_choice: 'auto',
        temperature: 0.2,
      });

      const msg = resp.choices[0].message;

      if (msg.tool_calls?.length) {
        // 1) add the assistant message that contains the tool calls
        messages = [...messages, msg as any];

        // 2) execute each tool and append tool results
        for (const call of msg.tool_calls) {
          if (call.type !== 'function') continue;

          const args = call.function.arguments
            ? JSON.parse(call.function.arguments)
            : {};

          const result = await executeToolRouted(
            call.function.name, // e.g. 'hub.create'
            args,
            { app }, // pass Fastify for integrations like HubSpot
          );

          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(result ?? null),
          } as any);
        }

        // loop again so the model can read tool outputs and answer
        continue;
      }

      // No tool calls → return the assistant text
      const text =
        typeof msg.content === 'string'
          ? msg.content
          : Array.isArray(msg.content)
            ? (msg.content as any[])
                .map((p) => (typeof p === 'string' ? p : (p?.text ?? '')))
                .join('')
            : '';

      return reply.send({ reply: text, hub: store.all() });
    }

    return reply.send({
      reply: "Okay, I've updated what I could.",
      hub: store.all(),
    });
  });
};

export default route;
