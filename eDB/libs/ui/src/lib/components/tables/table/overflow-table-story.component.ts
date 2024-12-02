// overflow-table-story.component.ts

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'carbon-components-angular';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular/table';
import { UiPlatformOverflowMenuComponent } from '../../../components/navigation/overflow-menu/overflow-menu.component';
import { UiTableComponent } from './table.component';

@Component({
  selector: 'app-overflow-table-story',
  standalone: true,
  imports: [
    CommonModule,
    UiTableComponent,
    UiPlatformOverflowMenuComponent,
    DialogModule,
    RouterModule,
  ],
  template: `
    <!-- Define the overflow menu template -->
    <ng-template #overflowMenuTemplate let-data="data">
      <ui-platform-overflow-menu
        [menuOptions]="menuOptions"
        icon="faEllipsisV"
        iconSize="1.25rem"
        iconColor="#0070f3"
        (menuOptionSelected)="onMenuOptionSelected($event)"
      ></ui-platform-overflow-menu>
    </ng-template>

    <!-- Render the table with the defined model -->
    <ui-table
      [model]="model"
      [sortable]="sortable"
      [showSelectionColumn]="showSelectionColumn"
      [stickyHeader]="stickyHeader"
      [skeleton]="skeleton"
      [isDataGrid]="isDataGrid"
      [striped]="striped"
    >
    </ui-table>
  `,
})
export class OverflowTableStoryComponent implements AfterViewInit {
  @Input() size = 'md';
  @Input() showSelectionColumn = false;
  @Input() striped = true;
  @Input() isDataGrid = true;
  @Input() sortable = true;
  @Input() stickyHeader = false;
  @Input() skeleton = false;

  @ViewChild('overflowMenuTemplate', { static: true })
  overflowMenuTemplate!: TemplateRef<any>;

  model = new TableModel();

  menuOptions = [
    { id: 'view', label: 'View' },
    { id: 'delete', label: 'Delete' },
  ];

  ngAfterViewInit() {
    // Define table headers
    this.model.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Details' }),
      new TableHeaderItem({ data: 'Actions' }),
    ];

    // Define table data with the overflow menu template
    this.model.data = [
      [
        new TableItem({ data: 'Name 1' }),
        new TableItem({ data: 'Details about Name 1' }),
        new TableItem({
          data: {
            // menuOptions: [
            //   { id: 'edit', label: 'Edit' },
            //   { id: 'delete', label: 'Delete' },
            // ],
          },
          template: this.overflowMenuTemplate,
        }),
      ],
      [
        new TableItem({ data: 'Name 2' }),
        new TableItem({ data: 'Details about Name 2' }),
        new TableItem({
          data: {},
          template: this.overflowMenuTemplate,
        }),
      ],
      // Add more rows as needed
      [
        new TableItem({ data: 'Name 3' }),
        new TableItem({ data: 'Details about Name 3' }),
        new TableItem({
          data: {
            // menuOptions: [
            //   { id: 'share', label: 'Share' },
            //   { id: 'archive', label: 'Archive' },
            // ],
          },
          template: this.overflowMenuTemplate,
        }),
      ],
    ];
  }

  onRowClick(index: number) {
    console.log('Row item selected:', index);
  }

  onMenuOptionSelected(optionId: string) {
    console.log('Menu option selected:', optionId);
    // Implement additional logic based on the selected option
  }
}
