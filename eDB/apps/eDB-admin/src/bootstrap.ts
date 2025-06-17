import { bootstrapApplication } from '@angular/platform-browser';
import { Chart, registerables } from 'chart.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// check remote-entry for actual register. this one is so it works separately on localhost:4300
Chart.register(...registerables);
console.log('✅ chart.js registerables registered in remote:', Chart);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
