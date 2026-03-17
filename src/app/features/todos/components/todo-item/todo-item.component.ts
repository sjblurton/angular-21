import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { DistanceToNowPipe } from '../../pipes/distance-to-now.pipe';
import { TodoItem } from '../../todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, DistanceToNowPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'todo-item-host',
  },
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
})
export class TodoItemComponent {
  readonly todo = input.required<TodoItem>();
  readonly toggleRequested = output<string>();
  readonly deleteRequested = output<string>();

  requestToggle(): void {
    this.toggleRequested.emit(this.todo().id);
  }

  requestDelete(): void {
    this.deleteRequested.emit(this.todo().id);
  }
}
