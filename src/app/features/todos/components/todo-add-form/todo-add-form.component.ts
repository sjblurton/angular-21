import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
export class TodoAddFormComponent {
  readonly addTodoForm = input.required<TodoTitleFormGroup>();
  readonly titleControl = input.required<FormControl<string>>();
  readonly addRequested = output<void>();

  requestAdd(): void {
    this.addRequested.emit();
  }
}
