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
      class="relative flex flex-col min-w-[20rem] rounded-md transition-colors duration-1000 ease-linear"
    >
      <div class="flex flex-col gap-4 p-4">
        <h3 class="m-0 text-base">{{ title() }}</h3>
        <p class="m-0 text-[0.9rem] text-[#6f6f6f] pr-8">{{ description() }}</p>
      </div>
      <div class="flex justify-between items-center mt-12">
        <div class="flex flex-wrap gap-2">
          @for (tag of tags(); track $index) {
            <ui-tag [label]="tag"></ui-tag>
          }
        </div>

        <ui-icon-button
          buttonId="subscribe-btn"
          size="md"
          icon="faDownload"
          iconSize="16px"
          iconColor="#ffffff"
          description="Subscribe"
          (click)="emitSubscribe()"
        ></ui-icon-button>
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
