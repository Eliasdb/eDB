// src/app/components/platform/admin/admin-user-table/user-table.config.ts

import {
  RowMapperConfig,
  TableColumnConfig,
} from '../../../../models/application-overview.model';
import { UserProfile } from '../../../../models/user.model';

/**
 * Column configurations for the User Management table.
 */
export const UserTableColumnConfigs: TableColumnConfig[] = [
  {
    header: 'User Name',
    field: 'userName',
    sortable: true,
  },
  {
    header: 'Email',
    field: 'userEmail',
    sortable: true,
  },
  {
    header: 'Role',
    field: 'role',
    sortable: true,
  },
  {
    header: 'Actions',
    field: 'actions',
    sortable: false,
    isTemplate: true, // Indicates that this column uses a template (e.g., overflow menu)
  },
];

/**
 * Row mapper configurations for the User Management table.
 */
export const UserTableMapperConfigs: RowMapperConfig<UserProfile>[] = [
  {
    field: 'userName',
  },
  {
    field: 'userEmail',
  },
  {
    field: 'role',
  },
  {
    field: 'actions',
    isTemplate: true, // Use template for actions column
  },
];
