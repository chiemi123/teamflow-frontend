// lib/api/projects.ts
import { apiFetch } from "@/lib/api/client";
import { ProjectResponse } from "@/types/project";

export const getProjects = async (): Promise<ProjectResponse> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
};
