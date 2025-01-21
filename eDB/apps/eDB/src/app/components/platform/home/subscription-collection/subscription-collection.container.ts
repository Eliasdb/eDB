import { Component, inject } from '@angular/core';
import { UserSubscriptionsService } from '@eDB/platform-services';
import { UiLaunchTileComponent } from '@eDB/shared-ui';

@Component({
  selector: 'platform-subscription-collection',
  imports: [UiLaunchTileComponent],
  template: `
    <div class="subscriptions-container">
      <h1>My products</h1>
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
})
export class SubscriptionsCollectionContainer {
  private subscriptionsService = inject(UserSubscriptionsService);

  subscriptions = this.subscriptionsService.subscriptions;
  isLoading = this.subscriptionsService.isLoading;
  error = this.subscriptionsService.error;
}
