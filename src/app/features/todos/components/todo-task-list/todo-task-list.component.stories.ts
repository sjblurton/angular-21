import type { Meta, StoryObj } from '@storybook/angular';

import type { TodoItem } from '../../todo.model';
import { TodoTaskListComponent } from './todo-task-list.component';

function createTodo(id: string, title: string, completed: boolean, createdAtIso: string): TodoItem {
  return {
    id,
    title,
    completed,
    createdAt: new Date(createdAtIso),
  };
}

const sampleTodos: TodoItem[] = [
  createTodo(
    'todo-01',
    'Ship Storybook stories for todo components',
    false,
    '2026-03-01T09:00:00.000Z'
  ),
  createTodo('todo-02', 'Review accessibility checklist updates', true, '2026-02-27T12:15:00.000Z'),
  createTodo(
    'todo-03',
    'Refine onboarding copy for filters panel',
    false,
    '2026-03-03T07:45:00.000Z'
  ),
];

const meta: Meta<TodoTaskListComponent> = {
  title: 'Todos/Components/Todo Task List',
  component: TodoTaskListComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'List renderer for todo items. It displays an empty state when no tasks are present and forwards item-level toggle/delete intents to the parent container.',
      },
    },
  },
  argTypes: {
    toggleRequested: {
      action: 'toggleRequested',
      description: 'Emits todo id when a child item requests completion toggle.',
      table: {
        category: 'Outputs',
        type: { summary: 'string' },
      },
    },
    deleteRequested: {
      action: 'deleteRequested',
      description: 'Emits todo id when a child item requests deletion.',
      table: {
        category: 'Outputs',
        type: { summary: 'string' },
      },
    },
    todos: {
      control: false,
      description: 'Ordered set of todos rendered into list items.',
      table: {
        category: 'Inputs',
        type: { summary: 'TodoItem[]' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoTaskListComponent>;

export const Populated: Story = {
  render: () => ({
    props: {
      todos: sampleTodos,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'List with mixed active and completed items.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => ({
    props: {
      todos: [],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Fallback UI displayed when no items match the current view.',
      },
    },
  },
};

export const CompletedOnly: Story = {
  render: () => ({
    props: {
      todos: sampleTodos.filter((todo) => todo.completed),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Filtered list where every item is completed.',
      },
    },
  },
};
