import { type Page } from '@playwright/test';
import { TestId } from '../support/test-id';

export class TodoAddFormPo {
  constructor(private readonly page: Page) {}

  get titleInput() {
    return this.page.getByTestId(TestId.addForm.titleInput);
  }

  get errorRequired() {
    return this.page.getByTestId(TestId.addForm.errorRequired);
  }

  async addTodo(title: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.page.getByTestId(TestId.addForm.submitButton).click();
  }

  async submit(): Promise<void> {
    await this.page.getByTestId(TestId.addForm.submitButton).click();
  }
}
