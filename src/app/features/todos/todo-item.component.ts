import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TodoItem } from './todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'todo-item-host',
  },
  template: `
    <article class="todo-item" [class.todo-item-complete]="todo().completed">
      <mat-checkbox
        class="todo-toggle"
        [checked]="todo().completed"
        [aria-label]="
          todo().completed
            ? 'Mark ' + todo().title + ' as active'
            : 'Mark ' + todo().title + ' as completed'
        "
        (change)="requestToggle()"
      ></mat-checkbox>

      <div class="todo-copy">
        <p class="todo-title">{{ todo().title }}</p>
        <p class="todo-meta">
          {{ todo().completed ? 'Completed' : 'In progress' }} · Added
          {{ createdAtLabel() }}
        </p>
      </div>

      <div class="todo-actions">
        <button mat-stroked-button type="button" class="state-button" (click)="requestToggle()">
          <mat-icon>{{ todo().completed ? 'refresh' : 'task_alt' }}</mat-icon>
          {{ todo().completed ? 'Reopen' : 'Complete' }}
        </button>

        <button
          mat-icon-button
          type="button"
          class="delete-button"
          [attr.aria-label]="'Delete ' + todo().title"
          (click)="requestDelete()"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .todo-item {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
        padding: 1rem 1.1rem;
        border-radius: 20px;
        border: 1px solid rgba(54, 34, 26, 0.08);
        background: rgba(255, 253, 250, 0.92);
        transition:
          transform 180ms ease,
          border-color 180ms ease,
          box-shadow 180ms ease;
      }

      .todo-item:hover {
        transform: translateY(-2px);
        border-color: rgba(181, 75, 52, 0.22);
        box-shadow: 0 14px 28px rgba(63, 37, 26, 0.08);
      }

      .todo-item-complete {
        background: rgba(244, 249, 246, 0.98);
        border-color: rgba(60, 123, 103, 0.18);
      }

      .todo-copy {
        min-width: 0;
      }

      .todo-title,
      .todo-meta {
        margin: 0;
      }

      .todo-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--page-ink);
        word-break: break-word;
      }

      .todo-item-complete .todo-title {
        color: color-mix(in srgb, var(--page-ink) 54%, white);
        text-decoration: line-through;
        text-decoration-thickness: 2px;
      }

      .todo-meta {
        margin-top: 0.25rem;
        color: var(--page-muted);
        font-size: 0.92rem;
      }

      .state-button {
        border-radius: 999px;
        white-space: nowrap;
        min-width: 0;
        padding-inline: 0.75rem;
      }

      .todo-actions {
        display: inline-flex;
        align-items: center;
        justify-self: end;
        gap: 0.35rem;
        flex-wrap: nowrap;
      }

      .delete-button {
        color: color-mix(in srgb, var(--page-ink) 58%, #8b2f1e);
      }

      .delete-button:hover {
        color: #8b2f1e;
        background: rgba(139, 47, 30, 0.1);
      }

      @media (max-width: 720px) {
        .todo-item {
          gap: 0.65rem;
        }

        .state-button {
          padding-inline: 0.6rem;
        }
      }
    `,
  ],
})
export class TodoItemComponent {
  readonly todo = input.required<TodoItem>();
  readonly toggleRequested = output<string>();
  readonly deleteRequested = output<string>();

  readonly createdAtLabel = computed(() =>
    formatDistanceToNow(this.todo().createdAt, { addSuffix: true }),
  );

  requestToggle(): void {
    this.toggleRequested.emit(this.todo().id);
  }

  requestDelete(): void {
    this.deleteRequested.emit(this.todo().id);
  }
}
