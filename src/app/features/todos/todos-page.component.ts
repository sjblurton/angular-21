import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { startWith } from 'rxjs';

import { TodoAddFormComponent } from './components/todo-add-form/todo-add-form.component';
import { TodoFiltersPanelComponent } from './components/todo-filters-panel/todo-filters-panel.component';
import { TodoHeroComponent } from './components/todo-hero/todo-hero.component';
import { TodoTaskListComponent } from './components/todo-task-list/todo-task-list.component';
import { TodosFacadeService } from './services/todos-facade.service';
import { todosPageTestIds } from './todos-page.test-ids';
import { trimmedRequiredValidator } from './validators/trimmed-required.validator';

@Component({
  selector: 'app-todos-page',
  imports: [
    MatButtonModule,
    TodoAddFormComponent,
    TodoFiltersPanelComponent,
    TodoHeroComponent,
    TodoTaskListComponent,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  protected readonly testIds = todosPageTestIds;

  private readonly facade = inject(TodosFacadeService);

  // Form setup (UI-specific, stays in component)
  readonly addTodoControl = new FormControl('', {
    nonNullable: true,
    validators: [trimmedRequiredValidator, Validators.maxLength(120)],
  });

  readonly addTodoForm = new FormGroup({
    title: this.addTodoControl,
  });

  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly todos = this.facade.todos;
  readonly totalCount = this.facade.totalCount;
  readonly activeCount = this.facade.activeCount;
  readonly completedCount = this.facade.completedCount;
  readonly selectedFilter = this.facade.selectedFilter;

  private readonly rawSearchValue = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: this.searchControl.value },
  );

  readonly searchDisplayValue = computed(() => this.rawSearchValue().trim());

  readonly visibleTodos = computed(() => this.facade.filterTodos(this.rawSearchValue()));

  readonly resultsSummary = computed(() =>
    this.facade.generateResultsSummary(this.rawSearchValue()),
  );

  addTodo(): void {
    if (this.addTodoForm.invalid) {
      this.addTodoControl.markAsTouched();
      return;
    }

    this.facade.addTodo(this.addTodoControl.value);
    this.addTodoForm.reset({ title: '' });
  }

  toggleTodo(todoId: string): void {
    this.facade.toggleTodo(todoId);
  }

  deleteTodo(todoId: string): void {
    this.facade.deleteTodo(todoId);
  }

  setFilter(filter: string | null): void {
    this.facade.setFilter(filter);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.facade.setFilter('all');
  }
}
