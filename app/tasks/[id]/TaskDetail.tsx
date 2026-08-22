// app/tasks/[id]/TaskDetail.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";

import { TaskAttachments } from "@/components/tasks/TaskAttachments";
import TaskComments from "@/components/tasks/TaskComments";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { isApiError } from "@/lib/api/errors";
import { getTask } from "@/lib/api/tasks";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";

type Props = {
  taskId: number;
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "未設定";
  }

  return new Intl.DateTimeFormat("ja-JP").format(new Date(`${date}T00:00:00`));
};

const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function TaskDetail({ taskId }: Props) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuthGuard();
  const { data, error, isLoading } = useSWR(
    isAuthenticated && Number.isFinite(taskId) ? `/api/tasks/${taskId}` : null,
    () => getTask(taskId),
    {
      shouldRetryOnError: false,
    },
  );

  const task = data?.data;

  if (authLoading) {
    return <Loading message="認証情報を確認中..." />;
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <Loading message="タスク情報を読み込み中..." />;
  }

  if (error) {
    if (isApiError(error) && error.status === 404) {
      return <EmptyState message="タスクが見つかりません。" />;
    }

    return <ErrorState message="タスク情報の取得に失敗しました。" />;
  }

  if (!task) {
    return <EmptyState message="タスクが見つかりません。" />;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <Link href="/tasks" className="text-sm text-blue-600 hover:underline">
          ← タスク一覧へ戻る
        </Link>
      </div>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold">{task.title}</h1>

            <p className="mt-2 whitespace-pre-wrap break-words text-gray-700">
              {task.description || "説明は未登録です。"}
            </p>
          </div>

          <Link
            href={`/tasks/${task.id}/edit`}
            className="shrink-0 whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            編集
          </Link>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
          <p>
            ステータス：
            <span className="font-medium text-gray-900">
              {task.task_status?.name ?? "未設定"}
            </span>
          </p>

          <p>
            担当者：
            <span className="font-medium text-gray-900">
              {task.assigned_user?.name ?? "未設定"}
            </span>
          </p>

          <p>
            期限：
            <span className="font-medium text-gray-900">
              {formatDate(task.due_date)}
            </span>
          </p>

          {task.completed_at && (
            <p>
              完了日時：
              <span className="font-medium text-gray-900">
                {formatDateTime(task.completed_at)}
              </span>
            </p>
          )}

          <p>
            作成日：
            <span className="font-medium text-gray-900">
              {formatDateTime(task.created_at)}
            </span>
          </p>

          <p>
            更新日：
            <span className="font-medium text-gray-900">
              {formatDateTime(task.updated_at)}
            </span>
          </p>
        </div>
      </section>

      <TaskComments taskId={task.id} />

      <TaskAttachments taskId={task.id} readonly />
    </main>
  );
}
