import { crmModule } from './modules/crm';
import { hubspotModule } from './modules/hubspot';
import { registerToolModule } from './registry';

export * from './registry';

registerToolModule(crmModule);
registerToolModule(hubspotModule);
