import { Component, EventEmitter, input, Output } from '@angular/core';
import { TilesModule } from 'carbon-components-angular';
import { UiIconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  selector: 'ui-tile',
  imports: [TilesModule, UiTagComponent, UiIconButtonComponent],
  template: `
    <cds-tile class="ui-tile">
      <div class="tile-header">
        <h3 class="tile-title">{{ title() }}</h3>
        <p class="tile-description">{{ description() }}</p>
      </div>
      <div class="tile-footer">
        <div class="tile-tags">
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
  styleUrls: ['tile.component.scss'],
})
export class UiTileComponent {
  readonly id = input<number>(0);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tags = input<string[]>([]);

  @Output() subscribe = new EventEmitter<number>();

  emitSubscribe() {
    this.subscribe.emit(this.id());
  }
}
