import { bootstrapWithKeycloak } from '@eDB/client-auth';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

async function bootstrap() {
  try {
    // Ensure the remote's Angular injector and providers are initialized
    const remote = await import('eDB-admin/initRemote');
    await remote?.initRemote?.(); // gracefully handle optional export
    console.log('✅ eDB-admin remote initialized');
  } catch (err) {
    console.warn('⚠️ Failed to initialize remote admin app:', err);
  }

  // Then bootstrap your own host app
  bootstrapWithKeycloak(AppComponent, appConfig);
}

bootstrap();
