import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TodoFilter } from '../../todo.model';

@Component({
  selector: 'app-todo-filters-panel',
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-filters-panel.component.html',
  styleUrl: './todo-filters-panel.component.css',
})
export class TodoFiltersPanelComponent {
  readonly searchControl = input.required<FormControl<string>>();
  readonly selectedFilter = input.required<TodoFilter>();
  readonly filterChanged = output<string | null>();

  requestFilterChange(nextFilter: string | null): void {
    this.filterChanged.emit(nextFilter);
  }
}
