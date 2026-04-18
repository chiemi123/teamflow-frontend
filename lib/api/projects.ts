import { apiFetch } from "./client";

export const getProjects = async () => {
  return apiFetch("/api/projects");
};
