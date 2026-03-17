import { todoAddFormTestIds } from '../../src/app/features/todos/components/todo-add-form/todo-add-form.test-ids';
import { todoFiltersPanelTestIds } from '../../src/app/features/todos/components/todo-filters-panel/todo-filters-panel.test-ids';
import { todoItemTestIds } from '../../src/app/features/todos/components/todo-item/todo-item.test-ids';
import { todoSummaryTestIds } from '../../src/app/features/todos/components/todo-summary/todo-summary.test-ids';
import { todoTaskListTestIds } from '../../src/app/features/todos/components/todo-task-list/todo-task-list.test-ids';
import { todosPageTestIds } from '../../src/app/features/todos/todos-page.test-ids';

export const TestId = {
  addForm: todoAddFormTestIds,
  filtersPanel: todoFiltersPanelTestIds,
  todoItem: todoItemTestIds,
  taskList: todoTaskListTestIds,
  todoSummary: todoSummaryTestIds,
  todosPage: todosPageTestIds,
} as const;
