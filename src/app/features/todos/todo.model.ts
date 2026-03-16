export type TodoFilter = 'all' | 'active' | 'completed';

export const FILTER_LABELS: Record<TodoFilter, string> = {
  all: 'All items',
  active: 'Active items',
  completed: 'Completed items',
};

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
