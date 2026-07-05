// components/notifications/NotificationBadge.tsx
"use client";

import { fetchUserNotifications } from "@/lib/api/notifications";
import Link from "next/link";
import useSWR from "swr";

export default function NotificationBadge() {
  const { data: notifications } = useSWR(
    "/api/user-notifications",
    fetchUserNotifications,
    {
      shouldRetryOnError: false,
    },
  );

  const unreadCount =
    notifications?.filter((notification) => notification.read_at === null)
      .length ?? 0;

  return (
    <Link
      href="/notifications"
      className="relative rounded px-4 py-2 font-medium hover:bg-gray-700"
    >
      🔔 通知
      {unreadCount > 0 && (
        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
