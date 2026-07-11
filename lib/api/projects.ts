// lib/api/projects.ts
import { apiFetch } from "@/lib/api/client";
import {
  Project,
  ProjectResponse,
  SingleProjectResponse,
} from "@/types/project";

// 一覧
export const getProjects = async (): Promise<ProjectResponse> => {
  return apiFetch("/api/projects");
};

// 単体取得 API
export const getProject = async (
  id: number,
): Promise<SingleProjectResponse> => {
  return apiFetch(`/api/projects/${id}`);
};

// 新規作成
export const createProject = async (data: {
  name: string;
  description: string;
}): Promise<Project> => {
  return apiFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }) as Promise<Project>;
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

// 削除
export const deleteProject = async (
  id: number,
): Promise<null> => {
  return apiFetch(`/api/projects/${id}`, {
    method: "DELETE",
  }) as Promise<null>;
};
