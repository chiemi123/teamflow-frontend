// [id]/edit/TaskEditForm.tsx
"use client";

import { TaskAttachments } from "@/components/tasks/TaskAttachments";
import ErrorState from "@/components/ui/ErrorState";
import Loading from "@/components/ui/Loading";
import { isApiError } from "@/lib/api/errors";
import { getTask, updateTask } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  taskId: string;
};

export default function TaskEditForm({ taskId }: Props) {
  const { data, error, isLoading } = useSWR(`/api/tasks/${taskId}`, () =>
    getTask(Number(taskId)),
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title ?? "");
      setDescription(data.data.description ?? "");
      setDueDate(data.data.due_date ?? "");
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
        due_date: dueDate || null,
      });

      router.push(`/tasks/${taskId}`);
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 403) {
          setSubmitError("権限がありません");
        } else if (err.status === 422) {
          setSubmitError("入力内容を確認してください");
        } else {
          setSubmitError(err.message || "タスク更新に失敗しました");
        }
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("タスク更新に失敗しました");
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
    return <ErrorState message="タスク情報の取得に失敗しました。" />;
  }

  const task = data?.data;

  if (!task) {
    return <ErrorState message="タスクが見つかりませんでした。" />;
  }

  if (!task.permissions.can_update) {
    return <ErrorState message="このタスクを編集する権限がありません。" />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
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

        <div>
          <label className="block mb-1 font-medium">期限</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2 sm:w-auto"
          />
        </div>

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white sm:w-auto"
        >
          {saving ? "更新中..." : "更新"}
        </button>
      </form>
      <TaskAttachments taskId={Number(taskId)} />
    </div>
  );
}
