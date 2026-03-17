import { TestBed } from '@angular/core/testing';

import { TodosFacadeService } from './todos-facade.service';
import { TODOS_STORAGE_KEY } from './todos-storage.service';
import { TodoItem } from '../todo.model';

interface StoredTodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

describe('TodosFacadeService', () => {
  const storedTodos: TodoItem[] = [
    {
      id: 'todo-1',
      title: 'First task',
      completed: false,
      createdAt: new Date('2026-03-16T08:00:00.000Z'),
    },
    {
      id: 'todo-2',
      title: 'Second task',
      completed: true,
      createdAt: new Date('2026-03-15T09:30:00.000Z'),
    },
  ];

  const persistTodos = (todos: TodoItem[]): void => {
    const serializedTodos: StoredTodoItem[] = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
    }));

    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(serializedTodos));
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    const service = TestBed.inject(TodosFacadeService);
    expect(service).toBeTruthy();
  });

  it('should load todos from storage on initialization', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    expect(service.todos().length).toBe(2);
    expect(service.totalCount()).toBe(2);
  });

  it('should calculate correct counts', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    expect(service.totalCount()).toBe(2);
    expect(service.activeCount()).toBe(1);
    expect(service.completedCount()).toBe(1);
  });

  it('should filter todos by completion status', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    service.setFilter('active');
    const filtered = service.filterTodos('');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.completed).toBe(false);
  });

  it('should filter todos by search query', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    const filtered = service.filterTodos('second');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.title).toBe('Second task');
  });

  it('should generate correct results summary', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    service.setFilter('all');
    let summary = service.generateResultsSummary('');
    expect(summary).toBe('2 items in all items');

    service.setFilter('active');
    summary = service.generateResultsSummary('');
    expect(summary).toBe('1 item in active items');

    summary = service.generateResultsSummary('second');
    expect(summary).toContain('matching "second"');
  });

  it('should add a new todo', () => {
    const service = TestBed.inject(TodosFacadeService);

    service.addTodo('New task');

    expect(service.totalCount()).toBe(1);
    expect(service.todos()[0]?.title).toBe('New task');
  });

  it('should not add a todo with empty or whitespace-only title', () => {
    const service = TestBed.inject(TodosFacadeService);

    service.addTodo('');
    expect(service.totalCount()).toBe(0);

    service.addTodo('   ');
    expect(service.totalCount()).toBe(0);
  });

  it('should toggle todo completion', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    const todoId = storedTodos[0].id;
    service.toggleTodo(todoId);

    const updated = service.todos().find((t) => t.id === todoId);
    expect(updated?.completed).toBe(true);
  });

  it('should delete a todo', () => {
    persistTodos(storedTodos);
    const service = TestBed.inject(TodosFacadeService);

    const todoId = storedTodos[0].id;
    service.deleteTodo(todoId);

    expect(service.totalCount()).toBe(1);
    expect(service.todos().find((t) => t.id === todoId)).toBeUndefined();
  });

  it('should persist operations to storage', () => {
    const service = TestBed.inject(TodosFacadeService);

    service.addTodo('Test task');
    const stored = JSON.parse(localStorage.getItem(TODOS_STORAGE_KEY) ?? '[]') as StoredTodoItem[];

    expect(stored).toHaveLength(1);
    expect(stored[0]?.title).toBe('Test task');
  });
});
