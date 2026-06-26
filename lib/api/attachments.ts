//lib/api/attachments.ts
import { apiFetch } from "@/lib/api/client";
import type { AttachmentResponse } from "@/types/attachment";

const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined.");
  }

  return apiUrl.replace(/\/$/, "");
};

const fetchCsrfCookie = async () => {
  const apiUrl = getApiUrl();

  await fetch(`${apiUrl}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

const getXsrfToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
};

export const getTaskAttachments = async (
  taskId: number,
): Promise<AttachmentResponse> => {
  return apiFetch(
    `/api/tasks/${taskId}/attachments`,
  ) as Promise<AttachmentResponse>;
};

export const uploadTaskAttachment = async (
  taskId: number,
  file: File,
): Promise<void> => {
  const apiUrl = getApiUrl();

  await fetchCsrfCookie();

  const token = getXsrfToken();

  if (!token) {
    throw new Error("XSRF-TOKEN is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${apiUrl}/api/tasks/${taskId}/attachments`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": decodeURIComponent(token),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload attachment.");
  }
};

export const deleteAttachment = async (attachmentId: number): Promise<void> => {
  await apiFetch(`/api/attachments/${attachmentId}`, {
    method: "DELETE",
  });
};
