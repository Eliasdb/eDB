import { Component, inject } from '@angular/core';
import { DashboardService } from '@eDB/client-dashboard';
import { UiLaunchTileComponent } from '@edb/shared-ui';
import { SubscribedApplication } from '../../types/dashboard.types';

@Component({
  selector: 'platform-subscription-collection',
  imports: [UiLaunchTileComponent],
  template: `
    <div
      class="subscriptions-container pt-6 text-black"
      data-testid="my-apps-section"
    >
      @if (error()) {
        <p>Error loading subscriptions: {{ error() }}</p>
      } @else {
        <div class="subscriptions-tiles" data-testid="my-apps-list">
          @if (isLoading()) {
            <!-- Render fixed number of skeleton tiles while loading -->
            @for (i of [1]; track $index) {
              <ui-launch-tile [skeleton]="true"></ui-launch-tile>
            }
          } @else {
            @if (subscriptions().length > 0) {
              @for (app of subscriptions(); track $index) {
                <ui-launch-tile
                  [title]="app.name"
                  data-testid="my-app-card"
                  [description]="app.description"
                  [tags]="app.tags"
                  [skeleton]="false"
                  [routePath]="app.routePath"
                  [iconUrl]="app.iconUrl"
                ></ui-launch-tile>
              }
            } @else {
              <p>No subscriptions found.</p>
            }
          }
        </div>
      }
    </div>
  `,
  styleUrl: './subscription-collection-container.scss',
})
export class SubscriptionsCollectionContainer {
  private dashboardService = inject(DashboardService);

  subscriptions = this.dashboardService.subscriptions;

  trackByApp(index: number, app: SubscribedApplication): number {
    console.log(index);

    return app.id;
  }

  isLoading = this.dashboardService.isLoading;
  error = this.dashboardService.error;
}
