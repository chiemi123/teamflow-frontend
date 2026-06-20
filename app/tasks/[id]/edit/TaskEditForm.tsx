// [id]/edit/TaskEditForm.tsx
"use client";

import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { getTask, updateTask } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import TaskComments from "@/components/tasks/TaskComments";

type Props = {
  taskId: string;
};

export default function TaskEditForm({ taskId }: Props) {
  const { data, error, isLoading } = useSWR(`/api/tasks/${taskId}`, () =>
    getTask(Number(taskId)),
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title ?? "");
      setDescription(data.data.description ?? "");
    }
  }, [data]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError("");

    try {
      await updateTask(Number(taskId), {
        title,
        description,
      });

      router.push("/tasks");
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };

      if (error?.status === 403) {
        setSubmitError("権限がありません");
      } else if (error?.status === 422) {
        setSubmitError("入力内容を確認してください");
      } else {
        setSubmitError(error?.message || "タスク更新に失敗しました");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <Loading message="タスク読み込み中..." />;
  }

  if (saving) {
    return <Loading message="タスク更新中..." />;
  }

  if (error) {
    return <ErrorState message="タスクが見つかりませんでした。" />;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">タスク編集</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">タイトル</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
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

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {saving ? "更新中..." : "更新"}
        </button>

      </form>
      <TaskComments taskId={Number(taskId)} />
    </div>
  );
}
