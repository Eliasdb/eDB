// content-switcher.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ContentSwitcherModule,
  ContentSwitcherOption,
} from 'carbon-components-angular';

@Component({
  selector: 'ui-content-switcher',
  standalone: true,
  imports: [ContentSwitcherModule, CommonModule],
  template: `
    <cds-content-switcher (selected)="onSelectionChange($event)">
      <button
        *ngFor="let option of optionsArray; let i = index"
        cdsContentOption
        [attr.data-index]="i"
        [class.bx--content-switcher--selected]="i === activeSection"
      >
        {{ option }}
      </button>
    </cds-content-switcher>

    <ng-container *ngIf="activeSection === 0">
      <ng-content select="[section1]"></ng-content>
    </ng-container>
    <ng-container *ngIf="activeSection === 1">
      <ng-content select="[section2]"></ng-content>
    </ng-container>
    <ng-container *ngIf="activeSection === 2">
      <ng-content select="[section3]"></ng-content>
    </ng-container>
  `,
})
export class UiContentSwitcherComponent {
  @Input() optionsArray: string[] = []; // Input for dynamic button labels

  @Input() activeSection: number = 0; // 0-based index for active section
  @Output() activeSectionChange: EventEmitter<number> =
    new EventEmitter<number>();

  @ViewChildren(ContentSwitcherOption)
  options!: QueryList<ContentSwitcherOption>;

  /**
   * Handles selection changes from the Content Switcher.
   * @param selectedOption The selected ContentSwitcherOption.
   */
  onSelectionChange(selectedOption: ContentSwitcherOption): void {
    const selectedIndex = this.options.toArray().indexOf(selectedOption);
    if (selectedIndex !== -1 && selectedIndex !== this.activeSection) {
      this.activeSection = selectedIndex;
      this.activeSectionChange.emit(this.activeSection);
    }
  }
}
