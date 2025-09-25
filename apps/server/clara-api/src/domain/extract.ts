import type OpenAI from 'openai';
import { z } from 'zod';
import type { Company, Contact, Extraction, Task } from './types';

export const extractionSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        due: z.string().optional(),
        done: z.boolean().optional(),
        source: z.string().optional(),
      }),
    )
    .default([]),
  contacts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        avatarUrl: z.string().url().optional(),
        source: z.string().optional(),
      }),
    )
    .default([]),
  companies: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        industry: z.string().optional(),
        domain: z.string().optional(),
        logoUrl: z.string().url().optional(),
        source: z.string().optional(),
      }),
    )
    .default([]),
});

export async function extractEntities(
  openai: OpenAI | undefined,
  transcript: string,
): Promise<Extraction> {
  if (!openai) {
    // Mock for local dev
    return {
      tasks: [
        { id: `t_${Date.now()}`, title: 'Follow up from mock', source: 'mock' },
      ],
      contacts: [],
      companies: [],
    };
  }

  const sys = `You are an information extraction service.
From the USER text, extract Tasks, Contacts, Companies as JSON that matches the given schema.
Invent stable ids (e.g. deterministic slug).
Only return JSON.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: transcript },
    ],
    response_format: { type: 'json_object' },
    temperature: 0,
  });

  const raw = resp.choices?.[0]?.message?.content ?? '{}';

  const json = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  })();

  const parsed = extractionSchema.safeParse(json);

  // Lock base to schema type so required fields stay required
  type ExtractionZ = z.infer<typeof extractionSchema>;
  const base: ExtractionZ = parsed.success
    ? parsed.data
    : { tasks: [], contacts: [], companies: [] };

  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40);

  const result: Extraction = {
    tasks: base.tasks.map<Task>((t) => ({
      id: t.id ?? `t-${slug(t.title)}-${Date.now()}`,
      title: t.title,
      due: t.due,
      done: t.done,
      source: t.source,
    })),
    contacts: base.contacts.map<Contact>((c) => ({
      id: c.id ?? `c-${slug(c.name)}-${Date.now()}`,
      name: c.name,
      email: c.email,
      phone: c.phone,
      avatarUrl: c.avatarUrl,
      source: c.source,
    })),
    companies: base.companies.map<Company>((c) => ({
      id: c.id ?? `co-${slug(c.name)}-${Date.now()}`,
      name: c.name,
      industry: c.industry,
      domain: c.domain,
      logoUrl: c.logoUrl,
      source: c.source,
    })),
  };

  return result;
}
