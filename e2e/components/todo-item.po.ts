import { type Locator } from '@playwright/test';
import { TestId } from '../support/test-id';

export class TodoItemPo {
  constructor(readonly locator: Locator) {}

  get checkbox() {
    return this.locator.getByTestId(TestId.todoItem.checkbox);
  }

  get meta() {
    return this.locator.getByTestId(TestId.todoItem.meta);
  }

  get stateButton() {
    return this.locator.getByTestId(TestId.todoItem.stateButton);
  }

  get deleteButton() {
    return this.locator.getByTestId(TestId.todoItem.deleteButton);
  }
}
