import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DynamicIconComponent } from './icon.component';

const meta: Meta<DynamicIconComponent> = {
  title: 'UI/Icons/DynamicIcon',
  component: DynamicIconComponent,
  decorators: [
    moduleMetadata({
      imports: [FontAwesomeModule],
    }),
  ],
  argTypes: {
    name: {
      control: 'text',
      description:
        'Name of the FontAwesome icon (e.g., "faPlus", "faTrash", "faSync").',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<DynamicIconComponent>;

export const AddIcon: Story = {
  args: {
    name: 'faPlus',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faPlus" icon, typically used for adding new items.',
      },
    },
  },
};

export const DeleteIcon: Story = {
  args: {
    name: 'faTrash',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faTrash" icon, typically used for removing items.',
      },
    },
  },
};

export const UpdateIcon: Story = {
  args: {
    name: 'faSync',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faSync" icon, typically used for refreshing or updating items.',
      },
    },
  },
};

export const HomeIcon: Story = {
  args: {
    name: 'faHome',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the "faHome" icon, typically used for navigation.',
      },
    },
  },
};

export const EditIcon: Story = {
  args: {
    name: 'faEdit',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faEdit" icon, typically used for modifying items.',
      },
    },
  },
};

export const SearchIcon: Story = {
  args: {
    name: 'faSearch',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faSearch" icon, typically used for finding items.',
      },
    },
  },
};

export const SaveIcon: Story = {
  args: {
    name: 'faSave',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the "faSave" icon, typically used for saving changes.',
      },
    },
  },
};

export const SettingsIcon: Story = {
  args: {
    name: 'faCog',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faCog" icon, typically used for configuration or settings.',
      },
    },
  },
};

export const BreadcrumbsIcon: Story = {
  args: {
    name: 'faChevronRight',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faChevronRight" icon, typically used as a breadcrumb separator.',
      },
    },
  },
};

export const CloseIcon: Story = {
  args: {
    name: 'faTimes',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faTimes" icon, typically used for closing dialogs or modals.',
      },
    },
  },
};

export const CustomSpinnerIcon: Story = {
  args: {
    name: 'faCog', // FontAwesome gear icon
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays a spinning "faCog" icon using a custom `custom-spin` animation.',
      },
    },
  },
};

export const StaticIcon: Story = {
  args: {
    name: 'faCoffee',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a static "faCoffee" icon without any animations.',
      },
    },
  },
};
