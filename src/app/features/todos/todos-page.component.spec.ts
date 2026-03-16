import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import { TodoItemComponent } from './todo-item.component';
import { TodosPageComponent } from './todos-page.component';

describe('TodosPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosPageComponent],
    }).compileComponents();
  });

  it('should create the todo page', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.totalCount()).toBe(4);
  });

  it('should add a new todo item', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.addTodoControl.setValue('Ship the handoff deck');
    component.addTodo();
    fixture.detectChanges();

    expect(component.totalCount()).toBe(5);
    expect(component.visibleTodos()[0]?.title).toBe('Ship the handoff deck');
  });

  it('should filter todo items by search query', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.searchControl.setValue('prototype');
    fixture.detectChanges();

    expect(component.visibleTodos().map((todo) => todo.title)).toEqual([
      'Prototype the moodboard footer interactions',
    ]);
  });

  it('should show completed items after toggling and changing the filter', () => {
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
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const toggleGroup = fixture.debugElement.query(By.directive(MatButtonToggleGroup))
      .componentInstance as MatButtonToggleGroup;

    fixture.debugElement
      .query(By.directive(MatButtonToggleGroup))
      .triggerEventHandler('change', { value: 'active' });
    fixture.detectChanges();

    expect(component.selectedFilter()).toBe('active');
    expect(component.visibleTodos().every((todo) => !todo.completed)).toBe(true);
  });

  it('should clear search and filters through the reset view button', () => {
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
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.searchControl.setValue('missing todo');
    fixture.detectChanges();

    expect(component.visibleTodos()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('No items match this view.');
  });

  it('should handle toggleRequested from a todo item child component', () => {
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

    expect(component.todos().find((todo) => todo.id === targetTodo.id)?.completed).toBe(
      !targetTodo.completed,
    );
  });

  it('should ignore unsupported filter values', () => {
    const fixture = TestBed.createComponent(TodosPageComponent);
    const component = fixture.componentInstance;

    component.setFilter('archived');

    expect(component.selectedFilter()).toBe('all');
  });
});
