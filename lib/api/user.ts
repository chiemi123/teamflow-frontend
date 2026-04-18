import { apiFetch } from "./client";

export const getMe = (url: string) => {
  return apiFetch(url);
};
