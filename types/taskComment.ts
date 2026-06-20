// types/taskComment.ts

export type CommentUser = {
  id: number;
  name: string;
};

export type TaskComment = {
  id: number;
  task_id: number;
  user: CommentUser | null;
  content: string;
  created_at: string;
  updated_at: string;
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