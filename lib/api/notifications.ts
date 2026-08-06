// lib/api/notifications.ts

import { apiFetch } from "@/lib/api/client";
import type {
  UserNotification,
  UserNotificationResponse,
} from "@/types/userNotification";

export async function fetchUserNotifications(): Promise<UserNotification[]> {
  const response = await apiFetch<UserNotificationResponse>(
  "/api/user-notifications",
  );

  return response.data;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await apiFetch<null>(`/api/user-notifications/${id}/read`, {
    method: "PUT",
  });
}
