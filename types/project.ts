// types/project.ts

export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_by_user: {
    id: number;
    name: string;
  } | null;
  tasks_count?: number;
  completed_tasks_count?: number;
  created_at: string;
  updated_at: string;
};

export type ProjectResponse = {
  data: Project[];
};

export type SingleProjectResponse = {
  data: Project;
};
