import type { FastifyInstance } from 'fastify';
import type OpenAI from 'openai';

export type ExecCtx = { app?: FastifyInstance };

// Every tool pack implements this.
export interface ToolModule {
  /** Unique module namespace, e.g. "hub" or "hubspot" */
  namespace: string;

  /** Chat tool specs (OpenAI schema objects) */
  specsForChat(): OpenAI.Chat.Completions.ChatCompletionTool[];

  /** Realtime tool specs (flat function list, name must be ^[a-zA-Z0-9_-]+$) */
  specsForRealtime(): Array<{
    type: 'function';
    name: string;
    description?: string;
    parameters?: any;
  }>;

  /** Execute a namespaced tool */
  execute(localName: string, args: unknown, ctx: ExecCtx): Promise<any>;
}

const modules: ToolModule[] = [];

export function registerToolModule(mod: ToolModule) {
  modules.push(mod);
}

export function listModules() {
  return modules;
}

/** Aggregate specs */
export function allSpecsForChat() {
  return modules.flatMap((m) => m.specsForChat());
}

export function allSpecsForRealtime() {
  return modules.flatMap((m) => m.specsForRealtime());
}

/** Route: can accept "ns.tool" or "ns_tool" */
export async function executeToolRouted(
  name: string,
  args: unknown,
  ctx: ExecCtx,
) {
  const canonical = name.includes('.') ? name : name.replace('_', '.');
  const [ns, ...rest] = canonical.split('.');
  const local = rest.join('.');
  const mod = modules.find((m) => m.namespace === ns);
  if (!mod) return { error: `unknown_namespace ${ns}` };
  if (!local) return { error: `missing_tool_name` };
  return mod.execute(local, args, ctx);
}
