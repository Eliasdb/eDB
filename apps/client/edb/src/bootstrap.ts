import { bootstrapWithKeycloak } from '@edb/client-auth';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapWithKeycloak(AppComponent, appConfig);
