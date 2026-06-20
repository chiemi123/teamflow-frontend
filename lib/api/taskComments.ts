// lib/api/taskComments.ts

import { apiFetch } from "@/lib/api/client";
import {
  TaskCommentFormData,
  TaskCommentListResponse,
  TaskCommentResponse,
} from "@/types/taskComment";

export const getTaskComments = async (
  taskId: number,
): Promise<TaskCommentListResponse> => {
  return apiFetch(`/api/tasks/${taskId}/comments`);
};

export const createTaskComment = async (
  taskId: number,
  data: TaskCommentFormData,
): Promise<TaskCommentResponse> => {
  return apiFetch(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateTaskComment = async (
  commentId: number,
  data: TaskCommentFormData,
): Promise<TaskCommentResponse> => {
  return apiFetch(`/api/task-comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteTaskComment = async (
  commentId: number,
): Promise<null> => {
  return apiFetch(`/api/task-comments/${commentId}`, {
    method: "DELETE",
  });
};