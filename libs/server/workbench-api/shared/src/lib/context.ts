// libs/server/workbench-api/shared/src/lib/context.ts

export type RequestContext = {
  userId: string | null;
  roles: string[];
};

export function ctxFromReq(req: unknown): RequestContext {
  // We assume FastifyRequest decorated with req.user
  const user =
    (req as { user?: { userId?: string; roles?: unknown } }).user ?? {};

  return {
    userId: user.userId ?? null,
    roles: Array.isArray(user.roles) ? (user.roles as string[]) : [],
  };
}
