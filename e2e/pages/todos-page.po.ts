import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';
import { TodoAddFormPo } from '../components/todo-add-form.po';
import { TodoFiltersPanelPo } from '../components/todo-filters-panel.po';
import { TodoSummaryPo } from '../components/todo-summary.po';
import { TodoTaskListPo } from '../components/todo-task-list.po';

export class TodosPagePo {
  readonly addForm: TodoAddFormPo;
  readonly filtersPanel: TodoFiltersPanelPo;
  readonly taskList: TodoTaskListPo;
  readonly summary: TodoSummaryPo;

  constructor(private readonly page: Page) {
    this.addForm = new TodoAddFormPo(this.page);
    this.filtersPanel = new TodoFiltersPanelPo(this.page);
    this.taskList = new TodoTaskListPo(this.page);
    this.summary = new TodoSummaryPo(this.page);
  }

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
