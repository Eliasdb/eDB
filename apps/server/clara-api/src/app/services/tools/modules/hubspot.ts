import type OpenAI from 'openai';
import { z } from 'zod';
import { withToolLog } from '../../tools/tool-logger';
import type { ExecCtx, ToolModule } from '../registry';

export const hubspotModule: ToolModule = {
  namespace: 'hubspot',

  specsForChat(): OpenAI.Chat.Completions.ChatCompletionTool[] {
    return [
      {
        type: 'function',
        function: {
          name: 'hubspot.upsert_contact',
          description: 'Create/update HubSpot contact by email',
          parameters: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              firstname: { type: 'string' },
              lastname: { type: 'string' },
              phone: { type: 'string' },
              company: { type: 'string' },
            },
            required: ['email'],
            additionalProperties: false,
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'hubspot.update_deal_stage',
          description: 'Move deal to stage',
          parameters: {
            type: 'object',
            properties: {
              dealId: { type: 'string' },
              stage: { type: 'string' },
              pipeline: { type: 'string' },
            },
            required: ['dealId', 'stage'],
            additionalProperties: false,
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'hubspot.create_company_and_link',
          description: 'Create company and optionally link contact',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              domain: { type: 'string' },
              contactId: { type: 'string' },
            },
            required: ['name'],
            additionalProperties: false,
          },
        },
      },
    ];
  },

  specsForRealtime() {
    return this.specsForChat().map((t: any) => ({
      type: 'function',
      name: t.function.name.replace(/\./g, '_'),
      description: t.function.description,
      parameters: t.function.parameters,
    }));
  },

  async execute(localName, args, ctx: ExecCtx) {
    return withToolLog(`hubspot.${localName}`, args, async () => {
      if (!ctx.app) return { error: 'server_missing_app_context' };

      switch (localName) {
        case 'upsert_contact': {
          const A = z.object({
            email: z.string().email(),
            firstname: z.string().optional(),
            lastname: z.string().optional(),
            phone: z.string().optional(),
            company: z.string().optional(),
          });
          const a = A.parse(args);
          const contact = await ctx.app.hubspot.upsertContactByEmail(
            a.email,
            a,
          );
          return {
            ok: true,
            id: contact.id,
            summary: `Contact upserted for ${a.email}`,
          };
        }

        case 'update_deal_stage': {
          const A = z.object({
            dealId: z.string(),
            stage: z.string(),
            pipeline: z.string().optional(),
          });
          const a = A.parse(args);
          const props: Record<string, any> = { dealstage: a.stage };
          if (a.pipeline) props.pipeline = a.pipeline;
          const deal = await ctx.app.hubspot.updateDeal(a.dealId, props);
          return {
            ok: true,
            id: deal.id,
            summary: `Deal ${a.dealId} -> ${a.stage}`,
          };
        }

        case 'create_company_and_link': {
          const A = z.object({
            name: z.string(),
            domain: z.string().optional(),
            contactId: z.string().optional(),
          });
          const a = A.parse(args);
          const company = await ctx.app.hubspot.createCompany({
            name: a.name,
            domain: a.domain,
          });
          if (a.contactId) {
            await ctx.app.hubspot.associate(
              'companies',
              company.id,
              'contacts',
              a.contactId,
              'company_to_contact',
            );
          }
          return {
            ok: true,
            id: company.id,
            summary: `Company ${a.name} created`,
          };
        }

        default:
          return { error: `unknown_tool hubspot.${localName}` };
      }
    });
  },
};
