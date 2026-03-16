import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { startWith } from 'rxjs';

import { TodoItemComponent } from './todo-item.component';
import { TodoFilter, TodoItem } from './todo.model';

const FILTER_LABELS: Record<TodoFilter, string> = {
  all: 'All items',
  active: 'Active items',
  completed: 'Completed items',
};

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 1,
    title: 'Sketch the onboarding headline hierarchy',
    completed: false,
    createdLabel: '9:10 AM',
  },
  {
    id: 2,
    title: 'Prototype the moodboard footer interactions',
    completed: false,
    createdLabel: '10:25 AM',
  },
  {
    id: 3,
    title: 'Share the launch checklist with the product team',
    completed: true,
    createdLabel: 'Yesterday',
  },
  {
    id: 4,
    title: 'Tighten the accessibility notes for form controls',
    completed: false,
    createdLabel: 'Yesterday',
  },
];

function trimmedRequiredValidator(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { trimmedRequired: true };
}

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
  readonly todos = signal<TodoItem[]>(INITIAL_TODOS);
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

  private nextId = INITIAL_TODOS.length + 1;
  private readonly timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  addTodo(): void {
    if (this.addTodoForm.invalid) {
      this.addTodoControl.markAsTouched();
      return;
    }

    const title = this.addTodoControl.value.trim();
    const nextTodo: TodoItem = {
      id: this.nextId,
      title,
      completed: false,
      createdLabel: this.timeFormatter.format(new Date()),
    };

    this.nextId += 1;
    this.todos.update((items) => [nextTodo, ...items]);
    this.addTodoForm.reset({ title: '' });
    this.addTodoControl.markAsPristine();
    this.addTodoControl.markAsUntouched();
  }

  toggleTodo(todoId: number): void {
    this.todos.update((items) =>
      items.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
    );
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
