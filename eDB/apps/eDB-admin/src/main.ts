import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  PolarAreaController,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  CategoryScale, // for category axes (used by bar charts)
  LinearScale, // for linear scales (used by bar charts)
  BarElement, // for bar elements
  BarController, // for bar chart controller
  ArcElement, // for arc elements (used by doughnut charts)
  DoughnutController, // for doughnut chart controller
  RadialLinearScale, // for polar area scales
  PolarAreaController, // for polar area chart controller
  Title,
  Tooltip,
  Legend, // optional plugins, but commonly needed
);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
