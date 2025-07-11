import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { SkeletonModule, TilesModule } from 'carbon-components-angular';
import { UiIconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  selector: 'ui-tile',
  imports: [TilesModule, UiTagComponent, UiIconButtonComponent, SkeletonModule],
  styles: [
    `
      cds-tile.subscribed {
        background-color: var(--surface-primary);
        border-color: var(--accent-complimentary);
      }
    `,
  ],
  template: `
    <cds-tile
      [class.subscribed]="isSubscribed()"
      class="relative flex flex-col  bg-white transition-colors duration-300 ease-linear border rounded-[0.375rem] p-4"
    >
      @if (loading()) {
        <div class="bg-white border rounded-[0.375rem] flex flex-col gap-4 ">
          <cds-skeleton-placeholder
            style="width: 20%; height: 1.25rem;"
          ></cds-skeleton-placeholder>
          <cds-skeleton-placeholder
            style="width: 40%; height: 1.25rem;"
          ></cds-skeleton-placeholder>

          <div class="flex flex-wrap justify-between gap-2">
            <section class="flex gap-2">
              <cds-skeleton-placeholder
                style="width: 3rem; height: 1rem;"
              ></cds-skeleton-placeholder>
              <cds-skeleton-placeholder
                style="width: 3rem; height: 1rem;"
              ></cds-skeleton-placeholder>
            </section>

            <cds-skeleton-placeholder
              style="width: 2.25rem; height: 2.25rem; border-radius: 0.375rem; margin-botton:0.5rem;"
            ></cds-skeleton-placeholder>
          </div>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          <h3 class="m-0 text-base text-[#1f2937] font-semibold">
            {{ title() }}
          </h3>
          <p class="m-0 text-[0.9rem] text-[#6f6f6f] pr-8">
            {{ description() }}
          </p>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex flex-wrap">
            @for (tag of tags(); track $index) {
              <ui-tag [label]="tag"></ui-tag>
            }
          </div>

          <div class="mb-3">
            <ui-icon-button
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
      }
    </cds-tile>
  `,
})
export class UiTileComponent {
  readonly id = input<number>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly tags = input<string[]>([]);
  readonly isSubscribed = model<boolean>();
  readonly loading = input(false); // new input

  @Output() subscribe = new EventEmitter<number>();

  emitSubscribe() {
    this.subscribe.emit();
  }
}
