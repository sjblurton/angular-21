import { test, expect } from '@playwright/test';
import { TodosPagePo } from './pages/todos-page.po';

test.beforeEach(async ({ page }) => {
  // Navigate first, then clear storage and reload so the app boots with an empty state.
  // Using page.evaluate (not addInitScript) so only the *initial* load is cleaned -
  // subsequent page.reload() calls within a test keep storage intact.
  await new TodosPagePo(page).goto();
});

test.describe('Todo page', () => {
  test('should show the page heading and empty state on first load', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await expect(
      page.getByRole('heading', { name: 'Task workspace for focused execution.' }),
    ).toBeVisible();
    await expect(todosPage.taskList.emptyHeading).toBeVisible();
    await expect(todosPage.resultsSummary).toHaveText('0 items in all items');
  });

  test('should add a new todo and display it in the list', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Write the release notes');

    await expect(todosPage.taskList.item('Write the release notes').locator).toBeVisible();
    await expect(todosPage.resultsSummary).toHaveText('1 item in all items');
  });

  test('should show validation error when submitting an empty input', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.submit();

    await expect(todosPage.addForm.errorRequired).toBeVisible();
  });

  test('should show validation error when submitting whitespace only', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.titleInput.fill('   ');
    await todosPage.addForm.submit();

    await expect(todosPage.addForm.errorRequired).toBeVisible();
  });

  test('should mark a todo as complete using the checkbox', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Review the design tokens');
    const item = todosPage.taskList.item('Review the design tokens');
    await item.checkbox.click();

    await expect(item.meta).toContainText('Completed');
  });

  test('should mark a todo as complete using the Complete button', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Audit the component library');
    const item = todosPage.taskList.item('Audit the component library');
    await item.stateButton.click();

    await expect(item.stateButton).toContainText('Reopen');
  });

  test('should reopen a completed todo', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Finalise the sprint board');
    const item = todosPage.taskList.item('Finalise the sprint board');
    await item.stateButton.click();
    await item.stateButton.click();

    await expect(item.stateButton).toContainText('Complete');
  });

  test('should delete a todo', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Remove the legacy flag');
    const item = todosPage.taskList.item('Remove the legacy flag');
    await item.deleteButton.click();

    await expect(item.locator).not.toBeVisible();
    await expect(todosPage.taskList.emptyHeading).toBeVisible();
  });

  test('should filter to show only active todos', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Active task');
    await todosPage.addForm.addTodo('Completed task');
    await todosPage.taskList.item('Completed task').stateButton.click();

    await todosPage.filtersPanel.setFilter('active');

    await expect(todosPage.taskList.item('Active task').locator).toBeVisible();
    await expect(todosPage.taskList.item('Completed task').locator).not.toBeVisible();
    await expect(todosPage.resultsSummary).toHaveText('1 item in active items');
  });

  test('should filter to show only completed todos', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Active task');
    await todosPage.addForm.addTodo('Completed task');
    await todosPage.taskList.item('Completed task').stateButton.click();

    await todosPage.filtersPanel.setFilter('completed');

    await expect(todosPage.taskList.item('Completed task').locator).toBeVisible();
    await expect(todosPage.taskList.item('Active task').locator).not.toBeVisible();
    await expect(todosPage.resultsSummary).toHaveText('1 item in completed items');
  });

  test('should search for a todo by title', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Update the changelog');
    await todosPage.addForm.addTodo('Schedule the retro');
    await todosPage.filtersPanel.search('changelog');

    await expect(todosPage.taskList.item('Update the changelog').locator).toBeVisible();
    await expect(todosPage.taskList.item('Schedule the retro').locator).not.toBeVisible();
    await expect(todosPage.resultsSummary).toContainText('matching "changelog"');
  });

  test('should show the empty state when search matches nothing', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Only one task here');
    await todosPage.filtersPanel.search('nonexistent');

    await expect(todosPage.taskList.emptyHeading).toBeVisible();
  });

  test('should show and use the Reset view button', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('Task one');
    await todosPage.addForm.addTodo('Task two');
    await todosPage.filtersPanel.search('one');

    await expect(todosPage.resetViewButton).toBeVisible();
    await todosPage.resetViewButton.click();

    await expect(todosPage.filtersPanel.searchInput).toHaveValue('');
    await expect(todosPage.taskList.item('Task one').locator).toBeVisible();
    await expect(todosPage.taskList.item('Task two').locator).toBeVisible();
    await expect(todosPage.resetViewButton).not.toBeVisible();
  });

  test('should persist todos across page reloads', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('This should survive a reload');
    await page.reload();

    await expect(todosPage.taskList.item('This should survive a reload').locator).toBeVisible();
  });

  test('should update summary counts correctly', async ({ page }) => {
    const todosPage = new TodosPagePo(page);

    await todosPage.addForm.addTodo('First');
    await todosPage.addForm.addTodo('Second');
    await todosPage.addForm.addTodo('Third');

    await expect(todosPage.resultsSummary).toHaveText('3 items in all items');

    await todosPage.taskList.item('First').stateButton.click();

    await expect(todosPage.summary.totalValue).toHaveText('3');
    await expect(todosPage.summary.activeValue).toHaveText('2');
    await expect(todosPage.summary.completedValue).toHaveText('1');
  });
});
