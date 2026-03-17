import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { todoSummaryTestIds } from './todo-summary.test-ids';

@Component({
  selector: 'app-todo-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-summary.component.html',
  styleUrl: './todo-summary.component.css',
})
export class TodoSummaryComponent {
  protected readonly testIds = todoSummaryTestIds;

  readonly total = input.required<number>();
  readonly active = input.required<number>();
  readonly completed = input.required<number>();
}
