export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
} 