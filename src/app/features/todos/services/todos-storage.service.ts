import { Injectable } from '@angular/core';

import { TodoItem } from '../todo.model';

export const TODOS_STORAGE_KEY = 'todo-studio.todos';

interface StoredTodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class TodosStorageService {
  load(): TodoItem[] {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((item) => this.deserialize(item))
        .filter((item): item is TodoItem => item !== null);
    } catch {
      return [];
    }
  }

  persist(todos: TodoItem[]): void {
    const serializable: StoredTodoItem[] = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
    }));

    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(serializable));
  }

  private deserialize(value: unknown): TodoItem | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const item = value as Partial<StoredTodoItem>;

    if (
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.completed !== 'boolean' ||
      typeof item.createdAt !== 'string'
    ) {
      return null;
    }

    const createdAt = new Date(item.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return { id: item.id, title: item.title, completed: item.completed, createdAt };
  }
}
