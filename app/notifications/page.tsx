// app/notifications/page.tsx
import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">通知</h1>
        <p className="mt-1 text-sm text-gray-500">
          コメント、タスク更新、ステータス変更、添付ファイル追加などの通知を確認できます。
        </p>
      </div>

      <NotificationList />
    </main>
  );
}
