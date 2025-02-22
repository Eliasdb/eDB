import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { webshopRoutes } from './app.routes';

@NgModule({
  imports: [RouterModule.forChild(webshopRoutes)],
  exports: [RouterModule],
})
export class WebshopModule {}
