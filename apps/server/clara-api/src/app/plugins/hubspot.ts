// apps/server/clara-api/src/app/plugins/hubspot.ts
import fp from 'fastify-plugin';
import { HubspotHttp } from '../../integrations/hubspot/client';
import { HubspotGateway } from '../../integrations/hubspot/gateway';

declare module 'fastify' {
  interface FastifyInstance {
    hubspot: HubspotGateway;
  }
}

const hubspotPlugin = fp(async (fastify) => {
  const http = new HubspotHttp();
  fastify.decorate('hubspot', new HubspotGateway(http));
});

export default hubspotPlugin;
