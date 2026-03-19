import type { Meta, StoryObj } from '@storybook/angular';

import { TodoSummaryComponent } from './todo-summary.component';

const meta: Meta<TodoSummaryComponent> = {
  title: 'Todos/Components/Todo Summary',
  component: TodoSummaryComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compact summary rail that displays total, active, and completed task counts for the current workspace state.',
      },
    },
  },
  args: {
    total: 12,
    active: 7,
    completed: 5,
  },
  argTypes: {
    total: {
      control: { type: 'number', min: 0 },
      description: 'Total todo count.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
    active: {
      control: { type: 'number', min: 0 },
      description: 'Active todo count.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
    completed: {
      control: { type: 'number', min: 0 },
      description: 'Completed todo count.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoSummaryComponent>;

export const Balanced: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Representative state with a mix of active and completed work.',
      },
    },
  },
};

export const AllCompleted: Story = {
  args: {
    total: 9,
    active: 0,
    completed: 9,
  },
  parameters: {
    docs: {
      description: {
        story: 'State after all items in the current scope are completed.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    total: 0,
    active: 0,
    completed: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial state before any todos are created.',
      },
    },
  },
};
