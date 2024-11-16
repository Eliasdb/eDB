import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { IconComponent } from './icon.component';

const meta: Meta<IconComponent> = {
  title: 'UI/Icon',
  component: IconComponent,
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
    size: {
      control: 'text',
      description: 'CSS size for the icon (e.g., "2em", "24px").',
      table: {
        type: { summary: 'string' },
      },
    },
    color: {
      control: 'color',
      description: 'The color of the icon.',
      table: {
        type: { summary: 'string' },
      },
    },
    border: {
      control: 'boolean',
      description: 'Whether the icon should have a border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fixedWidth: {
      control: 'boolean',
      description: 'Whether the icon should have a fixed width for alignment.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<IconComponent>;

// Basic Icons
export const AddIcon: Story = {
  args: {
    name: 'faPlus',
    size: '1em',
    color: 'black',
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
    color: 'red',
    size: '1em',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faTrash" icon with red color, typically used for removing items.',
      },
    },
  },
};

export const HomeIcon: Story = {
  args: {
    name: 'faHome',
    size: '1em',
    color: 'blue',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faHome" icon with blue color and size of 2em, typically used for navigation.',
      },
    },
  },
};

// Advanced Use Cases
export const BorderedIcon: Story = {
  args: {
    name: 'faCircle',
    border: true,
    size: '1em',
    color: 'black',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faCircle" icon with a black border and size of 4em.',
      },
    },
  },
};

export const FixedWidthIcon: Story = {
  args: {
    name: 'faSave',
    fixedWidth: true,
    size: '1em',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faSave" icon with a fixed width for alignment and size of 2em.',
      },
    },
  },
};

// Showcase of Fixed Width
export const FixedWidthIcons: Story = {
  args: {
    fixedWidth: true,
    color: 'black',
  },
  render: (args) => ({
    template: `
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <app-icon name="faSquare" [fixedWidth]="fixedWidth" [color]="color"></app-icon>
          <span>Square Icon</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <app-icon name="faArrowRight" [fixedWidth]="fixedWidth" [color]="color"></app-icon>
          <span>Arrow Icon</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <app-icon name="faCoffee" [fixedWidth]="fixedWidth" [color]="color"></app-icon>
          <span>Coffee Icon</span>
        </div>
      </div>
    `,
    props: args,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Displays a list of icons with and without fixed width. When `fixedWidth` is enabled, the icons are aligned neatly.',
      },
    },
  },
};

export const EditIcon: Story = {
  args: {
    name: 'faEdit',
    size: '1em',
    color: 'orange',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faEdit" icon, typically used for editing or modifying items.',
      },
    },
  },
};

export const SaveIcon: Story = {
  args: {
    name: 'faSave',
    size: '1em',
    color: 'green',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays the "faSave" icon, typically used for saving changes.',
      },
    },
  },
};

export const SearchIcon: Story = {
  args: {
    name: 'faSearch',
    size: '1em',
    color: 'gray',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faSearch" icon, typically used for search actions.',
      },
    },
  },
};

export const SettingsIcon: Story = {
  args: {
    name: 'faCog',
    size: '1em',
    color: 'purple',
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

export const CloseIcon: Story = {
  args: {
    name: 'faTimes',
    size: '1em',
    color: 'black',
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

export const BreadcrumbsIcon: Story = {
  args: {
    name: 'faChevronRight',
    size: '1em',
    color: 'black',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faChevronRight" icon, typically used for breadcrumb separators.',
      },
    },
  },
};

export const RefreshIcon: Story = {
  args: {
    name: 'faSync',
    size: '1em',
    color: 'blue',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the "faSync" icon, typically used for refreshing or updating content.',
      },
    },
  },
};
