// lib/api/user.ts

import { apiFetch } from "@/lib/api/client";
import type { UserResponse } from "@/types/user";

export const getMe = async (): Promise<UserResponse> => {
  return apiFetch<UserResponse>("/api/user");
};
