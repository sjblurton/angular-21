import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TodoItemComponent } from './todo-item.component';
import { TodoItem } from './todo.model';

describe('TodoItemComponent', () => {
  const baseTodo: TodoItem = {
    id: 'todo-7',
    title: 'Document the component interactions',
    completed: false,
    createdLabel: 'Now',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
    }).compileComponents();
  });

  it('should emit the todo id when the checkbox change event fires', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    const component = fixture.componentInstance;
    let emittedId: string | undefined;

    fixture.componentRef.setInput('todo', baseTodo);
    component.toggleRequested.subscribe((todoId) => {
      emittedId = todoId;
    });
    fixture.detectChanges();

    fixture.debugElement.query(By.css('mat-checkbox')).triggerEventHandler('change', {});

    expect(emittedId).toBe(baseTodo.id);
  });

  it('should emit the todo id when the action button is clicked', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    const component = fixture.componentInstance;
    let emittedId: string | undefined;

    fixture.componentRef.setInput('todo', {
      ...baseTodo,
      completed: true,
    });
    component.toggleRequested.subscribe((todoId) => {
      emittedId = todoId;
    });
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('button'))
      .triggerEventHandler('click', new MouseEvent('click'));

    expect(fixture.nativeElement.textContent).toContain('Reopen');
    expect(emittedId).toBe(baseTodo.id);
  });
});
