import { Component, inject } from '@angular/core';
import { DashboardService } from '@eDB/client-dashboard';
import { UiLaunchTileComponent } from '@eDB/shared-ui';

@Component({
  selector: 'platform-subscription-collection',
  imports: [UiLaunchTileComponent],
  template: `
    <div class="subscriptions-container">
      @if (!isLoading()) {
        @if (error()) {
          <p>Error loading subscriptions: {{ error() }}</p>
        } @else {
          @if (subscriptions().length > 0) {
            <div class="subscriptions-tiles">
              @for (app of subscriptions(); track app.id) {
                <ui-launch-tile
                  [title]="app.name"
                  [description]="app.description"
                  [tags]="app.tags"
                ></ui-launch-tile>
              }
            </div>
          } @else {
            <p>No subscriptions found.</p>
          }
        }
      } @else {
        <p>Loading subscriptions...</p>
      }
    </div>
  `,
  styleUrl: './subscription-collection-container.scss',
})
export class SubscriptionsCollectionContainer {
  private dashboardService = inject(DashboardService);

  subscriptions = this.dashboardService.subscriptions;
  isLoading = this.dashboardService.isLoading;
  error = this.dashboardService.error;
}
