// types/taskComment.ts

export type CommentUser = {
  id: number;
  name: string;
};

export type TaskCommentPermissions = {
  can_update: boolean;
  can_delete: boolean;
};

export type TaskComment = {
  id: number;
  task_id: number;
  user: CommentUser | null;
  content: string;
  created_at: string;
  updated_at: string;
  permissions: TaskCommentPermissions;
};

export type TaskCommentResponse = {
  data: TaskComment;
};

export type TaskCommentListResponse = {
  data: TaskComment[];
};

export type TaskCommentFormData = {
  content: string;
};
