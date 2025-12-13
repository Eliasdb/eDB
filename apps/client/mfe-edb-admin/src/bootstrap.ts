import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export function initRemote() {
  return bootstrapApplication(AppComponent, appConfig);
}

// Only run the standalone bootstrap when not hosted via MF in production.
const isProd = process.env['NODE_ENV'] === 'production';
if (!isProd) {
  initRemote();
}
