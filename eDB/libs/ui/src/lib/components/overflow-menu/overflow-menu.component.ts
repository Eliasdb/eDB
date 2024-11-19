import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'ui-platform-overflow-menu',
  standalone: true,
  imports: [CommonModule, DialogModule, UiIconComponent],
  template: `
    <cds-overflow-menu
      [open]="isMenuOpen"
      [placement]="placement"
      [flip]="flip"
      [offset]="offset"
      [customTrigger]="customTriggerTemplate"
      (selected)="onMenuSelect($event)"
      (closed)="isMenuOpen = false"
      description=""
    >
      <cds-overflow-menu-option
        *ngFor="let option of menuOptions"
        (click)="onOptionClick(option.id)"
      >
        {{ option.label }}
      </cds-overflow-menu-option>
    </cds-overflow-menu>

    <ng-template #customTriggerTemplate>
      <ui-icon
        [name]="icon"
        [size]="iconSize"
        [color]="iconColor"
        [fixedWidth]="true"
      ></ui-icon>
    </ng-template>
  `,
})
export class UiPlatformOverflowMenuComponent {
  @Input() menuOptions: { id: string; label: string }[] = [];
  @Input() placement: 'bottom' | 'top' = 'bottom';
  @Input() flip: boolean = true;
  @Input() offset: { x: number; y: number } = { x: 0, y: 7 };

  @Input() icon: string = 'faUser';
  @Input() iconSize: string = '1rem';
  @Input() iconColor: string = 'black';

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
