// types/user.ts

export type User = {
  id: number;
  name: string;
  email: string;
  can_create_project: boolean;
  can_edit_project: boolean;
  can_delete_project: boolean;
  can_create_task: boolean;
};

export type UserResponse = {
  data: User;
};