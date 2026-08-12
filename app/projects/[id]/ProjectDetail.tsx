//  app/projects/[id]/ProjectDetail.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";

import TaskCard from "@/app/tasks/components/TaskCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getProject } from "@/lib/api/projects";
import { getTasks, getTaskStatuses } from "@/lib/api/tasks";
import { isApiError } from "@/lib/api/errors";
import { useUser } from "@/lib/hooks/useUser";

type Props = {
  projectId: number;
};

export default function ProjectDetail({ projectId }: Props) {
  const { user } = useUser();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useSWR(`/api/projects/${projectId}`, () => getProject(projectId), {
    shouldRetryOnError: false,
  });

  const {
    data: taskData,
    error: taskError,
    isLoading: taskLoading,
  } = useSWR(`/api/tasks?project_id=${projectId}`, () => getTasks(projectId), {
    shouldRetryOnError: false,
  });

  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
  } = useSWR("/api/task-statuses", getTaskStatuses, {
    shouldRetryOnError: false,
  });

  const project = projectData?.data;
  const tasks = taskData?.data ?? [];
  const taskStatuses = statusData?.data ?? [];

  if (projectLoading) {
    return <Loading message="プロジェクト情報を読み込み中..." />;
  }

  if (projectError) {
    if (isApiError(projectError) && projectError.status === 404) {
      return <EmptyState message="プロジェクトが見つかりません。" />;
    }

    return <ErrorState message="プロジェクト情報の取得に失敗しました。" />;
  }

  if (!project) {
    return <EmptyState message="プロジェクトが見つかりません。" />;
  }

  if (taskLoading || statusLoading) {
    return <Loading message="タスク一覧を読み込み中..." />;
  }

  if (taskError || statusError) {
    return <ErrorState message="タスク一覧の取得に失敗しました。" />;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <Link
          href="/projects"
          className="text-sm text-blue-600 hover:underline"
        >
          ← プロジェクト一覧へ戻る
        </Link>
      </div>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>

            <p className="mt-2 text-gray-700">
              {project.description || "説明は未登録です。"}
            </p>
          </div>

          <Link
            href={`/projects/${project.id}/edit`}
            className="rounded bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            編集
          </Link>
        </div>

        <div className="mt-4 space-y-1 text-sm text-gray-500">
          <p>作成者: {project.created_by_user?.name ?? "不明"}</p>
          <p>作成日: {project.created_at}</p>
          <p>更新日: {project.updated_at}</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">このプロジェクトのタスク</h2>

          {user?.can_create_task && (
            <Link
              href={`/tasks/create?project_id=${project.id}`}
              className="rounded bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
            >
              タスクを作成
            </Link>
          )}
        </div>

        {tasks.length === 0 ? (
          <EmptyState message="このプロジェクトにはまだタスクがありません。" />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                taskStatuses={taskStatuses}
                mutateKey={`/api/tasks?project_id=${projectId}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
