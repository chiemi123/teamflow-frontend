import type { UserNotification } from "@/types/userNotification";
import { apiFetch } from "./client";

type UserNotificationResponse = {
  data: UserNotification[];
};

export async function fetchUserNotifications(): Promise<UserNotification[]> {
  const response = (await apiFetch(
    "/api/user-notifications",
  )) as UserNotificationResponse;

  return response.data;
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await apiFetch(`/api/user-notifications/${id}/read`, {
    method: "PUT",
  });
}
