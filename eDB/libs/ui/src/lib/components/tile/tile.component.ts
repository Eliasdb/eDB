import { Component, Input } from '@angular/core';
import { TilesModule } from 'carbon-components-angular';
import { UiTagComponent } from '../tag/tag.component';

interface Tag {
  type: string;
  label: string;
  icon?: string;
  skeleton?: boolean;
  size?: string;
}

@Component({
  standalone: true,
  selector: 'ui-tile',
  imports: [TilesModule, UiTagComponent],
  template: `
    <cds-clickable-tile class="ui-tile">
      <div class="tile-header">
        <div>
          <h3 class="tile-title">{{ title }}</h3>
          <p class="tile-description">{{ description }}</p>
        </div>
        <button
          class="subscribe-button"
          (click)="onSubscribeClick()"
          aria-label="Subscribe"
        >
          Subscribe
        </button>
      </div>
      <div class="tile-tags">
        <ui-tag
          *ngFor="let tag of tags"
          [type]="tag.type"
          [label]="tag.label"
          [icon]="tag.icon"
          [size]="tag.size"
        ></ui-tag>
      </div>
    </cds-clickable-tile>
  `,
  styleUrl: 'tile.component.scss',
})
export class UiTileComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() tags: Tag[] = [];

  onSubscribeClick() {
    alert('Subscribed!');
  }
}
