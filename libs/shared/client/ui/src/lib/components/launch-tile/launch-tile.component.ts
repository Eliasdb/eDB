import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule, TilesModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTagComponent } from '../tag/tag.component';

@Component({
  selector: 'ui-launch-tile',
  imports: [
    TilesModule,
    UiTagComponent,
    UiButtonComponent,
    SkeletonModule,
    RouterLink,
  ],
  template: `
    <cds-tile
      class="launch-tile p-0  border-t-[#1f2937] border border-width-2 border-t-[5px] relative block w-full h-full overflow-hidden"
    >
      @if (skeleton()) {
        <div class="skeleton-placeholder absolute inset-0 z-10">
          <cds-skeleton-placeholder></cds-skeleton-placeholder>
        </div>
      }

      <div class="tile-header flex justify-start items-start gap-4 p-4">
        <div>
          <div>
            @if (iconUrl()) {
              <img
                [src]="iconUrl()"
                alt="App icon"
                width="32"
                height="32"
                class="rounded-sm"
              />
            } @else {
              <!-- Fallback SVG icon -->
              <svg
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                fill="#1f2937"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16,2a14,14,0,0,0-4.43,27.28c.7.13,1-.3,1-.67s0-1.21,0-2.38c-3.89.84-4.71-1.88-4.71-1.88A3.71,3.71,0,0,0,6.24,22.3c-1.27-.86.1-.85.1-.85A2.94,2.94,0,0,1,8.48,22.9a3,3,0,0,0,4.08,1.16,2.93,2.93,0,0,1,.88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4,5.4,0,0,1,1.44-3.76,5,5,0,0,1,.14-3.7s1.17-.38,3.85,1.43a13.3,13.3,0,0,1,7,0c2.67-1.81,3.84-1.43,3.84-1.43a5,5,0,0,1,.14,3.7,5.4,5.4,0,0,1,1.44,3.76c0,5.38-3.27,6.56-6.39,6.91a3.33,3.33,0,0,1,.95,2.59c0,1.87,0,3.38,0,3.84s.25.81,1,.67A14,14,0,0,0,16,2Z"
                ></path>
              </svg>
            }
          </div>
        </div>
        <div>
          <h4 class=" text-xl text-[#1f2937]">{{ title() }}</h4>
          <p class="text-[#1f2937] font-light">{{ description() }}</p>
        </div>
      </div>

      <div class="tile-footer">
        <div class="tile-tags p-4">
          @for (tag of tags(); track $index) {
            <ui-tag [label]="tag"></ui-tag>
          }
        </div>

        <div class="launch-btn-container w-full">
          <a routerLink="{{ routePath() }}">
            <ui-button [fullWidth]="true" size="sm">Launch</ui-button>
          </a>
        </div>
      </div>
    </cds-tile>
  `,
  styleUrl: './launch-tile.scss',
})
export class UiLaunchTileComponent {
  readonly title = input<string>('Test');
  readonly description = input<string>();
  readonly tags = input<string[]>([]);
  readonly skeleton = input<boolean>(false);
  readonly routePath = input<string>();
  readonly iconUrl = input<string>();
}
