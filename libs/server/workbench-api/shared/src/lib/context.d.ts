export type RequestContext = {
    userId: string | null;
    roles: string[];
};
export declare function ctxFromReq(req: unknown): RequestContext;
