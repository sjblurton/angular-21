import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TodoItem } from '../../todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { todoTaskListTestIds } from './todo-task-list.test-ids';

@Component({
  selector: 'app-todo-task-list',
  imports: [MatIconModule, TodoItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-task-list.component.html',
  styleUrl: './todo-task-list.component.css',
})
export class TodoTaskListComponent {
  protected readonly testIds = todoTaskListTestIds;

  readonly todos = input.required<TodoItem[]>();
  readonly toggleRequested = output<string>();
  readonly deleteRequested = output<string>();

  requestToggle(todoId: string): void {
    this.toggleRequested.emit(todoId);
  }

  requestDelete(todoId: string): void {
    this.deleteRequested.emit(todoId);
  }
}
