/**
 * apps/server/clara-api/src/app/routes/chat.ts
 *
 * Text chat endpoint that:
 *  - Uses the shared tool specs + executeTool()
 *  - Properly loops through tool calls and feeds outputs back
 */
import type { FastifyPluginAsync } from 'fastify';
import type OpenAI from 'openai';
import { executeTool, toolSpecsForChat } from '../app/services/tools';
import { store } from '../domain/store';

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
- list_hub(): get all tasks/contacts/companies
- add_task(title, due?, source?)
- update_task(id, title?, due?, done?)
- add_contact(name, email?, phone?, source?)
- add_company(name, industry?, domain?, source?)
Call tools only when the user asks or it's an obvious follow-up.
Always answer the user conversationally after tools complete.`;

    const tools = toolSpecsForChat();

    const baseMsgs: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
      { role: 'system', content: JSON.stringify({ hub: store.all() }) },
      ...req.body.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    let messages = baseMsgs;

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
        // IMPORTANT: append assistant msg carrying tool_calls FIRST
        messages = [...messages, msg as any];

        for (const call of msg.tool_calls) {
          if (call.type !== 'function') continue;
          const args = call.function.arguments
            ? JSON.parse(call.function.arguments)
            : {};
          const result = await executeTool(call.function.name, args);

          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(result ?? null),
          } as any);
        }
        continue; // let model read tool outputs and craft a reply
      }

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
