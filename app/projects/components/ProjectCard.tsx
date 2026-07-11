//ProjectCard.tsx

import { apiFetch } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/useUser";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

type ProjectCardProps = Pick<Project, "id" | "name" | "description">;

export default function ProjectCard({
  id,
  name,
  description,
}: ProjectCardProps) {
  const router = useRouter();
  const { user } = useUser();

  // ユーザーが編集・削除できるかチェック（Owner または Admin）
  const canEdit = user?.can_edit_project;
  const canDelete = user?.can_delete_project;

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    await apiFetch(`/api/projects/${id}`, { method: "DELETE" });
    await mutate("/api/projects"); // 一覧を再取得
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-bold">{name}</h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description ?? ""}</p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          className="w-full rounded bg-gray-600 px-3 py-2 text-white sm:w-auto"
          onClick={() => router.push(`/projects/${id}`)}
        >
          詳細
        </button>

        {canEdit && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => router.push(`/projects/${id}/edit`)}
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
