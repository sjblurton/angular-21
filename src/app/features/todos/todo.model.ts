export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createdLabel: string;
}
