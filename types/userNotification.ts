export type UserNotificationTask = {
  id: number;
  title: string;
};

export type UserNotification = {
  id: number;
  type: string;
  message: string;
  read_at: string | null;
  created_at: string;
  task?: UserNotificationTask | null;
};
