import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { I18nModule, PlaceholderModule } from 'carbon-components-angular';

import { UiPlatformHeaderComponent } from '../header/platform-header.component';

@Component({
  selector: 'ui-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiPlatformHeaderComponent,
    MatButtonModule,
    MatDialogModule,
    PlaceholderModule,
    I18nModule,
  ],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-white">
      <ui-platform-header
        [navigationLinks]="navigationLinks"
        [menuOptions]="menuOptions"
        (linkClick)="linkClick.emit($event)"
        (menuOptionSelected)="menuOptionSelected.emit($event)"
      ></ui-platform-header>

      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>
    </div>
  `,
})
export class UiShellComponent {
  @Input() menuOptions: any[] = [];
  @Input() navigationLinks: any[] = [];

  @Output() linkClick = new EventEmitter<string>();
  @Output() menuOptionSelected = new EventEmitter<string>();
}
