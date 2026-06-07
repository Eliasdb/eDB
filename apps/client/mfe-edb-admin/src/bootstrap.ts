// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';

// export function initRemote() {
//   return bootstrapApplication(AppComponent, appConfig);
// }

// initRemote();

// apps/client/mfe-edb-admin/src/bootstrap.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import adminRemoteRoutes from './app/remote-entry/entry.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(adminRemoteRoutes)],
}).catch((err) => console.error(err));
