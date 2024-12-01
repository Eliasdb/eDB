// users-table.config.ts
import {
  RowMapperConfig,
  TableColumnConfig,
} from '../../../../models/application-overview.model';
import { UserProfile } from '../../../../models/user.model';

export const USER_TABLE_COLUMNS: TableColumnConfig[] = [
  { header: 'ID', field: 'id', sortField: 'id', sortable: true },
  {
    header: 'First Name',
    field: 'firstName',
    sortField: 'firstname',
    sortable: true,
  },
  {
    header: 'Last Name',
    field: 'lastName',
    sortField: 'lastname',
    sortable: true,
  },
  { header: 'Email', field: 'email', sortField: 'email', sortable: true },
  { header: 'Role', field: 'role', sortField: 'role', sortable: true },
];

export const USER_ROW_MAPPER_CONFIG: RowMapperConfig<UserProfile>[] = [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  { field: 'email' },
  { field: 'role' },
];
