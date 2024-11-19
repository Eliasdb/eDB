import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StructuredListModule } from 'carbon-components-angular';
import { UiIconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-structured-list',
  standalone: true,
  imports: [StructuredListModule, UiIconComponent, CommonModule],
  template: `
    <cds-structured-list [skeleton]="skeleton">
      <cds-list-header>
        <!-- First column header passed as input -->
        <cds-list-column>
          {{ header }}
          <!-- Dynamic icon in the header -->
          <ui-icon
            *ngIf="headerIcon"
            [name]="headerIcon"
            size="16"
            class="icon-gap"
          ></ui-icon>
        </cds-list-column>
      </cds-list-header>

      <!-- Dynamic rows passed as input -->
      <cds-list-row *ngFor="let row of rows">
        <cds-list-column>{{ row[0] }}</cds-list-column>

        <cds-list-column>{{ row[1] }}</cds-list-column>

        <cds-list-column>
          Edit
          <ui-icon name="faEdit" size="16" class="icon-gap"></ui-icon>
        </cds-list-column>
      </cds-list-row>
    </cds-structured-list>
  `,
  styleUrls: ['./structured-list.component.scss'],
})
export class UiStructuredListComponent {
  @Input() header: string = ''; // First column header
  @Input() headerIcon: string = ''; // Dynamic icon for the header
  @Input() rows: string[][] = []; // Array of rows for the first and second columns
  @Input() skeleton: boolean = false;

  constructor() {}
}
