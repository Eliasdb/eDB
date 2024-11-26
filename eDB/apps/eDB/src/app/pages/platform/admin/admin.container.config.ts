import { TableItem } from 'carbon-components-angular';
import { TableColumnConfig } from 'libs/utils/src/lib/forms/models/table.model';
import { UserProfile } from '../../../models/user.model';

export const AdminTableColumnConfig: TableColumnConfig[] = [
  { header: 'ID', sortable: true, sortField: 'id', backendSortField: 'Id' },
  {
    header: 'Name',
    sortable: true,
    sortField: 'Name',
    backendSortField: 'FirstName',
  },
  {
    header: 'Email',
    sortable: true,
    sortField: 'email',
    backendSortField: 'Email',
  },
  {
    header: 'Role',
    sortable: true,
    sortField: 'role',
    backendSortField: 'Role',
  },
  {
    header: 'State/Province',
    sortable: true,
    sortField: 'state',
    backendSortField: 'State',
  },
  { header: '', sortable: false },
];

export function mapUsersToTableData(
  users: UserProfile[],
  overflowTemplate: any
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
