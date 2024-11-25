// content-switcher.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
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
      >
        {{ option }}
      </button>
    </cds-content-switcher>

    <ng-container *ngIf="selectedIndex === 0">
      <ng-content select="[section1]"></ng-content>
    </ng-container>
    <ng-container *ngIf="selectedIndex === 1">
      <ng-content select="[section2]"></ng-content>
    </ng-container>
    <ng-container *ngIf="selectedIndex === 2">
      <ng-content select="[section3]"></ng-content>
    </ng-container>
  `,
})
export class UiContentSwitcherComponent {
  @Input() optionsArray: string[] = []; // Input for dynamic button labels

  @ViewChildren(ContentSwitcherOption)
  options!: QueryList<ContentSwitcherOption>;

  selectedIndex = 0;

  onSelectionChange(option: ContentSwitcherOption): void {
    // Find the index of the selected option
    this.selectedIndex = this.options.toArray().indexOf(option);
  }
}
