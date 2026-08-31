// lib/api/projects.ts

import { apiFetch } from "@/lib/api/client";
import type {
  Project,
  ProjectResponse,
  SingleProjectResponse,
} from "@/types/project";

// 一覧
export const getProjects = async (): Promise<ProjectResponse> => {
  return apiFetch<ProjectResponse>("/api/projects");
};

// 単体取得
export const getProject = async (
  id: number,
): Promise<SingleProjectResponse> => {
  return apiFetch<SingleProjectResponse>(`/api/projects/${id}`);
};

// 新規作成
export const createProject = async (data: {
  name: string;
  description: string;
}): Promise<Project> => {
  return apiFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// 編集
export const updateProject = async (
  id: number,
  data: {
    name: string;
    description: string;
  },
): Promise<Project | null> => {
  return apiFetch<Project | null>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// 削除
export const deleteProject = async (id: number): Promise<null> => {
  return apiFetch<null>(`/api/projects/${id}`, {
    method: "DELETE",
  });
};
