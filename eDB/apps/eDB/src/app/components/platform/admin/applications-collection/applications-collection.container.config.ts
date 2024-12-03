// src/app/components/platform/admin/subscriptions-table/subscriptions-table.config.ts

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
    field: 'actions', // Column for the buttons
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
