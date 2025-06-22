import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AdminService } from '@eDB/client-admin';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  DropdownModule,
  I18nModule,
  ModalModule,
} from 'carbon-components-angular';
import { remoteRoutes } from './entry.routes';

@NgModule({
  imports: [
    RouterModule.forChild(remoteRoutes),
    I18nModule,
    ModalModule,
    DropdownModule,
  ],
  providers: [
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    AdminService,
  ],
})
export class RemoteAdminModule {}

export default RemoteAdminModule;
