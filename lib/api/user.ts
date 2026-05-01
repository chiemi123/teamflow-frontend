// lib/api/user.ts
import { UserResponse } from "@/types/user";
import { apiFetch } from "./client";

export const getMe = async (url: string): Promise<UserResponse> => {
  return await apiFetch(url);
};
