import { bootstrapWithKeycloak } from '@eDB/client-auth';
import { Chart, registerables } from 'chart.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

Chart.register(...registerables); // keep your Chart.js stuff

bootstrapWithKeycloak(AppComponent, appConfig);
