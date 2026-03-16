import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import { TodoItemComponent } from './todo-item.component';
import { TodoItem } from './todo.model';
import { TODOS_STORAGE_KEY, TodosPageComponent } from './todos-page.component';

describe('TodosPageComponent', () => {
  const storedTodos: TodoItem[] = [
    {
      id: 'todo-1',
      title: 'Sketch the onboarding headline hierarchy',
      completed: false,
      createdLabel: 'Now',
    },
    {
      id: 'todo-2',
      title: 'Prototype the moodboard footer interactions',
      completed: false,
      createdLabel: 'Now',
    },
    {
      id: 'todo-3',
      title: 'Share the launch checklist with the product team',
      completed: true,
      createdLabel: 'Yesterday',
    },
    {
      id: 'todo-4',
      title: 'Tighten the accessibility notes for form controls',
      completed: false,
      createdLabel: 'Yesterday',
    },
  ];

  const persistTodos = (todos: TodoItem[]): void => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TodosPageComponent],
    }).compileComponents();
  });

  it('should create the todo page with no items when local storage is empty', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.totalCount()).toBe(0);
  });

  it('should load stored todo items from local storage', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    expect(component.totalCount()).toBe(4);
    expect(component.visibleTodos()[0]?.title).toBe(storedTodos[0].title);
  });

  it('should use an empty list when local storage contains malformed JSON', () => {
    localStorage.setItem(TODOS_STORAGE_KEY, '{invalid-json');
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    expect(component.totalCount()).toBe(0);
  });

  it('should use an empty list when local storage value is not an array', () => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify({ value: 'invalid' }));
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    expect(component.totalCount()).toBe(0);
  });

  it('should add a new todo item with a UUID and persist to local storage', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.addTodoControl.setValue('Ship the handoff deck');
    component.addTodo();
    fixture.detectChanges();

    const createdTodo = component.visibleTodos()[0];

    expect(component.totalCount()).toBe(1);
    expect(createdTodo?.title).toBe('Ship the handoff deck');
    expect(createdTodo?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(createdTodo?.createdLabel.length ?? 0).toBeGreaterThan(0);

    const stored = JSON.parse(localStorage.getItem(TODOS_STORAGE_KEY) ?? '[]') as TodoItem[];
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe(createdTodo?.id);
  });

  it('should filter todo items by search query', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.searchControl.setValue('prototype');
    fixture.detectChanges();

    expect(component.visibleTodos().map((todo) => todo.title)).toEqual([
      'Prototype the moodboard footer interactions',
    ]);
  });

  it('should show completed items after toggling and changing the filter', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;
    const targetTodo = component.visibleTodos().find((todo) => !todo.completed);

    if (!targetTodo) {
      throw new Error('Expected to find an active todo item.');
    }

    component.toggleTodo(targetTodo.id);
    component.setFilter('completed');
    fixture.detectChanges();

    expect(component.visibleTodos().every((todo) => todo.completed)).toBe(true);
    expect(component.visibleTodos().some((todo) => todo.id === targetTodo.id)).toBe(true);
  });

  it('should show the trimmed required validation message after submitting whitespace', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.addTodoControl.setValue('   ');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    expect(component.addTodoControl.touched).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Enter a task before adding it.');
  });

  it('should show the maxlength validation message for overly long titles', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.addTodoControl.setValue('x'.repeat(121));
    component.addTodoControl.markAsTouched();
    fixture.detectChanges();

    expect(component.addTodoControl.hasError('maxlength')).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Keep each task under 120 characters.');
  });

  it('should apply the active filter when the toggle group emits a change', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    fixture.debugElement
      .query(By.directive(MatButtonToggleGroup))
      .triggerEventHandler('change', { value: 'active' });
    fixture.detectChanges();

    expect(component.selectedFilter()).toBe('active');
    expect(component.visibleTodos().every((todo) => !todo.completed)).toBe(true);
  });

  it('should clear search and filters through the reset view button', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.searchControl.setValue('prototype');
    fixture.detectChanges();

    const resetButton = fixture.nativeElement.querySelector(
      '.results-bar button',
    ) as HTMLButtonElement | null;

    expect(resetButton).not.toBeNull();

    resetButton?.click();
    fixture.detectChanges();

    expect(component.searchControl.value).toBe('');
    expect(component.selectedFilter()).toBe('all');
  });

  it('should render the empty state when no items match the current search', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.searchControl.setValue('missing todo');
    fixture.detectChanges();

    expect(component.visibleTodos()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('No items match this view.');
  });

  it('should handle toggleRequested from a todo item child component and persist the result', () => {
    persistTodos(storedTodos);
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const targetTodo = component.visibleTodos()[0];

    if (!targetTodo) {
      throw new Error('Expected at least one visible todo item.');
    }

    const child = fixture.debugElement.query(By.directive(TodoItemComponent))
      .componentInstance as TodoItemComponent;

    child.toggleRequested.emit(targetTodo.id);
    fixture.detectChanges();

    const updatedTodo = component.todos().find((todo) => todo.id === targetTodo.id);
    expect(updatedTodo?.completed).toBe(!targetTodo.completed);

    const stored = JSON.parse(localStorage.getItem(TODOS_STORAGE_KEY) ?? '[]') as TodoItem[];
    expect(stored.find((todo) => todo.id === targetTodo.id)?.completed).toBe(!targetTodo.completed);
  });

  it('should ignore unsupported filter values', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.setFilter('archived');

    expect(component.selectedFilter()).toBe('all');
  });
});
