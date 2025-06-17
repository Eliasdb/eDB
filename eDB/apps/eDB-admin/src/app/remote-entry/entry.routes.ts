import { Route } from '@angular/router';
import { remoteRoutes as featureAdminRoutes } from '../app.routes';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export const remoteRoutes: Route[] = featureAdminRoutes;
