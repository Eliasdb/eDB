import { TableItem } from 'carbon-components-angular/table';
import {
  ApplicationOverviewDto,
  RowMapperConfig,
  TableColumnConfig,
} from '../../../../models/application-overview.model';

/**
 * Column configurations for the Subscriptions table.
 */
export const SubscriptionsTableColumnConfigs: TableColumnConfig[] = [
  {
    header: 'Application Name',
    field: 'applicationName',
    sortable: false,
  },
  {
    header: 'Description',
    field: 'applicationDescription',
    sortable: false,
  },
  {
    header: 'Subscribers',
    field: 'subscriberCount',
    sortable: false,
  },
  {
    header: 'Actions',
    field: 'actions',
    sortable: false,
  },
];

/**
 * Factory function to create row mapper configurations for the Subscriptions table.
 * @param getExpandedData Function to generate expanded data for a given application.
 * @returns Array of RowMapperConfig for ApplicationOverviewDto.
 */
export const getSubscriptionsTableMapperConfigs = (
  getExpandedData: (app: ApplicationOverviewDto) => TableItem[][]
): RowMapperConfig<ApplicationOverviewDto>[] => [
  {
    field: 'applicationName',
    isExpandable: true,
    getExpandedData: getExpandedData,
  },
  {
    field: 'applicationDescription',
  },
  {
    field: 'subscriberCount',
  },
  {
    field: 'userId',
    isTemplate: true,
  },
];

/**
 * Modal configuration helper functions for the Subscriptions table.
 */
export const modalConfigs = {
  addApplication: {
    header: 'Add Application',
    hasForm: true,
  },
  revokeAccess: (userId: number, applicationId: number) => ({
    header: 'Confirm Revocation',
    content: `Are you sure you want to revoke access for User ID: ${userId} from Application ID: ${applicationId}? This action cannot be undone.`,
  }),
  deleteApplication: (applicationName: string) => ({
    header: 'Confirm Deletion',
    content: `Are you sure you want to delete the application "${applicationName}"? This action cannot be undone.`,
  }),
  editApplication: (application: any) => ({
    header: 'Edit Application',
    hasForm: true,
    formData: {
      name: application.applicationName,
      description: application.applicationDescription,
      iconUrl: application.applicationIconUrl,
      routePath: application.applicationRoutePath,
      tags: application.applicationTags?.join(', '),
    },
  }),
};
