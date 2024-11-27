// src/app/components/platform/admin/admin.container.config.ts

import { TemplateRef } from '@angular/core';
import { TableItem } from 'carbon-components-angular';
import { TableColumnConfig } from 'libs/utils/src/lib/forms/models/table.model';
import { UserProfile } from '../../../models/user.model';

export const AdminTableColumnConfig: TableColumnConfig[] = [
  {
    header: 'ID',
    sortable: true,
    sortField: 'id',
    field: 'id',
  },
  {
    header: 'Name',
    sortable: true,
    sortField: 'name', // Frontend sortField
    field: 'name', // Adjust field name based on UserProfile
  },
  {
    header: 'Email',
    sortable: true,
    sortField: 'email',
    field: 'email',
  },
  {
    header: 'Role',
    sortable: true,
    sortField: 'role',
    field: 'role',
  },
  {
    header: 'State/Province',
    sortable: true,
    sortField: 'state',
    field: 'state',
  },
  { header: '', sortable: false, field: 'actions' },
];

export function mapUsersToTableData(
  users: UserProfile[],
  overflowTemplate: TemplateRef<any>
): TableItem[][] {
  return users.map((user) => [
    new TableItem({ data: user.id }),
    new TableItem({ data: `${user.firstName} ${user.lastName}` }),
    new TableItem({ data: user.email }),
    new TableItem({ data: user.role }),
    new TableItem({ data: user.state }),
    new TableItem({ data: user, template: overflowTemplate }),
  ]);
}
