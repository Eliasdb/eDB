// bootstrap.ts  (host app)
import { bootstrapWithKeycloak } from '@eDB/client-auth'; // <-- helper you added
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapWithKeycloak(AppComponent, appConfig); // <-- that’s the “magical” line
