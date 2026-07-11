// lib/api/tasks.ts

import { apiFetch } from "@/lib/api/client";
import {
  TaskFormData,
  TaskListResponse,
  TaskResponse,
  TaskStatus,
} from "@/types/task";

export type TaskStatusListResponse = {
  data: TaskStatus[];
};

export const getTasks = async (
  projectId?: number,
): Promise<TaskListResponse> => {
  const url = projectId
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/tasks?project_id=${projectId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`;

  return apiFetch(url);
};

export const getTask = async (id: number): Promise<TaskResponse> => {
  return apiFetch(`/api/tasks/${id}`);
};

export const getTaskStatuses = async (): Promise<TaskStatusListResponse> => {
  return apiFetch("/api/task-statuses");
};

export const createTask = async (data: TaskFormData): Promise<TaskResponse> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

export const updateTask = async (
  id: number,
  data: Partial<TaskFormData>,
): Promise<TaskResponse> => {
  return apiFetch(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const updateTaskStatus = async (
  id: number,
  status_id: number,
): Promise<TaskResponse> => {
  return apiFetch(`/api/tasks/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status_id }),
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteTask = async (id: number): Promise<null> => {
  return apiFetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
};
