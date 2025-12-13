import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlaceholderModule } from 'carbon-components-angular';

import { UiPlatformHeaderComponent } from '../header/platform-header.component';

type NavigationLink = {
  id: string;
  label: string;
  isCurrentPage: boolean;
  icon?: string;
};

type MenuOption = {
  id: string;
  label: string;
};

@Component({
  selector: 'ui-shell',
  imports: [RouterModule, UiPlatformHeaderComponent, PlaceholderModule],
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
  @Input() menuOptions: MenuOption[] = [];
  @Input() navigationLinks: NavigationLink[] = [];

  @Output() linkClick = new EventEmitter<string>();
  @Output() menuOptionSelected = new EventEmitter<string>();
}
