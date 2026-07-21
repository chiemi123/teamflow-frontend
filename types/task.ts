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

export type TaskPermissions = {
  can_update: boolean;
  can_delete: boolean;
  can_update_status: boolean;
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
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  permissions: TaskPermissions;
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

