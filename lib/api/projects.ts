import { ProjectResponse } from "@/types/project";
import { apiFetch } from "./client";

export const getProjects = async (): Promise<ProjectResponse> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
};
