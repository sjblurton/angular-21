import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';

export class TodoFiltersPanelPo {
  constructor(private readonly page: Page) {}

  get searchInput() {
    return this.page.getByTestId(TestId.filtersPanel.searchInput);
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async setFilter(filter: 'all' | 'active' | 'completed'): Promise<void> {
    const ids: Record<'all' | 'active' | 'completed', string> = {
      all: TestId.filtersPanel.filterAll,
      active: TestId.filtersPanel.filterActive,
      completed: TestId.filtersPanel.filterCompleted,
    };
    await this.page.getByTestId(ids[filter]).click();
  }
}
