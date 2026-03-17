import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TodoTaskListComponent } from './todo-task-list.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoItem } from '../../todo.model';

describe('TodoTaskListComponent', () => {
  const baseTodo: TodoItem = {
    id: 'todo-1',
    title: 'Test todo',
    completed: false,
    createdAt: new Date('2026-03-16T09:30:00.000Z'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoTaskListComponent],
    }).compileComponents();
  });

  it('should emit todo id when child toggle event is received', () => {
    const fixture = TestBed.createComponent(TodoTaskListComponent);
    const component = fixture.componentInstance;
    let emittedId: string | undefined;

    fixture.componentRef.setInput('todos', [baseTodo]);
    component.toggleRequested.subscribe((todoId) => {
      emittedId = todoId;
    });
    fixture.detectChanges();

    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent));
    todoItem.componentInstance.toggleRequested.emit(baseTodo.id);

    expect(emittedId).toBe(baseTodo.id);
  });

  it('should emit todo id when child delete event is received', () => {
    const fixture = TestBed.createComponent(TodoTaskListComponent);
    const component = fixture.componentInstance;
    let emittedId: string | undefined;

    fixture.componentRef.setInput('todos', [baseTodo]);
    component.deleteRequested.subscribe((todoId) => {
      emittedId = todoId;
    });
    fixture.detectChanges();

    const todoItem = fixture.debugElement.query(By.directive(TodoItemComponent));
    todoItem.componentInstance.deleteRequested.emit(baseTodo.id);

    expect(emittedId).toBe(baseTodo.id);
  });

  it('should handle multiple toggle requests from different todo items', () => {
    const fixture = TestBed.createComponent(TodoTaskListComponent);
    const component = fixture.componentInstance;
    const emittedIds: string[] = [];

    const todos = [
      { ...baseTodo, id: 'todo-1' },
      { ...baseTodo, id: 'todo-2' },
      { ...baseTodo, id: 'todo-3' },
    ];
    fixture.componentRef.setInput('todos', todos);
    component.toggleRequested.subscribe((todoId) => {
      emittedIds.push(todoId);
    });
    fixture.detectChanges();

    const todoItems = fixture.debugElement.queryAll(By.directive(TodoItemComponent));
    todoItems[0].componentInstance.toggleRequested.emit('todo-1');
    todoItems[1].componentInstance.toggleRequested.emit('todo-2');
    todoItems[2].componentInstance.toggleRequested.emit('todo-3');

    expect(emittedIds).toEqual(['todo-1', 'todo-2', 'todo-3']);
  });
});
