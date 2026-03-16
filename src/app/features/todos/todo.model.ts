export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdLabel: string;
}
