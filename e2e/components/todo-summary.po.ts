import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';

export class TodoSummaryPo {
  constructor(private readonly page: Page) {}

  get totalValue() {
    return this.page.getByTestId(TestId.todoSummary.totalValue);
  }

  get activeValue() {
    return this.page.getByTestId(TestId.todoSummary.activeValue);
  }

  get completedValue() {
    return this.page.getByTestId(TestId.todoSummary.completedValue);
  }
}
