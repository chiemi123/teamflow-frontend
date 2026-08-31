// lib/api/tasks.ts

import { apiFetch } from "@/lib/api/client";
import type {
  TaskFormData,
  TaskListResponse,
  TaskResponse,
  TaskStatusListResponse,
} from "@/types/task";

export const getTasks = async (
  projectId?: number,
): Promise<TaskListResponse> => {
  const url = projectId
    ? `/api/tasks?project_id=${projectId}`
    : "/api/tasks";

  return apiFetch<TaskListResponse>(url);
};

export const getTask = async (id: number): Promise<TaskResponse> => {
  return apiFetch<TaskResponse>(`/api/tasks/${id}`);
};

export const getTaskStatuses = async (): Promise<TaskStatusListResponse> => {
  return apiFetch<TaskStatusListResponse>("/api/task-statuses");
};

export const createTask = async (
  data: TaskFormData,
): Promise<TaskResponse> => {
  return apiFetch<TaskResponse>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTask = async (
  id: number,
  data: Partial<TaskFormData>,
): Promise<TaskResponse> => {
  return apiFetch<TaskResponse>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateTaskStatus = async (
  id: number,
  status_id: number,
): Promise<TaskResponse> => {
  return apiFetch<TaskResponse>(`/api/tasks/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status_id }),
  });
};

export const deleteTask = async (id: number): Promise<null> => {
  return apiFetch<null>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
};
