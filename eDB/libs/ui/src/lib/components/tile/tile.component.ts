import { Component, Input } from '@angular/core';
import { TilesModule } from 'carbon-components-angular';
import { UiIconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  standalone: true,
  selector: 'ui-tile',
  imports: [TilesModule, UiTagComponent, UiIconButtonComponent],
  template: `
    <cds-tile class="ui-tile">
      <div class="tile-header">
        <h3 class="tile-title">{{ title }}</h3>
        <p class="tile-description">{{ description }}</p>
      </div>
      <div class="tile-footer">
        <div class="tile-tags">
          @for (tag of tags; track tag) {
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
          (click)="onSubscribeClick()"
        ></ui-icon-button>
      </div>
    </cds-tile>
  `,
  styleUrls: ['tile.component.scss'],
})
export class UiTileComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() tags: string[] = [];

  onSubscribeClick() {
    alert('Subscribed!');
  }
}
