import type { Meta, StoryObj } from '@storybook/angular';

import type { TodoItem } from '../../todo.model';
import { TodoItemComponent } from './todo-item.component';

function createTodo(overrides: Partial<TodoItem> = {}): TodoItem {
  return {
    id: 'todo-01',
    title: 'Review route-level accessibility checks',
    completed: false,
    createdAt: new Date('2026-03-01T09:00:00.000Z'),
    ...overrides,
  };
}

const meta: Meta<TodoItemComponent> = {
  title: 'Todos/Components/Todo Item',
  component: TodoItemComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single task row with completion toggles, relative creation timestamp, and delete action. The component emits intent events for parent-owned state updates.',
      },
    },
  },
  argTypes: {
    toggleRequested: {
      action: 'toggleRequested',
      description: 'Emits the todo id when the completion state is toggled.',
      table: {
        category: 'Outputs',
        type: { summary: 'string' },
      },
    },
    deleteRequested: {
      action: 'deleteRequested',
      description: 'Emits the todo id when the delete action is requested.',
      table: {
        category: 'Outputs',
        type: { summary: 'string' },
      },
    },
    todo: {
      control: false,
      description: 'Todo item data rendered by the row.',
      table: {
        category: 'Inputs',
        type: { summary: 'TodoItem' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoItemComponent>;

export const Active: Story = {
  render: () => ({
    props: {
      todo: createTodo(),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default active task row with unchecked completion controls.',
      },
    },
  },
};

export const Completed: Story = {
  render: () => ({
    props: {
      todo: createTodo({
        id: 'todo-02',
        title: 'Document Storybook coverage',
        completed: true,
        createdAt: new Date('2026-02-25T16:30:00.000Z'),
      }),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Completed variant showing reopened action labels and completed styling.',
      },
    },
  },
};

export const LongTitle: Story = {
  render: () => ({
    props: {
      todo: createTodo({
        id: 'todo-03',
        title:
          'Prepare a concise release retrospective and highlight UX outcomes from accessibility and Storybook improvements',
      }),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Stress case for long task text wrapping and action alignment.',
      },
    },
  },
};
