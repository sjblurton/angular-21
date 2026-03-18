import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { todoAddFormTestIds, type TodoAddFormTestIds } from './todo-add-form.test-ids';

type TodoTitleFormGroup = FormGroup<{
  title: FormControl<string>;
}>;

@Component({
  selector: 'app-todo-add-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-add-form.component.html',
  styleUrl: './todo-add-form.component.css',
})
/**
 * Presentational add form for creating todo items.
 *
 * The parent container owns form creation and validation rules, while this
 * component focuses on rendering and emitting submit intent.
 */
export class TodoAddFormComponent {
  /** Stable `data-testid` values used by the template and test suites. */
  protected readonly testIds: TodoAddFormTestIds = todoAddFormTestIds;

  /** Reactive form group that contains the `title` control. */
  readonly addTodoForm = input.required<TodoTitleFormGroup>();

  /** Title form control used for hint and validation state in the template. */
  readonly titleControl = input.required<FormControl<string>>();

  /** Emits when the user submits the form. */
  readonly addRequested = output<void>();

  /** Emits submit intent to the container component. */
  requestAdd(): void {
    this.addRequested.emit();
  }
}
