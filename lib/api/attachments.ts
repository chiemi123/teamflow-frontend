// lib/api/attachments.ts

import { apiFetch } from "@/lib/api/client";
import type {
  AttachmentResponse,
  SingleAttachmentResponse,
} from "@/types/attachment";

export const getTaskAttachments = async (
  taskId: number,
): Promise<AttachmentResponse> => {
  return apiFetch<AttachmentResponse>(
    `/api/tasks/${taskId}/attachments`,
  );
};

export const uploadTaskAttachment = async (
  taskId: number,
  file: File,
): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  await apiFetch<SingleAttachmentResponse>(
    `/api/tasks/${taskId}/attachments`,
    {
      method: "POST",
      body: formData,
    },
  );
};

export const deleteAttachment = async (
  attachmentId: number,
): Promise<void> => {
  await apiFetch<null>(`/api/attachments/${attachmentId}`, {
    method: "DELETE",
  });
};