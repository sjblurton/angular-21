import type { Meta, StoryObj } from '@storybook/angular';

import { TodoHeroComponent } from './todo-hero.component';

const meta: Meta<TodoHeroComponent> = {
  title: 'Todos/Components/Todo Hero',
  component: TodoHeroComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero shell for the Todos page. It presents heading content, summary metrics, and projected content for workspace controls.',
      },
    },
  },
  argTypes: {
    total: {
      control: { type: 'number', min: 0 },
      description: 'Total number of todo items.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
    active: {
      control: { type: 'number', min: 0 },
      description: 'Count of active (not completed) todo items.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
    completed: {
      control: { type: 'number', min: 0 },
      description: 'Count of completed todo items.',
      table: {
        category: 'Inputs',
        type: { summary: 'number' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoHeroComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
  }),
  args: {
    total: 12,
    active: 7,
    completed: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default hero composition with projected workspace panel content.',
      },
    },
  },
};

export const CompletionHeavy: Story = {
  render: (args) => ({
    props: args,
  }),
  args: {
    total: 18,
    active: 3,
    completed: 15,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero metrics for a near-complete list with most work closed out.',
      },
    },
  },
};
