import { TableHeaderItem, TableItem } from 'carbon-components-angular/table';
import { Application } from '../../../types/application-overview.type';
import { ExpandedDataConfig } from '../../../types/user.type';

export const APPLICATION_TABLE_CONFIG: ExpandedDataConfig<Application> = {
  headers: [
    new TableHeaderItem({ data: 'Application Name', sortable: false }),
    new TableHeaderItem({ data: 'Description', sortable: false }),
    new TableHeaderItem({ data: 'Route', sortable: false }),
    new TableHeaderItem({ data: 'Tags', sortable: false }),
    new TableHeaderItem({ data: 'Subscribers', sortable: false }),
    new TableHeaderItem({ data: 'Actions', sortable: false }),
  ],
  rowMapper: (application: Application, context?: Record<string, unknown>) => [
    new TableItem({ data: application.name }),
    new TableItem({ data: application.description }),
    new TableItem({ data: application.routePath }),
    new TableItem({ data: application.tags?.join(', ') || '—' }),
    new TableItem({ data: application.subscriberCount }),
    new TableItem({
      data: { application },
      template: context?.['nonExpandedActionTemplate'], // Use non-expanded action template
    }),
  ],
  expandedDataMapper: (app: Application) => {
    return [
      [
        new TableItem({ data: 'Identity ID' }),
        new TableItem({ data: 'Email' }),
        new TableItem({ data: 'Subscription Date' }),
      ],
      ...app.subscribedUsers.map((user) => [
        new TableItem({ data: user.userName }),
        new TableItem({ data: user.userEmail || '—' }),
        new TableItem({
          data: new Date(user.subscriptionDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        }),
      ]),
    ];
  },
};

export const MODAL_CONFIG = {
  addApplication: {
    header: 'Add Application',
    hasForm: true,
  },
  deleteApplication: (applicationName: string) => ({
    header: 'Confirm Deletion',
    content: `Are you sure you want to delete the application "${applicationName}"? This action cannot be undone.`,
  }),
  editApplication: (application: Application) => ({
    header: 'Edit Application',
    hasForm: true,
    formData: {
      name: application.name,
      description: application.description,
      iconUrl: application.iconUrl,
      routePath: application.routePath,
      tags: application.tags?.join(', '),
    },
  }),
};

export const OVERFLOW_MENU_CONFIG = [
  { id: 'edit', label: 'Edit Application' },
  { id: 'delete', label: 'Delete Application' },
];
