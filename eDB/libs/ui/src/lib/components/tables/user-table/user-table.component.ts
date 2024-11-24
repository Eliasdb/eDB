import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PaginationModule } from 'carbon-components-angular';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from 'carbon-components-angular/table';
import { UiPlatformOverflowMenuComponent } from '../../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginationModule,
    UiPlatformOverflowMenuComponent,
  ],
  template: `
    <cds-table-container>
      <cds-table-header>
        <h4 cdsTableHeaderTitle>{{ title }}</h4>
        <p cdsTableHeaderDescription>{{ description }}</p>
      </cds-table-header>

      <cds-table
        [model]="model"
        [sortable]="sortable"
        [showSelectionColumn]="showSelectionColumn"
        [stickyHeader]="stickyHeader"
        (rowClick)="onRowClick($event)"
        [isDataGrid]="isDataGrid"
      ></cds-table>

      <cds-pagination
        [model]="model"
        (selectPage)="onPageChange($event)"
      ></cds-pagination>
    </cds-table-container>

    <ng-template #overflowTemplate let-user="data">
      <ui-platform-overflow-menu
        [menuOptions]="menuOptions"
        icon="faEllipsisVertical"
        (menuOptionSelected)="onOverflowMenuSelect($event, user)"
      ></ui-platform-overflow-menu>
    </ng-template>
  `,
})
export class UiTableComponent implements OnInit {
  @Input() title = 'Table Title';
  @Input() description = 'Table description goes here.';
  @Input() sortable = true;
  @Input() showSelectionColumn = true;
  @Input() stickyHeader = false;
  @Input() pageLength = 10;
  @Input() users: any[] = [];
  @Input() totalDataLength = 0;
  @Input() isDataGrid = false;

  @Output() rowDeleted = new EventEmitter<number>();
  @Output() roleChanged = new EventEmitter<{ id: number; newRole: string }>();

  @ViewChild('overflowTemplate', { static: true })
  overflowTemplate!: TemplateRef<any>;

  model = new TableModel();

  menuOptions = [
    { id: 'delete', label: 'Delete' },
    { id: 'changeRole', label: 'Change Role' },
  ];

  ngOnInit(): void {
    this.initializeTableModel();
    this.loadPageData(1);
  }

  initializeTableModel(): void {
    this.model.pageLength = this.pageLength;
    this.model.totalDataLength = this.totalDataLength;
    this.model.header = [
      new TableHeaderItem({ data: 'Name', sortable: this.sortable }),
      new TableHeaderItem({ data: 'Email', sortable: this.sortable }),
      new TableHeaderItem({ data: 'Country', sortable: this.sortable }),
      new TableHeaderItem({ data: 'Role', sortable: this.sortable }),
      new TableHeaderItem({ data: '', sortable: false }),
    ];
  }

  loadPageData(page: number): void {
    const start = (page - 1) * this.pageLength;
    const end = start + this.pageLength;
    const pageData = this.users.slice(start, end);
    this.model.data = this.prepareData(pageData);
    this.model.currentPage = page;
  }

  onPageChange(page: number): void {
    this.loadPageData(page);
  }

  onRowClick(index: number): void {
    console.log('Row clicked:', this.model.data[index]);
  }

  onOverflowMenuSelect(actionId: string, user: any): void {
    if (actionId === 'delete') {
      this.rowDeleted.emit(user.id);
    } else if (actionId === 'changeRole') {
      const newRole = prompt(
        'Enter new role (User, Admin, PremiumUser):',
        user.role
      );
      if (newRole) {
        this.roleChanged.emit({ id: user.id, newRole });
      }
    }
  }

  prepareData(users: any[]): TableItem[][] {
    return users.map((user) => [
      new TableItem({ data: `${user.firstName} ${user.lastName}` }),
      new TableItem({ data: user.email }),
      new TableItem({ data: user.country }),
      new TableItem({ data: user.role }),
      new TableItem({ data: user, template: this.overflowTemplate }),
    ]);
  }
}
