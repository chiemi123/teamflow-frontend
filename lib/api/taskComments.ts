// lib/api/taskComments.ts

import { apiFetch } from "@/lib/api/client";
import type {
  TaskCommentFormData,
  TaskCommentListResponse,
  TaskCommentResponse,
} from "@/types/taskComment";

export const getTaskComments = async (
  taskId: number,
): Promise<TaskCommentListResponse> => {
  return apiFetch<TaskCommentListResponse>(
    `/api/tasks/${taskId}/comments`,
  );
};

export const createTaskComment = async (
  taskId: number,
  data: TaskCommentFormData,
): Promise<TaskCommentResponse> => {
  return apiFetch<TaskCommentResponse>(
    `/api/tasks/${taskId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
};

export const updateTaskComment = async (
  commentId: number,
  data: TaskCommentFormData,
): Promise<TaskCommentResponse> => {
  return apiFetch<TaskCommentResponse>(
    `/api/task-comments/${commentId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
};

export const deleteTaskComment = async (
  commentId: number,
): Promise<null> => {
  return apiFetch<null>(`/api/task-comments/${commentId}`, {
    method: "DELETE",
  });
};