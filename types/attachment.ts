//types/attachment.ts

export type AttachmentUser = {
  id: number | null;
  name: string | null;
};

export type Attachment = {
  id: number;
  task_id: number;
  user: AttachmentUser;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  download_url: string;
  created_at: string;
  updated_at: string;
};

export type AttachmentResponse = {
  data: Attachment[];
};

export type SingleAttachmentResponse = {
  data: Attachment;
};