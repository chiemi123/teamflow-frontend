// lib/api/tasks.ts

import { apiFetch } from "@/lib/api/client";
import {
  TaskFormData,
  TaskListResponse,
  TaskResponse,
} from "@/types/task";

export const getTasks = async (): Promise<TaskListResponse> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
};

export const getTask = async (id: number): Promise<TaskResponse> => {
  return apiFetch(`/api/tasks/${id}`);
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

export const deleteTask = async (id: number): Promise<null> => {
  return apiFetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
};