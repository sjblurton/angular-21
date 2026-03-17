import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';
import { TodoAddFormPo } from '../components/todo-add-form.po';
import { TodoFiltersPanelPo } from '../components/todo-filters-panel.po';
import { TodoSummaryPo } from '../components/todo-summary.po';
import { TodoTaskListPo } from '../components/todo-task-list.po';

export class TodosPagePo {
  readonly addForm = new TodoAddFormPo(this.page);
  readonly filtersPanel = new TodoFiltersPanelPo(this.page);
  readonly taskList = new TodoTaskListPo(this.page);
  readonly summary = new TodoSummaryPo(this.page);

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  get resultsSummary() {
    return this.page.getByTestId(TestId.todosPage.resultsSummary);
  }

  get resetViewButton() {
    return this.page.getByTestId(TestId.todosPage.resetViewButton);
  }
}
