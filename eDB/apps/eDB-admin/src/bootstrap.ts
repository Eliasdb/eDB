import { bootstrapApplication } from '@angular/platform-browser';
import { Chart, registerables } from 'chart.js';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// check remote-entry for actual register. this one is so it works separately on localhost:4300. When you load your remote only for its Routes (via loadRemote('eDB-admin/Routes')), none of your remote’s main.ts bootstrap code ever runs. test
Chart.register(...registerables);
console.log('✅ chart.js registerables registered in remote:', Chart);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
