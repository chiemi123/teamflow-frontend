// app/projects/components/ProjectCard.tsx

import { apiFetch } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/useUser";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

type ProjectCardProps = Pick<
  Project,
  "id" | "name" | "description" | "tasks_count" | "completed_tasks_count"
>;

export default function ProjectCard({
  id,
  name,
  description,
  tasks_count = 0,
  completed_tasks_count = 0,
}: ProjectCardProps) {
  const router = useRouter();
  const { user } = useUser();

  // ユーザーが編集・削除できるかチェック（Owner または Admin）
  const canEdit = user?.can_edit_project;
  const canDelete = user?.can_delete_project;

  const progress =
    tasks_count > 0
      ? Math.round((completed_tasks_count / tasks_count) * 100)
      : 0;

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!confirm("本当に削除しますか？")) return;

    await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
    await mutate("/api/projects"); // 一覧を再取得
  };

  return (
    <div
      className="cursor-pointer rounded-lg border p-4 shadow-sm transition hover:shadow-md"
      onClick={() => router.push(`/projects/${id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          router.push(`/projects/${id}`);
        }
      }}
    >
      <h2 className="text-lg font-bold">{name}</h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description ?? ""}</p>
      )}

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">タスク {tasks_count}件</p>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            完了 {completed_tasks_count}件 / {tasks_count}件
          </span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          className="w-full rounded bg-gray-600 px-3 py-2 text-white sm:w-auto"
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/projects/${id}`);
          }}
        >
          詳細
        </button>

        {canEdit && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/projects/${id}/edit`);
            }}
          >
            編集
          </button>
        )}

        {canDelete && (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={handleDelete}
          >
            削除
          </button>
        )}
      </div>
    </div>
  );
}
