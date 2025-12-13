import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export function initRemote() {
  return bootstrapApplication(AppComponent, appConfig);
}
initRemote();
