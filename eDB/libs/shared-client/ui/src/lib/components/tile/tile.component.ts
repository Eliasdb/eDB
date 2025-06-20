import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { TilesModule } from 'carbon-components-angular';
import { UiIconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  selector: 'ui-tile',
  imports: [TilesModule, UiTagComponent, UiIconButtonComponent],
  template: `
    <cds-tile
      [class.subscribed]="isSubscribed()"
      class="relative flex flex-col min-w-[20rem]  transition-colors duration-1000 ease-linear border border-width-2 rounded-[0.375rem]"
    >
      <div class="flex flex-col gap-4 ">
        <h3 class="m-0 text-base text-[#1f2937] font-semibold">
          {{ title() }}
        </h3>
        <p class="m-0 text-[0.9rem] text-[#6f6f6f] pr-8">{{ description() }}</p>
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
            size="md"
            icon="faDownload"
            iconSize="16px"
            iconColor="#1f2937"
            description="Subscribe"
            (click)="emitSubscribe()"
          ></ui-icon-button>
        </div>
      </div>
    </cds-tile>
  `,
})
export class UiTileComponent {
  readonly id = input<number>(0);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tags = input<string[]>([]);
  readonly isSubscribed = model<boolean>(); // new input for subscribed state

  @Output() subscribe = new EventEmitter<number>();

  emitSubscribe() {
    this.subscribe.emit(this.id());
  }
}
