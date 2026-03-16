import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { startWith } from 'rxjs';

import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodosStorageService } from './services/todos-storage.service';
import { FILTER_LABELS, TodoFilter, TodoItem } from './todo.model';
import { trimmedRequiredValidator } from './validators/trimmed-required.validator';

@Component({
  selector: 'app-todos-page',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    TodoItemComponent,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  private readonly storage = inject(TodosStorageService);

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

  readonly selectedFilter = signal<TodoFilter>('all');
  readonly todos = signal<TodoItem[]>(this.storage.load());
  readonly totalCount = computed(() => this.todos().length);
  readonly activeCount = computed(() => this.todos().filter((todo) => !todo.completed).length);
  readonly completedCount = computed(() => this.todos().filter((todo) => todo.completed).length);

  private readonly rawSearchValue = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: this.searchControl.value },
  );

  readonly searchQuery = computed(() => this.rawSearchValue().trim().toLowerCase());
  readonly searchDisplayValue = computed(() => this.rawSearchValue().trim());

  readonly visibleTodos = computed(() => {
    const activeFilter = this.selectedFilter();
    const query = this.searchQuery();

    return this.todos().filter((todo) => {
      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'active'
            ? !todo.completed
            : todo.completed;

      const matchesQuery = query.length === 0 || todo.title.toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });
  });

  readonly resultsSummary = computed(() => {
    const itemCount = this.visibleTodos().length;
    const itemLabel = itemCount === 1 ? 'item' : 'items';
    const viewLabel = FILTER_LABELS[this.selectedFilter()].toLowerCase();
    const searchValue = this.searchDisplayValue();

    if (searchValue.length > 0) {
      return `${itemCount} ${itemLabel} in ${viewLabel} matching "${searchValue}"`;
    }

    return `${itemCount} ${itemLabel} in ${viewLabel}`;
  });

  addTodo(): void {
    if (this.addTodoForm.invalid) {
      this.addTodoControl.markAsTouched();
      return;
    }

    const title = this.addTodoControl.value.trim();
    const nextTodo: TodoItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    const updatedTodos = [nextTodo, ...this.todos()];
    this.todos.set(updatedTodos);
    this.storage.persist(updatedTodos);
    this.addTodoForm.reset({ title: '' });
  }

  toggleTodo(todoId: string): void {
    const updatedTodos = this.todos().map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    );

    this.todos.set(updatedTodos);
    this.storage.persist(updatedTodos);
  }

  deleteTodo(todoId: string): void {
    const updatedTodos = this.todos().filter((todo) => todo.id !== todoId);

    this.todos.set(updatedTodos);
    this.storage.persist(updatedTodos);
  }

  setFilter(filter: string | null): void {
    if (filter === 'all' || filter === 'active' || filter === 'completed') {
      this.selectedFilter.set(filter);
    }
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedFilter.set('all');
  }
}
