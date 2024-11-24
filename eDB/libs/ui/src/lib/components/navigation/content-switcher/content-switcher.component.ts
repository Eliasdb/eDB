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
      <button *ngFor="let section of sections; let i = index" cdsContentOption>
        {{ section }}
      </button>
    </cds-content-switcher>

    <ng-container *ngFor="let section of sections; let i = index">
      <ng-container *ngIf="selectedIndex === i">
        <ng-content select="[section{{ i + 1 }}]"></ng-content>
      </ng-container>
    </ng-container>
  `,
})
export class UiContentSwitcherComponent {
  @Input() sections: string[] = [];

  @ViewChildren(ContentSwitcherOption)
  options!: QueryList<ContentSwitcherOption>;

  selectedIndex = 0;

  onSelectionChange(option: ContentSwitcherOption): void {
    // Find the index of the selected option
    this.selectedIndex = this.options.toArray().indexOf(option);
  }
}
