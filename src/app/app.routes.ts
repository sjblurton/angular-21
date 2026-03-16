import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/todos/todos-page.component').then((module) => module.TodosPageComponent),
    title: 'Todo Studio',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
