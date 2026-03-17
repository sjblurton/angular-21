import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TodoSummaryComponent } from '../todo-summary/todo-summary.component';

@Component({
  selector: 'app-todo-hero',
  imports: [MatToolbarModule, TodoSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-hero.component.html',
  styleUrl: './todo-hero.component.css',
})
export class TodoHeroComponent {
  readonly total = input.required<number>();
  readonly active = input.required<number>();
  readonly completed = input.required<number>();
}
