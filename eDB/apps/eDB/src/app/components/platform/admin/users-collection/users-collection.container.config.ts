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
  {
    header: 'Actions', // New column for the overflow menu
    field: 'actions',
    sortable: false,
  },
];

// users-table.config.ts

export const USER_ROW_MAPPER_CONFIG: RowMapperConfig<UserProfile>[] = [
  { field: 'id' },
  { field: 'firstName' },
  { field: 'lastName' },
  { field: 'email' },
  { field: 'role' },
  {
    field: 'actions',
    isTemplate: true,
    valueGetter: (row: UserProfile) => {
      // Example: Different menu options based on user role
      if (row.role === 'Admin') {
        return {
          menuOptions: [
            { id: 'view', label: 'View More' },
            { id: 'delete', label: 'Delete User' },
            { id: 'promote', label: 'Promote to Super Admin' },
          ],
        };
      }
      return {
        menuOptions: [
          { id: 'view', label: 'View More' },
          { id: 'delete', label: 'Delete User' },
        ],
      };
    },
  },
];

export const MODAL_CONFIG = {
  deleteUser: (userName: string) => ({
    header: 'Confirm Deletion',
    content: `Are you sure you want to delete the user "${userName}"? This action cannot be undone.`,
  }),
};
