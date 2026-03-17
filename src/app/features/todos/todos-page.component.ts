import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { TodoAddFormComponent } from './components/todo-add-form/todo-add-form.component';
import { TodoFiltersPanelComponent } from './components/todo-filters-panel/todo-filters-panel.component';
import { TodoHeroComponent } from './components/todo-hero/todo-hero.component';
import { TodoTaskListComponent } from './components/todo-task-list/todo-task-list.component';
import { TodosFacadeService } from './services/todos-facade.service';
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

  readonly searchDisplayValue = computed(() => this.searchControl.value.trim());

  readonly visibleTodos = computed(() => this.facade.filterTodos(this.searchControl.value));

  readonly resultsSummary = computed(() =>
    this.facade.generateResultsSummary(this.searchControl.value),
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
