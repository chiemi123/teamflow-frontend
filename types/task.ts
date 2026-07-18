// types/task.ts

export type TaskStatus = {
  id: number;
  name: string;
  sort_order: number;
};

export type AssignedUser = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status_id: number;
  task_status: TaskStatus | null;
  assigned_user_id: number | null;
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
  due_date?: string | null;
};

export type UpdateTaskStatusData = {
  status_id: number;
};
