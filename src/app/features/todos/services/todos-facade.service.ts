import { computed, inject, signal, Injectable } from '@angular/core';

import { TodosStorageService } from './todos-storage.service';
import { FILTER_LABELS, TodoFilter, TodoItem } from '../todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodosFacadeService {
  private readonly storage = inject(TodosStorageService);

  readonly todos = signal<TodoItem[]>(this.storage.load());
  readonly selectedFilter = signal<TodoFilter>('all');

  readonly totalCount = computed(() => this.todos().length);
  readonly activeCount = computed(() => this.todos().filter((todo) => !todo.completed).length);
  readonly completedCount = computed(() => this.todos().filter((todo) => todo.completed).length);

  filterTodos(searchQuery: string): TodoItem[] {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const activeFilter = this.selectedFilter();

    return this.todos().filter((todo) => {
      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'active'
            ? !todo.completed
            : todo.completed;

      const matchesQuery =
        trimmedQuery.length === 0 || todo.title.toLowerCase().includes(trimmedQuery);

      return matchesFilter && matchesQuery;
    });
  }

  generateResultsSummary(searchValue: string): string {
    const visibleTodos = this.filterTodos(searchValue);
    const itemCount = visibleTodos.length;
    const itemLabel = itemCount === 1 ? 'item' : 'items';
    const viewLabel = FILTER_LABELS[this.selectedFilter()].toLowerCase();
    const trimmedSearch = searchValue.trim();

    if (trimmedSearch.length > 0) {
      return `${itemCount} ${itemLabel} in ${viewLabel} matching "${trimmedSearch}"`;
    }

    return `${itemCount} ${itemLabel} in ${viewLabel}`;
  }

  addTodo(title: string): void {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      return;
    }

    const nextTodo: TodoItem = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date(),
    };

    const updatedTodos = [nextTodo, ...this.todos()];
    this.todos.set(updatedTodos);
    this.storage.persist(updatedTodos);
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
}
