// lib/api/projects.ts
import { apiFetch } from "@/lib/api/client";
import {
  Project,
  ProjectResponse,
  SingleProjectResponse,
} from "@/types/project";

export const getProjects = async (): Promise<ProjectResponse> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
};

// 新規作成
export const createProject = async (data: {
  name: string;
  description: string;
}): Promise<Project> => {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }) as Promise<Project>;
};

// 単体取得 API
export const getProject = async (
  id: number,
): Promise<SingleProjectResponse> => {
  return apiFetch(`/api/projects/${id}`);
};

// 編集（更新）
export const updateProject = async (
  id: number,
  data: { name: string; description: string },
): Promise<Project | null> => {
  return apiFetch(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }) as Promise<Project | null>;
};
