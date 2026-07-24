// [id]/edit/ProjectEditForm.tsx

"use client";

import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getProject, updateProject } from "@/lib/api/projects";
import { SingleProjectResponse } from "@/types/project";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type ProjectEditFormProps = {
  projectId: string;
};

export default function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const router = useRouter();
  const idNumber = Number(projectId);

  const isValidProjectId =
    Number.isInteger(idNumber) && idNumber > 0;

  // SWR の型も ProjectResponse に統一
  const { data, error, isLoading } = useSWR<SingleProjectResponse>(
    `/api/projects/${idNumber}`,
    () => getProject(idNumber),
  );

  // フォーム用 state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // SWR 取得後に初期値を state にセット
  // データ取得後に初期値を state にセット
  useEffect(() => {
    if (data?.data) {
      setName(data.data.name);
      setDescription(data.data.description ?? "");
    }
  }, [data]);

  if (!isValidProjectId) {
    return <ErrorState message="無効なプロジェクトIDです" />;
  }

  // 読み込み中 / エラー制御
  if (isLoading) return <Loading message="プロジェクト読み込み中..." />;
  if (error) return <ErrorState message="データ取得に失敗しました" />;
  if (!data?.data) return <ErrorState message="プロジェクトが見つかりません" />;

  // 更新処理
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      await updateProject(idNumber, { name, description });
      router.push("/projects"); // 更新成功 → 一覧へ
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("更新に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">プロジェクト編集</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {formError && <p className="text-red-500">{formError}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
}
