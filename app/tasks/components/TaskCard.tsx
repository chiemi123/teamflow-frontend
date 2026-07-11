// app/tasks/components/TaskCard.tsx

import { apiFetch } from "@/lib/api/client";
import { updateTaskStatus } from "@/lib/api/tasks";
import { Task, TaskStatus } from "@/types/task";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

type TaskCardProps = {
  task: Task;
  taskStatuses: TaskStatus[];
  mutateKey?: string;
};

export default function TaskCard({
  task,
  taskStatuses,
  mutateKey = "/api/tasks",
}: TaskCardProps) {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    await apiFetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    await mutate(mutateKey);
  };

  const handleStatusChange = async (statusId: number) => {
    try {
      setIsUpdatingStatus(true);

      await updateTaskStatus(task.id, statusId);

      await mutate(mutateKey);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="break-words text-lg font-bold">{task.title}</h2>

        {task.task_status && (
          <span className="w-fit rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
            {task.task_status.name}
          </span>
        )}
      </div>

      {task.description && (
        <p className="mt-2 break-words text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mt-3 text-sm text-gray-500">
        担当者：{task.assigned_user?.name ?? "未設定"}
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          ステータス
        </label>

        <select
          className="w-full rounded border px-3 py-2 text-sm"
          value={task.status_id}
          disabled={isUpdatingStatus}
          onChange={(e) => handleStatusChange(Number(e.target.value))}
        >
          {taskStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          className="w-full rounded bg-blue-500 px-3 py-2 text-white sm:w-auto"
          onClick={() => router.push(`/tasks/${task.id}/edit`)}
        >
          編集
        </button>

        <button
          className="w-full rounded bg-red-500 px-3 py-2 text-white sm:w-auto"
          onClick={handleDelete}
        >
          削除
        </button>
      </div>
    </div>
  );
}
