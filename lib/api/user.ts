// lib/api/user.ts
import { apiFetch } from "@/lib/api/client";
import { UserResponse } from "@/types/user";

export const getMe = async (): Promise<UserResponse> => {
  console.log("Calling getMe function");
  const data = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`);
  console.log("Fetched user data:", data); // ログでデータ確認
  return data;
};
