import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';
import { TodoItemPo } from './todo-item.po';

export class TodoTaskListPo {
  constructor(private readonly page: Page) {}

  item(title: string): TodoItemPo {
    return new TodoItemPo(this.page.getByTestId(TestId.todoItem.root).filter({ hasText: title }));
  }

  get emptyHeading() {
    return this.page.getByTestId(TestId.taskList.emptyHeading);
  }
}
