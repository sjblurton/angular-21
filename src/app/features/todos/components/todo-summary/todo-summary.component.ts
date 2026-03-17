import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-todo-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-summary.component.html',
  styleUrl: './todo-summary.component.css',
})
export class TodoSummaryComponent {
  readonly total = input.required<number>();
  readonly active = input.required<number>();
  readonly completed = input.required<number>();
}
