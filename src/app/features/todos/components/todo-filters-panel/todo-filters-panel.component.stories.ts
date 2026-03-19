import { FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';

import type { TodoFilter } from '../../todo.model';
import { TodoFiltersPanelComponent } from './todo-filters-panel.component';

interface TodoFiltersPanelStoryProps {
  searchControl: FormControl<string>;
  selectedFilter: TodoFilter;
}

function createProps(
  selectedFilter: TodoFilter = 'all',
  searchValue = ''
): TodoFiltersPanelStoryProps {
  return {
    selectedFilter,
    searchControl: new FormControl(searchValue, { nonNullable: true }),
  };
}

const meta: Meta<TodoFiltersPanelComponent> = {
  title: 'Todos/Components/Todo Filters Panel',
  component: TodoFiltersPanelComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable filter controls for search and status selection. It emits filter intent while keeping the filter state owned by the container component.',
      },
    },
  },
  argTypes: {
    filterChanged: {
      action: 'filterChanged',
      description: 'Emits when the user changes the status filter.',
      table: {
        category: 'Outputs',
        type: { summary: 'string | null' },
      },
    },
    searchControl: {
      control: false,
      description: 'Reactive form control used for the search text input.',
      table: {
        category: 'Inputs',
        type: { summary: 'FormControl<string>' },
      },
    },
    selectedFilter: {
      control: false,
      description: 'Currently selected status filter.',
      table: {
        category: 'Inputs',
        type: { summary: "'all' | 'active' | 'completed'" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoFiltersPanelComponent>;

export const AllItems: Story = {
  render: () => ({
    props: createProps('all'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default state with no search text and the All status selected.',
      },
    },
  },
};

export const ActiveWithSearch: Story = {
  render: () => ({
    props: createProps('active', 'review'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Active filter selected with a populated search query.',
      },
    },
  },
};

export const CompletedWithSearch: Story = {
  render: () => ({
    props: createProps('completed', 'notes'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Completed filter selected to preview combined filter controls state.',
      },
    },
  },
};
