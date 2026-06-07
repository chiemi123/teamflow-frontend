// types/task.ts

export type TaskStatus = {
  id: number;
  name: string;
};

export type AssignedUser = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  task_status: TaskStatus | null;
  assigned_user: AssignedUser | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskResponse = {
  data: Task;
};

export type TaskListResponse = {
  data: Task[];
};

export type TaskFormData = {
  project_id: number;
  title: string;
  description?: string | null;
  assigned_user_id?: number | null;
};