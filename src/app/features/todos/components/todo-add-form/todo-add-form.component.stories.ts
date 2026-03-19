import { FormControl, FormGroup, Validators } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';

import { trimmedRequiredValidator } from '../../validators/trimmed-required.validator';
import { TodoAddFormComponent } from './todo-add-form.component';

type TodoTitleFormGroup = FormGroup<{
  title: FormControl<string>;
}>;

interface TodoAddFormStoryProps {
  addTodoForm: TodoTitleFormGroup;
  titleControl: FormControl<string>;
}

function createProps(titleValue = '', markTouched = false): TodoAddFormStoryProps {
  const titleControl = new FormControl(titleValue, {
    nonNullable: true,
    validators: [trimmedRequiredValidator, Validators.maxLength(120)],
  });

  if (markTouched) {
    titleControl.markAsTouched();
    titleControl.updateValueAndValidity();
  }

  return {
    titleControl,
    addTodoForm: new FormGroup({
      title: titleControl,
    }),
  };
}

const meta: Meta<TodoAddFormComponent> = {
  title: 'Todos/Components/Todo Add Form',
  component: TodoAddFormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable, presentational add form used by the Todos page. It renders the title field, character count, and validation messages while delegating submit handling to the parent via an output event.',
      },
    },
  },
  argTypes: {
    addRequested: {
      action: 'addRequested',
      description: 'Emits when the user submits the form.',
      table: {
        category: 'Outputs',
        type: { summary: 'void' },
      },
    },
    addTodoForm: {
      control: false,
      description: 'Reactive form group containing the `title` control.',
      table: {
        category: 'Inputs',
        type: { summary: 'FormGroup<{ title: FormControl<string> }>' },
      },
    },
    titleControl: {
      control: false,
      description: 'Title control used to show hint and validation state.',
      table: {
        category: 'Inputs',
        type: { summary: 'FormControl<string>' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<TodoAddFormComponent>;

export const Empty: Story = {
  render: () => ({
    props: createProps(),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default idle state with an empty title field and no validation errors shown.',
      },
    },
  },
};

export const Filled: Story = {
  render: () => ({
    props: createProps('Review release notes'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Represents a typical in-progress entry before submit.',
      },
    },
  },
};

export const RequiredError: Story = {
  render: () => ({
    props: createProps('   ', true),
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Validation state when the control is touched and only whitespace is entered (trimmedRequired).',
      },
    },
  },
};

export const MaxLengthError: Story = {
  render: () => ({
    props: createProps('x'.repeat(121), true),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Validation state when the title exceeds the 120 character limit.',
      },
    },
  },
};
