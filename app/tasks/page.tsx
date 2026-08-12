//app/tasks/page.tsx
"use client";

import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getTasks, getTaskStatuses } from "@/lib/api/tasks";
import { useUser } from "@/lib/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import TaskCard from "./components/TaskCard";

export default function TasksPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const {
    data,
    error,
    isLoading: taskLoading,
  } = useSWR(isAuthenticated ? "/api/tasks" : null, () => getTasks());

  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
  } = useSWR(isAuthenticated ? "/api/task-statuses" : null, () =>
    getTaskStatuses(),
  );

  if (isLoading) {
    return <Loading message="認証情報を確認中..." />;
  }

  if (!user) return null;

  if (taskLoading || statusLoading) {
    return <Loading message="タスク読み込み中..." />;
  }

  if (error) {
    return <ErrorState message="タスク一覧の取得に失敗しました。" />;
  }

  if (statusError) {
    return <ErrorState message="ステータスの取得に失敗しました。" />;
  }

  const tasks = data?.data ?? [];
  const taskStatuses = statusData?.data ?? [];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">タスク一覧</h1>

        {user?.can_create_task && (
          <Link
            href="/tasks/create"
            className="inline-flex w-full justify-center rounded bg-green-500 px-4 py-2 text-white sm:w-auto"
          >
            新規作成
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState message="タスクがありません" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} taskStatuses={taskStatuses} />
          ))}
        </div>
      )}
    </div>
  );
}
