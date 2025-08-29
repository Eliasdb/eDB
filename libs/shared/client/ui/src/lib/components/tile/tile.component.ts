import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { SkeletonModule, TilesModule } from 'carbon-components-angular';
import { UiIconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  selector: 'ui-tile',
  standalone: true,
  imports: [TilesModule, UiTagComponent, UiIconButtonComponent, SkeletonModule],
  styles: [
    `
      cds-tile.subscribed {
        background-color: var(--surface-primary);
        border-color: var(--accent-complimentary);
      }

      .tile-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
        object-fit: contain;
      }
    `,
  ],
  template: `
    <cds-tile
      [class.subscribed]="isSubscribed()"
      class="relative flex flex-col bg-white transition-colors duration-300 ease-linear border rounded-xl p-6 shadow-sm"
    >
      @if (loading()) {
        <div class="flex flex-col gap-6">
          <!-- Title -->
          <cds-skeleton-placeholder
            style="width: 30%; height: 1.25rem;"
          ></cds-skeleton-placeholder>

          <!-- Description -->
          <cds-skeleton-placeholder
            style="width: 70%; height: 1rem;"
          ></cds-skeleton-placeholder>

          <!-- Tags & Button -->
          <div class="flex justify-between items-center mt-4">
            <section class="flex gap-2">
              <cds-skeleton-placeholder
                style="width: 3rem; height: 1.5rem;"
              ></cds-skeleton-placeholder>
              <cds-skeleton-placeholder
                style="width: 3rem; height: 1.5rem;"
              ></cds-skeleton-placeholder>
            </section>

            <cds-skeleton-placeholder
              style="width: 2.25rem; height: 2.25rem; border-radius: 0.375rem;"
            ></cds-skeleton-placeholder>
          </div>
        </div>
      } @else {
        <div class="flex flex-col gap-6">
          <!-- Title with icon -->
          <h3
            class="m-0 text-base text-gray-900 font-semibold flex items-center"
          >
            @if (iconUrl()) {
              <img [src]="iconUrl()" alt="Icon" class="tile-icon" />
            }
            {{ title() }}
          </h3>

          <!-- Description -->
          <p class="m-0 text-sm text-gray-600 pr-8">
            {{ description() }}
          </p>

          <!-- Tags & Button -->
          <div class="flex justify-between items-center mt-4">
            <div class="flex flex-wrap gap-2">
              @for (tag of tags(); track $index) {
                <ui-tag [label]="tag"></ui-tag>
              }
            </div>

            <div class="mb-2">
              <ui-icon-button
                [ariaLabel]="isSubscribed() ? 'Unsubscribe' : 'Subscribe'"
                [testId]="isSubscribed() ? 'unsubscribe-btn' : 'subscribe-btn'"
                buttonId="subscribe-btn"
                size="sm"
                icon="faDownload"
                iconSize="16px"
                iconColor="var(--accent)"
                description="Subscribe"
                (click)="emitSubscribe()"
              ></ui-icon-button>
            </div>
          </div>
        </div>
      }
    </cds-tile>
  `,
})
export class UiTileComponent {
  readonly id = input<number>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly tags = input<string[]>([]);
  readonly iconUrl = input<string>();
  readonly isSubscribed = model<boolean>();
  readonly loading = input(false);

  @Output() subscribe = new EventEmitter<number>();

  emitSubscribe() {
    this.subscribe.emit();
  }
}
