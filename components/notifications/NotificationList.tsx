//components/notifications/NotificationList.tsx
"use client";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { isApiError } from "@/lib/api/errors";
import {
  fetchUserNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import type { UserNotification } from "@/types/userNotification";
import { useState } from "react";
import useSWR from "swr";

function getNotificationMeta(type: string) {
  switch (type) {
    case "task_commented":
      return { icon: "💬", label: "コメント" };
    case "task_updated":
      return { icon: "📝", label: "タスク更新" };
    case "task_status_updated":
      return { icon: "✅", label: "ステータス変更" };
    case "attachment_uploaded":
      return { icon: "📎", label: "添付ファイル" };
    default:
      return { icon: "🔔", label: "通知" };
  }
}

function getNotificationText(type: string) {
  switch (type) {
    case "task_commented":
      return "コメントが追加されました。";

    case "task_updated":
      return "タスクが更新されました。";

    case "task_status_updated":
      return "ステータスが変更されました。";

    case "attachment_uploaded":
      return "添付ファイルが追加されました。";

    default:
      return "通知があります。";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function NotificationList() {
  const {
    data: notifications,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/user-notifications", fetchUserNotifications, {
    shouldRetryOnError: false,
  });

  const [actionError, setActionError] = useState("");

  const handleMarkAsRead = async (id: number) => {
    setActionError("");

    try {
      await markNotificationAsRead(id);
      await mutate();
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 403) {
          setActionError("この操作を行う権限がありません");
        } else {
          setActionError(err.message || "通知の既読化に失敗しました");
        }
      } else if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError("通知の既読化に失敗しました");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message="通知の取得に失敗しました" />;
  }

  if (!notifications || notifications.length === 0) {
    return <EmptyState message="新しい通知はありません" />;
  }

  return (
    <div className="space-y-3">
      {actionError && <p className="text-red-500">{actionError}</p>}
      {notifications.map((notification: UserNotification) => {
        const meta = getNotificationMeta(notification.type);

        return (
          <div
            key={notification.id}
            className={`rounded-lg border p-4 shadow-sm transition ${
              notification.read_at
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{meta.icon}</div>

              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-800">
                    {meta.label}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      notification.read_at
                        ? "bg-gray-100 text-gray-500"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {notification.read_at ? "既読" : "未読"}
                  </span>
                </div>

                <div className="space-y-1">
                  {notification.task && (
                    <p className="text-base font-semibold text-gray-900">
                      {notification.task.title}
                    </p>
                  )}

                  <p className="text-sm text-gray-600">
                    {getNotificationText(notification.type)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(notification.created_at)}</span>

                  {!notification.read_at && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      既読にする
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
