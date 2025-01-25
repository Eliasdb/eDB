import { TableHeaderItem, TableItem } from 'carbon-components-angular/table';
import { Application } from '../../types/application-overview.model';
import { ExpandedDataConfig } from '../../types/user.model';

export const APPLICATION_TABLE_CONFIG: ExpandedDataConfig<Application> = {
  headers: [
    new TableHeaderItem({ data: 'Application Name', sortable: false }),
    new TableHeaderItem({ data: 'Description', sortable: false }),
    new TableHeaderItem({ data: 'Subscribers', sortable: false }),
    new TableHeaderItem({ data: 'Actions', sortable: false }),
  ],
  rowMapper: (application: Application, context?: { [key: string]: any }) => [
    new TableItem({ data: application.applicationName }),
    new TableItem({ data: application.applicationDescription }),
    new TableItem({ data: application.subscriberCount }),
    new TableItem({
      data: { application },
      template: context?.['nonExpandedActionTemplate'], // Use non-expanded action template
    }),
  ],
  expandedDataMapper: (app: Application, context?: { [key: string]: any }) => {
    const actionTemplate = context?.['expandedActionTemplate'];

    return [
      [
        new TableItem({ data: 'ID' }),
        new TableItem({ data: 'User Name' }),
        new TableItem({ data: 'Subscription Date' }),
        new TableItem({ data: 'Actions' }),
      ],
      ...app.subscribedUsers.map((user) => [
        new TableItem({ data: user.userId }),
        new TableItem({ data: user.userName }),
        new TableItem({
          data: new Date(user.subscriptionDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        }),
        new TableItem({
          data: { userId: user.userId, applicationId: app.applicationId },
          template: actionTemplate, // Use expanded action template
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
  revokeAccess: (userId: number, applicationId: number) => ({
    header: 'Confirm Revocation',
    content: `Are you sure you want to revoke access for User ID: ${userId} from Application ID: ${applicationId}? This action cannot be undone.`,
  }),
  deleteApplication: (applicationName: string) => ({
    header: 'Confirm Deletion',
    content: `Are you sure you want to delete the application "${applicationName}"? This action cannot be undone.`,
  }),
  editApplication: (application: Application) => ({
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

export const OVERFLOW_MENU_CONFIG = [
  { id: 'edit', label: 'Edit Application' },
  { id: 'delete', label: 'Delete Application' },
];
