import { Component, EventEmitter, Output, input } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../../components/icon/icon.component';

@Component({
  selector: 'ui-platform-overflow-menu',
  imports: [DialogModule, UiIconComponent],
  template: `
    <cds-overflow-menu
      [open]="isMenuOpen"
      [placement]="placement()"
      [flip]="flip()"
      [offset]="offset()"
      [customTrigger]="customTriggerTemplate"
      (selected)="onMenuSelect($event)"
      (closed)="isMenuOpen = false"
      description=""
    >
      @for (option of menuOptions(); track option.id) {
        <cds-overflow-menu-option (click)="onOptionClick(option.id)">
          {{ option.label }}
        </cds-overflow-menu-option>
      }
    </cds-overflow-menu>

    <ng-template #customTriggerTemplate>
      <ui-icon
        [name]="icon()"
        [size]="iconSize()"
        [color]="iconColor()"
        [fixedWidth]="true"
      ></ui-icon>
    </ng-template>
  `,
})
export class UiPlatformOverflowMenuComponent {
  readonly menuOptions = input<
    {
      id: string;
      label: string;
    }[]
  >([]);
  readonly placement = input<'bottom' | 'top'>('bottom');
  readonly flip = input<boolean>(true);
  readonly offset = input<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  readonly icon = input<string>('');
  readonly iconSize = input<string>('1rem');
  readonly iconColor = input<string>('black');

  @Output() menuOptionSelected = new EventEmitter<string>(); // Emits the id of the selected menu option

  isMenuOpen = false;

  constructor(private router: Router) {}

  onOptionClick(optionId: string): void {
    if (optionId === 'logout') {
      // Perform logout logic
      console.log('Logging out...');
    } else {
      this.router.navigate([optionId]);
    }
    this.menuOptionSelected.emit(optionId);
    this.isMenuOpen = false; // Close menu after selection
  }

  onMenuSelect(event: any): void {
    this.isMenuOpen = false;
  }
}
