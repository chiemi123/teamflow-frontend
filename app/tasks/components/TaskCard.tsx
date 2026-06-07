// app/tasks/components/TaskCard.tsx

import { apiFetch } from "@/lib/api/client";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

type TaskCardProps = Pick<
  Task,
  "id" | "title" | "description" | "task_status" | "assigned_user"
>;

export default function TaskCard({
  id,
  title,
  description,
  task_status,
  assigned_user,
}: TaskCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
    mutate("/api/tasks");
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold">{title}</h2>

        {task_status && (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
            {task_status.name}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}

      <div className="mt-3 text-sm text-gray-500">
        担当者：{assigned_user?.name ?? "未設定"}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white"
          onClick={() => router.push(`/tasks/${id}/edit`)}
        >
          編集
        </button>

        <button
          className="rounded bg-red-500 px-3 py-1 text-white"
          onClick={handleDelete}
        >
          削除
        </button>
      </div>
    </div>
  );
}
